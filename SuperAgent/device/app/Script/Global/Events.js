﻿// ------------------------ Application -------------------

function OnApplicationInit() {
	SetSessionConstants();
	Indicators.SetIndicators();
}

// ------------------------ Events ------------------------

function OnLoad(screenName) {
	if (screenName == "Outlet_Map.xml") {
		var outlet = Variables["outlet"];
		Variables["map"].AddMarker(outlet.Description, outlet.Lattitude,
				outlet.Longitude, "red");
	} else if (screenName == "ScheduledVisits_Map.xml") {
		PrepareScheduledVisits_Map();
	}
}

function OnWorkflowStart(name) {
	if ($.Exists("workflow"))
		$.Remove("workflow");
	Variables.AddGlobal("workflow", new Dictionary());
	if (name == "Visits" || name == "Outlets" || name=="CreateOrder") {
		GPS.StartTracking();
	}

	if (name == "Visit") {

//			var questionnaires = GetQuestionnairesForOutlet($.outlet);
//			$.workflow.Add("questionnaires", questionnaires);

			CreateQuestionnareTable($.outlet);
			CreateQuestionsTable($.outlet);
			CreateSKUQuestionsTable($.outlet);

			if (parseInt(GetTasksCount()) != parseInt(0))
				$.workflow.Add("skipTasks", false); // нельзя просто взять и присвоить значение переменной!
			else
				$.workflow.Add("skipTasks", true);

			if (parseInt(GetQuestionsCount()) != parseInt(0))
				$.workflow.Add("skipQuestions", false);
			else
				$.workflow.Add("skipQuestions", true);

			if (parseInt(GetSKUQuestionsCount()) != parseInt(0))
				$.workflow.Add("skipSKUs", false);
			else
				$.workflow.Add("skipSKUs", true);
	}

	Variables["workflow"].Add("name", name);

	if (name=="Visit" || name=="CreateOrder" || name=="Order"){

		var checkDropF = new Query("SELECT count(*) FROM sqlite_master WHERE type='table' AND name='USR_Filters'");

		var checkDropFResult = checkDropF.ExecuteScalar();

		if (checkDropFResult == 1) {

			var dropF = new Query("DELETE FROM USR_Filters");

			dropF.Execute();

		} else {

			var createTable = new Query("CREATE TABLE IF NOT EXISTS USR_Filters(Id Text, FilterType Text)");

			createTable.Execute();

		}

	}

}

function OnWorkflowForward(name, lastStep, nextStep, parameters) {
//	if (lastStep == "Order" && nextStep == "EditSKU" && Variables.Exists("AlreadyAdded") == false) {
//		Variables.AddGlobal("AlreadyAdded", true);
//	}
}

function OnWorkflowForwarding(workflowName, lastStep, nextStep, parameters) {

	if (workflowName == "Visit") {

		if (nextStep == "Visit_Tasks") {
			if ($.workflow.skipTasks) {
				if ($.workflow.skipQuestions) {
					if ($.workflow.skipSKUs) {
						Workflow.Action("Skip3", [ outlet ]);
						return false;
					}
					Workflow.Action("Skip2", []);
					return false;
				}
				Workflow.Action("Skip1", []);
				return false;
			}
		}

		if (nextStep == "Questions") {
			if ($.workflow.skipQuestions) {
				if ($.workflow.skipSKUs) {
					Workflow.Action("Skip3", [ outlet ]);
					return false;
				}
				Workflow.Action("Skip2", []);
				return false;
			} else
				Workflow.Action("Skip1", []);
		}

		if (nextStep == "SKUs") {
			if ($.workflow.skipSKUs) {
				Workflow.Action("Skip3", [ outlet ]);
				return false;
			} else
				Workflow.Action("Skip2", []);
		}
	}

	return true;

}

//function OnWorkflowBack(name, lastStep, nextStep) {}

function OnWorkflowFinish(name, reason) {
	$.Remove("finishedWorkflow");
	$.AddGlobal("finishedWorkflow", name);

	if (name == "Visit" || name == "CreateOrder" || name=="Outlets") {
		Variables.Remove("outlet");

		if (Variables.Exists("planVisit"))
			Variables.Remove("planVisit");
		if (Variables.Exists("steps"))
			Variables.Remove("steps");

		GPS.StopTracking();

		Indicators.SetIndicators();
	}

	Variables.Remove("workflow");

	if (name=="Visit" || name=="CreateOrder"){

		var checkDropF = new Query("SELECT count(*) FROM sqlite_master WHERE type='table' AND name='USR_Filters'");

		var checkDropFResult = checkDropF.ExecuteScalar();

		if (checkDropFResult == 1) {

			var dropF = new Query("DELETE FROM USR_Filters");

			dropF.Execute();

		}

	}
}

