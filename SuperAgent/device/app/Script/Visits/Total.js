
function GetNextVisit(outlet){
	var q = new Query("SELECT Id, PlanDate FROM Document_MobileAppPlanVisit WHERE Outlet=@outlet AND DATE(PlanDate)>=DATE(@date) AND Transformed=0 LIMIT 1");
	q.AddParameter("outlet", outlet);
	q.AddParameter("date", DateTime.Now.Date);
	var res = q.Execute();
	res.Next();	
	return res;
	
}

function OrderCheckRequired(visit, wfName) {
    if (visit.Plan.EmptyRef()==false && GetOrderControlValue() && OrderExists(visit) == false)
        return true;
    else
        return false;
}

function OrderExists(visit) {
    //var p = DB.Current.Document.Order.SelectBy("Visit", visit.Id).First();
    var q = new Query("SELECT Id FROM Document_Order WHERE Visit=@visit");
    q.AddParameter("visit", visit);
    var p = q.ExecuteScalar();
    if (p == null)
        return false;
    else
        return true;
}

function SetDeliveryDate(order, control) {
    Dialogs.ChooseDateTime(order, "DeliveryDate", control, null);
}

function DoSelect(outlet, attribute, control) {
	Dialogs.DoChoose(null, outlet, attribute, control, null);
}

function SetnextVisitDate(nextVisit, control){
	if (String.IsNullOrEmpty(nextVisit.Id))
		var nextDate = DateTime.Now;
	else
		var nextDate = nextVisit.PlanDate;
	Dialogs.ChooseDateTime(nextVisit, "PlanDate", control, NextDateHandler); //nextDate, NextDateHandler, [nextVisit, control]);
}

function GetOrderControlValue() {
    //var orderFillCheck = DB.Current.Catalog.MobileApplicationSettings.SelectBy("Code", "NOR").First();
    var q = new Query("SELECT Use FROM Catalog_MobileApplicationSettings WHERE Code='NOR'");
    var uvr = q.ExecuteScalar();

    if (uvr == null)
        return false;
    else {
        if (parseInt(uvr) == parseInt(0))
            return false
        else
            return true;
    }
}

function VisitReasonCheckrequired(wfName, visit) {
    if (visit.Plan.EmptyRef() && GetUVRvalue())
        return true
    else
        return false;
}

function GetUVRvalue() {
    //var uvr = DB.Current.Catalog.MobileApplicationSettings.SelectBy("Code", "UVR").First();
    var q = new Query("SELECT Use FROM Catalog_MobileApplicationSettings WHERE Code='UVR'");
    var uvr = q.ExecuteScalar();
    if (uvr == null)
        return false;
    else {
        if (parseInt(uvr) == parseInt(0))
            return false
        else
            return true;
    }
}

function CountAnswers(visitId, skuAnsw) {
    var query = new Query("SELECT Id FROM Document_Visit_Questions WHERE Ref=@ref");
    query.AddParameter("ref", visitId);
    var q = query.ExecuteCount();
    return (q + skuAnsw);
}

function CountDoneTasks(visit) {
    var query = new Query("SELECT Id FROM Document_Visit_Task WHERE Ref=@ref AND Result=@result");
    query.AddParameter("ref", visit);
    query.AddParameter("result", true);
    return query.ExecuteCount();
}

function CountTasks(outlet) {
    var query = new Query("SELECT Id FROM Document_Task WHERE PlanDate >= @planDate AND Outlet = @outlet");
    query.AddParameter("outlet", outlet);
    query.AddParameter("planDate", DateTime.Now.Date);
    return query.ExecuteCount();
}

function GetOrderSUM(order) {
    var query = new Query("SELECT SUM(Qty*Total) FROM Document_Order_SKUs WHERE Ref = @Ref");
    query.AddParameter("Ref", order);
    var sum = query.ExecuteScalar();
    return FormatValue(sum);
}

function CheckAndCommit(order, visit, wfName) {

	if (VisitIsChecked(visit, order, wfName)) {
        visit = visit.GetObject();
    	visit.EndTime = DateTime.Now;

        if (OrderExists(visit.Id)) {
            order.GetObject().Save();
        }
        
        CreateQuestionnaireAnswers();
        
        visit.Save();
        Workflow.Commit();
    }
    else
        Dialog.Message(Translate["#messageNulls#"]);

}


