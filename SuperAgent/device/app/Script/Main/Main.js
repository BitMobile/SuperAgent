
var summaryScreenIndex;
var leadScreenIndex;

function OnLoad() {
	summaryScreenIndex = 1;
	leadScreenIndex = 0;
	$.swipe_vl.Index = GetFirstScreenIndex();
}

function GetUnscheduledVisits() {
	return Indicators.GetUnscheduledVisits();
}

function GetEncashmentSumm() {
	return Indicators.GetEncashmentSumm();
}

function GetReceivablesSumm() {
	return Indicators.GetReceivablesSumm();
}

function GetTotal(){
	var s = Indicators.GetUnscheduledVisits() + Indicators.GetCommitedScheduledVisits();
	return s + "";
}

function GetVisitsLeft(){
	var c = GetPlannedVisits() - Indicators.GetCommitedScheduledVisits();
	return c + "";
}

function SendContacts() {
	SendContactsRequest();
	GoToSummary();
	SetContactsSentFlag();
	Dialog.Message(Translate["#leadThanks#"]);
}

function GoToSummary() {
	$.swipe_vl.Index = summaryScreenIndex;
}

function GetFirstScreenIndex() {
	return (IsDemoUser() && !GetContactsSentFlag() ? leadScreenIndex : summaryScreenIndex);
}

function IsDemoUser() {
	var userRef = $.common.UserRef;
	var username = userRef.UserName;
	var password = userRef.Password;
	return username == 'demo' && password == 'demo';
}

function SetContactsSentFlag() {
	var q = new Query("CREATE TABLE USR_ContactsSent(" +
	"ID INT PRIMARY KEY NOT NULL)");
	q.Execute();
}

function GetContactsSentFlag() {
	var q = new Query("SELECT name FROM sqlite_master " +
	  "WHERE type='table' AND name='USR_ContactsSent'");
	var ContactsSent = q.ExecuteCount() == 1;
	return ContactsSent;
}

function SendContactsRequest() {
	var request = Web.Request();
	request.Host = "http://192.168.21.41";
	request.UserName = "Admin";
	request.Password = "1";
	request.Timeout = "00:00:10";
	request.AddHeader("regdate", DateTime.Now);
	request.AddHeader("name", "Имя");
	request.AddHeader("phone", "89817041002");
	request.AddHeader("os", $.common.OS);
	request.Post("/BITSA.DEV/hs/DemoAccess", "");
}
