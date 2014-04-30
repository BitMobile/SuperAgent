// ------------------------ Visits screen module ------------------------

function SetListType() {
    if ($.Exists("visitsType") == false)
        $.AddGlobal("visitsType", "planned");
    else
        return $.visitsType;
}

function ChangeListAndRefresh(control) {
    $.Remove("visitsType");
    $.AddGlobal("visitsType", control);
    Workflow.Refresh([]);
}


function GetUncommitedScheduledVisits(searchText) {
    var q = new Query("SELECT DISTINCT Outlet FROM Document_VisitPlan_Outlets VP LEFT JOIN Document_Visit V ON VP.Outlet=V.Outlet JOIN Catalog_Outlet O ON O.Id = VP.Outelt WHERE V.Id IS NULL AND V.Date=@date ORDER BY O.Description LIMIT 100");
    q.AddParameter("date", DateTime.Now.Date);
    return q.Execute();
    
}

function GetCommitedScheduledVisits(searchText) {
    //return DB.Current.Document.Visit.SelectBy("Outlet", planOutlets).Where("Date.Date == @p1", [DateTime.Now.Date]).Top(100).OrderBy("OutletAsObject.Description");
    var q = new Query("SELECT DISTINCT Outlet FROM Document_Visit V JOIN Document_VisitPlan_Outlets VP ON VP.Outlet=V.Outlet JOIN Catalog_Outlet O ON O.Id = VP.Outelt WHERE V.Date=@date ORDER BY O.Description LIMIT 100");
    q.AddParameter("date", DateTime.Now.Date);
    return q.Execute();

}

function GetOutletsQty() {
    //return DB.Current.Catalog.Territory_Outlets.Select().Distinct("OutletAsObject").Count();
    var q = new Query("SELECT COUNT(*) FROM Catalog_Territory_Outlets");
    var cnt = q.ExecuteScalar();
    if (cnt == null)
        return 0;
    else
        return cnt;
}