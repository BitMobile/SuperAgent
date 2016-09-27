﻿var checkOrderReason;
var checkVisitReason;
var orderEnabled;
var returnEnabled;
var encashmentEnabled;
var forwardIsntAllowed;
var obligateNumber;
var WeSetNexVis;
var CurrMerop;
var IdNext;

function OnLoading() {
	checkOrderReason = false;
	checkVisitReason = false;
	WeSetNexVis	=	false;
	orderEnabled = OptionAvailable("SkipOrder");
	returnEnabled = OptionAvailable("SkipReturn");
	encashmentEnabled = OptionAvailable("SkipEncashment") && $.sessionConst.encashEnabled;

	if ($.sessionConst.NOR && NotEmptyRef($.workflow.visit.Plan) && OrderExists($.workflow.visit)==false && orderEnabled)
		checkOrderReason = true;
	if ($.sessionConst.UVR && IsEmptyValue($.workflow.visit.Plan))
		checkVisitReason = true;
}

function ChoseFromCatalog(Name,NextVis){
	var tabelName = "";
	var startKey = NextVis.Merop.TypeMeropr;
	tabelName = "Catalog_MeropType";
	var query = new Query("Select Id,Description From "+tabelName+" UNION Select '@ref["+tabelName+"]:00000000-0000-0000-0000-000000000000','—'");
	if (NextVis != null) {
		Dialog.Choose("#select_answer#"
		        , query.Execute()
						,	startKey
		        , SaveAnswerCatalog);
	}
}
function SaveAnswerCatalog(state, args){
	objMerop = CurrMerop.GetObject();
	objMerop.TypeMeropr = args.Result;
	objMerop.Save();
	$.nextVisitType.Text = args.Result.Description;
	Workflow.Refresh([]);
}

