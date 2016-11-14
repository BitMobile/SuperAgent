var title;
var back;
var Commentary;

function OnLoading() {
	title = Translate["#TextMes#"];
	back = Translate["#back#"];
}

function GetVisit(visit){
	return visit.GetObject();
}

function SetCommentary(sender, param1){
	Commentary = sender.Text;
}

function SetFocus() {
	$.DlComment.CssClass = "caption_keyboard";
	$.DlComment.Refresh();
}

function LostFocus(){
	$.DlComment.CssClass = "caption";
	$.DlComment.Refresh();
}


function AskEndVisit(visit) {
	if (IsNullOrEmpty(Commentary)) {
		DoBack();
	} else {
		Commentary = TrimAll(Commentary);
		if (501 <= StrLen(Commentary)){
			Dialog.Message(Translate["#HigthCommentaryCount#"]);
		}else {
			var visObj = visit.Id.GetObject();
			visit.Commentary = Commentary;

			visit.Save();
			DoBack();
		}
	}
}
