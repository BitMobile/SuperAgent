var regularAnswers;
var parentId;
var obligateredLeft;
var regular_answ;
var regular_total;
var single_answ;
var single_total;
var scrollIndex;
var setScroll;
var bool_answer;
var curr_item;
var curr_sku;
var skuValueGl;
var doRefresh;

//
//-------------------------------Header handlers-------------------------
//


function OnLoading(){
	doRefresh = false;
	obligateredLeft = parseInt(0);	
	SetListType();
	if (String.IsNullOrEmpty(setScroll))
		setScroll = true;
	if ($.param2==true) //works only in case of Forward from Filters 
		ClearIndex();
}

function OnLoad() {
	if (setScroll)
		SetScrollIndex();
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

function SetScrollIndex() {
	
	if (String.IsNullOrEmpty(scrollIndex)){
		$.grScrollView.Index = parseInt(4);
	}
	else{
		var s = (parseInt(scrollIndex) * parseInt(2)) + parseInt(6);
		$.grScrollView.Index = s;
	}
}

//
//--------------------------------Questions list handlers--------------------------
//


function GetSKUsFromQuesionnaires(search) {
	
	var single = 1;
	if (regularAnswers)	
		single = 0;
	
	SetIndicators();
	

	
	obligateredLeft = 0;
	
	var searchString = "";
	if (String.IsNullOrEmpty(search) == false)
		searchString = " Contains(SKUDescription, '" + search + "') AND ";
	
	var filterString = "";
	var filterJoin = "";
	filterString += AddFilter(filterString, "group_filter", "OwnerGroup", " AND ");
	filterString += AddFilter(filterString, "brand_filter", "Brand", " AND ");
	
	var q = new Query();
	q.Text="SELECT DISTINCT S.SKU, S.SKUDescription " +
			", COUNT(DISTINCT S.Question) AS Total " +
			", COUNT(S.Answer) AS Answered " +
			", MAX(CAST (Obligatoriness AS INT)) AS Obligatoriness " +
			", (SELECT COUNT(DISTINCT U1.Question) FROM USR_SKUQuestions U1 " +
				" WHERE U1.Single=@single AND (Answer='' OR Answer IS NULL) " +
				" AND U1.SKU=S.SKU AND Obligatoriness = 1 " +
				" AND (ParentQuestion=@emptyRef OR ParentQuestion IN (SELECT Question FROM USR_SKUQuestions " +
				" WHERE SKU=S.SKU AND (Answer='Yes' OR Answer='Да')))) AS ObligateredLeft " +
			", (SELECT MAX(AMS.BaseUnitQty) FROM Catalog_AssortmentMatrix_SKUs AMS " +
				" JOIN Catalog_AssortmentMatrix_Outlets AMO ON AMS.Ref = AMO.Ref AND AMO.Outlet = @outlet " +
				" WHERE S.SKU=AMS.SKU) AS BaseUnitQty " +
				
			"FROM USR_SKUQuestions S " + filterJoin +		
			
			"WHERE Single=@single AND " + searchString + filterString + 
			" (ParentQuestion=@emptyRef OR ParentQuestion IN (SELECT Question FROM USR_SKUQuestions " +
				"WHERE (Answer='Yes' OR Answer='Да')))" +
			"GROUP BY S.SKU, S.SKUDescription " +
			" ORDER BY BaseUnitQty DESC, S.SKUDescription "; 
	q.AddParameter("emptyRef", DB.EmptyRef("Catalog_Question"));
	q.AddParameter("single", single);	
	q.AddParameter("snapshot", DB.Current.Constant.DataType.Snapshot);
	q.AddParameter("attached", Translate["#snapshotAttached#"]);		
	q.AddParameter("outlet", $.workflow.outlet);
	
	return q.Execute();
}

function ObligateredAreAnswered(obligatoriness, history, current, oblTotal) {
	if (parseInt(obligatoriness)==parseInt(0))
		return false;
	else{
		if (parseInt(obligatoriness)==parseInt(1) || (parseInt(oblTotal)==(parseInt(history)+parseInt(current))))
			return true;
		else
			return false;
	}
}

function SetIndicators() {
	regular_total = CalculateTotal('0');
	single_total = CalculateTotal('1');		
	regular_answ = 0;//CalculateTotal(str, '0', true);
	single_answ = 0;//CalculateTotal(str, '1', true);
}

function CalculateTotal(single) {
	var q = new Query("SELECT COUNT(U1.Question) FROM USR_SKUQuestions U1 WHERE U1.Single=@single " +
	" AND (ParentQuestion=@emptyRef OR ParentQuestion IN (SELECT Question FROM USR_SKUQuestions " +
	" WHERE (Answer='Yes' OR Answer='Да')))");
	q.AddParameter("single", single);
	q.AddParameter("emptyRef", DB.EmptyRef("Catalog_Question"));
	return q.ExecuteScalar();
}

function AddFilter(filterString, filterName, condition, connector) {

	var q = new Query("SELECT F.Id FROM USR_Filters F WHERE F.FilterType = @filterName");
	
	q.AddParameter("filterName", filterName);
	
	var res = q.ExecuteScalar();
	
	if (res!=null) {
		
		filterString += condition + " IN(SELECT F.Id FROM USR_Filters F WHERE F.FilterType = '" + filterName + "') " + connector;
		
	}
		
	return filterString;
		
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
	
	var single = 1;
	if (regularAnswers)	
		single = 0;
	
	var q = new Query("SELECT *, " +
			"CASE WHEN IsInputField='1' THEN Answer ELSE " +
				"CASE WHEN (RTRIM(Answer)!='' AND Answer IS NOT NULL) THEN CASE WHEN AnswerType=@snapshot THEN @attached ELSE Answer END ELSE '—' END END AS AnswerOutput " +
			"FROM USR_SKUQuestions S " +
			"WHERE SKU=@sku AND Single=@single AND (ParentQuestion=@emptyRef OR ParentQuestion IN (SELECT Question FROM USR_SKUQuestions " +
			"WHERE SKU=S.SKU AND (Answer='Yes' OR Answer='Да')))");
	q.AddParameter("sku", sku);
	q.AddParameter("emptyRef", DB.EmptyRef("Catalog_Question"));
	q.AddParameter("single", single);	
	q.AddParameter("snapshot", DB.Current.Constant.DataType.Snapshot);
	q.AddParameter("attached", Translate["#snapshotAttached#"]);
	
	return q.Execute();
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
	if (parentId == ("p"+index)){
		parentId = null;
		scrollIndex = null;
	}
	else
		parentId = "p" + index;
		
	scrollIndex = index;
	setScroll = true;
	
	Workflow.Refresh([$.search]);
}



function CreateVisitSKUValueIfNotExists(control, sku, question, isInput) {
	
//	if (isInput=='true' && (control.Text=="—" || TrimAll(control.Text)==""))
//		return null;
	
	doRefresh = true;
	
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
	
	setScroll = false;
	
	return skuValue.Id;
}

function GetSnapshotText(text) {
	if (String.IsNullOrEmpty(text))
		return Translate["#noSnapshot#"];
	else
		return Translate["#snapshotAttached#"];
}

function GoToQuestionAction(control, answerType, question, sku, editControl, currAnswer) {	
	
	editControl = Variables[editControl];
	curr_sku = sku;
	
	if ((answerType).ToString() == (DB.Current.Constant.DataType.ValueList).ToString()) {
		var q = new Query();
		q.Text = "SELECT Value, Value FROM Catalog_Question_ValueList WHERE Ref=@ref";
		q.AddParameter("ref", question);
		Dialogs.DoChoose(q.Execute(), question, null, editControl, DialogCallBack);
	}

	if ((answerType).ToString() == (DB.Current.Constant.DataType.Snapshot).ToString()) {
		var skuValue = CreateVisitSKUValueIfNotExists(editControl, sku, question, 'false');
		skuValueGl = skuValue;
		var listChoice = new List;
		listChoice.Add([1, Translate["#makeSnapshot#"]]);
		if ($.sessionConst.galleryChoose)
			listChoice.Add([0, Translate["#addFromGallery#"]]);
		if (String.IsNullOrEmpty(skuValue.Answer)==false)
			listChoice.Add([2, Translate["#clearValue#"]]);
		Gallery.AddSnapshot($.workflow.visit, skuValue, SaveAtVisit, listChoice, "document.visit");
	}

	if ((answerType).ToString() == (DB.Current.Constant.DataType.DateTime).ToString()) {
		Dialogs.ChooseDateTime(question, null, editControl, DialogCallBack);
	}

	if ((answerType).ToString() == (DB.Current.Constant.DataType.Boolean).ToString()) {
		bool_answer = currAnswer;
		curr_item = sku;
		Dialogs.ChooseBool(question, null, editControl, DialogCallBack);
	}
	
	setScroll = false;
}

function AssignAnswer(control, question, sku, answer) {
	if (control != null) {
		answer = control.Text;		
	} else
		answer = answer.ToString();
	if (answer == "—")
		answer = null;
	
	var q =	new Query("UPDATE USR_SKUQuestions SET Answer=@answer, AnswerDate=DATETIME('now', 'localtime') WHERE Question=@question AND SKU=@sku");
	q.AddParameter("answer", answer);
	q.AddParameter("sku", sku);
	q.AddParameter("question", question);
	q.Execute();
}

function GetCameraObject(entity) {
	FileSystem.CreateDirectory("/private/document.visit");
	var guid = Global.GenerateGuid();
	//Variables.Add("guid", guid);
	var path = String.Format("/private/document.visit/{0}/{1}.jpg", entity.Id, guid);
	Camera.Size = 300;
	Camera.Path = path;
	return guid; 
}

function SaveAtVisit(arr, args) {
	var question = skuValueGl;
	var path = arr[1];
	if (args.Result) {
		question = question.GetObject();
		question.Answer = path;
		question.Save();
	}
	else
		question.Answer = null;
	Workflow.Refresh([$.search]);
}

function ObligatedAnswered(answer, obligatoriness) {
	if (parseInt(obligatoriness)==parseInt(1)){
		if (String.IsNullOrEmpty(answer)==false & answer!="—")
			return true;
	}
	return false;	
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

function DoSearch(searcText) {
	ClearIndex();
	Workflow.Refresh([searcText]);
}

function ClearIndex() {
	parentId =null;
	scrollIndex = null;
	setScroll = null;
}

//------------------------------internal-----------------------------------

function DialogCallBack(state, args){	
	var entity = state[0];
	AssignAnswer(null, entity, curr_sku, args.Result);

	Workflow.Refresh([$.search]);
}
	
function GetChildQuestions() {
	var str = CreateCondition($.workflow.questionnaires, " Q.Ref ");
	var q = new Query("SELECT DISTINCT V.Id, Q.ChildDescription FROM Document_Visit_SKUs V " +
			" JOIN Document_Questionnaire_SKUQuestions Q ON V.Question=Q.ChildQuestion " +
			" JOIN Document_Questionnaire_SKUs S ON Q.Ref=S.Ref AND S.SKU=V.SKU " +
			" WHERE " + str + " V.Ref=@visit AND Q.ParentQuestion=@parent");			
	q.AddParameter("visit", $.workflow.visit);
	q.AddParameter("parent", curr_item.Question);
	var res1 = q.Execute();
	
	var q2 = new Query("SELECT DISTINCT A.Id, Q.ChildDescription FROM Catalog_Outlet_AnsweredQuestions A " +
			" JOIN Document_Questionnaire_SKUQuestions Q ON A.Question=Q.ChildQuestion " +
			//" JOIN Document_Questionnaire_SKUs S ON Q.Ref=S.Ref AND S.SKU=A.SKU " +
			" WHERE " + str + " A.Ref=@outlet AND Q.ParentQuestion=@parent AND A.SKU=@sku");
	q2.AddParameter("outlet", $.workflow.outlet);
	q2.AddParameter("parent", curr_item.Question);
	q2.AddParameter("sku", curr_sku);
	var res2 = q2.Execute();
	
	DeleteAnswers(res1);
	DeleteAnswers(res2);
}

function DeleteAnswers(recordset) {	
	while (recordset.Next()){
		DB.Delete(recordset.Id);
	}	
}
