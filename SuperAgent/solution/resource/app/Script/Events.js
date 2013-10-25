function OnWorkflowStart(name) {
    if (name == "UnscheduledVisit" || name == "ScheduledVisit") {
        GPS.StartTracking();
    }
}

function OnWorkflowForward(name, lastStep, nextStep) { }

    function OnWorkflowBack(name, lastStep, nextStep) { }

    function OnWorkflowFinish(name, reason) {
        if (name == "UnscheduledVisit" || name == "ScheduledVisit")
            GPS.StopTracking();
    }
