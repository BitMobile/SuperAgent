
function GetNextVisitDate(outlet){
	var q = new Query("SELECT PlanDate FROM Document_MobileAppPlanVisit WHERE Outlet=@outlet AND DATE(PlanDate)>=DATE(@date) AND Transformed=0");
	q.AddParameter("outlet", outlet);
	q.AddParameter("date", DateTime.Now.Date);
	return q.ExecuteScalar();
	
}

function OrderCheckRequired(visit, wfName) {
    if (visit.Plan.EmptyRef()==false && GetOrderControlValue() && OrderExists(visit) == false)
        return true;
    else
        return false;
}

function OrderExists(visit) {
    //var p = DB.Current.Document.Order.SelectBy("Visit", visit.Id).First();
    var q = new Query("SELECT Id FROM Document_Order WHERE Visit=@visit");
    q.AddParameter("visit", visit);
    var p = q.ExecuteScalar();
    if (p == null)
        return false;
    else
        return true;
}

function SetDeliveryDate(order, control) {
    DateTimeDialog(order, "DeliveryDate", order.DeliveryDate, control);
}

function SetnextVisitDate(nextDate, control){
	if (String.IsNullOrEmpty(nextDate))
		nextDate = DateTime.Now;
	Dialog.ShowDateTime(Translate["#enterDateTime#"], nextDate, NextDateHandler, control);
}

function GetOrderControlValue() {
    //var orderFillCheck = DB.Current.Catalog.MobileApplicationSettings.SelectBy("Code", "NOR").First();
    var q = new Query("SELECT Use FROM Catalog_MobileApplicationSettings WHERE Code='NOR'");
    var uvr = q.ExecuteScalar();

    if (uvr == null)
        return false;
    else {
        if (parseInt(uvr) == parseInt(0))
            return false
        else
            return true;
    }
}

function VisitReasonCheckrequired(wfName, visit) {
    if (visit.Plan.EmptyRef() && GetUVRvalue())
        return true
    else
        return false;
}

function GetUVRvalue() {
    //var uvr = DB.Current.Catalog.MobileApplicationSettings.SelectBy("Code", "UVR").First();
    var q = new Query("SELECT Use FROM Catalog_MobileApplicationSettings WHERE Code='UVR'");
    var uvr = q.ExecuteScalar();
    if (uvr == null)
        return false;
    else {
        if (parseInt(uvr) == parseInt(0))
            return false
        else
            return true;
    }
}

function CountAnswers(visitId, skuAnsw) {
    var query = new Query("SELECT Id FROM Document_Visit_Questions WHERE Ref=@ref");
    query.AddParameter("ref", visitId);
    var q = query.ExecuteCount();
    return (q + skuAnsw);
}

function CountDoneTasks(visit) {
    var query = new Query("SELECT Id FROM Document_Visit_Task WHERE Ref=@ref");
    query.AddParameter("ref", visit);
    return query.ExecuteCount();
}

function CountTasks(outlet) {
    //return DB.Current.Document.Task.SelectBy("Outlet", outlet.Id).Where("PlanDate >= @p1", [DateTime.Now.Date]).Count();
    var query = new Query("SELECT Id FROM Document_Task WHERE PlanDate >= @planDate AND Outlet = @outlet");
    query.AddParameter("outlet", outlet);
    query.AddParameter("planDate", DateTime.Now.Date);
    return query.ExecuteCount();
}

function GetOrderSUM(order) {
    var query = new Query("SELECT SUM(Qty*Total) FROM Document_Order_SKUs WHERE Ref = @Ref");
    query.AddParameter("Ref", order);
    var sum = query.ExecuteScalar();
    if (sum == null)
        return 0;
    else
        return String.Format("{0:F2}", sum);
}

function CheckAndCommit(order, visit, wfName) {

    if (VisitIsChecked(visit, order, wfName)) {
        visit = visit.GetObject();
    	visit.EndTime = DateTime.Now;

        if (OrderExists(visit.Id)) {
            order.GetObject().Save();
        }

        visit.Save();
        Workflow.Commit();
    }
    else
        Dialog.Message(Translate["#messageNulls#"]);

}


//--------------------------internal functions--------------


function NextDateHandler(date, control){
	
	var newVistPlan = DB.Create("Document.MobileAppPlanVisit");
	newVistPlan.SR = $.common.UserRef;
	newVistPlan.PlanDate = date;
	newVistPlan.Outlet = $.workflow.outlet;
	newVistPlan.Transformed = false;
	newVistPlan.Date = DateTime.Now;
	newVistPlan.Save();
	
	//control.Text = date;
	Workflow.Refresh([]);
}


function VisitIsChecked(visit, order, wfName) {
    if (OrderCheckRequired(visit, wfName) && visit.ReasonForNotOfTakingOrder.EmptyRef())
        return false;
    else {
        if (VisitReasonCheckrequired(wfName, visit) && visit.ReasonForVisit.EmptyRef())
            return false;
        else
            return true;
    }
}


function DialogCallBack(control, key){
	control.Text = key;
}