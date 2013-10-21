function OnWorkflowStart(name) {
    if (name == "UnscheduledVisit") {
        GPS.StartTracking();
    }
}

function OnWorkflowForward(name, lastStep, nextStep) { }

function OnWorkflowBack(name, lastStep, nextStep) { }

function OnWorkflowFinish(name, reason) {
    if (name == "UnscheduledVisit") {
        GPS.StopTracking();
        Variables["workflow"]["visit"].EndTime = DateTime.Now;
    }
}
