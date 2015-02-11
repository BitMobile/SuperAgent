function DoChoose(listChoice, entity, attribute, control, func) {
	if (listChoice==null){
		var tableName = entity[attribute].Metadata().TableName;
		var query = new Query();
		query.Text = "SELECT Id, Description FROM " + tableName;
		listChoice = query.Execute();
	}	
	if (func == null)
		func = CallBack;
	Dialog.Choose("#select_answer#", listChoice, entity[attribute], func, [entity, attribute, control]); 
}

function ChooseDateTime(entity, attribute, control) {
	var current;
	if (String.IsNullOrEmpty(entity[attribute]))
		current = DateTime.Now;
	else
		current = entity[attribute];
	Dialog.DateTime("#enterDateTime#", current, CallBack, [entity, attribute, control]);
}

function ChooseBool(entity, attribute, control) {
	var listChoice = [[ "—", "—" ], [Translate["#YES#"], Translate["#YES#"]], [Translate["#NO#"], Translate["#NO#"]]];
	Dialog.Choose("#select_answer#", listChoice, entity[attribute], CallBack, [entity, attribute, control]);  
}

//----------------------Dialog CallBack functions-------------


function CallBack(state, args) {
	AssignDialogValue(state, args);
	var control = state[2];
	if (getType(args.Result)=="BitMobile.DbEngine.DbRef")
		control.Text = args.Result.Description;
	else
		control.Text = args.Result;
}

function AssignDialogValue(state, args) {
	var entity = state[0];
	var attribute = state[1];
	entity[attribute] = args.Result;
	entity.GetObject().Save();
	return entity;
}