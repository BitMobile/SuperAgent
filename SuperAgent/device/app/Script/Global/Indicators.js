﻿var scheduledVisits;
var unscheduledVisits;
var visitsTotal;
var plannedVisits;
var outletsCount;
var orderSum;
var orderQty;
var encashmentSumm;
var receivablesSumm;
var returnSum;
var returnQty;
var tasksSum;
var tasksDone;
var AmountAlcoholDay;
var AmountNoAlcoholDay;
var AmountAlcoholMonth;
var AmountNoAlcoholMonth;

function SetIndicators() {
	SetCommitedScheduledVisits();
	// SetEncashmentSumm();
	SetOrderQty();
	SetOrderSumm();
	SetOutletsCount();
	SetPlannedVisits();
	SetReceivablesSumm();
	SetUnscheduledVisits();
	SetReturnSum();
	SetReturnQty();
	SetTasksSum();
	SetTasksDone();
	SetDayAmount();
	SetMonthAmount();
}

function SetOutletsCount() {
	var q = new Query("SELECT COUNT(*) FROM Catalog_Outlet O JOIN Catalog_OutletsStatusesSettings OSS ON O.OutletStatus=OSS.Status AND OSS.ShowOutletInMA=1");
	var cnt = q.ExecuteScalar();
	if (cnt == null)
		outletsCount = 0;
	else
		outletsCount = cnt.ToString();
}

function GetOutletsCount(){
	return outletsCount;
}


function SetCommitedScheduledVisits(){
	var q = new Query("SELECT DISTINCT VP.Outlet FROM Document_Visit V JOIN Document_VisitPlan_Outlets VP ON VP.Outlet=V.Outlet JOIN Catalog_Outlet O ON O.Id = VP.Outlet JOIN Document_VisitPlan DV ON VP.Ref = DV.Id WHERE DATE(V.Date) >= DATE(@today) AND DATE(V.Date) < DATE(@tomorrow) AND DATE(VP.Date) >= DATE(@today) AND DATE(VP.Date) < DATE(@tomorrow) AND V.Plan <> @emptyRef");
	q.AddParameter("today", DateTime.Now.Date);
	q.AddParameter("tomorrow", DateTime.Now.Date.AddDays(1));
	q.AddParameter("emptyRef", DB.EmptyRef("Document_VisitPlan"));
	scheduledVisits = q.ExecuteCount();
}

function GetCommitedScheduledVisits() {
	return scheduledVisits;
}


function SetUnscheduledVisits() {
	var q = new Query("SELECT Id FROM Document_Visit WHERE Plan=@emptyRef AND DATE(Date) >= DATE(@today) AND DATE(Date) < DATE(@tomorrow)");
	q.AddParameter("today", DateTime.Now.Date);
	q.AddParameter("tomorrow", DateTime.Now.Date.AddDays(1));
	q.AddParameter("emptyRef", DB.EmptyRef("Document_VisitPlan"));
	unscheduledVisits = q.ExecuteCount();
}

function GetUnscheduledVisits() {
	return unscheduledVisits;
}


function SetPlannedVisits() {
	var q = new Query("SELECT * FROM Document_VisitPlan_Outlets VPO JOIN Document_VisitPlan DP ON VPO.Ref = DP.Id JOIN Catalog_Outlet O ON VPO.Outlet=O.Id JOIN Catalog_OutletsStatusesSettings OSS ON O.OutletStatus=OSS.Status AND OSS.ShowOutletInMA=1 AND OSS.DoVisitInMA=1 WHERE DATE(VPO.Date)=DATE(@date) AND NOT OSS.Status IS NULL");
	q.AddParameter("date", DateTime.Now.Date);
	plannedVisits = q.ExecuteCount();
}

function GetPlannedVisits() {
	return plannedVisits;
}



//function SetVisitsLeft(){
//	planVisitsLeft = plannedVisits - scheduledVisits;
//}



