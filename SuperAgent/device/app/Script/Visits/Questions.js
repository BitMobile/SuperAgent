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
var buferansw;
var TempControl;
var idPar;
var kolDoch;

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
			"CASE WHEN UQ.IsInputField='1' THEN UQ.Answer ELSE " +
				"CASE WHEN TRIM(IFNULL(UQ.Answer, '')) != '' THEN UQ.Answer ELSE '—' END END AS AnswerOutput, " +
			"CASE WHEN UQ.AnswerType=@snapshot THEN " +
				"CASE WHEN TRIM(IFNULL(VFILES.FullFileName, '')) != '' THEN LOWER(VFILES.FullFileName) ELSE " +
					"CASE WHEN TRIM(IFNULL(OFILES.FullFileName, '')) != '' THEN LOWER(OFILES.FullFileName) ELSE '/shared/result.jpg' END END ELSE NULL END AS FullFileName " +
			"FROM USR_Questions UQ " +
			"LEFT JOIN Document_Visit_Files VFILES ON VFILES.FileName = UQ.Answer AND VFILES.Ref = @visit " +
			"LEFT JOIN Catalog_Outlet_Files OFILES ON OFILES.FileName = UQ.Answer AND OFILES.Ref = @outlet " +
			"WHERE UQ.Single=@single AND (UQ.ParentQuestion=@emptyRef OR UQ.ParentQuestion IN (SELECT Question FROM USR_Questions " +
			"WHERE (Answer='Yes' OR Answer='Да'))) " +
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

function GoToQuestionAction(answerType, visit, control, questionItem, currAnswer, questionDescription, editControl) {
	// function GoToQuestionAction(control, answerType, question, editControl, currAnswer, title)
	idPar = editControl;

	var editControlName = "control"+editControl;
	editControl = Variables["control"+editControl];


	editControl.Enabled = "True";
	var qForKol = new Query("Select Description From USR_Questions Where ParentQuestion==@quest");
	 qForKol.AddParameter("quest", currAnswer);
	 //qForKol.AddParameter("emptyPar",DB.EmptyRef("Catalog_Question"));
	 kolDoch = qForKol.ExecuteCount();

/////////////// if ValueList

	if (answerType == DB.Current.Constant.DataType.ValueList) {
		var q = new Query();
		q.Text = "SELECT Value, Value FROM Catalog_Question_ValueList WHERE Ref=@ref UNION SELECT '', '—' ORDER BY Value";
		q.AddParameter("ref", questionItem);
		TempControl = editControl;
		if (String.IsNullOrEmpty(editControl.Text) || editControl.Text == "" || editControl.Text == "-" || editControl.Text == "—") {
					buferansw = true;
				 }
				 else {
					buferansw = false;
				 }

		Dialogs.DoChoose(q.Execute(), questionItem, null, editControl, DialogCallBackBool, questionDescription);

/////////////// if SnapShot
	} else if (answerType == DB.Current.Constant.DataType.Snapshot) {
		questionGl = questionItem;
		var qForAns = new Query("Select Answer From USR_Questions Where Question=@quest");
		qForAns.AddParameter("quest",questionItem);
		currAnswer = qForAns.ExecuteScalar();
		if (String.IsNullOrEmpty(currAnswer)) {
					buferansw = true;
				 }
				 else {
					buferansw = false;
				 }
				 Dialog.Debug(currAnswer);
		var path = null;
		AddQuestionSnapshot("USR_Questions", questionItem, currAnswer, true, questionDescription, GalleryCallBack);
	// if (answerType == DB.Current.Constant.DataType.Snapshot)
	//
	// 	questionGl = questionItem;
	// 	var path = null;
	// 	Images.AddQuestionSnapshot("USR_Questions", questionItem, null, currAnswer, true, questionDescription, GalleryCallBack);
/////////////// if DataTime
	} else if (answerType == DB.Current.Constant.DataType.DateTime) {
		TempControl = editControl;
		if (String.IsNullOrEmpty(currAnswer)) {
					buferansw = true;
				 }
				 else {
					buferansw = false;
				 }

		Dialogs.ChooseDateTime(questionItem, null, editControl, DialogCallBackBool, questionDescription);
/////////////// if Boolean
	} else if (answerType == DB.Current.Constant.DataType.Boolean) {
		TempControl = editControl;
		bool_answer = currAnswer;
		if (String.IsNullOrEmpty(editControl.Text) || editControl.Text == "" || editControl.Text == "-" || editControl.Text == "—" || editControl.Text == "Нет" || editControl.Text == "No") {
					buferansw = true;
				 }
				 else {
					buferansw = false;
				 }
		Dialogs.ChooseBool(questionItem, null, editControl, DialogCallBackBool, questionDescription);
	}

}

