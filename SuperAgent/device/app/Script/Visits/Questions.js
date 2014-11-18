var questionsAtScreen;
var regularAnswers;
var answerText;
var obligateredLeft;

//
// -------------------------------Header handlers-------------------------
//

function OnLoading() {
	questionsAtScreen = null;
	obligateredLeft = parseInt(0);
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


//
// --------------------------------Questions list handlers--------------------------
//

function GetQuestionsByQuestionnaires(outlet) {

	var str = CreateCondition($.workflow.questionnaires);	
	var single = 1;
	if (regularAnswers)	
		single = 0;
	var query = new Query("SELECT MIN(D.Date) AS DocDate, Q.ChildQuestion AS Question, Q.ChildDescription AS Description " +
			", Q.ChildType AS AnswerType, MAX(CAST(Q.Obligatoriness AS int)) AS Obligatoriness " +
			", (SELECT Qq.QuestionOrder FROM Document_Questionnaire Dd  " +
			" JOIN Document_Questionnaire_Questions Qq ON Dd.Id=Qq.Ref AND Q.ChildQuestion=Qq.ChildQuestion ORDER BY Dd.Date LIMIT 1) AS QuestionOrder" +
			", CASE WHEN Answer IS NULL THEN '—' ELSE V.Answer END AS Answer " +
			", CASE WHEN Q.ChildType=@integer OR Q.ChildType=@decimal OR Q.ChildType=@string THEN 1 ELSE NULL END AS IsInputField " +
			", CASE WHEN Q.ChildType=@integer OR Q.ChildType=@decimal THEN 'numeric' ELSE 'auto' END AS KeyboardType " + 
			" FROM Document_Questionnaire D " +
			" JOIN Document_Questionnaire_Questions Q ON D.Id=Q.Ref " +
			" LEFT JOIN Document_Visit_Questions V ON V.Question=Q.ChildQuestion AND V.Ref=@visit " + 
			" WHERE D.Single=@single AND " + str + " AND ((Q.ParentQuestion=@emptyRef) OR Q.ParentQuestion IN (SELECT Question FROM Document_Visit_Questions " +
			" WHERE (Answer='Yes' OR Answer='Да') AND Ref=@visit)) " + 
			" GROUP BY Q.ChildQuestion, Q.ChildDescription, Q.ChildType, Q.ParentQuestion, Answer " + 
			" ORDER BY DocDate, QuestionOrder ");
	query.AddParameter("emptyRef", DB.EmptyRef("Catalog_Question"));
	query.AddParameter("integer", DB.Current.Constant.DataType.Integer);
	query.AddParameter("decimal", DB.Current.Constant.DataType.Decimal);
	query.AddParameter("string", DB.Current.Constant.DataType.String);
	query.AddParameter("visit", $.workflow.visit);
	query.AddParameter("single", single);

	Variables.Add("workflow.questions_qty", query.ExecuteCount());
	
	//find at least one obligatered question, to show special controls
	var res = query.Execute().Unload();	
	var oblText = "";
	var oblInfo = "";
	while (res.Next()) {
		if (parseInt(res.Obligatoriness)!=parseInt(0)){							
			if (String.IsNullOrEmpty(res.Answer) || res.Answer=="—"){
				obligateredLeft = obligateredLeft + parseInt(1);
			}
		}		
	}	
	res.First();
	
	return res;
}

function CreateCondition(list) {
	var str = "";
	var notEmpty = false;
	
	for ( var quest in list) {	
		if (String.IsNullOrEmpty(str)==false){
			str = str + ", ";		
		}
		str = str + " '" + quest.ToString() + "' ";		
		notEmpty = true;
	}
	if (notEmpty){
		str = " D.Id IN ( " + str  + ") ";
	}
	
	return str;
}

function RemovePlaceHolder(control) {
	if (control.Text == "—")
		control.Text = "";
}

function UniqueQuestion(question, answerType, answer, obligatered) {	
	// set answer text
	if (answerType == 'Snapshot')
		answerText = GetSnapshotText(answer);
	else
		answerText = answer;

	return result;
}


function ForwardIsntAllowed() {
	if (parseInt(obligateredLeft)!=parseInt(0))
		return true;
	else
		return false;
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

	if ((answerType).ToString() == (DB.Current.Constant.DataType.ValueList).ToString()) {
		var q = new Query();
		q.Text = "SELECT Value, Value FROM Catalog_Question_ValueList WHERE Ref=@ref";
		q.AddParameter("ref", questionItem);
		ValueListSelect(question, "Answer", q.Execute(), Variables[control]);
	}

	if ((answerType).ToString() == (DB.Current.Constant.DataType.Snapshot).ToString()) {
		GetCameraObject(visit);
		Camera.MakeSnapshot(SaveAtVisit, [ question, control ]);
	}

	if ((answerType).ToString() == (DB.Current.Constant.DataType.DateTime).ToString()) {
		DateTimeDialog(question, "Answer", question.Answer, Variables[control]);
	}

	if ((answerType).ToString() == (DB.Current.Constant.DataType.Boolean).ToString()) {
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