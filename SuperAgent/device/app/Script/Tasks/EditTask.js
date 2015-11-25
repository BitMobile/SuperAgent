
// function OnLoad(){
// 	var task = GlobalWorkflow.GetCurrentTask();
// 	$.resultEdit.Editable = task.IsNew();
// }

function GetCurrentTask(){
	return GlobalWorkflow.GetCurrentTask();
}

function FormatDate(datetime) {
	return Format("{0:d}", Date(datetime).Date);
}

function RetrieveTask(task){
	var taskObj = task.GetObject();
	taskObj.Status = false;
	taskObj.ExecutionDate = null;
	taskObj.FactExecutor = DB.EmptyRef("Catalog_User");
	taskObj.Save();
	DoRefresh();
}

function CompleteTheTask(task){
	var taskObj = task.GetObject();
	taskObj.Status = true;
	taskObj.ExecutionDate = DateTime.Now;
	taskObj.FactExecutor = $.common.UserRef;
	taskObj.Save();
	DoRefresh();
}

function CompleteTask(){
	if ($.workflow.name == 'Visit')
		DoBack();
	else
		DoCommit();
}