

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
	return ValidateField(string, "([0-9()-+\s]{1,20})?", Translate["#phone#"]);
}

function ValidateField(string, regExp, fieldName){
	if (string==null)
		string = "";
	var validField = validate(string, regExp);
	if (validField==false)
		Dialog.Message(String.Format("{0} {1}", Translate["#incorrect#"], fieldName));
	return validField;
}


//--------------------------------Order functionality----------------------------

function FindTwinAndUnite(orderitem) {
	var q = new Query(
			"SELECT Id FROM Document_Order_SKUs WHERE Ref=@ref AND SKU=@sku AND Discount=@discount AND Units=@units AND Feature=@feature AND Id<>@id LIMIT 1"); // AND
																																								// Id<>@id
	q.AddParameter("ref", orderitem.Ref);
	q.AddParameter("sku", orderitem.SKU);
	q.AddParameter("discount", orderitem.Discount);
	q.AddParameter("units", orderitem.Units);
	q.AddParameter("feature", orderitem.Feature);
	q.AddParameter("id", orderitem.Id);
	var rst = q.ExecuteCount();
	if (parseInt(rst) != parseInt(0)) {
		var twin = q.ExecuteScalar();
		twin = twin.GetObject();
		twin.Qty += orderitem.Qty;
		twin.Save();
		DB.Delete(orderitem.Id);
	} else
		orderitem.Save();
}