function OnWorkflowPause(name) {
	Variables.Remove("workflow");
}

// ------------------------ Functions ------------------------

function SetSessionConstants() {
	var planEnbl = new Query("SELECT Use FROM Catalog_MobileApplicationSettings WHERE Code='PlanEnbl'");
	var multStck = new Query("SELECT Use FROM Catalog_MobileApplicationSettings WHERE Code='MultStck'");
	var stckEnbl = new Query("SELECT Use FROM Catalog_MobileApplicationSettings WHERE Code='NoStkEnbl'");
	var orderCalc = new Query("SELECT Use FROM Catalog_MobileApplicationSettings WHERE Code='OrderCalc'");
	var UVR = new Query("SELECT Use FROM Catalog_MobileApplicationSettings WHERE Code='UVR'");
	var NOR = new Query("SELECT Use FROM Catalog_MobileApplicationSettings WHERE Code='NOR'");

	$.AddGlobal("sessionConst", new Dictionary());
	$.sessionConst.Add("PlanEnbl", EvaluateBoolean(planEnbl.ExecuteScalar()));
	$.sessionConst.Add("MultStck", EvaluateBoolean(multStck.ExecuteScalar()));
	$.sessionConst.Add("NoStkEnbl", EvaluateBoolean(stckEnbl.ExecuteScalar()));
	$.sessionConst.Add("OrderCalc", EvaluateBoolean(orderCalc.ExecuteScalar()));
	$.sessionConst.Add("UVR", EvaluateBoolean(UVR.ExecuteScalar()));
	$.sessionConst.Add("NOR", EvaluateBoolean(NOR.ExecuteScalar()));

	var q = new Query("SELECT U.AccessRight, A.Id, A.Code FROM Catalog_MobileAppAccessRights A " +
			" LEFT JOIN Catalog_User_UserRights U ON U.AccessRight=A.Id ");
	var rights = q.Execute();
	while (rights.Next()) {
		if (rights.Code=='000000002'){
			if (rights.AccessRight==null)
				$.sessionConst.Add("editOutletParameters", false);
			else
				$.sessionConst.Add("editOutletParameters", true);
		}
		if (rights.Code=='000000003'){
			if (rights.AccessRight==null)
				$.sessionConst.Add("galleryChoose", false);
			else
				$.sessionConst.Add("galleryChoose", true);
		}
		if (rights.Code=='000000004'){
			if (rights.AccessRight==null)
				$.sessionConst.Add("encashEnabled", false);
			else
				$.sessionConst.Add("encashEnabled", true);
		}
	}

}

function EvaluateBoolean(res){
	if (res == null)
		return false;
	else {
		if (parseInt(res) == parseInt(0))
			return false
		else
			return true;
	}
}

function PrepareScheduledVisits_Map() {
	var visitPlans = Variables["visitPlans"];
	for ( var visitPlan in visitPlans) {
		var outlet = DB.Current.Catalog.Outlet.SelectBy("Id", visitPlan)
				.First();
		if (!isDefault(outlet.Lattitude) && !isDefault(outlet.Longitude)) {
			var query = new Query();
			query.AddParameter("Date", DateTime.Now.Date);
			query.AddParameter("Outlet", outlet.Id);
			query.Text = "select single(*) from Document.Visit where Date.Date == @Date && Outlet==@Outlet";
			var result = query.Execute();
			if (result == null)
				Variables["map"].AddMarker(outlet.Description,
						outlet.Lattitude, outlet.Longitude, "yellow");
			else
				Variables["map"].AddMarker(outlet.Description,
						outlet.Lattitude, outlet.Longitude, "green");
		}
	}
}

function GetTasksCount() {
	var taskQuery = new Query("SELECT COUNT(Id) FROM Document_Task WHERE PlanDate >= date('now','start of day') AND Outlet=@outlet");
	taskQuery.AddParameter("outlet", $.outlet);
	return taskQuery.ExecuteScalar();
}


//-----Questionnaire selection-------

