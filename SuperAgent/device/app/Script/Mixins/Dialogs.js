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
	Dialog.ShowDateTime(header, date, DoSelectCallback2, [ entity, attribute, control ]);
}

function BooleanDialogSelect(entity, attribute, control) {
	var arr = [];
	arr.push([ null, "-" ]);
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
	
	DialogCallBack(control, key.Description);
//	return;
}

function DoSelectCallback2(key, args) {
	var entity = args[0];
	var attribute = args[1];
	var control = args[2];
	entity[attribute] = key;
	entity.GetObject().Save();
	DialogCallBack(control, key);
	//return;
}