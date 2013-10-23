function OnWorkflowStart(name) {
    if (name == "UnscheduledVisit") {
        GPS.StartTracking();
    }
}

function OnWorkflowForward(name, lastStep, nextStep) { }

function OnWorkflowBack(name, lastStep, nextStep) { }

function OnWorkflowFinish(name, reason) {
    //Dialog.Message(name, reason);
    if (name == "UnscheduledVisit" || name == "ScheduledVisit") //{
        GPS.StopTracking();
    //    if (Variables["workflow"]["visit"] != null)
    //        Variables["workflow"]["visit"].EndTime = DateTime.Now;
    //}
}
