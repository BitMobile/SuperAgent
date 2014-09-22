var defFeature;
var defPack;
var packDescription;
var swipedRow;

function GetSKUAndGroups(searchText, priceList, stock) {

	var filterString = "";
	filterString += AddFilter(filterString, "group_filter", "G.Id", " AND ");
	filterString += AddFilter(filterString, "brand_filter", "CB.Id", " AND ");

	var query = new Query();
	
	if (EmptyStockAllowed())
		var stockCondition = "";
	else
		var stockCondition = " S.CommonStock>0 AND ";

	var searchString = "";
	if (String.IsNullOrEmpty(searchText) == false)
		searchString = " AND Contains(S.Description, '" + searchText + "') ";

	var stockString = "";
	var stockWhere = "";
	if ($.workflow.order.Stock.EmptyRef()==false){
		stockString = "JOIN Catalog_SKU_Stocks SS ON SS.Ref=S.Id ";
		stockWhere = " AND SS.Stock=@stock ";
		query.AddParameter("stock", stock);
		var stockField = "SS.StockValue AS CommonStock, "
	}
	else
		var stockField = "S.CommonStock AS CommonStock,";
	
	query.Text = "SELECT DISTINCT S.Id, S.Description, PL.Price, " + stockField + " G.Description AS GroupDescription, " +
			"G.Id AS GroupId, G.Parent AS GroupParent, P.Description AS ParentDescription, CB.Description AS Brand " +
			"FROM Catalog_SKU S " +
			stockString + 
			"JOIN Catalog_SKUGroup G ON G.Id = S.Owner " +			
			"JOIN Document_PriceList_Prices PL ON PL.SKU = S.Id " +
			"JOIN Catalog_Brands CB ON CB.Id=S.Brand " +			
			"LEFT JOIN Catalog_SKUGroup P ON G.Parent=P.Id " +
			" WHERE " + stockCondition + " PL.Ref = @Ref " + stockWhere + searchString + filterString + 
			" ORDER BY G.Description, S.Description LIMIT 100";
	query.AddParameter("Ref", priceList);	
	return query.Execute();

}

function GetQuickOrder(control, skuId, itemPrice, index, packField, textViewField){
	if(swipedRow != control)
		HideSwiped();
	swipedRow = control;
	if(parseInt(control.Index)==parseInt(0)){
		var query = new Query();
		query.Text = "SELECT S.Id, S.Description, BF.Feature AS DefaultFeature, " +
				"SP.Pack AS DefaultUnit, IfNull(O.Qty, 0) AS Qty, U.Description AS Pack " +
				"FROM Catalog_SKU S " +
				"JOIN Catalog_SKU_Packing SP ON S.Id=SP.Ref AND SP.LineNumber=1 " +
				"JOIN Catalog_SKU_Stocks BF ON BF.Ref=S.Id AND BF.LineNumber=1 " +
				"JOIN Catalog_UnitsOfMeasure U ON SP.Pack=U.Id " +
				"LEFT JOIN Document_Order_SKUs O ON O.Ref=@order AND O.SKU = S.Id " +
					"AND O.Feature=BF.Feature AND O.Units=SP.Pack " +
				"WHERE S.Id=@sku"
		query.AddParameter("order", $.workflow.order);
		query.AddParameter("sku", skuId);
		var quickOrderItem =  query.Execute();
		
		defFeature = quickOrderItem.DefaultFeature;
		defPack = quickOrderItem.DefaultUnit;
		packDescription = quickOrderItem.Pack;
			
		Variables[packField].Text = packDescription;
		Variables[textViewField].Text = quickOrderItem.Qty + " " + packDescription + " " + Translate["#alreadyOrdered#"];
	}
}

function AddToOrder(control, editFieldName, packDescr) {
	var editText = Converter.ToDecimal(0);
	if (String.IsNullOrEmpty(Variables[editFieldName].Text) == false)
		editText = Converter.ToDecimal(Variables[editFieldName].Text);
	Variables[editFieldName].Text = editText + parseInt(1);
}

function CreateOrderItem(control, editFieldName, textFieldName, packFireld, sku, price) {

	if (String.IsNullOrEmpty(Variables[editFieldName].Text) == false) {
		if (Converter.ToDecimal(Variables[editFieldName].Text) != Converter.ToDecimal(0)) {

			var p = DB.Create("Document.Order_SKUs");
			p.Ref = $.workflow.order;
			p.SKU = sku;
			p.Feature = defFeature;
			p.Price = price;
			p.Qty = Converter.ToDecimal(Variables[editFieldName].Text);
			p.Total = p.Price;
			p.Amount = p.Total * p.Qty;
			p.Units = defPack;
			p.Discount = 0;
			p.Save();

			Global.FindTwinAndUnite(p);

			var query = new Query("SELECT Qty FROM Document_Order_SKUs WHERE Ref=@ref AND SKU=@sku AND Feature=@feature AND Units=@units");
			query.AddParameter("ref", p.Ref);
			query.AddParameter("sku", p.SKU);
			query.AddParameter("feature", p.Feature);
			query.AddParameter("units", p.Units);
			var qty = query.ExecuteScalar();

			Variables[editFieldName].Text = 0;
			Variables[textFieldName].Text = qty + " " + packDescription + " " + Translate["#alreadyOrdered#"];
		}
	}
}

function EmptyStockAllowed() {
	var q = new Query("SELECT Use FROM Catalog_MobileApplicationSettings WHERE Code='NoStkEnbl'");
	var res = q.ExecuteScalar();

	if (res == null)
		return false;
	else {
		if (parseInt(res) == parseInt(0))
			return false
		else
			return true;
	}
}

