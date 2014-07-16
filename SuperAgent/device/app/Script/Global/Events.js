// ------------------------ Application -------------------

function OnApplicationInit() {
	SetSessionConstants();
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
	Variables.AddGlobal("workflow", new Dictionary());
	if (name == "Visits" || name == "Outlets" || name=="CreateOrder") {
		GPS.StartTracking();
	}

	if (name == "Visit") {
		var steps = GetSteps($.outlet);

		Variables.Add("workflow.skipSKUs", true);
		while (steps.Next()) {

			if (parseInt(steps.Tasks) != parseInt(0))
				Variables.Add("workflow.skipTasks", false); // нельзя просто
															// взять и присвоить
															// значение
															// переменной!
			else
				Variables.Add("workflow.skipTasks", true);

			if (parseInt(steps.Questions) != parseInt(0))
				Variables.Add("workflow.skipQuestions", false);
			else
				Variables.Add("workflow.skipQuestions", true);

			if (parseInt(steps.SKUQuestions) != parseInt(0))
				Variables.Add("workflow.skipSKUs", false);
			else
				Variables.Add("workflow.skipSKUs", true);

		}
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
}

function OnWorkflowPause(name) {
	Variables.Remove("workflow");
}

// ------------------------ Functions ------------------------

function SetSessionConstants() { 
	var planEnbl = new Query("SELECT Use FROM Catalog_MobileApplicationSettings WHERE Code='PlanEnbl'");
	var multStck = new Query("SELECT Use FROM Catalog_MobileApplicationSettings WHERE Code='MultStck'");
	
	$.AddGlobal("sessionConst", new Dictionary());
	$.sessionConst.Add("PlanEnbl", EvaluateBoolean(planEnbl.ExecuteScalar()));
	$.sessionConst.Add("MultStck", EvaluateBoolean(multStck.ExecuteScalar()));
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



function GetSteps(outlet) {

	var regionQuest = GetQuesttionaire(outlet,
			DB.Current.Constant.QuestionnaireScale.Region);
	var territoryQuest = GetQuesttionaire(outlet,
			DB.Current.Constant.QuestionnaireScale.Territory);

	var outlet = $.outlet;

	var q = new Query(
			"SELECT COUNT(Id) AS Questions, (SELECT COUNT(Id) FROM Document_Task WHERE PlanDate >= @planDate AND Outlet=@outlet) AS Tasks, (SELECT COUNT(Id) FROM Document_Questionnaire_SKUs WHERE Ref=@ref1 OR Ref=@ref2) AS SKUQuestions FROM Document_Questionnaire_Questions	WHERE Ref=@ref1 OR Ref=@ref2");
	q.AddParameter("outlet", outlet);
	q.AddParameter("planDate",  DateTime.Now.Date);
	q.AddParameter("ref1", regionQuest);
	q.AddParameter("ref2", territoryQuest);

	return q.Execute();
}

function GetQuesttionaire(outlet, scale) {

	var q1 = new Query(
			"SELECT Id FROM Document_Questionnaire WHERE OutletType=@type AND OutletClass=@class AND Scale=@scale ORDER BY Date desc");
	q1.AddParameter("type", outlet.Type);
	q1.AddParameter("class", outlet.Class);
	q1.AddParameter("scale", scale);

	return q1.ExecuteScalar();

}
