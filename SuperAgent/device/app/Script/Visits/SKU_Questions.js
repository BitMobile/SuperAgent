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
var questionValueGl;
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

function CountResultAndForward() {	
	
	parentId = null;			
	
	var q = regular_total + single_total;	
	$.workflow.Add("questions_qty_sku", q);
	
	var a = regular_answ + single_answ;	
	$.workflow.Add("questions_answ_sku", a);
	
	del = new Query("DELETE FROM USR_Filters");	
	del.Execute();	
	
	Workflow.Forward();
}

//
//--------------------------------Questions list handlers--------------------------
//


function GetSKUsFromQuesionnaires(search) {
	
	var single = 1;
	if (regularAnswers)	
		single = 0;
	
	SetIndicators();	
	
	//getting left obligated
	var q = new Query("SELECT DISTINCT S.Question, S.Description, S.SKU " +
			"FROM USR_SKUQuestions S " +
			"WHERE (RTRIM(Answer)='' OR S.Answer IS NULL) AND S.Obligatoriness=1 " +
			"AND (S.ParentQuestion=@emptyRef OR S.ParentQuestion IN (SELECT SS.Question FROM USR_SKUQuestions SS " +
				"WHERE SS.SKU=S.SKU AND (SS.Answer='Yes' OR SS.Answer='Да')))");
	q.AddParameter("emptyRef", DB.EmptyRef("Catalog_Question"));
	obligateredLeft = q.ExecuteCount();
	
	//getting SKUs list
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
			" (ParentQuestion=@emptyRef OR ParentQuestion IN (SELECT Question FROM USR_SKUQuestions SS " +
				"WHERE SS.SKU=S.SKU AND (SS.Answer='Yes' OR SS.Answer='Да')))" +
			"GROUP BY S.SKU, S.SKUDescription " +
			" ORDER BY BaseUnitQty DESC, S.SKUDescription "; 
	q.AddParameter("emptyRef", DB.EmptyRef("Catalog_Question"));
	q.AddParameter("single", single);	
	q.AddParameter("snapshot", DB.Current.Constant.DataType.Snapshot);
	q.AddParameter("attached", Translate["#snapshotAttached#"]);		
	q.AddParameter("outlet", $.workflow.outlet);
	
	return q.Execute();
	//
}

function SetIndicators() {
	regular_total = CalculateTotal('0');
	single_total = CalculateTotal('1');		
	regular_answ = CalculateQty('0');
	single_answ = CalculateQty('1');
}

function CalculateTotal(single) {
	var q = new Query("SELECT COUNT(U1.Question) FROM USR_SKUQuestions U1 WHERE U1.Single=@single " +
	" AND (ParentQuestion=@emptyRef OR ParentQuestion IN (SELECT Question FROM USR_SKUQuestions " +
	" WHERE (Answer='Yes' OR Answer='Да')))");
	q.AddParameter("single", single);
	q.AddParameter("emptyRef", DB.EmptyRef("Catalog_Question"));
	return q.ExecuteScalar();
}

function CalculateQty(single) {
	var q = new Query("SELECT COUNT(U1.Answer) AS Answered " +
			"FROM USR_SKUQuestions U1 " +
			"WHERE U1.Single=@single " +
			"AND (ParentQuestion=@emptyRef OR ParentQuestion IN " +
				"(SELECT Question FROM USR_SKUQuestions WHERE (Answer='Yes' OR Answer='Да')))");
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
		var controlText;
		if (editControl.Text=="—")
			controlText = null;
		else
			controlText = editControl.Text;
		skuValueGl = sku;
		questionValueGl = question;
		var listChoice = new List;
		listChoice.Add([1, Translate["#makeSnapshot#"]]);
		if ($.sessionConst.galleryChoose)
			listChoice.Add([0, Translate["#addFromGallery#"]]);
		if (String.IsNullOrEmpty(currAnswer)==false)
			listChoice.Add([2, Translate["#clearValue#"]]);
		AddSnapshot($.workflow.visit, null, GalleryCallBack, listChoice, "document.visit");
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
	} else{
		if (answer!=null)
			answer = answer.ToString();
	}
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

function GalleryCallBack(state, args) {
	AssignAnswer(null, questionValueGl, skuValueGl, state[1]);
	Workflow.Refresh([]);
}

function DeleteAnswers(recordset) {	
	while (recordset.Next()){
		DB.Delete(recordset.Id);
	}	
}

//-------------------------------Gallery handler-----------------------------------

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
		AssignAnswer(null, questionValueGl, skuValueGl, null);
		Workflow.Refresh([]);
	}
}
