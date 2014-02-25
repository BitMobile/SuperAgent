
//---------------Common functions-----------

function ToFloat(text) {
    if (String.IsNullOrEmpty(text))
        return parseFloat(0, 10);
    return parseFloat(text, 10);
}

function GetSKU(val) {
    return DB.Current.Catalog.SKU.SelectBy("Id", val).First();
}

function ToInteger(text) {
    return parseInt(text);
}

function GetSum(val1, val2) {
    return parseFloat(val1) + parseFloat(val2);
}

function GetSumInt(val1, val2) {
    return parseInt(val1) + parseInt(val2);
}

function GetDifference(val1, val2) {
    return val1 - val2;
}

function GetGreater(val1, val2) {
    var r = val1 - val2;
    if (r > 0) {
        return false;
    }
    else
        return true;
}

function CountCollection(collection) {
    return parseInt(collection.Count());
}

function AreEqual(val1, val2) {
    if (val1.ToString() == val2.ToString())
        return true;
    else
        return false;
}

function NotEqualInt(val1, val2) {
    if (parseInt(val1) == parseInt(val2))
        return false;
    else
        return true;
}

function GetMultiple(val1, val2) {
    return (val1 * val2)
}

function AssignValue(entity, attribute, value, type) { //delete it
    if (type == "int") {
        if (value == "")
            entity[attribute] = parseInt(0);
        else
            entity[attribute] = parseFloat(value);
    }
    else
        entity[attribute] = value;
    return entity;
}

function FormatValue(value) {
    return String.Format("{0:F2}", value);
}

function ConvertToBoolean(val) {
    if (val == "true" || val == true)
        return true;
    else
        return false;
}

function ConvertToBoolean1(val1) {
    if (val1 > 0)
        return true;
    else
        return false;
}

function IsNullOrEmpty(val1) {
    return String.IsNullOrEmpty(val1);
}

function GetLookupList(entity, attribute) {
    var objectType = entity.Metadata[attribute].Type;
    var objectName = entity.Metadata[attribute].Name;
    var query = new Query();
    query.Text = String.Format("select * from {0}.{1}", objectType, objectName);
    return query.Execute();
}

function UpdateEntity(entity, value) {

    if (getType(entity) == "DefaultScope.Catalog.Outlet") {
        entity.ConfirmationStatus = DB.Current.Constant.OutletConfirmationStatus.New;
    }

    return entity;
}

function UpdateValueAndBack(entity, attribute, value) {
    if (attribute != "Answer" && attribute != "Value") {  //for Visit_Questions
        entity[attribute] = value;
        entity = UpdateEntity(entity, value); //set status 'New' for Outelt
        if (attribute == "PriceList") {
            var n = CountEntities("Document", "Order_SKUs", Variables["workflow"]["order"].Id, "Ref");
            if (parseInt(n) != parseInt(0))
                Dialog.Message("#SKUWillRevised#");
        }
    }
    else {
        entity[attribute] = value.Value;
    }

    Workflow.Back();

}

function CheckIfEmptyAndBack(entity, attribute, objectType, objectName) {

    if (entity.IsNew) {
        if (entity[attribute] == "" || String(entity[attribute]) == "0")//String(entity[attribute]) == "0")
            DB.Current[objectType][objectName].Delete(entity);
    }

    var r = entity.RefAsObject;
    if (getType(r) == "DefaultScope.Catalog.Outlet") {
        UpdateOtletStatus();
    }

    Workflow.Back();
}

function CheckIfEmpty(entity, attribute, objectType, objectName, deleteIfEmpty) {

    if (entity[attribute].Trim() == "" || String(entity[attribute]) == "0") {
        if (entity.IsNew && ConvertToBoolean(deleteIfEmpty)) {
            DB.Current[objectType][objectName].Delete(entity);
            return true;
        }
        else
            return false;
    }
    else
        return true;
}

function CheckIfEmptyAndForward(entity, attribute, objectType, objectName, deleteIfEmpty) {

    var doaction = CheckIfEmpty(entity, attribute, objectType, objectName, deleteIfEmpty);
    if (doaction) {
        var parameters = [];
        Workflow.Forward(parameters);
    }
}

function DeleteAndBack(entity, objectType, objectName, varToDelete) {

    if (entity.IsNew)
        DB.Current[objectType][objectName].Delete(entity);
    if (varToDelete != null)
        Variables["workflow"][varToDelete] = null;

    Workflow.Back();
}


function SetDateTime(entity, attribute) {
    var NewDateTime = entity[attribute];
    var Header = Translate["#enterDateTime#"];
    Dialog.ShowDateTime(Header, NewDateTime, DateTimeDialog, entity);
}

function DateTimeDialog(entity, dateTime) {
    entity.DeliveryDate = dateTime;
    Variables["deliveryDate"].Text = dateTime; //refactoring is needed
}

function GenerateGuid() {

    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}

function S4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
}

function GetSharedImagePath(objectType, objectID, pictID, pictExt) {

    return "/shared/" + objectType + "/" + objectID.ToString() + "/" + pictID.ToString() + pictExt;

}


//--------------------Common Querys------------------

function GetEntity(type, name, paramValue, parameter) {
    var query = new Query();
    query.AddParameter("v", paramValue);
    query.Text = String.Format("select single(*) from {0}.{1} where {2}==@v", type, name, parameter);
    return query.Execute();
}


function GetEntities(type, name, paramValue, parameter) {
    var query = new Query();
    query.AddParameter("v", paramValue);
    query.Text = String.Format("select * from {0}.{1} where {2}==@v", type, name, parameter);
    return query.Execute();
}


function CountEntities(type, name, paramValue, parameter) {
    var query = new Query();
    query.AddParameter("v", paramValue);
    query.Text = String.Format("select count(Id) from {0}.{1} where {2}==@v", type, name, parameter);
    return query.Execute();
}


//-----------------Outlets----------------------------

function CreateOutletParameterValueIfNotExists(outlet, parameter, parameterValue) {
    if (parameterValue != null)
        return parameterValue;

    var p = DB.Create("Catalog.Outlet_Parameters");

    p.Ref = outlet.Id;
    p.Parameter = parameter.Id;

    //if (parameter.DataTypeAsObject().Description == "Boolean")
    //    p.Value = false;
    //else
    p.Value = "";

    return p;
}


