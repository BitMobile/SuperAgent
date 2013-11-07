// ------------------------ Events ------------------------

function OnLoad(screenName) {
    if (screenName == "Outlet_Map.xml") {
        var outlet = Variables["outlet"];
        Variables["map"].AddMarker("red", outlet.Lattitude, outlet.Longitude);
    }
    else if (screenName == "ScheduledVisits_Map.xml") {
        PrepareScheduledVisits_Map();
    }
}

function OnWorkflowStart(name) {
    if (name == "UnscheduledVisit" || name == "ScheduledVisit") {
        GPS.StartTracking();
    }
}

//function OnWorkflowForward(name, lastStep, nextStep) { }

//function OnWorkflowBack(name, lastStep, nextStep) { }

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
                Variables["map"].AddMarker("yellow", outlet.Lattitude, outlet.Longitude);
            else
                Variables["map"].AddMarker("green", outlet.Lattitude, outlet.Longitude);
        }
    }
}
