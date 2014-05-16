function GetQuestionsByOutlet(questionnaire) {
    //    var result = DB.Current.Document.Questionnaire_Questions.SelectBy("Ref", questionnaires).OrderBy("LineNumber").Distinct("Question");
    var query = new Query("SELECT Q.Id, C.Description, D.Description As AnswerType, C.Id AS Question FROM Document_Questionnaire_Questions Q JOIN Catalog_Question C ON Q.Question=C.Id JOIN Enum_DataType D ON D.Id=C.AnswerType WHERE Ref=@ref ORDER BY LineNumber");
    query.AddParameter("ref", questionnaire);
    return query.Execute();
}

function CreateVisitQuestionValueIfNotExists(visit, question, questionValue) {

    var query = new Query("SELECT Id FROM Document_Visit_Questions WHERE Ref == @Visit AND Question == @Question");
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
        Global.ValueListSelect(question, "Answer", q.Execute(), Variables[control]);
    }

    if (answerType == "Snapshot") {
        GetCameraObject(visit);
        Camera.MakeSnapshot(SaveAtVisit, [question, control]);
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

    if (answerType == "Integer" || answerType == "String" || answerType == "Decimal") {
        Variables["memoAnswer"].AutoFocus == true;
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
    var path = String.Format("/private/Document.Visit/{0}/{1}.jpg", entity.Id, guid);
    Camera.Size = 300;
    Camera.Path = path;
}

function CheckEmptyQuestionsAndForward(questionnaires, visit) {

    //var emptyQuestion = DB.Current.Document.Visit_Questions.SelectBy("Ref", visit.Id).Where("Answer==@p1", [""]).First();
    //while (emptyQuestion != null) {
    //    DB.Current.Document.Visit_Questions.Delete(emptyQuestion);
    //    emptyQuestion = DB.Current.Document.Visit_Questions.SelectBy("Ref", visit.Id).Where("Answer==@p1", [""]).First();
    //}

    Workflow.Forward([]);
}