function GetOutlets(searchText) {
    if (String.IsNullOrEmpty(searchText)) {
        return DB.Current.Catalog.Territory_Outlets.Select().Top(500).OrderBy("OutletAsObject.Description").Distinct("OutletAsObject");
    }
    else {
        return DB.Current.Catalog.Territory_Outlets.Select().Where("OutletAsObject.Description.Contains(@p1)", [searchText]).Top(500).OrderBy("OutletAsObject.Description").Distinct("OutletAsObject");
    }
}

function CreateOutletIfNotExist(outlet) {
    if (outlet == null) {
        var p = DB.Create("Catalog.Outlet");
        p = UpdateEntity(p);
        return p;
    }
    else
        return outlet;

}

function CheckEmptyOutletFields(outlet) {
    var correctDescr = CheckIfEmpty(outlet, "Description", "", "", false);
    var correctAddr = CheckIfEmpty(outlet, "Address", "", "", false);
    if (correctDescr && correctAddr) {
        var parameters = [];
        Workflow.Forward(parameters);
    }
    else
        Dialog.Message("#couldnt_be_cleaned#");
}

function CreateAndForward() {
    var p = DB.Create("Catalog.Outlet");
    p = UpdateEntity(p);
    p.Lattitude = 0;
    p.Longitude = 0;

    var parameters = [p];
    Workflow.Action("Create", parameters);
}



function CheckNotNullAndCommit(outlet) {
    if (Variables["workflow"]["name"] == "Outlets") {
        var attributes = ["outletDescr", "outletAddress", "outletClass", "outletType", "outletDistr"];//"Description", "Address", "Type", "Class", "Distributor"];
        var areNulls = false;
        for (var i in attributes) {
            var attribute = attributes[i];
            if (Variables[attribute].Text == null || (Variables[attribute].Text).Trim() == "" || Variables[attribute].Text == "\n\n\n\n\n\n\n") {//Variables[attribute].Text == "" || Variables[attribute].Text == null) {
                areNulls = true;
            }
        }
        if (areNulls)
            Dialog.Message("#messageNulls#");
        else
            Dialog.Question("#saveChanges#", ChangeHandler);
    }
    else {
        CheckEmptyOutletFields(outlet);
    }

}

function ChangeHandler(answ) {
    if (answ == DialogResult.Yes) {
        var outlet = Variables["outlet"];
        UpdateOtletStatus();
        var territory = DB.Current.Catalog.Territory.Select().First();
        var to = DB.Create("Catalog.Territory_Outlets");
        to.Ref = territory.Id;
        to.Outlet = outlet.Id;
        Workflow.Commit();
    }
    else
        Workflow.Rollback();

}

function UpdateOtletStatus() {
    Variables["outlet"].ConfirmationStatus = DB.Current.Constant.OutletConfirmationStatus.New;
}

//----------------------Schedules visits----------------

function GetScheduledVisits(searchText) {

    if (String.IsNullOrEmpty(searchText))
        return DB.Current.Document.VisitPlan_Outlets.SelectBy("Date", DateTime.Now.Date).Top(100).OrderBy("OutletAsObject.Description");
    else
        return DB.Current.Document.VisitPlan_Outlets.SelectBy("Date", DateTime.Now.Date).Where("OutletAsObject.Description.Contains(@p1)", [searchText]).Top(100).OrderBy("OutletAsObject.Description");

}

//checks whether this visit is already done today
function GetTodayVisit(outlet) {
    var query = new Query();
    query.AddParameter("Date", DateTime.Now.Date);
    query.AddParameter("Outlet", outlet.Id);
    query.Text = "select single(*) from Document.Visit where Date.Date == @Date && Outlet==@Outlet";
    var result = query.Execute();
    //var result = DB.Current.Document.Visit.SelectBy("Date", DateTime.Now.Date).Union(DB.Current.Document.Visit.SelectBy("Outlet", outlet.Id)).First();
    if (result == null)
        return null;
    else
        return result;

}

function ShowTheMessage() {
    Dialog.Message("I work! What else?");
}


function CreateVisitIfNotExists(outlet, userId, visit, planVisit) {

    if (visit == null) {
        visit = DB.Create("Document.Visit");
        if (planVisit != null)
            visit.Plan = planVisit.Id;
        visit.Outlet = outlet.Id;
        visit.SR = userId;
        visit.Date = DateTime.Now;
        visit.StartTime = DateTime.Now;
        var location = GPS.CurrentLocation;
        if (location.NotEmpty) {
            visit.Lattitude = location.Latitude;
            visit.Longitude = location.Longitude;
        }
        visit.Status = DB.Current.Constant.VisitStatus.Processing;

        visit.Encashment = 0;
    }


    return visit;
}

function SetLocation() {
    Dialog.Question("#setCoordinates#", LocationDialogHandler);
}

function LocationDialogHandler(answ) {
    if (answ == DialogResult.Yes) {
        var location = GPS.CurrentLocation;
        if (location.NotEmpty) {
            Variables["outlet"].Lattitude = location.Latitude;
            Variables["outlet"].Longitude = location.Longitude;
            Dialog.Message("#coordinatesAreSet#");
            var outlet = Variables["outlet"];
            UpdateEntity(outlet);
            var arg = [outlet];
            Workflow.Refresh(arg);
        }
        else
            NoLocationHandler();
    }
}

function NoLocationHandler() {
    Dialog.Question("#locationSetFailed#", LocationDialogHandler);
}

function GetOutletParameters() {
    return DB.Current.Catalog.OutletParameter.Select();
}

function GoToParameterAction(typeDescription, parameterValue, value, outlet, parameter) {
    if (typeDescription == "ValueList") {
        if (parameterValue == null) {
            parameterValue = DB.Create("Catalog.Outlet_Parameters");
            parameterValue.Parameter = parameter.Id;
            parameterValue.Ref = outlet.Id;
        }
        Workflow.Action("EditParameter", [parameterValue, value, "Outlet_Parameters"]);
    }
    else {
        if (typeDescription == "DateTime") {
            parameterValue = CreateOutletParameterValueIfNotExists(outlet, parameter, parameterValue);
            var header = Translate["#enterDateTime#"];
            if (IsNullOrEmpty(parameterValue.Value))
                var date = DateTime.Now;
            else
                var date = DateTime.Parse(parameterValue.Value);
            Dialog.ShowDateTime(header, date, DateTimeParameter, parameterValue);
        }
        else
            Workflow.Action("EditAddParameter", [outlet, parameter, parameterValue]);
    }
    //="$Workflow.DoAction(EditAddParameter,$outlet,$parameter,$parameterValue)">
}