function FormatAndRefresh(control, question, answerType, indexpar, reqorno){
// function RefreshScreen(control, {search, sku,} question, answerType, indexpar, answerednow,totalanswred,reqorno)
	var answer = control.Text;

	if (!String.IsNullOrEmpty(answer) && answerType == DB.Current.Constant.DataType.Integer){

		control.Text = RoundToInt(answer);

		AssignAnswer(control, question, answer, answerType);
	}
	var havenewotv = String.IsNullOrEmpty(answer);
	if (!(havenewotv^buferansw)) {

	}
	if (buferansw && !havenewotv) {
		single_answ = parseInt(single_answ) + 1;
		regular_answ = parseInt(regular_answ) + 1;
	}
	if (!buferansw && havenewotv) {
		single_answ = parseInt(single_answ) - 1;
		regular_answ = parseInt(regular_answ) - 1;
	}
	if (regularAnswers) {
		$.CountRegAnswer.Text = Translate["#regular#"] + " (" +regular_answ + " " + Translate["#of#"] + " " + regular_total + ")";
	}else {

		$.CountNoNRegAnswer.Text = Translate["#nonregular#"] + " (" +single_answ + " " + Translate["#of#"] + " " + single_total + ")";
	}
	// if (reqorno == 1) {
	// 	var obl =new Query("SELECT Question FROM USR_Questions WHERE Obligatoriness = @obl And Answer IS NULL");
	// 	obl.AddParameter("obl",1);
	// 	var rez = obl.ExecuteCount();
	// 	if (rez > 0) {
	// 		//Dialog.Message("ParentReq"+idChail);
	// 		//Variables["ParentReq"+idChail].Refresh();
	// 		if (Variables.Exists("ParentReq"+idChail)) {
	// 			Variables["ParentReq"+idChail].CssClass = "required_side_wh";
	// 			Variables["ParentReq"+idChail].Refresh();
	// 		}
	// 	}
	// 	if (rez == 0) {
	// 		if (Variables.Exists("ParentReq"+idChail)) {
	// 		Variables["ParentReq"+idChail].CssClass = "answered_side_wh";
	// 		Variables["ParentReq"+idChail].Refresh();
	// 	}
	// 	}
	// }
	// obligateredLeft = obligateredLeft - 1;
	if (reqorno==1 && (buferansw && !havenewotv)) {
		obligateNumber = parseInt(obligateNumber) - 1;
		if (obligateNumber==0) {
			if (Variables.Exists("obligateredButton")) {
				Variables["obligateredButton"].Text = "";
			}
			if (Variables.Exists("imagForw")) {
				Variables["imagForw"].CssClass = "imgForw";
				Variables["imagForw"].Refresh();
			}
			if (Variables.Exists("TextForw")) {
				Variables["TextForw"].Text = Translate["#forward#"];
				Variables["TextForw"].Refresh();
				Variables["TextForw"].CssClass = "TextViewInTopNorm";
				Variables["TextForw"].Refresh();
			}
		}else {
			if (Variables.Exists("obligateredInfo")) {
				Variables["obligateredInfo"].Text = obligateNumber;
			}
			if (Variables.Exists("obligateredButton")) {
			Variables["obligateredButton"].Text = obligateNumber+")";
			}
		}
		if (Variables.Exists("Req"+idPar)) {
			Variables["Req"+idPar].CssClass = "answered_side_gr";
			Variables["Req"+idPar].Refresh();
		}
	}
	if (reqorno==1 && (!buferansw && havenewotv)) {
		obligateNumber = parseInt(obligateNumber) + 1;
		if (Variables.Exists("obligateredInfo")) {
			Variables["obligateredButton"].Text = obligateNumber+")";
			Variables["obligateredInfo"].Text = obligateNumber;
		}
		if (Variables.Exists("Req"+idPar)) {
			Variables["Req"+idPar].CssClass = "required_side_gr";
			Variables["Req"+idPar].Refresh();
		}

	}

}

