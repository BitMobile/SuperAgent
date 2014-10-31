var questionsAtScreen;
var regularAnswers;
var answerText;

//
// -------------------------------Header handlers-------------------------
//

function OnLoading() {
	questionsAtScreen = null;
	SetListType();
}

function SetListType() {
	if (regularAnswers == null)
		regularAnswers = true;
}

function ChangeListAndRefresh(control, param) {
	regularAnswers = ConvertToBoolean1(param);
	Workflow.Refresh([]);
}

function CreateArray() {
	return [];
}

//
// --------------------------------Questions list
// handlers--------------------------
//

function GetQuestionsByQuestionnaires(outlet) {

	var query = new Query("SELECT DISTINCT QQ.Question, C.Description AS Description, E.Description AS AnswerType, " + 
			"QQ.LineNumber, Q.Date " + 
			//" , CASE WHEN Answer IS NULL THEN 'comment_row' ELSE 'main_row' END AS Style " +
			" , CASE WHEN Answer IS NULL THEN '—' ELSE V.Answer END AS Answer " +
			" , CASE WHEN E.Description='Integer' OR E.Description='Decimal' OR E.Description='String' THEN 1 ELSE NULL END AS IsInputField " +
			" , CASE WHEN E.Description='Integer' OR E.Description='Decimal' THEN 'numeric' ELSE 'auto' END AS KeyboardType " +
			"FROM Document_Questionnaire Q " + 
			"JOIN Document_QuestionnaireMap_Outlets M ON Q.Id=M.Questionnaire " + 
			"JOIN Document_Questionnaire_Questions QQ ON Q.Id=QQ.Ref " + 
			"JOIN Catalog_Question C ON QQ.Question=C.Id " + 
			"JOIN Enum_DataType E ON C.AnswerType=E.Id " + 
			"LEFT JOIN Document_Visit_Questions V ON V.Question=C.Id AND V.Ref=@visit " + 
			"WHERE M.Outlet=@outlet " + 
			"ORDER BY Q.Date, QQ.LineNumber");
	query.AddParameter("outlet", outlet);
	query.AddParameter("visit", $.workflow.visit);
	Variables.Add("workflow.questions_qty", query.ExecuteCount());
	return query.Execute();
}


function RemovePlaceHolder(control) {
	if (control.Text == "—")
		control.Text = "";
}

function UniqueQuestion(question, answerType, answer, text) {

	if (questionsAtScreen == null)
		questionsAtScreen = new List;
	var result;
	if (IsInCollection(question, questionsAtScreen))
		result = false;
	else {
		questionsAtScreen.Add(question);
		result = true;
	}

	// set answer text
	if (answerType == 'Snapshot')
		answerText = GetSnapshotText(answer);
	else
		answerText = answer;

	return result;
}


function CreateVisitQuestionValueIfNotExists(question, answer) {

	var query = new Query("SELECT Id FROM Document_Visit_Questions WHERE Ref == @Visit AND Question == @Question");
	query.AddParameter("Visit", $.workflow.visit);
	query.AddParameter("Question", question);
	var result = query.ExecuteScalar();
	if (result == null) {
		var p = DB.Create("Document.Visit_Questions");
		p.Ref = $.workflow.visit;
		p.Question = question;				
	}
	else
		var p = result.GetObject();
	p.Answer = answer;
	p.Save();
	result = p.Id;
	return result;

}

function GetSnapshotText(text) {
	if (String.IsNullOrEmpty(text))
		return Translate["#noSnapshot#"];
	else
		return Translate["#snapshotAttached#"];
}

function GoToQuestionAction(answerType, visit, control, questionItem) {
	
	var editControl = Variables[control];
	if (editControl.Text=="—")
		editControl.Text = "";
	var question = CreateVisitQuestionValueIfNotExists(questionItem, editControl.Text);

	if (answerType == "ValueList") {
		var q = new Query();
		q.Text = "SELECT Value, Value FROM Catalog_Question_ValueList WHERE Ref=@ref";
		q.AddParameter("ref", questionItem);
		ValueListSelect(question, "Answer", q.Execute(), Variables[control]);
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

function AssignQuestionValue(control, question) {
	CreateVisitQuestionValueIfNotExists(question, control.Text)
}

function DialogCallBack(control, key) {
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

/*
 * function SaveValue(control, questionValue){ questionValue =
 * questionValue.GetObject(); questionValue.Save(); }
 */

function GetCameraObject(entity) {
	FileSystem.CreateDirectory("/private/Document.Visit");
	var guid = Global.GenerateGuid();
	Variables.Add("guid", guid);
	var path = String.Format("/private/Document.Visit/{0}/{1}.jpg", entity.Id, guid);
	Camera.Size = 300;
	Camera.Path = path;
}

function CheckEmptyQuestionsAndForward(visit) {

	var qr = new Query("SELECT Id FROM Document_Visit_Questions WHERE Answer IS NULL  OR Answer=''");
	var res = qr.Execute();

	while (res.Next()) {
		DB.Delete(res.Id);
	}

	// FillQuestionnaires();

	Workflow.Forward([]);
}

function FillQuestionnaires() {
	var q = new Query("SELECT DISTINCT Q.Id FROM Document_Questionnaire Q " + "JOIN Document_QuestionnaireMap_Outlets MO ON MO.Questionnaire=Q.Id AND MO.Outlet = @outlet " + "JOIN Document_Questionnaire_Questions QQ ON Q.Id=QQ.Ref AND QQ.Question IN " + "(SELECT Question FROM Document_Visit_Questions WHERE Ref=@ref)");
	q.AddParameter("ref", $.workflow.visit);
	q.AddParameter("outlet", $.workflow.outlet);
	questionnaires = q.Execute();

	while (questionnaires.Next()) {
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