//--------------------------internal functions--------------


function NextDateHandler(state, args){

	var newVistPlan = state[0];

	if (newVistPlan.Id==null){
		newVistPlan = DB.Create("Document.MobileAppPlanVisit");
		newVistPlan.SR = $.common.UserRef;	
		newVistPlan.Outlet = $.workflow.outlet;
		newVistPlan.Transformed = false;
		newVistPlan.Date = DateTime.Now;
	}
	else
		newVistPlan = newVistPlan.Id.GetObject();
	newVistPlan.PlanDate = args.Result;
	newVistPlan.Save();
	
	Workflow.Refresh([]);
}


function VisitIsChecked(visit, order, wfName) {
    if (OrderCheckRequired(visit, wfName) && visit.ReasonForNotOfTakingOrder.EmptyRef())
        return false;
    else {
        if (VisitReasonCheckrequired(wfName, visit) && visit.ReasonForVisit.EmptyRef())
            return false;
        else
            return true;
    }
}

function DialogCallBack(control, key){
	control.Text = key;
}

function NoQuestionnaires(noQuest, noSKUQuest) {
	if ((noQuest && noSKUQuest) || (noQuest==null && noSKUQuest==null))
		return false;
	else
		return true;
}

function NoTasks(skipTasks) {
	if (skipTasks)
		return false;
	else
		return true;
}


//------------------------------Questionnaires handlers------------------


function CreateQuestionnaireAnswers() {	
	var q = new Query("SELECT DISTINCT Q.Question, Q.Description, Q.Answer, Q.AnswerDate" +
			", D.Number, D.Id AS Questionnaire, D.Single, A.Id AS AnswerId " +
			"FROM USR_Questions Q " +
			"JOIN Document_Questionnaire_Questions DQ ON Q.Question=DQ.ChildQuestion " +
			"JOIN USR_Questionnaires D ON DQ.Ref=D.Id " +
			"LEFT JOIN Catalog_Outlet_AnsweredQuestions A ON A.Question=Q.Question AND A.Questionaire=DQ.Ref " +
			"AND A.SKU='@ref[Catalog_SKU]:00000000-0000-0000-0000-000000000000'" +
			"AND A.Ref=@outlet " +
			"WHERE Q.Answer!='' AND RTRIM(Q.Answer) IS NOT NULL");
	q.AddParameter("outlet", $.workflow.outlet);
	var answers = q.Execute();
	
	while (answers.Next()) {
		var p = DB.Create("Document.Visit_Questions");
		p.Ref = $.workflow.visit;
		p.Question = answers.Question;
		p.Answer = answers.Answer;			
		p.AnswerDate = answers.AnswerDate;
		p.Questionnaire = answers.Questionnaire;
		p.Save();
		if (answers.Single==1){
			var a;
			if (answers.AnswerId == null){
				a = DB.Create("Catalog.Outlet_AnsweredQuestions");
				a.Ref = $.workflow.outlet;
				a.Questionaire = answers.Questionnaire;
				a.Question = answers.Question;
//				if (answers.SKU!=null)
//					a.SKU = answers.SKU;									
			}
			else{
				a = answers.AnswerId;
				a = a.GetObject();
			}
			a.Answer = answers.Answer;
			a.AnswerDate = answers.AnswerDate;
			a.Save();
		}
	}
}

