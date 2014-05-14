

function GetSKUAndGroups(searchText, priceList) {
    if (String.IsNullOrEmpty(searchText)) {
        var query = new Query();
        query.Text = "SELECT S.Id, S.Description, PL.Price, S.CommonStock, G.Description AS GroupDescription, CB.Description AS Brand FROM Catalog_SKU S JOIN Catalog_SKUGroup G ON G.Id = S.Owner JOIN Document_PriceList_Prices PL ON PL.SKU = S.Id JOIN Catalog_Brands CB ON CB.Id=S.Brand WHERE S.CommonStock>0 AND PL.Ref = @Ref ORDER BY G.Description, S.Description LIMIT 100";
        query.AddParameter("Ref", priceList);
        return query.Execute();
    }
    else {
        searchText = "'%" + searchText + "%'";
        var query = new Query();
        query.Text = "SELECT S.Id, S.Description, PL.Price, S.CommonStock, G.Description AS GroupDescription FROM Catalog_SKU S JOIN Catalog_SKUGroup G ON G.Id = S.Owner JOIN Document_PriceList_Prices PL ON PL.SKU = S.Id WHERE S.CommonStock>0 AND PL.Ref = @Ref AND S.Description LIKE " + searchText + " ORDER BY G.Description, S.Description LIMIT 100";
        query.AddParameter("Ref", priceList);
        return query.Execute();
    }
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

function GetParentGroups() {
    //return DB.Current.Catalog.SKUGroup.SelectBy("Parent", groups, "<>").OrderBy("Description");
    var q = new Query("SELECT Id, Description, Parent FROM Catalog_SKUGroup WHERE Parent IS NULL ORDER BY Description");   
    return q.Execute();
}

function GetChildren(parent) {
    //var c = DB.Current.Catalog.SKUGroup.SelectBy("Parent", parent.Id);
    //if (parseInt(c.Count()) == parseInt(0))
    //    return [];
    //else
    //    return c;
    var q = new Query("SELECT Id, Description FROM Catalog_SKUGroup WHERE Parent=@p1 ORDER BY Description");
    q.AddParameter("p1", parent);
    return q.Execute();
}

function GetChildDescription(d) {
    return ("      " + d.ToString());
}

function AddFilterAndRefresh(item, filterName) { //refactoring is needed after platform update

    if (Variables.Exists(filterName)) {
        var f = Variables[filterName];
        Variables.Remove(filterName);
    }
    else
        var f = [];

    var nCollection = [];
    for (var i in f) {
        nCollection.push(i);
    }

    if (IsInCollection(item, f)) {
        nCollection = DeleteFromCollection(item, nCollection);
        if (item.IsFolder) {
            var chld = GetChildren(item);
            for (var i in chld)
                nCollection = DeleteFromCollection(i, nCollection);
        }
    }
    else {
        nCollection.push(item);
        if (item.IsFolder) {
            var chld = GetChildren(item);
            for (var i in chld)
                nCollection.push(i);
        }
    }

    Variables.AddGlobal(filterName, nCollection);

    Workflow.Refresh([]);
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
    //var sku = DB.Current.Catalog.SKU.Select().Distinct("Brand");
    //return DB.Current.Catalog.Brands.SelectBy("Id", sku);
    var q = new Query("SELECT DISTINCT B.Id, B.Description FROM Catalog_Brands B JOIN Catalog_SKU S ON B.Id=S.Brand ORDER BY B.Description");
    return q.Execute();
}