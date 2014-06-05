function GetMultiplier(sku, orderitem) {

	if (orderitem != null) {
		// var item = DB.Current.Catalog.SKU_Packing.SelectBy("Pack",
		// orderitem.Units).Where("Ref==@p1", [sku]).First();
		var q = new Query(
				"SELECT Multiplier FROM Catalog_SKU_Packing WHERE Pack=@pack and Ref=@ref");
		q.AddParameter("pack", orderitem.Units);
		q.AddParameter("ref", sku);
		return q.ExecuteScalar();
	}
	return parseInt(1);
}

function GetFeatures(sku) {
	var query = new Query(
			"SELECT Feature FROM Catalog_SKU_Stocks WHERE Ref=@Ref ORDER BY LineNumber");
	query.AddParameter("Ref", sku);
	return query.Execute();
}

function CreateOrderItemIfNotExist(order, sku, orderitem, price, features) {

	if (orderitem == null) {

		var query = new Query(
				"SELECT Feature FROM Catalog_SKU_Stocks WHERE Ref = @Ref ORDER BY LineNumber LIMIT 1");
		query.AddParameter("Ref", sku);
		var feature = query.ExecuteScalar();

		var query = new Query(
				"SELECT Id FROM Document_Order_SKUs WHERE Ref = @Ref AND Feature = @Feature LIMIT 1");
		query.AddParameter("Ref", sku);
		query.AddParameter("Feature", feature);
		var r = query.ExecuteScalar();
		if (r != null)
			return r;
		else {
			// getting a unit
			var q = new Query("SELECT Pack, Multiplier FROM Catalog_SKU_Packing WHERE Ref=@ref AND LineNumber=1");
			q.AddParameter("ref", sku);
			var defaultUnit = q.Execute();

			var p = DB.Create("Document.Order_SKUs");
			p.Ref = order;
			p.SKU = sku;
			p.Feature = feature;
			p.Price = price * defaultUnit.Multiplier;
			p.Total = price * defaultUnit.Multiplier;
			p.Units = defaultUnit.Pack;
			p.Discount = 0;
			p.Save();
			return p.Id;
		}
	} else {
		if (parseInt(orderitem.Discount) != parseInt(0))
			Variables["param4"] = orderitem.Discount;
		return orderitem;
	}

}

function GetDiscountDescription(orderitem) {
	if (parseInt(orderitem.Discount) == parseInt(0)
			|| parseInt(orderitem.Discount) < parseInt(0))
		return Translate["#discount#"];
	else
		return Translate["#markUp#"];
}

function ApplyDiscount(sender, orderitem) {
	if (IsNullOrEmpty(sender.Text))
		sender.Text = parseInt(0);
	else {
		if ($.discountDescr.Text == Translate["#discount#"]
				&& parseInt(sender.Text) > parseInt(0))
			$.discountEdit.Text = -1 * $.discountEdit.Text;
	}

	orderitem = orderitem.GetObject();
	orderitem.Discount = $.discountEdit.Text;
	orderitem.Save();

	CountPrice(orderitem.Id);
}

function ChandeDiscount(orderitem) {
	if ($.discountDescr.Text == Translate["#discount#"]) {
		$.discountDescr.Text = Translate["#markUp#"];
	} else
		$.discountDescr.Text = Translate["#discount#"];

	orderitem = orderitem.GetObject();
	orderitem.Discount = -1 * orderitem.Discount;
	orderitem.Save();

	$.discountEdit.Text = orderitem.Discount;
	CountPrice(orderitem.Id);
}

function GetFeatureDescr(feature) {
	if (feature.Code == "000000001")
		return "";
	else
		return (", " + feature.Description);
}

function CalculatePrice(price, discount, multiplier) {

	var total = (price * (discount / 100 + 1)) * multiplier;
	return total;

}

function RefreshEditSKU(orderItem, sku, price, discountEdit, showimage) {
	var d = $.discountEdit.Text;
	var arr = [ sku, price, orderItem, d, showimage ];// , discountText];
	Workflow.Refresh(arr);
}