function GetGroupPath(group, parent, parentDescription) {
	var string = "";

	if (String.IsNullOrEmpty(parentDescription) == false)
		string = string + "/ " + parent.Description;
	return string;
}

function AddFilter(filterString, filterName, condition, connector) {
	if (Variables.Exists(filterName)) {
		if (parseInt(Variables[filterName].Count()) != parseInt(0)) {
			var gr = Variables[filterName];
			filterString = connector + condition + " IN (";
			for (var i = 0; i < gr.Count(); i++) {
				filterString += "'" + (gr[i]).ToString() + "'";
				if (i != (gr.Count() - 1))
					filterString += ", ";
				else
					filterString += ")";
			}
		}
	}
	return filterString;
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

// --------------------------Filters------------------

function SetFilter() {
	if (Variables.Exists("filterType") == false)
		Variables.AddGlobal("filterType", "group");
	else
		return Variables["filterType"];
}

function AskAndBack() {
	Dialog.Question(Translate["#clearFilter#"], ClearFilterHandler);
}

function ClearFilterHandler(answ, state) {
	if (answ == DialogResult.Yes) {
		Variables.Remove("group_filter");
		Variables.Remove("brand_filter");
		Workflow.Back();
	}
}

function CheckFilterAndForward() {
	CheckFilter("group_filter");
	CheckFilter("brand_filter");

	Workflow.Forward([]);
}

function CheckFilter(filterName) {
	if (Variables.Exists(filterName)) {
		var t = Variables[filterName];
		if (parseInt(t.Count()) == parseInt(0))
			Variables.Remove(filterName);
	}
}

function GetLeftFilterStyle(val) {
	if (Variables["filterType"] == val)
		return "mode_left_button_on";
	else
		return "mode_left_button_off";
}

function GetRightFilterStyle(val) {
	if (Variables["filterType"] == val)
		return "mode_right_button_on";
	else
		return "mode_right_button_off";
}

function ChangeFilterAndRefresh(type) {
	Variables.Remove("filterType");
	Variables.AddGlobal("filterType", type);
	Workflow.Refresh([]);

}

function GetGroups(priceList) {
	var filterString = " ";
	filterString += AddFilter(filterString, "brand_filter", "S.Brand", " AND ");
	var q = new Query("SELECT DISTINCT G.Id AS ChildId, G.Description AS Child, GP.Id AS ParentId, GP.Description AS Parent FROM Catalog_SKU S LEFT JOIN Catalog_SKUGroup G ON S.Owner=G.Id LEFT JOIN Catalog_SKUGroup GP ON G.Parent=GP.Id WHERE S.ID IN (SELECT DISTINCT SKU FROM Document_PriceList_Prices WHERE Ref=@priceList) " + filterString + " ORDER BY Parent, Child");
	q.AddParameter("priceList", priceList);
	return q.Execute();
}

function ShowGroup(currentGroup, parentGroup) {
	if (currentGroup != parentGroup || parentGroup == null)
		return true;
	else
		return false;
}

function AssignHierarchy(rcs) {
	if (rcs.ParentId == null) {
		$.Add("parentId", rcs.ChildId);
		$.Add("parent", rcs.Child);
		$.Add("childExists", false);
	} else {
		$.Add("parentId", rcs.ParentId);
		$.Add("parent", rcs.Parent);
		$.Add("childExists", true);
	}
	return "dummy"
}

function AddFilterAndRefresh(item, filterName) { // refactoring is needed
	// after platform update

	if (Variables.Exists(filterName)) {
		var f = Variables[filterName];
		Variables.Remove(filterName);
	} else
		var f = [];

	// one more bad design
	var nCollection = [];
	for ( var i in f) {
		nCollection.push(i);
	}

	if (IsInCollection(item, f)) {
		nCollection = DeleteFromCollection(item, nCollection);
		if (item.IsFolder) {
			var chld = GetChildren(item);

			while (chld.Next()) {
				nCollection = DeleteFromCollection(chld.Id, nCollection);
			}

			/*
			 * for (var i in chld){ nCollection = DeleteFromCollection(i.Id,
			 * nCollection); }
			 */
		}
	} else {
		nCollection.push(item);
		if (item.IsFolder) {
			var chld = GetChildren(item);
			while (chld.Next())
				nCollection.push(chld.Id);
		}
	}

	Variables.AddGlobal(filterName, nCollection);

	Workflow.Refresh([]);
}

function GetChildren(parent) {
	var q = new Query("SELECT Id, Description FROM Catalog_SKUGroup WHERE Parent=@p1 ORDER BY Description");
	q.AddParameter("p1", parent);
	return q.Execute();
}

function FilterIsSet(itemId, filterName) {
	if (Variables.Exists(filterName)) {
		var result = IsInCollection(itemId, Variables[filterName]);
		return result;
	} else
		return false;
}

function GetBrands(priceList) {
	var filterString = " ";
	filterString += AddFilter(filterString, "group_filter", "S.Owner", " AND ");
	var q = new Query("SELECT DISTINCT B.Id, B.Description FROM Catalog_SKU S JOIN Catalog_Brands B ON S.Brand=B.Id JOIN Catalog_SKUGroup G ON S.Owner=G.Id WHERE S.ID IN (SELECT DISTINCT SKU FROM Document_PriceList_Prices WHERE Ref=@priceList) " + filterString + " ORDER BY B.Description");
	q.AddParameter("priceList", priceList);
	return q.Execute();
}

function ShowDialog(control, val) {
	var d = parseInt(50);
	return d;
}