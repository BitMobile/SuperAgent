
//---------------Common functions-----------

function ToFloat(text) {
    if (text == null)
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

function AreEqual(val1, val2) {
    if (String(val1) == String(val2))
        return true;
    else
        return false;
}

function GetMultiple(val1, val2) {
    return (val1 * val2)
}

function AssignValue(entity, attribute, value) {
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

function UpdateEntity(entity) {

    if (getType(entity) == "DefaultScope.Catalog.Outlet") {
        entity.ConfirmationStatus = DB.Current.Constant.OutletConfirmationStatus.New;
    }
    return entity;
}

function UpdateValueAndBack(entity, attribute, value) {
    entity[attribute] = value;
    entity = UpdateEntity(entity);

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
    query = new Query();
    if (String.IsNullOrEmpty(searchText)) {
        query.Text = "select distinct(OutletAsObject) from Catalog.Territory_Outlets limit 500";
    }
    else {
        query.Text = "select distinct(OutletAsObject) from Catalog.Territory_Outlets where OutletAsObject.Description.Contains(@p1) limit 500";
        query.AddParameter("p1", searchText);
    }

    return query.Execute();
}

function GetApprovedOutlets(searchText) {
    query = new Query();
    query.AddParameter("status", DB.Current.Constant.OutletConfirmationStatus.Approved);
    if (String.IsNullOrEmpty(searchText)) {
        query.Text = "select distinct(OutletAsObject) from Catalog.Territory_Outlets where OutletAsObject.ConfirmationStatus == @status limit 500";
    }
    else {
        query.Text = "select distinct(OutletAsObject) from Catalog.Territory_Outlets where OutletAsObject.Description.Contains(@p1) && OutletAsObject.ConfirmationStatus==@status  limit 500";
        query.AddParameter("p1", searchText);
    }

    return query.Execute();
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
        Dialog.Message("Attribute couldn't be cleaned");
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
        var terrioryQuery = new Query();
        terrioryQuery.AddParameter("sr", Variables["common"]["userId"]);
        terrioryQuery.Text = "select single(*) from Catalog.Territory where SR==@sr";
        var territory = terrioryQuery.Execute();
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
    var query = new Query();
    query.AddParameter("Date", DateTime.Now.Date);
    query.AddParameter("SearchText", searchText);

    if (String.IsNullOrEmpty(searchText))
        query.Text = "select * from Document.VisitPlan_Outlets where Date == @Date orderbydesc Date";
    else
        query.Text = "select * from Document.VisitPlan_Outlets where Date == @Date && OutletAsObject.Description.Contains(@SearchText) orderbydesc Date";

    return query.Execute();
}


function GetTodayVisit(outlet) {
    var query = new Query();
    query.AddParameter("Date", DateTime.Now.Date);
    query.AddParameter("Outlet", outlet.Id);
    query.Text = "select single(*) from Document.Visit where Date.Date == @Date && Outlet==@Outlet";
    var result = query.Execute();
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
    return new Query("select * from Catalog.OutletParameter").Execute();
}


function GetOutletParameterValue(outlet, parameter) {
    var query = new Query();
    query.AddParameter("Outlet", outlet.Id);
    query.AddParameter("Parameter", parameter.Id);
    query.Text = "select single(*) from Catalog.Outlet_Parameters where Parameter == @Parameter && Ref == @Outlet";
    return query.Execute();
}


function GetTasks(outlet) {
    var query = new Query();
    query.AddParameter("Date", DateTime.Now.Date);
    query.AddParameter("Outlet", outlet.Id);
    if (outlet == null)
        query.Text = "select * from Document.Task where PlanDate >= @Date";
    else
        query.Text = "select * from Document.Task where Outlet == @Outlet && PlanDate >= @Date";

    var result = query.Execute();
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
        questions.Text = "select * from Document.Questionnaire_Questions where Ref == @Ref";
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
        query.Text = "select * from Document.Questionnaire_SKUs where Ref == @Ref";
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

    var order = Variables["workflow"]["order"];
    var c = CountEntities("Document", "Order_SKUs", order.Id, "Ref");
    if (c == 0)
        DB.Current.Document.Order.Delete(order);

    Workflow.Commit();
}

//------------------------------UnscheduledVisit--------------


//------------------------------Order func-------------------------

function GetOrderList(searchText) {

    var query = new Query();
    if (String.IsNullOrEmpty(searchText)) {
        query.Text = "select * from Document.Order orderbydesc Date limit 100";
    }
    else {
        query.AddParameter("text", searchText);
        query.Text = "select * from Document.Order where OutletAsObject.Description.Contains(@text) orderbydesc Date  limit 100";
    }

    return query.Execute();

}

function GetOrderStatus(order) {

    return order.StatusAsObject().Description;

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
            var status = new Query("select single(*) from Enum.OrderSatus where Description=='New'").Execute();
            order.Status = status.Id;
            if (visitId != null) {
                order.Visit = visitId;
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

    var query = new Query();
    query.AddParameter("orderId", orderId);
    query.Text = "select * from Document.Order_SKUs where Ref==@orderId limit 100";
    return query.Execute();

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

function CreateOrderItemIfNotExist(orderId, sku, orderitem, multiplier) {

    if (orderitem == null) {

        var query = new Query();
        query.AddParameter("ref", orderId);
        query.AddParameter("sku", sku.Id);
        query.Text = "select * from Document.Order_SKUs where Ref==@ref && SKU==@sku";
        var r = query.Execute();
        if (r.Count() > 0) {
            for (var k in r)
                return k;
        }
        else {
            var p = DB.Create("Document.Order_SKUs");
            p.Ref = orderId;
            p.SKU = sku.Id;
            p.Price = sku.Price;
            p.Total = sku.Price;
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
        var query = new Query();
        query.AddParameter("units", orderitem.Units);
        query.AddParameter("ref", sku.Id);
        query.Text = "select single(*) from Catalog.SKU_Packing where Ref==@ref && Pack==@units";
        var item = query.Execute();
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

function ChangeUnit(sku, orderitem, unit, discount, discChBox) {

    Variables["multiplier"] = unit.Multiplier;
    Variables["baseQtyTextView"].Text = orderitem.Qty * unit.Multiplier;

    Variables["orderitem"].Units = unit.Pack;
    Variables["itemUnits"].Text = unit.PackAsObject().Description;

    var p = CalculatePrice(sku.Price, orderitem.Discount, unit.Multiplier);
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
    if (c == 0)
        Workflow.Rollback();
    else
        Workflow.Commit();

}


//----------------------------GetSKUs-------------------------


function GetSKUs(searchText, owner) {
    if (owner == null) {
        query = new Query();
        if (String.IsNullOrEmpty(searchText)) {
            query.Text = "select * from Catalog.SKU where Stock!=0  limit 100";
        }
        else {
            query.Text = "select * from Catalog.SKU where Description.Contains(@p1) && Stock!=0  limit 100";
            query.AddParameter("p1", searchText);
        }
    }
    else {
        query = new Query();
        query.AddParameter("owner", owner);
        if (String.IsNullOrEmpty(searchText)) {
            query.Text = "select * from Catalog.SKU where Owner==@owner  && Stock!=0  limit 100";
        }
        else {
            query.Text = "select * from Catalog.SKU where Description.Contains(@p1) && Owner==@owner  && Stock!=0  limit 100";
            query.AddParameter("p1", searchText);
        }
    }

    return query.Execute();
}

function GetSKUGroups(searchText) {
    query = new Query();

    if (String.IsNullOrEmpty(searchText)) {
        query.Text = "select distinct(OwnerAsObject) from Catalog.SKU";
    }
    else {
        query.Text = "select distinct(OwnerAsObject) from Catalog.SKU where Description.Contains(@p1)";
        query.AddParameter("p1", searchText);
    }

    return query.Execute();
}

function checkSKUGroup(group, userId) {
    var query = new Query;
    query.AddParameter("group", group);
    query.Text = "select count(Id) from Catalog.Territory_SKUGroups where SKUGroup==@group";
    return query.Execute();

}


//-------------------------------Receivables--------------------

function GetReceivables(outletId) {

    var receivables = new Query;
    receivables.AddParameter("outletRef", outletId);
    receivables.Text = "select * from Document.AccountReceivable_ReceivableDocuments where RefAsObject.Outlet == @outletRef";
    return receivables.Execute();

}

function CreateEncashmentIfNotExist(visit) {

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
    return encashment;
}

function CreateEncashmentItemIfNotExist(encashment, receivableDoc) {
    var query = new Query;
    query.AddParameter("docName", receivableDoc.DocumentName);
    query.AddParameter("docRef", encashment.Id);
    query.Text = "select single(*) from Document.Encashment_EncashmentDocuments where Ref == @docRef && DocumentName == @docName";
    var encItem = query.Execute();

    if (encItem == null) {
        encItem = DB.Create("Document.Encashment_EncashmentDocuments");
        encItem.Ref = encashment.Id;
        encItem.DocumentName = receivableDoc.DocumentName;
        encItem.EncashmentSum = 0;
    }
    return encItem;
}

function GetEncashmentItem(docName, encashment) {
    if (encashment != null) {
        var query = new Query;
        query.AddParameter("encId", encashment.Id);
        query.AddParameter("docName", docName);
        query.Text = "select single(*) from Document.Encashment_EncashmentDocuments where Ref == @encId && DocumentName == @docName";
        return query.Execute();
    }
    else
        return null;
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
        encItem.Ref = encashment.Id;
        encItem.DocumentName = receivableDoc.DocumentName;
        encItem.EncashmentSum = sumToSpread;
    }
    else {
        encItem.EncashmentSum = sumToSpread;
    }
    return encItem;
}

function ClearIfZeroSum(item, sumToSpread) {
    var v = parseFloat(0, 10);
    if (sumToSpread == v) {
        item.EncashmentSum = 0;
    }
    return item;
}

function GetSpreadValue(startValue, workflowValue) {
    if (workflowValue == null)
        return startValue;
    else
        return workflowValue;
}

function GetEncAmount(encashmentText, autoSpread, encashment) {
    if (autoSpread == "True") {
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

function ShowDialog() {
    Dialog.Message("hi");
}



