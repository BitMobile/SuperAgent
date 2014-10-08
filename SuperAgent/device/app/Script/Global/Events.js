// ------------------------ Application -------------------

function OnApplicationInit() {
	SetSessionConstants();
	Indicators.SetIndicators();
}

// ------------------------ Events ------------------------

function OnLoad(screenName) {
	if (screenName == "Outlet_Map.xml") {
		var outlet = Variables["outlet"];
		Variables["map"].AddMarker(outlet.Description, outlet.Lattitude,
				outlet.Longitude, "red");
	} else if (screenName == "ScheduledVisits_Map.xml") {
		PrepareScheduledVisits_Map();
	}
}

function OnWorkflowStart(name) {
	if ($.Exists("workflow"))
		$.Remove("workflow");
	Variables.AddGlobal("workflow", new Dictionary());
	if (name == "Visits" || name == "Outlets" || name=="CreateOrder") {
		GPS.StartTracking();
	}

	if (name == "Visit") {

			if (parseInt(GetTasksCount()) != parseInt(0))
				Variables.Add("workflow.skipTasks", false); // нельзя просто
															// взять и присвоить
															// значение
															// переменной!
			else
				Variables.Add("workflow.skipTasks", true);

			if (parseInt(GetQuestionsCount()) != parseInt(0))
				Variables.Add("workflow.skipQuestions", false);
			else
				Variables.Add("workflow.skipQuestions", true);

			if (parseInt(GetSKUQuestionsCount()) != parseInt(0)) 
				Variables.Add("workflow.skipSKUs", false);
			else
				Variables.Add("workflow.skipSKUs", true);
	}
	
	Variables["workflow"].Add("name", name);

}

function OnWorkflowForward(name, lastStep, nextStep, parameters) {
	if (lastStep == "Order" && nextStep == "EditSKU"
			&& Variables.Exists("AlreadyAdded") == false) {
		Variables.AddGlobal("AlreadyAdded", true);
	}
}

function OnWorkflowForwarding(workflowName, lastStep, nextStep, parameters) {

	if (workflowName == "Visit") {

		if (nextStep == "Visit_Tasks") {
			if ($.workflow.skipTasks) {
				if ($.workflow.skipQuestions) {
					if ($.workflow.skipSKUs) {
						Workflow.Action("Skip3", [ outlet ]);
						return false;
					}
					Workflow.Action("Skip2", []);
					return false;
				}
				Workflow.Action("Skip1", []);
				return false;
			}
		}

		if (nextStep == "Questions") {
			if ($.workflow.skipQuestions) {
				if ($.workflow.skipSKUs) {
					Workflow.Action("Skip3", [ outlet ]);
					return false;
				}
				Workflow.Action("Skip2", []);
				return false;
			} else
				Workflow.Action("Skip1", []);
		}

		if (nextStep == "SKUs") {
			if ($.workflow.skipSKUs) {
				Workflow.Action("Skip3", [ outlet ]);
				return false;
			} else
				Workflow.Action("Skip2", []);
		}
	}

	return true;

}

//function OnWorkflowBack(name, lastStep, nextStep) {}

function OnWorkflowFinish(name, reason) {
	$.Remove("finishedWorkflow");
	$.AddGlobal("finishedWorkflow", name);
	
	if (name == "Visit" || name == "CreateOrder" || name=="Outlets") {
		Variables.Remove("outlet");

		if (Variables.Exists("planVisit"))
			Variables.Remove("planVisit");
		if (Variables.Exists("steps"))
			Variables.Remove("steps");

		GPS.StopTracking();
	}

	Variables.Remove("workflow");

	if (Variables.Exists("group_filter"))
		Variables.Remove("group_filter");

	if (Variables.Exists("brand_filter"))
		Variables.Remove("brand_filter");
	
	if (name=="Visit" || name=="CreateOrder" || name=="Outlets")
		Indicators.SetIndicators();
	
}

function OnWorkflowPause(name) {
	Variables.Remove("workflow");
}

// ------------------------ Functions ------------------------

function SetSessionConstants() { 
	var planEnbl = new Query("SELECT Use FROM Catalog_MobileApplicationSettings WHERE Code='PlanEnbl'");
	var multStck = new Query("SELECT Use FROM Catalog_MobileApplicationSettings WHERE Code='MultStck'");
	var stckEnbl = new Query("SELECT Use FROM Catalog_MobileApplicationSettings WHERE Code='NoStkEnbl'");
	
	$.AddGlobal("sessionConst", new Dictionary());
	$.sessionConst.Add("PlanEnbl", EvaluateBoolean(planEnbl.ExecuteScalar()));
	$.sessionConst.Add("MultStck", EvaluateBoolean(multStck.ExecuteScalar()));
	$.sessionConst.Add("NoStkEnbl", EvaluateBoolean(stckEnbl.ExecuteScalar()));
}

function EvaluateBoolean(res){
	if (res == null)
		return false;
	else {
		if (parseInt(res) == parseInt(0))
			return false
		else
			return true;
	}
}

function PrepareScheduledVisits_Map() {
	var visitPlans = Variables["visitPlans"];
	for ( var visitPlan in visitPlans) {
		var outlet = DB.Current.Catalog.Outlet.SelectBy("Id", visitPlan)
				.First();
		if (!isDefault(outlet.Lattitude) && !isDefault(outlet.Longitude)) {
			var query = new Query();
			query.AddParameter("Date", DateTime.Now.Date);
			query.AddParameter("Outlet", outlet.Id);
			query.Text = "select single(*) from Document.Visit where Date.Date == @Date && Outlet==@Outlet";
			var result = query.Execute();
			if (result == null)
				Variables["map"].AddMarker(outlet.Description,
						outlet.Lattitude, outlet.Longitude, "yellow");
			else
				Variables["map"].AddMarker(outlet.Description,
						outlet.Lattitude, outlet.Longitude, "green");
		}
	}
}

function GetTasksCount() {
	var taskQuery = new Query("SELECT COUNT(Id) FROM Document_Task WHERE PlanDate >= date('now','start of day') AND Outlet=@outlet");
	taskQuery.AddParameter("outlet", $.outlet);
	return taskQuery.ExecuteScalar();
}

function GetQuestionsCount() {
	q = new Query("SELECT COUNT(QQ.Id) FROM Document_Questionnaire_Questions QQ JOIN Document_QuestionnaireMap_Outlets M ON QQ.Ref=M.Questionnaire WHERE M.Outlet = @outlet");
	q.AddParameter("outlet", $.outlet);
	return q.ExecuteScalar();
}

function GetSKUQuestionsCount() {
	q = new Query("SELECT COUNT(QQ.Id) FROM Document_Questionnaire_SKUs QQ JOIN Document_QuestionnaireMap_Outlets M ON QQ.Ref=M.Questionnaire WHERE M.Outlet = @outlet");
	q.AddParameter("outlet", $.outlet);
	return q.ExecuteScalar();
}
