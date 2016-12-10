function OnLoading() {



}

function GetVisitsAndCommentary() {
	var q = new Query("SELECT User, Date, Commentary FROM USR_History");
	return q.Execute();

}
