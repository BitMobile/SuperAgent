// ------------------------ Application -------------------

function OnApplicationInit() {
    Variables.AddGlobal("lastDataSync", "-");
    Variables.AddGlobal("lastFtpSync", "-");
}

// ------------------------ Events ------------------------

function OnLoad(screenName) {
    if (screenName == "Outlet_Map.xml") {
        var outlet = Variables["outlet"];
        Variables["map"].AddMarker(outlet.Description, outlet.Lattitude, outlet.Longitude, "red");
    }
    else if (screenName == "ScheduledVisits_Map.xml") {
        PrepareScheduledVisits_Map();
    }
}

function OnWorkflowStart(name) {
    Variables.AddGlobal("workflow", new Dictionary());
    if (name == "Visits" || name == "Outlets") {
        GPS.StartTracking();
    }
    Variables["workflow"].Add("name", name);
}

function OnWorkflowForward(name, lastStep, nextStep, parameters) {
    if (lastStep == "Order" && nextStep == "EditSKU" && Variables.Exists("AlreadyAdded") == false) {
        Variables.AddGlobal("AlreadyAdded", true);
    }
}

function OnWorkflowForwarding(workflowName, lastStep, nextStep, parameters) {
    if (nextStep == "Visit_Tasks") {
        if (workflowName == "ScheduledVisit" || workflowName == "UnscheduledVisit") {

            var outlet = Variables["workflow"]["outlet"];

            var tasks = GetTasks(outlet);
            var questionaries = GetQuesttionaires();
            var questions = GetQuestionsByOutlet(questionaries);
            var SKUQuest = GetSKUsByOutlet(questionaries);

            if (parseInt(tasks) == parseInt(0)) {
                //Dialog.Debug("02");
                if (parseInt(questions) == parseInt(0)) {
                    Dialog.Debug("03");
                    if (parseInt(SKUQuest) == parseInt(0)) {
                        Dialog.Debug("04");
                        Workflow.Action("Skip3", [outlet]);
                        return false;
                    }
                    Workflow.Action("Skip2", []);
                    return false;
                }
                Workflow.Action("Skip1", []);
                return false;
            }
        }
    }


    if (nextStep == "Questions") {
        if (workflowName == "ScheduledVisit" || workflowName == "UnscheduledVisit") {
            var outlet = Variables["workflow"]["outlet"];

            var questionaries = GetQuesttionaires();
            var questions = GetQuestionsByOutlet(questionaries);
            var SKUQuest = GetSKUsByOutlet(questionaries);

            if (parseInt(questions) == parseInt(0)) {
                if (parseInt(SKUQuest) == parseInt(0)) {
                    Workflow.Action("Skip3", [outlet]);
                    return false;
                }
                Workflow.Action("Skip2", []);
                return false;
            }
            else
                Workflow.Action("Skip1", []);
        }
    }


    if (nextStep == "SKUs") {
        if (workflowName == "ScheduledVisit" || workflowName == "UnscheduledVisit") {
            var outlet = Variables["workflow"]["outlet"];

            var questionaries = GetQuesttionaires();
            var SKUQuest = GetSKUsByOutlet(questionaries);

            if (parseInt(SKUQuest) == parseInt(0)) {
                Workflow.Action("Skip3", [outlet]);
                return false;
            }
            else
                Workflow.Action("Skip2", []);
        }
    }


    return true;



}

function OnWorkflowBack(name, lastStep, nextStep) {
    if (lastStep == "PriceLists" && nextStep == "OrderInfo")
        ReviseSKUs();
}

function OnWorkflowFinish(name, reason) {
    if (name == "UnscheduledVisit" || name == "ScheduledVisit") {
        Variables.Remove("outlet");
        GPS.StopTracking();
    }
    Variables.Remove("workflow");

    if (Variables.Exists("group_filter"))
        Variables.Remove("group_filter");

    if (Variables.Exists("brand_filter"))
        Variables.Remove("brand_filter");
}

function OnWorkflowPause(name) {
    Variables.Remove("workflow");
}

// ------------------------ Functions ------------------------

function PrepareScheduledVisits_Map() {
    var visitPlans = Variables["visitPlans"];
    for (var visitPlan in visitPlans) {
        var outlet = DB.Current.Catalog.Outlet.SelectBy("Id", visitPlan).First();
        if (!isDefault(outlet.Lattitude) && !isDefault(outlet.Longitude)) {
            var query = new Query();
            query.AddParameter("Date", DateTime.Now.Date);
            query.AddParameter("Outlet", outlet.Id);
            query.Text = "select single(*) from Document.Visit where Date.Date == @Date && Outlet==@Outlet";
            var result = query.Execute();
            if (result == null)
                Variables["map"].AddMarker(outlet.Description, outlet.Lattitude, outlet.Longitude, "yellow");
            else
                Variables["map"].AddMarker(outlet.Description, outlet.Lattitude, outlet.Longitude, "green");
        }
    }
}

function ReviseSKUs() {
    var query = new Query();
    query.AddParameter("orderId", Variables["workflow"]["order"].Id);
    query.Text = "select * from Document.Order_SKUs where Ref==@orderId limit 100";
    var SKUs = query.Execute();
    var s = SKUs.Count();

    if (parseInt(SKUs.Count()) != parseInt(0))
        //     Dialog.Message("SKU list will be revised");

        for (var k in SKUs) {
            var query2 = new Query();
            query2.AddParameter("PLid", Variables["workflow"]["order"].PriceList);
            query2.AddParameter("sku", k.SKU);
            query2.Text = "select single(*) from Document.PriceList_Prices where Ref==@PLid && SKU==@sku";
            var pricelistItem = query2.Execute();
            if (pricelistItem == null)
                DB.Current.Document.Order_SKUs.Delete(k);
            else {
                k.Price = pricelistItem.Price;
                k.Total = (k.Discount / 100 + 1) * k.Price;
                k.Amount = k.Qty * k.Total;
            }
        }
}

function GetTasks(outlet) {

    if (outlet == null)
        var q = new Query("SELECT Id FROM Document_Task WHERE PlanDate >= @planDate");
    else {
        var q = new Query("SELECT Id FROM Document_Task WHERE PlanDate >= @planDate AND Outlet = @outlet");
        q.AddParameter("outlet", outlet);
    }
    q.AddParameter("planDate", DateTime.Now.Date);
    return q.ExecuteCount();

}

function GetQuesttionaires() {

    return Variables["workflow"]["questionnaires"];
}

function GetQuestionsByOutlet(questionnaires) {

    var questCount = parseInt(0);
    for (var i in questionnaires) {
        var q = new Query("SELECT Id FROM Document_Questionnaire_Questions WHERE Ref=@ref");
        q.AddParameter("ref", i);
        questCount = questCount + parseInt(q.ExecuteCount());
    }
    return questCount;
}

function GetSKUsByOutlet(questionnaires) {

    var questCount = parseInt(0);
    for (var i in questionnaires) {
        var q = new Query("SELECT QS.Id FROM Document_Questionnaire_SKUs QS JOIN Catalog_SKU CS ON QS.SKU=CS.Id WHERE QS.Ref=@ref");
        q.AddParameter("ref", i);
        questCount = questCount + parseInt(q.ExecuteCount());
    }
    return questCount;
}