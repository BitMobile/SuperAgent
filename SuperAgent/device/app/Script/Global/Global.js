function DoSelect(entity, attribute, control) {
	var tableName = entity[attribute].Metadata().TableName;
	var query = new Query();
	query.Text = "SELECT Id, Description FROM " + tableName;
	Dialog.Select("#select_answer#", query.Execute(), DoSelectCallback1, [ entity, attribute, control ]);
	return;
}

function DateTimeDialog(entity, attribute, date, control) {
	var header = Translate["#enterDateTime#"];
	if (String.IsNullOrEmpty(date))
		date = DateTime.Now.Date;
	Dialog.Debug(date);
	Dialog.ShowDateTime(header, date, DoSelectCallback2, [ entity, attribute, control ]);
}

function BooleanDialogSelect(entity, attribute, control) {
	var arr = [];
	arr.push([ "", "-" ]);
	arr.push([ Translate["#YES#"], Translate["#YES#"] ]);
	arr.push([ Translate["#NO#"], Translate["#NO#"] ]);
	Dialog.Select(Translate["#valueList#"], arr, DoSelectCallback2, [ entity, attribute, control ]);
}

function ValueListSelect(entity, attribute, table, control) {
	Dialog.Select(Translate["#valueList#"], table, DoSelectCallback2, [ entity, attribute, control ]);
	return;
}

function ValueListSelect2(entity, attribute, table, control) {
	Dialog.Select(Translate["#valueList#"], table, DoSelectCallback1, [ entity, attribute, control ]);
	return;
}

function DoSelectCallback1(key, args) {
	var entity = args[0];
	var attribute = args[1];
	var control = args[2];
	entity[attribute] = key;
	entity.GetObject().Save();
	control.Text = key.Description;
	return;
}

function DoSelectCallback2(key, args) {
	var entity = args[0];
	var attribute = args[1];
	var control = args[2];
	entity[attribute] = key;
	entity.GetObject().Save();
	control.Text = key;
	return;
}

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
