var addDay;
//var searchParam;
// ------------------------ UI calls ------------------------

function OnLoading(){
	if (addDay == null) {
		addDay = 0;
	}
	SetListType();
}
function OnLoad(){
	var existorno = new Query("Select type From sqlite_master where name = 'UT_answerQuest' And type = 'table'");
	var exorno = existorno.ExecuteCount();
	if (exorno > 0) {
		DB.TruncateTable("answerQuest");
	}
//	if ($.param1!=null) {
//		searchParam = $.param1;
//	}
	$.DateText.Text = filterDate(DateTime.Now.Date.AddDays(addDay));
	//Dialog.Message(filterDate(DateTime.Now.Date.AddDays(addDay)));
}
function CheckDateAdd(){
	if (addDay<=0) {
		return true;
	}else {
		return false;
	}
}
function GoForwardDate(){
	addDay = addDay+1;
	$.DateText.Text = filterDate(DateTime.Now.Date.AddDays(addDay));
	RefreshScrolView();
}
function RefreshScrolView(){
	$.edtSearch.Text="";
	for (control in $.grScrollView.Controls) {
		control.remove();
	}
	var uncommitedVisits = GetUncommitedScheduledVisits(null);
	var sv = GetUncommitedScheduledVisitsCount(null);
	var commitedVisits = GetCommitedVisits(null);
	var cv = GetCommitedScheduledVisitsCount(null);
	$.plannedText.Text = Translate["#planVisit#"] + " (" + sv.ToString() + ")";
	var toappend = "<c:HorizontalLayout CssClass=\"caption_grid\">"
	+ "<c:TextView Text=\"#incompletedVisits# ({"+ sv.ToString() +"}):\"></c:TextView>"
	+ "</c:HorizontalLayout>"
	+ "<c:HorizontalLine />";
	while (uncommitedVisits.Next()) {
		var outletPlan = uncommitedVisits.Outlet;
		toappend = toappend + "<c:DockLayout CssClass=\"grid\" OnClickAction=\"$AddGlobalAndAction('"+uncommitedVisits.Ref+"', '@ref[Catalog_Outlet]:"+outletPlan.Id+"', 'Select')\">";
		if (uncommitedVisits.OutletStatus == 0) {
			toappend = toappend + "<c:Image CssClass=\"blue_mark\" />";
		}
		if (uncommitedVisits.OutletStatus == 1) {
			toappend = toappend + "<c:Image CssClass=\"yellow_mark\" />";
		}
		if (uncommitedVisits.OutletStatus == 2) {
			toappend = toappend + "<c:Image CssClass=\"y_blue_mark\" />";
		}
		if (uncommitedVisits.OutletStatus == 3) {
			toappend = toappend + "<c:VerticalLayout CssClass=\"no_mark\"></c:VerticalLayout>";
		}


		if (IsNullOrEmpty(uncommitedVisits.Distributor)){
			var distr = "";
		}else{
			var distr = StrReplace(uncommitedVisits.Distributor, '"', '\"');
		 	distr = StrReplace(distr, "'", '\"');
			distr = StrReplace(distr, "&", "&amp;");
			distr = StrReplace(distr, "<", "&lt;");
			distr = StrReplace(distr, ">", "&gt;");
		}

		var desc = StrReplace(uncommitedVisits.Outlet.Description, '"', '\"');
	 	desc = StrReplace(desc, "'", '\"');
		desc = StrReplace(desc, "&", "&amp;");
		desc = StrReplace(desc, "<", "&lt;");
		desc = StrReplace(desc, ">", "&gt;");

		var adress = StrReplace(uncommitedVisits.Outlet.Address, '"', '\"');
		adress = StrReplace(adress, "'", '\"');
		adress = StrReplace(adress, "&", "&amp;");
		adress = StrReplace(adress, "<", "&lt;");
		adress = StrReplace(adress, ">", "&gt;");


		toappend = toappend + "<c:Image />";
		toappend = toappend + "<c:VerticalLayout>"
		+ "<c:TextView Text=\'{"+distr+"}\' CssClass=\"distributor\"></c:TextView>"
		+ "<c:TextView Text=\'{"+desc+"}\' CssClass=\"main_row\"></c:TextView>"
		+ "<c:HorizontalLayout>";
		if (uncommitedVisits.Time != '') {
			toappend = toappend + "<c:TextView Text=\""+uncommitedVisits.Time+"\" CssClass=\"bl_description_row\" />";
		}
		toappend = toappend + "<c:TextView Text=\'{"+adress+"}\' CssClass=\"description_row\"></c:TextView>"
		+ "</c:HorizontalLayout></c:VerticalLayout></c:DockLayout><c:HorizontalLine />";
	}
	if (addDay <= 0) {
		toappend = toappend +"<c:HorizontalLayout CssClass=\"end_of_block\" />"
		+ "<c:HorizontalLayout CssClass=\"caption_grid\">"
		+ "<c:TextView Text=\"#completedVisits# ("+cv.ToString()+"):\"></c:TextView>"
		+	"</c:HorizontalLayout>"
		+ "<c:HorizontalLine />";
	while (commitedVisits.Next()) {
		toappend = toappend + "<c:DockLayout CssClass=\"grid\">";
		if (commitedVisits.OutletStatus == 0) {
			toappend = toappend + "<c:Image CssClass=\"blue_mark\" />";
		}
		if (commitedVisits.OutletStatus == 1) {
			toappend = toappend + "<c:Image CssClass=\"yellow_mark\" />";
		}
		if (commitedVisits.OutletStatus == 2) {
			toappend = toappend + "<c:Image CssClass=\"y_blue_mark\" />";
		}
		if (commitedVisits.OutletStatus == 3) {
			toappend = toappend + "<c:VerticalLayout CssClass=\"no_mark\"></c:VerticalLayout>";
		}

		if (IsNullOrEmpty(commitedVisits.Distributor)){
			var distr = "";
		}else{
			var distr = StrReplace(commitedVisits.Distributor, '"', '\"');
		 	distr = StrReplace(distr, "'", '\"');
			distr = StrReplace(distr, "&", "&amp;");
			distr = StrReplace(distr, "<", "&lt;");
			distr = StrReplace(distr, ">", "&gt;");
		}

		var desc = StrReplace(commitedVisits.Description, '"', '\"');
		desc = StrReplace(desc, "'", '\"');
		desc = StrReplace(desc, "&", "&amp;");
		desc = StrReplace(desc, "<", "&lt;");
		desc = StrReplace(desc, ">", "&gt;");

		var adress = StrReplace(commitedVisits.Address, '"', '\"');
		adress = StrReplace(adress, "'", '\"');
		adress = StrReplace(adress, "&", "&amp;");
		adress = StrReplace(adress, "<", "&lt;");
		adress = StrReplace(adress, ">", "&gt;");

		// toappend = toappend + "<c:Image />";
		toappend = toappend + "<c:VerticalLayout>"
		+ "<c:TextView Text=\'{"+distr+"}\' CssClass=\"distributor\"></c:TextView>"
		+ "<c:TextView Text=\'{"+desc+"}\' CssClass=\"main_row\"></c:TextView>"
		+ "<c:HorizontalLayout>";
		toappend = toappend + "<c:TextView Text=\'{"+adress+"}\' CssClass=\"description_row\"></c:TextView>"
		+ "</c:HorizontalLayout></c:VerticalLayout></c:DockLayout><c:HorizontalLine />";

		}
	}
	$.grScrollView.append(toappend);
	$.grScrollView.refresh();
	$.grScrollView.ScrollIndex = 0;
}
function GoBackDate(){
	addDay = addDay-1;
	$.DateText.Text = filterDate(DateTime.Now.Date.AddDays(addDay));
	RefreshScrolView();
}
function SetToday(){
	$.DateText.Text = filterDate(DateTime.Now.Date);
	addDay = 0;
	//Dialog.Message(addDay);
	RefreshScrolView();
}
function SetDateFiltr(){
	var header = Translate["#enterDateTime#"];
		Dialog.Date(header, SetDateNow);
}
function SetDateNow(state, args) {
	var DiffResult = args.Result.Subtract(DateTime.Now.Date).TotalDays;
	$.DateText.Text = filterDate(args.Result);
	addDay = RoundToIntFloor(DiffResult);
	RefreshScrolView();
}
function filterDate(dt){
	if (dt != null){
		return String.Format("{0:dd MMMM}", DateTime.Parse(dt));
	} else {
		return "";
	}
}
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

	var search = "";
	var q = new Query();
	if (String.IsNullOrEmpty(searchText)==false) {
		searchText = StrReplace(searchText, "'", "''");
		search = "AND Contains(O.Description, '" + searchText + "') Or Contains(O.Address, '" + searchText + "') Or Contains(D.Description, '" + searchText + "')";
	}
	q.Text = ("SELECT DISTINCT VP.Outlet, VP.Ref, D.Description AS Distributor," +
			" CASE WHEN strftime('%H:%M', VP.Date)='00:00' THEN '' ELSE strftime('%H:%M', VP.Date) END AS Time, " +
			OutletStatusText() +
			" FROM Catalog_Outlet O " +
			" LEFT JOIN Catalog_Distributor D ON O.Distributor = D.Id " +
			" JOIN Document_VisitPlan_Outlets VP ON O.Id = VP.Outlet AND DATE(VP.Date)=DATE(@date) " +
			" JOIN Document_VisitPlan DV ON DV.Id=VP.Ref " +
			" LEFT JOIN Document_Visit V ON VP.Outlet=V.Outlet " +
				" AND V.Date >= @today AND V.Date < @tomorrow " +
				" AND V.Plan<>@emptyRef " +
			" LEFT JOIN Catalog_OutletsStatusesSettings OSS ON O.OutletStatus = OSS.Status AND OSS.DoVisitInMA=1 " +
			" WHERE V.Id IS NULL AND NOT OSS.Status IS NULL " + search + " ORDER BY VP.Date, D.Description, O.Description LIMIT 100");
			if (addDay == null || addDay == 0) {
				addDay = 0;
				q.AddParameter("date", DateTime.Now.Date);
				q.AddParameter("today", DateTime.Now.Date);
				q.AddParameter("tomorrow", DateTime.Now.Date.AddDays(1));
			}else {
				q.AddParameter("date", DateTime.Now.Date.AddDays(addDay));
				q.AddParameter("today", DateTime.Now.Date.AddDays(addDay));
				q.AddParameter("tomorrow", DateTime.Now.Date.AddDays(addDay+1));
			}
	q.AddParameter("emptyRef", DB.EmptyRef("Document_VisitPlan"));
	// Dialog.Debug(1);
	return q.Execute();

}

