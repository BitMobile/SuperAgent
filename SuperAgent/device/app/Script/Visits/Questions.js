var regularAnswers;
var obligateNumber;
var forwardIsntAllowed;
var regular_answ;
var regular_total;
var single_answ;
var single_total;
var bool_answer;
var questionGl;
var submitCollectionString;

//
// -------------------------------Header handlers-------------------------
//

function OnLoading() {
	obligateNumber = '0';
	forwardIsntAllowed = false;
	SetIndiactors();
	SetListType();
}

function SetListType() {
	if (regularAnswers == null)
	{
		if (parseInt(regular_total) == parseInt(0))
			regularAnswers = false;
		else
			regularAnswers = true;
	}
}

function ChangeListAndRefresh(control, param) {
	regularAnswers = ConvertToBoolean1(param);
	Workflow.Refresh([]);
}

//
// --------------------------------Questions list handlers--------------------------
//

function GetQuestionsByQuestionnaires(outlet) {

	var oblQuest = new Query("SELECT COUNT(DISTINCT Question) FROM USR_Questions WHERE Obligatoriness=1 AND TRIM(IFNULL(Answer, '')) = '' " +
	 	"AND (ParentQuestion=@emptyRef OR ParentQuestion IN (SELECT Question FROM USR_Questions " +
			"WHERE (Answer='Yes' OR Answer='Да')))");
	oblQuest.AddParameter("emptyRef", DB.EmptyRef("Catalog_Question"));

	obligateNumber = oblQuest.ExecuteScalar().ToString();

	if (obligateNumber!='0') {
		forwardIsntAllowed = true;
	}	else {
		forwardIsntAllowed = false;
	}

	var single = 1;

	if (regularAnswers) {
		single = 0;
	}

	// SetIndiactors();

	return GetQuestions(single);

}

function GetQuestions(single) {

	var q = new Query("SELECT DISTINCT UQ.Answer, UQ.AnswerType , UQ.Question, UQ.Description, UQ.Obligatoriness, UQ.IsInputField, UQ.KeyboardType, " +
	//		"CASE WHEN UQ.IsInputField='1' THEN UQ.Answer ELSE " +
				"CASE WHEN TRIM(IFNULL(UQ.Answer, '')) != '' THEN UQ.Answer ELSE '—' END AS AnswerOutput, " +
			"CASE WHEN UQ.AnswerType=@snapshot THEN " +
				"CASE WHEN TRIM(IFNULL(VFILES.FullFileName, '')) != '' THEN LOWER(VFILES.FullFileName) ELSE " +
					"CASE WHEN TRIM(IFNULL(OFILES.FullFileName, '')) != '' THEN LOWER(OFILES.FullFileName) ELSE '/shared/result.jpg' END END ELSE NULL END AS FullFileName " +
			"FROM USR_Questions UQ " +
			"LEFT JOIN Document_Visit_Files VFILES ON VFILES.FileName = UQ.Answer AND VFILES.Ref = @visit " +
			"LEFT JOIN Catalog_Outlet_Files OFILES ON OFILES.FileName = UQ.Answer AND OFILES.Ref = @outlet " +
			"WHERE UQ.Single=@single AND (UQ.ParentQuestion=@emptyRef) AND (UQ.ParentQuestion=@emptyRef)  OR UQ.VersionAnswerValueQuestion IN (SELECT AnswerId FROM USR_Questions )" +
			//"WHERE (Answer='Yes' OR Answer='Да') " +
			"ORDER BY UQ.DocDate, UQ.QuestionOrder ");

	q.AddParameter("emptyRef", DB.EmptyRef("Catalog_Question"));
	q.AddParameter("single", single);
	q.AddParameter("snapshot", DB.Current.Constant.DataType.Snapshot);
	q.AddParameter("visit", $.workflow.visit);
	q.AddParameter("outlet", $.workflow.outlet);

	return q.Execute();

}