function FillQuestionnaires() {
	
	var str = CreateCondition($.workflow.questionnaires, " D.Id ");
	
	if (String.IsNullOrEmpty(str))
		return false;
	
	var q = new Query("SELECT D.Single, VQ.Id AS AnswerId, NULL AS SKU, Q.ChildQuestion AS Question, Q.Ref AS Questionnaire, VQ.AnswerDate, VQ.Answer, VQ.Ref AS Visit " +
			" FROM Document_Visit_Questions VQ " +
			" JOIN Document_Questionnaire_Questions Q ON VQ.Question=Q.ChildQuestion " +
			" JOIN Document_Questionnaire D ON Q.Ref=D.Id " +
			" WHERE VQ.Ref=@visit AND " + str + 
			" UNION ALL " +
			" SELECT D.Single, VQ.Id AS AnswerId, S.SKU, Q.ChildQuestion AS Question, Q.Ref AS Questionnaire, VQ.AnswerDate, VQ.Answer, VQ.Ref AS Visit  " +
			" FROM Document_Visit_SKUs VQ " +
			" JOIN Document_Questionnaire_SKUQuestions Q ON VQ.Question=Q.ChildQuestion " +
			" JOIN Document_Questionnaire_SKUs S ON Q.Ref=S.Ref AND S.SKU=VQ.SKU " +
			" JOIN Document_Questionnaire D ON Q.Ref=D.Id " +
			" WHERE VQ.Ref=@visit AND " + str + " ORDER BY SKU, ChildQuestion ");
	
	q.AddParameter("emptySKURef", DB.EmptyRef("Catalog_SKU"));
	q.AddParameter("outlet", $.workflow.outlet);
	q.AddParameter("visit", $.workflow.visit);
	var res = q.Execute().Unload();
	
	
	var lastSKU;
	var lastQuestion;
	
	while (res.Next()) {
		if (NewQuestion(lastSKU, res.SKU, lastQuestion, res.Question))
			var answerObj = res.AnswerId.GetObject();
		else{			
			var sku = res.SKU;
			if (sku==null)
				sku = DB.EmptyRef("Catalog_SKU");
			
			if (sku.ToString()==(DB.EmptyRef("Catalog_SKU")).ToString())
				var answerObj = DB.Create("Document.Visit_Questions");
			else{
				var answerObj = DB.Create("Document.Visit_SKUs");
				answerObj.SKU = sku; 
			}
			
			answerObj.Ref = res.Visit;
			answerObj.Question = res.Question;
			answerObj.Answer = res.Answer;
			answerObj.AnswerDate = res.Answerdate;
		}
		answerObj.Questionnaire = res.Questionnaire;
		answerObj.Save();
		if (res.Single==1){
			 
			var resSKU = res.SKU; 
			if (resSKU==null)
				resSKU = DB.EmptyRef("Catalog_SKU");
			
			var q2 = new Query("SELECT A.Id FROM Catalog_Outlet_AnsweredQuestions A " +
					" JOIN Document_Questionnaire_Schedule S ON A.Questionaire=S.Ref " +
					" WHERE A.Questionaire=@questionnaire " +
					" AND A.Ref=@outlet AND A.Question=@question AND A.SKU=@sku");
			q2.AddParameter("questionnaire", res.Questionnaire);
			q2.AddParameter("outlet", $.workflow.outlet);
			q2.AddParameter("sku", resSKU);
			q2.AddParameter("question", res.Question);
			var outletAnswer = q2.ExecuteScalar();
			
			if (outletAnswer==null){
				outletAnswer = DB.Create("Catalog.Outlet_AnsweredQuestions");
				outletAnswer.Ref = $.workflow.outlet;
				outletAnswer.Questionaire = res.Questionnaire;
				outletAnswer.Question = res.Question;
				if (res.SKU!=null)
					outletAnswer.SKU = res.SKU;
			}
			else{
				outletAnswer = outletAnswer.GetObject();
			}
			outletAnswer.Answer = res.Answer;
			outletAnswer.AnswerDate = res.AnswerDate;
			outletAnswer.Save();			
		}
		lastSKU = res.SKU;
		lastQuestion = res.Question;
	}
	
}

function NewQuestion(lastSKU, currSKU, lastQuestion, currQuestion) {
	if (lastSKU==null)
		lastSKU = DB.EmptyRef("Catalog_SKU");
	if (currSKU==null)
		currSKU = DB.EmptyRef("Catalog_SKU");
	if (lastQuestion==null)
		lastQuestion = DB.EmptyRef("Catalog_Question");

	if (lastSKU.ToString()==DB.EmptyRef("Catalog_SKU").ToString()){
		if (lastQuestion.ToString()!=currQuestion.ToString())
			return true;
	}
	else{
		if (lastQuestion.ToString()!=currQuestion.ToString() || lastSKU.ToString()!=currSKU.ToString())
			return true;
	}
	return false;
}

function CreateCondition(list, field) {
	var str = "";
	var notEmpty = false;
	
	for ( var quest in list) {	
		if (String.IsNullOrEmpty(str)==false){
			str = str + ", ";		
		}
		str = str + " '" + quest.ToString() + "' ";		
		notEmpty = true;
	}
	if (notEmpty){
		str = field + " IN ( " + str  + ") ";
	}
	
	return str;
}