function GetUncommitedScheduledVisitsCount(searchText) {

	var search = "";
	var q = new Query();
	if (String.IsNullOrEmpty(searchText)==false) {
		searchText = StrReplace(searchText, "'", "''");
		search = "AND Contains(O.Description, '" + searchText + "') Or Contains(O.Address, '" + searchText + "') Or Contains(D.Description, '" + searchText + "') ";
	}
	q.Text = ("SELECT DISTINCT VP.Outlet " +
			" FROM Catalog_Outlet O " +
			" LEFT JOIN Catalog_Distributor D ON O.Distributor = D.Id " +
			" JOIN Document_VisitPlan_Outlets VP ON O.Id = VP.Outlet AND DATE(VP.Date)=DATE(@date) " +
			" JOIN Document_VisitPlan DV ON VP.Ref = DV.Id " +
			" LEFT JOIN Document_Visit V ON VP.Outlet=V.Outlet AND DATE(V.Date) >= DATE(@today) AND DATE(V.Date) < DATE(@tomorrow) AND V.Plan<>@emptyRef LEFT JOIN Catalog_OutletsStatusesSettings OSS ON O.OutletStatus = OSS.Status AND OSS.DoVisitInMA=1 " +
			" WHERE V.Id IS NULL AND NOT OSS.Status IS NULL " + search + "");
			if (addDay == null || addDay == 0) {
				addDay = 0;
				q.AddParameter("date", DateTime.Now.Date);
				q.AddParameter("today", DateTime.Now.Date);
				q.AddParameter("tomorrow", DateTime.Now.Date.AddDays(1));
			}else {
				q.AddParameter("date", DateTime.Now.Date.AddDays(addDay));
				q.AddParameter("today", DateTime.Now.Date.AddDays(addDay));
				q.AddParameter("tomorrow", DateTime.Now.Date.AddDays(addDay+1));
			}
	q.AddParameter("emptyRef", DB.EmptyRef("Document_VisitPlan"));
	// Dialog.Debug(2);
	return q.ExecuteCount();

}

