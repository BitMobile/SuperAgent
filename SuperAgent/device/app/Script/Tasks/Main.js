function GetOutlet(){
	return GlobalWorkflow.GetOutlet();
}

function HasMenu(){
	return $.workflow.name == "Main" ? true : false;
}

function GetExecutedTasks() {
	var query = new Query;

	var outlet = "";

	if ($.workflow.name == "Visit"){
		query.AddParameter("outlet", GlobalWorkflow.GetOutlet());
		outlet = " AND DT.Outlet=@outlet ";
	}

	query.Text = "SELECT O.Description AS Outlet, DT.Id, DT.TextTask, DT.EndPlanDate, DT.ExecutionDate " +
		" FROM Document_Task DT " +
		" JOIN Catalog_Outlet O ON DT.Outlet=O.Id " +
		" WHERE DT.Status=1 " +
		" AND DATE(ExecutionDate)=DATE('now', 'localtime') " + outlet +
		" ORDER BY DT.ExecutionDate desc, O.Description";

	return query.Execute();
}

function GetNotExecutedTasks() {
	var q = new Query;

	var outlet = "";

	if ($.workflow.name == "Visit"){
		q.AddParameter("outlet", GlobalWorkflow.GetOutlet());
		outlet = " AND DT.Outlet=@outlet ";
	}

	q.Text = "SELECT O.Description AS Outlet, DT.Id, DT.TextTask, DT.EndPlanDate " +
		" FROM Document_Task DT " +
		" JOIN Catalog_Outlet O ON DT.Outlet=O.Id " +
		" WHERE DT.Status=0 " +
		" AND DATE(DT.StartPlanDate)<=DATE('now', 'localtime') " + outlet +
		" ORDER BY DT.EndPlanDate, O.Description";

	return q.Execute();
}

function FormatDate(datetime) {
	return Format("{0:d}", Date(datetime).Date);
}

function AddGlobalAndAction(paramValue){
	GlobalWorkflow.SetCurrentTask(paramValue);
	Workflow.Action('Select', []);
}