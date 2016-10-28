var title;
var back;
var Commentary;

function OnLoading() {
	title = Translate["#TextMes#"];
	back = Translate["#back#"];
}

function GetVisit(visit){
	// Dialog.Debug(visit);
	return visit.GetObject();
}

function SetCommentary(sender, param1){
	Commentary = sender.Text;
}

function AskEndVisit(visit) {
	if (IsNullOrEmpty(Commentary)) {
		visit.Commentary = Commentary;
		visit.Save();
		DoBack();
	} else {
		Commentary = TrimAll(Commentary);
		if (501 <= StrLen(Commentary)){
			Dialog.Message(Translate["#HigthCommentaryCount#"]);
		}else {
			visit.Commentary = Commentary;
			visit.Save();
			DoBack();
		}
	}
}
