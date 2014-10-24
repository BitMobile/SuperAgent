var skuOnScreen;
var regularAnswers;


//
//-------------------------------Header handlers-------------------------
//


function OnLoading(){
	skuOnScreen = null;
	SetListType();
}

function SetListType(){
	if (regularAnswers==null)
		regularAnswers = true;
}

function ChangeListAndRefresh(control, param) {
	regularAnswers	= ConvertToBoolean1(param);		
	Workflow.Refresh([]);
}

function CreateArray() {
	return [];
}


//
//--------------------------------Questions list handlers--------------------------
//


function GetSKUsFromQuesionnaires(outlet) {

	var q = new Query();
	q.Text="SELECT distinct QS.SKU, C.Description AS Description, QS.LineNumber, Q.Date, Q.Number, VS.Id AS visitSKUvalue " +
			"FROM Document_Questionnaire Q " +
			"JOIN Document_QuestionnaireMap_Outlets M ON Q.Id=M.Questionnaire AND M.Outlet=@outlet " +
			"JOIN Document_Questionnaire_SKUs QS ON Q.Id=QS.Ref " +
			"JOIN Catalog_SKU C ON QS.SKU=C.Id " +
			"LEFT JOIN Document_Visit_SKUs VS ON VS.SKU=C.Id AND VS.Ref=@ref "
			"ORDER BY Q.Date, QS.LineNumber";
	q.AddParameter("outlet", outlet);
	q.AddParameter("ref", $.workflow.visit);

	return q.Execute();
}

function UniqueSKU(sku){
	if (skuOnScreen==null)
		skuOnScreen = new List;
	if (IsInCollection(sku, skuOnScreen))
		return false;
	else{
		skuOnScreen.Add(sku);
		return true;
	}
}

function GetVisitSKUValue(visit, sku) {
	var query = new Query("SELECT Id FROM Document_Visit_SKUs WHERE Ref == @Visit AND SKU == @SKU");
	query.AddParameter("Visit", visit);
	query.AddParameter("SKU", sku);
	return query.ExecuteScalar();
}

function GetSKUQty(outlet, ref1, ref2, count1, count2) {

	var c = 0;

	if (ref2 == null)
		c = count1;
	else {
		var regionQuest = GetQuesttionaire(outlet, DB.Current.Constant.QuestionnaireScale.Region);
		var territoryQuest = GetQuesttionaire(outlet, DB.Current.Constant.QuestionnaireScale.Territory);

		var query = new Query("SELECT DISTINCT q1.SKUQuestion FROM Document_Questionnaire_SKUQuestions q1 WHERE (q1.Ref=@ref1 OR q1.Ref=@ref2) AND q1.UseInQuestionaire=1");
		query.AddParameter("ref1", regionQuest);
		query.AddParameter("ref2", territoryQuest);
		var res = query.ExecuteCount();

		c = res;
	}

	var n = $.workflow.sku_qty;
	$.workflow.Remove("sku_qty");
	$.workflow.Add("sku_qty", (n + c));

	return c;

}


function GetSKUAnswers(skuvalue) {// , sku_answ) {

	if (skuvalue == null)
		return parseInt(0);

	else {
		var sa = parseInt(0);
		var parameters = [ "Available", "Facing", "Stock", "Price", "MarkUp", "OutOfStock", "Snapshot" ];
		for ( var i in parameters) {
			var name = parameters[i];
			if (String.IsNullOrEmpty(skuvalue[name])==false)
				sa += parseInt(1);
		}

		Variables["workflow"]["sku_answ"] += sa;
		return sa;
	}
}

// ------------------------SKU----------------------

function CreateItemAndShow(control, sku, skuValue) {
	if (){
		
	}
}

function GetSKUQuestions(regionQuest, territoryQuest) {

	var q = new Query("SELECT DISTINCT ES.Description, DQ.LineNumber, DQ.SKUQuestion FROM Document_Questionnaire_SKUQuestions DQ JOIN Enum_SKUQuestions ES ON DQ.SKUQuestion=ES.Id WHERE (DQ.Ref=@ref1 OR DQ.Ref=@ref2) AND DQ.UseInQuestionaire=1 ORDER BY LineNumber");
	q.AddParameter("ref1", regionQuest);
	q.AddParameter("ref2", territoryQuest);

	var res = q.Execute();

	var arr = new List;
	while (res.Next())
		arr.Add(res.SKUQuestion.Description);
	return arr;
}

function CreateVisitSKUValueIfNotExists(visit, sku, skuValue) {
	if (skuValue != null)
		return skuValue;

	var p = DB.Create("Document.Visit_SKUs");

	p.Ref = visit;
	p.SKU = sku;
	p.Save();

	return p.Id;
}

function GetSnapshotText(text) {
	if (String.IsNullOrEmpty(text))
		return Translate["#noSnapshot#"];
	else
		return Translate["#snapshotAttached#"];
}

function GetQuestionSet(quest1, quest2, skuValue) {
	var q = new Query();
	q.AddParameter("ref1", quest1);
	q.AddParameter("ref2", quest2);
	var res = q.Execute();

}

function GoToQuestionAction(answerType, question, visit, control, attribute) {

	if (answerType == "Snapshot") {
		GetCameraObject(visit);
		Camera.MakeSnapshot(SaveAtVisit, question);
	}

	if (answerType == "Boolean") {
		BooleanDialogSelect(question, attribute, Variables[control]);
	}

	if (answerType == "Integer" || answerType == "String" || answerType == "Decimal") {
		Variables["memoAnswer"].AutoFocus == true;
	}
}

function SaveAndBack(skuValue) {
	if (NotEmptyObject(skuValue) == false)
		DB.Delete(skuValue);
	skuValue = skuValue.GetObject().Save();
	Workflow.Back();
}

function NotEmptyObject(skuValue) {
	var stat = false;
	var arr = [ "Available", "Facing", "Stock", "Price", "MarkUp", "OutOfStock", "Snapshot" ];
	for ( var i in arr) {
		var a = arr[i];
		if (String.IsNullOrEmpty(skuValue[a]) == false){
			stat = true;
		}
			
	}
	return stat;
}

function CheckEmtySKUAndForward(outlet, visit) {
	var p = [ outlet, visit ];
	Workflow.Forward(p);
}

function GetSKUShapshot(visit, question, control) {
	GetCameraObject(visit.Id);
	Camera.MakeSnapshot(SaveAtVisit, [ question, control ]);
}

function GetCameraObject(entity) {
	FileSystem.CreateDirectory("/private/Document.Visit");
	var guid = Global.GenerateGuid();
	Variables.Add("guid", guid);
	var path = String.Format("/private/Document.Visit/{0}/{1}.jpg", entity, guid);
	Camera.Size = 300;
	Camera.Path = path;
}

function SaveAtVisit(arr) {
	var question = arr[0];
	var control = arr[1];
	question = question.GetObject();
	question.Snapshot = Variables["guid"];
	question.Save();
	control.Text = Translate["#snapshotAttached#"];
}

function GetActionAndBack() {
	if ($.workflow.skipQuestions) {
		if ($.workflow.skipTasks) {
			Workflow.BackTo("Outlet");
		} else
			Workflow.BackTo("Visit_Tasks");
	} else
		Workflow.Back();
}

//------------------------------internal-----------------------------------

function DialogCallBack(control, key){
	
	Workflow.Refresh([$.param1, $.param2, $.param3, $.param4, $.skuValue]);
}