function SetOrderSumm() {
	var q = new Query("SELECT SUM(S.Qty * S.Total) " +
		" FROM Document_Order_SKUs S " +
		" LEFT JOIN Document_Order O ON (O.Id = S.Ref) " +
		" WHERE date(O.Date) >= date('now','start of day', 'localtime') " +
		" AND date(O.Date) < date('now', 'start of day', '+1 day', 'localtime')");
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

function SetReturnSum(){
	var q = new Query("SELECT SUM(S.Qty * S.Total) FROM Document_Return_SKUs S LEFT JOIN Document_Return O ON (O.Id = S.Ref) WHERE O.Date >= @today AND O.Date < @tomorrow");
	q.AddParameter("today", DateTime.Now.Date);
	q.AddParameter("tomorrow", DateTime.Now.Date.AddDays(1));
	var cnt = q.ExecuteScalar();
	if (cnt == null)
		returnSum = 0;
	else
		returnSum = String.Format("{0:F2}", cnt || 0);
}

function GetReturnSum(){ return returnSum };

function SetReturnQty() {
	var q = new Query("SELECT COUNT(Id) FROM Document_Return WHERE Date >= @today AND Date < @tomorrow");
	q.AddParameter("today", DateTime.Now.Date);
	q.AddParameter("tomorrow", DateTime.Now.Date.AddDays(1));
	var cnt = q.ExecuteScalar();
	if (cnt == null)
		returnQty = 0;
	else
		returnQty = cnt;
}

function GetReturnQty(){ return returnQty; }

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
	var q = new Query("SELECT SUM(RD.DocumentSum) FROM Document_AccountReceivable_ReceivableDocuments RD JOIN Document_AccountReceivable AR ON AR.Id = RD.Ref WHERE RD.Overdue=1");
	var cnt = q.ExecuteScalar();
	if (cnt == null)
		receivablesSumm = 0;
	else
		receivablesSumm = cnt;
}

function GetReceivablesSumm() {
	return receivablesSumm;
}

function SetTasksSum(){
	var q = new Query("SELECT COUNT(Id) FROM Document_Task " +
		"WHERE (Status=0 AND DATE(StartPlanDate)<=DATE('now', 'localtime')) " +
		" OR " +
		" (Status=1 AND DATE(ExecutionDate)=DATE('now', 'localtime')) ");
	var cnt = q.ExecuteScalar();
	tasksSum = cnt == null ? 0 : cnt;
}

function GetTasksSum(){
	return tasksSum;
}

function SetTasksDone(){
	var q = new Query("SELECT COUNT(Id) FROM Document_Task " +
		" WHERE Status=1 " +
		" AND DATE(ExecutionDate)=DATE('now', 'localtime') ");
	var cnt = q.ExecuteScalar();
	tasksDone = cnt == null ? 0 : cnt;
}

function GetTasksDone(){
	return tasksDone;
}

function SetDayAmount(){

	var q = new Query("SELECT SUM(CASE WHEN SA.LineNumber=1 THEN SA.Amount ELSE 0 END) AS AmountDayAlcohol, SUM(CASE WHEN SA.LineNumber=2 THEN SA.Amount ELSE 0 END) AS AmountDayNoAlcohol " +
		" FROM Catalog_TypeSKU_SaleDay AS SA " +
		" WHERE Date(SA.Period)=Date(@Period) AND SA.User=@UserRef GROUP BY SA.User");
	q.AddParameter("UserRef", $.common.UserRef);
	q.AddParameter("Period", DateTime.Now.Date);
	var cnt = q.Execute();

	if (cnt.AmountDayAlcohol == null)
		AmountAlcoholDay = 0;
	else
		AmountAlcoholDay = cnt.AmountDayAlcohol;

	if (cnt.AmountDayNoAlcohol == null)
		AmountNoAlcoholDay = 0;
	else
		AmountNoAlcoholDay = cnt.AmountDayNoAlcohol;

}

function SetMonthAmount(){

	var q = new Query("SELECT SUM(CASE WHEN SA.LineNumber=1 THEN SA.Amount ELSE 0 END) AS AmountMonthAlcohol, SUM(CASE WHEN SA.LineNumber=2 THEN SA.Amount ELSE 0 END) AS AmountMonthNoAlcohol " +
		" FROM Catalog_TypeSKU_SaleMonth AS SA " +
		" WHERE Date(SA.Period, 'start of month') <= Date(@Period) AND Date(SA.Period, 'start of month', '+1 months') > Date(@Period) AND SA.User=@UserRef GROUP BY SA.User");
	q.AddParameter("UserRef", $.common.UserRef);
	q.AddParameter("Period", DateTime.Now.Date);
	var cnt = q.Execute();

	if (cnt.AmountMonthAlcohol == null)
		AmountAlcoholMonth = 0;
	else
		AmountAlcoholMonth = cnt.AmountMonthAlcohol;

	if (cnt.AmountMonthNoAlcohol == null)
		AmountNoAlcoholMonth = 0;
	else
		AmountNoAlcoholMonth = cnt.AmountMonthNoAlcohol;
}

function GetAmountAlcoholDay(){
	return AmountAlcoholDay;
}

function GetAmountNoAlcoholDay(){
	return AmountNoAlcoholDay;
}

function GetAmountAlcoholMonth(){
	return AmountAlcoholMonth;
}

function GetAmountNoAlcoholMonth(){
	return AmountNoAlcoholMonth;
}

function FormatDate(datetime) {

    return Format("{0:d}", Date(datetime).Date);
}