function DateTimeParameter(paramValue, dateTime) {
    paramValue.Value = dateTime;
    if (Variables.Exists("planVisit"))
        var plan = Variables.Exists("planVisit");
    else
        var plan = null;
    var o = Variables["outlet"];
    Workflow.Refresh([o, plan]);
}

function GetParameterValueList(parameterValue) {
    return DB.Current.Catalog.OutletParameter_ValueList.SelectBy("Ref", parameterValue.Parameter);
}

function GetOutletParameterValue(outlet, parameter) {
    return DB.Current.Catalog.Outlet_Parameters.SelectBy("Parameter", parameter.Id).Union(DB.Current.Catalog.Outlet_Parameters.SelectBy("Ref", outlet.Id)).First();
}


function GetTasks(outlet) {

    if (outlet == null)
        var result = DB.Current.Document.Task.Select().Where("PlanDate >= @p1", [DateTime.Now.Date]).OrderBy("OutletAsObject.Description");
    else
        var result = DB.Current.Document.Task.SelectBy("Outlet", outlet.Id).Where("PlanDate >= @p1", [DateTime.Now.Date]).OrderBy("OutletAsObject.Description");
    if (result.Count() > 0)
        return result;
    else
        return null;

}

function GetOutlet(task) {
    var v = task.OutletAsObject().Description;
    if (v == null)
        return "Various outlets";
    else
        return v;
}

function CreateVisitTaskValueIfNotExists(visit, task) {
    var query = new Query();
    query.AddParameter("Visit", visit.Id);
    query.AddParameter("Text", task.TextTask);
    query.Text = "select single(*) from Document.Visit_Task where Ref == @Visit && TextTask == @Text";
    var taskValue = query.Execute();
    if (taskValue == null) {
        taskValue = DB.Create("Document.Visit_Task");
        taskValue.Ref = visit.Id;
        taskValue.TextTask = task.TextTask;
        taskValue.TaskRef = task.Id;
    }

    return taskValue;
}
function GetQuesttionaires(outlet) {

    var t2 = DB.Current.Catalog.Territory.Select().Distinct("Id");

    var questByTerr = DB.Current.Document.Questionnaire_Territories.SelectBy("Territory", t2).Distinct("Ref");

    var q2 = DB.Current.Document.Questionnaire.SelectBy("Id", questByTerr)
        .Where("OutletType==@p1 && OutletClass==@p2 && Scale==@p3", [outlet.Type, outlet.Class, DB.Current.Constant.QuestionnaireScale.Region])
        .OrderBy("Date", true)
        .Top(1)
        .UnionAll(DB.Current.Document.Questionnaire.SelectBy("Id", questByTerr)
        .Where("OutletType==@p1 && OutletClass==@p2 && Scale==@p3", [outlet.Type, outlet.Class, DB.Current.Constant.QuestionnaireScale.Territory])
        .OrderBy("Date", true)
        .Top(1))
        .Distinct("Id");

    return q2;
}



function GetQuestionsByOutlet(questionnaires) {
    if (questionnaires == null)
        return null;
    else {
        var result = DB.Current.Document.Questionnaire_Questions.SelectBy("Ref", questionnaires).OrderBy("LineNumber").Distinct("Question");
        if (result.Count() > 0)
            return result;
        else
            return null;
    }
}


function GetVisitQuestionValue(visit, question) {
    var query = new Query();
    query.AddParameter("Visit", visit.Id);
    query.AddParameter("Question", question.Id);
    query.Text = "select single(*) from Document.Visit_Questions where Ref == @Visit && Question == @Question";
    return query.Execute();
}


function GetObject(obj) {
    return DB.Current.Catalog.Question.SelectBy("Id", obj).First();
}

function CreateVisitQuestionValueIfNotExists(visit, question, questionValue) {

    var query = new Query();
    query.AddParameter("Visit", visit.Id);
    query.AddParameter("Question", question.Id);
    query.Text = "select single(*) from Document.Visit_Questions where Ref == @Visit && Question == @Question";
    var result = query.Execute();
    if (result == null) {
        var p = DB.Create("Document.Visit_Questions");

        p.Ref = visit.Id;
        p.Question = question.Id;

        //if (question.AnswerTypeAsObject().Description == "Boolean")
        //    p.Answer = "false";
        //else
        p.Answer = "";

        result = p;
    }

    return result;

}

function GoToQuestionAction(answerType, question, visit) {
    if (answerType == "ValueList") {
        var parameters = [question, "Answer", "Visit_Questions"];
        Workflow.Action("Edit", parameters);
    }
    if (answerType == "Snapshot") {
        GetCameraObject(visit.Id);
        Camera.MakeSnapshot(SaveAtVisit, question);
    }

    if (answerType == "DateTime") {
        var Header = Translate["#enterDateTime#"];
        if (IsNullOrEmpty(question.Answer))
            var date = DateTime.Now;
        else
            var date = DateTime.Parse(question.Answer);
        Dialog.ShowDateTime(Header, date, DateTimeQuestion, question);
    }
}

function DateTimeQuestion(question, dateTime) {
    question.Answer = dateTime;
    Variables["dateTimeText"].Text = dateTime;
}


function GetCameraObject(entity) {
    FileSystem.CreateDirectory("/private/Document.Visit");
    var guid = GenerateGuid();
    Variables.Add("guid", guid);
    var path = String.Format("/private/Document.Visit/{0}/{1}.jpg", entity, guid);
    Camera.Size = 300;
    Camera.Path = path;
}

function SaveAtVisit(question) {
    question.Answer = Variables["guid"];
    Variables["snapshotInfo"].Text = Translate["#snapshotAttached#"];
}

function GetSKUShapshot(question) {
    GetCameraObject(question.Ref);
    Camera.MakeSnapshot(SaveAtSKUQuestion, question);
}

