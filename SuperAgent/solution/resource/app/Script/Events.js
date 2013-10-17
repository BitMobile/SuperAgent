//function OnWorkflowStart(name) { }

//function OnWorkflowForward(name, lastStep, nextStep) { }

//function OnWorkflowBack(name, lastStep, nextStep) {}

function OnWorkflowFinish(name, reason) {
    //Dialog.Message(name + ": " + reason);
    //if (name == "UnscheduledVisit") {
    Variables.workflow.visit.Lattitude = 1; //EndTime = DateTime.Now;
    //}
}