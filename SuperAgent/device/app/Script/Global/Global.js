

function GenerateGuid() {

	return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}

function S4() {
	return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
}

function SetSessionConstants() {

	var solVersion = new Query("SELECT Value FROM ___SolutionInfo WHERE key='version'");
	var planEnbl = new Query("SELECT LogicValue FROM Catalog_MobileApplicationSettings WHERE Description='PlanVisitEnabled'");
	var multStck = new Query("SELECT LogicValue FROM Catalog_MobileApplicationSettings WHERE Description='MultistockEnabled'");
	var stckEnbl = new Query("SELECT LogicValue FROM Catalog_MobileApplicationSettings WHERE Description='EmptyStockEnabled'");
	var orderCalc = new Query("SELECT LogicValue FROM Catalog_MobileApplicationSettings WHERE Description='RecOrderEnabled'");
	var UVR = new Query("SELECT LogicValue FROM Catalog_MobileApplicationSettings WHERE Description='ControlVisitReasonEnabled'");
	var NOR = new Query("SELECT LogicValue FROM Catalog_MobileApplicationSettings WHERE Description='ControlOrderReasonEnabled'");
	var SnapshotSize = new Query("SELECT NumericValue FROM Catalog_MobileApplicationSettings WHERE Description='SnapshotSize'");
	var SKUFeaturesRegistration = new Query("SELECT LogicValue FROM Catalog_MobileApplicationSettings WHERE Description='SKUFeaturesRegistration'");
	var coordActuality = new Query("SELECT NumericValue FROM Catalog_MobileApplicationSettings WHERE Description='UserCoordinatesActualityTime'");
	var autoFillOrder = new Query("SELECT LogicValue FROM Catalog_MobileApplicationSettings WHERE Description='UseAutoFillForRecOrder'");
	var saveQuest = new Query("SELECT LogicValue FROM Catalog_MobileApplicationSettings WHERE Description='UseSaveQuest'");
	$.AddGlobal("sessionConst", new Dictionary());
	$.sessionConst.Add("UseSaveQuest", saveQuest.ExecuteScalar());
	$.sessionConst.Add("solVersion", solVersion.ExecuteScalar());
	$.sessionConst.Add("PlanEnbl", EvaluateBoolean(planEnbl.ExecuteScalar()));
	$.sessionConst.Add("MultStck", EvaluateBoolean(multStck.ExecuteScalar()));
	$.sessionConst.Add("NoStkEnbl", EvaluateBoolean(stckEnbl.ExecuteScalar()));
	$.sessionConst.Add("OrderCalc", EvaluateBoolean(orderCalc.ExecuteScalar()));
	$.sessionConst.Add("UVR", EvaluateBoolean(UVR.ExecuteScalar()));
	$.sessionConst.Add("NOR", EvaluateBoolean(NOR.ExecuteScalar()));
	$.sessionConst.Add("SnapshotSize", SnapshotSize.ExecuteScalar());
	$.sessionConst.Add("SKUFeaturesRegistration", SKUFeaturesRegistration.ExecuteScalar());
	$.sessionConst.Add("UserCoordinatesActualityTime", coordActuality.ExecuteScalar());
	$.sessionConst.Add("UseAutoFillForRecOrder", autoFillOrder.ExecuteScalar());

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
		if (rights.Code=='000000005') {
			if (rights.AccessRight==null) {
				$.sessionConst.Add("orderEnabled", false);
			} else {
				$.sessionConst.Add("orderEnabled", true);
			}
		}
		if (rights.Code=='000000006') {
			if (rights.AccessRight==null) {
				$.sessionConst.Add("returnEnabled", false);
			} else {
				$.sessionConst.Add("returnEnabled", true);
			}
		}
		if (rights.Code=='000000007') {
			if (rights.AccessRight==null) {
				$.sessionConst.Add("contractorEditable", false);
			} else {
				$.sessionConst.Add("contractorEditable", true);
			}
		}
		if (rights.Code=='000000008') {
			if (rights.AccessRight==null) {
				$.sessionConst.Add("outletContactEditable", false);
			} else {
				$.sessionConst.Add("outletContactEditable", true);
			}
		}
		if (rights.Code=='000000009') {
			if (rights.AccessRight==null) {
				$.sessionConst.Add("partnerContactEditable", false);
			} else {
				$.sessionConst.Add("partnerContactEditable", true);
			}
		}
		if (rights.Code=='000000010') {
			if (rights.AccessRight==null) {
				$.sessionConst.Add("percentDiscountEnabled", false);
			} else {
				$.sessionConst.Add("percentDiscountEnabled", true);
			}
		}
		if (rights.Code=='000000011') {
			if (rights.AccessRight==null) {
				$.sessionConst.Add("totaltDiscountEnabled", false);
			} else {
				$.sessionConst.Add("totaltDiscountEnabled", true);
			}
		}
		if (rights.Code=='000000012') {
			if (rights.AccessRight==null) {
				$.sessionConst.Add("newPriceEnabled", false);
			} else {
				$.sessionConst.Add("newPriceEnabled", true);
			}
		}
		if (rights.Code=='000000013') {
			if (rights.AccessRight==null) {
				$.sessionConst.Add("editTasksWithoutVisit", false);
			} else {
				$.sessionConst.Add("editTasksWithoutVisit", true);
			}
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

function ValidateEmail(string){
	return ValidateField(string, "(([A-za-z0-9-_.]+@[a-z0-9_]+(.[a-z]{2,6})+)*)?", Translate["#email#"])
}

function ValidatePhoneNr(string){
	return true; // ValidateField(string, "([0-9()-+\s]{1,20})?", Translate["#phone#"]);
}

function ValidateField(string, regExp, fieldName){
	if (string==null)
		string = "";
	var validField = validate(string, regExp);
	if (validField==false)
		Dialog.Message(String.Format("{0} {1}", Translate["#incorrect#"], fieldName));
	return validField;
}


//--------------------------------Order functionality----------------------------

function FindTwinAndUnite(orderitem) {

	var q = new Query(
			"SELECT Id FROM Document_" + $.workflow.currentDoc + "_SKUs WHERE Ref=@ref AND SKU=@sku AND Discount=@discount AND Total=@total AND Units=@units AND Feature=@feature AND Id<>@id LIMIT 1"); // AND
																																								// Id<>@id
	q.AddParameter("ref", orderitem.Ref);
	q.AddParameter("sku", orderitem.SKU);
	q.AddParameter("discount", orderitem.Discount);
	q.AddParameter("total", orderitem.Total);
	q.AddParameter("units", orderitem.Units);
	q.AddParameter("feature", orderitem.Feature);
	q.AddParameter("id", orderitem.Id);
	var rst = q.ExecuteCount();
	if (parseInt(rst) != parseInt(0)) {
		var twin = q.ExecuteScalar();
		twin = twin.GetObject();
		twin.Qty += orderitem.Qty;
		twin.Save();
		DB.Delete(orderitem.Id);
	} else
		orderitem.Save();
}

function ClearFilter(){
	var checkDropF = new Query("SELECT count(*) FROM sqlite_master WHERE type='table' AND name='USR_Filters'");
	var checkDropFResult = checkDropF.ExecuteScalar();

	if (checkDropFResult == 1) {
		var dropF = new Query("DELETE FROM USR_Filters");
		dropF.Execute();
	}
}

//------------------------Queries common functions------------------------------

function CreateUserTableIfNotExists(name) {
	var q = new Query("SELECT count(*) FROM sqlite_master WHERE type='table' AND name=@name");
	q.AddParameter("name", name);
	var check = q.ExecuteScalar();

	if (parseInt(check) == parseInt(1)) {
		return "DELETE FROM " + name + "; INSERT INTO " + name + " ";
	}
	else
		return "CREATE TABLE " + name + " AS ";
}

//-----------------------creat question table ---------------------------------
function CreateTableQuestions(outlet) {

	CreateQuestionnareTable(outlet);
	if (GetQuestionsTableCount()) {
			CreateQuestionsTable(outlet);
	}

	if (GetSKUQuestionsTableCount()) {
		CreateSKUQuestionsTable(outlet);
	}

  SetSteps(outlet);

}

function CreateQuestionnareTable(outlet) {

	var q = new Query("SELECT count(*) FROM sqlite_master WHERE type='table' AND name=@name");
	q.AddParameter("name", "USR_OutletAttributes");

	var check = q.ExecuteScalar();

	if (parseInt(check) == parseInt(1)) {

		var tableCommand = "DELETE FROM USR_OutletAttributes; ";

	}	else {

		var tableCommand = "CREATE TABLE USR_OutletAttributes (Selector, DataType, AdditionalParameter, Value); ";
	}


	 var OutletAttributesText = tableCommand + "INSERT INTO USR_OutletAttributes " +
										"SELECT 'Enum_OutletStatus' AS Selector, NULL AS DataType, '@ref[Catalog_OutletParameter]:00000000-0000-0000-0000-000000000000' AS AdditionalParameter, REPLACE(@outletStatus, ('@ref[Enum_OutletStatus]:'), '') AS Value " +
	 						"UNION SELECT 'Catalog_OutletType', NULL, '@ref[Catalog_OutletParameter]:00000000-0000-0000-0000-000000000000', REPLACE(@outletType, ('@ref[Catalog_OutletType]:'), '') " +
	 						"UNION SELECT 'Catalog_OutletClass', NULL, '@ref[Catalog_OutletParameter]:00000000-0000-0000-0000-000000000000', REPLACE(@outletClass, ('@ref[Catalog_OutletClass]:'), '') " +
							"UNION SELECT 'Catalog_Distributor', NULL, '@ref[Catalog_OutletParameter]:00000000-0000-0000-0000-000000000000', REPLACE(@distributor, ('@ref[Catalog_Distributor]:'), '') " +
							"UNION SELECT 'Catalog_Positions', NULL, '@ref[Catalog_OutletParameter]:00000000-0000-0000-0000-000000000000', REPLACE((SELECT Position FROM Catalog_User LIMIT 1), ('@ref[Catalog_Positions]:'), '') " +
							"UNION SELECT 'Catalog_Outlet', NULL, '@ref[Catalog_OutletParameter]:00000000-0000-0000-0000-000000000000', REPLACE(@outlet, ('@ref[Catalog_Outlet]:'), '') " +
							"UNION SELECT 'Catalog_OutletParameter', COP.DataType, OP.Parameter, OP.Value FROM Catalog_Outlet_Parameters OP LEFT JOIN Catalog_OutletParameter COP ON OP.Parameter=COP.Id WHERE Ref=@outlet " +
							"UNION SELECT 'Catalog_Territory', NULL, '@ref[Catalog_OutletParameter]:00000000-0000-0000-0000-000000000000', REPLACE(Ref, ('@ref[Catalog_Territory]:'), '') FROM Catalog_Territory_Outlets WHERE Outlet=@outlet " +
							 GetRegionQueryText1() + "; ";

	// var tableCommand = Global.CreateUserTableIfNotExists("USR_SelectedQuestionnaires");
	var tableCommand = CreateUserTableIfNotExists("USR_SelectedQuestionnaires");

	var SelectedQuestionnairesText = tableCommand +
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
			"END; ";

	// var tableCommand = Global.CreateUserTableIfNotExists("USR_Questionnaires");
	var tableCommand = CreateUserTableIfNotExists("USR_Questionnaires");

	var QuestionnairesText = tableCommand +
			"SELECT DISTINCT Q.Id AS Id, Q.Number AS Number, Q.Date AS Date, Q.Single AS Single " +
				", S.BeginAnswerPeriod AS BeginAnswerPeriod, S.EndAnswerPeriod AS EndAnswerPeriod, MIN(CAST (SQ.Selected AS INT)) AS Selected " +
			"FROM " +
			"USR_SelectedQuestionnaires SQ " +
			"JOIN Document_Questionnaire Q ON SQ.Id=Q.Id " +
			"JOIN _Document_Questionnaire_Schedule S INDEXED BY IND_QSCHEDULE ON SQ.Id=S.Ref AND S.IsTombstone=0 " +
			"WHERE Q.Status=@active AND date(S.Date)=date('now', 'start of day') " +
			"GROUP BY Q.Id, Q.Number, Q.Date, Q.Single, S.BeginAnswerPeriod, S.EndAnswerPeriod; " +
			"DELETE FROM USR_Questionnaires WHERE Selected=0";

	var query = new Query(OutletAttributesText + SelectedQuestionnairesText + QuestionnairesText);

	query.AddParameter("outletStatus", outlet.OutletStatus);
	query.AddParameter("outletType", outlet.Type);
	query.AddParameter("outletClass", outlet.Class);
	query.AddParameter("distributor", outlet.Distributor);
	query.AddParameter("outlet", outlet);
	query.AddParameter("equal", DB.Current.Constant.ComparisonType.Equal);
	query.AddParameter("inList", DB.Current.Constant.ComparisonType.InList);
	query.AddParameter("notEqual", DB.Current.Constant.ComparisonType.NotEqual);
	query.AddParameter("decimal", DB.Current.Constant.DataType.Decimal);
	query.AddParameter("active", DB.Current.Constant.QuestionnareStatus.Active);
	query.Execute();

}

function CreateQuestionsTable(outlet) {

	// var tableCommand = Global.CreateUserTableIfNotExists("USR_Questions");
	var tableCommand = CreateUserTableIfNotExists("USR_Questions");

	var query = new Query(tableCommand +
		"SELECT " +
			"D.Date AS DocDate, " +
			"Q.ChildQuestion AS Question, " +
			"Q.ChildDescription AS Description, " +
			"Q.ChildType AS AnswerType, " +
			"Q.ParentQuestion AS ParentQuestion, " +
			"Q.QuestionOrder AS QuestionOrder, " +
			"CASE WHEN Q.ChildType = @integer OR Q.ChildType = @decimal OR Q.ChildType = @string THEN 1 ELSE NULL END AS IsInputField, " +
			"CASE WHEN Q.ChildType = @integer OR Q.ChildType = @decimal THEN 'numeric' ELSE 'auto' END AS KeyboardType, " +
			"D.Single AS Single, " +
			"MAX(CAST(Q.Obligatoriness AS int)) AS Obligatoriness, " +
			"A.Answer AS Answer, " +
			"A.Answer AS HistoryAnswer, " +
			"A.AnswerDate AS AnswerDate " +

		"FROM _Document_Questionnaire_Questions Q INDEXED BY IND_QSKUQ " +
		"JOIN USR_Questionnaires D ON Q.Ref=D.Id " +
		"LEFT JOIN _Catalog_Outlet_AnsweredQuestions A INDEXED BY IND_AQ ON A.IsTombstone = 0 AND A.Ref = @outlet AND A.Questionaire = D.Id " +
																						"AND A.Question = Q.ChildQuestion AND IFNULL(A.SKU, @emptySKU) = @emptySKU " +
																						"AND DATE(A.AnswerDate) >= DATE(D.BeginAnswerPeriod) " +
																						"AND (DATE(A.AnswerDate) <= DATE(D.EndAnswerPeriod) OR A.AnswerDate = '0001-01-01 00:00:00') " +
		"WHERE Q.IsTombstone = 0 " +
		"GROUP BY Q.ChildQuestion, " +
			"D.Date, " +
			"Q.ParentQuestion, " +
			"Q.ChildDescription, " +
			"Q.ChildType, " +
			"D.Single, " +
			"A.Answer, " +
			"A.AnswerDate, " +
			"CASE WHEN Q.ChildType = @integer OR Q.ChildType = @decimal OR Q.ChildType = @string THEN 1 ELSE NULL END, " +
			"CASE WHEN Q.ChildType = @integer OR Q.ChildType = @decimal THEN 'numeric' ELSE 'auto' END; " +
			"CREATE INDEX IF NOT EXISTS IND_Q ON USR_Questions(ParentQuestion)");

	query.AddParameter("emptySKU", DB.EmptyRef("Catalog_SKU"));
	query.AddParameter("integer", DB.Current.Constant.DataType.Integer);
	query.AddParameter("decimal", DB.Current.Constant.DataType.Decimal);
	query.AddParameter("string", DB.Current.Constant.DataType.String);
	query.AddParameter("outlet", outlet);
	query.Execute();

}

function CreateSKUQuestionsTable(outlet) {

	// var tableCommand = Global.CreateUserTableIfNotExists("USR_SKUQuestions");
	var tableCommand = CreateUserTableIfNotExists("USR_SKUQuestions");

	var query = new Query(tableCommand +
		"SELECT " +
			"D.Date AS DocDate, " +
			"S.SKU AS SKU, " +
			"S.Description AS SKUDescription, " +
			"Q.ChildQuestion AS Question, " +
			"Q.ChildDescription AS Description, " +
			"Q.ChildType AS AnswerType, " +
			"Q.ParentQuestion AS ParentQuestion, " +
			"Q.QuestionOrder AS QuestionOrder, " +
			"CASE WHEN Q.ChildType = @integer OR Q.ChildType = @decimal OR Q.ChildType = @string THEN 1 ELSE NULL END AS IsInputField, " +
			"CASE WHEN Q.ChildType = @integer OR Q.ChildType = @decimal THEN 'numeric' ELSE 'auto' END AS KeyboardType, " +
			"D.Single AS Single, " +
			"MAX(CAST (Q.Obligatoriness AS int)) AS Obligatoriness, " +
			"SK.Owner AS OwnerGroup, " +
			"SK.Brand AS Brand, " +
			"A.Answer AS Answer, " +
			"A.Answer AS HistoryAnswer, " +
			"A.AnswerDate AS AnswerDate " +

		"FROM _Document_Questionnaire_SKUQuestions Q INDEXED BY IND_QSKUSQ " +
		"JOIN _Document_Questionnaire_SKUs S INDEXED BY IND_QSKU ON S.IsTombstone = 0 AND Q.Ref=S.Ref " +
		"JOIN USR_Questionnaires D ON Q.Ref=D.Id " +
		"JOIN Catalog_SKU SK ON SK.Id=S.SKU " +
		"LEFT JOIN _Catalog_Outlet_AnsweredQuestions A INDEXED BY IND_AQ ON A.IsTombstone = 0 AND A.Ref = @outlet AND A.Questionaire = D.Id " +
																"AND A.Question = Q.ChildQuestion AND A.SKU = S.SKU " +
																"AND DATE(A.AnswerDate) >= DATE(D.BeginAnswerPeriod) " +
																"AND (DATE(A.AnswerDate) <= DATE(D.EndAnswerPeriod) OR A.AnswerDate = '0001-01-01 00:00:00') " +

    "WHERE Q.IsTombstone = 0 " +
		"GROUP BY Q.ChildQuestion, " +
			"Q.ChildDescription, " +
			"Q.ChildType, " +
			"Q.ParentQuestion, " +
			"Q.QuestionOrder, " +
			"D.Single, " +
			"S.SKU, " +
			"S.Description, " +
			"SK.Owner, " +
			"SK.Brand, " +
			"A.Answer, " +
			"A.AnswerDate, " +
			"CASE WHEN Q.ChildType = @integer OR Q.ChildType = @decimal OR Q.ChildType = @string THEN 1 ELSE NULL END, " +
			"CASE WHEN Q.ChildType = @integer OR Q.ChildType = @decimal THEN 'numeric' ELSE 'auto' END; " +
			"CREATE INDEX IF NOT EXISTS IND_SQ ON USR_SKUQuestions(SKU, ParentQuestion); ");

	query.AddParameter("integer", DB.Current.Constant.DataType.Integer);
	query.AddParameter("decimal", DB.Current.Constant.DataType.Decimal);
	query.AddParameter("string", DB.Current.Constant.DataType.String);
	query.AddParameter("outlet", outlet);
	query.Execute();

}


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

function ClearUSRTables(){
	var q = new Query("DELETE FROM USR_Questionnaires");
	q.Execute();

	var q = new Query("DELETE FROM USR_Questions");
	q.Execute();

	var q = new Query("DELETE FROM USR_SKUQuestions");
	q.Execute();
}

function GetRegionQueryText1() {

	var loop = 1;

	var startSelect = " UNION SELECT 'Catalog_Region', NULL, '@ref[Catalog_OutletParameter]:00000000-0000-0000-0000-000000000000', replace(R" + loop + ".Id, ('@ref[Catalog_Region]:'), '') " +
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

function SetSteps(outlet) {

	var q = new Query("SELECT count(*) FROM sqlite_master WHERE type='table' AND name='USR_WorkflowSteps'");
	var check = q.ExecuteScalar();

	if (parseInt(check) == parseInt(1)) {
		var dropQS = new Query("DELETE FROM USR_WorkflowSteps");
		dropQS.Execute();
	} else {
		var q = new Query("CREATE TABLE " + " USR_WorkflowSteps (StepOrder, Skip, Value, NextStep, LastStep)");
		q.Execute();
	}

	var skipQuest = false;

	var hasContractors = HasContractors(outlet);

	var q = new Query("SELECT CreateOrderInMA, FillQuestionnaireInMA, DoEncashmentInMA, CreateReturnInMA FROM Catalog_OutletsStatusesSettings WHERE Status=@status");
	q.AddParameter("status", outlet.OutletStatus);
	var statusValues = q.Execute();
	while (statusValues.Next()) {
		if (EvaluateBoolean(statusValues.CreateOrderInMA) && $.sessionConst.orderEnabled && hasContractors)
			InsertIntoSteps("4", "SkipOrder", false, "Order", "SKUs");
		else
			InsertIntoSteps("4", "SkipOrder", true, "Order", "SKUs");
		if (EvaluateBoolean(statusValues.CreateReturnInMA) && $.sessionConst.returnEnabled && hasContractors) {
			InsertIntoSteps("5", "SkipReturn", false, "Return", "Order");
		}
		else
			InsertIntoSteps("5", "SkipReturn", true, "Return", "Order");
		if (EvaluateBoolean(statusValues.DoEncashmentInMA) && $.sessionConst.encashEnabled)
			InsertIntoSteps("6", "SkipEncashment", false, "Receivables", "Return");
		else
			InsertIntoSteps("6", "SkipEncashment", true, "Receivables", "Return");
		if (EvaluateBoolean(statusValues.FillQuestionnaireInMA))
			skipQuest = false;
		else
			skipQuest = true;
	}

	if (parseInt(GetTasksCount(outlet)) != parseInt(0))
		InsertIntoSteps("1", "SkipTask", false, "Visit_Tasks", "Outlet");
	else
		InsertIntoSteps("1", "SkipTask", true, "Visit_Tasks", "Outlet");

	if (parseInt(GetQuestionsCount()) == parseInt(0) || skipQuest)
		InsertIntoSteps("2", "SkipQuestions", true, "Questions", "Visit_Tasks");
	else
		InsertIntoSteps("2", "SkipQuestions", false, "Questions", "Visit_Tasks");

	if (parseInt(GetSKUQuestionsCount()) == parseInt(0) || skipQuest)
		InsertIntoSteps("3", "SkipSKUs", true, "SKUs", "Questions");
	else
		InsertIntoSteps("3", "SkipSKUs", false, "SKUs", "Questions");

}

function InsertIntoSteps(stepOrder, skip, value, action, previousStep) {
	var q = new Query("INSERT INTO USR_WorkflowSteps VALUES (@stepOrder, @skip, @value, @action, @previousStep)");
	q.AddParameter("stepOrder", stepOrder);
	q.AddParameter("skip", skip);
	q.AddParameter("value", value);
	q.AddParameter("action", action);
	q.AddParameter("previousStep", previousStep);
	q.Execute();
}

function HasContractors(outlet){

	var res;
	if (outlet == null) {
		var existorno = new Query("Select type From sqlite_master where name = 'UT_answerQuest' And type = 'table'");
		var exorno = existorno.ExecuteCount();
		if (exorno > 0) {
			var checkansquest = new Query("Select outlet From UT_answerQuest");0
			var outletref = checkansquest.ExecuteScalar();
			var outletObj = outletref.GetObject()
		}
	}else {
		var outletObj = outlet.GetObject();
	}
	if (outletObj.Distributor==DB.EmptyRef("Catalog_Distributor"))
		res = HasOutletContractors(outlet);
	else
		res = HasPartnerContractors(outlet);

	return res;
}

function HasOutletContractors(outlet) {
	var q = new Query("SELECT COUNT(Id) FROM Catalog_Outlet_Contractors WHERE ref = @outlet")
	q.AddParameter("outlet", outlet);
	return q.ExecuteScalar();
}

function HasPartnerContractors(outlet){
	var outletObj = outlet.GetObject();
	var q = new Query("SELECT COUNT(Id) FROM Catalog_Distributor_Contractors C WHERE C.Ref=@distr");
	q.AddParameter("distr", outletObj.Distributor);
	return q.ExecuteScalar();
}

function GetTasksCount(outlet) {
	// var taskQuery = new Query("SELECT COUNT(Id) FROM Document_Task " +
	// 	"WHERE (Status=0 AND DATE(StartPlanDate)<=DATE('now', 'localtime')) " +
	// 	" OR " +
	// 	" (Status=1 AND DATE(ExecutionDate)=DATE('now', 'localtime')) " +
	// 	" AND Outlet=@outlet");
	// taskQuery.AddParameter("outlet", outlet);
	// return taskQuery.ExecuteScalar();
	return parseInt(1);

}

function GetQuestionsTableCount() {
	var query = new Query("SELECT COUNT(*) FROM sqlite_master WHERE type = 'table' AND name = 'USR_Questions'");
	var res = query.ExecuteScalar();
	if (parseInt(res) == parseInt(0)) {
		return true;
	} else {
		var query = new Query("SELECT COUNT(*) FROM USR_Questions");
		var res = query.ExecuteScalar();
		if (parseInt(res) == parseInt(0)) {
			return true;
		}
	}
	return false;

}

function GetSKUQuestionsTableCount() {
	var query = new Query("SELECT COUNT(*) FROM sqlite_master WHERE type = 'table' AND name = 'USR_SKUQuestions'");
	var res = query.ExecuteScalar();
	if (parseInt(res) == parseInt(0)) {
		return true;
	} else {
		var query = new Query("SELECT COUNT(*) FROM USR_SKUQuestions");
		var res = query.ExecuteScalar();
		if (parseInt(res) == parseInt(0)) {
			return true;
		}
	}
	return false;

}
