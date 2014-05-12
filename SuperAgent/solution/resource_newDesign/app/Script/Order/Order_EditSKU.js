
function GetMultiplier(sku, orderitem) {

    if (orderitem != null) {
        //var item = DB.Current.Catalog.SKU_Packing.SelectBy("Pack", orderitem.Units).Where("Ref==@p1", [sku]).First();
        var q = new Query("SELECT Multiplier FROM Catalog_SKU_Packing WHERE Pack=@pack and Ref=@ref");
        q.AddParameter("pack", orderitem.Units);
        q.AddParameter("ref", sku);
        return q.ExecuteScalar();
    }
    return parseInt(1);
}

function GetFeatures(sku) {
    var query = new Query("SELECT Feature FROM Catalog_SKU_Stocks WHERE Ref=@Ref ORDER BY LineNumber");
    query.AddParameter("Ref", sku);
    return query.Execute();
}

function CreateOrderItemIfNotExist(order, sku, orderitem, price, features) {

    if (orderitem == null) {

        var query = new Query("SELECT Feature FROM Catalog_SKU_Stocks WHERE Ref = @Ref ORDER BY LineNumber LIMIT 1");
        query.AddParameter("Ref", sku);
        var feature = query.ExecuteScalar();

        var query = new Query("SELECT Id FROM Document_Order_SKUs WHERE Ref = @Ref AND Feature = @Feature LIMIT 1");
        query.AddParameter("Ref", sku);
        query.AddParameter("Feature", feature);
        var r = query.ExecuteScalar();
        if (r != null)
            return r;
        else {
            var p = DB.Create("Document.Order_SKUs");
            p.Ref = order;
            p.SKU = sku;
            p.Feature = feature;
            p.Price = price;
            p.Total = price;
            p.Units = sku.BaseUnit;
            p.Discount = 0;
            p.Save();
            return p.Id;
        }
    }
    else {
        if (parseInt(orderitem.Discount) != parseInt(0))
            Variables["param4"] = orderitem.Discount;
        return orderitem;
    }

}

function GetFeatureDescr(feature) {
    if (feature.Code == "000000001")
        return "";
    else
        return (", " + feature.Description);
}

function CalculateSKUAndForward(outlet, orderitem) {

    if (Converter.ToDecimal(orderitem.Qty) == Converter.ToDecimal(0))
        DB.Delete(orderitem);
    else {
        var discount = Variables["discountEdit"].Text;

        if (discount == null || discount == "")
            discount = 0;

        Variables["orderitem"].Discount = Converter.ToDecimal(discount);
        var p = CalculatePrice(orderitem.Price, discount, 1);
        Variables["orderitem"].Total = p;
    }
    Dialog.Debug(Variables["orderitem"].GetObject());

    Workflow.Forward([outlet]);
}

function CalculatePrice(price, discount, multiplier) {

    var total = (price * (discount / 100 + 1)) * multiplier;
    return total

}

function RefreshEditSKU(orderItem, sku, price, discountEdit, showimage) {
    var d = Variables["discountEdit"].Text;
    var ch = Variables["discCheckbox"]["Checked"];
    var arr = [sku, price, orderItem, d, showimage, ch];//, discountText];
    Workflow.Refresh(arr);
}

function GetSharedImagePath(objectType, objectID, pictID, pictExt) {

    return "/shared/" + objectType + "/" + objectID.ToString() + "/" + pictID.ToString() + pictExt;

}

function CountPrice(orderitem, discChBox, price) {

    discChBox = Variables["discCheckbox"]["Checked"];

    var discount = Variables["discountEdit"].Text;

    if (discount == null || discount == "")
        discount = 0;
    if (discount < 0)
        discount = -discount;

    if (discChBox) {
        discChBox = 1;
        Variables["discTextView"].Text = Translate["#markUp#"];
    }
    else {
        discChBox = -1;
        Variables["discTextView"].Text = Translate["#discount#"];
    }

    p = CalculatePrice(orderitem.Price, (discount * discChBox), 1);
    Variables["orderitem"].Discount = Converter.ToDecimal(discount * discChBox);

    ReNewControls(p, orderitem.Discount);

    return orderitem;
}

function ChangeUnit(sku, orderitem, discChBox, price) {

    ////var currUnit = DB.Current.Catalog.SKU_Packing.SelectBy("Ref", sku.Id).Where("Pack==@p1", [orderitem.Units]).First();
    //var currUnit = new Query("SELECT LineNumber FROM Catalog.SKU");

    //var unit = DB.Current.Catalog.SKU_Packing.SelectBy("Ref", sku.Id).Where("LineNumber==@p1", [(currUnit.LineNumber + 1)]).First();
    //if (unit == null)
    //    unit = DB.Current.Catalog.SKU_Packing.SelectBy("Ref", sku.Id).Where("LineNumber==@p1", [1]).First();

    //if (price == null) {
    //    //price = DB.Current.Document.PriceList_Prices.SelectBy("Ref", orderitem.RefAsObject().PriceList).Where("SKU==@p1", [orderitem.SKU]).First();
    //    var q = new Query("SELECT Price FROM Document_PriceList_Prices WHERE Ref=@ref AND SKU=@sku");
    //    q.AddParameter("ref", orderitem.Ref.PriceList);
    //    q.AddParameter("sku", orderitem.SKU);
    //    price = Converter.ToDecimal(q.ExecuteScalar());
    //}

    //Variables["orderitem"].Price = price * unit.Multiplier;
    //Variables["multiplier"] = unit.Multiplier;
    //Variables["orderitem"].Units = unit.Pack;
    //Variables["itemUnits"].Text = unit.PackAsObject().Description;

    //orderitem = CountPrice(orderitem, discChBox, price)

    //ReNewControls(p, orderitem.Discount);

}

function GetItemHistory(sku, order) {
    //var byOutlets = DB.Current.Document.Order.SelectBy("Outlet", order.Outlet).Distinct("Id");
    //var hist = DB.Current.Document.Order_SKUs.SelectBy("Ref", byOutlets).Where("Ref != @p1 && SKU == @p2", [order.Id, sku.Id]).OrderBy("RefAsObject.Date", true).Top(4);

    //return hist;
    return [];
}