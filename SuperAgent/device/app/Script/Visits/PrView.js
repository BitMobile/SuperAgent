
var checkOrderReason;
var checkVisitReason;
var orderEnabled;
var returnEnabled;
var encashmentEnabled;
var forwardIsntAllowed;
var obligateNumber;
var ObjectPresentation;
var OnPresentation;
var PathForPick;
var GetPreset;
var report;
var StartTime;

function OnLoad(){
	//Dialog.Debug($.param2);
//Dialog.Debug($.param1);
StartTime = DateTime.Now;

}

function GetPrivateImage(pictI, pictB) {
	var r = "/shared/catalog.slides/" + pictB.Id + "/"
	    + pictB.Picture + ".jpg";
	return r;
}


function GetPrivateImage5(pictI, pictB) {
		var r = "/shared/catalog.slides/" + pictI.Id.ToString() + "/"
	    + pictI.Picture + ".jpg";
	return r;
}


function ActionGetIm(sender, pictID2) {
	ObjectPresentation = "1";
	GetPreset=pictID2;
	Workflow.Refresh([$.snapshotLayout3]);
}


function ActionGetIm2(sender, pictID) {
	pictID2 = pictID;
PathForPick = pictID2.ToString();
Workflow.Refresh([]);
}

function GetImgF(pictID){
	var q = new Query("SELECT V.Id, V.Picture, V.Extension from Catalog_Slides V WHERE V.Id=@PathToPick LIMIT 1");
	q.AddParameter("PathToPick", pictID2);

	var res = q.Execute();
	if (res.Next()){

	var r = "/shared/catalog.slides/" + pictID2.Id.ToString() + "/"
		+ res.Picture + res.Extension;
return r;}
	else {
		return null;}
}

function GetSnapShots() {
		var q = new Query("Select Df.Id, V.Slide  from   Catalog_Presentations_Slides V  INNER JOIN Catalog_Presentations Df  ON  Df.Id = V.Ref GROUP BY Df.Id");
		return q.Execute();
}

function CheckPr(){
	newFile = DB.Create("Document.Visit_ResultPresent");
	newFile.Ref = $.workflow.visit;
	newFile.Presents = GetPreset;
	newFile.Slides = SlidesPick;
	newFile.TemeStart = StartTime;
	newFile.TimeEnd = DateTime.Now;
	newFile.Save();
	StartTime =    DateTime.Now;
	checkOrderReason = false;
	checkVisitReason = false;

	orderEnabled = OptionAvailable("SkipOrder");
	returnEnabled = OptionAvailable("SkipReturn");
	encashmentEnabled = OptionAvailable("SkipEncashment") && $.sessionConst.encashEnabled;

	if ($.sessionConst.NOR && NotEmptyRef($.workflow.visit.Plan) && OrderExists($.workflow.visit)==false && orderEnabled)
		checkOrderReason = true;
	if ($.sessionConst.UVR && IsEmptyValue($.workflow.visit.Plan))
		checkVisitReason = true;
}

function GetSnapShots2() {
		var q = new Query("SELECT V.Id, V.Ref, V.Slide from Catalog_Presentations_Slides V WHERE V.Ref = @Ref ORDER BY V.LineNumber");
  //  WHERE V.Ref=@Ref");
	q.AddParameter("Ref", $.param1);
			return q.Execute();
			if (res.Next()){
					return q.Execute();}
			else {
				return null;}
}

function OnVPresentation(){
if (ObjectPresentation == null){
	return false} else {
 return true

}
}


function OnLoading() {
	checkOrderReason = false;
	checkVisitReason = false;

	orderEnabled = OptionAvailable("SkipOrder");
	returnEnabled = OptionAvailable("SkipReturn");
	encashmentEnabled = OptionAvailable("SkipEncashment") && $.sessionConst.encashEnabled;

	if ($.sessionConst.NOR && NotEmptyRef($.workflow.visit.Plan) && OrderExists($.workflow.visit)==false && orderEnabled)
		checkOrderReason = true;
	if ($.sessionConst.UVR && IsEmptyValue($.workflow.visit.Plan))
		checkVisitReason = true;
}

