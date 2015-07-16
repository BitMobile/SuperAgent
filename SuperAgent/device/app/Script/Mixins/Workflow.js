function DoForward() {
	Workflow.Forward(arguments.array);
}

function DoBack() {
	Workflow.Back();
}

function DoBackTo() {
	var arr = arguments.array;
	Workflow.BackTo(arr.shift());
}

function DoCommit() {
	Workflow.Commit();
}

function DoRollback() {
	Workflow.Rollback();
}

function DoAction() {
	var arr = arguments.array;
	Workflow.Action(arr.shift(), arr);
}

function DoRefresh() {
	Workflow.Refresh(arguments.array);
}

function SaveValue(control, ref) {
	ref = ref.GetObject();
	ref.Save();
}

function DoCall(numberStr) {
	if (String.IsNullOrEmpty(numberStr) == false)
		Phone.Call(numberStr);
}