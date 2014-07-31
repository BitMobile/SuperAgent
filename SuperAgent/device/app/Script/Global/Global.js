

function GenerateGuid() {

	return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}

function S4() {
	return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
}

function SetSessionConstants() { 
	var planEnbl = new Query("SELECT Use FROM Catalog_MobileApplicationSettings WHERE Code='PlanEnbl'");
	var multStck = new Query("SELECT Use FROM Catalog_MobileApplicationSettings WHERE Code='MultStck'");
	
	$.AddGlobal("sessionConst", new Dictionary());
	$.sessionConst.Add("PlanEnbl", EvaluateBoolean(planEnbl.ExecuteScalar()));
	$.sessionConst.Add("MultStck", EvaluateBoolean(multStck.ExecuteScalar()));
}

function EvaluateBoolean(res){
	if (res == null)
		return false;
	else {
		if (parseInt(res) == parseInt(0))
			return false
		else
			return true;
	}
}

function ValidateEmail(string){
	return ValidateField(string, "(([A-za-z0-9-_.]+@[a-z0-9_]+(.[a-z]{2,6})+)*)?", Translate["#email#"])
}

function ValidatePhoneNr(string){
	return ValidateField(string, "([0-9()-+\s]{1,20})?", Translate["#phone#"])
}

function ValidateField(string, regExp, fieldName){
	if (string==null)
		string = "";
	var validField = validate(string, regExp);
	if (validField==false)
		Dialog.Message(String.Format("{0} {1}", Translate["#incorrect#"], fieldName));
	return validField;
}