function SaveAtSKUQuestion(question) {
    question.Snapshot = Variables["guid"];
    Variables["snapshotInfo"].Text = Translate["#snapshotAttached#"];
}

function GetSnapshotText(text) {
    if (String.IsNullOrEmpty(text))
        //Variables["snapshotInfo"].Text = Translate["#noSnapshot#"];
        return Translate["#noSnapshot#"];
    else
        //Variables["snapshotInfo"].Text = Translate["#snapshotAttached#"];
        return Translate["#snapshotAttached#"];
}

function AssignQuestionValue(entity, attribute, value) {
    var q = AssignBooleanValue(entity, attribute, value);
    Workflow.Refresh([]);
}

function AssignBooleanValue(entity, attribute, value) {
    if (value == "true")
        entity[attribute] = Translate["#YES#"];
    if (value == "false")
        entity[attribute] = Translate["#NO#"];
    return entity;
}

function AssignParameterValue(entity, attribute, value) {
    var p = AssignBooleanValue(entity, attribute, value);
    var arr = [Variables["param1"], p.ParameterAsObject(), p];
    Workflow.Refresh(arr);
}

function AssignAvailableValue(entity, attribute, value) {
    var p = AssignBooleanValue(entity, attribute, value);
    var arr = [Variables["param1"], Variables["param2"], Variables["param3"], p, Variables["param5"]];
    Workflow.Refresh(arr);
}

function GetValueList(question) {
    return DB.Current.Catalog.Question_ValueList.SelectBy("Ref", question.Question).OrderBy("Value");
}

function CheckEmptyQuestionsAndForward(questionnaires, visit) {

    var emptyQuestion = DB.Current.Document.Visit_Questions.SelectBy("Ref", visit.Id).Where("Answer==@p1", [""]).First();
    while (emptyQuestion != null) {
        DB.Current.Document.Visit_Questions.Delete(emptyQuestion);
        emptyQuestion = DB.Current.Document.Visit_Questions.SelectBy("Ref", visit.Id).Where("Answer==@p1", [""]).First();
    }

    var p = [questionnaires];
    Workflow.Forward(p);
}


function GetSKUsByOutlet(questionnaires) {
    if (questionnaires == null)
        return null;
    else {
        var s = DB.Current.Catalog.SKU.Select().Distinct("Id");
        var result = DB.Current.Document.Questionnaire_SKUs.SelectBy("Ref", questionnaires).Union(DB.Current.Document.Questionnaire_SKUs.SelectBy("SKU", s)).OrderBy("LineNumber").Distinct("SKU");
        if (result.Count() > 0)
            return result;
        else
            return null;
    }
}

function CheckQuestionExistence(questionnaires, description, sku) {

    if (questionnaires != null) {
        var skuSelect = DB.Current.Document.Questionnaire_SKUs.SelectBy("SKU", sku.Id).Distinct("Ref");
        var result = DB.Current.Document.Questionnaire_SKUQuestions.SelectBy("Ref", questionnaires)
            .Where("SKUQuestionAsObject.Description==@p1 && UseInQuestionaire==@p2", [description, true])
            .Union(DB.Current.Document.Questionnaire_SKUQuestions.SelectBy("Ref", skuSelect))
            .Count();
        if (result == 0)
            return false;
        else
            return true;
    }
    else
        return null;

}


function GetVisitSKUValue(visit, sku) {
    var query = new Query();
    query.AddParameter("Visit", visit.Id);
    query.AddParameter("SKU", sku.Id);
    query.Text = "select single(*) from Document.Visit_SKUs where Ref == @Visit && SKU == @SKU";
    return query.Execute();
}


function CreateVisitSKUValueIfNotExists(visit, sku, skuValue, questionnaires) {
    if (skuValue != null)
        return skuValue;

    var p = DB.Create("Document.Visit_SKUs");

    p.Ref = visit.Id;
    p.SKU = sku.Id;

    return p;
}


function GetSKUQty(questions, questionnaires, sku) {

    var cv = parseInt(0);
    if (questions != null) {
        var parameters = ["Available", "Facing", "Stock", "Price", "MarkUp", "OutOfStock", "Snapshot"];
        for (var i in parameters) {
            var lm = CheckQuestionExistence(questionnaires, parameters[i], sku);
            if (lm)
                cv += parseInt(1);
        }
    }
    Variables["workflow"]["sku_qty"] = parseInt(Variables["workflow"]["sku_qty"]);
    Variables["workflow"]["sku_qty"] += cv;
    return cv;

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

    var n = DB.Current.Document.Visit_SKUs.SelectBy("Ref", visit.Id)
        .Where(String.Format("{0}!=@p1 && SKU==@p2", qName), [null, sku.Id])
        .Count();

    return n;

}

function CheckEmtySKUAndForward(outlet, visit) {
    var emptyQuestion = DB.Current.Document.Visit_SKUs.SelectBy("Ref", visit.Id).Where("Available==@p1 && Facing==@p1 && Stock==@p1 && Price==@p1 && MarkUp==@p1 && OutOfStock==@p1 && Snapshot==@p1", [null]).First();
    while (emptyQuestion != null) {
        DB.Current.Document.Visit_SKUs.Delete(emptyQuestion);
        emptyQuestion = DB.Current.Document.Visit_SKUs.SelectBy("Ref", visit.Id).Where("Available==@p1 && Facing==@p1 && Stock==@p1 && Price==@p1 && MarkUp==@p1 && OutOfStock==@p1 && Snapshot==@p1", [null]).First();
    }

    var p = [outlet, visit];
    Workflow.Forward(p);
}

function CheckAndCommit() {
    //set time of visit
    Variables["workflow"]["visit"].EndTime = DateTime.Now;

    //check empty order
    var order = Variables["workflow"]["order"];
    var c = CountEntities("Document", "Order_SKUs", order.Id, "Ref");
    if (c == 0)
        DB.Current.Document.Order.Delete(order);

    //TODO:check empty encashment

    //commit
    Workflow.Commit();
}

function HasCoordinates(visitPlans) {
    if (visitPlans == null) {
        return false;
    }

    for (var visitPlan in visitPlans) {
        var outlet = visitPlan.OutletAsObject();
        if (!isDefault(outlet.Lattitude) && !isDefault(outlet.Longitude)) {
            return true;
        }
    }

    return false;
}

