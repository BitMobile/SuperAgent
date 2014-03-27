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
    if (name == "UnscheduledVisit" || name == "ScheduledVisit" || name == "Outlets") {
        GPS.StartTracking();
    }
    Variables["workflow"].Add("name", name);
}

function OnWorkflowForward(name, lastStep, nextStep, parameters) {
    //Dialog.Debug(String.Format("last: {0}, next: {1}", lastStep, nextStep));
    if (lastStep == "Order" && nextStep == "EditSKU" && Variables.Exists("AlreadyAdded") == false) {
        Variables.AddGlobal("AlreadyAdded", true);
    }
}

function OnWorkflowForwarding(workflowName, lastStep, nextStep, parameters) {
    if (nextStep == "Visit_Tasks") {
        if (workflowName == "ScheduledVisit" || workflowName == "UnscheduledVisit") {

            var outlet = Variables["workflow"]["outlet"];

            var tasks = GetTasks(outlet);
            var questionaries = GetQuesttionaires(outlet);
            var questions = GetQuestionsByOutlet(questionaries);
            var SKUQuest = GetSKUsByOutlet(questionaries);

            if (tasks.Count() == 0) {
                if (questions == null) {
                    if (SKUQuest == null) {
                        Workflow.Action("Skip3", [outlet]);
                        return false;
                    }
                    Workflow.Action("Skip2", []);
                    return false;
                }
                Workflow.Action("Skip1", []);
                return false;
            }
            else {
                parameters.Add("tasks", tasks);
            }
        }
    }


    if (nextStep == "Questions") {
        if (workflowName == "ScheduledVisit" || workflowName == "UnscheduledVisit") {
            var outlet = Variables["workflow"]["outlet"];

            var questionaries = GetQuesttionaires(outlet);
            var questions = GetQuestionsByOutlet(questionaries);
            var SKUQuest = GetSKUsByOutlet(questionaries);

            if (questions == null) {
                if (SKUQuest == null) {
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

            var questionaries = GetQuesttionaires(outlet);
            var SKUQuest = GetSKUsByOutlet(questionaries);

            if (SKUQuest == null) {
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
    if (name == "UnscheduledVisit" || name == "ScheduledVisit")
        GPS.StopTracking();
    Variables.Remove("workflow");
}

function OnWorkflowPause(name) {
    Variables.Remove("workflow");
}

// ------------------------ Functions ------------------------

function PrepareScheduledVisits_Map() {
    var visitPlans = Variables["visitPlans"];
    for (var visitPlan in visitPlans) {
        var outlet = visitPlan.OutletAsObject();
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
        var result = DB.Current.Document.Task.Select().Where("PlanDate >= @p1", [DateTime.Now.Date]).OrderBy("OutletAsObject.Description");
    else
        var result = DB.Current.Document.Task.SelectBy("Outlet", outlet.Id).Where("PlanDate >= @p1", [DateTime.Now.Date]).OrderBy("OutletAsObject.Description");
    return result;

}

function GetQuesttionaires(outlet) {

    var t2 = DB.Current.Catalog.Territory.Select().Distinct("Id");

    var questByTerr = DB.Current.Document.Questionnaire_Territories.SelectBy("Territory", t2).Distinct("Ref");

    var q2 = DB.Current.Document.Questionnaire.SelectBy("Id", questByTerr)
        .Where("OutletType==@p1 && OutletClass==@p2 && Scale==@p3", [outlet.Type, outlet.Class, DB.Current.Constant.QuestionnaireScale.Region])
        .OrderBy("Date", true)
        .Top(1)
        .UnionAll(DB.Current.Document.Questionnaire.SelectBy("Id", questByTerr)
        .Where("OutletType==@p1 && OutletClass==@p2 && Scale==@p3", [outlet.Type, outlet.Class, DB.Current.Constant.QuestionnaireScale.Territory])
        .OrderBy("Date", true)
        .Top(1))
        .Distinct("Id");

    return q2;
}

function GetQuestionsByOutlet(questionnaires) {

    if (questionnaires == null)
        return null;
    else {
        var result = DB.Current.Document.Questionnaire_Questions.SelectBy("Ref", questionnaires).OrderBy("QuestionAsObject.Description").Distinct("Question");
        if (result.Count() > 0)
            return result;
        else
            return null;
    }
}

function GetSKUsByOutlet(questionnaires) {
    if (questionnaires == null)
        return null;
    else {
        var s = DB.Current.Catalog.SKU.Select().Distinct("Id");
        var result = DB.Current.Document.Questionnaire_SKUs.SelectBy("Ref", questionnaires).Union(DB.Current.Document.Questionnaire_SKUs.SelectBy("SKU", s)).OrderBy("SKUAsObject.Description");
        if (result.Count() > 0)
            return result;
        else
            return null;
    }
}