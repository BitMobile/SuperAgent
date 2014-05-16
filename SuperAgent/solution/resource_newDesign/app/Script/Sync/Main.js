// -------------------- Sync Data ------------
function SyncData() {
    $.dataSyncReport.Visible = false;
    $.dataSyncLayout.Visible = true;
    $.dataSyncIndicator.Start();

    DB.Sync(SyncDataFinish);
}

function SyncDataFinish() {
    $.dataSyncIndicator.Stop();
    $.dataSyncLayout.Visible = false;
    $.dataSyncReport.Visible = true;

    Variables.Remove("lastDataSync");
    Variables.AddGlobal("lastDataSync", DateTime.Now.ToString("dd MMM HH:mm"));
    $.dataSyncReport.Text = $.lastDataSync;
}

// -------------------- Sync Ftp ------------

function SyncFtp() {
    $.ftpSyncReport.Visible = false;
    $.ftpSyncLayout.Visible = true;
    $.ftpSyncIndicator.Start();

    FileSystem.UploadPrivate(UploadPrivateCallback);
}

function UploadPrivateCallback(args) {
    if (args.Result) {
        FileSystem.SyncShared(SyncSharedCallback);
    }
    else {
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
    $.ftpSyncReport.Visible = true;

    Variables.Remove("lastFtpSync");
    Variables.AddGlobal("lastFtpSync", DateTime.Now.ToString("dd MMM HH:mm"));
    $.ftpSyncReport.Text = $.lastFtpSync;
}