//------------------------------UnscheduledVisit--------------


//------------------------------Order func-------------------------

function GetOrderList(searchText) {

    CreateOrderStatusVariables();

    if (String.IsNullOrEmpty(searchText)) {
        return DB.Current.Document.Order.Select().OrderBy("Date", true).Top(100);
    }
    else {
        return DB.Current.Document.Order.Select().Where("OutletAsObject.Description.Contains(@p1)", [searchText]).OrderBy("Date", true).Top(100);
    }

}

function CreateOrderStatusVariables() {
    var canc = DB.Current.Constant.OrderSatus.Canceled;
    Variables.Add("workflow.canc", canc);

    var n = DB.Current.Constant.OrderSatus.New;
    Variables.Add("workflow.new", n);

    var cls = DB.Current.Constant.OrderSatus.Closed;
    Variables.Add("workflow.cls", cls);
}

function AssignNumberIfNotExist(order) {

    if (order.Number == null) {
        var number = "noNumber";
    }
    else {
        var number = order.Number;
    }

    return number;

}

function CreateOrderIfNotExists(order, outlet, userId, visitId, executedOrder, priceLists) {

    if (executedOrder != null) {
        order = executedOrder;
    }
    else {
        if (order == null) {
            var order = DB.Create("Document.Order");
            order.Date = DateTime.Now;
            order.Outlet = outlet.Id;
            order.SR = userId;
            order.DeliveryDate = DateTime.Now;
            var location = GPS.CurrentLocation;
            if (location.NotEmpty) {
                order.Lattitude = location.Latitude;
                order.Longitude = location.Longitude;
            }
            order.Status = DB.Current.Constant.OrderSatus.New;
            if (visitId != null) {
                order.Visit = visitId;
            }
            //if (priceLists == parseInt(1)) {
            var pl = GetpriceListRef(outlet.Id);
            if (pl != null)
                order.PriceList = pl;
            //}
        }
    }
    return order;
}

function GetMaxOrderAmount(outlet) {
    var r = GetReceivables(outlet.Id);
    var am = GetAmount(r);
    var d;
    if (outlet.ReceivableLimit > 0) {
        d = outlet.ReceivableLimit - am;
    }
    else d = 0;

    return d;
}

function GetOrderedSKUs(orderId) {

    return DB.Current.Document.Order_SKUs.Select().Where("Ref==@p1", [orderId]).Top(100);
}

function GetOrderQTY(orderId) {

    var query = new Query();
    query.AddParameter("orderId", orderId);
    query.Text = "select sum(Qty) from Document.Order_SKUs where Ref==@orderId";
    return query.Execute();

}

function GetOrderSUM(orderId) {

    var query = new Query();
    query.AddParameter("orderId", orderId);
    query.Text = "select sum(Qty*Total) from Document.Order_SKUs where Ref==@orderId";
    var value = query.Execute();
    return String.Format("{0:F2}", value);

}

function GetSKUAmount(orderId, item) {

    var query = new Query();
    query.AddParameter("orderId", orderId);

    query.AddParameter("itemId", item.Id);
    query.Text = "select sum(Qty*Total) from Document.Order_SKUs where Ref==@orderId && Id==@itemId";
    var result = query.Execute();
    return String.Format("{0:F2}", result);

}


function GetPriceListQty(outlet) {
    var pl = DB.Current.Catalog.Outlet_Prices.SelectBy("Ref", outlet).Count();
    if (parseInt(pl) != parseInt(0))
        return pl;
    else {
        return d = DB.Current.Document.PriceList.SelectBy("DefaultPriceList", true).Count();
    }
}

function GetpriceListRef(outlet) {
    var pl = DB.Current.Catalog.Outlet_Prices.Select().Where("Ref==@p1", [outlet]).OrderBy("RefAsObject.Description").Count();
    if (parseInt(pl) == parseInt(1)) {
        return DB.Current.Catalog.Outlet_Prices.Select().Where("Ref==@p1", [outlet]).Distinct("PriceList").First();
    }
    if (parseInt(pl) > parseInt(1)) {
        return DB.Current.Catalog.Outlet_Prices.Select().Where("Ref==@p1 && LineNumber==@p2", [outlet, parseInt(1)]).OrderBy("RefAsObject.Description").Distinct("PriceList").First();
    }

    dl = DB.Current.Document.PriceList.SelectBy("DefaultPriceList", true).Count();
    return DB.Current.Document.PriceList.SelectBy("DefaultPriceList", true).Distinct("Id").First();

}

function PriceListAction(order, priceLists) {
    if (parseInt(priceLists) != parseInt(1) && order.StatusAsObject().Description == "New" && parseInt(priceLists) != parseInt(0)) {
        //if (parseInt(priceLists) != parseInt(1)) {
        var arr = [order, "PriceList", "Order"];
        Workflow.Action("EditPriceList", arr);
        //}
    }

}

function GetpriceLists(outlet, order) {

    var pl = DB.Current.Catalog.Outlet_Prices.Select().Where("Ref==@p1", [outlet]).OrderBy("RefAsObject.Description").Count();
    if (parseInt(pl) != parseInt(0)) {
        Variables.Add("defaultPriceLists", parseInt(0));
        return DB.Current.Catalog.Outlet_Prices.Select().Where("Ref==@p1", [outlet]).OrderBy("LineNumber");
    }
    else {
        Variables.Add("defaultPriceLists", parseInt(1));
        return DB.Current.Document.PriceList.SelectBy("DefaultPriceList", true).OrderBy("Date");
    }
}

function GetFeatures(sku) {
    var query = new Query();
    query.AddParameter("sku", sku);
    query.Text = "select * from Catalog.SKU_Stocks where Ref==@sku orderby LineNumber";
    return query.Execute();
}


function CheckfeaturesAndAction(sku) {

    var c = GetFeatures(sku.SKU);
    if (parseInt(c.Count()) == parseInt(1)) {
        var actionName = "SelectSKU";
        for (var k in c)
            var feature = k;
    }
    else {
        var actionName = "Select";
        var feature = null;
    }
    var parameters = [sku.SKUAsObject(), feature, sku.Price];
    Workflow.Action(actionName, parameters);
}

