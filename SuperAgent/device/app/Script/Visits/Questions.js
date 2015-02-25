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
			"CASE WHEN IsInputField='1' THEN Answer ELSE " +
				"CASE WHEN (RTRIM(Answer)!='' AND Answer IS NOT NULL) THEN CASE WHEN AnswerType=@snapshot THEN @attached ELSE Answer END ELSE '—' END END AS AnswerOutput " +
			"FROM USR_Questions " +
			"WHERE Single=@single AND ParentQuestion=@emptyRef OR ParentQuestion IN (SELECT Question FROM USR_Questions " +
			"WHERE (Answer='Yes' OR Answer='Да'))");
	q.AddParameter("emptyRef", DB.EmptyRef("Catalog_Question"));
	q.AddParameter("single", single);	
	q.AddParameter("snapshot", DB.Current.Constant.DataType.Snapshot);
	q.AddParameter("attached", Translate["#snapshotAttached#"]);
	
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

	if ((answerType).ToString() == (DB.Current.Constant.DataType.ValueList).ToString()) {
		var q = new Query();
		q.Text = "SELECT Value, Value FROM Catalog_Question_ValueList WHERE Ref=@ref";
		q.AddParameter("ref", questionItem);
		
		Dialogs.DoChoose(q.Execute(), questionItem, null, Variables[control], DialogCallBack);
	}

	if ((answerType).ToString() == (DB.Current.Constant.DataType.Snapshot).ToString()) {
		var question = CreateVisitQuestionValueIfNotExists(questionItem, editControl.Text, true);
		questionGl = question;
		var listChoice = new List;
		listChoice.Add([1, Translate["#makeSnapshot#"]]);
		if ($.sessionConst.galleryChoose)
			listChoice.Add([0, Translate["#addFromGallery#"]]);
		if (String.IsNullOrEmpty(question.Answer)==false)
			listChoice.Add([2, Translate["#clearValue#"]]);		
		AddSnapshot(visit, question, GalleryCallBack, listChoice, "document.visit");
	}

	if ((answerType).ToString() == (DB.Current.Constant.DataType.DateTime).ToString()) {
		Dialogs.ChooseDateTime(questionItem, null, Variables[control], DialogCallBack); //(question, "Answer", question.Answer, Variables[control]);
	}

	if ((answerType).ToString() == (DB.Current.Constant.DataType.Boolean).ToString()) {
		bool_answer = currAnswer;
		Dialogs.ChooseBool(questionItem, null, Variables[control], DialogCallBack);
	}

}

function AssignQuestionValue(control, question) {
	AssignAnswer(question, control.Text);
}

function AssignAnswer(control, question, answer) { 
	Dialog.Debug(question);
	Dialog.Debug(answer);

	if (control!=null)
		answer = control.Text;
	var q = new Query("UPDATE USR_Questions SET Answer=@answer, AnswerDate=DATETIME('now') WHERE Question=@question");
	q.AddParameter("answer", answer);
	q.AddParameter("question", question);
	q.Execute();
}

function DialogCallBack(state, args) {	
	var entity = state[0];
	AssignAnswer(null, entity, args.Result);
	
	Workflow.Refresh([]);
}

function GalleryCallBack(state, args) {
	var question = questionGl;	
	AssignAnswer(null, question["Question"], state[1]);
	Workflow.Refresh([]);
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


//--------------------------------Gallery handlers----------------

function AddSnapshot(objectRef, valueRef, func, listChoice, objectType) {
	Dialog.Choose(Translate["#choose_action#"], listChoice, AddSnapshotHandler, [objectRef,func,valueRef,objectType]);		
}

function AddSnapshotHandler(state, args) {	
	var objRef = state[0];
	var func = state[1];
	var valueRef = state[2];
	var objectType = state[3];
	
	if (parseInt(args.Result)==parseInt(0)){	
		var pictId = GenerateGuid();				
		var path = GetPrivateImagePath(objectType, objRef, pictId, ".jpg");
		Gallery.Size = 300;
		Gallery.Copy(path, func, [objRef, pictId]);					
	}
	
	if (parseInt(args.Result)==parseInt(1)){
		var pictId = GetCameraObject(objRef);
		var path = GetPrivateImagePath(objectType, objRef, pictId, ".jpg");
		Camera.MakeSnapshot(path, 300, func, [ objRef, pictId]);
	}
	
	if (parseInt(args.Result)==parseInt(2)){
		Dialog.Debug("1");
		AssignAnswer(null, questionGl["Question"], "");
		Workflow.Refresh([]);
	}
}