function AssignAnswer(control, question, answer, answerType) {

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
	var q =	new Query("UPDATE USR_Questions SET Answer=" + answerString + ", AnswerDate=DATETIME('now', 'localtime') WHERE Question=@question");
	q.AddParameter("answer", (question.AnswerType == DB.Current.Constant.DataType.DateTime ? Format("{0:dd.MM.yyyy HH:mm}", Date(answer)) : answer));
	q.AddParameter("question", question);
	q.Execute();

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
	var weHaveIt = Variables.Exists("controlVert"+idPar);

	if (weHaveIt) {
		if (Variables.Exists("controlVertIn"+idPar)) {
			if (Variables.Exists("control"+idPar)) {
				if (Variables["control"+idPar].CssClass == "answer_snapshot") {
				}else {
					for(control in Variables["controlVertIn"+idPar].Controls)
					control.remove();
					Variables["controlVertIn"+idPar].after("<c:Image Id='control"+idPar+"' CssClass='answer_snapshot'></c:Image>").refresh();
					Variables["controlVertIn"+idPar].remove();
				}
			}else {
				for(control in Variables["controlVertIn"+idPar].Controls)
				control.remove();
				Variables["controlVertIn"+idPar].after("<c:Image Id='control"+idPar+"' CssClass='answer_snapshot'></c:Image>").refresh();
				Variables["controlVertIn"+idPar].remove();
			}

		}
	}
if (Variables.Exists("control"+idPar)) {
	Variables["control"+idPar].CssClass = "answer_snapshot";
	Variables["control"+idPar].Refresh();
	Variables["control"+idPar].Source = newFile.FullFileName;
	Variables["control"+idPar].Refresh();
}
if (Variables.Exists("controlVert"+idPar)) {
	Variables["controlVert"+idPar].Refresh();
}
		//
		// var answerednow = answerinsku;
		// var totalanswred = totalanswerinsku;
		//
		// var parentCount = Variables["CountOnPar"+idChail];
	if (buferansw) {
		// answerednow = answerednow + 1;
		if (regularAnswers) {
			regular_answ = regular_answ + 1;
		}else {
			single_answ = single_answ + 1;
		}
	}
	if (Variables.Exists("Req"+idPar)) {
		Variables["Req"+idPar].CssClass = "answered_side_gr";
		Variables["Req"+idPar].Refresh();
	}

	// parentCount.Text = answerednow + " " + Translate["#of#"] + " " + totalanswred;

	if (regularAnswers) {
		$.CountRegAnswer.Text = Translate["#regular#"] + " (" +regular_answ + " " + Translate["#of#"] + " " + regular_total + ")";
	}else {

		$.CountNoNRegAnswer.Text = Translate["#nonregular#"] + " (" +single_answ + " " + Translate["#of#"] + " " + single_total + ")";
	}

 	var q = new Query("SELECT DISTINCT S.Question, S.Description " +
    "FROM USR_Questions S " +
    "WHERE (RTRIM(Answer)='' OR S.Answer IS NULL) AND S.Obligatoriness=1 " +
    "AND (S.ParentQuestion=@emptyRef OR S.ParentQuestion IN (SELECT SS.Question FROM USR_Questions SS " +
      "WHERE (SS.Answer='Yes' OR SS.Answer='Да')))");
q.AddParameter("emptyRef", DB.EmptyRef("Catalog_Question"));
obligateNumber = q.ExecuteCount().ToString();
if (obligateNumber==0) {
	if (Variables.Exists("obligateredAnsw")) {
			Variables["obligateredAnsw"].CssClass = "margin_top";
			Variables["obligateredAnsw"].Refresh();
	}
	if (Variables.Exists("obligateredButton")) {
		Variables["obligateredButton"].Text = "";
	}
  if (Variables.Exists("imagForw")) {
		Variables["imagForw"].CssClass = "imgForw";
		Variables["imagForw"].Refresh();
  }
	if (Variables.Exists("TextForw")) {
		Variables["TextForw"].Text = Translate["#forward#"];
		Variables["TextForw"].Refresh();
		Variables["TextForw"].CssClass = "TextViewInTopNorm";
		Variables["TextForw"].Refresh();
	}

}else {
	if (Variables.Exists("obligateredAnsw")) {
			Variables["obligateredAnsw"].CssClass = "required_grid";
			Variables["obligateredAnsw"].Refresh();
	}
	if (Variables.Exists("obligateredInfo")) {
		Variables["obligateredInfo"].Text = obligateNumber;
	}
	if (Variables.Exists("obligateredButton")) {
		Variables["obligateredButton"].Text = obligateNumber+")";
	}
}
// var obl =new Query("SELECT Question FROM USR_SKUQuestions WHERE Obligatoriness = @obl And SKU = @sku And Answer IS NULL");
// obl.AddParameter("obl",1);
// obl.AddParameter("sku",skuValueGl);
// var rez = obl.ExecuteCount();
// if (rez > 0) {
//   //Dialog.Message("ParentReq"+idChail);
//   //Variables["ParentReq"+idChail].Refresh();
// 		if (Variables.Exists("ParentReq"+idChail)) {
// 	  Variables["ParentReq"+idChail].CssClass = "required_side_wh";
// 	  Variables["ParentReq"+idChail].Refresh();
// 		}
// }
// if (rez == 0) {
// 	if (Variables.Exists("ParentReq"+idChail)) {
// 	  Variables["ParentReq"+idChail].Refresh();
// 		Variables["ParentReq"+idChail].CssClass = "answered_side_wh";
// 	  Variables["ParentReq"+idChail].Refresh();
// 		}
// }


		//Workflow.Refresh([]);
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

function GetImagePath(visitID, outletID, pictID, pictExt) {
	var pathFromVisit = Images.FindImage(visitID, pictID, pictExt, "Document_Visit_Files");
	var pathFromOutlet = Images.FindImage(outletID, pictID, pictExt, "Catalog_Outlet_Files");
	return (pathFromVisit == "/shared/result.jpg" ? pathFromOutlet : pathFromVisit);
}

function DialogCallBackBool(state, args){
	var entity = state[0];
	AssignAnswer(null, entity, args.Result);
	//var controlField = idBool;
	TempControl.Text = args.Result;
	var ShowDoch = false;

	if (kolDoch>0) {
		ShowDoch = true;
	}
	if (ShowDoch) {

		Workflow.Refresh([]);

	}else {


		var weHaveObl = false;
		for(control in Variables["DockLa"+idPar].Controls){

			if (control.Id == "Req"+idPar) {
					weHaveObl=true;
					break;
			}
		}
		if (ToString(args.Result)!="-" && ToString(args.Result)!="" && ToString(args.Result)!="—") {

			if (buferansw) {

				if (regularAnswers) {
					regular_answ = regular_answ + 1;
				}else {
					single_answ = single_answ + 1;
				}
			}
			if (weHaveObl) {
				if (Variables.Exists("Req"+idPar)) {
					Variables["Req"+idPar].CssClass = "answered_side_gr";
					Variables["Req"+idPar].Refresh();
				}
			}

		}else {
			if (!buferansw) {

				if (regularAnswers) {
					regular_answ = regular_answ - 1;
				}else {
					single_answ = single_answ - 1;
				}
			}
			TempControl.Text = "—";
			if (weHaveObl) {
				if (Variables.Exists("Req"+idPar)) {
					Variables["Req"+idPar].CssClass = "required_side_gr";
					Variables["Req"+idPar].Refresh();
				}
			}
		}


		if (regularAnswers) {
			$.CountRegAnswer.Text = Translate["#regular#"] + " (" +regular_answ + " " + Translate["#of#"] + " " + regular_total + ")";
		}else {

			$.CountNoNRegAnswer.Text = Translate["#nonregular#"] + " (" +single_answ + " " + Translate["#of#"] + " " + single_total + ")";
		}
		var q = new Query("SELECT DISTINCT S.Question, S.Description " +
		    "FROM USR_Questions S " +
		    "WHERE (RTRIM(Answer)='' OR S.Answer IS NULL) AND S.Obligatoriness=1 " +
		    "AND (S.ParentQuestion=@emptyRef OR S.ParentQuestion IN (SELECT SS.Question FROM USR_Questions SS " +
		      "WHERE (SS.Answer='Yes' OR SS.Answer='Да')))");
		q.AddParameter("emptyRef", DB.EmptyRef("Catalog_Question"));
		obligateNumber = q.ExecuteCount().ToString();
		if (obligateNumber==0) {
			if (Variables.Exists("obligateredAnsw")) {
					Variables["obligateredAnsw"].CssClass = "margin_top";
					Variables["obligateredAnsw"].Refresh();
			}
			if (Variables.Exists("obligateredButton")) {
				Variables["obligateredButton"].Text = "";
			}
			if (Variables.Exists("imagForw")) {
			  Variables["imagForw"].CssClass = "imgForw";
			  Variables["imagForw"].Refresh();
			}
			if (Variables.Exists("TextForw")) {
				Variables["TextForw"].Text = Translate["#forward#"];
				Variables["TextForw"].Refresh();
				Variables["TextForw"].CssClass = "TextViewInTopNorm";
				Variables["TextForw"].Refresh();
			}

		}else {
			if (Variables.Exists("obligateredAnsw")) {
					Variables["obligateredAnsw"].CssClass = "required_grid";
					Variables["obligateredAnsw"].Refresh();
			}
			if (Variables.Exists("obligateredInfo")) {
				Variables["obligateredInfo"].Text = obligateNumber;
				Variables["obligateredButton"].Text = obligateNumber+")";
			}
		}
	}
}


function BuferAns(control){
	if (String.IsNullOrEmpty(control.Text)) {
			 	buferansw = true;
			 }
			 else {
			 	buferansw = false;
			 }
}

function AddQuestionSnapshot(tableName, question, answer, previewAllowed, title, func) {
	title = String.IsNullOrEmpty(title) ? Translate["#snapshot#"] : title;
	if (String.IsNullOrEmpty(answer) && !$.sessionConst.galleryChoose)
		Images.MakeSnapshot($.workflow.visit, func);
	else{

		if (String.IsNullOrEmpty(answer)==false)
		path = Images.FindImage($.workflow.visit, answer, ".jpg", "Document_Visit_Files");

		var listChoice = new List;
		if ($.sessionConst.galleryChoose) //if Gallery is allowed
			listChoice.Add([0, Translate["#addFromGallery#"]]);
		listChoice.Add([1, Translate["#makeSnapshot#"]]);
		if (previewAllowed && String.IsNullOrEmpty(answer)==false && FileSystem.Exists(path)) //if not an Image.xml screen
			listChoice.Add([3, Translate["#show#"]]);
		if (String.IsNullOrEmpty(answer)==false && previewAllowed)
			listChoice.Add([2, Translate["#clearValue#"]]);

		Dialog.Choose(title, listChoice, AddSnapshotHandler, [$.workflow.visit, func, tableName, path, question]);
	}
}

function AddSnapshotHandler(state, args) {
	var objRef = state[0];
	var func = state[1];
	var valueRef = state[2];
	if (parseInt(args.Result)==parseInt(0)){ 	//Gallery answer
		Images.ChooseFromGallery(objRef, func);
	}

	if (parseInt(args.Result)==parseInt(1)){ 	//SnapshotAnswer
		Images.MakeSnapshot(objRef, func);
	}

	if (parseInt(args.Result)==parseInt(2)){ 	//Delete answer
		if (getType(valueRef)=="System.String") 	//for Questions, SKUQuestions
			DeleteFromTableSku(state[4]);
		else
			DeleteImageSku(valueRef); 		//common delete handler
	}

	if (parseInt(args.Result)==parseInt(3)){ 	//Show answer
		var path = state[3];
		var attr;
		if (getType(valueRef)=="System.String"){ 	//for Questions/SKUQuestions, callback from AddQuestionSnapshot()
			valueRef = state[4];
			attr = state[5];
		}
		else{ 		//common handler
			if (valueRef!=null)
				attr = parameters[valueRef.Metadata().TableName];
		}

		var arr = [path, valueRef, attr];
		if (valueRef != null){
			if (valueRef.Metadata().TableName=="Catalog_SKU")
				arr = [path, valueRef, attr, true];
		}

		Workflow.Action("ShowImage", arr);
	}
}

function DeleteImageSku(valueRef) {
	if (valueRef.IsNew()){
		DB.Delete(valueRef);
		//Workflow.Refresh([]);
	}
	else{
		var index = parameters[valueRef.Metadata().TableName];
		var value = valueRef.GetObject();

		if (valueRef.Metadata().TableName == "Catalog_Outlet_Snapshots") {
			value.Deleted = true;
		} else {
			value[index] = "";
		}

		value.Save();
		//Workflow.Refresh([]);
	}
}

function DeleteFromTableSku(question) {
	var answerString = "HistoryAnswer ";

	var tableName = "USR_Questions";

	var q = new Query();

	q.Text = "UPDATE " + tableName + " SET Answer=" + answerString + ", AnswerDate=DATETIME('now', 'localtime') " +
		"WHERE Question=@question";
	q.AddParameter("answer", null);
	q.AddParameter("question", question);
	q.Execute();
	if (Variables.Exists("control"+idPar)) {
		Variables["control"+idPar].remove();
		var textToAppend = "<c:VerticalLayout Id='controlVertIn"+idPar+"' CssClass='no_child_answer'>"
		+"<c:Image Id='control"+idPar+"'/>"
		+"</c:VerticalLayout>";
		Variables["controlVert"+idPar].append(textToAppend).refresh();
	}

		if (regularAnswers) {
			regular_answ = regular_answ - 1;
		}else {
			single_answ = single_answ - 1;
		}
		if (Variables.Exists("Req"+idPar)) {
			Variables["Req"+idPar].CssClass = "required_side_gr";
			Variables["Req"+idPar].Refresh();
		}

	if (regularAnswers) {
		$.CountRegAnswer.Text = Translate["#regular#"] + " (" +regular_answ + " " + Translate["#of#"] + " " + regular_total + ")";
	}else {

		$.CountNoNRegAnswer.Text = Translate["#nonregular#"] + " (" +single_answ + " " + Translate["#of#"] + " " + single_total + ")";
	}

	var q = new Query("SELECT DISTINCT S.Question, S.Description " +
	    "FROM USR_Questions S " +
	    "WHERE (RTRIM(Answer)='' OR S.Answer IS NULL) AND S.Obligatoriness=1 " +
	    "AND (S.ParentQuestion=@emptyRef OR S.ParentQuestion IN (SELECT SS.Question FROM USR_Questions SS " +
	      "WHERE (SS.Answer='Yes' OR SS.Answer='Да')))");
	q.AddParameter("emptyRef", DB.EmptyRef("Catalog_Question"));
	obligateNumber = q.ExecuteCount().ToString();
	if (obligateNumber==0) {

		if (Variables.Exists("obligateredButton")) {
			Variables["obligateredButton"].Text = "";
		}
		if (Variables.Exists("imagForw")) {
			Variables["imagForw"].CssClass = "imgForw";
			Variables["imagForw"].Refresh();
		}

		if (Variables.Exists("TextForw")) {
			Variables["TextForw"].Text = Translate["#forward#"];
			Variables["TextForw"].Refresh();
			Variables["TextForw"].CssClass = "TextViewInTopNorm";
			Variables["TextForw"].Refresh();
		}

	}else {
		if (Variables.Exists("obligateredInfo")) {
			Variables["obligateredInfo"].Text = obligateNumber;
		}
		if (Variables.Exists("obligateredButton")) {
			Variables["obligateredButton"].Text = obligateNumber+")";
		}
	}
}

function CountResultAndForward() {



	var q = regular_total + single_total;
	$.workflow.Add("questions_qty", q);

	var a = regular_answ + single_answ;
	$.workflow.Add("questions_answ", a);

	if (obligateNumber==0) {
		Workflow.Forward([]);
}
}