function GetRegionQueryText1() {

	var loop = 1;

	var startSelect = "SELECT 'Catalog_Region', NULL, '@ref[Catalog_OutletParameter]:00000000-0000-0000-0000-000000000000', replace(R" + loop + ".Id, ('@ref[Catalog_Region]:'), '') " +
			"FROM Catalog_Territory T " +
			"JOIN Catalog_Territory_Outlets O ON T.Id=O.Ref AND O.Outlet=@outlet JOIN Catalog_Region R1 ON T.Owner=R1.Id ";
	var recJoin = "";

	var text = startSelect;

	loop = 2;

	while (loop < 11) {
		recJoin = recJoin + " JOIN Catalog_Region " + "R" + loop + " ON R" + (parseInt(loop) - parseInt(1)) + ".Parent=R" + loop + ".Id " ;
		text = text + "UNION " + "SELECT 'Catalog_Region', NULL, '@ref[Catalog_OutletParameter]:00000000-0000-0000-0000-000000000000', REPLACE(R" + loop + ".Id, ('@ref[Catalog_Region]:'), '') " +
				"FROM Catalog_Territory T " +
		"JOIN Catalog_Territory_Outlets O ON T.Id=O.Ref AND O.Outlet=@outlet JOIN Catalog_Region R1 ON T.Owner=R1.Id " + recJoin;
		loop = loop + 1;
	}

	return text;
}

