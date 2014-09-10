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
			"G.Id AS GroupId, G.Parent AS GroupParent, P.Description AS ParentDescription, CB.Description AS Brand , U.Description AS Pack, O.Qty " +
			"FROM Catalog_SKU S " +
			stockString + 
			"JOIN Catalog_SKUGroup G ON G.Id = S.Owner " +			
			"JOIN Document_PriceList_Prices PL ON PL.SKU = S.Id " +
			"JOIN Catalog_Brands CB ON CB.Id=S.Brand " +			
			"JOIN Catalog_SKU_Packing SP ON SP.Ref=S.Id AND SP.LineNumber=1 " +
			"JOIN Catalog_UnitsOfMeasure U ON SP.Pack=U.Id " +
			"LEFT JOIN Catalog_SKU_Stocks BF ON BF.Ref=S.Id AND BF.LineNumber=1 " +
			"LEFT JOIN Catalog_SKUGroup P ON G.Parent=P.Id " +
			"LEFT JOIN Document_Order_SKUs O ON O.Ref = @order AND O.SKU=S.Id AND O.Feature=BF.Feature AND O.Units=SP.Pack " +
			" WHERE " + stockCondition + " PL.Ref = @Ref " + stockWhere + searchString + filterString + 
			" ORDER BY G.Description, S.Description LIMIT 100";
	query.AddParameter("Ref", priceList);	
	query.AddParameter("order", $.workflow.order);
	return query.Execute();

}

function AddToOrder(control, editFieldName, packDescr){
	Variables[editFieldName].Text = parseInt(Variables[editFieldName].Text) + parseInt(1);
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
	
	if (String.IsNullOrEmpty(parentDescription)==false)
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