function GetFeatureDescr(feature) {
    if (feature.Code == "000000001")
        return "";
    else
        return (", " + feature.Description);
}

function SetDeliveryDate(order, attrName) {
    SetDateTime(order, attrName);
    //Workflow.Refresh([order]);
}

//-----------------------OrderItem-------------------



function CreateOrderItemIfNotExist(orderId, sku, orderitem, price, features) {

    if (orderitem == null) {

        var feature = DB.Current.Catalog.SKU_Stocks.SelectBy("Ref", sku.Id).OrderBy("LineNumber").First();

        CheckItemUniqueness(orderId, feature.Feature, sku.BaseUnit, sku.Id);

        var query = new Query();
        var r = DB.Current.Document.Order_SKUs.SelectBy("SKU", sku.Id).Where("Ref==@p1 && Feature==@p2", [orderId, feature]);
        if (r.Count() > 0) {
            for (var k in r)
                return k;
        }
        else {
            var p = DB.Create("Document.Order_SKUs");
            p.Ref = orderId;
            p.SKU = sku.Id;
            p.Feature = feature.Feature;
            p.Price = price;
            p.Total = price;
            p.Units = sku.BaseUnit;
            p.Discount = 0;
            return p;
        }
    }
    else {
        if (parseInt(orderitem.Discount) != parseInt(0))
            Variables["param4"] = orderitem.Discount;
        return orderitem;
    }

}

function CountPrice(orderitem, discChBox, price) {

    discChBox = Variables["discCheckbox"]["Checked"];

    var discount = Variables["discountEdit"].Text;

    if (discount == null || discount == "")
        discount = 0;
    if (discount < 0)
        discount = -discount;

    if (discChBox) {
        discChBox = 1;
        Variables["discTextView"].Text = Translate["#markUp#"];
    }
    else {
        discChBox = -1;
        Variables["discTextView"].Text = Translate["#discount#"];
    }

    p = CalculatePrice(orderitem.Price, (discount * discChBox), 1);
    Variables["orderitem"].Discount = Converter.ToDecimal(discount * discChBox);

    ReNewControls(p, orderitem.Discount);

    return orderitem;
}

function ReNewControls(p, discount) {

    Variables["orderitem"].Total = p;
    Variables["orderItemTotalId"].Text = p;
    Variables["discountEdit"].Text = discount;
}

function GetMultiplier(sku, orderitem) {

    if (orderitem != null) {
        var item = DB.Current.Catalog.SKU_Packing.SelectBy("Pack", orderitem.Units).Where("Ref==@p1", [sku]).First();
        return item.Multiplier;
    }
    return 1;
}

function CalculatePrice(price, discount, multiplier) {

    var total = (price * (discount / 100 + 1)) * multiplier;
    return total

}

function GetUnits(skuId) {

    var units = new Query();
    units.AddParameter("skuId", skuId);
    units.Text = "select single(*) from Catalog.SKU_Packing where Ref==@skuId";
    return units.Execute();

}

function CheckItemUniqueness(reference, featureId, unitId, skuId, orderitem) {

    var firstItem = DB.Current.Document.Order_SKUs.SelectBy("Ref", reference)
                    .Union(DB.Current.Document.Order_SKUs.SelectBy("SKU", skuId))
                    .Where("Feature==@p1 && Units==@p2", [featureId, unitId])
                    .First();

    if (firstItem != null) {
        Dialog.Question(Translate["#itemAlreadyExist#"], ItemDialogHandler, firstItem);
    }
}

function ItemDialogHandler(answ, firstItem) {

    if (answ == DialogResult.No) {
        if (parseFloat(firstItem.Discount) > parseFloat(0))
            var ch = true;
        else
            var ch = false;
        Variables["orderitem"].Qty = parseInt(0);
        Workflow.Refresh([firstItem.SKUAsObject(), firstItem.Price, firstItem, firstItem.Discount, "NotShow", ch]);
    }

}

function ChangeUnit(sku, orderitem, discChBox, price) {

    var currUnit = DB.Current.Catalog.SKU_Packing.SelectBy("Ref", sku.Id).Where("Pack==@p1", [orderitem.Units]).First();

    var unit = DB.Current.Catalog.SKU_Packing.SelectBy("Ref", sku.Id).Where("LineNumber==@p1", [(currUnit.LineNumber + 1)]).First();
    if (unit == null)
        unit = DB.Current.Catalog.SKU_Packing.SelectBy("Ref", sku.Id).Where("LineNumber==@p1", [1]).First();

    if (orderitem.Units != unit.Pack)
        CheckItemUniqueness(orderitem.Ref, orderitem.Feature, unit.Pack, sku.Id);


    if (price == null) {
        price = DB.Current.Document.PriceList_Prices.SelectBy("Ref", orderitem.RefAsObject().PriceList).Where("SKU==@p1", [orderitem.SKU]).First();
        price = Converter.ToDecimal(price.Price);
    }

    Variables["orderitem"].Price = price * unit.Multiplier;
    Variables["multiplier"] = unit.Multiplier;
    Variables["orderitem"].Units = unit.Pack;
    Variables["itemUnits"].Text = unit.PackAsObject().Description;

    orderitem = CountPrice(orderitem, discChBox, price)

    ReNewControls(p, orderitem.Discount);

}

function ChangeFeatureAndRefresh(orderItem, feature, sku, price, discountEdit, showimage) {

    if (orderItem.Feature != feature.Feature) {
        CheckItemUniqueness(orderItem.Ref, feature.Feature, orderItem.Units, orderItem.SKU);
        orderItem.Feature = feature.Feature;
        RefreshEditSKU(orderItem, sku, price, discountEdit, showimage);
    }
}

function RefreshEditSKU(orderItem, sku, price, discountEdit, showimage) {
    var d = Variables["discountEdit"].Text;
    var ch = Variables["discCheckbox"]["Checked"];
    var arr = [sku, price, orderItem, d, showimage, ch];//, discountText];
    Workflow.Refresh(arr);
}

function GetCheckBoxValue(val1) {
    if (Variables.Exists("param6")) {
        var r = Variables["param6"];
        Variables.Remove("param6");
        return r;
    }
    else {
        if (val1 > 0)
            return true;
        else
            return false;
    }
}

