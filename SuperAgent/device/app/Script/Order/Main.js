function GetOrderList() {

	// if (String.IsNullOrEmpty(searchText)) {
	// return DB.Current.Document.Order.Select().OrderBy("Date", true).Top(100);
	// }
	// else {
	// return
	// DB.Current.Document.Order.Select().Where("OutletAsObject.Description.Contains(@p1)",
	// [searchText]).OrderBy("Date", true).Top(100);
	// }
	var q = new Query(
			"SELECT DO.Id, DO.Outlet, DO.Date, DO.Number, CO.Description AS OutletDescription FROM Document_Order DO JOIN Catalog_Outlet CO ON DO.Outlet=CO.Id ORDER BY DO.Date DESC LIMIT 100");
	return q.Execute();
}

function AssignNumberIfNotExist(number) {

	if (number == null)
		var number = Translate["#noNumber#"];

	return number;

}

function GetOutlets(searchText) {
	if (String.IsNullOrEmpty(searchText)) {
		// var query = new Query();
		// query.Text = "SELECT Id, Address, Description, ConfirmationStatus
		// FROM Catalog_Outlet ORDER BY Description LIMIT 100";
		var query = new Query(
				"SELECT O.Id, T.Outlet, O.Description, O.Address FROM Catalog_Territory_Outlets T JOIN Catalog_Outlet O ON O.Id=T.Outlet ORDER BY O.Description LIMIT 500");
		return query.Execute();
	} else {
		// var query = new Query();
		searchText = "'%" + searchText + "%'";
		// query.Text = "SELECT Id, Address, Description, ConfirmationStatus
		// FROM Catalog_Outlet WHERE Description LIKE " + searchText + " ORDER
		// BY Description LIMIT 100";
		var query = new Query(
				"SELECT O.Id, T.Outlet, O.Description, O.Address FROM Catalog_Territory_Outlets T JOIN Catalog_Outlet O ON O.Id=T.Outlet WHERE O.Description LIKE "
						+ searchText + " ORDER BY O.Description LIMIT 500");
		return query.Execute();
	}
}

function AddGlobalAndAction(name, value, actionName) {
	$.AddGlobal(name, value);
	Workflow.Action(actionName, [ value ]);
}

