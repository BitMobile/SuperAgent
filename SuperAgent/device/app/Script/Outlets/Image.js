var c_entity;
var c_attribute;

function OnLoad() {
	c_attribute = $.attribute;
	c_entity = $.entity;
}

function Reshoot(control) {
	Images.MakeSnapshot($.outlet, "catalog.outlet", SaveSnapshot);
}

function SaveSnapshot(state, args) {
	if (args.Result) {
		var objRef = state[0];
		var pictId = state[1];
		var source = state[2];
		
		var object = c_entity.GetObject();
		object[c_attribute] = pictId;
		object.Save();		
		
		Workflow.Refresh([source, c_entity, c_attribute]);
	}	
}

function Delete() {
	var object = c_entity.GetObject();
	object[c_attribute] = null;
	
	if (getType(object)=="DefaultScope.Catalog.Outlet_Snapshots")
		object.Deleted = true; 
	
	object.Save();
	Workflow.Back();
}
