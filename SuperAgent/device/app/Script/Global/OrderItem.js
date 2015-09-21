var orderItem;
var multiplier;
var basePrice;

//----------------access----------------

function InitItem(args){
	if (orderItem==null)
		CreateOrderItem(args);
}

function SetItemValue(args){ //attr - dictionary

    var orderItemObj = orderItem.GetObject();

    if (args.HasValue("Units")){
        orderItemObj.Units = args.Units;
        multiplier = parseFloat(args.Multiplier)==parseFloat(0) ? 1 : args.Multiplier;
        orderItemObj = CalculateItem(orderItemObj);
    }

    if (args.HasValue("Qty")){
        orderItemObj.Qty = args.Qty;
    }

	orderItemObj.Save();
    orderItem = orderItemObj.Id;
}

function GetItem(){
	return orderItem;
}


//-----------internal handlers------------

function CalculateItem(orderItemObj){   

    orderItemObj.Total = (orderItemObj.Price * (orderItemObj.Discount / 100 + 1)) * (parseFloat(multiplier)==parseFloat(0) ? 1 : multiplier);
	orderItemObj.Amount = orderItemObj.Total * orderItemObj.Qty;

    return orderItemObj;

}




function CreateOrderItem(args){//order, sku, orderItem, price, features, recOrder, unit) {

    // if ($.Exists("orderItemAlt")){  //Dirty hack, see Events.js line 109
    //     orderItem = c_orderItem;
    //     $.Remove("orderItemAlt");
    // }

    basePrice = args.price;

    var p = DB.Create("Document." + $.workflow.currentDoc + "_SKUs");
    p.Ref = args.order;
    p.SKU = args.sku;
    p.Feature = GetNewFeature(args.sku);    
    p.Units = GetDefaultUnit(args.sku, args.unit);
    p.Discount = 0;
    p.Qty = GetFromRecOrder(args.recOrder);
    p.Price = args.price * multiplier;
    p.Total = p.Price;
    p.Amount = 0;
    p.Save();
    
    orderItem = p.Id;

}

function GetNewFeature(sku){
	var result;
    if ($.sessionConst.SKUFeaturesRegistration){
        var query = new Query(
                "SELECT Feature FROM Catalog_SKU_Stocks WHERE Ref = @Ref ORDER BY LineNumber LIMIT 1");
        query.AddParameter("Ref", sku);
        result = query.ExecuteScalar();
    }
    else
    	result = null;

    return result;
}

function GetFromRecOrder(recOrder){
    
    if (recOrder!=null){
        if (recOrder<0)
            recOrder = 0;
    }
    else
        recOrder = 0;

    return recOrder;
}

function GetDefaultUnit(sku, unit){
    // getting a unit
    if (unit==null){
        var q = new Query("SELECT Pack, Multiplier FROM Catalog_SKU_Packing WHERE Ref=@ref AND LineNumber=1");
        q.AddParameter("ref", sku);
        var defaultUnit = q.Execute();
    }
    else{
        var q = new Query("SELECT Pack, Multiplier FROM Catalog_SKU_Packing WHERE Ref=@ref AND Pack=@pack");
        q.AddParameter("ref", sku);
        q.AddParameter("pack", unit);
        var defaultUnit = q.Execute();
    }

    multiplier = defaultUnit.Multiplier;

    return defaultUnit.Pack;
}