var swipedRow;
var alreadyAdded;
var forwardText;
var c_orderItem;
var c_itemsHistory;

function OnLoading(){
    alreadyAdded = $.Exists("AlreadyAdded");
    forwardText = alreadyAdded ? Translate["#editSKU#"] : Translate["#add#"];
    //#orderHistory#
    if ($.workflow.currentDoc=='Order')
        c_itemsHistory = Translate["#orderHistory#"];
    else
        c_itemsHistory = Translate["#returnHistory#"];
}

function GetCurrentItem(){
    return OrderItem.GetItem();
}


function DiscountOutput(discount){
    if (String.IsNullOrEmpty(discount))
        return '0';
    else
        return discount.ToString();
}

function GetCurrentDoc(){
    var d;
    if ($.workflow.currentDoc=='Order')
        d =  $.workflow.order;
    else
        d =  $.workflow.Return;
    return d;
}

// function GetMultiplier(sku, orderitem) {

//     if (orderitem != null) {
//         // var item = DB.Current.Catalog.SKU_Packing.SelectBy("Pack",
//         // orderitem.Units).Where("Ref==@p1", [sku]).First();
//         var q = new Query(
//                 "SELECT Multiplier FROM Catalog_SKU_Packing WHERE Pack=@pack and Ref=@ref");
//         q.AddParameter("pack", orderitem.Units);
//         q.AddParameter("ref", sku);
//         return q.ExecuteScalar();
//     }
//     return parseInt(1);
// }

function WriteSwipedRow(control){
    if(swipedRow != control)
        HideSwiped();
    swipedRow = control;
}

function OnScroll(sender)
{
    if($.grScrollView.ScrollIndex > 0 && swipedRow != $.grScrollView.Controls[$.grScrollView.ScrollIndex])
        HideSwiped();
}

function HideSwiped()
{
    if(swipedRow != null)
        swipedRow.Index = 1;
}

function GetFeatures(sku, stock) {
    var query = new Query(
            "SELECT DISTINCT Feature FROM Catalog_SKU_Stocks WHERE Ref=@Ref AND CASE WHEN @Stock = @EmptyStock THEN 1 ELSE Stock = @Stock END AND CASE WHEN @NoStkEnbl = 1 THEN 1 ELSE StockValue > 0 END ORDER BY LineNumber");
    query.AddParameter("Ref", sku);
    query.AddParameter("NoStkEnbl", $.sessionConst.NoStkEnbl);
    query.AddParameter("EmptyStock", DB.EmptyRef("Catalog_Stock"));
    query.AddParameter("Stock", stock);
    return query.Execute();
}



function SnapshotExists(sku, filename, filesTableName) {
	return Images.SnapshotExists(sku, ToString(filename), filesTableName);
}

function GetDiscountDescription(orderitem) {
    if (parseInt(orderitem.Discount) == parseInt(0)
            || parseInt(orderitem.Discount) < parseInt(0))
        return Translate["#discount#"];
    else
        return Translate["#markUp#"];
}

function ApplyDiscount(sender, orderitem) {
    if (TrimAll(sender.Text) == '.' || TrimAll(sender.Text) == ',')
    {
        sender.Text = '0,';
    }
    else
    {
        if (IsNullOrEmpty(sender.Text))
        {
            sender.Text = parseFloat(0);
        }            
        else if ($.discountDescr.Text == Translate["#discount#"] && parseFloat(sender.Text) > parseFloat(0))
        {
            sender.Text = -1 * sender.Text;
        }

            var d = new Dictionary();
            d.Add("Discount", parseFloat(sender.Text));
            OrderItem.SetItemValue(d);

            orderitem = OrderItem.GetItem();

            $.orderItemTotalId.Text = orderitem.Total;
    }
}

function ChandeDiscount(orderitem) {

    var d = new Dictionary();
    d.Add("Discount", (-1 * orderitem.Discount));
    OrderItem.SetItemValue(d);

    orderitem = OrderItem.GetItem();

    $.discountDescr.Text = GetDiscountDescription(orderitem);
    $.orderItemTotalId.Text = orderitem.Total;
    $.discountEdit.Text = orderitem.Discount;

    FocusOnEditText('discountEdit', '1');
}

function GetFeatureDescr(feature) {
    if (feature.Code == "000000001" || $.sessionConst.SKUFeaturesRegistration==false)
        return "";
    else
        return (", " + feature.Description);
}

// function RefreshEditSKU(orderItem, sku, price, discountEdit, showimage) {
//     HideSwiped();
//     var d = $.discountEdit.Text;
//     var arr = [ sku, price, orderItem, d, showimage ];// , discountText];
//     Workflow.Refresh(arr);
// }

function GetImagePath(objectID, pictID, pictExt) {
  return Images.FindImage(objectID, ToString(pictID), pictExt, "Catalog_SKU_Files");
}

// function ImageActions(imageControl, sku) {
// 	Images.AddSnapshot(sku, sku, GalleryCallBack, sku.Description, imageControl.Source, false);
// }