function GetNextVisit(outlet){
//	Dialog.Debug(outlet);
	var q = new Query("SELECT Id, PlanDate FROM Document_MobileAppPlanVisit WHERE Outlet=@outlet AND DATE(PlanDate)>=DATE(@date) AND Transformed=0 LIMIT 1");
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

function GetReturnSum(returnDoc) {
	var query = new Query("SELECT SUM(Qty*Total) FROM Document_Return_SKUs WHERE Ref = @Ref");
	query.AddParameter("Ref", returnDoc);
	var sum = query.ExecuteScalar();
	return FormatValue(sum);
}

function CheckAndCommit(order, visit, wfName) {

    visit = visit.GetObject();
	visit.EndTime = DateTime.Now;

    if (OrderExists(visit.Id)) {
        order.GetObject().Save();
    }

    CreateQuestionnaireAnswers();

    visit.Save();
    Workflow.Commit();

}

function GetOrderTable(order, outlet, visit) {
    /*var query = new Query("SELECT O.SKU, O.Qty, AMS.Qty FROM Document_Order_SKUs O " +
    		"FULL JOIN Catalog_AssortmentMatrix_SKUs AMS ON O.SKU = AMS.SKU " +
    		"JOIN Catalog_AssortmentMatrix_Outlets AMO ON AMO.Id = AMS.Ref AND AMO.Outlet = @Outlet " +
    		"WHERE Ref = @Ref");*/

	var query = new Query("SELECT O.SKU AS OSKU, ifnull(O.Qty, 0) AS Qty, AMS.Id AS AMSSKU " +
						", CASE WHEN ifnull(AMS.RecOrder, 0) < 0 THEN 0 ELSE ifnull(AMS.RecOrder, 0) END AS RecOrder " +
						" FROM Document_Order_SKUs O " +
						"LEFT JOIN " +

						"	(SELECT DISTINCT S.Id" +
						"		, S.Description" +
						"		, S.CommonStock AS CommonStock" +
						"		, CASE WHEN V.Answer IS NULL THEN U.Description ELSE UB.Description END AS RecUnit" +
						"		, CASE WHEN V.Answer IS NULL THEN U.Id ELSE UB.Id END AS UnitId" +
						"		, CASE WHEN V.Answer IS NULL THEN MS.Qty ELSE (MS.BaseUnitQty-V.Answer) END AS RecOrder" +
						"		, CASE WHEN MS.Qty IS NULL THEN 0 ELSE CASE WHEN (MS.BaseUnitQty-V.Answer)>0 OR (V.Answer IS NULL AND MS.Qty>0) THEN 2 ELSE 1 END END AS OrderRecOrder" +

						"	FROM _Catalog_SKU S " +
						"		JOIN Catalog_UnitsOfMeasure UB ON S.BaseUnit=UB.Id" +
						"		LEFT JOIN Catalog_AssortmentMatrix_Outlets O ON O.Outlet=@outlet" +
						"		JOIN Catalog_AssortmentMatrix_SKUs MS ON S.Id=MS.SKU AND MS.BaseUnitQty IN  (SELECT MAX(SS.BaseUnitQty) FROM Catalog_AssortmentMatrix_SKUs SS  JOIN Catalog_AssortmentMatrix_Outlets OO ON SS.Ref=OO.Ref     WHERE Outlet=@outlet AND SS.SKU=MS.SKU LIMIT 1)" +
						"		LEFT JOIN Catalog_UnitsOfMeasure U ON MS.Unit=U.Id" +
						"		LEFT JOIN USR_SKUQuestions V ON MS.SKU=V.SKU AND V.Question IN (SELECT Id FROM Catalog_Question CQ WHERE CQ.Assignment=@stock)" +

						"	WHERE S.IsTombstone = 0  ORDER BY  OrderRecOrder DESC,  S.Description LIMIT 100) AS AMS ON AMS.Id = O.SKU " +

						"WHERE Ref = @Ref " +

						"UNION " +

						"SELECT O.SKU AS OSKU, ifnull(O.Qty, 0) AS Qty, AMS.Id  AS AMSSKU" +
						", CASE WHEN ifnull(AMS.RecOrder, 0) < 0 THEN 0 ELSE ifnull(AMS.RecOrder, 0) END AS RecOrder " +
						" FROM (SELECT DISTINCT S.Id" +
						"		, S.Description" +
						"		, S.CommonStock AS CommonStock" +
						"		, CASE WHEN V.Answer IS NULL THEN U.Description ELSE UB.Description END AS RecUnit" +
						"		, CASE WHEN V.Answer IS NULL THEN U.Id ELSE UB.Id END AS UnitId" +
						"		, CASE WHEN V.Answer IS NULL THEN MS.Qty ELSE (MS.BaseUnitQty-V.Answer) END AS RecOrder" +
						"		, CASE WHEN MS.Qty IS NULL THEN 0 ELSE CASE WHEN (MS.BaseUnitQty-V.Answer)>0 OR (V.Answer IS NULL AND MS.Qty>0) THEN 2 ELSE 1 END END AS OrderRecOrder" +

						"	FROM _Catalog_SKU S " +
						"		JOIN Catalog_UnitsOfMeasure UB ON S.BaseUnit=UB.Id" +
						"		LEFT JOIN Catalog_AssortmentMatrix_Outlets O ON O.Outlet=@outlet" +
						"		JOIN Catalog_AssortmentMatrix_SKUs MS ON S.Id=MS.SKU AND MS.BaseUnitQty IN  (SELECT MAX(SS.BaseUnitQty) FROM Catalog_AssortmentMatrix_SKUs SS  JOIN Catalog_AssortmentMatrix_Outlets OO ON SS.Ref=OO.Ref     WHERE Outlet=@outlet AND SS.SKU=MS.SKU LIMIT 1)" +
						"		LEFT JOIN Catalog_UnitsOfMeasure U ON MS.Unit=U.Id" +
						"		LEFT JOIN USR_SKUQuestions V ON MS.SKU=V.SKU AND V.Question IN (SELECT Id FROM Catalog_Question CQ WHERE CQ.Assignment=@stock)" +

						"	WHERE S.IsTombstone = 0  ORDER BY  OrderRecOrder DESC,  S.Description LIMIT 100) AS AMS " +
						"LEFT JOIN " +
						"Document_Order_SKUs O ON AMS.Id = O.SKU AND Ref = @Ref " +
						"GROUP BY O.SKU, ifnull(O.Qty, 0), AMS.Id, ifnull(AMS.RecOrder, 0) ");

    query.AddParameter("Ref", order);
    query.AddParameter("outlet", outlet);
    query.AddParameter("stock", DB.Current.Constant.SKUQuestions.Stock);
    query.AddParameter("visit", visit);

    var sum = query.Execute();
    return sum;
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

function DeliveryDateCallBack(state, args){
	AssignDialogValue(state, args);
	$.deliveryDate.Text = Format("{0:D}", Date(args.Result));

}

function VisitIsChecked(visit) {

	var result;
	obligateNumber = parseInt(0);

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