function GetScheduledVisitsCount() {
	var q = new Query("SELECT VPO.Id FROM Document_VisitPlan_Outlets VPO JOIN Document_VisitPlan DV ON VPO.Ref = DV.Id LEFT JOIN Catalog_Outlet O ON VPO.Outlet = O.Id LEFT JOIN Catalog_OutletsStatusesSettings OSS ON O.OutletStatus = OSS.Status AND OSS.DoVisitInMA = 1 WHERE DATE(VPO.Date) >= DATE(@today) AND DATE(VPO.Date) < DATE(@tomorrow) AND NOT OSS.Status IS NULL");
	if (addDay == null || addDay == 0) {
		addDay = 0;
		q.AddParameter("today", DateTime.Now.Date);
		q.AddParameter("tomorrow", DateTime.Now.Date.AddDays(1));
	}else {
		q.AddParameter("today", DateTime.Now.Date.AddDays(addDay));
		q.AddParameter("tomorrow", DateTime.Now.Date.AddDays(addDay+1));
	}
	var cnt = q.ExecuteCount();
	// Dialog.Debug(3);
	if (cnt == null)
		return 0;
	else
		return cnt;
}

function GetCommitedVisits(searchText) {

	//на самом деле функция возвращает все визиты подряд, но мне кажется что это ненадолго, поэтому в комментарии - еще вариант запроса, отражающий изначальный смысл

	var search = "";
	if (String.IsNullOrEmpty(searchText)==false) {
		searchText = StrReplace(searchText, "'", "''");
		search = "AND Contains(O.Description, '" + searchText + "') Or Contains(O.Address, '" + searchText + "') Or Contains(D.Description, '" + searchText + "') ";
	}

//	var q = new Query("SELECT DISTINCT VP.Outlet FROM Document_Visit V JOIN Document_VisitPlan_Outlets VP ON VP.Outlet=V.Outlet JOIN Catalog_Outlet O ON O.Id = VP.Outlet WHERE V.Date >= @today AND V.Date < @tomorrow AND VP.Date >= @today AND VP.Date < @tomorrow " + search + " ORDER BY O.Description LIMIT 100");
	var q = new Query("SELECT V.Outlet, O.Description, O.Address, D.Description AS Distributor, " + OutletStatusText() +
		"FROM Catalog_Outlet O " +
		"LEFT JOIN Catalog_Distributor D ON O.Distributor = D.Id " +
		"JOIN Document_Visit V ON V.Outlet=O.Id AND V.Date >= @today AND V.Date < @tomorrow");
		if (addDay == null || addDay == 0) {
			addDay = 0;
			q.AddParameter("today", DateTime.Now.Date);
			q.AddParameter("tomorrow", DateTime.Now.Date.AddDays(1));
		}else {
			q.AddParameter("today", DateTime.Now.Date.AddDays(addDay));
			q.AddParameter("tomorrow", DateTime.Now.Date.AddDays(addDay+1));
		}
		// Dialog.Debug(4);
	return q.Execute();

}

