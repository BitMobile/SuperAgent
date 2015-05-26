
function SendLog(){
	var result = Application.SendDatabase();
	if (result)
		Dialog.Message(Translate["#success#"]);
	else
		Dialog.Message(Translate["#noSuccess#"]);
}