function SetIndiactors() {

	var q = new Query("SELECT SUM(CASE WHEN Single = 0 THEN 1 ELSE 0 END) AS RegularTotal, " +
			"SUM(CASE WHEN Single = 1 THEN 1 ELSE 0 END) AS SingleTotal, " +
			"SUM(CASE WHEN Single = 0 AND TRIM(IFNULL(Answer, '')) != '' THEN 1 ELSE 0 END) AS RegularAnsw, " +
			"SUM(CASE WHEN Single = 1 AND TRIM(IFNULL(Answer, '')) != '' THEN 1 ELSE 0 END) AS SingleAnsw " +
			"FROM (SELECT DISTINCT Question, Single, Answer " +
				"FROM USR_Questions " +
				"WHERE ParentQuestion=@emptyRef OR ParentQuestion IN " +
					"(SELECT Question FROM USR_Questions WHERE (Answer='Yes' OR Answer='Да')))");

	q.AddParameter("emptyRef", DB.EmptyRef("Catalog_Question"));

	res = q.Execute();

	res.Next();

	regular_total = res.RegularTotal;
	single_total = res.SingleTotal;
	regular_answ = res.RegularAnsw;
	single_answ = res.SingleAnsw;

	Variables.Add("workflow.questions_qty", (regular_total + single_total));
	Variables.Add("workflow.questions_answ", (regular_answ + single_answ));

}

function HasQuestions(){
	if (regularAnswers && parseInt(regular_total)==parseInt(0))
		return false;
	if (!regularAnswers && parseInt(single_total)==parseInt(0))
		return false;
	return true;
}

function CreateVisitQuestionValueIfNotExists(question, answer, dialogInput) {

	var query = new Query("SELECT Id FROM Document_Visit_Questions WHERE Ref == @Visit AND Question == @Question");

	query.AddParameter("Visit", $.workflow.visit);
	query.AddParameter("Question", question);

	var result = query.ExecuteScalar();

	if (result == null) {

		if (dialogInput || (answer!="—" && TrimAll(answer)!="")) {

			var p = DB.Create("Document.Visit_Questions");

			p.Ref = $.workflow.visit;
			p.Question = question;
			p.AnswerDate = DateTime.Now;
			p.Answer = answer;

			p.Save();

			result = p.Id;

			return result;

		}

	}	else {

		if ((answer=="—" || TrimAll(answer)=="") && dialogInput==false) {

			DB.Delete(result);

		} else{

			var p = result.GetObject();

			p.AnswerDate = DateTime.Now;
			p.Answer = answer;

			p.Save();

			result = p.Id;

			return result;

		}

	}

}

function GoToQuestionAction(answerType, visit, control, questionItem, currAnswer, questionDescription) {

	if (answerType == DB.Current.Constant.DataType.ValueList) {

		var q = new Query();
		q.Text = "SELECT Id, Value FROM Catalog_Question_ValueList WHERE Ref=@ref UNION SELECT '', '—'";
		q.AddParameter("ref", questionItem);

		Dialogs.DoChoose(q.Execute(), questionItem, null, Variables[control], DialogCallBack2, questionDescription);

	} else if (answerType == DB.Current.Constant.DataType.Snapshot) {

		questionGl = questionItem;
		var path = null;
		Images.AddQuestionSnapshot("USR_Questions", questionItem, null, currAnswer, true, questionDescription, GalleryCallBack);

	} else if (answerType == DB.Current.Constant.DataType.DateTime) {

		Dialogs.ChooseDateTime(questionItem, null, Variables[control], DialogCallBack, questionDescription);

	} else if (answerType == DB.Current.Constant.DataType.Boolean) {

		bool_answer = currAnswer;
		Dialogs.ChooseBool(questionItem, null, Variables[control], DialogCallBack, questionDescription);

	}

}