function DeleteItemAndBack(orderitem) {
    DB.Current.Document.Order_SKUs.Delete(orderitem);
    Workflow.Back();
}

function DeleteZeroItem(orderitem) {
    if (orderitem.Qty == 0) {
        DB.Current.Document.Order_SKUs.Delete(orderitem);
        return null;
    }
    else
        return orderitem;
}

function CheckOrderAndCommit(order, workflowName) {

    if (workflowName == "Order") {
        var c = CountEntities("Document", "Order_SKUs", order.Id, "Ref");
        if (c == 0) {
            if (order.IsNew) {
                DB.Current.Document.Order.Delete(order);
                Workflow.Commit();
            }
            else {
                Dialog.Message("#impossibleToDelete#");
                Workflow.Rollback();
            }
        }
        else
            Workflow.Commit();
    }
    else {
        Workflow.Forward([]);
    }
}


function CalculateSKUAndForward(outlet, orderitem) {

    var discChBox = Variables["discCheckbox"]["Checked"];

    var discount = Variables["discountEdit"].Text;

    if (discount == null || discount == "")
        discount = 0;
    if (discount < 0)
        discount = -discount;

    if (discChBox) {
        discChBox = 1;
    }
    else
        discChBox = -1

    Variables["orderitem"].Discount = Converter.ToDecimal(discount * discChBox);
    var p = CalculatePrice(orderitem.Price, (discount * discChBox), 1);
    Variables["orderitem"].Total = p;

    Workflow.Forward([outlet]);
}

//----------------------------GetSKUs-------------------------


function GetSKUs(searchText, owner, priceListId) {
    if (Variables.Exists("SKUcount") == false)
        Variables.Add("SKUcount", parseInt(0));

    //for Stock_SKUs.xml   
    if (priceListId == null) {
        if (String.IsNullOrEmpty(searchText)) {
            var qt = DB.Current.Catalog.SKU.SelectBy("Owner", owner).Where("CommonStock!=0.00").Top(100).OrderBy("Description");
        }
        else {
            var qt = DB.Current.Catalog.SKU.SelectBy("Owner", owner).Where("CommonStock!=0.00 && Description.Contains(@p1)", [searchText]).Top(100).OrderBy("Description");
        }
    }

        //for Order_SKUs.xml
    else {
        if (String.IsNullOrEmpty(searchText)) {
            //100 control-->

            var dif = 100 - Variables["SKUcount"];

            if (parseInt(dif) > parseInt(0)) {
                var skus = DB.Current.Catalog.SKU.SelectBy("Owner", owner).Distinct("Id");

                var qt = DB.Current.Document.PriceList_Prices.SelectBy("Ref", priceListId)
                    .Union(DB.Current.Document.PriceList_Prices.SelectBy("SKU", skus))
                    .Top(dif)
                    .OrderBy("SKUAsObject.Description");
            }
            else {
                var qt = parseInt(0);
            }
            //100 control<--

        }
        else {
            var dif = 100 - Variables["SKUcount"];

            if (parseInt(dif) > parseInt(0)) {
                var qt = DB.Current.Document.PriceList_Prices.SelectBy("Ref", priceListId)
                    .Where("SKUAsObject.Description.Contains(@p1) && SKUAsObject.Owner==@p2", [searchText, owner])
                    .Top(dif)
                    .OrderBy("SKUAsObject.Description");
            }
            else {
                var qt = parseInt(0);
            }
        }
    }

    if (qt != parseInt(0)) {
        var count = qt.Count();
    }
    else {
        var count = parseInt(0);
        qt = [];
    }

    Variables["SKUcount"] = Variables["SKUcount"] + count;

    if (parseInt(count) != parseInt(0))
        Variables.Add("groupIsNotEmpty", true);
    else
        Variables.Add("groupIsNotEmpty", false);

    return qt;
}

function GetSKUGroups(searchText) {

    var ow = DB.Current.Catalog.SKU.Select().Distinct("Owner");
    return DB.Current.Catalog.SKUGroup.SelectBy("Id", ow);

}

function ClearAndRefresh(p1, p2) {
    //$Workflow.DoRefresh
    Variables.Remove("SKUcount");
    Workflow.Refresh([p1, p2]);
}

function GetParentGroups(ref) {

    //var groups = DB.Current.Catalog.SKUGroup.Select().Distinct("Parent");
    //return p = DB.Current.Catalog.SKUGroup.SelectBy("Id", groups).
    //            UnionAll(

    var groups = DB.Current.Catalog.SKUGroup.Select().Distinct("Id");
    return DB.Current.Catalog.SKUGroup.SelectBy("Parent", groups, "<>").OrderBy("Description");

}

function GetChildren(parent) {
    var c = DB.Current.Catalog.SKUGroup.SelectBy("Parent", parent.Id);
    if (parseInt(c.Count()) == parseInt(0))
        return null;
    else
        return c;
}

function AddFilterAndRefresh(group) { //refactoring is needed after platform update

    if (Variables.Exists("filter")) {
        var f = Variables["filter"];
        Variables.Remove("filter");
    }
    else
        var f = [];

    var nCollection = [];
    for (var i in f) {
        nCollection.push(i);
    }

    var isInCollection = IsInCollection(group.Id, f);
    if (isInCollection) {
        nCollection = DeleteFromCollection(group.Id, nCollection);
    }
    else
        nCollection.push(group.Id);

    Variables.AddGlobal("filter", nCollection);

    Workflow.Refresh([]);
}

function FilterIsSet(itemId) {
    if (Variables.Exists("filter")) {
        var result = IsInCollection(itemId, Variables["filter"]);
        return result;
    }
    else
        return false;

}

function IsInCollection(item, collection) {
    var res = false;
    for (var i in collection) {
        if (item.ToString() == i.ToString())
            res = true;
    }
    return res
}

function DeleteFromCollection(item, collection) {
    var arr = [];
    for (var i in collection) {
        if (item.ToString() != collection[i].ToString())
            arr.push(collection[i]);
    }
    return arr;
}


//-------------------------------Receivables--------------------

