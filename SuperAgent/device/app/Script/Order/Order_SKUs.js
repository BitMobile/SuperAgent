

function GetSKUAndGroups(searchText, priceList) {
    var filterString = "";
    filterString += AddFilter(filterString, "group_filter", "G.Id", " AND ");
    filterString += AddFilter(filterString, "brand_filter", "CB.Id", " AND ");

    if (String.IsNullOrEmpty(searchText)) {
        var query = new Query();
        query.Text = "SELECT S.Id, S.Description, PL.Price, S.CommonStock, G.Description AS GroupDescription, CB.Description AS Brand FROM Catalog_SKU S JOIN Catalog_SKUGroup G ON G.Id = S.Owner JOIN Document_PriceList_Prices PL ON PL.SKU = S.Id JOIN Catalog_Brands CB ON CB.Id=S.Brand WHERE S.CommonStock>0 AND PL.Ref = @Ref " + filterString + " ORDER BY G.Description, S.Description LIMIT 100"; //" + filterString + "
        query.AddParameter("Ref", priceList);
        return query.Execute();
    }
    else {
        searchText = "'%" + searchText + "%'";
        var query = new Query();
        query.Text = "SELECT S.Id, S.Description, PL.Price, S.CommonStock, G.Description AS GroupDescription, CB.Description AS Brand FROM Catalog_SKU S JOIN Catalog_SKUGroup G ON G.Id = S.Owner JOIN Document_PriceList_Prices PL ON PL.SKU = S.Id JOIN Catalog_Brands CB ON CB.Id=S.Brand WHERE S.CommonStock>0 AND PL.Ref = @Ref AND S.Description LIKE " + searchText + filterString + " ORDER BY G.Description, S.Description LIMIT 100";
        query.AddParameter("Ref", priceList);
        return query.Execute();
    }
}

function AddFilter(filterString, filterName, condition, connector) {
    if (Variables.Exists(filterName)) {
    	if (parseInt(Variables[filterName].Count()) != parseInt(0)){
    		var gr = Variables[filterName];
            filterString = connector + condition + " IN (";
            for (var i = 0; i < gr.Count() ; i++) {
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

//--------------------------Filters------------------

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

function GetGroups() {
	var filterString = " ";
    filterString += AddFilter(filterString, "brand_filter", "S.Brand", " WHERE ");
    var q = new Query("SELECT DISTINCT G.Id AS ChildId, G.Description AS Child, GP.Id AS ParentId, GP.Description AS Parent FROM Catalog_SKU S LEFT JOIN Catalog_SKUGroup G ON S.Owner=G.Id LEFT JOIN Catalog_SKUGroup GP ON G.Parent=GP.Id " + filterString + " ORDER BY Parent, Child");
    return q.Execute();
}

function AssignHierarchy(rcs) {
	if (rcs.ParentId == null){
		$.Add("parentId", rcs.ChildId);
		$.Add("parent", rcs.Child);
		$.Add("childExists", false);
	}
	else{
		$.Add("parentId", rcs.ParentId);
		$.Add("parent", rcs.Parent);
		$.Add("childExists", true);
	}
	return "dummy"
}

function AddFilterAndRefresh(item, filterName) { //refactoring is needed after platform update

    if (Variables.Exists(filterName)) {
        var f = Variables[filterName];
        Variables.Remove(filterName);
    }
    else
        var f = [];
    
    //one more bad design
    var nCollection = [];
    for (var i in f) {
        nCollection.push(i);
    }

    if (IsInCollection(item, f)) {
        nCollection = DeleteFromCollection(item, nCollection);
        if (item.IsFolder) {
            var chld = GetChildren(item);                       
            
            while (chld.Next()){
            	nCollection = DeleteFromCollection(chld.Id, nCollection);
            }
            
/*            for (var i in chld){
            	nCollection = DeleteFromCollection(i.Id, nCollection);
            }                */
        }
    }
    else {
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
    }
    else
        return false;
}

function GetBrands() {
	var filterString = " ";
    filterString += AddFilter(filterString, "group_filter", "S.Owner", " WHERE ");
    var q = new Query("SELECT DISTINCT B.Id, B.Description FROM Catalog_SKU S JOIN Catalog_Brands B ON S.Brand=B.Id JOIN Catalog_SKUGroup G ON S.Owner=G.Id " + filterString + " ORDER BY B.Description");
    return q.Execute();
}