function FormatAndRefresh(control, question, answerType){

	var answer = control.Text;

	if (!String.IsNullOrEmpty(answer) && answerType == DB.Current.Constant.DataType.Integer){

		control.Text = RoundToInt(answer);

		AssignAnswer(control, question, answer, answerType);
	}

	Workflow.Refresh([]);

}

function AssignAnswer(control, question, answer, answerType, idanswer) {

var uidans = '';
if (idanswer != null){

	var qidans =	new Query("select idvalue from Catalog_Question_ValueList WHERE Id = @question");
	qidans.AddParameter("question", idanswer);
	uidans = qidans.ExecuteScalar();

}


	if (control != null) {
		answer = control.Text;
	} else{
		if (answer!=null)
			answer = answer.ToString();
	}
	if (answer == "—" || answer == "-")
		answer = null;

	var answerString;
	if (String.IsNullOrEmpty(answer))
		answerString = "HistoryAnswer ";
	else
		answerString = "@answer ";

		if ($.sessionConst.UseSaveQuest) {
			var existorno = new Query("Select type From sqlite_master where name = 'UT_answerQuest' And type = 'table'");
			var exorno = existorno.ExecuteCount();
			if (exorno == 0) {
			DB.CreateTable("answerQuest", ["id","refPlan","outlet","DateStart","Lattitude","Longitude","question","answer"]);
			}
			var ans = (question.AnswerType == DB.Current.Constant.DataType.DateTime ? Format('{0:dd.MM.yyyy HH:mm}', Date(answer)) : answer);
			var checkansquest = new Query("Select id From UT_answerQuest Where question = @question");
			checkansquest.AddParameter("question",question);
			var counnurows = checkansquest.ExecuteCount();
			if (counnurows>0) {
				var q2 = new Query("UPDATE UT_answerQuest SET answer = '"+ans+"' Where question = @question");
				q2.AddParameter("question",question);
				q2.Execute();
			}else {
				var q2 = new Query("Insert into UT_answerQuest values('"+$.workflow.visit.Id+"','"+Variables["planVisit"]+"','"+$.workflow.outlet+"','"+$.workflow.visit.StartTime+"','"+$.workflow.visit.Lattitude+"','"+$.workflow.visit.Longitude+"','"+question+"','"+ans+"')");
				q2.Execute();
			}

		}
	var q =	new Query("UPDATE USR_Questions SET Answer=" + answerString + ", AnswerId='" + uidans + "', AnswerDate=DATETIME('now', 'localtime') WHERE Question=@question");
	q.AddParameter("answer", (question.AnswerType == DB.Current.Constant.DataType.DateTime ? Format("{0:dd.MM.yyyy HH:mm}", Date(answer)) : answer));
	q.AddParameter("question", question);
	q.Execute();

}

function DialogCallBack2(state, args) {
	var entity = state[0];

	AssignAnswer(null, entity, args.Value, null, args.Result.ToString());

	Workflow.Refresh([]);
}

function DialogCallBack(state, args) {
	var entity = state[0];

	AssignAnswer(null, entity, args.Result);

	Workflow.Refresh([]);
}

function GalleryCallBack(state, args) {
	if (args.Result) {
		AssignAnswer(null, questionGl, state[1]);

		newFile = DB.Create("Document.Visit_Files");
		newFile.Ref = state[0];
		newFile.FileName = state[1];
		newFile.FullFileName = state[2];
		newFile.Save();

		Workflow.Refresh([]);
	}
}

function GetActionAndBack() {
	if ($.workflow.skipTasks) {
		Workflow.BackTo("Outlet");
	} else
		Workflow.Back();
}

function SnapshotExists(filename) {

	return FileSystem.Exists(filename);

}

function AddToSubmitCollection(submitCollectionString, fieldName){
	var submitCollectionString = String.IsNullOrEmpty(submitCollectionString) ? fieldName : (submitCollectionString + ";" + fieldName);
	$.btn_forward.SubmitScope = submitCollectionString; //all the magic is in this strings
	return submitCollectionString;
}