function CreateQuestionnareTable(outlet) {

	var name = "USR_OutletAttributes";
	var q = new Query("SELECT count(*) FROM sqlite_master WHERE type='table' AND name=@name");
	q.AddParameter("name", name);
	var check = q.ExecuteScalar();
	var tableCommand;
	if (parseInt(check) == parseInt(1)) {
		var dropQS = new Query("DELETE FROM " + name);
		dropQS.Execute();
	}
	else{
		var q = new Query("CREATE TABLE " +
				" USR_OutletAttributes (Selector, DataType, AdditionalParameter, Value)");
		q.Execute();
	}

	var q = new Query("INSERT INTO USR_OutletAttributes VALUES ('Enum_OutletStatus', NULL, '@ref[Catalog_OutletParameter]:00000000-0000-0000-0000-000000000000', REPLACE(@value, ('@ref[Enum_OutletStatus]:'), ''))");
	q.AddParameter("value", outlet.OutletStatus);
	q.Execute();

	var q = new Query("INSERT INTO USR_OutletAttributes VALUES ('Catalog_OutletType', NULL, '@ref[Catalog_OutletParameter]:00000000-0000-0000-0000-000000000000', REPLACE(@value, ('@ref[Catalog_OutletType]:'), ''))");
	q.AddParameter("value", outlet.Type);
	q.Execute();

	var q = new Query("INSERT INTO USR_OutletAttributes VALUES ('Catalog_OutletClass', NULL, '@ref[Catalog_OutletParameter]:00000000-0000-0000-0000-000000000000', REPLACE(@value, ('@ref[Catalog_OutletClass]:'), ''))");
	q.AddParameter("value", outlet.Class);
	q.Execute();

	var q = new Query("INSERT INTO USR_OutletAttributes VALUES ('Catalog_Distributor', NULL, '@ref[Catalog_OutletParameter]:00000000-0000-0000-0000-000000000000', REPLACE(@value, ('@ref[Catalog_Distributor]:'), ''))");
	q.AddParameter("value", outlet.Distributor);
	q.Execute();

	var qUser = new Query("SELECT Position FROM Catalog_User LIMIT 1");

	var q = new Query("INSERT INTO USR_OutletAttributes VALUES ('Catalog_Positions', NULL, '@ref[Catalog_OutletParameter]:00000000-0000-0000-0000-000000000000', REPLACE(@value, ('@ref[Catalog_Positions]:'), ''))");
	q.AddParameter("value", qUser.ExecuteScalar());
	q.Execute();

	var q = new Query("INSERT INTO USR_OutletAttributes VALUES ('Catalog_Outlet', NULL, '@ref[Catalog_OutletParameter]:00000000-0000-0000-0000-000000000000', REPLACE(@value, ('@ref[Catalog_Outlet]:'), ''))");
	q.AddParameter("value", outlet);
	q.Execute();

	var q = new Query("INSERT INTO USR_OutletAttributes " +
			"SELECT 'Catalog_OutletParameter', COP.DataType, OP.Parameter, OP.Value FROM Catalog_Outlet_Parameters OP LEFT JOIN Catalog_OutletParameter COP ON OP.Parameter=COP.Id WHERE Ref=@outlet");
	q.AddParameter("outlet", outlet);
	q.Execute();

	var q = new Query("INSERT INTO USR_OutletAttributes " +
			"SELECT 'Catalog_Territory', NULL, '@ref[Catalog_OutletParameter]:00000000-0000-0000-0000-000000000000', REPLACE(Ref, ('@ref[Catalog_Territory]:'), '') FROM Catalog_Territory_Outlets WHERE Outlet=@outlet");
	q.AddParameter("outlet", outlet);
	q.Execute();

	var q = new Query("INSERT INTO USR_OutletAttributes " +
			GetRegionQueryText1());
	q.AddParameter("outlet", outlet);
	q.Execute();


	var tableCommand = Global.CreateUserTableIfNotExists("USR_SelectedQuestionnaires");
	var q = new Query(tableCommand +
			"SELECT DISTINCT Q.Id AS Id" + //all the parameters that compare with 'AND'
			", CASE " +
			"WHEN S.ComparisonType IS NULL " +
			"THEN 1 " +

			"WHEN O.Selector IS NULL AND (S.ComparisonType=@equal OR S.ComparisonType=@inList) " +
			"THEN 0 " +
			"WHEN O.Selector IS NULL AND S.ComparisonType=@notEqual " +
			"THEN 1 " +

			"WHEN S.ComparisonType=@equal " +
			"THEN CASE WHEN O.DataType = @decimal THEN REPLACE(S.Value, ',', '.') = REPLACE(O.Value, ',', '.') ELSE S.Value = O.Value END " +
			"WHEN S.ComparisonType=@inList " +
			"THEN CASE WHEN O.DataType = @decimal THEN REPLACE(O.Value, ',', '.') IN (SELECT REPLACE(Value, ',', '.') FROM Document_Questionnaire_Selectors WHERE Ref=Q.Id) ELSE O.Value IN (SELECT Value FROM Document_Questionnaire_Selectors WHERE Ref=Q.Id) END " +
			"WHEN S.ComparisonType=@notEqual " +
			"THEN CASE WHEN O.DataType = @decimal THEN REPLACE(S.Value, ',', '.') != REPLACE(O.Value, ',', '.') ELSE S.Value != O.Value END " +

			"END AS Selected " +

			"FROM Document_Questionnaire Q " +
			"LEFT JOIN Document_Questionnaire_Selectors S ON S.Ref=Q.Id " +
			"LEFT JOIN USR_OutletAttributes O ON S.Selector=O.Selector AND S.AdditionalParameter=O.AdditionalParameter " +
			"WHERE S.Selector IS NULL OR (S.Selector != 'Catalog_Territory' AND S.Selector != 'Catalog_Region') " +

			"UNION " +  //'Catalog_Territory' select
			"SELECT DISTINCT S.Ref AS Id, 1 " +
			"FROM USR_OutletAttributes O " +
			"JOIN Document_Questionnaire_Selectors S ON O.Selector=S.Selector " +
			"AND S.Selector = 'Catalog_Territory' " +

			"AND CASE WHEN S.ComparisonType=@equal OR S.ComparisonType=@inList " +
			"THEN S.Value = O.Value " +
			"WHEN S.ComparisonType=@notEqual " +
			"THEN S.Value != O.Value " +
			"END " +

			"UNION " + //'Catalog_Region' select
			"SELECT DISTINCT S.Ref AS Id, 1 " +
			"FROM USR_OutletAttributes O " +
			"JOIN Document_Questionnaire_Selectors S ON O.Selector=S.Selector " +
			"AND S.Selector = 'Catalog_Region' " +

			"AND CASE WHEN S.ComparisonType=@equal OR S.ComparisonType=@inList " +
			"THEN S.Value = O.Value " +
			"WHEN S.ComparisonType=@notEqual " +
			"THEN S.Value NOT IN (SELECT Value FROM USR_OutletAttributes WHERE Selector='Catalog_Region') " +
			"END");
	q.AddParameter("equal", DB.Current.Constant.ComparisonType.Equal);
	q.AddParameter("inList", DB.Current.Constant.ComparisonType.InList);
	q.AddParameter("notEqual", DB.Current.Constant.ComparisonType.NotEqual);
	q.AddParameter("decimal", DB.Current.Constant.DataType.Decimal);
	q.Execute();


	var tableCommand = Global.CreateUserTableIfNotExists("USR_Questionnaires");

	var query = new Query(tableCommand +
			"SELECT DISTINCT Q.Id AS Id, Q.Number AS Number, Q.Date AS Date, Q.Single AS Single " +
				", S.BeginAnswerPeriod AS BeginAnswerPeriod, S.EndAnswerPeriod AS EndAnswerPeriod, MIN(CAST (SQ.Selected AS INT)) AS Selected " +
			"FROM " +
			"USR_SelectedQuestionnaires SQ " +
			"JOIN Document_Questionnaire Q ON SQ.Id=Q.Id " +
			"JOIN Document_Questionnaire_Schedule S ON SQ.Id=S.Ref " +
			"WHERE date(S.Date)=date('now', 'start of day') AND Q.Status=@active " +
			"GROUP BY Q.Id, Q.Number, Q.Date, Q.Single, S.BeginAnswerPeriod, S.EndAnswerPeriod");
	query.AddParameter("active", DB.Current.Constant.QuestionnareStatus.Active);
	query.Execute();

	var qDelete = new Query("DELETE FROM USR_Questionnaires WHERE Selected=0");
	qDelete.Execute();

}