function GetCommitedScheduledVisitsCount(searchText) {
	//на самом деле функция возвращает все визиты подряд, но мне кажется что это ненадолго, поэтому в комментарии - еще вариант запроса, отражающий изначальный смысл

	var search = "";
	if (String.IsNullOrEmpty(searchText)==false) {
		searchText = StrReplace(searchText, "'", "''");
		search = "AND Contains(O.Description, '" + searchText + "') Or Contains(O.Address, '" + searchText + "') Or Contains(D.Description, '" + searchText + "') ";
	}

//	var q = new Query("SELECT DISTINCT VP.Outlet FROM Document_Visit V JOIN Document_VisitPlan_Outlets VP ON VP.Outlet=V.Outlet JOIN Catalog_Outlet O ON O.Id = VP.Outlet WHERE V.Date >= @today AND V.Date < @tomorrow AND VP.Date >= @today AND VP.Date < @tomorrow " + search + " ORDER BY O.Description LIMIT 100");
	var q = new Query("SELECT COUNT(V.Outlet) " +
		"FROM Catalog_Outlet O LEFT JOIN Catalog_Distributor D ON O.Distributor = D.Id JOIN Document_Visit V ON V.Outlet=O.Id AND V.Date >= @today AND V.Date < @tomorrow");
		if (addDay == null || addDay == 0) {
			addDay = 0;
			q.AddParameter("today", DateTime.Now.Date);
			q.AddParameter("tomorrow", DateTime.Now.Date.AddDays(1));
		}else {
			q.AddParameter("today", DateTime.Now.Date.AddDays(addDay));
			q.AddParameter("tomorrow", DateTime.Now.Date.AddDays(addDay+1));
		}
		// Dialog.Debug(5);
	return q.ExecuteScalar();
}

