
// --------------------------------------------------------------------------------

function OnLoad() {
	var usernameIsDemo = $.common.UserRef.UserName == "demo";
	$.swipe_vl.Index = (usernameIsDemo ? 0 : 1);
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
function GoToSummary() {
	$.swipe_vl.Index = 1;
}
