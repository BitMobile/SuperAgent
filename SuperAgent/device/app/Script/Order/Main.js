//---------------------------UI calls----------------

function GetOrderList() {

	var q = new Query("SELECT DO.Id, DO.Outlet, strftime('%d/%m/%Y', DO.Date) AS Date, DO.Number, CO.Description AS OutletDescription, DO.Status FROM Document_Order DO JOIN Catalog_Outlet CO ON DO.Outlet=CO.Id ORDER BY DO.Date DESC LIMIT 100");
	return q.Execute();
}

function OrderCanceled(status) {
	if (status.ToString() == (DB.Current.Constant.OrderSatus.Canceled).ToString())
		return true;
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

function CreateOrderIfNotExists(order, outlet, userRef, visitId, executedOrder) {
	var priceLists = GetPriceListQty(outlet);

	if (executedOrder != null) {
		return executedOrder;
	} else {
		if (order == null) {
			var order = DB.Create("Document.Order");
			order.Date = DateTime.Now;
			if (outlet == null)
				outlet = $.outlet;
			order.Outlet = outlet;
			order.SR = userRef;
			order.DeliveryDate = DateTime.Now.AddDays(1);
			order.Stock = GetStock(userRef);
			var location = GPS.CurrentLocation;
			if (location.NotEmpty) {
				order.Lattitude = location.Latitude;
				order.Longitude = location.Longitude;
			}
			order.Status = DB.Current.Constant.OrderSatus.New;
			if (visitId != null)
				order.Visit = visitId;

			// if (priceLists >= parseInt(1)) {
			var pl = GetPriceListRef(outlet);
			if (pl != null)
				order.PriceList = pl;
			order.Save();
			return order.Id;
			// }
		}

		return order;
	}
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

	var query = new Query();
	query.Text = "SELECT Id, SKU, Feature, Qty, Discount, Total, Units, ROUND(Qty*Total, 2) AS Amount FROM Document_Order_SKUs WHERE Ref = @Ref";
	query.AddParameter("Ref", order);
	return query.Execute();
}

function GetOrderSUM(order) {
	var query = new Query("SELECT SUM(Qty*Total) FROM Document_Order_SKUs WHERE Ref = @Ref");
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

function SelectStock(order, attr, control) {
	if (IsNew(order) && NotEmptyRef(order.PriceList)) {
		var q = new Query("SELECT Id, Description FROM Catalog_Stock");
		var res = q.Execute().Unload();
		var table = [];
		table.push([ DB.EmptyRef("Catalog_Stock"), Translate["#allStocks#"] ]);
		while (res.Next()) {
			table.push([ res.Id, res.Description ]);
		}
		Dialog.Select(Translate["#valueList#"], table, StockSelectHandler, [ order, attr, control ]);
	}
}

function GetStockDescription(stock) {
	if (stock.EmptyRef())
		return Translate["#allStocks#"];
	else
		return stock.Description;
}

function GetFeatureDescr(feature) {
	if (feature.Code == "000000001")
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
	var query = new Query("SELECT Id FROM Document_Order_SKUs WHERE Ref=@ref");
	query.AddParameter("ref", order);
	var save = true;
	if (parseInt(query.ExecuteCount()) == parseInt(0)) {
		DB.Delete(order);
		$.workflow.Remove("order");
		save = false;
	}

	if (wfName == "CreateOrder") {
		if (save)
			order.GetObject().Save();
		Workflow.Commit();
	} else if (wfName == "Order") {
		if (IsNew(order)) {
			order.GetObject().Save();
			DB.Commit();
		}
		DoBackTo("OrderList");
	} else
		Workflow.Action("Forward", []);
}

function SaveOrder(order) {
	order.GetObject().Save();
	Workflow.Forward([]);
}

function SetDeliveryDateDialog(order, control, executedOrder) {
	if (IsNew(order) && NotEmptyRef(order.PriceList))
		DateTimeDialog(order, "DeliveryDate", order.DeliveryDate, control);
}

function DialogCallBack(control, key) {
	Workflow.Refresh([ null, null, $.executedOrder ]);
}

function OrderBack() {
	if ($.workflow.name == "CreateOrder")
		Workflow.Rollback();
	else {
		if ($.workflow.skipSKUs) {
			if ($.workflow.skipQuestions) {
				if ($.workflow.skipTasks) {
					Workflow.BackTo("Outlet");
				} else
					Workflow.BackTo("Visit_Tasks");
			} else
				Workflow.BackTo("Questions");
		} else{
			Variables.Remove("group_filter");
			Variables.Remove("brand_filter");
			Workflow.Back();
		}
	}

}

function ShowInfoIfIsNew() {
	if ($.workflow.order.IsNew()) {
		DoAction(ShowInfo, $sum);
	} else
		Dialog.Message("#impossibleToEdit#");
}

function DeleteItem(item, executedOrder) {
	DB.Delete(item);
	Workflow.Refresh([ null, executedOrder ]);
}

function EditIfNew(order, param1, param2, param3) {
	if (order.IsNew())
		Workflow.Action("Edit", [ param1, param2, param3 ]);
}

// ----------------------------------Functions---------------------------

function GetStock(userRef) {
	if ($.sessionConst.MultStck == false)
		return DB.EmptyRef("Catalog_Stock");

	var q = new Query("SELECT S.Stock FROM Catalog_Territory_Stocks S WHERE S.LineNumber = 1 LIMIT 1");
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
	Dialog.Select("#select_answer#", table, DoPriceListCallback, [ entity, attribute, control ]);
	return;
}

function DoPriceListCallback(key, args) {
	var entity = args[0];
	var attribute = args[1];
	var control = args[2];

	if ((entity[attribute]).ToString() == key.ToString())
		return;

	entity[attribute] = key;
	entity.GetObject().Save();
	control.Text = key.Description;
	ReviseSKUs(entity, key, entity.Stock);
	return;
}

function StockSelectHandler(key, args) {
	var entity = args[0];
	var attribute = args[1];
	var control = args[2];
	entity[attribute] = key;
	entity.GetObject().Save();
	if (key.EmptyRef())
		control.Text = Translate["#allStocks#"];
	else
		control.Text = key.Description;
	ReviseSKUs($.workflow.order, $.workflow.order.PriceList, key);
	return;
}

function ReviseSKUs(order, priceList, stock) {

	var q = new Query("SELECT Id FROM Document_Order_SKUs WHERE Ref=@ref");
	q.AddParameter("ref", entity);
	if (parseInt(q.ExecuteCount()) != parseInt(0))
		Dialog.Message(Translate["#SKUWillRevised#"]);

	var query = new Query();
	query.Text = "SELECT O.Id, O.Qty, O.Discount, O.Price, O.Total, " + " O.Amount, P.Price AS NewPrice, SS.StockValue AS NewStock, SP.Multiplier " + " FROM Document_Order_SKUs O " + " LEFT JOIN Document_PriceList_Prices P ON O.SKU=P.SKU AND P.Ref = @priceList " + " LEFT JOIN Catalog_SKU_Stocks SS ON SS.Ref=O.SKU AND SS.Stock = @stock " + " JOIN Catalog_SKU_Packing SP ON O.Units=SP.Pack AND SP.Ref=O.SKU " + " WHERE O.Ref=@order";
	query.AddParameter("order", order);
	query.AddParameter("priceList", priceList);
	query.AddParameter("stock", stock);
	var SKUs = query.Execute();

	while (SKUs.Next()) {
		if (SKUs.NewStock == null && $.workflow.order.Stock.EmptyRef() == false)
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
