
function CreateOutlet() {
	var outlet = DB.Create("Catalog.Outlet");
	outlet.OutletStatus = DB.Current.Constant.OutletStatus.Potential;
	outlet.Save();
	return outlet.Id;
}

function GetTerritory() {
	var q = new Query("SELECT Id From Catalog_Territory LIMIT 1");
	var territory = q.ExecuteScalar();
	if (territory == null) {
		return  territoryEmptyRef;
	}
	else {
		return territory;
	}
	return territory || territoryEmptyRef;
}

function DeleteAndBack(entity) {
	DB.Delete(entity);
	Workflow.Back();
}

function SaveNewOutlet(outlet) {

	outlet = outlet.GetObject();

	if (outlet.Description != null && outlet.Address != null){
		if (TrimAll(outlet.Description) != "" && TrimAll(outlet.Address) != "" && outlet.Class!=DB.EmptyRef("Catalog_OutletClass")
				&& outlet.Type!=DB.EmptyRef("Catalog_OutletType") && $.territory!=null) {

			var to = DB.Create("Catalog.Territory_Outlets");
			to.Ref = $.territory;
			to.Outlet = outlet.Id;
			to.Save();

			outlet.Lattitude = parseInt(0);
			outlet.Longitude = parseInt(0);
			outlet.Save();
			Variables.AddGlobal("outlet", outlet.Id);

			DoAction("Open");

			return null;
		}
	}
	Dialog.Message("#messageNulls#");
}

function DoSelect(source, outlet, attribute, control, title) {
	if (control.Id != "outletTerritory") {
		Dialogs.DoChoose(null, outlet, attribute, control, null, title);
	}
	else
	{
		if ($.territory != DB.EmptyRef("Catalog_Territory")) {
			Dialogs.DoChoose(null, outlet, attribute, control, TerritoryCallBack, title);
		}
	}
}

function TerritoryCallBack(state, args) {
	var control = state[2];
	var attribute = state[1];
	if (getType(args.Result)=="BitMobile.DbEngine.DbRef") {
		$.territory = args.Result;
		control.Text = args.Result.Description;
	}
	else {
		$.territory = DB.EmptyRef("Catalog_Territory");
		control.Text = String.IsNullOrEmpty(args.Result) ? "—" : args.Result;
	}
}
