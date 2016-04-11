
var checkOrderReason;
var checkVisitReason;
var orderEnabled;
var returnEnabled;
var encashmentEnabled;
var forwardIsntAllowedY;
var obligateNumber;
var resinic;
var reseduc;
var obligateBool;
var ObjectPresentation;
var OnPresentation;
var PathForPick;
var GetPreset;
var StartTime;
var EndTime;
var SlidesPick;
var DocumentsPr;
var obligateNumberStart;
var nstep;
var pictID2;


function OnLoad(){
//   var oblQuestReal = new Query("SELECT COUNT(U.Id) FROM USR_SelectedPres AS U INNER JOIN Document_SetPresentations Dkk ON Dkk.Id = U.Id AND Dkk.Display = @filt WHERE U.Selected==1");
//
//   if($.workflow.currentDoc=='Pr2'){
// oblQuestReal.AddParameter("filt", DB.Current.Constant.DisplayPresentations.Manageress)}
//  else{
//    oblQuestReal.AddParameter("filt", DB.Current.Constant.DisplayPresentations.Pervostolnik)
//  }
//   oblQuestReal.AddParameter("emptyRef", $.workflow.visit);
//    var ObligateReal = oblQuestReal.ExecuteScalar().ToString();
//
//    if (ObligateReal==0){
//      Workflow.Forward([]);
// DoAction("toTotal");
//    }

//Dialog.Debug(DocumentsPr);
//  Workflow.Refresh([]);
}

function GetDocPr(){
  return GetPreset;
}


function OnLoading(){

//Dialog.Debug($.workflow.name);
//Dialog.Debug($.workflow.step);
//Dialog.Debug($.workflow.currentDoc);
// obligateNumber = '0';
// forwardIsntAllowedY = false;
//
//Dialog.Debug($.workflow.name);
 //Workflow.Refresh([]);
 GetNumberObligate();

 Getresinic();
 GetEducat();

}

function GetNumberObligate(){
	obligateNumber = 0;

	 var oblQuest = new Query("SELECT COUNT(DISTINCT V.Presentation) FROM Document_SetPresentations_Presentations V INNER JOIN Document_SetPresentations DF ON V.Ref=DF.Id WHERE V.Obligatori = 1 AND DF.MostActive = 1 AND DF.Display = @filt");


		 oblQuest.AddParameter("filt", DB.Current.Constant.DisplayPresentations.Pervostolnik);

		var ObligateTotal = oblQuest.ExecuteScalar().ToString();
	//	Dialog.Debug(ObligateTotal);
	//	Dialog.Debug("ObligateTotal");


	 var oblQuestReal = new Query("SELECT COUNT(DISTINCT V.Slides) FROM Document_Visit_ResultPresent V LEFT JOIN Document_SetPresentations_Presentations Df  ON  Df.Presentation = V.Presents  LEFT  JOIN Document_SetPresentations Dff  ON  Dff.Id = Df.Ref WHERE Df.Obligatori = 1 AND Dff.MostActive=1 AND V.Ref = @emptyRef AND Dff.Display = @filt");

		oblQuestReal.AddParameter("filt", DB.Current.Constant.DisplayPresentations.Pervostolnik);

	 oblQuestReal.AddParameter("emptyRef", $.workflow.visit);
		var ObligateReal = oblQuestReal.ExecuteScalar().ToString();
	 //Dialog.Debug(ObligateReal);
		 //Dialog.Debug("ObligateReal");


	 obligateNumber = ObligateTotal - ObligateReal;
	if(obligateNumber<=0){
		 obligateNumber = 0;
	 }
	// Dialog.Debug(obligateNumber);
	 //Dialog.Debug("obligateNumber");

		if (obligateNumber == '0') {

		 forwardIsntAllowedY = true;

		}
	$.obligateredButton.Text = obligateNumber+')';
  //Workflow.Refresh([]);
	return obligateNumber;
}

function GetPrivateImage(pictI, pictB) {
	var r = "/shared/catalog.slides/" + pictB.Id + "/"
	    + pictB.Picture + ".jpg";
	return r;
}


function GetPrivateImage5(pictI, pictB) {
		var r = "/shared/catalog.slides/" + pictI.Id.ToString() + "/"
	    + pictI.Picture + ".jpg";

	return r;
}


function ActionGetIm(sender, pictID2) {
	ObjectPresentation = "1";
	GetPreset=pictID2;
//		Workflow.Refresh([]);
Workflow.Refresh([$.snapshotLayout3]);
$.obligateredButton.Text = obligateNumber+')';
//Workflow.Refresh([$.allLayout]);
}


