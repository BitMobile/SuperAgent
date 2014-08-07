function GetSKUsFromQuesionnaires(outlet) {

	var regionQuest = GetQuesttionaire(outlet, DB.Current.Constant.QuestionnaireScale.Region);
	var territoryQuest = GetQuesttionaire(outlet, DB.Current.Constant.QuestionnaireScale.Territory);

	var q = new Query();
	var fileds = "SELECT q1.LineNumber AS LineNumber, q1.SKU, CS.Description, q1.Ref AS Ref1, DQQ2.Ref AS Ref2, ";
	var innerQuery1 = "(SELECT COUNT(Id) FROM Document_Questionnaire_SKUQuestions WHERE UseInQuestionaire=1 AND Ref=@regionRef) ";
	var caseThen = " CASE WHEN DQQ2.Ref IS NULL THEN NULL ELSE ";
	var caseEnd = " END AS questionsCount2 ";
	var innerQuery2 = " (SELECT COUNT(Id) FROM Document_Questionnaire_SKUQuestions WHERE UseInQuestionaire=1 AND Ref=@terrRef) ";
	var from = " FROM Document_Questionnaire_SKUs q1 JOIN Catalog_SKU CS ON q1.SKU=CS.Id ";
	var leftJoin1 = " LEFT JOIN Document_Questionnaire_SKUs DQQ2 ON q1.SKU=DQQ2.SKU AND DQQ2.Ref=@terrRef ";
	var where1 = " WHERE q1.Ref=@regionRef ";
	var leftJoin2 = " LEFT JOIN Document_Questionnaire_SKUs q2 ON q2.SKU=q1.SKU and q2.ref=@regionRef LEFT JOIN Document_Questionnaire_SKUs DQQ2 ON q1.SKU=DQQ2.SKU AND DQQ2.Ref=@regionRef WHERE q1.Ref = @terrRef and q2.Id is null ";
	var order = " ORDER BY T1, LineNumber ";
	q.Text = fileds + " 1 AS T1, " + innerQuery1 + " AS questionsCount1, " + caseThen + innerQuery2 + caseEnd + from + leftJoin1 + where1 + " UNION ALL " + fileds + " 2 AS T1, " + innerQuery2 + " AS questionsCount1, " + caseThen + innerQuery1 + caseEnd + from + leftJoin2 + order;

	q.AddParameter("regionRef", regionQuest); // 38426ABE-7EA7-11E3-BD7D-50E549CAB397
	q.AddParameter("terrRef", territoryQuest); // CD5051D4-7E9C-11E3-BD7D-50E549CAB397

	return q.Execute();
}

function GetQuesttionaire(outlet, scale) {

	var q1 = new Query("SELECT Id FROM Document_Questionnaire WHERE OutletType=@type AND OutletClass=@class AND Scale=@scale ORDER BY Date desc");
	q1.AddParameter("type", outlet.Type);
	q1.AddParameter("class", outlet.Class);
	q1.AddParameter("scale", scale);

	return q1.ExecuteScalar();

}

function GetVisitSKUValue(visit, sku) {
	var query = new Query("SELECT Id FROM Document_Visit_SKUs WHERE Ref == @Visit AND SKU == @SKU");
	query.AddParameter("Visit", visit);
	query.AddParameter("SKU", sku);
	return query.ExecuteScalar();
}

function GetSKUQty(outlet, ref1, ref2, count1, count2) {

	var c = 0;

	if (ref2 == null)
		c = count1;
	else {
		var regionQuest = GetQuesttionaire(outlet, DB.Current.Constant.QuestionnaireScale.Region);
		var territoryQuest = GetQuesttionaire(outlet, DB.Current.Constant.QuestionnaireScale.Territory);

		var query = new Query("SELECT DISTINCT q1.SKUQuestion FROM Document_Questionnaire_SKUQuestions q1 WHERE (q1.Ref=@ref1 OR q1.Ref=@ref2) AND q1.UseInQuestionaire=1");
		query.AddParameter("ref1", regionQuest);
		query.AddParameter("ref2", territoryQuest);
		var res = query.ExecuteCount();

		c = res;
	}

	var n = $.workflow.sku_qty;
	$.workflow.Remove("sku_qty");
	$.workflow.Add("sku_qty", (n + c));

	return c;

}

function CheckQuestionExistence(questionnaire, description, sku) {

	var q = new Query("SELECT DQ.Id,  E.Description, CS.Description AS SKU, DQ.UseInQuestionaire FROM Document_Questionnaire_SKUQuestions DQ JOIN Enum_SKUQuestions E ON DQ.SKUQuestion=E.Id JOIN Document_Questionnaire_SKUs DS ON DS.Ref=DQ.Ref JOIN Catalog_SKU CS ON DS.SKU=CS.Id WHERE DQ.Ref=@ref AND E.Description=@questionDescr AND DS.SKU=@sku AND DQ.UseInQuestionaire=@use");
	q.AddParameter("ref", questionnaire);
	q.AddParameter("questionDescr", description);
	q.AddParameter("sku", sku);
	q.AddParameter("use", true);
	if (parseInt(q.ExecuteCount()) == parseInt(0))
		return false;
	else
		return true;
}

