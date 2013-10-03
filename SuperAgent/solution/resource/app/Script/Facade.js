
function ToFloat(text) {
    return parseFloat(text, 10)
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

function GetLookupList(entity, attribute) {
    var objectType = entity.Metadata[attribute].Type;
    var objectName = entity.Metadata[attribute].Name;
    var query = new Query();
    query.Text = String.Format("select * from {0}.{1}", objectType, objectName);
    return query.Execute();
}

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
        query.Text = "select distinct(OutletAsObject) from Catalog.Territory_Outlets";
    }
    else {
        query.Text = "select distinct(OutletAsObject) from Catalog.Territory_Outlets where OutletAsObject.Description.Contains(@p1)";
        query.AddParameter("p1", searchText);
    }

    return query.Execute();
}


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


function CreatePlannedVisitIfNotExists(planVisit, outlet, userId) {
    var query = new Query();
    query.AddParameter("Date", DateTime.Now.Date);
    query.AddParameter("Outlet", outlet.Id);
    query.Text = "select single(*) from Document.Visit where Date.Date == @Date && Outlet==@Outlet";

    var visit = query.Execute();
    if (visit == null) {
        visit = DB.Create("Document.Visit");
        visit.Plan = planVisit.Id;
        visit.Outlet = outlet.Id;
        visit.SR = userId;
        visit.Date = DateTime.Now;
        visit.StartTime = DateTime.Now;

        var status = new Query("select single(*) from Enum.VisitStatus where Description=='Processing'").Execute();
        visit.Status = status.Id;

        visit.Encashment = 0;
    }

    return visit;
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


function UpdateValueAndBack(entity, attribute, value, order) {
    entity[attribute] = value;

    Workflow.Back();

}


//------------------------------UnscheduledVisit--------------

function CreateUnschVisitIfNotExists(outlet, userId, visit) {

    if (visit == null) {
        visit = DB.Create("Document.Visit");
        visit.Outlet = outlet.Id;
        visit.SR = userId;
        visit.Date = DateTime.Now;
        visit.StartTime = DateTime.Now;
        visit.Lattitude = GPS.Latitude;
        visit.Longitude = GPS.Longitude;

        var status = new Query("select single(*) from Enum.VisitStatus where Description=='Processing'").Execute();
        visit.Status = status.Id;

        visit.Encashment = 0;
    }

    return visit;
}


//------------------------------Order func-------------------------

function GetOrderList(searchText) {

    var query = new Query();
    if (String.IsNullOrEmpty(searchText)) {
        query.Text = "select * from Document.Order orderbydesc Date";
    }
    else {
        query.AddParameter("text", searchText);
        query.Text = "select * from Document.Order where OutletAsObject.Description.Contains(@text) orderbydesc Date";
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
    query.Text = "select * from Document.Order_SKUs where Ref==@orderId";
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

function CreateOrderItemIfNotExist(orderId, sku, orderitem, unit, multiplier, discount, ismarkup) {

    if (orderitem == null) {

        var p = DB.Create("Document.Order_SKUs");
        p.Ref = orderId;
        p.SKU = sku.Id;
        p.Price = sku.Price;
        p.Total = sku.Price;
        p.Units = sku.BaseUnit;
        p.Discount = 0;

        return p;
    }
    else {
        if (discount != null && discount != "") {
            if (ismarkup == false) {
                if (discount > 0)
                    orderitem.Discount = -discount;
                else
                    orderitem.Discount = discount;
            }
            else {
                if (discount < 0)
                    orderitem.Discount = -discount;

                else
                    orderitem.Discount = discount;
            }
        }
        else
            orderitem.Discount = 0;

        orderitem.Total = (orderitem.Price * (orderitem.Discount / 100 + 1) * multiplier);
        if (unit != null)
            orderitem.Units = unit.Pack;

        return orderitem;
    }

}

function GetMultiplier(unit, sku, orderitem) {

    if (unit != null) {
        var query = new Query();
        query.AddParameter("units", unit.Pack);
        query.AddParameter("ref", sku.Id);
        query.Text = "select single(*) from Catalog.SKU_Packing where Ref==@ref && Pack==@units";
        var item = query.Execute();
        return item.Multiplier;
    }
    else
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

function CalculateValue(orderitem, multiplier) {


    return multiplier * orderitem.Qty;

}

function CalculatePrice(price, discount) {

    var total = (price * (discount / 100 + 1));
    return total

}

function GetUnits(skuId) {

    var units = new Query();
    units.AddParameter("skuId", skuId);
    units.Text = "select * from Catalog.SKU_Packing where Ref==@skuId";
    return units.Execute();

}

function UpdateAndRefresh(entity, attribute, value) {
    entity[attribute] = value;

}

function DeleteItemAndBack(orderitem) {
    DB.Current.Document.Order_SKUs.Delete(orderitem);
    Workflow.Back();
}


//----------------------------GetSKUs-------------------------


function GetSKUs(searchText, owner) {
    if (owner == null) {
        query = new Query();
        if (String.IsNullOrEmpty(searchText)) {
            query.Text = "select * from Catalog.SKU where Stock!=0";
        }
        else {
            query.Text = "select * from Catalog.SKU where Description.Contains(@p1) && Stock!=0";
            query.AddParameter("p1", searchText);
        }
    }
    else {
        query = new Query();
        query.AddParameter("owner", owner);
        if (String.IsNullOrEmpty(searchText)) {
            query.Text = "select * from Catalog.SKU where Owner==@owner  && Stock!=0";
        }
        else {
            query.Text = "select * from Catalog.SKU where Description.Contains(@p1) && Owner==@owner  && Stock!=0";
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