function ActionGetIm2(sender, pictID) {
	pictID2 = pictID;
PathForPick = pictID2.ToString();
$.imageindexon.Source = PathForPick;
Workflow.Refresh([$.grScrollView3]);
//
if(DocumentsPr != Null){
if(DocumentsPr = pictID.Id && SlidesPick != pictID.Picture){

//!!!Вставить окончание


UpdateRecResultTime(DateTime.Now);
//	Dialog.Debug(pictID.Id);

	//Dialog.Debug("next");
}}
//EndTime =  DateTime.Now;
DocumentsPr = pictID.Id;
SlidesPick = pictID;
StartTime =    DateTime.Now;

/////////

newFile = DB.Create("Document.Visit_ResultPresent");
newFile.Ref = $.workflow.visit;
newFile.Presents = GetPreset;
newFile.Slides = SlidesPick;
newFile.TemeStart = StartTime;
//newFile.TimeEnd = DateTime.Now;
newFile.Save();


/////////



// var oblQuest = new Query("SELECT COUNT(DISTINCT Question) FROM USR_Questions WHERE Obligatoriness=1 AND TRIM(IFNULL(Answer, '')) = '' " +
// 		"AND (ParentQuestion=@emptyRef OR ParentQuestion IN (SELECT Question FROM USR_Questions " +
// 		"WHERE (Answer='Yes' OR Answer='Да')))");
// oblQuest.AddParameter("emptyRef", DB.EmptyRef("Catalog_Question"));
//
// obligateNumber = oblQuest.ExecuteScalar().ToString();
//
// if (obligateNumber!='0') {
// 	forwardIsntAllowed = true;
// }	else {
// 	forwardIsntAllowed = false;
// }
//
// var single = 1;
//
// if (regularAnswers) {
// 	single = 0;
// }



$.obligateredButton.Text = obligateNumber+')';
	//	 	Dialog.Debug(forwardIsntAllowedY);
		// 	Dialog.Debug("forwardIsntAllowedY");
	//	Workflow.Refresh([$.allLayout]);
		//		Workflow.Refresh([$.obligateredButton]);
//		Workflow.Refresh([]);
/////////
intMumber();
//
}



function intMumber(){
	return $.obligateredButton.Text = obligateNumber+')';
}

function GetImgF(pictID){
	var q = new Query("SELECT V.Id, V.Picture, V.Extension from Catalog_Slides V WHERE V.Id=@PathToPick LIMIT 1");
	q.AddParameter("PathToPick", pictID2);

	var res = q.Execute();
	if (res.Next()){

	var r = "/shared/catalog.slides/" + pictID2.Id.ToString() + "/"
		+ res.Picture + res.Extension;

$.obligateredButton.Text = obligateNumber+')';
return r;}
	else {
		return null;}
}

function Getresinic(){
  if(resinic==null){
    resinic = 'Продажа инициатив';
  }
}



function GetEducat(){
  if(reseduc==null){
    reseduc = 'Проведено обучение';
  }
}


function UpdateRecResultTime(NextSrinTime){

  var q = new Query("SELECT Id FROM Document_Visit_ResultPresent V WHERE V.TimeEnd IS NULL LIMIT 1");
  var parameters = q.ExecuteScalar();
  if (q.ExecuteCount()>0){
  ///  Dialog.Debug(parameters.TemeStart);
  var ETach =  parameters.GetObject();
if (NextSrinTime==null){
//Dialog.Debug(NextSrinTime);
}else{
  ETach.TimeEnd = NextSrinTime;
  resinic = 'Продажа инициатив';
  reseduc = 'Проведено обучение';
}

    ETach.Save();}
Workflow.Refresh([]);
}


function UpdateRecResult(){

  var q = new Query("SELECT Id FROM Document_Visit_ResultPresent V WHERE V.TimeEnd IS NULL LIMIT 1");
  var parameters = q.ExecuteScalar();
  if (q.ExecuteCount()>0){
  ///  Dialog.Debug(parameters.TemeStart);
  var ETach =  parameters.GetObject();


  if (reseduc == 'Проведено обучение'){
      ETach.EnableTeach = 0;
}else{
      ETach.EnableTeach = 1;
}

if (resinic == 'Продажа инициатив'){
      ETach.EnableIniciativ = 0;
}else{
      ETach.EnableIniciativ = 1;
}

    ETach.Save();}
Workflow.Refresh([]);
}


function OpenViewPres(par1, par2){
if(SlidesPick !=undefined){


  var q = new Query("SELECT Id FROM Document_Visit_ResultPresent V WHERE V.TimeEnd IS NULL LIMIT 1");
  var parameters = q.ExecuteScalar();
  if (q.ExecuteCount()>0){
  ///  Dialog.Debug(parameters.TemeStart);
  var ETach =  parameters.GetObject();

var NextSrinTime = DateTime.Now;
  ETach.TimeEnd = NextSrinTime;


    ETach.Save();}

  DoAction(par1, par2);
}

}

