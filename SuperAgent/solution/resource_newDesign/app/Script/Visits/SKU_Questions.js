
function GetSKUsByOutlet(questionnaire) {
    //if (questionnaires == null)
    //    return null;
    //else {
    //    var s = DB.Current.Catalog.SKU.Select().Distinct("Id");
    //    var result = DB.Current.Document.Questionnaire_SKUs.SelectBy("Ref", questionnaires).Union(DB.Current.Document.Questionnaire_SKUs.SelectBy("SKU", s)).OrderBy("LineNumber").Distinct("SKU");
    //    if (result.Count() > 0)
    //        return result;
    //    else
    //        return null;
    //}
    var q = new Query("SELECT DISTINCT DQ.Id, CS.Description, DQ.SKU FROM Document_Questionnaire_SKUs DQ JOIN Catalog_SKU CS ON DQ.SKU=CS.Id WHERE Ref=@ref ORDER BY DQ.LineNumber");
    q.AddParameter("ref", questionnaire);
    var rcs = q.Execute();
    while (rcs.Next()) {
        //Dialog.Debug(rcs.SKU);
    }
    //rcs.Next();
    return q.Execute();
}

function GetVisitSKUValue(visit, sku) {
    var query = new Query("SELECT Id FROM Document_Visit_SKUs WHERE Ref == @Visit AND SKU == @SKU");
    query.AddParameter("Visit", visit);
    query.AddParameter("SKU", sku);
    return query.Execute();
}

function GetSKUQty(questionnaire, sku) {

    var cv = parseInt(0);
    var parameters = ["Available", "Facing", "Stock", "Price", "MarkUp", "OutOfStock", "Snapshot"];
    for (var i in parameters) {
        var lm = CheckQuestionExistence(questionnaire, parameters[i], sku);
        if (lm)
            cv += parseInt(1);
    }
    Variables["workflow"]["sku_qty"] = parseInt(Variables["workflow"]["sku_qty"]);
    Variables["workflow"]["sku_qty"] += cv;
    return cv;

}

function CheckQuestionExistence(questionnaire, description, sku) {

    //var skuSelect = DB.Current.Document.Questionnaire_SKUs.SelectBy("SKU", sku.Id).Distinct("Ref");
    //var result = DB.Current.Document.Questionnaire_SKUQuestions.SelectBy("Ref", questionnaires)
    //    .Where("SKUQuestionAsObject.Description==@p1 && UseInQuestionaire==@p2", [description, true])
    //    .Union(DB.Current.Document.Questionnaire_SKUQuestions.SelectBy("Ref", skuSelect))
    //    .Count();
    //if (result == 0)
    //    return false;
    //else
    //    return true;
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

function GetSKUAnswers(visit, sku) {//, sku_answ) {

    var sa = parseInt(0);
    var parameters = ["Available", "Facing", "Stock", "Price", "MarkUp", "OutOfStock", "Snapshot"];
    for (var i in parameters) {
        if (IsAnswered(visit, parameters[i], sku))
            sa += parseInt(1);
    }
    Variables["workflow"]["sku_answ"] += sa;
    return sa;
}

function IsAnswered(visit, qName, sku) {

    //var n = DB.Current.Document.Visit_SKUs.SelectBy("Ref", visit.Id)
    //    .Where(String.Format("{0}!=@p1 && SKU==@p2", qName), [null, sku.Id])
    //    .Count();

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


//------------------------SKU----------------------

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

function GoToQuestionAction(answerType, question, visit, control, attribute) {

    if (answerType == "Snapshot") {
        GetCameraObject(visit);
        Camera.MakeSnapshot(SaveAtVisit, question);
    }

    if (answerType == "Boolean") {
        Global.BooleanDialogSelect(question, attribute, Variables[control]);
    }

    if (answerType == "Integer" || answerType == "String" || answerType == "Decimal") {
        Variables["memoAnswer"].AutoFocus == true;
    }
}

function SaveAndBack(entity) {
    entity.GetObject().Save();
    Workflow.Back();
}