function CreateQuestionsTable(outlet) {

	var tableCommand = Global.CreateUserTableIfNotExists("USR_Questions");

	var query = new Query(tableCommand +
			"SELECT MIN(D.Date) AS DocDate, Q.ChildQuestion AS Question, Q.ChildDescription AS Description" +
			", Q.ParentQuestion AS ParentQuestion, Q.ChildType AS AnswerType " +
			", A.Answer AS Answer " +
			", A.Answer AS HistoryAnswer, MAX(A.AnswerDate) AS AnswerDate, D.Single AS Single " +
			", MAX(CAST (Q.Obligatoriness AS int)) AS Obligatoriness" +
			", Q.QuestionOrder AS QuestionOrder" + //QuestionOrder

			", CASE WHEN Q.ChildType=@integer OR Q.ChildType=@decimal OR Q.ChildType=@string THEN 1 ELSE NULL END AS IsInputField " + //IsInputField
			", CASE WHEN Q.ChildType=@integer OR Q.ChildType=@decimal THEN 'numeric' ELSE 'auto' END AS KeyboardType " + //KeyboardType

			"FROM Document_Questionnaire_Questions Q " +
			"JOIN USR_Questionnaires D ON Q.Ref=D.Id " +
			"LEFT JOIN Catalog_Outlet_AnsweredQuestions A ON A.Ref = @outlet AND A.Questionaire=D.Id " +
				"AND A.Question=Q.ChildQuestion AND (A.SKU=@emptySKU OR A.SKU IS NULL) AND DATE(A.AnswerDate)>=DATE(D.BeginAnswerPeriod) " +
				"AND (DATE(A.AnswerDate)<=DATE(D.EndAnswerPeriod) OR A.AnswerDate='0001-01-01 00:00:00')" +
			"GROUP BY Q.ChildQuestion, Q.ChildDescription, Q.ChildType, D.Single HAVING MIN(D.Date)");
	query.AddParameter("emptySKU", DB.EmptyRef("Catalog_SKU"));
	query.AddParameter("integer", DB.Current.Constant.DataType.Integer);
	query.AddParameter("decimal", DB.Current.Constant.DataType.Decimal);
	query.AddParameter("string", DB.Current.Constant.DataType.String);
	query.AddParameter("snapshot", DB.Current.Constant.DataType.Snapshot);
	query.AddParameter("outlet", outlet);
	query.AddParameter("attached", Translate["#snapshotAttached#"]);
	query.Execute();

	var indexQuery = new Query("CREATE INDEX IF NOT EXISTS IND_Q ON USR_Questions(ParentQuestion)");
	indexQuery.Execute();

}