function InInic(){
  if(SlidesPick !=undefined){
  if(resinic == 'Продажа инициатив'){
    resinic = 'Продажа инициатив ✓';
}
else{
    resinic = 'Продажа инициатив';
}

UpdateRecResult();}

}


function InEducat(){
if(SlidesPick!=undefined){
  if(reseduc == 'Проведено обучение'){
reseduc = 'Проведено обучение ✓';
}
else{
  reseduc = 'Проведено обучение';
}

  UpdateRecResult();}
}

function GetSnapShots() {

//  var q = new Query("SELECT COUNT(U.Id) FROM USR_SelectedPres AS U WHERE U.Selected!=1");
//  var parametersCount = q.ExecuteScalar();

//if (parametersCount==0){
//	Workflow.Forward([]);
//}else{
//	DoAction("SkipPr");
//}

/////////////////

		var q = new Query("SELECT Df.Id, V.Slide  from   Catalog_Presentations_Slides V  INNER JOIN Catalog_Presentations Df  ON  Df.Id = V.Ref INNER JOIN Document_SetPresentations_Presentations Dm  ON  Df.Id = Dm.Presentation INNER JOIN USR_SelectedPres Dk ON Dm.Ref = Dk.Id INNER JOIN Document_SetPresentations Dkk ON Dkk.Id = Dk.Id WHERE Dk.Selected == 1 AND Dkk.Display = @filt GROUP BY Df.Id ORDER BY V.LineNumber");

      q.AddParameter("filt", DB.Current.Constant.DisplayPresentations.Pervostolnik);



    //del
  //  Dialog.Debug($.workflow.currentDoc);
  //  Dialog.Debug($.workflow.curentStep);
  //   Dialog.Debug($.workflow.Step);
      //Workflow.Forward([]);
		return q.Execute();
}

function GetSnapShots2() {
		var q = new Query("SELECT V.Id, V.Ref, V.Slide from Catalog_Presentations_Slides V WHERE V.Ref=@Ref ORDER BY V.LineNumber");
	q.AddParameter("Ref", GetPreset);
			return q.Execute();
			if (res.Next()){
					return q.Execute();}
			else {
				return null;}
}

function OnVPresentation(){
if (ObjectPresentation == null){
	return false} else {
 return true

}}


function DoBackPr(){
  var q = new Query("SELECT Id FROM Document_Visit_ResultPresent V WHERE V.TimeEnd IS NULL LIMIT 1");
  var parameters = q.ExecuteScalar();
  if (q.ExecuteCount()>0){
  ///  Dialog.Debug(parameters.TemeStart);
  var ETach =  parameters.GetObject();
var NextSrinTime = DateTime.Now;

  ETach.TimeEnd = NextSrinTime;
  resinic = undefined;
  reseduc = undefined;


    ETach.Save();}
  ETach = undefined;
  DocumentsPr = null;
  SlidesPick = undefined;
  obligateNumber = null;
  $.path = null;
  $.imageindexon = null;
  pictID = null;
  GetPreset = null;
  ObjectPresentation = null;
  OnPresentation = null;
  PathForPick = null;
  GetPreset = null;
  StartTime = undefined;
  EndTime = null;

  DocumentsPr = null;
  obligateNumberStart = null;
  nstep = null;
pictID2 = undefined;
resinic = undefined;
reseduc = undefined;
Workflow.Back();

}

function CheckIfEmptyAndForward(order, wfName) {

if(obligateNumber==0){
//Dialog.Debug(PathForPick);
	/////
if(StartTime!=undefined){
	newFile = DB.Create("Document.Visit_ResultPresent");
	newFile.Ref = $.workflow.visit;
	newFile.Presents = GetPreset;
	newFile.Slides = SlidesPick;
	newFile.TemeStart = StartTime;
	newFile.TimeEnd = DateTime.Now;

	newFile.Save();}
	/////
  ETach = null;
  DocumentsPr = null;
  SlidesPick = undefined;
  obligateNumber = null;
  $.path = null;
  $.imageindexon = null;
  pictID = null;
  GetPreset = null;
  ObjectPresentation = null;
  OnPresentation = null;
  PathForPick = null;
  GetPreset = undefined;
  StartTime = null;
  EndTime = null;

  DocumentsPr = null;
  obligateNumberStart = null;
  nstep = null;
pictID2 = null;

resinic = undefined;
reseduc = undefined;
//  Workflow.Refresh([]);
	Workflow.Forward([]);

  	DoAction("toTotal");
  //  DoAction("Forward", []);
  }

}