// function GalleryCallBack(state, args) {
// 	if (args.Result){
// 		var sku = state[0];
// 		var fileName = state[1];

// 		sku = sku.GetObject();
// 		sku.DefaultPicture = fileName;
// 		sku.Save();

// 		Workflow.Refresh([sku.Id, $.price, $.orderitem, $.param4, $.showimage, $.param6, $param7]);
// 	}
// }

// function CountPrice(orderitem) {

//     orderitem = orderitem.GetObject();

//     var discount = $.discountEdit.Text;
//     if (String.IsNullOrEmpty(discount))
//         discount = parseInt(0);
//     p = CalculatePrice(orderitem.Price, discount, 1);
//     // orderitem.Discount = Converter.ToDecimal(discount);
//     orderitem.Total = p;
//     orderitem.Save();

//     $.orderItemTotalId.Text = p;

//     return orderitem;
// }

// function CalculatePrice(price, discount, multiplier) {

//     var total = (price * (discount / 100 + 1)) * (parseFloat(multiplier)==parseFloat(0) ? 1 : multiplier);
//     return FormatValue(total);

// }

// function ChangeFeatureAndRefresh(orderItem, feature, sku, price, discountEdit,
//         showimage) {

//     if (orderItem.Feature != feature.Feature) {
//         var itemObj = orderItem.GetObject();
//         itemObj.Feature = feature;
//         itemObj.Save()
//         RefreshEditSKU(orderItem, sku, price, discountEdit, showimage);
//     }
// }

function ChangeUnit(sku, orderitem) {

    HideSwiped();

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

    var args = new Dictionary();
    args.Add("Units", selectedUnit.Pack);
    args.Add("Multiplier", selectedUnit.Multiplier);

    OrderItem.SetItemValue(args);
    orderitem = OrderItem.GetItem();

    $.itemUnits.Text = orderitem.Units.Description;    
    $.orderItemTotalId.Text = orderitem.Total;

}

function GetItemHistory(sku, order) {
    var q = new Query("SELECT D.Date AS Date, S.Qty*P.Multiplier AS Qty, " +
        "S.Total/P.Multiplier AS Total, S.Discount, S.Price " +
        "FROM Document_" + $.workflow.currentDoc + "_SKUs S " +
        "JOIN Document_" + $.workflow.currentDoc + " D ON S.Ref=D.Id " +
        "JOIN Catalog_SKU_Packing P ON S.SKU=P.Ref AND P.Pack=S.Units " +
        "WHERE D.Outlet=@outlet AND S.SKU=@sku AND S.Ref<>@ref " +
        "ORDER BY D.Date DESC LIMIT 4");
    q.AddParameter("outlet", order.Outlet);
    q.AddParameter("sku", sku);
    q.AddParameter("ref", order);

    $.Add("historyCount", q.ExecuteCount());

    return q.Execute();
}

// function CalculateSKUAndForward(outlet, orderitem) {

//     if (Converter.ToDecimal(orderitem.Qty) == Converter.ToDecimal(0)) {
//         DB.Delete(orderitem);
//     } else {
//         Global.FindTwinAndUnite(orderitem.GetObject());
//     }

//     if ($.Exists("itemFields"))
//     	$.Remove("itemFields");
//     if ($.Exists("AlreadyAdded"))
//     	$.Remove("AlreadyAdded");

//     if (alreadyAdded)
//         DoAction('Show' + $.workflow.currentDoc);
//     else
//         DoForward();
// }

// function DeleteAndBack(orderitem) {
//     if (Variables.Exists("AlreadyAdded") == false) {
//         DB.Delete(orderitem);
//     } else{
//         orderitem = orderitem.GetObject();
//         orderitem.Qty = $.itemFields.Qty;
//         orderitem.Price = $.itemFields.Price;
//         orderitem.Discount = $.itemFields.Discount;
//         orderitem.Total = $.itemFields.Total;
//         orderitem.Units = $.itemFields.Units;
//         orderitem.Feature = $.itemFields.Feature;
//         orderitem.Save();
//         $.Remove("AlreadyAdded");
//     }
//     if ($.Exists("itemFields"))
//     	$.Remove("itemFields");
//     Workflow.Back();
// }

// function RepeatOrder(orderitem, qty, discount, baseUnit, baseUnitDescr){
//     orderitem = orderitem.LoadObject();

//     orderitem.Qty = qty;
//     $.orderItemQty.Text = qty;

//     orderitem.Discount = discount;
//     $.discountEdit.Text = discount;

//     orderitem.Total = CalculatePrice(orderitem.Price, discount, 1);
//     $.orderItemTotalId.Text = orderitem.Total;

//     orderitem.Units = baseUnit;
//     $.itemUnits.Text = baseUnitDescr;

//     orderitem.Save();
// }

// function FormatDate(datetime) {
//     return Format("{0:d}", Date(datetime));
// }
