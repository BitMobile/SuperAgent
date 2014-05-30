﻿function OnLoad()
{
    var dataText = $.lastDataSync;
    if(!$.dataSyncSuccess)
    	dataText = Translate["#error#"] + ": " + dataText;    
    $.dataSyncReport.Text = dataText;
    
    var ftpText = $.lastFtpSync;
    if(!$.ftpSyncSuccess)
    	ftpText = Translate["#error#"] + ": " + ftpText;        
    $.ftpSyncReport.Text = ftpText;	 	
}


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

    $.Remove("lastDataSync");
    $.AddGlobal("lastDataSync", DateTime.Now.ToString("dd MMM HH:mm"));
    $.Remove("dataSyncSuccess");
    $.AddGlobal("dataSyncSuccess", DB.LastError == null);  
    
    var text = $.lastDataSync;
    if(!$.dataSyncSuccess)
    	text = Translate["#error#"] + ": " + text;    
    $.dataSyncReport.Text = text;
    
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

    $.Remove("lastFtpSync");
    $.AddGlobal("lastFtpSync", DateTime.Now.ToString("dd MMM HH:mm"));   
    $.Remove("ftpSyncSuccess");
    $.AddGlobal("ftpSyncSuccess", FileSystem.LastError == null);   
    
    var text = $.lastFtpSync;
    if(!$.ftpSyncSuccess)
    	text = Translate["#error#"] + ": " + text;        
    $.ftpSyncReport.Text = text;
}



