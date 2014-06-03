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

	$.Remove("lastDataSync");
	$.AddGlobal("lastDataSync", DateTime.Now);
	$.Remove("dataSyncSuccess");
	$.AddGlobal("dataSyncSuccess", DB.LastError == null);

	DrawDataReport();
}

function DrawDataReport() {
	if (!$.Exists("lastDataSync")) {
		$.dataSyncReport.Text = "-";
		$.dataSyncReport.Visible = true;
		$.dataSyncError.Visible = false;
	} else {
		var at = Translate["#at#"];
		var date = $.lastDataSync.ToString("dd.MM.yy ");
		var time = $.lastDataSync.ToString(" HH:mm");

		if ($.dataSyncSuccess) {
			$.dataSyncReport.Text = date + at + time;
			$.dataSyncReport.Visible = true;
			$.dataSyncError.Visible = false;
		} else {
			$.dataSyncError.Text = Translate["#error#"] + ": " + date + at
					+ time;
			$.dataSyncError.Visible = true;
			$.dataSyncReport.Visible = false;
		}
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
	$.Remove("lastFtpSync");
	$.AddGlobal("lastFtpSync", DateTime.Now);
	$.Remove("ftpSyncSuccess");
	$.AddGlobal("ftpSyncSuccess", FileSystem.LastError == null);

	DrawFtpReport();
}

function DrawFtpReport() {
	if (!$.Exists("lastFtpSync")) {
		$.ftpSyncReport.Text = "-";
		$.ftpSyncReport.Visible = true;
		$.ftpSyncError.Visible = false;
	} else {
		var at = Translate["#at#"];
		var date = $.lastFtpSync.ToString("dd.MM.yy ");
		var time = $.lastFtpSync.ToString(" HH:mm");

		if ($.ftpSyncSuccess) {
			$.ftpSyncReport.Text = date + at + time;
			$.ftpSyncReport.Visible = true;
			$.ftpSyncError.Visible = false;
		} else {
			$.ftpSyncError.Text = Translate["#error#"] + ": " + date + at
					+ time;
			$.ftpSyncError.Visible = true;
			$.ftpSyncReport.Visible = false;
		}
	}
}