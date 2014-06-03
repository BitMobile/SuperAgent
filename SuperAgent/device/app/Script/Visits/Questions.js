function CreateArray() {
	return [];
}

function GetQuesttionaire(outlet, scale) {

	var q1 = new Query(
			"SELECT Id FROM Document_Questionnaire WHERE OutletType=@type AND OutletClass=@class AND Scale=@scale ORDER BY Date desc");
	q1.AddParameter("type", outlet.Type);
	q1.AddParameter("class", outlet.Class);
	q1.AddParameter("scale", scale);

	return q1.ExecuteScalar();

}

function GetQuestionsByQuestionnaires(outlet) {

	var regionQuest = GetQuesttionaire(outlet,
			DB.Current.Constant.QuestionnaireScale.Region);
	var territoryQuest = GetQuesttionaire(outlet,
			DB.Current.Constant.QuestionnaireScale.Territory);

	// var query = new Query("SELECT Q.Id, C.Description, D.Description As
	// AnswerType, C.Id AS Question FROM Document_Questionnaire_Questions Q JOIN
	// Catalog_Question C ON Q.Question=C.Id JOIN Enum_DataType D ON
	// D.Id=C.AnswerType WHERE
	// Q.Ref='@ref[Document_Questionnaire]:cd5051d4-7e9c-11e3-bd7d-50e549cab397'
	// AND Question NOT IN
	// ('@ref[Catalog_Question]:d49c89c3-92f4-11e3-9852-50e549cab397',
	// '@ref[Catalog_Question]:fd14b774-951c-11e2-bcec-005056990f8a',
	// '@ref[Catalog_Question]:4563e7b1-c0ab-11e3-8e82-50e549cab397',
	// '@ref[Catalog_Question]:fd14b76d-951c-11e2-bcec-005056990f8a',
	// '@ref[Catalog_Question]:7e29cca5-9219-11e2-9e09-50e549cab397',
	// '@ref[Catalog_Question]:b62d0602-881b-11e3-b6e8-50e549cab397',
	// '@ref[Catalog_Question]:4563e7b0-c0ab-11e3-8e82-50e549cab397') ORDER BY
	// LineNumber");
	var query = new Query(GetQuestionsQueryText());
	query.AddParameter("ref1", regionQuest);
	query.AddParameter("ref2", territoryQuest);
	Variables.Add("workflow.questions_qty", query.ExecuteCount());
	return query.Execute();
}

function GetQuestionsQueryText() {
	return "SELECT DQQ.LineNumber, DQQ.Question, CQ.Description, ED.Description AS AnswerType, 1 AS T1 FROM Document_Questionnaire_Questions DQQ JOIN Catalog_Question CQ ON DQQ.Question=CQ.Id JOIN Enum_DataType ED ON CQ.AnswerType=ED.Id WHERE Ref=@ref1 UNION ALL SELECT q1.LineNumber, q1.Question, CQ.Description, ED.Description AS AnswerType, 2 AS T1 FROM Document_Questionnaire_Questions q1 LEFT JOIN Document_Questionnaire_Questions q2 ON q2.Question=q1.Question and q2.ref=@ref1 JOIN Catalog_Question CQ ON q1.Question=CQ.Id JOIN Enum_DataType ED ON CQ.AnswerType=ED.Id WHERE q1.Ref =@ref2  and q2.Id is null ORDER BY T1, LineNumber"
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
		Global.ValueListSelect(question, "Answer", q.Execute(),
				Variables[control]);
	}

	if (answerType == "Snapshot") {
		GetCameraObject(visit);
		Camera.MakeSnapshot(SaveAtVisit, [ question, control ]);
	}

	if (answerType == "DateTime") {
		if (IsNullOrEmpty(question.Answer))
			var date = DateTime.Now;
		else
			var date = DateTime.Parse(question.Answer);
		Global.DateTimeDialog(question, "Answer", date, Variables[control]);
	}

	if (answerType == "Boolean") {
		Global.BooleanDialogSelect(question, "Answer", Variables[control]);
	}

}

function SaveAtVisit(arr) {
	var question = arr[0];
	var control = arr[1];
	question = question.GetObject();
	question.Answer = Variables["guid"];
	question.Save();
	Variables[control].Text = Translate["#snapshotAttached#"];

}

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

	Workflow.Forward([]);
}

function GetActionAndBack() {
	if ($.workflow.skipTasks) {
		Workflow.BackTo("Outlet");
	} else
		Workflow.Back();
}