function GetPriceListQty(outlet) {
	var query = new Query(
			"SELECT DISTINCT D.Id, D.Description FROM Catalog_Outlet_Prices O JOIN Document_PriceList D ON O.PriceList=D.Id WHERE O.Ref = @Ref ORDER BY O.LineNumber");
	query.AddParameter("Ref", outlet);
	var pl = query.ExecuteCount();
	if (parseInt(pl) == parseInt(0)) {
		var query = new Query(
				"SELECT Id FROM Document_PriceList WHERE DefaultPriceList = @true");
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
			order.DeliveryDate = DateTime.Now;
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
	var query = new Query(
			"SELECT PriceList FROM Catalog_Outlet_Prices WHERE Ref = @Ref ORDER BY LineNumber LIMIT 1");
	query.AddParameter("Ref", outlet);
	var pl = query.ExecuteScalar();
	if (pl != null)
		return pl;
	var query = new Query(
			"SELECT Id FROM Document_PriceList WHERE DefaultPriceList = @true LIMIT 1");
	query.AddParameter("true", true);
	return query.ExecuteScalar();
}

function GetOrderedSKUs(order) {

	var query = new Query();
	query.Text = "SELECT Id, SKU, Feature, Qty, Discount, Total, Units, Qty*Total AS Amount FROM Document_Order_SKUs WHERE Ref = @Ref";
	query.AddParameter("Ref", order);
	return query.Execute();
}

function GetOrderSUM(order) {
	var query = new Query(
			"SELECT SUM(Qty*Total) FROM Document_Order_SKUs WHERE Ref = @Ref");
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

function GetFeatureDescr(feature) {
	if (feature.Code == "000000001")
		return "";
	else
		return (", " + feature.Description);
}

function SelectPriceList(order, priceLists, executedOrder) {
	if (parseInt(priceLists) != parseInt(1)
			&& parseInt(priceLists) != parseInt(0) && executedOrder == null) {
		var query = new Query(
				"SELECT DISTINCT D.Id, D.Description FROM Catalog_Outlet_Prices O JOIN Document_PriceList D ON O.PriceList=D.Id WHERE O.Ref = @Ref ORDER BY O.LineNumber");
		query.AddParameter("Ref", order.Outlet);
		var pl = query.ExecuteCount();
		if (parseInt(pl) == parseInt(0)) {
			var query = new Query(
					"SELECT Id FROM Document_PriceList WHERE DefaultPriceList = @true");
			query.AddParameter("true", true);
		}
		var table = query.Execute();
		ValueListSelect2(order, "PriceList", table,
				Variables["priceListTextView"]);
	}

}

function ReviseSKUs(order, priceList) {

	var query = new Query(
			"SELECT O.Id, O.Qty, O.Discount, O.Price, O.Total,	O.Amount, P.Price AS NewPrice, SP.Multiplier FROM Document_Order_SKUs O LEFT JOIN Document_PriceList_Prices P ON O.SKU=P.SKU AND P.Ref=@priceList JOIN Catalog_SKU_Packing SP ON O.Units=SP.Pack AND SP.Ref=O.SKU WHERE O.Ref=@order");
	query.AddParameter("order", order);
	query.AddParameter("priceList", priceList)
	var SKUs = query.Execute();

	/*
	 * for ( var k in SKUs) { var query2 = new Query();
	 * query2.AddParameter("PLid", Variables["workflow"]["order"].PriceList);
	 * query2.AddParameter("sku", k.SKU); query2.Text = "SELECT Id FROM
	 * Document_PriceList_Prices where Ref==@PLid && SKU==@sku"; var
	 * pricelistItem = query2.ExecuteScalar(); if (pricelistItem == null)
	 * DB.Current.Document.Order_SKUs.Delete(k); else { k.Price =
	 * pricelistItem.Price; k.Total = (k.Discount / 100 + 1) * k.Price; k.Amount =
	 * k.Qty * k.Total; } }
	 */

	while (SKUs.Next()) {
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

	return;
}

function ValueListSelect2(entity, attribute, table, control) {
	Dialog.Select("Parameters", table, DoSelectCallback1, [ entity, attribute,
			control ]);
	return;
}

function DoSelectCallback1(key, args) {
	var entity = args[0];
	var attribute = args[1];
	var control = args[2];

	if ((entity[attribute]).ToString() == key.ToString())
		return;

	var q = new Query("SELECT Id FROM Document_Order_SKUs WHERE Ref=@ref");
	q.AddParameter("ref", entity);
	if (parseInt(q.ExecuteCount()) != parseInt(0))
		Dialog.Message(Translate["#SKUWillRevised#"]);

	entity[attribute] = key;
	entity.GetObject().Save();
	control.Text = key.Description;
	ReviseSKUs(entity, key);
	return;
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
	if (wfName != "CreateOrder")
		Workflow.Action("Forward", []);
	else {
		if (save) {
			order.GetObject().Save();
		}
		Workflow.Commit();
	}
}

function SaveOrder(order) {
	order.GetObject().Save();
	Workflow.Forward([]);
}

function SetDeliveryDate(order, attrName) {
	SetDateTime(order, attrName);
}

function SetDateTime(entity, attribute) {
	var NewDateTime = DateTime.Parse(entity[attribute]);
	var Header = Translate["#enterDateTime#"];
	Dialog.ShowDateTime(Header, NewDateTime, DateTimeDialog, entity);
}

function DateTimeDialog(entity, dateTime) {
	entity.DeliveryDate = dateTime;
	Variables["deliveryDate"].Text = dateTime; // refactoring is needed
}

function OrderBack() {
	if ($.workflow.name == "CreateOrder")
		DoRollback();
	else {
		if ($.workflow.skipSKUs) {
			if ($.workflow.skipQuestions) {
				if ($.workflow.skipTasks) {
					Workflow.BackTo("Outlet");
				} else
					Workflow.BackTo("Visit_Tasks");
			} else
				Workflow.BackTo("Questions");
		} else
			Workflow.Back();
	}

}

function ShowInfoIfIsNew() {
	if ($.workflow.order.IsNew()) {
		DoAction(ShowInfo, $sum);
	} else
		Dialog.Message("#impossibleToEdit#");
}