var skuOnScreen;
var regularAnswers;
var parentId;


//
//-------------------------------Header handlers-------------------------
//


function OnLoading(){
	skuOnScreen = null;
	//parentId = null;
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

function ShowChilds(index) {	
	var s = "p" + index; 
	if (s == parentId)
		return true;
	else
		return false;
}

function GetChilds(sku) {
	var q = new Query();
	q.Text = "SELECT DISTINCT C.Description AS Description, C.Id, E.Description AS AnswerType" + 
			" , CASE WHEN V.Answer IS NULL THEN '—' ELSE V.Answer END AS Answer" +
			" , CASE WHEN E.Description='Integer' OR E.Description='Decimal' OR E.Description='String' THEN 1 ELSE NULL END AS IsInputField" +
			" , CASE WHEN E.Description='Integer' OR E.Description='Decimal' THEN 'numeric' ELSE 'auto' END AS KeyboardType" + 
			" FROM Document_Questionnaire Q" + 
			" JOIN Document_QuestionnaireMap_Outlets M ON Q.Id=M.Questionnaire AND M.Outlet = @outlet" + 
			" JOIN Document_Questionnaire_SKUQuestionsNew SQ ON SQ.Ref=Q.Id" + 
			" JOIN Document_Questionnaire_SKUs S ON S.Ref=Q.Id AND S.SKU=@sku" + 
			" JOIN Catalog_Question C ON SQ.Question=C.Id" +
			" JOIN Enum_DataType E ON E.Id=C.AnswerType" + 
			" LEFT JOIN Document_Visit_SKUs V ON V.Question=C.Id AND V.SKU=S.SKU AND V.Ref=@visit" +
			" ORDER BY Description";
	q.AddParameter("outlet", $.workflow.outlet);
	q.AddParameter("sku", sku);
	q.AddParameter("visit", $.workflow.visit);
	return q.Execute();
}


function AssignQuestionValue(control, sku, question) {
	CreateVisitSKUValueIfNotExists(sku, question, control.Text)
}

function RemovePlaceHolder(control) {
	if (control.Text == "—")
		control.Text = "";
}

// ------------------------SKU----------------------

function CreateItemAndShow(control, sku, skuValue, index) {
//	if (skuValue!=null){
//		skuValue = DB.Create("Document.Visit_SKUs");
//		skuValue.Ref = $.workflow.visit;
//		skuValue.SKU = sku;
//	}
	parentId = "p" + index;
	Workflow.Refresh([]);
}



function CreateVisitSKUValueIfNotExists(control, sku, question) {
	
	var query = new Query();
	query.Text = "SELECT Id FROM Document_Visit_SKUs WHERE SKU=@sku AND Question=@question AND Ref=@ref";
	query.AddParameter("ref", $.workflow.visit);
	query.AddParameter("question", question);
	query.AddParameter("sku", sku);
	var skuValue = query.ExecuteScalar();
	
	if (skuValue == null){		
		skuValue = DB.Create("Document.Visit_SKUs");
		skuValue.Ref = $.workflow.visit;
		skuValue.SKU = sku;
		skuValue.Question = question;
	}
	else
		skuValue = skuValue.GetObject();
	skuValue.Answer = control.Text;
	skuValue.Save();

	return skuValue.Id;
}

function GetSnapshotText(text) {
	if (String.IsNullOrEmpty(text))
		return Translate["#noSnapshot#"];
	else
		return Translate["#snapshotAttached#"];
}

function GoToQuestionAction(control, answerType, question, sku, editControl) {	
	
	editControl = Variables[editControl];
	if (editControl.Text=="—")
		editControl.Text = "";
	var skuValue = CreateVisitSKUValueIfNotExists(editControl, sku, question);
	
	if (answerType == "ValueList") {
		var q = new Query();
		q.Text = "SELECT Value, Value FROM Catalog_Question_ValueList WHERE Ref=@ref";
		q.AddParameter("ref", question);
		ValueListSelect(skuValue, "Answer", q.Execute(), editControl);
	}

	if (answerType == "Snapshot") {
		GetCameraObject($.workflow.visit);
		Camera.MakeSnapshot(SaveAtVisit, [ skuValue, editControl]);
	}

	if (answerType == "DateTime") {
		DateTimeDialog(skuValue, "Answer", skuValue.Answer, editControl);
	}

	if (answerType == "Boolean") {
		BooleanDialogSelect(skuValue, "Answer", editControl);
	}
}


function CheckEmtySKUAndForward(outlet, visit) {
	var p = [ outlet, visit ];
	Workflow.Forward(p);
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
	control.Text = key;
}
