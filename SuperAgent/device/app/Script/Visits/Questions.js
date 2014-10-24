var questionsAtScreen;
var regularAnswers;


//
//-------------------------------Header handlers-------------------------
//


function OnLoading(){
	questionsAtScreen = null;
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


function GetQuestionsByQuestionnaires(outlet) {

	var query = new Query("SELECT DISTINCT QQ.Question, C.Description AS Description, E.Description AS AnswerType, QQ.LineNumber, Q.Date, Q.Number " +
			"FROM Document_Questionnaire Q " +
			"JOIN Document_QuestionnaireMap_Outlets M ON Q.Id=M.Questionnaire AND M.Outlet=@outletRef " +
			"JOIN Document_Questionnaire_Questions QQ ON Q.Id=QQ.Ref " +
			"JOIN Catalog_Question C ON QQ.Question=C.Id " +
			"JOIN Enum_DataType E ON C.AnswerType=E.Id " +
			"ORDER BY Q.Date, QQ.LineNumber");
	query.AddParameter("outletRef", outlet);
	Variables.Add("workflow.questions_qty", query.ExecuteCount());
	return query.Execute();
}


function UniqueQuestion(question){
	if (questionsAtScreen==null)
		questionsAtScreen = new List;
	if (IsInCollection(question, questionsAtScreen))
		return false;
	else{
		questionsAtScreen.Add(question);
		return true;
	}
}


function CreateVisitQuestionValueIfNotExists(visit, question, questionValue) {

	var query = new Query(
			"SELECT Id FROM Document_Visit_Questions WHERE Ref == @Visit AND Question == @Question");
	query.AddParameter("Visit", visit);
	query.AddParameter("Question", question);
	var result = query.ExecuteScalar();
	if (result == null) {
		var p = DB.Create("Document.Visit_Questions");
		p.Ref = visit;
		p.Question = question;
		p.Answer = "";
		p.Save();
		result = p.Id;
	}
	return result;

}

function GetSnapshotText(text) {
	if (String.IsNullOrEmpty(text))
		return Translate["#noSnapshot#"];
	else
		return Translate["#snapshotAttached#"];
}

function GoToQuestionAction(answerType, question, visit, control, questionItem) {
	if (answerType == "ValueList") {
		var q = new Query();
		q.Text = "SELECT Value, Value FROM Catalog_Question_ValueList WHERE Ref=@ref";
		q.AddParameter("ref", questionItem);
		ValueListSelect(question, "Answer", q.Execute(),
				Variables[control]);
	}

	if (answerType == "Snapshot") {
		GetCameraObject(visit);
		Camera.MakeSnapshot(SaveAtVisit, [ question, control ]);
	}

	if (answerType == "DateTime") {
		DateTimeDialog(question, "Answer", question.Answer, Variables[control]);
	}

	if (answerType == "Boolean") {
		BooleanDialogSelect(question, "Answer", Variables[control]);
	}
	
}

function DialogCallBack(control, key){
	Workflow.Refresh([]);
}
		

function SaveAtVisit(arr) {
	var question = arr[0];
	var control = arr[1];
	question = question.GetObject();
	question.Answer = Variables["guid"];
	question.Save();
	Variables[control].Text = Translate["#snapshotAttached#"];

}

/*function SaveValue(control, questionValue){
	questionValue = questionValue.GetObject();
	questionValue.Save();
}*/

function GetCameraObject(entity) {
	FileSystem.CreateDirectory("/private/Document.Visit");
	var guid = Global.GenerateGuid();
	Variables.Add("guid", guid);
	var path = String.Format("/private/Document.Visit/{0}/{1}.jpg", entity.Id,
			guid);
	Camera.Size = 300;
	Camera.Path = path;
}

function CheckEmptyQuestionsAndForward(visit) {

	var qr = new Query(
			"SELECT Id FROM Document_Visit_Questions WHERE Answer IS NULL  OR Answer=''");
	var res = qr.Execute();

	while (res.Next()) {
		DB.Delete(res.Id);
	}

	FillQuestionnaires();
	
	Workflow.Forward([]);
}

function FillQuestionnaires() {
	var q = new Query("SELECT DISTINCT Q.Id FROM Document_Questionnaire Q " +
			"JOIN Document_QuestionnaireMap_Outlets MO ON MO.Questionnaire=Q.Id AND MO.Outlet = @outlet " +
			"JOIN Document_Questionnaire_Questions QQ ON Q.Id=QQ.Ref AND QQ.Question IN " +
			"(SELECT Question FROM Document_Visit_Questions WHERE Ref=@ref)");
	q.AddParameter("ref", $.workflow.visit);
	q.AddParameter("outlet", $.workflow.outlet);
	questionnaires = q.Execute();
	
	while (questionnaires.Next()){
		var quest = DB.Create("Document.Visit_Questionnaires");
		quest.Questionnaire = questionnaires.Id;
		quest.Ref = $.workflow.visit;
		quest.Save();
	}
}

function GetActionAndBack() {
	if ($.workflow.skipTasks) {
		Workflow.BackTo("Outlet");
	} else
		Workflow.Back();
}