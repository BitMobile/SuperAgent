var scheduledVisits;
var unscheduledVisits;
var visitsTotal;
var plannedVisits;
var outletsCount;
var orderSum;
var orderQty;
var encashmentSumm;
var receivablesSumm;

function SetIndicators() {
	SetCommitedScheduledVisits();
	SetEncashmentSumm();
	SetOrderQty();
	SetOrderSumm();
	SetOutletsCount();
	SetPlannedVisits();
	SetReceivablesSumm();
	SetUnscheduledVisits();
}




function SetOutletsCount() {
	var q = new Query("SELECT COUNT(*) FROM Catalog_Outlet");
	var cnt = q.ExecuteScalar();
	if (cnt == null)
		outletsCount = 0;
	else
		outletsCount = cnt;
}

function GetOutletsCount(){
	return outletsCount;
}


function SetCommitedScheduledVisits(){
	var q = new Query("SELECT DISTINCT VP.Outlet FROM Document_Visit V " +
			" JOIN Document_VisitPlan_Outlets VP ON VP.Outlet=V.Outlet AND V.Date = VP.Date " +
			" JOIN Catalog_Outlet O ON O.Id = VP.Outlet " +
			" WHERE DATE(V.Date) >= DATE('now', 'start of a day') " +			
			" AND V.Plan <> @emptyRef " +
			" ORDER BY O.Description");
	q.AddParameter("emptyRef", DB.EmptyRef("Document_VisitPlan"));
	scheduledVisits = q.ExecuteCount();
}

function GetCommitedScheduledVisits() {
	return scheduledVisits;
}


function SetUnscheduledVisits() {
	var q = new Query("SELECT COUNT (Id) FROM Document_Visit WHERE Plan=@emptyRef AND Date >= @today AND Date < @tomorrow");
	q.AddParameter("today", DateTime.Now.Date);
	q.AddParameter("tomorrow", DateTime.Now.Date.AddDays(1));
	q.AddParameter("emptyRef", DB.EmptyRef("Document_VisitPlan"));
	unscheduledVisits = q.ExecuteScalar();
}

function GetUnscheduledVisits() {
	return unscheduledVisits;
}


function SetPlannedVisits() {
	var q = new Query("SELECT COUNT(*) FROM Document_VisitPlan_Outlets WHERE DATE(Date)=DATE(@date)");
	q.AddParameter("date", DateTime.Now.Date);
	plannedVisits = q.ExecuteScalar();
}

function GetPlannedVisits() {
	return plannedVisits;
}



//function SetVisitsLeft(){
//	planVisitsLeft = plannedVisits - scheduledVisits;
//}



function SetOrderSumm() {
	var q = new Query("SELECT SUM(S.Qty * S.Total) FROM Document_Order_SKUs S LEFT JOIN Document_Order O ON (O.Id = S.Ref) WHERE O.Date >= @today AND O.Date < @tomorrow");
	q.AddParameter("today", DateTime.Now.Date);
	q.AddParameter("tomorrow", DateTime.Now.Date.AddDays(1));
	var cnt = q.ExecuteScalar();
	if (cnt == null)
		orderSum = 0;
	else
		orderSum = cnt;
}

function GetOrderSumm() {
	return orderSum;
}



function SetOrderQty() {
	var q = new Query("SELECT COUNT(Id) FROM Document_Order WHERE Date >= @today AND Date < @tomorrow");
	q.AddParameter("today", DateTime.Now.Date);
	q.AddParameter("tomorrow", DateTime.Now.Date.AddDays(1));
	var cnt = q.ExecuteScalar();
	if (cnt == null)
		orderQty = 0;
	else
		orderQty = cnt;
}

function GetOrderQty(){
	return orderQty;
}



function SetEncashmentSumm() {
	var q = new Query("SELECT SUM(EncashmentAmount) FROM Document_Encashment WHERE Date >= @today AND Date < @tomorrow");
	q.AddParameter("today", DateTime.Now.Date);
	q.AddParameter("tomorrow", DateTime.Now.Date.AddDays(1));
	var cnt = q.ExecuteScalar();
	if (cnt == null)
		encashmentSumm = 0;
	else
		encashmentSumm = cnt;
}

function GetEncashmentSumm(){
	return encashmentSumm;
}



function SetReceivablesSumm() {
	var q = new Query("SELECT SUM(RD.DocumentSum) FROM Document_AccountReceivable_ReceivableDocuments RD JOIN Document_AccountReceivable AR ON AR.Id = RD.Ref");
	var cnt = q.ExecuteScalar();
	if (cnt == null)
		receivablesSumm = 0;
	else
		receivablesSumm = cnt;
}

function GetReceivablesSumm() {
	return receivablesSumm;
}

