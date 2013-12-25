
//---------------Common functions-----------

function ToFloat(text) {
    if (String.IsNullOrEmpty(text))
        return parseFloat(0, 10);
    return parseFloat(text, 10);
}

function GetSum(val1, val2) {
    return parseFloat(val1) + parseFloat(val2);
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
    entity[attribute] = value;
    entity = UpdateEntity(entity, value);
    if (Variables["workflow"]["name"] == "Order") {
        var n = CountEntities("Document", "Order_SKUs", Variables["workflow"]["order"].Id, "Ref");
        if (parseInt(n) != parseInt(0))
            Dialog.Message("#SKUWillRevised#");
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

    if (parameter.DataTypeAsObject().Description == "Boolean")
        p.Value = false;
    else
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
        Dialog.Message("#couldn't_be_cleaned#");
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
    }
}

function GetOutletParameters() {
    return DB.Current.Catalog.OutletParameter.Select();
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
    var terrioryQuery = new Query();
    terrioryQuery.AddParameter("Outlet", outlet.Id);
    terrioryQuery.Text = "select single(*) from Catalog.Territory_Outlets where Outlet==@Outlet";
    var territory = terrioryQuery.Execute();

    var questQuery = new Query();
    questQuery.AddParameter("OutletType", outlet.Type);
    questQuery.AddParameter("OutletClass", outlet.Class);
    questQuery.AddParameter("Territory", territory.Ref);
    questQuery.Text = "select single(*) from Document.Questionnaire_Territories where  RefAsObject.OutletType == @OutletType &&  RefAsObject.OutletClass==@OutletClass && Territory==@Territory";

    return questQuery.Execute();
}


