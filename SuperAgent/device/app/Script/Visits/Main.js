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

function GetUncommitedScheduledVisits(searchText, getCount) {

	var search = "";
	var q = new Query();
	if (String.IsNullOrEmpty(searchText)==false)
		search = "AND O.Description LIKE '%" + searchText + "%'";
	q.Text = ("SELECT DISTINCT VP.Outlet, VP.Ref FROM Document_VisitPlan_Outlets VP JOIN Catalog_Outlet O ON O.Id = VP.Outlet LEFT JOIN Document_Visit V ON VP.Outlet=V.Outlet AND V.Date >= @today AND V.Date < @tomorrow AND V.Plan<>@emptyRef WHERE VP.Date=@date AND V.Id IS NULL " + search + " ORDER BY O.Description LIMIT 100");
	q.AddParameter("date", DateTime.Now.Date);
	q.AddParameter("today", DateTime.Now.Date);
	q.AddParameter("tomorrow", DateTime.Now.Date.AddDays(1));
	q.AddParameter("emptyRef", DB.EmptyRef("Document_VisitPlan"));
	if (getCount == "1")
		return q.ExecuteCount();
	else {
		var c = q.Execute();
		return c;

	}

}

function GetScheduledVisitsCount() {
	var q = new Query("SELECT COUNT(*) FROM Document_VisitPlan_Outlets WHERE Date=@date");
	q.AddParameter("date", DateTime.Now.Date);
	var cnt = q.ExecuteScalar();
	if (cnt == null)
		return 0;
	else
		return cnt;
}

function GetCommitedScheduledVisits(searchText, getCount) {
	
	//на самом деле функция возвращает все визиты подряд, но мне кажется что это ненадолго, поэтому в комментарии - еще вариант запроса, отражающий изначальный смысл
	
	var search = "";
	if (String.IsNullOrEmpty(searchText)==false)
		search = "AND O.Description LIKE '%" + searchText + "%'";
	
//	var q = new Query("SELECT DISTINCT VP.Outlet FROM Document_Visit V JOIN Document_VisitPlan_Outlets VP ON VP.Outlet=V.Outlet JOIN Catalog_Outlet O ON O.Id = VP.Outlet WHERE V.Date >= @today AND V.Date < @tomorrow AND VP.Date >= @today AND VP.Date < @tomorrow " + search + " ORDER BY O.Description LIMIT 100");
	var q = new Query("SELECT V.Outlet, O.Description, O.Address FROM Document_Visit V JOIN Catalog_Outlet O ON V.Outlet=O.Id WHERE V.Date >= @today AND V.Date < @tomorrow");
	q.AddParameter("today", DateTime.Now.Date);
	q.AddParameter("tomorrow", DateTime.Now.Date.AddDays(1));
	if (getCount == "1")
		return q.ExecuteCount();
	else {
		var c = q.Execute();
		return c;
	}

}


function ChangeListAndRefresh(control) {
	$.Remove("visitsType");
	$.AddGlobal("visitsType", control);
	Workflow.Refresh([]);
}


function GetOutlets(searchText, returnQty) {

	var search = "";
	if (String.IsNullOrEmpty(searchText)==false)
		search = "AND O.Description LIKE '%" + searchText + "%'";
	var q = new Query("SELECT O.Id AS Outlet, O.Description, O.Address FROM Catalog_Outlet O " + search + " ORDER BY O.Description LIMIT 500");
	if (parseInt(returnQty)==parseInt(0))
		return q.Execute();
	else{
		var c = q.ExecuteCount();
		if (c==null)
			return parseInt(0);
		else
			return c;
	}
		
}

function AddGlobalAndAction(planVisit, outlet, actionName) {
	$.AddGlobal("planVisit", planVisit);
	$.AddGlobal("outlet", outlet);
	Workflow.Action(actionName, []);
}