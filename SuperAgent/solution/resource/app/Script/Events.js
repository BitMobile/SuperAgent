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
    if (name == "UnscheduledVisit" || name == "ScheduledVisit") {
        GPS.StartTracking();
    }
    Variables["workflow"].Add("name", name);
}

//function OnWorkflowForward(name, lastStep, nextStep) { }

function OnWorkflowBack(name, lastStep, nextStep) {
    if (lastStep == "PriceLists" && nextStep == "Order") {

        //revising SKUs
        var query = new Query();
        query.AddParameter("orderId", Variables["workflow"]["order"].Id);
        query.Text = "select * from Document.Order_SKUs where Ref==@orderId limit 100";
        var SKUs = query.Execute();
        var s = SKUs.Count();

        if (parseInt(SKUs.Count()) != parseInt(0))
            Dialog.Message("SKU list will be revised");

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
}

function OnWorkflowFinish(name, reason) {
    if (name == "UnscheduledVisit" || name == "ScheduledVisit")
        GPS.StopTracking();
}

// ------------------------ Functions ------------------------

function PrepareScheduledVisits_Map() {
    var visitPlans = Variables["outlets"];
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
