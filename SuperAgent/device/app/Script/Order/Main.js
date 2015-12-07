var itemsQty;
var listTitle;
var mainTitle;
var infoTitle;
var sumTitle;
var skuTitle;
var infoTitleSmall;
var back;
var c_parameterDescription;
var c_docParams;

function OnLoading(){

	if ($.workflow.step=='OrderList')
		listTitle = Translate["#orders#"];
	else
		listTitle = Translate["#returns#"];

	if ($.workflow.currentDoc=='Order'){
		mainTitle = Translate["#order#"];
		infoTitle = Translate["#orderInfo#"];
		sumTitle = Translate["#orderSum#"];
		skuTitle = Translate["#skuInOrder#"];
		infoTitleSmall = Translate["#orderInfoSmall#"];
		c_docParams = Translate["#orderParameters#"];
	}
	else{
		mainTitle = Translate["#return#"];
		infoTitle = Translate["#returnInfo#"];
		sumTitle = Translate["#returnSum#"];
		skuTitle = Translate["#skuInReturn#"];
		infoTitleSmall = Translate["#returnInfoSmall#"];
		c_docParams = Translate["#returnParameters#"];
	}

	var menuItem = GlobalWorkflow.GetMenuItem();
	back = (menuItem == "Orders" || menuItem == "Returns" ? Translate["#clients#"] : Translate["#back#"]);

}


//---------------------------UI calls----------------

function GetItems() {

	var q = new Query();

	if ($.workflow.step=='OrderList') {
		q.Text = "SELECT DO.Id, DO.Outlet, strftime('%d/%m/%Y', DO.Date) AS Date, DO.Number, " +
		" CO.Description AS OutletDescription, DO.Status " +
		" FROM Document_Order DO JOIN Catalog_Outlet CO ON DO.Outlet=CO.Id ORDER BY DO.Date DESC LIMIT 100";
	}
	else{
		q.Text = "SELECT DO.Id, DO.Outlet, strftime('%d/%m/%Y', DO.Date) AS Date, DO.Number, " +
		" CO.Description AS OutletDescription, NULL AS Status " +
		" FROM Document_Return DO " +
		" JOIN Catalog_Outlet CO ON DO.Outlet=CO.Id ORDER BY DO.Date DESC LIMIT 100";
	}

	return q.Execute();
}

function SelectOrder(order, outlet){
	order = order.GetObject();
	GlobalWorkflow.SetOutlet(outlet);
	$.AddGlobal("executedOrder", order.Id);
	DoAction('Edit');
}

function OrderCanceled(status) {
	if ($.workflow.step == "OrderList") {
		if (status.ToString() == (DB.Current.Constant.OrderSatus.Canceled).ToString())
			return true;
	}
	return false;
}

function AssignNumberIfNotExist(number) {

	if (number == null)
		var number = Translate["#noNumber#"];

	return number;

}

