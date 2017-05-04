var fptr;

function OnLoad() {
	DrawDataReport();

	DrawFtpReport();
}

// -------------------- Sync Data ------------
function SyncData() {
	$.dataSyncReport.Visible = false;
	$.dataSyncError.Visible = false;
	$.dataSyncLayout.Visible = true;
	$.dataSyncIndicator.Start();

	DB.Sync(SyncDataFinish);
}

function SyncDataFinish() {
	$.dataSyncIndicator.Stop();
	$.dataSyncLayout.Visible = false;

	DrawDataReport();

	$.Remove("sessionConst");
	Global.SetSessionConstants();
	Global.SetGps();
	Indicators.SetIndicators();
	Workflow.Refresh([]);
}

function DrawDataReport() {
	var at = Translate["#at#"];
	var date = DB.LastSyncTime.ToString("dd.MM.yy ");
	var time = DB.LastSyncTime.ToString(" HH:mm");

	if (DB.SuccessSync) {
		$.dataSyncReport.Text = date + at + time;
		$.dataSyncReport.Visible = true;
		$.dataSyncError.Visible = false;
	} else {
		$.dataSyncError.Text = Translate["#error#"] + ": " + date + at + time;
		$.dataSyncError.Visible = true;
		$.dataSyncReport.Visible = false;
	}
}

// -------------------- Sync Ftp ------------

function SyncFtp() {
	$.ftpSyncReport.Visible = false;
	$.ftpSyncError.Visible = false;
	$.ftpSyncLayout.Visible = true;
	$.ftpSyncIndicator.Start();

	FileSystem.UploadPrivate(UploadPrivateCallback);
}

function UploadPrivateCallback(args) {
	if (args.Result) {
		// Remove private files
		FileSystem.ClearPrivate();
		FileSystem.SyncShared(SyncSharedCallback);
	} else {
		FileSystem.HandleLastError();
		SyncFtpFinish();
	}
}

function SyncSharedCallback(args) {
	if (!args.Result) {
		FileSystem.HandleLastError();
	}

	SyncFtpFinish();
}

function SyncFtpFinish() {
	$.ftpSyncIndicator.Stop();
	$.ftpSyncLayout.Visible = false;

	DrawFtpReport();
}

function DrawFtpReport() {

	var at = Translate["#at#"];
	var date = FileSystem.LastSyncTime.ToString("dd.MM.yy ");
	var time = FileSystem.LastSyncTime.ToString(" HH:mm");

	if (FileSystem.SuccessSync) {

		$.ftpSyncReport.Text = date + at + time;
		$.ftpSyncReport.Visible = true;
		$.ftpSyncError.Visible = false;

	} else {

		if (isDefault(FileSystem.LastSyncTime))
			$.ftpSyncError.Text = Translate["#Synchronization_has_not_been_performed#"];
		else
			$.ftpSyncError.Text = Translate["#error#"] + ": " + date + at + time;
		$.ftpSyncError.Visible = true;
		$.ftpSyncReport.Visible = false;

	}
}

function OpenSettings() {

	// var _fptr = ClientModel3.MD.FiscalRegistrator.GetProviderInstance();
  // _fptr.Initialize();
	fptr = FiscalRegistrator.GetProviderInstance();
	fptr.Initialize();
	fptr.OpenSettings();

	Variables["workConst"]["fptr"] = fptr;

}

function PrintXReport() {

	//Dialog.Message('Печатаю Х.. отчет');
	if (fptr != NULL){

		Fiscal.PrintX(fptr);

	}
	else {
		Dialog.Message(Translate["#NoFs#"]);
	}

}

function PrintZReport() {

	Dialog.Alert(Translate["#AskPrintZ#"], PrintZ, null, Translate["#YES#"], Translate["#NO#"]);

}

function PrintZ(state, args) {
	if (args.Result == 0) {

		if (fptr != NULL){

			Fiscal.PrintZ(fptr);

		}
		else {
			Dialog.Message(Translate["#NoFs#"]);
		}

	}

}

function Connect(){

	if (fptr != NULL){

		fptr.PutDeviceSettings(fptr.Settings);
	  fptr.PutDeviceEnabled(true);
		fptr.Beep();

	}
	else {
		Dialog.Message(Translate["#NoFs#"]);
	}



}
