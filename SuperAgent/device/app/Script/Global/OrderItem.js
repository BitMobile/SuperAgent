var orderItem;
var multiplier;
var basePrice;

//----------------access----------------

function InitItem(args){
	if (orderItem==null)
		CreateOrderItem(args);
}

function SetItemValue(args){ //attr - dictionary
	CalculateItem(args);
}

function GetItem(){
	return orderItem;
}


//-----------internal handlers------------

function CalculateItem(args){
    Dialog.Debug(args);
	
	orderItem.Total = (orderItem.price * (orderItem.discount / 100 + 1)) * (parseFloat(multiplier)==parseFloat(0) ? 1 : multiplier);
	orderItem.Amount = orderItem.Total * orderItem.Qty;
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
    p.Amount = p.Price;
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