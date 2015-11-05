﻿var itemsQty;
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

function GetOutlet(){
	return GlobalWorkflow.GetOutlet();
}

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

function FindExecutedOrder(){
	if ($.Exists('executedOrder')) //this dirty hack is used in Events.js (OnApplicationRestore, OnWorkflowStart) too, think twice before edit here
		return $.executedOrder;
	else
		return null;
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

function GetOutlets(searchText) {
	if (String.IsNullOrEmpty(searchText)) {
		var query = new Query("SELECT O.Id, T.Outlet, O.Description, O.Address FROM Catalog_Territory_Outlets T JOIN Catalog_Outlet O ON O.Id=T.Outlet ORDER BY O.Description LIMIT 500");
		return query.Execute();
	} else {
		searchText = StrReplace(searchText, "'", "''");
		searchText = "'" + searchText + "'";
		var query = new Query("SELECT O.Id, T.Outlet, O.Description, O.Address FROM Catalog_Territory_Outlets T JOIN Catalog_Outlet O ON O.Id=T.Outlet WHERE Contains(O.Description, " + searchText + ") ORDER BY O.Description LIMIT 500");
		return query.Execute();
	}
}

function AddGlobalAndAction(name, value, actionName) {
	$.AddGlobal(name, value);
	Workflow.Action(actionName, [ value ]);
}

function GetPriceListQty(outlet) {
	var query = new Query("SELECT DISTINCT D.Id, D.Description FROM Catalog_Outlet_Prices O JOIN Document_PriceList D ON O.PriceList=D.Id WHERE O.Ref = @Ref ORDER BY O.LineNumber");
	query.AddParameter("Ref", outlet);
	var pl = query.ExecuteCount();
	if (parseInt(pl) == parseInt(0)) {
		var query = new Query("SELECT Id FROM Document_PriceList WHERE DefaultPriceList = @true");
		query.AddParameter("true", true);
		return query.ExecuteCount();
	} else
		return pl;

}

function ApplyComment(sender, thisDoc){ //dirty hack, see SUPA-1784
	var obj = thisDoc.GetObject();
	obj.Commentary = sender.Text;
	obj.Save();
}

function HasOrderParameters() {

	var query = new Query("SELECT DISTINCT Id From Catalog_OrderParameters WHERE Visible = 1");
	orderParametersCount = query.ExecuteCount();
	return orderParametersCount > 0;

}

function GetOrderParameters(outlet) {
	var query = new Query("SELECT P.Id, P.Description, P.DataType, DT.Description AS TypeDescription, " +
		" OP.Id AS ParameterValue, OP.Value, P.Visible, P.Editable, " +
		" CASE WHEN P.DataType=@integer OR P.DataType=@decimal OR P.DataType=@string " +
		" THEN 1 ELSE 0 END AS IsInputField, " +
		" CASE WHEN P.DataType=@integer OR P.DataType=@decimal THEN 'numeric' " +
		" ELSE 'auto' END AS KeyboardType, " +
		" CASE WHEN P.DataType=@integer OR P.DataType=@decimal OR P.DataType=@string " +
		" THEN OP.Value ELSE " +
		" CASE WHEN OP.Value IS NULL OR RTRIM(OP.Value)='' THEN '—'	" +
		" ELSE OP.Value END " +
		" END AS AnswerOutput " +
		" FROM Catalog_OrderParameters P " +
		" JOIN Enum_DataType DT On DT.Id=P.DataType " +
		" LEFT JOIN Document_"+$.workflow.currentDoc+"_Parameters OP ON OP.Parameter = P.Id AND OP.Ref = @outlet " +
		" WHERE NOT P.DataType=@snapshot");
	query.AddParameter("integer", DB.Current.Constant.DataType.Integer);
	query.AddParameter("decimal", DB.Current.Constant.DataType.Decimal);
	query.AddParameter("string", DB.Current.Constant.DataType.String);
	query.AddParameter("snapshot", DB.Current.Constant.DataType.Snapshot);
	query.AddParameter("outlet", outlet);
	query.AddParameter("attached", Translate["#snapshotAttached#"]);
	result = query.Execute();
	return result;
}

function GoToParameterAction(typeDescription, parameterValue, value, order, parameter, control, parameterDescription,
	editable, isInputField) {

	if (IsNew(order)) {
		if (editable) {

			c_parameterDescription = parameterDescription;
			parameterValue = CreateOrderParameterValue(order, parameter, parameterValue, parameterValue, isInputField);

			if (typeDescription == "ValueList") {  //--------ValueList-------
				var q = new Query();
				q.Text = "SELECT Value, Value FROM Catalog_OrderParameters_ValueList WHERE Ref=@ref UNION SELECT '', '—' ORDER BY Value";
				q.AddParameter("ref", parameter);
				Dialogs.DoChoose(q.Execute(), parameterValue, "Value", Variables[control], null, parameterDescription);
			}
			if (typeDescription == "DateTime") {  //---------DateTime-------
				if (String.IsNullOrEmpty(parameterValue.Value))
					Dialogs.ChooseDateTime(parameterValue, "Value", Variables[control], DateHandler, parameterDescription);
				else
					Dialog.Choose(parameterDescription, [[0, Translate["#clearValue#"]], [1, Translate["#setDate#"]]], DateHandler, [parameterValue, control]);
			}
			if (typeDescription == "Boolean") {  //----------Boolean--------
				Dialogs.ChooseBool(parameterValue, "Value", Variables[control], null, parameterDescription);
			}
			if (typeDescription == "String" || typeDescription == "Integer" || typeDescription == "Decimal") {
				FocusOnEditText(control, '1');
			}
		}
	}
}

function CreateOrderParameterValue(order, parameter, value, parameterValue, isInputField) {
	var q = new Query("SELECT Id FROM Document_"+ $.workflow.currentDoc +"_Parameters WHERE Ref=@ref AND Parameter = @parameter");
	q.AddParameter("ref", order);
	q.AddParameter("parameter", parameter);
	parameterValue = q.ExecuteScalar();
	if (parameterValue == null) {
		parameterValue = DB.Create("Document."+$.workflow.currentDoc+"_Parameters");
		parameterValue.Ref = order;
		parameterValue.Parameter = parameter;
	} else{
		parameterValue = parameterValue.GetObject();
		if (isInputField)
			parameterValue.Value = value;
	}
	parameterValue.Save();
	return parameterValue.Id;
}

function AssignParameterValue(control, typeDescription, parameterValue, value, order, parameter) {
	CreateOrderParameterValue(order, parameter, control.Text, parameterValue, true)
}


function DateHandler(state, args) {
	var parameterValue = state[0];
	var control = state[1];
	if(getType(args.Result)=="System.DateTime"){
		parameterValue = parameterValue.GetObject();
		parameterValue.Value = Format("{0:dd.MM.yyyy HH:mm}", Date(args.Result));
		parameterValue.Save();
		Workflow.Refresh([$.sum, $.executedOrder, $.thisDoc]);
	}
	if (parseInt(args.Result)==parseInt(0)){
		parameterValue = parameterValue.GetObject();
		parameterValue.Value = "";
		parameterValue.Save();
		Workflow.Refresh([$.sum, $.executedOrder, $.thisDoc]);
	}
	if (parseInt(args.Result)==parseInt(1)){
		Dialogs.ChooseDateTime(parameterValue, "Value", Variables[control], DateHandler, c_parameterDescription);
	}
}

function IsEditText(isInputField, editable, order) {
	if (isInputField && editable && IsNew(order)) {
		return true;
	} else {
		return false;
	}
}

function CreateDocumentIfNotExists(executedOrder, visitId) {
	var outlet = GlobalWorkflow.GetOutlet();
	var userRef = $.common.UserRef;

	var order;
	if ($.workflow.currentDoc=="Order")
		order = $.workflow.HasValue("order")==true ? $.workflow.order : null;
	if ($.workflow.currentDoc=="Return")
		order = $.workflow.HasValue("Return")==true ? $.workflow.Return : null;

	var priceLists = GetPriceListQty(outlet);

	if (executedOrder != null) {
		order = executedOrder;
	} else {
		if (order == null) {
			if ($.workflow.currentDoc=="Order") {
				order = DB.Create("Document.Order");
				order.Status = DB.Current.Constant.OrderSatus.New;
			}
			else
				order = DB.Create("Document.Return");


			order.Date = DateTime.Now;
			order.Outlet = outlet;
			order.SR = userRef;
			order.DeliveryDate = DateTime.Now.AddDays(1);
			order.Stock = GetStock(userRef);
			order.Contractor = GetContractors(true, outlet);
			var location = GPS.CurrentLocation;
			if (ActualLocation(location)) {
				order.Lattitude = location.Latitude;
				order.Longitude = location.Longitude;
			}
			if (visitId != null)
				order.Visit = visitId;

			// if (priceLists >= parseInt(1)) {
			var pl = GetPriceListRef(outlet);
			if (pl != null)
				order.PriceList = pl;
			order.Save();
			order = order.Id;
			// }
		}
	}

	if ($.workflow.currentDoc=='Order')
		$.workflow.Add("order", order);
	else
		$.workflow.Add("Return", order);

	return order;

}

function GetPriceListRef(outlet) {
	var query = new Query("SELECT PriceList FROM Catalog_Outlet_Prices WHERE Ref = @Ref ORDER BY LineNumber LIMIT 1");
	query.AddParameter("Ref", outlet);
	var pl = query.ExecuteScalar();
	if (pl != null)
		return pl;
	var query = new Query("SELECT Id FROM Document_PriceList WHERE DefaultPriceList = @true LIMIT 1");
	query.AddParameter("true", true);
	return query.ExecuteScalar();
}

function GetOrderedSKUs(order) {

	var doc;
	if ($.workflow.currentDoc=="Order")
		doc = "Order";
	else
		doc = "Return";

	var query = new Query();
	query.Text = "SELECT Id, SKU, Feature, Qty, Discount, Total, Units, ROUND(Qty*Total, 2) AS Amount FROM Document_" + doc + "_SKUs WHERE Ref = @Ref";
	query.AddParameter("Ref", order);
	var r = query.Execute();
	itemsQty = query.ExecuteCount();
	return r;
}

function GetOrderSUM(order) {

	var doc;
	if ($.workflow.currentDoc=="Order")
		doc = "Order";
	else
		doc = "Return";

	var query = new Query("SELECT SUM(Qty*Total) FROM Document_" + doc + "_SKUs WHERE Ref = @Ref");
	query.AddParameter("Ref", order);
	var sum = query.ExecuteScalar();
	if (sum == null)
		return 0;
	else
		return String.Format("{0:F2}", sum);
}

function CreateOrderStatusVariables() {
	var canc = DB.Current.Constant.OrderSatus.Canceled;
	Variables.Add("workflow.canc", canc);

	var n = DB.Current.Constant.OrderSatus.New;
	Variables.Add("workflow.new", n);

	var cls = DB.Current.Constant.OrderSatus.Closed;
	Variables.Add("workflow.cls", cls);
}

function GetDescription(priceList) {
	if (priceList.EmptyRef())
		return Translate["#noPriceLists#"];
	else
		return (Translate["#priceList#"] + ": " + priceList.Description);
}

function SelectStock(order, outlet, attr, control) {
	if (IsNew(order) && NotEmptyRef(order.PriceList)) {
		var q = new Query("SELECT CS.Id, CS.Description " +
			" FROM Catalog_Stock CS " +
			" JOIN Catalog_Territory_Stocks CTS ON CS.Id = CTS.Stock " +
			" LEFT JOIN Catalog_Territory_Outlets CTO ON CTS.Ref = CTO.Ref " +
			" WHERE CTO.Outlet = @outlet ORDER BY CTS.LineNumber, CS.Description");
		q.AddParameter("outlet", outlet);
		var res = q.Execute().Unload();
		if (res.Count() > 1) {
			var table = [];
			table.push([ DB.EmptyRef("Catalog_Stock"), Translate["#allStocks#"] ]);
			while (res.Next()) {
				table.push([ res.Id, res.Description ]);
			}
			Dialogs.DoChoose(table, order, attr, control, StockSelectHandler, Translate["#stockPlace#"]);
		}
	}
}

function SelectContractor(thisDoc)
{
	if (IsNew(thisDoc) && NotEmptyRef(thisDoc.PriceList)){
		var listChoice = GetContractors(false, thisDoc.Outlet);
		Dialogs.DoChoose(listChoice, thisDoc, "Contractor", $.contractor, null, Translate["#contractor#"]);
	}
}

function GetContractors(chooseDefault, outletRef)
{
	var outlet = outletRef.GetObject();
	var defStr = "";
	var result;
	if (chooseDefault)
		defStr = " AND Isdefault=1 ";

	if (outlet.Distributor==DB.EmptyRef("Catalog.Distributor"))
	{
		var q = new Query("SELECT C.Id, C.Description " +
			"FROM Catalog_Outlet_Contractors O " +
			"JOIN Catalog_Contractors C ON O.Contractor=C.Id " +
			"WHERE O.Ref=@outlet " + defStr + " ORDER BY C.Description");
		q.AddParameter("outlet", outlet.Id);
		result = q.Execute();
	}
	else
	{
		var q = new Query("SELECT  C.Id, C.Description " +

			" FROM Catalog_Distributor_Contractors DC " +
			" JOIN Catalog_Territory_Contractors TC ON DC.Contractor=TC.Contractor " +
			" JOIN Catalog_Territory_Outlets T ON TC.Ref=T.Ref AND T.Outlet=@outlet " +
			" JOIN Catalog_Contractors C ON C.Id=TC.Contractor " +

			" WHERE DC.Ref=@distr " + defStr + "ORDER BY IsDefault desc, C.Description");
		q.AddParameter("outlet", outlet.Id);
		q.AddParameter("distr", outlet.Distributor);
		result = q.Execute();
	}

	if (chooseDefault)
		return result.Id;
	else
		return result;
}

function GetStockDescription(stock) {
	if (stock.EmptyRef())
		return Translate["#allStocks#"];
	else
		return stock.Description;
}

function RefOutput(value)
{
	if (value == DB.EmptyRef("Catalog.Contractors"))
		return "—";
	else
		return value.Description;
}

function GetFeatureDescr(feature) {
	if (feature.Code == "000000001" || $.sessionConst.SKUFeaturesRegistration==false)
		return "";
	else
		return (", " + feature.Description);
}

function SelectPriceListIfIsNew(order, priceLists, executedOrder) {
	if (IsNew(order))
		SelectPriceList(order, priceLists, executedOrder);
}

function IsEditable(executedOrder, order) {
	return executedOrder == null && IsNew(order) && NotEmptyRef(order.PriceList);
}

function CheckIfEmptyAndForward(order, wfName) {
	var empty = parseInt(itemsQty) == parseInt(0);

	if (wfName=="Visit"){
		if (empty){ //clearing parameters and delete order
			DB.Delete(order);
			var query = new Query("SELECT * FROM Document_" + $.workflow.currentDoc + "_Parameters WHERE Ref = @order")
			query.AddParameter("order", order);
			queryResult = query.Execute();
			while (queryResult.Next()) {
				DB.Delete(queryResult.Id);
			}

			if ($.workflow.currentDoc=="Order")
				$.workflow.Remove("order");
			if ($.workflow.currentDoc=="Return")
				$.workflow.Remove("Return");
		}
		else{
			var location = GPS.CurrentLocation;
			if (ActualLocation(location)) {
				var orderObj = order.GetObject();
				orderObj.Lattitude = location.Latitude;
				orderObj.Longitude = location.Longitude;
				orderObj.Save();
			}
		}
		Workflow.Forward([]);
	}

	else if (wfName=="Order" || wfName=="Return")
	{
		if (empty)
			Workflow.Rollback();
		else
			Workflow.Commit();
	}
}

function SaveOrder(order) {
	order.GetObject().Save();
	Workflow.Forward([]);
}

function SetDeliveryDateDialog(order, control, executedOrder, title) {
	if (IsNew(order) && NotEmptyRef(order.PriceList))
		Dialogs.ChooseDateTime(order, "DeliveryDate", control, DeliveryDateCallBack, title);
}

//function DialogCallBack(control, key) {
//	Workflow.Refresh([ null, null, $.executedOrder ]);
//}

function OrderBack() {

	if ($.workflow.name == "Order" || $.workflow.name == "Return")
		Workflow.Rollback();

	else {
		ClearFilters();

		var stepNumber;
		if ($.workflow.currentDoc=="Order")
			stepNumber = '4';
		else
			stepNumber = '5';

		var q = new Query("SELECT NextStep FROM USR_WorkflowSteps WHERE StepOrder<@stepNumber AND Value=0 ORDER BY StepOrder DESC");
		q.AddParameter("stepNumber", stepNumber);
		var step = q.ExecuteScalar();
		if (step==null) {
			Workflow.BackTo("Outlet");
		}
		else
			Workflow.BackTo(step);
	}
}

function ClearFilters() {

	var checkDropF = new Query("SELECT count(*) FROM sqlite_master WHERE type='table' AND name='USR_Filters'");

	var checkDropFResult = checkDropF.ExecuteScalar();

	if (checkDropFResult == 1) {

		var dropF = new Query("DELETE FROM USR_Filters");

		dropF.Execute();

	}
}

function ShowInfoIfIsNew() {
	if ($.workflow.order.IsNew()) {
		DoAction(ShowInfo, $sum);
	} else
		Dialog.Message("#impossibleToEdit#");
}

function DeleteItem(item, executedOrder) {
	DB.Delete(item, true);
	Workflow.Refresh([ null, executedOrder ]);
}

function EditIfNew(order, orderItem) {
	orderItem = orderItem.GetObject();
	if (order.IsNew()){
		if (Variables.Exists("AlreadyAdded") == false)
			Variables.AddGlobal("AlreadyAdded", true);
		$.AddGlobal("itemFields", new Dictionary());
		$.itemFields.Add("Qty", orderItem.Qty);
		$.itemFields.Add("Price", orderItem.Price);
		$.itemFields.Add("Discount", orderItem.Discount);
		$.itemFields.Add("Total", orderItem.Total);
		$.itemFields.Add("Units", orderItem.Units);
		$.itemFields.Add("Feature", orderItem.Feature);
		$.itemFields.Add("Id", orderItem.Id);
		//for OrderItemInit
		$.itemFields.Add("SKU", orderItem.SKU);
		$.itemFields.Add("recOrder", orderItem.Qty);
		$.itemFields.Add("Ref", orderItem.Ref);	
		$.itemFields.Add("basePrice", GetBasePrice(order.PriceList, orderItem.SKU));

	    OrderItem.InitItem($.itemFields);

		Workflow.Action("Edit", []);
	}
}

function GetBasePrice(priceList, sku){
	var q = new Query("SELECT Price FROM Document_PriceList_Prices WHERE Ref=@priceList AND SKU=@sku");
	q.AddParameter("priceList", priceList);
	q.AddParameter("sku", sku);
	return q.ExecuteScalar();
}

function FormatDate(datetime) {
	return Format("{0:g}", Date(datetime));
}


// ----------------------------------Functions---------------------------

function GetStock(userRef) {
	if ($.sessionConst.MultStck == false)
		return DB.EmptyRef("Catalog_Stock");
	var q = new Query("SELECT CTS.Stock " +
		" FROM Catalog_Territory_Stocks CTS " +
		" JOIN Catalog_Territory_Outlets CTO ON CTS.Ref = CTO.Ref " +
		" WHERE CTO.Outlet = @outlet LIMIT 1");
	q.AddParameter("outlet", outlet)
	var s = q.ExecuteScalar();
	if (s == null)
		return DB.EmptyRef("Catalog_Stock");
	else
		return s;
}

function SelectPriceList(order, priceLists, executedOrder) {
	if (parseInt(priceLists) != parseInt(1) && parseInt(priceLists) != parseInt(0) && executedOrder == null) {
		var query = new Query("SELECT DISTINCT D.Id, D.Description FROM Catalog_Outlet_Prices O JOIN Document_PriceList D ON O.PriceList=D.Id WHERE O.Ref = @Ref ORDER BY O.LineNumber");
		query.AddParameter("Ref", order.Outlet);
		var pl = query.ExecuteCount();
		if (parseInt(pl) == parseInt(0)) {
			var query = new Query("SELECT Id, Description FROM Document_PriceList WHERE DefaultPriceList = @true");
			query.AddParameter("true", true);
		}
		var table = query.Execute();
		PriceListSelect(order, "PriceList", table, Variables["priceListTextView"]);
	}
}

function PriceListSelect(entity, attribute, table, control) {
	Dialogs.DoChoose(table, entity, attribute, control, DoPriceListCallback, Translate["#priceList#"]);
	return;
}

function DoPriceListCallback(state, args) {
	var order = state[0];
	var oldPriceList = order[state[1]];
	if ((oldPriceList.ToString()==(args.Result).ToString())){
		return;
	}

	var entity = order;
	var newPriceList = args.Result;

	if (OrderWillBeChanged(entity, newPriceList)) {
		Dialog.Ask(Translate["#" + $.workflow.currentDoc + "skuWillBeDeleted#"], PositiveCallback, [entity, newPriceList, state[2]]);
	}
	else {
		var control = state[2];
		control.Text = args.Result.Description;
		AssignDialogValue(state, args);
		ReviseSKUs(entity, args.Result, entity.Stock);
	}
	return;
}

function PositiveCallback(state, args) {
	var order = state[0];
	var priceList = state[1];
	var control = state[2];

	order = order.GetObject();
	order.PriceList = priceList;
	order.Save();

	control.Text = priceList.Description;
	ReviseSKUs(order.Id, priceList, order.Stock);
}

function DeliveryDateCallBack(state, args){
	AssignDialogValue(state, args);
	$.deliveryDate.Text = Format("{0:g}", Date(args.Result));
}

function OrderWillBeChanged(order, newPriceList) {
	var query = new Query(
		"SELECT DISTINCT " +
		" O.SKU " +
		" FROM Document_" + $.workflow.currentDoc + "_SKUs O " +
		" LEFT JOIN Document_PriceList_Prices P ON O.SKU = P.SKU AND P.Ref = @priceList " +
		" WHERE	" +
		" O.Ref = @order AND P.Ref IS NULL");
	query.AddParameter("order", order);
	query.AddParameter("priceList", newPriceList);
	count = query.ExecuteCount();
	return count > 0;
}

function StockSelectHandler(state, args) {
	var entity = AssignDialogValue(state, args);

	var control = state[2];
	if (args.Result.EmptyRef())
		control.Text = Translate["#allStocks#"];
	else
		control.Text = args.Result.Description;
	ReviseSKUs($.workflow.order, $.workflow.order.PriceList, args.Result);
	return;
}

function ReviseSKUs(order, priceList, stock) {

	var q = new Query("SELECT Id FROM Document_" + $.workflow.currentDoc + "_SKUs WHERE Ref=@ref");
	q.AddParameter("ref", entity);
	if (parseInt(q.ExecuteCount()) != parseInt(0))
		Dialog.Message(Translate["#" + $.workflow.currentDoc + "SKUWillRevised#"]);

	var query = new Query();
	query.Text = "SELECT O.Id, O.Qty, O.Discount, O.Price, O.Total, " +
	" O.Amount, P.Price AS NewPrice, SS.StockValue AS NewStock, SP.Multiplier " +
	" FROM Document_" + $.workflow.currentDoc + "_SKUs O " +
	" LEFT JOIN Document_PriceList_Prices P ON O.SKU=P.SKU AND P.Ref = @priceList " +
	" LEFT JOIN Catalog_SKU_Stocks SS ON SS.Ref=O.SKU AND SS.Stock = @stock " +
	" JOIN Catalog_SKU_Packing SP ON O.Units=SP.Pack AND SP.Ref=O.SKU " +
	" WHERE O.Ref=@order";
	query.AddParameter("order", order);
	query.AddParameter("priceList", priceList);
	query.AddParameter("stock", stock);
	var SKUs = query.Execute();

	while (SKUs.Next()) {
		if (SKUs.NewStock == null && order.Stock.EmptyRef() == false)
			DB.Delete(SKUs.Id);
		else {
			if (SKUs.NewPrice == null)
				DB.Delete(SKUs.Id);
			else {
				var sku = SKUs.Id;
				sku = sku.GetObject();
				sku.Price = SKUs.NewPrice * SKUs.Multiplier;
				sku.Total = (sku.Discount / 100 + 1) * sku.Price;
				sku.Amount = sku.Qty * sku.Total;
				sku.Save();
			}
		}
	}

	return;
}

//mass discount

function MassDiscount(thisDoc){
	var d = GlobalWorkflow.GetMassDiscount(thisDoc);
	var output = String.IsNullOrEmpty(d) ? '0' : d.ToString();
	$.massDiscountDescription.Text = OrderDiscountDescription(output);
	return output;
}

function SetMassDiscount(sender, thisDoc){  
	
	var massDisc = MassDiscount(thisDoc);

	if (parseFloat(massDisc)!=parseFloat(sender.Text)){
		if (String.IsNullOrEmpty(sender.Text))
			sender.Text = '0';

		var t = new Query("SELECT MAX " + 
			"(CASE WHEN Price=Total THEN 0 " +
				" ELSE 1 " +
				" END ) " +
			" FROM Document_Order_SKUs " +
			" WHERE Ref=@ref");
		t.AddParameter("ref", thisDoc);
		var result = t.ExecuteScalar() == null ? 0 : t.ExecuteScalar();
		if (parseInt(result) == parseInt(1))
			Dialog.Message(Translate["#orderDiscountReset#"]);

		var discount = sender.Text;
		GlobalWorkflow.SetMassDiscount(discount); 
		var q = new Query("SELECT Id, Price, Total " +
			" FROM Document_Order_SKUs " +
			" WHERE Ref=@ref");
		q.AddParameter("ref", thisDoc);
		var sku = q.Execute();

		while (sku.Next()){
			var skuObj = sku.Id.GetObject();
			skuObj.Discount = discount;
			skuObj.Total = skuObj.Price * (1 + discount/100);
			skuObj.Amount = skuObj.Total * skuObj.Qty;
			skuObj.Save();

			Global.FindTwinAndUnite(skuObj);
		}

		$.massDiscountDescription.Text = OrderDiscountDescription(discount);
	}	
}

function OrderDiscountDescription(value){

	if (parseFloat(value) == parseFloat(0)
            || parseFloat(value) < parseFloat(0) || value==null)
        return Translate["#"+ $.workflow.currentDoc +"Discount#"];
    else
        return Translate["#"+ $.workflow.currentDoc +"MarkUp#"];
}

function ConvertDiscount(control, thisDoc) {
    control.Text = -1 * control.Text;
    SetMassDiscount(control, thisDoc);
}

