var c_entity;
var c_attribute;

function OnLoad() {
	c_entity = $.entity;
	c_attribute = $.attribute;
	if ($.sessionConst.galleryChoose)
		$.reshoot.Text = Translate["#editChange#"];
}

function Reshoot(control) {
	if ($.sessionConst.galleryChoose) 
		Images.AddSnapshot($.outlet, c_entity, SaveSnapshot, null, null, true);
	else
		Images.MakeSnapshot($.outlet, SaveSnapshot);
}

function SaveSnapshot(state, args) {
	if (args.Result) {
		var objRef = state[0];
		var pictId = state[1];
		var source = state[2];
		
		var entityObj = c_entity.GetObject();
		entityObj[c_attribute] = pictId;
		entityObj.Save();		
		
		Workflow.Refresh([source, c_entity, c_attribute]);
	}	
}

function Delete() {
	var object = c_entity.GetObject();
	object[c_attribute] = null;
	
	if (getType(object)=="DefaultScope.Catalog.Outlet_Snapshots")
		object.Deleted = true; 
	
	object.Save();
	Workflow.Back();
}


//---------------------------------Special handlers-------------------------------


function AssignQuestionAnswer() {
//	var answerString;
//	if (String.IsNullOrEmpty(answer))
//		answerString = "HistoryAnswer ";
//	else
//		answerString = "@answer ";
//
//	var q =	new Query("UPDATE USR_Questions SET Answer=" + answerString + ", AnswerDate=DATETIME('now', 'localtime') " +
//			"WHERE Question=@question");
//	q.AddParameter("answer", answer);
//	q.AddParameter("question", question);
//	q.Execute();
	
//	var q =	new Query("UPDATE USR_SKUQuestions SET Answer=" + answerString + ", AnswerDate=DATETIME('now', 'localtime') " +
//			"WHERE Question=@question AND SKU=@sku");
//	q.AddParameter("answer", answer);
//	q.AddParameter("sku", sku);
//	q.AddParameter("question", question);
//	q.Execute();
}