function GetSharedImagePath(objectType, objectID, pictID, pictExt) {

	return "/shared/" + objectType + "/" + objectID.Id.ToString() + "/"
			+ pictID.ToString() + pictExt;

}

function CountPrice(orderitem) {

	orderitem = orderitem.GetObject();
	
	var discount = $.discountEdit.Text;
	if (String.IsNullOrEmpty(discount))
		discount = parseInt(0);
	p = CalculatePrice(orderitem.Price, discount, 1);
	// orderitem.Discount = Converter.ToDecimal(discount);
	orderitem.Total = p;
	orderitem.Save();
	
	$.orderItemTotalId.Text = p;
	
	return orderitem;
}

function ReNewControls(p, discount) {

	
	// $.discountEdit.Text = discount;
}

function ChangeFeatureAndRefresh(orderItem, feature, sku, price, discountEdit,
		showimage) {

	if (orderItem.Feature != feature.Feature) {
		var itemObj = orderItem.GetObject();
		itemObj.Feature = feature;
		itemObj.Save()
		RefreshEditSKU(orderItem, sku, price, discountEdit, showimage);
	}
}

function ChangeUnit(sku, orderitem, price) {

	orderitem = orderitem.GetObject();

	var q1 = new Query(
			"SELECT LineNumber FROM Catalog_SKU_Packing WHERE Pack=@pack AND Ref=@ref");
	q1.AddParameter("ref", sku);
	q1.AddParameter("pack", orderitem.Units);
	var currLineNumber = q1.ExecuteScalar();

	var q2 = new Query(
			"SELECT Pack, Multiplier FROM Catalog_SKU_Packing WHERE Ref=@ref AND LineNumber=@lineNumber");
	q2.AddParameter("ref", sku);
	q2.AddParameter("lineNumber", currLineNumber + 1);
	var selectedUnit = q2.Execute();
	if (selectedUnit.Pack == null) {
		q2 = new Query(
				"SELECT Pack, Multiplier FROM Catalog_SKU_Packing WHERE Ref=@ref AND LineNumber=@lineNumber");
		q2.AddParameter("ref", sku);
		q2.AddParameter("lineNumber", 1);
		var selectedUnit = q2.Execute();
	}

	orderitem.Price = price * selectedUnit.Multiplier;
	Variables["multiplier"] = selectedUnit.Multiplier;
	orderitem.Units = selectedUnit.Pack;
	Variables["itemUnits"].Text = selectedUnit.Pack.Description;
	orderitem.Save();

	orderitem = CountPrice(orderitem.Id, price)

}

function GetItemHistory(sku, order) {
	var q = new Query("SELECT D.Date, S.Qty*P.Multiplier AS Qty, S.Total/P.Multiplier AS Total FROM Document_Order_SKUs S JOIN Document_Order D ON S.Ref=D.Id JOIN Catalog_SKU_Packing P ON S.SKU=P.Ref AND P.Pack=S.Units WHERE D.Outlet=@outlet AND S.SKU=@sku AND S.Ref<>@ref ORDER BY D.Date LIMIT 4");
	q.AddParameter("outlet", order.Outlet);
	q.AddParameter("sku", sku);
	q.AddParameter("ref", order);	
	
	$.Add("historyCount", q.ExecuteCount());
	
	return q.Execute();
}

function CalculateSKUAndForward(outlet, orderitem) {

	if (Converter.ToDecimal(orderitem.Qty) == Converter.ToDecimal(0)) {
		DB.Delete(orderitem);
	} else {
		FindTwinAndUnite(orderitem.GetObject());
	}

	Workflow.Forward([]);
}

function DeleteAndBack(orderitem) {
	if (Variables.Exists("AlreadyAdded") == false) {
		DB.Delete(orderitem);
	} else
		Variables.Remove("AlreadyAdded");
	Workflow.Back();
}

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