function GetOutlets(searchText) {

	var search = "";
	var q = new Query();
	var showOutlet = "";
	var doVisit = "";

	if (String.IsNullOrEmpty(searchText)==false) {
		searchText = StrReplace(searchText, "'", "''");
		search = "WHERE Contains(O.Description, '" + searchText + "') Or Contains(O.Address, '" + searchText + "') Or Contains(D.Description, '" + searchText + "')";
	}

	q.Text = "SELECT O.Id AS Outlet, O.Description, O.Address, D.Description AS Distributor," + OutletStatusText() +
			"FROM Catalog_Outlet O " +
			"LEFT JOIN Catalog_Distributor D ON O.Distributor = D.Id " +
			"JOIN Catalog_OutletsStatusesSettings OS ON OS.Status=O.OutletStatus AND OS.DoVisitInMA=1 AND OS.ShowOutletInMA=1 " +
			search + " ORDER BY D.Description, O.Description LIMIT 500";
// Dialog.Debug(6);
	return q.Execute();

}

function CountOutlets() {
	var q = new Query("SELECT COUNT(O.Id) FROM Catalog_Outlet O LEFT JOIN Catalog_Distributor D ON O.Distributor = D.Id LEFT JOIN Catalog_OutletsStatusesSettings OSS ON O.OutletStatus = OSS.Status AND OSS.DoVisitInMA = 1 WHERE NOT OSS.Status IS NULL ORDER BY O.Description LIMIT 100");
	var cnt = q.ExecuteScalar();
	// Dialog.Debug(7);
	if (cnt == null)
		return 0;
	else
		return cnt;
}

function AddGlobalAndAction(planVisit, outlet, actionName) {
	// Dialog.Debug(8);
	$.AddGlobal("planVisit", planVisit);
	if (addDay!=null) {
		var q = new Query("Select Id From Catalog_Outlet Where Id = @id");
		q.AddParameter("id",outlet);
		outlet = q.ExecuteScalar();
	}
	GlobalWorkflow.SetOutlet(outlet);
	var outletObj = outlet.GetObject();
	if (addDay == 0 || addDay == null || $.visitsType!='planned') {
		GlobalWorkflow.SetDateAddNumber(0);
		GlobalWorkflow.SetDateAdd(false);
	}else {
		GlobalWorkflow.SetDateAddNumber(addDay);
		GlobalWorkflow.SetDateAdd(true);
	}
	//Dialog.Message(outlet);
	//Dialog.Message(planVisit);
	//Dialog.Message(actionName);
	//$.workflow.outlet = outlet;
	Workflow.Action(actionName, []);
}



//-------------------------------------Internal functions--------------------------------


function OutletStatusText(){
	var os = "";

	if ($.sessionConst.encashEnabled){
		os = "(SELECT CASE WHEN COUNT(DISTINCT D.Overdue) = 2 THEN 2	WHEN COUNT(DISTINCT D.Overdue) = 0 THEN 3 " +
			"ELSE MAX(D.Overdue) END AS st " +
			"FROM Document_AccountReceivable_ReceivableDocuments D JOIN Document_AccountReceivable A ON D.Ref=A.Id " +
			"WHERE A.Outlet=O.Id) AS OutletStatus ";
	}
	else
		os = " 3 AS OutletStatus ";

	return os;
}
