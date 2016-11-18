var title;
var back;
var Commentary;

function OnLoading() {
	title = Translate["#TextMes#"];
	back = Translate["#back#"];
}

function GetVisit(visit){
	Commentary = visit.Commentary;
	return visit.GetObject();
}

function SetCommentary(sender){
	Commentary = sender.Text;
}

function SetFocus(sender) {
	$.DlComment.CssClass = "caption_keyboard";
	$.DlComment.Refresh();
}

function LostFocus(sender){
	$.DlComment.CssClass = "caption";
	$.DlComment.Refresh();
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