function GetNextVisit(outlet){
	var q = new Query("SELECT Id, PlanDate, Merop FROM Document_MobileAppPlanVisit WHERE Outlet=@outlet AND DATE(PlanDate)>=DATE(@date) AND Id=@IdO AND Transformed=0 LIMIT 1");
	q.AddParameter("IdO", IdNext);
	q.AddParameter("outlet", outlet);
	q.AddParameter("date", DateTime.Now.Date);
	var res = q.Execute();
	if (res.Next())
		return res;
	else
		return null;

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

function OptionAvailable(option) {
	var q = new Query("SELECT Value FROM USR_WorkflowSteps WHERE Value=0 AND Skip=@skip");
	q.AddParameter("skip", option);
	if (q.ExecuteScalar() == null)
		return false;
	else
		return true;
}

function SetDeliveryDate(order, control) {
    Dialogs.ChooseDateTime(order, "DeliveryDate", control, DeliveryDateCallBack, Translate["#deliveryDate#"]);
}

function FormatDate(value, format) {
	if (value != null)
		value = value.ToString();
	if (String.IsNullOrEmpty(value) || IsEmptyValue(value))
		return "—";
	else
		return Format("{0:" + format + "}", Date(value));
}

function DoSelect(outlet, attribute, control, title) {
	Dialogs.DoChoose(null, outlet, attribute, control, SelectCallBack, title);
}

function SelectCallBack(state, args) {
	AssignDialogValue(state, args);
	Workflow.Refresh([]);
}

function SetnextVisitDate(nextVisit, control){
	if (String.IsNullOrEmpty(nextVisit.Id))
		var nextDate = DateTime.Now;
	else
		var nextDate = nextVisit.PlanDate;
	Dialogs.ChooseDateTime(nextVisit, "PlanDate", control, NextDateHandler, Translate["#nextVisitDate#"]); //nextDate, NextDateHandler, [nextVisit, control]);
}

function GetOrderControlValue() {
    //var orderFillCheck = DB.Current.Catalog.MobileApplicationSettings.SelectBy("Code", "NOR").First();
    var q = new Query("SELECT LogicValue FROM Catalog_MobileApplicationSettings WHERE Code='ControlOrderReasonEnabled'");
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

function CountDoneTasks(visit) {
	var query = new Query;

	var outlet = "";

	if ($.workflow.name == "Visit"){
		query.AddParameter("outlet", GlobalWorkflow.GetOutlet());
		outlet = " AND DT.Outlet=@outlet ";
	}

	query.Text = "SELECT O.Description AS Outlet, DT.Id, DT.TextTask, DT.EndPlanDate, DT.ExecutionDate " +
		" FROM Document_Task DT " +
		" JOIN Catalog_Outlet O ON DT.Outlet=O.Id " +
		" WHERE DT.Status=1 " +
		" AND DATE(ExecutionDate)=DATE('now', 'localtime') " + outlet +
		" ORDER BY DT.ExecutionDate desc, O.Description";

	return query.ExecuteCount();
}

function CountTasks(outlet) {
	var q = new Query;

	var outlet = "";

	if ($.workflow.name == "Visit"){
		q.AddParameter("outlet", GlobalWorkflow.GetOutlet());
		outlet = " AND DT.Outlet=@outlet ";
	}

	q.Text = "SELECT O.Description AS Outlet, DT.Id, DT.TextTask, DT.EndPlanDate " +
		" FROM Document_Task DT " +
		" JOIN Catalog_Outlet O ON DT.Outlet=O.Id " +
		" WHERE ((Status=0 AND DATE(StartPlanDate)<=DATE('now', 'localtime')) " +
		" OR " +
		" (Status=1 AND DATE(ExecutionDate)=DATE('now', 'localtime'))) " + outlet +
		" ORDER BY DT.EndPlanDate, O.Description";

	return q.ExecuteCount();
}

function GetOrderSUM(order) {
    var query = new Query("SELECT FormatNumber(\"{0:F2}\",SUM(Qty*Total)) FROM Document_Order_SKUs WHERE Ref = @Ref");
    query.AddParameter("Ref", order);
    var sum = query.ExecuteScalar() || 0;
    return sum;
}

function GetReturnSum(returnDoc) {
	var query = new Query("SELECT FormatNumber(\"{0:F2}\",SUM(Qty*Total)) FROM Document_Return_SKUs WHERE Ref = @Ref");
	query.AddParameter("Ref", returnDoc);
	var sum = query.ExecuteScalar() || 0;
	return sum;
}

function AskEndVisit(order, visit, wfName) {
	if ($.nextVisit==null) {
		Dialog.Alert(Translate["#visit_end_question#"], CheckAndCommit, [order, visit, wfName], Translate["#end#"], Translate["#go_back#"]);
	}else {
		//objMerop = CurrMerop.GetObject();
		//Dialog.Message(CurrMerop.Description);
		//Dialog.Message(CurrMerop.TypeMeropr);
		if (CurrMerop.Description == null ||CurrMerop.Description == "" || CurrMerop.TypeMeropr == null || CurrMerop.TypeMeropr == "@ref[Catalog_MeropType]:00000000-0000-0000-0000-000000000000") {
						Dialog.Message("Установите цель и тип следующего мероприятие");
		}else {
			Dialog.Alert(Translate["#visit_end_question#"], CheckAndCommit, [order, visit, wfName], Translate["#end#"], Translate["#go_back#"]);
		}
	}
}

function CheckAndCommit(state, args) {
	if (args.Result == 0) {
		order = state[0];
		visit = state[1];
		wfName = state[2];
	  visit = visit.GetObject();
		visit.EndTime = DateTime.Now;
		var MeropRef = visit.FactMerop;
		var MeropObj = MeropRef.GetObject();
		MeropObj.DateStart = visit.StartTime;
		MeropObj.DateEnd = visit.EndTime;
		MeropObj.Coord = visit.Lattitude.ToString() + " " + visit.Longitude.ToString();
    if (OrderExists(visit.Id)) {
        order.GetObject().Save();
    }
    CreateQuestionnaireAnswers();
    visit.Save();
		MeropObj.Save();
		var existorno = new Query("Select type From sqlite_master where name = 'UT_answerQuest' And type = 'table'");
		var exorno = existorno.ExecuteCount();
		if (exorno > 0) {
			DB.TruncateTable("answerQuest");
		}
		$.AddGlobal("WeNeedSync",true);
		IdNext = "";
    Workflow.Commit();
	}
}


//--------------------------internal functions--------------


function NextDateHandler(state, args){
	//Dialog.Message(args.Result);
	var newVistPlan = state[0];
	if (args.Result > DateTime.Now) {
		if (newVistPlan.Id==null && CurrMerop != null){
			newVistPlan = DB.Create("Document.MobileAppPlanVisit");
			newVistPlan.SR = $.common.UserRef;
			newVistPlan.Outlet = $.workflow.outlet;
			newVistPlan.Transformed = false;
			newVistPlan.Date = DateTime.Now;
			var newMerop = DB.Create("Catalog.Meropriyat");
			newMerop.DO = $.workflow.outlet;
			//newMerop.DateStart = args.Result;
			//newMerop.DateEnd = args.Result;
			var q1 = new Query("Select Id From Enum_TypeMeropPlan Where Name = 'Plan'");
//			if (IsEmptyValue($.workflow.visit.Plan)) {
				q1.AddParameter("planor","Plan");
//			}else {
//				q1.AddParameter("planor","UnPlan");
//			}

			newMerop.TypeMerop = q1.ExecuteScalar();
			newMerop.DatePlan = args.Result;
			newMerop.SR = $.common.UserRef;

			newMerop.Save();
			CurrMerop = newMerop.Id;
			newVistPlan.Merop = newMerop.Id;
		}
		else
			newVistPlan = newVistPlan.Id.GetObject();

		newVistPlan.PlanDate = args.Result;
		newVistPlan.Save();
		IdNext = newVistPlan.Id;
		WeSetNexVis = true;
	}else {
		Dialog.Message("Невозможно запланировать мероприятие на прошедшие время");
	}
	Workflow.Refresh([]);
}

function SetGoal(){
	objMerop = CurrMerop.GetObject();
	objMerop.Description = $.nextVisitGoal.Text;
	objMerop.Save();
	Workflow.Refresh([]);
}

function DeliveryDateCallBack(state, args){
	AssignDialogValue(state, args);
	$.deliveryDate.Text = Format("{0:D}", Date(args.Result));

}

function VisitIsChecked(visit,nextVisit) {

	var result;
	obligateNumber = parseInt(0);

		if (nextVisit != null && (nextVisit.Merop.Description=="" || nextVisit.Merop.Description==null)) {
			obligateNumber = obligateNumber + 1;
		}
		if (nextVisit != null && (nextVisit.Merop.TypeMeropr=="@ref[Catalog_MeropType]:00000000-0000-0000-0000-000000000000" || nextVisit.Merop.TypeMeropr==null)) {
			obligateNumber = obligateNumber + 1;
		}

    if (checkOrderReason && visit.ReasonForNotOfTakingOrder.EmptyRef()){
    	obligateNumber = obligateNumber + 1;
    }
    if (checkVisitReason && visit.ReasonForVisit.EmptyRef()){
    	obligateNumber = obligateNumber + 1;
    }
    if (obligateNumber == 0)
        result= true;
    else
    	result = false;

    return result;
}

function DialogCallBack(control, key){
	control.Text = key;
}

function ShowQuestionnaires() {
	var noQuestQuery = new Query("SELECT Value FROM USR_WorkflowSteps WHERE Skip = @SkipQuestions");
	noQuestQuery.AddParameter("SkipQuestions", "SkipQuestions");
	var noQuest = noQuestQuery.ExecuteScalar();

	var noSKUQuestQuery = new Query("SELECT Value FROM USR_WorkflowSteps WHERE Skip = @SkipSKUs");
	noSKUQuestQuery.AddParameter("SkipSKUs", "SkipSKUs");
	var noSKUQuest = noSKUQuestQuery.ExecuteScalar();

	if ((noQuest && noSKUQuest))
		return false;
	else
		return true;
}

function NoTasks(skipTasks) {
	var noTaskQuery = new Query("SELECT Value FROM USR_WorkflowSteps WHERE Skip = @SkipTask");
	noTaskQuery.AddParameter("SkipTask", "SkipTask");
	var noTask = noTaskQuery.ExecuteScalar();
	if (noTask)
		return false;
	else
		return true;
}

function FormatOutput(value) {
	if (String.IsNullOrEmpty(value) || IsEmptyValue(value))
		return "—";
	else
		return value;
}


//------------------------------Questionnaires handlers------------------


function CreateQuestionnaireAnswers() {
	var q = new Query("SELECT DISTINCT Q.Question, Q.SKU AS SKU, Q.Description, Q.Answer, Q.HistoryAnswer, Q.AnswerDate " +
			", D.Number, D.Id AS Questionnaire, D.Single, A.Id AS AnswerId " +
			"FROM USR_SKUQuestions Q " +
			"JOIN Document_Questionnaire_SKUs DS ON Q.SKU=DS.SKU " +
			"JOIN Document_Questionnaire_SKUQuestions DQ ON Q.Question=DQ.ChildQuestion AND DS.Ref=DQ.Ref " +
			"JOIN USR_Questionnaires D ON DQ.Ref=D.Id AND D.Single=Q.Single " +
			"LEFT JOIN Catalog_Outlet_AnsweredQuestions A ON A.Question=Q.Question AND A.Questionaire=DQ.Ref " +
			"AND A.SKU=Q.SKU " +
			"AND A.Ref=@outlet " +
			"WHERE Q.Answer!='' AND RTRIM(Q.Answer) IS NOT NULL " +
			"AND (Q.ParentQuestion='@ref[Catalog_Question]:00000000-0000-0000-0000-000000000000' " +
			"OR Q.ParentQuestion IN (SELECT Question FROM USR_SKUQuestions WHERE (Answer='Yes' OR Answer='Да')))" +
			"UNION " +
			"SELECT DISTINCT Q.Question, NULL AS SKU, Q.Description, Q.Answer, Q.HistoryAnswer, Q.AnswerDate" +
			", D.Number, D.Id AS Questionnaire, D.Single, A.Id AS AnswerId " +
			"FROM USR_Questions Q " +
			"JOIN Document_Questionnaire_Questions DQ ON Q.Question=DQ.ChildQuestion " +
			"JOIN USR_Questionnaires D ON DQ.Ref=D.Id AND D.Single=Q.Single " +
			"LEFT JOIN Catalog_Outlet_AnsweredQuestions A ON A.Question=Q.Question AND A.Questionaire=DQ.Ref " +
			"AND A.SKU='@ref[Catalog_SKU]:00000000-0000-0000-0000-000000000000'" +
			"AND A.Ref=@outlet " +
			"WHERE Q.Answer!='' AND RTRIM(Q.Answer) IS NOT NULL " +
			"AND (Q.ParentQuestion='@ref[Catalog_Question]:00000000-0000-0000-0000-000000000000' " +
			"OR Q.ParentQuestion IN (SELECT Question FROM USR_Questions WHERE (Answer='Yes' OR Answer='Да')))");
	q.AddParameter("outlet", $.workflow.outlet);
	var answers = q.Execute();

	while (answers.Next()) {
		if (answers.Answer!=answers.HistoryAnswer){
			if (answers.SKU!=null){
				var p = DB.Create("Document.Visit_SKUs");
				p.SKU = answers.SKU;
			}
			else
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
					if (answers.SKU!=null)
						a.SKU = answers.SKU;
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
}
