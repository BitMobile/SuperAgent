function CreateArray() {
	return [];
}


function GetQuestionsByQuestionnaires(outlet) {

	var query = new Query("SELECT DISTINCT  QQ.Question, CQ.Description AS Description, ED.Description AS AnswerType FROM Document_Questionnaire_Questions QQ " +
			"JOIN Document_QuestionnaireMap_Outlets M ON QQ.Ref=M.Questionnaire JOIN Catalog_Question CQ ON CQ.Id=QQ.Question " +
			"JOIN Enum_DataType ED ON CQ.AnswerType=ED.Id" +
			" WHERE M.Outlet = @outlet ORDER BY Description");
	query.AddParameter("outlet", outlet);
	Variables.Add("workflow.questions_qty", query.ExecuteCount());
	var source = query.Execute();
	var result = [];
	var uniqueSKU = [];
	while (source.Next()){
//		Dialog.Debug(source.Question);
//		Dialog.Debug(uniqueSKU);
		if (IsInCollection2(source.Question, uniqueSKU)==false){
			uniqueSKU.push(source.Question);
			result.push(source);
		}
	}
	Dialog.Debug(result);
	return result;
}

function ShowDialog(value){
	Dialog.Debug(value);
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