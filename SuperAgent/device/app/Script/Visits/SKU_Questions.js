var skuOnScreen;
var regularAnswers;
var parentId;
var obligateredLeft;


//
//-------------------------------Header handlers-------------------------
//


function OnLoading(){
	skuOnScreen = null;
	obligateredLeft = parseInt(0);
	SetListType();
}

function SetListType(){
	if (regularAnswers==null)
		regularAnswers = true;
}

function ChangeListAndRefresh(control, param) {
	regularAnswers	= ConvertToBoolean1(param);	
	parentId = null;
	Workflow.Refresh([]);
}

//
//--------------------------------Questions list handlers--------------------------
//


function GetSKUsFromQuesionnaires(search) {

	var str = CreateCondition($.workflow.questionnaires, " D.Id ");
	var single = 1;
	if (regularAnswers)	
		single = 0;
	
	var queryQty = new Query( "SELECT DISTINCT Q.ChildQuestion, S.Description " +
			" FROM Document_Questionnaire D " +
			" JOIN Document_Questionnaire_SKUQuestions Q ON D.Id=Q.Ref " +
			" JOIN Document_Questionnaire_SKUs S ON S.Ref=D.Id " +
			" LEFT JOIN Document_Visit_SKUs V ON V.Question=Q.ChildQuestion AND S.SKU=V.SKU " +
			" AND V.Ref=@visit " +
			" WHERE " + str + " ((Q.ParentQuestion=@emptyRef) OR Q.ParentQuestion IN (SELECT Question FROM Document_Visit_SKUs " +
			" WHERE (Answer='Yes' OR Answer='Да') AND Ref=@visit)) AND Obligatoriness=1 " +
			" AND (Answer IS NULL OR Answer='—' OR Answer='')");
	queryQty.AddParameter("emptyRef", DB.EmptyRef("Catalog_Question"));
	queryQty.AddParameter("visit", $.workflow.visit);
	obligateredLeft = queryQty.ExecuteCount();
	
	var searchString = "";
	if (String.IsNullOrEmpty(search) == false)
		searchString = " Contains(S.Description, '" + search + "') AND ";
	
	var q = new Query();
	q.Text="SELECT DISTINCT S.SKU, S.Description " +
			" , MAX(CAST(Q.Obligatoriness as int)) as Obligatoriness " +
			" , (SELECT COUNT(DISTINCT Q.ChildDescription) FROM Document_Questionnaire D " +
				" JOIN Document_Questionnaire_SKUQuestions Q ON D.Id=Q.Ref" +
				" WHERE D.Single=@single AND Q.ParentQuestion=@emptyRef " +
				" OR Q.ParentQuestion IN (SELECT Question FROM Document_Visit_SKUs " +
				" WHERE (Answer='Yes' OR Answer='Да') AND Ref=@visit AND SKU=S.SKU) AND Single=@single) AS Total " +
			" , (SELECT COUNT(DISTINCT Question) FROM Document_Visit_SKUs WHERE Ref=@visit AND SKU=S.SKU) AS Answered " +				
			" FROM Document_Questionnaire D JOIN Document_Questionnaire_SKUs S ON D.Id=S.Ref " +
			" JOIN Document_Questionnaire_SKUQuestions Q ON D.Id=Q.Ref " +
			" LEFT JOIN Document_Visit_SKUs VS ON VS.SKU=S.SKU AND VS.Question=Q.ChildQuestion AND VS.Ref=@visit " +
			" WHERE D.Single=@single AND " + str + searchString +
			" ((Q.ParentQuestion=@emptyRef) OR Q.ParentQuestion IN (SELECT Question FROM Document_Visit_SKUs " +
			" WHERE (Answer='Yes' OR Answer='Да') AND Ref=@visit)) " +
			" GROUP BY S.SKU, S.Description ORDER BY S.Description"; 
	q.AddParameter("emptyRef", DB.EmptyRef("Catalog_Question"));
	q.AddParameter("visit", $.workflow.visit);
	q.AddParameter("single", single);	

	return q.Execute();
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

function ForwardIsntAllowed() {
	if (parseInt(obligateredLeft)!=parseInt(0))
		return true;
	else
		return false;
}

function ShowChilds(index) {	
	var s = "p" + index; 
	if (s == parentId)
		return true;
	else
		return false;
}

function GetChilds(sku) {
	var str = CreateCondition($.workflow.questionnaires, " D.Id ");
	
	var single = 1;
	if (regularAnswers)	
		single = 0;
	
	var q = new Query();
	q.Text = "SELECT MIN(D.Date) AS DocDate, Q.ChildQuestion AS Id, Q.ChildDescription AS Description " +
			", Q.ChildType AS AnswerType, MAX(CAST(Q.Obligatoriness AS int)) AS Obligatoriness " +
			", (SELECT Qq.QuestionOrder FROM Document_Questionnaire Dd  " +
			" JOIN Document_Questionnaire_SKUQuestions Qq ON Dd.Id=Qq.Ref AND Q.ChildQuestion=Qq.ChildQuestion ORDER BY Dd.Date LIMIT 1) AS QuestionOrder" +
			", CASE WHEN V.Answer IS NULL OR V.Answer='' THEN CASE WHEN A.Answer IS NOT NULL THEN A.Answer ELSE '—' END ELSE V.Answer END AS Answer " +
			", CASE WHEN Q.ChildType=@integer OR Q.ChildType=@decimal OR Q.ChildType=@string THEN 1 ELSE NULL END AS IsInputField " +
			", CASE WHEN Q.ChildType=@integer OR Q.ChildType=@decimal THEN 'numeric' ELSE 'auto' END AS KeyboardType " + 
			" FROM Document_Questionnaire D " +
			" JOIN Document_Questionnaire_SKUQuestions Q ON D.Id=Q.Ref " +
			" JOIN Document_Questionnaire_SKUs S ON D.Id=S.Ref AND S.SKU=@sku " +
			" JOIN Document_Questionnaire_Schedule SC ON SC.Ref=D.Id AND date(SC.Date)=date('now','start of day') " +
			" LEFT JOIN Document_Visit_SKUs V ON V.Question=Q.ChildQuestion AND V.Ref=@visit AND V.SKU=S.SKU " + 
			" LEFT JOIN Catalog_Outlet_AnsweredQuestions A ON A.Ref = @emptyRef AND A.Questionaire=D.Id " +
			" AND A.Question=Q.ChildQuestion AND A.SKU=S.SKU AND A.AnswerDate>=SC.BeginAnswerPeriod " +
			" AND (A.AnswerDate<=SC.EndAnswerPeriod OR A.AnswerDate='0001-01-01 00:00:00') " +
			" WHERE D.Single=@single AND " + str + " ((Q.ParentQuestion=@emptyRef) OR Q.ParentQuestion IN (SELECT Question FROM Document_Visit_SKUs " +
			" WHERE (Answer='Yes' OR Answer='Да') AND Ref=@visit AND SKU=@sku)) " + 
			" GROUP BY Q.ChildQuestion, Q.ChildDescription, Q.ChildType, Q.ParentQuestion, Answer " + 
			" ORDER BY DocDate, QuestionOrder ";
	q.AddParameter("emptyRef", DB.EmptyRef("Catalog_Question"));
	q.AddParameter("integer", DB.Current.Constant.DataType.Integer);
	q.AddParameter("decimal", DB.Current.Constant.DataType.Decimal);
	q.AddParameter("string", DB.Current.Constant.DataType.String);
	q.AddParameter("visit", $.workflow.visit);
	q.AddParameter("single", single);
	q.AddParameter("sku", sku);
	
	return q.Execute();
}


function AssignQuestionValue(control, sku, question) {
	CreateVisitSKUValueIfNotExists(sku, question, control.Text)
}

function RemovePlaceHolder(control) {
	if (control.Text == "—")
		control.Text = "";
}

function RefreshScreen(control, search) {
	Workflow.Refresh([search]);
}

// ------------------------SKU----------------------

function CreateItemAndShow(control, sku, index) {
	parentId = "p" + index;
	Workflow.Refresh([]);
}



function CreateVisitSKUValueIfNotExists(control, sku, question) {
	
	var query = new Query();
	query.Text = "SELECT Id FROM Document_Visit_SKUs WHERE SKU=@sku AND Question=@question AND Ref=@ref";
	query.AddParameter("ref", $.workflow.visit);
	query.AddParameter("question", question);
	query.AddParameter("sku", sku);
	var skuValue = query.ExecuteScalar();
	
	if (skuValue == null){		
		skuValue = DB.Create("Document.Visit_SKUs");
		skuValue.Ref = $.workflow.visit;
		skuValue.SKU = sku;
		skuValue.Question = question;
	}
	else
		skuValue = skuValue.GetObject();
	skuValue.Answer = control.Text;
	skuValue.AnswerDate = DateTime.Now;
	skuValue.Save();
	
	return skuValue.Id;
}

function GetSnapshotText(text) {
	if (String.IsNullOrEmpty(text))
		return Translate["#noSnapshot#"];
	else
		return Translate["#snapshotAttached#"];
}

function GoToQuestionAction(control, answerType, question, sku, editControl) {	
	
	editControl = Variables[editControl];
	if (editControl.Text=="—")
		editControl.Text = "";
	var skuValue = CreateVisitSKUValueIfNotExists(editControl, sku, question);
	
	if ((answerType).ToString() == (DB.Current.Constant.DataType.ValueList).ToString()) {
		var q = new Query();
		q.Text = "SELECT Value, Value FROM Catalog_Question_ValueList WHERE Ref=@ref";
		q.AddParameter("ref", question);
		ValueListSelect(skuValue, "Answer", q.Execute(), editControl);
	}

	if ((answerType).ToString() == (DB.Current.Constant.DataType.Snapshot).ToString()) {
		GetCameraObject($.workflow.visit);
		Camera.MakeSnapshot(SaveAtVisit, [ skuValue, editControl]);
	}

	if ((answerType).ToString() == (DB.Current.Constant.DataType.DateTime).ToString()) {
		DateTimeDialog(skuValue, "Answer", skuValue.Answer, editControl);
	}

	if ((answerType).ToString() == (DB.Current.Constant.DataType.Boolean).ToString()) {
		BooleanDialogSelect(skuValue, "Answer", editControl);
	}
}


function CheckEmtySKUAndForward(outlet, visit) {
	var p = [ outlet, visit ];
	parentId = null;
	Workflow.Forward(p);
}

function GetCameraObject(entity) {
	FileSystem.CreateDirectory("/private/Document.Visit");
	var guid = Global.GenerateGuid();
	Variables.Add("guid", guid);
	var path = String.Format("/private/Document.Visit/{0}/{1}.jpg", entity, guid);
	Camera.Size = 300;
	Camera.Path = path;
}

function SaveAtVisit(arr, args) {
	if (args.Result) {
		var question = arr[0];
		var control = arr[1];
		question = question.GetObject();
		question.Snapshot = Variables["guid"];
		question.Save();
		control.Text = Translate["#snapshotAttached#"];
	}
}

function GetActionAndBack() {
	if ($.workflow.skipQuestions) {
		if ($.workflow.skipTasks) {
			Workflow.BackTo("Outlet");
		} else
			Workflow.BackTo("Visit_Tasks");
	} else
		Workflow.BackTo("Questions");
}

//------------------------------internal-----------------------------------

function DialogCallBack(control, key){
	Workflow.Refresh([]);
}