function GetQuestionsByOutlet(questionnaires) {
    if (questionnaires == null)
        return null;
    else {
        var questions = new Query();
        questions.AddParameter("Ref", questionnaires.Ref);
        questions.Text = "select * from Document.Questionnaire_Questions where Ref == @Ref orderby QuestionAsObject.Description";
        var result = questions.Execute();
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


function CreateVisitQuestionValueIfNotExists(visit, question, questionValue) {
    if (questionValue != null)
        return questionValue;

    var p = DB.Create("Document.Visit_Questions");

    p.Ref = visit.Id;
    p.Question = question.Id;

    if (question.AnswerTypeAsObject().Description == "Boolean")
        p.Answer = "false";
    else
        p.Answer = "";

    return p;
}


function GetSKUsByOutlet(questionnaires) {
    if (questionnaires == null)
        return null;
    else {
        var query = new Query();
        query.AddParameter("Ref", questionnaires.Ref);
        query.Text = "select * from Document.Questionnaire_SKUs where Ref == @Ref orderby SKUAsObject.Description";
        var result = query.Execute();
        if (result.Count() > 0)
            return result;
        else
            return null;
    }
}

function CheckQuestionExistence(questionnaires, description) {

    if (questionnaires != null) {
        var query = new Query();
        query.AddParameter("using", true);
        query.AddParameter("description", description);
        query.AddParameter("Ref", questionnaires.Ref);
        query.Text = "select single(*) from Document.Questionnaire_SKUQuestions where Ref == @Ref && SKUQuestionAsObject.Description == @description && UseInQuestionaire == @using";
        var result = query.Execute();
        if (result == null)
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


function CreateVisitSKUValueIfNotExists(visit, sku, skuValue) {
    if (skuValue != null)
        return skuValue;

    var p = DB.Create("Document.Visit_SKUs");

    p.Ref = visit.Id;
    p.SKU = sku.Id;

    return p;
}


function GetSKUQty(questions, questionnaires) {
    if (questions != null) {
        var q = questions.Count();
        var parameters = ["Available", "Facing", "Stock", "Price", "Mark up", "Out of stock"];
        var s = parseInt(0);
        var r;
        for (var i in parameters) {
            if (CheckQuestionExistence(questionnaires, parameters[i]))
                s += parseInt(1);
        }
        return q * s;
    }
    else
        return 0;

}

function GetSKUAnswers(sku, visit, sku_answ) {

    sku_answ = parseInt(sku_answ);
    var parameters = ["Available", "Facing", "Stock", "Price", "MarkUp", "OutOfStock"];
    var s = parseInt(0);
    for (var i in parameters) {
        if (IsAnswered(visit, parameters[i], sku.Id))
            s += parseInt(1);
    }
    if (sku_answ != null)
        return sku_answ + s
    else
        return s;
}

function IsAnswered(visit, qName, sku) {
    if (questionnaires != null) {
        var query = new Query();
        query.AddParameter("Ref", visit.Id);
        query.AddParameter("sku", sku);
        if (qName == "Facing" || qName == "Stock" || qName == "Price" || qName == "MarkUp") {
            query.AddParameter("null", null);
            query.Text = String.Format("select single(*) from Document.Visit_SKUs where Ref == @Ref && {0} != @null && SKU == @sku", qName);
        }
        else {
            query.Text = "select single(*) from Document.Visit_SKUs where Ref == @Ref && SKU == @sku";
        }

        var result = query.Execute();
        if (result == null)
            return false;
        else
            return true;
    }
    else
        return null;
}

function SetTimeAndCommit() {
    Variables["workflow"]["visit"].EndTime = DateTime.Now;

    //check empty order
    var order = Variables["workflow"]["order"];
    var c = CountEntities("Document", "Order_SKUs", order.Id, "Ref");
    if (c == 0)
        DB.Current.Document.Order.Delete(order);

    //check empty encashment


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
        return DB.Current.Document.Order.Select().Top(100).OrderBy("Date", true);
    }
    else {
        return DB.Current.Document.Order.Select().Where("OutletAsObject.Description.Contains(@p1)", [searchText]).Top(100).OrderBy("Date", true);
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

function CreateOrderIfNotExists(order, outlet, userId, visitId, executedOrder) {

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
            var prices = GetEntities("Catalog", "Outlet_Prices", outlet.Id, "Ref");
            if (parseInt(prices.Count()) == parseInt(1)) {
                for (var k in prices)
                    order.PriceList = k.PriceList;
            }
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

function GetpriceLists(order, attribute) {

    return DB.Current.Catalog.Outlet_Prices.Select().Where("Ref==@p1", [order.Outlet]).OrderBy("RefAsObject.Description");

}

function GetFeatures(sku) {
    var query = new Query();
    query.AddParameter("sku", sku);
    query.Text = "select * from Catalog.SKU_Stocks where Ref==@sku && StockValue!= 0";
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

function GetActionValue(skuId) {
    var c = CountEntities("Catalog", "SKU_Stocks", skuId, "Ref");
    if (parseInt(c) == parseInt(1))
        return "SelectSKU";
    else
        return "Select";
}

function GetFeatureDescr(feature) {
    if (feature.Code == "000000001")
        return "";
    else
        return (", " + feature.Description);
}

//-----------------------OrderItem-------------------



function CreateOrderItemIfNotExist(orderId, sku, orderitem, feature, price) {

    if (orderitem == null) {

        if (feature == null) {
            var f = GetEntity("Catalog", "SKU_Stocks", sku.Id, "Ref");
            feature = f.Feature;
        }

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
            p.Feature = feature;
            p.Price = price;
            p.Total = price;
            p.Units = sku.BaseUnit;
            p.Discount = 0;
            return p;
        }
    }
    else
        return orderitem;

}

function CountPrice(orderitem, discount, discChBox) {

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
    var p = orderitem.Price * Converter.ToDecimal((discount) * discChBox / 100 + 1) * Variables["multiplier"];
    Variables["orderitem"].Discount = Converter.ToDecimal(discount * discChBox);
    Variables["discountEdit"].Text = Converter.ToDecimal(discount * discChBox);
    Variables["orderitem"].Total = p;
    Variables["orderItemTotalId"].Text = p;
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
    units.Text = "select * from Catalog.SKU_Packing where Ref==@skuId";
    return units.Execute();

}

function ChangeUnit(sku, orderitem, unit, discount, discChBox, price) {

    Variables["multiplier"] = unit.Multiplier;
    Variables["baseQtyTextView"].Text = orderitem.Qty * unit.Multiplier;

    Variables["orderitem"].Units = unit.Pack;
    Variables["itemUnits"].Text = unit.PackAsObject().Description;

    var p = CalculatePrice(price, orderitem.Discount, unit.Multiplier);
    Variables["orderitem"].Price = price * unit.Multiplier;
    Variables["orderitem"].Total = p;
    Variables["orderItemTotalId"].Text = p;
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

function CheckOrderAndCommit(order) {

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


//----------------------------GetSKUs-------------------------


function GetSKUs(searchText, owner, priceListId) {
    //for Stock_SKUs.xml   
    if (priceListId == null) {
        if (String.IsNullOrEmpty(searchText)) {
            var q = DB.Current.Catalog.SKU.SelectBy("Owner", owner).Where("CommonStock!=0.00").Top(100).OrderBy("Description");
        }
        else {
            var q = DB.Current.Catalog.SKU.SelectBy("Owner", owner).Where("CommonStock!=0.00 && Description.Contains(@p1)", [searchText]).Top(100).OrderBy("Description");
        }
    }
        //for Order_SKUs.xml
    else {

        if (String.IsNullOrEmpty(searchText)) {
            //skus by group
            var skus = DB.Current.Catalog.SKU
                .SelectBy("Owner", owner)
                .Where("CommonStock!=0.00")
                .Distinct("Id");
        }
        else {
            var skus = DB.Current.Catalog.SKU
                .SelectBy("Owner", owner)
                .Where("CommonStock!=0.00 && Description.Contains(@p1)", [searchText])
                .Distinct("Id");
        }
        if (skus.Count() < 100) {
            var q = DB.Current.Document.PriceList_Prices
                .SelectBy("SKU", skus)
                .Where("Ref==@p1", [priceListId])
                .Top(100)
                .OrderBy("SKUAsObject.Description");
        }
        else {
            var q = DB.Current.Document.PriceList_Prices
                .SelectBy("Ref", priceListId)
                .Where("SKU.In(@p1)", [skus])
                .Top(100)
                .OrderBy("SKUAsObject.Description");
        }
    }

    //  to hide empty groups at the screen
    if (parseInt(q.Count()) != parseInt(0))
        Variables.Add("groupIsNotEmpty", true);
    else
        Variables.Add("groupIsNotEmpty", false);

    return q;
}

function GetSKUGroups(searchText) {

    var ow = DB.Current.Catalog.SKU.Select().Distinct("Owner");
    return DB.Current.Catalog.SKUGroup.SelectBy("Id", ow);

}


//-------------------------------Receivables--------------------

function GetReceivables(outletId) {

    var receivables = new Query;
    receivables.AddParameter("outletRef", outletId);
    receivables.Text = "select * from Document.AccountReceivable_ReceivableDocuments where RefAsObject.Outlet == @outletRef orderby DocumentName";
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
        else
            Variables.Add("documentBody", i);
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

function test() {
    var parameters = ["Available", "Facing", "Stock", "Price", "MarkUp", "OutOfStock"];
    return parameters;
}




