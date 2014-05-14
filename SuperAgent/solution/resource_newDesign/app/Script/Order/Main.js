
function GetPriceListQty(outlet) {
    var query = new Query("SELECT COUNT(*) FROM Catalog_Outlet_Prices WHERE Ref = @Ref");
    query.AddParameter("Ref", outlet);
    var cnt = query.ExecuteScalar();
    if (cnt == null)
        cnt = 0;
    if (cnt > 0)
        return cnt;
    var query = new Query("SELECT COUNT(*) FROM Document_PriceList WHERE DefaultPriceList = 1");
    cnt = query.ExecuteScalar();
    if (cnt == null)
        return 0;
    else
        return cnt;
}

function CreateOrderIfNotExists(order, outlet, userRef, visitId, executedOrder) {
    var priceLists = GetPriceListQty(outlet);

    if (executedOrder != null) {
        return executedOrder;
    }
    else {
        if (order == null) {
            var order = DB.Create("Document.Order");
            order.Date = DateTime.Now;
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

            //if (priceLists >= parseInt(1)) {
            var pl = GetPriceListRef(outlet);
            if (pl != null)
                order.PriceList = pl;
            order.Save();
            return order.Id;
            //}
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
    query.Text = "SELECT Id, SKU, Feature, Qty, Discount, Total, Units, Qty*Total AS Amount FROM Document_Order_SKUs WHERE Ref = @Ref";
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
    //Dialog.Debug(priceList.EmptyRef());
    if (priceList.EmptyRef())
        return Translate["#noPriceLists#"];
    else
        return (Translate["#priceList#"] + ": " + priceList.Description);
}

function ShowDialog(v1) {
    //var v = String((v1));
    Dialog.Debug(v1);
}

function GetFeatureDescr(feature) {
    if (feature.Code == "000000001")
        return "";
    else
        return (", " + feature.Description);
}

function SelectPriceList(order, priceLists) {
    if (parseInt(priceLists) != parseInt(1) && order.Status.Description == "New" && parseInt(priceLists) != parseInt(0)) {
        var query = new Query("SELECT DISTINCT D.Id, D.Description FROM Catalog_Outlet_Prices O JOIN Document_PriceList D WHERE O.Ref = @Ref ORDER BY O.LineNumber");
        query.AddParameter("Ref", order.Outlet);
        var pl = query.ExecuteCount();
        if (parseInt(pl) == parseInt(0)) {
            var query = new Query("SELECT Id FROM Document_PriceList WHERE DefaultPriceList = @true");
            query.AddParameter("true", true);
        }
        var table = query.Execute();
        Global.ValueListSelect2(order, "PriceList", table, Variables["priceListTextView"]);
    }

}

function CheckIfEmptyAndForward(order) {
    var query = new Query("SELECT Id FROM Document_Order_SKUs WHERE Ref=@ref");
    query.AddParameter("ref", order);
    if (parseInt(query.ExecuteCount()) == parseInt(0)) {
        DB.Delete(order);
    }
    Workflow.Action("Forward", []);

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
    Variables["deliveryDate"].Text = dateTime; //refactoring is needed
}