function CreateSKUQuestionsTable(outlet) {

	var tableCommand = Global.CreateUserTableIfNotExists("USR_SKUQuestions");

	var query = new Query(tableCommand +
			"SELECT MIN(D.Date) AS DocDate, S.SKU AS SKU, S.Description AS SKUDescription, Q.ChildQuestion AS Question, Q.ChildDescription AS Description" +
			", Q.ParentQuestion AS ParentQuestion, Q.ChildType AS AnswerType" +
			", A.Answer AS Answer " +
			", A.Answer AS HistoryAnswer, MAX(A.AnswerDate) AS AnswerDate, D.Single AS Single " +
			", MAX(CAST (Q.Obligatoriness AS int)) AS Obligatoriness" +
			", SK.Owner AS OwnerGroup, SK.Brand AS Brand " +
			", Q.QuestionOrder AS QuestionOrder" + //QuestionOrder

			", CASE WHEN Q.ChildType=@integer OR Q.ChildType=@decimal OR Q.ChildType=@string THEN 1 ELSE NULL END AS IsInputField " + //IsInputField
			", CASE WHEN Q.ChildType=@integer OR Q.ChildType=@decimal THEN 'numeric' ELSE 'auto' END AS KeyboardType " + //KeyboardType

			"FROM Document_Questionnaire_SKUQuestions Q " +
			"JOIN _Document_Questionnaire_SKUs S INDEXED BY IND_QSKU ON S.IsTombstone = 0 AND Q.Ref=S.Ref " +
			"JOIN USR_Questionnaires D ON Q.Ref=D.Id " +
			"JOIN Catalog_SKU SK ON SK.Id=S.SKU " +
			"LEFT JOIN _Catalog_Outlet_AnsweredQuestions A INDEXED BY IND_AQ ON A.IsTombstone = 0 AND A.Ref = @outlet AND A.Questionaire=D.Id " +
				"AND A.Question=Q.ChildQuestion AND A.SKU=S.SKU AND DATE(A.AnswerDate)>=DATE(D.BeginAnswerPeriod) " +
				"AND (DATE(A.AnswerDate)<=DATE(D.EndAnswerPeriod) OR A.AnswerDate='0001-01-01 00:00:00') " +
			"GROUP BY Q.ChildQuestion, Q.ChildDescription, Q.ChildType, D.Single, S.SKU, S.Description, SK.Owner, SK.Brand HAVING MIN(D.Date)");
	query.AddParameter("integer", DB.Current.Constant.DataType.Integer);
	query.AddParameter("decimal", DB.Current.Constant.DataType.Decimal);
	query.AddParameter("string", DB.Current.Constant.DataType.String);
	query.AddParameter("snapshot", DB.Current.Constant.DataType.Snapshot);
	query.AddParameter("outlet", outlet);
	query.AddParameter("attached", Translate["#snapshotAttached#"]);
	query.Execute();

	var indexQuery = new Query("CREATE INDEX IF NOT EXISTS IND_SQ ON USR_SKUQuestions(SKU, ParentQuestion)");
	indexQuery.Execute();

}

function ListSelectorIsChanged(currentSelector, selector, additionalParam, currentParam) {
	if (selector=="Catalog_OutletParameter"){
		if (currentSelector!=null && currentParam!=additionalParam)
			return true;
		else
			return false;
	}
	else{
		if (currentSelector!=null && currentSelector!=selector)
			return true;
		else
			return false;
	}
}

function CheckListSelector(list) {
	for (var item in list) {
		if (item){
			return true;
		}
	}
	return false;
}

function GetRegionQueryText() {
	var startSelect = "SELECT R1.Id, R1.Description FROM Catalog_Region R1 ";
	var condition = "JOIN Catalog_Territory T ON T.Owner = R1.Id " +
			"JOIN Catalog_Territory_Outlets O ON O.Ref = T.Id AND O.Outlet = @outlet ";
	var recJoin = "";

	var text = startSelect + condition + "WHERE R1.Id=@region ";

	var loop = 2;

	while (loop < 11) {
		recJoin = recJoin + "JOIN Catalog_Region " + "R" + loop + " ON R" + loop + ".Id=R" + (loop-1) + ".Parent ";
		text = text + "UNION ALL " + startSelect + recJoin + condition + "WHERE R" + loop + ".Id=@region ";
		loop = loop + 1;
	}

	return text;
}


//-----Questions count-----------

function GetQuestionsCount() {
	var query = new Query("SELECT COUNT(Question) FROM USR_Questions LIMIT 1");
	var res = query.ExecuteScalar();
	return res;
}

function GetSKUQuestionsCount() {
	var query = new Query("SELECT COUNT(SKU) FROM USR_SKUQuestions LIMIT 1");
	var res = query.ExecuteScalar();
	return res;
}

function CreateCondition(list) {
	var str = "";
	var notEmpty = false;

	for ( var quest in questionnaires) {
		if (String.IsNullOrEmpty(str)==false){
			str = str + ", ";
		}
		str = str + " '" + quest.ToString() + "' ";
		notEmpty = true;
	}
	if (notEmpty){
		str = " WHERE Ref IN ( " + str  + ") ";
	}

	return str;
}

function DeleteFromList(item, collection) {
    var list = new List;
    for (var i in collection) {
        if (item.ToString() != i.ToString())
            list.Add(i);
    }
    return list;
}