function GetReceivables(outletId) {

    var receivables = new Query;
    receivables.AddParameter("outletRef", outletId);
    receivables.Text = "select * from Document.AccountReceivable_ReceivableDocuments where RefAsObject.Outlet == @outletRef orderby LineNumber";
    var d = receivables.Execute();
    var r = GetAmount(d);
    Variables.Add("receivableAmount", r);
    return d;

}

function CreateEncashmentIfNotExist(visit, textValue, autospread) {


    var query = new Query();
    query.AddParameter("visitRef", visit.Id);
    query.Text = "select single(*) from Document.Encashment where Visit == @visitRef";
    var encashment = query.Execute();

    if (encashment == null) {
        encashment = DB.Create("Document.Encashment");
        encashment.Visit = visit.Id;
        encashment.Date = DateTime.Now;
        var v = parseFloat(0, 10)
        encashment.EncashmentAmount = v;
    }
    if (textValue == "" || textValue == null)
        textValue = 0;
    encashment.EncashmentAmount = textValue;
    var e = GetEncAmount(textValue, autospread, encashment);
    Variables.Add("encashmentAmount", e);

    return encashment;
}

function CreateEncashmentItemIfNotExist(encashment, receivableDoc) {
    var query = new Query;
    query.AddParameter("docName", receivableDoc);
    query.AddParameter("docRef", encashment.Id);
    query.Text = "select single(*) from Document.Encashment_EncashmentDocuments where Ref == @docRef && DocumentName == @docName";
    var encItem = query.Execute();

    if (encItem == null) {
        encItem = DB.Create("Document.Encashment_EncashmentDocuments");
        encItem.Ref = encashment.Id;
        encItem.DocumentName = receivableDoc;
        encItem.EncashmentSum = 0;
    }
    return encItem;
}

function GetEncashmentItem(docName, encashment) {

    var query = new Query;
    query.AddParameter("encId", encashment);
    query.AddParameter("docName", docName);
    query.Text = "select single(*) from Document.Encashment_EncashmentDocuments where Ref == @encId && DocumentName == @docName";
    return query.Execute();

}

function GetAmount(receivables) {
    var amount = 0;
    for (var i in receivables) {
        amount += i.DocumentSum;
    }
    return amount;
}

function SpreadOnItem(encItem, sumToSpread, encashment, receivableDoc) {
    if (sumToSpread > receivableDoc.DocumentSum) {
        sumToSpread = receivableDoc.DocumentSum;
    }

    if (sumToSpread == null)
        sumToSpread = 0;

    if (encItem == null) {
        encItem = DB.Create("Document.Encashment_EncashmentDocuments");
        encItem.Ref = encashment;
        encItem.DocumentName = receivableDoc.DocumentName;
        encItem.EncashmentSum = sumToSpread;
    }
    else {
        encItem.EncashmentSum = sumToSpread;
    }
    return encItem;
}

function GetEncashments(receivables, autoSpread, encashmentAmount, encashmentId) {
    var parent = [];
    var sumToSpread = encashmentAmount;
    for (var i in receivables) {
        var document = [];
        document.push(i.DocumentName);
        var encItem = GetEncashmentItem(i.DocumentName, encashmentId);
        if (autoSpread == true) {
            if (parseInt(sumToSpread) != parseInt(0)) {
                encItem = SpreadOnItem(encItem, sumToSpread, encashmentId, i);
                document.push((Translate["#encashmentSum#: "] + encItem.EncashmentSum));
                sumToSpread = sumToSpread - encItem.EncashmentSum;
            }
            else {
                ClearIfZeroSum(encItem);
                document.push((Translate["#documentSum#: "] + i.DocumentSum));
            }
        }
        else {
            if (encItem.EncashmentSum != undefined) {
                //ClearIfZeroSum(encItem, 
                document.push((Translate["#encashmentSum#: "] + encItem.EncashmentSum));
            }
            else {
                document.push((Translate["#documentSum#: "] + i.DocumentSum));
            }
        }

        document.push(i.DocumentSum);

        parent.push(document);
    }

    Variables["workflow"]["autoSpread"] = true;

    return parent;
}

function GetDocumentsFromArray(docs) {
    //for (var i in array) {
    //Variables.Add("documentName", array[0]);
    //Variables.Add("documentBody", array[1]);
    //}
    var count = 0;      //it's all because we can't get array items by their index :'(
    for (var i in docs) {
        if (count == 0)
            Variables.Add("documentName", i);
        else {
            if (count == 1)
                Variables.Add("documentBody", i);
            else
                Variables.Add("receivableSum", i);
        }
        count += 1;
    }

}

function ClearIfZeroSum(item, sumToSpread) {
    //if (parseInt(sumToSpread) == parseInt(0)) {
    item.EncashmentSum = parseInt(0);
    //}
    return item;
}

function GetSpreadMode(workflowValue) {
    if (workflowValue == null)
        return true;
    else
        return workflowValue;
}

function GetEncAmount(encashmentText, autoSpread, encashment) {
    if (autoSpread == true) {
        if (encashmentText == null) {
            return encashment.EncashmentAmount;
        }
        else
            return encashmentText;
    }
    else {
        var query = new Query();
        query.AddParameter("docId", encashment.Id);
        query.Text = "select sum(EncashmentSum) from Document.Encashment_EncashmentDocuments where Ref==@docId";
        return query.Execute();
    }
}

function SetAmountAndForward(encashment, sum) {
    encashment.EncashmentAmount = sum;

    Workflow.Forward([]);
}

function GetSKUImage(sku) {
    return "sku/get/" + sku.Id;
}

function GetLatitude() {
    if (GPS.Update())
        return GPS.Latitude;
    return 0;
}

function GetLongitude() {
    if (GPS.Update())
        return GPS.Longitude;
    return 0;
}

function ShowDialog(v1) {
    //var v = String((v1));
    Dialog.Debug(v1);
}


//---------------------------------------------Sync--------------------------------

function Sync() {

    DB.Sync(SyncCallback);
}

function SyncCallback() {
    if (DB.LastError == null) {
        FileSystem.UploadPrivate(UploadPrivateCallback);
    }
}

function UploadPrivateCallback(args) {
    if (args.Result) {
        FileSystem.SyncShared(SyncSharedCallback);
    }
    else
        FileSystem.HandleLastError();
}

function SyncSharedCallback(args) {
    if (!args.Result) {
        FileSystem.HandleLastError();
    }
}



