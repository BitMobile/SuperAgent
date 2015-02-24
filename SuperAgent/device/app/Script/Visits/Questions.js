var questionsAtScreen;
var regularAnswers;
var answerText;
var obligateredLeft;
var regular_answ;
var regular_total;
var single_answ;
var single_total;
var bool_answer;
var curr_item;
var questionGl;
var doRefresh;

//
// -------------------------------Header handlers-------------------------
//

function OnLoading() {
	doRefresh = false;
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

	var oblQuest = new Query("SELECT COUNT(DISTINCT Question) FROM USR_Questions WHERE (RTRIM(Answer)='' OR Answer IS NULL) AND Obligatoriness=1");	
	
	obligateredLeft = oblQuest.ExecuteScalar();
	
	var single = 1;
	if (regularAnswers)	
		single = 0;	
	
	SetIndiactors(single);
	
	return GetQuestions(single, false);
	
}

function GetQuestions(single, doCnt) {	
	var q = new Query("SELECT *, " +
			"CASE WHEN IsInputField='1' THEN Answer ELSE CASE WHEN (RTRIM(Answer)!='' AND Answer IS NOT NULL) THEN Answer ELSE '—' END END AS AnswerOutput " +
			"FROM USR_Questions " +
			"WHERE Single=@single AND ParentQuestion=@emptyRef OR ParentQuestion IN (SELECT Question FROM USR_Questions " +
			"WHERE (Answer='Yes' OR Answer='Да'))");
	q.AddParameter("emptyRef", DB.EmptyRef("Catalog_Question"));
	q.AddParameter("single", single);	
	
	if (doCnt)
		return q.ExecuteCount();
	else
		return q.Execute();
}

function SetIndiactors(res, single) {
	regular_total = GetQuestions(0, true);
	single_total = GetQuestions(1, true);
	regular_answ = GetAnsweredQty(0);
	single_answ = GetAnsweredQty(1);

	Variables.Add("workflow.questions_qty", (regular_total + single_total));
	Variables.Add("workflow.questions_answ", (regular_answ + single_answ));
}

function CreateCondition(list, field) {
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
		str = field + " IN ( " + str  + ") AND ";
	}
	
	return str;
}

function GetAnsweredQty(single) {	
	var q = new Query("SELECT COUNT(Question) FROM USR_Questions WHERE Single=@single AND RTRIM(Answer)!='' AND Answer IS NOT NULL");
	q.AddParameter("single", single);	
	return q.ExecuteScalar();

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
	}
	else{
		if ((answer=="—" || TrimAll(answer)=="") && dialogInput==false)
			DB.Delete(result);
		else{
			var p = result.GetObject();
			p.AnswerDate = DateTime.Now;
			p.Answer = answer;
			p.Save();
			result = p.Id;
			return result;
		}
	}	

}

function GetSnapshotText(text) {
	if (String.IsNullOrEmpty(text))
		return Translate["#noSnapshot#"];
	else
		return Translate["#snapshotAttached#"];
}

function GoToQuestionAction(answerType, visit, control, questionItem, currAnswer) {
	
	var editControl = Variables[control];
	if (editControl.Text=="—")
		editControl.Text = "";
	
	var question = CreateVisitQuestionValueIfNotExists(questionItem, editControl.Text, true);

	if ((answerType).ToString() == (DB.Current.Constant.DataType.ValueList).ToString()) {
		var q = new Query();
		q.Text = "SELECT Value, Value FROM Catalog_Question_ValueList WHERE Ref=@ref";
		q.AddParameter("ref", questionItem);
		
		Dialogs.DoChoose(q.Execute(), question, "Answer", Variables[control], DialogCallBack);
	}

	if ((answerType).ToString() == (DB.Current.Constant.DataType.Snapshot).ToString()) {
		questionGl = question;
		var listChoice = new List;
		listChoice.Add([1, Translate["#makeSnapshot#"]]);
		if ($.sessionConst.galleryChoose)
			listChoice.Add([0, Translate["#addFromGallery#"]]);
		if (String.IsNullOrEmpty(question.Answer)==false)
			listChoice.Add([2, Translate["#clearValue#"]]);		
		Gallery.AddSnapshot(visit, question, SaveAtVisit, listChoice, "document.visit");
	}

	if ((answerType).ToString() == (DB.Current.Constant.DataType.DateTime).ToString()) {
		Dialogs.ChooseDateTime(question, "Answer", Variables[control], DialogCallBack); //(question, "Answer", question.Answer, Variables[control]);
	}

	if ((answerType).ToString() == (DB.Current.Constant.DataType.Boolean).ToString()) {
		bool_answer = currAnswer;
		curr_item = question;
		Dialogs.ChooseBool(question, "Answer", Variables[control], DialogCallBack);
	}

}

function AssignQuestionValue(control, question) {
	doRefresh = true;
	CreateVisitQuestionValueIfNotExists(question, control.Text, false);
}