function GetSKUAnswers(skuvalue) {// , sku_answ) {

	if (skuvalue == null)
		return parseInt(0);

	else {
		var sa = parseInt(0);
		var parameters = [ "Available", "Facing", "Stock", "Price", "MarkUp", "OutOfStock", "Snapshot" ];
		for ( var i in parameters) {
			var name = parameters[i];
			if (String.IsNullOrEmpty(skuvalue[name])==false)
				sa += parseInt(1);
		}

		Variables["workflow"]["sku_answ"] += sa;
		return sa;
	}
}

function IsAnswered(visit, qName, sku) {

	// var n = DB.Current.Document.Visit_SKUs.SelectBy("Ref", visit.Id)
	// .Where(String.Format("{0}!=@p1 && SKU==@p2", qName), [null, sku.Id])
	// .Count();

	var n = new Query("SELECT Id FROM Document_Visit_SKUs WHERE Ref=@ref AND " + qName + " IS NOT NULL AND SKU=@sku");
	n.AddParameter("ref", visit);
	n.AddParameter("sku", sku);
	if (parseInt(n.ExecuteCount()) == parseInt(0))
		return false;
	else
		return true;

}

function SKUIsInList(sku) {
	if (Variables.Exists("skuQuestions") == false)
		Variables.Add("skuQuestions", new List());
	if (IsInCollection(sku, Variables["skuQuestions"]))
		return true;
	else {
		var arr = Variables["skuQuestions"];
		arr.Add(sku);
		Variables["skuQuestions"] = arr;
		return false;
	}
}

// ------------------------SKU----------------------

function GetSKUQuestions(regionQuest, territoryQuest) {

	var q = new Query("SELECT DISTINCT ES.Description, DQ.LineNumber, DQ.SKUQuestion FROM Document_Questionnaire_SKUQuestions DQ JOIN Enum_SKUQuestions ES ON DQ.SKUQuestion=ES.Id WHERE (DQ.Ref=@ref1 OR DQ.Ref=@ref2) AND DQ.UseInQuestionaire=1 ORDER BY LineNumber");
	q.AddParameter("ref1", regionQuest);
	q.AddParameter("ref2", territoryQuest);

	var res = q.Execute();

	var arr = new List;
	while (res.Next())
		arr.Add(res.SKUQuestion.Description);
	return arr;
}

function CreateVisitSKUValueIfNotExists(visit, sku, skuValue) {
	if (skuValue != null)
		return skuValue;

	var p = DB.Create("Document.Visit_SKUs");

	p.Ref = visit;
	p.SKU = sku;
	p.Save();

	return p.Id;
}

function GetSnapshotText(text) {
	if (String.IsNullOrEmpty(text))
		return Translate["#noSnapshot#"];
	else
		return Translate["#snapshotAttached#"];
}

function GetQuestionSet(quest1, quest2, skuValue) {
	var q = new Query();
	q.AddParameter("ref1", quest1);
	q.AddParameter("ref2", quest2);
	var res = q.Execute();

}

function GoToQuestionAction(answerType, question, visit, control, attribute) {

	if (answerType == "Snapshot") {
		GetCameraObject(visit);
		Camera.MakeSnapshot(SaveAtVisit, question);
	}

	if (answerType == "Boolean") {
		BooleanDialogSelect(question, attribute, Variables[control]);
	}

	if (answerType == "Integer" || answerType == "String" || answerType == "Decimal") {
		Variables["memoAnswer"].AutoFocus == true;
	}
}

function SaveAndBack(skuValue) {
	if (NotEmptyObject(skuValue) == false)
		DB.Delete(skuValue);
	skuValue = skuValue.GetObject().Save();
	Workflow.Back();
}

function NotEmptyObject(skuValue) {
	var stat = false;
	var arr = [ "Available", "Facing", "Stock", "Price", "MarkUp", "OutOfStock", "Snapshot" ];
	for ( var i in arr) {
		var a = arr[i];
		if (String.IsNullOrEmpty(skuValue[a]) == false){
			stat = true;
		}
			
	}
	return stat;
}

function CheckEmtySKUAndForward(outlet, visit) {
	var p = [ outlet, visit ];
	Workflow.Forward(p);
}

function GetSKUShapshot(visit, question, control) {
	GetCameraObject(visit.Id);
	Camera.MakeSnapshot(SaveAtVisit, [ question, control ]);
}

function GetCameraObject(entity) {
	FileSystem.CreateDirectory("/private/Document.Visit");
	var guid = Global.GenerateGuid();
	Variables.Add("guid", guid);
	var path = String.Format("/private/Document.Visit/{0}/{1}.jpg", entity, guid);
	Camera.Size = 300;
	Camera.Path = path;
}

function SaveAtVisit(arr) {
	var question = arr[0];
	var control = arr[1];
	question = question.GetObject();
	question.Snapshot = Variables["guid"];
	question.Save();
	control.Text = Translate["#snapshotAttached#"];
}

function GetActionAndBack() {
	if ($.workflow.skipQuestions) {
		if ($.workflow.skipTasks) {
			Workflow.BackTo("Outlet");
		} else
			Workflow.BackTo("Visit_Tasks");
	} else
		Workflow.Back();
}

//------------------------------internal-----------------------------------

function DialogCallBack(control, key){
	
	Workflow.Refresh([$.param1, $.param2, $.param3, $.param4, $.skuValue]);
}
