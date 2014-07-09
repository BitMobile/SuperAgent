// ------------------------ Main screen module ------------------------

function OnLoad() {
	if (DB.SuccessSync)
		$.syncTitle.Text = DB.LastSyncTime.ToString("dd.MM HH:mm");
	else
		$.syncTitle.Text = Translate["#error#"];

	if ($.Exists("finishedWorkflow")
			&& ($.finishedWorkflow == "Sync" || $.finishedWorkflow == "Visits"
					|| $.finishedWorkflow == "Order" || $.finishedWorkflow == "Outlets")) {
		$.swipe_layout.Index = 0;
	} else
		$.swipe_layout.Index = 1;
}

function CloseMenu() {
	var sl = Variables["swipe_layout"];
	if (sl.Index == 1) {
		sl.Index = 0;
	} else if (sl.Index == 0) {
		sl.Index = 1;
	}
}

function OpenMenu() {
	var sl = Variables["swipe_layout"];
	if (sl.Index == 1) {
		sl.Index = 0;
	} else if (sl.Index == 0) {
		sl.Index = 1;
	}
}

function MakeSnapshot() {
	GetCameraObject();
	Camera.MakeSnapshot();
}

function GetCameraObject() {
	FileSystem.CreateDirectory("/private/Document.Visit");
	Camera.Size = 300;
	Camera.Path = "/private/Document.Visit/1.jpg";
}

// --------------------------------------------------------------------------------

function GetScheduledVisits() {
	var q = new Query(
			"SELECT COUNT(*) FROM Document_VisitPlan_Outlets WHERE DATE(Date)=DATE(@date)");
	q.AddParameter("date", DateTime.Now.Date);
	var cnt = q.ExecuteScalar();
	if (cnt == null)
		return 0;
	else
		return cnt;
}

function GetOutletsCount() {
	var q = new Query("SELECT COUNT(*) FROM Catalog_Outlet");
	var cnt = q.ExecuteScalar();
	if (cnt == null)
		return 0;
	else
		return cnt;
}

function GetCommitedScheduledVisits() {
	var q = new Query(
			"SELECT DISTINCT VP.Outlet FROM Document_Visit V JOIN Document_VisitPlan_Outlets VP ON VP.Outlet=V.Outlet JOIN Catalog_Outlet O ON O.Id = VP.Outlet WHERE V.Date >= @today AND V.Date < @tomorrow AND DATE(VP.Date) >= DATE(@today) AND DATE(VP.Date) < DATE(@tomorrow) AND V.Plan <> @emptyRef ORDER BY O.Description LIMIT 100");
	q.AddParameter("today", DateTime.Now.Date);
	q.AddParameter("tomorrow", DateTime.Now.Date.AddDays(1));
	q.AddParameter("emptyRef", DB.EmptyRef("Document_VisitPlan"));
	return q.ExecuteCount();
}

function GetUnscheduledVisits() {
	var q = new Query(
			"SELECT COUNT (Id) FROM Document_Visit WHERE Plan=@emptyRef AND Date >= @today AND Date < @tomorrow");
	q.AddParameter("today", DateTime.Now.Date);
	q.AddParameter("tomorrow", DateTime.Now.Date.AddDays(1));
	q.AddParameter("emptyRef", DB.EmptyRef("Document_VisitPlan"));
	return q.ExecuteScalar();
}

function GetPlannedVisits(){
	var q = new Query("SELECT COUNT(*) FROM Document_VisitPlan_Outlets WHERE DATE(Date)=DATE(@date)");
    q.AddParameter("date", DateTime.Now.Date);
    return q.ExecuteScalar();
    //return (cnt-done);
}

function GetOrderSumm() {
	var q = new Query(
			"SELECT SUM(S.Qty * S.Total) FROM Document_Order_SKUs S LEFT JOIN Document_Order O ON (O.Id = S.Ref) WHERE O.Date >= @today AND O.Date < @tomorrow");
	q.AddParameter("today", DateTime.Now.Date);
	q.AddParameter("tomorrow", DateTime.Now.Date.AddDays(1));
	var cnt = q.ExecuteScalar();
	if (cnt == null)
		return 0;
	else
		return cnt;
}

function GetOrderQty(){
	var q = new Query("SELECT COUNT(Id) FROM Document_Order WHERE Date >= @today AND Date < @tomorrow");
	q.AddParameter("today", DateTime.Now.Date);
	q.AddParameter("tomorrow", DateTime.Now.Date.AddDays(1));
	var cnt = q.ExecuteScalar();
	if (cnt == null)
		return 0;
	else
		return cnt;
}

function GetEncashmentSumm() {
	var q = new Query(
			"SELECT SUM(EncashmentAmount) FROM Document_Encashment WHERE Date >= @today AND Date < @tomorrow");
	q.AddParameter("today", DateTime.Now.Date);
	q.AddParameter("tomorrow", DateTime.Now.Date.AddDays(1));
	var cnt = q.ExecuteScalar();
	if (cnt == null)
		return 0;
	else
		return cnt;
}

function GetReceivablesSumm() {
	var q = new Query(
			"SELECT SUM(RD.DocumentSum) FROM Document_AccountReceivable_ReceivableDocuments RD JOIN Document_AccountReceivable AR ON AR.Id = RD.Ref");
	var cnt = q.ExecuteScalar();
	if (cnt == null)
		return 0;
	else
		return cnt;
}


//---------------------------Warm ups, temporary------------------

function DoWarmUp(){
	RequestOutlets();
	RequestSKUs();
	RequestOrderList();
}

function RequestOutlets(){
	var q = new Query("SELECT P.Id, P.Description, P.DataType, DT.Description AS TypeDescription, OP.Id AS ParameterValue, OP.Value FROM Catalog_OutletParameter P JOIN Enum_DataType DT ON DT.Id=P.DataType LEFT JOIN Catalog_Outlet_Parameters OP ON OP.Parameter = P.Id");
	var r = q.Execute();
	while (r.Next()){}
}

function RequestSKUs(){
	var q = new Query;
        q.Text = "SELECT S.Id, S.Description, PL.Price, S.CommonStock, G.Description AS GroupDescription, G.Id AS GroupId, G.Parent AS GroupParent, CB.Description AS Brand FROM Catalog_SKU S JOIN Catalog_SKUGroup G ON G.Id = S.Owner JOIN Document_PriceList_Prices PL ON PL.SKU = S.Id JOIN Catalog_Brands CB ON CB.Id=S.Brand"; 
        var r = q.Execute();
    	while (r.Next()){}
}

function RequestOrderList() {

	var q = new Query("SELECT DO.Id, DO.Outlet, DO.Date AS Date, DO.Number, CO.Description AS OutletDescription, DO.Status FROM Document_Order DO JOIN Catalog_Outlet CO ON DO.Outlet=CO.Id");
	var r = q.Execute();
	while (r.Next()){}
}