function DialogCallBack(state, args) {
	
	var entity = AssignDialogValue(state, args);
	var control = state[2];
	var key = args.Result;
	
	if ((bool_answer=='Yes' || bool_answer=='Да') && (key=='No' || key=='Нет')){
		GetChildQuestions();
		var q3 = new Query("SELECT A.Id FROM Catalog_Outlet_AnsweredQuestions A " +
				" JOIN Document_Questionnaire_Schedule SC ON A.Questionaire=SC.Ref " +
				" WHERE A.Ref=@outlet AND A.Question=@question AND A.SKU=@emptySKU AND DATE(A.AnswerDate)>=DATE(SC.BeginAnswerPeriod) " +
				" AND (DATE(A.AnswerDate)<=DATE(SC.EndAnswerPeriod) OR A.AnswerDate='0001-01-01 00:00:00')");
		q3.AddParameter("outlet", $.workflow.outlet);
		q3.AddParameter("question", curr_item.Question);
		q3.AddParameter("emptySKU", DB.EmptyRef("Catalog_SKU"));
		var items = q3.Execute();
		
		while (items.Next()){
			var item = items.Id;
			item = item.GetObject();
			item.Answer = Translate["#NO#"];
			item.Save();
		}
	}
	if ((bool_answer=='Yes' || bool_answer=='Да') && key==null){
		GetChildQuestions();
		var q3 = new Query("SELECT A.Id FROM Catalog_Outlet_AnsweredQuestions A " +
				" JOIN Document_Questionnaire_Schedule SC ON A.Questionaire=SC.Ref " +
				" WHERE A.Ref=@outlet AND A.Question=@question AND A.SKU=@emptySKU AND DATE(A.AnswerDate)>=DATE(SC.BeginAnswerPeriod) " +
				" AND (DATE(A.AnswerDate)<=DATE(SC.EndAnswerPeriod) OR A.AnswerDate='0001-01-01 00:00:00')");
		q3.AddParameter("outlet", $.workflow.outlet);
		q3.AddParameter("question", curr_item.Question);
		q3.AddParameter("emptySKU", DB.EmptyRef("Catalog_SKU"));
		var items = q3.Execute();
		
		while (items.Next()){
			DB.Delete(items.Id);
		}
		
	}
	Workflow.Refresh([]);
}

function SaveAtVisit(arr, args) {	
	var question = questionGl;
	var  path = arr[1];
	if (args.Result) {
		question = question.GetObject();
		question.Answer = path;
		question.Save();
	}
	else
		question.Answer = null;
	Workflow.Refresh([]);
}

function GetChildQuestions() {
	var str = CreateCondition($.workflow.questionnaires, " Q.Ref ");
	var q = new Query("SELECT DISTINCT V.Id, Q.ChildDescription FROM Document_Visit_Questions V " +
			" JOIN Document_Questionnaire_Questions Q ON V.Question=Q.ChildQuestion " +
			" WHERE " + str + " V.Ref=@visit AND Q.ParentQuestion=@parent");			
	q.AddParameter("visit", $.workflow.visit);
	q.AddParameter("parent", curr_item.Question);
	var res1 = q.Execute();
	
	var q2 = new Query("SELECT DISTINCT A.Id, Q.ChildDescription FROM Catalog_Outlet_AnsweredQuestions A " +
			" JOIN Document_Questionnaire_Questions Q ON A.Question=Q.ChildQuestion " +
			" WHERE " + str + " A.Ref=@outlet AND Q.ParentQuestion=@parent AND A.SKU=@emptySKU");
	q2.AddParameter("outlet", $.workflow.outlet);
	q2.AddParameter("parent", curr_item.Question);
	q2.AddParameter("emptySKU", DB.EmptyRef("Catalog_SKU"));
	var res2 = q2.Execute();
	
	var q3 = new Query("SELECT A.Id FROM Catalog_Outlet_AnsweredQuestions A " +
			" JOIN Document_Questionnaire_Schedule SC ON A.Questionaire=SC.Ref " +
			" WHERE A.Ref=@outlet AND A.Question=@question AND A.SKU=@emptySKU AND DATE(A.AnswerDate)>=DATE(SC.BeginAnswerPeriod) " +
			" AND (DATE(A.AnswerDate)<=DATE(SC.EndAnswerPeriod) OR A.AnswerDate='0001-01-01 00:00:00')");
	q3.AddParameter("outlet", $.workflow.outlet);
	q3.AddParameter("question", curr_item.Question);
	q3.AddParameter("emptySKU", DB.EmptyRef("Catalog_SKU"));
	var items = q3.Execute();
	
	while (items.Next()){
		var item = items.Id;
		item = item.GetObject();
		item.Answer = Translate["#NO#"];
		item.Save();
	}
	
	DeleteAnswers(res1);
	DeleteAnswers(res2);
}

function DeleteAnswers(recordset) {	
	while (recordset.Next()){
		DB.Delete(recordset.Id);
	}	
}

/*
 * function SaveValue(control, questionValue){ questionValue =
 * questionValue.GetObject(); questionValue.Save(); }
 */

function GetCameraObject(entity) {
	FileSystem.CreateDirectory("/private/document.visit");
	var guid = Global.GenerateGuid();
	Variables.Add("guid", guid);
	var path = String.Format("/private/document.visit/{0}/{1}.jpg", entity.Id, guid);
	Camera.Size = 300;
	Camera.Path = path;
}

function CheckEmptyQuestionsAndForward(visit) {
	
	if (doRefresh){
		Workflow.Refresh([]);

	}
	else{
		var qr = new Query("SELECT Id FROM Document_Visit_Questions WHERE Answer IS NULL  OR Answer=''");
		var res = qr.Execute();
	
		while (res.Next()) {
			DB.Delete(res.Id);
		}
	
		Workflow.Forward([]);
	}
}


function GetActionAndBack() {
	if ($.workflow.skipTasks) {
		Workflow.BackTo("Outlet");
	} else
		Workflow.Back();
}

function ObligatedAnswered(answer, obligatoriness) {
	if (parseInt(obligatoriness)==parseInt(1)){
		if (String.IsNullOrEmpty(answer)==false & answer!="—")
			return true;
	}
	return false;	
}