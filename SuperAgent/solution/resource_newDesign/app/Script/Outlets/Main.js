function GetOutlets(searchText) {
    if (String.IsNullOrEmpty(searchText)) {
        //var query = new Query();
        //query.Text = "SELECT Id, Address, Description, ConfirmationStatus FROM Catalog_Outlet ORDER BY Description LIMIT 100";
        var query = new Query("SELECT O.Id, T.Outlet, O.Description, O.Address FROM Catalog_Territory_Outlets T JOIN Catalog_Outlet O ON O.Id=T.Outlet ORDER BY O.Description LIMIT 500");
        return query.Execute();
    }
    else {
        //var query = new Query();
        searchText = "'%" + searchText + "%'";
        //query.Text = "SELECT Id, Address, Description, ConfirmationStatus FROM Catalog_Outlet WHERE Description LIKE " + searchText + " ORDER BY Description LIMIT 100";
        var query = new Query("SELECT O.Id, T.Outlet, O.Description, O.Address FROM Catalog_Territory_Outlets T JOIN Catalog_Outlet O ON O.Id=T.Outlet WHERE O.Description LIKE " + searchText + " ORDER BY O.Description LIMIT 500");
        return query.Execute();
    }
}

function AddGlobalAndAction(name, value, actionName) {
    if (Variables.Exists(name))
        $.Remove(name);
    $.AddGlobal(name, value);
    Workflow.Action(actionName, []);
}

function CreateOutletAndForward() {
    var p = DB.Create("Catalog.Outlet");
    p.Lattitude = 0;
    p.Longitude = 0;

    var parameters = [p];
    Workflow.Action("Create", parameters);
}

function GetOutletParameters(outlet) {
    var query = new Query();
    query.Text = "SELECT P.Id, P.Description, P.DataType, DT.Description AS TypeDescription, OP.Id AS ParameterValue, OP.Value FROM Catalog_OutletParameter P JOIN Enum_DataType DT ON DT.Id=P.DataType LEFT JOIN Catalog_Outlet_Parameters OP ON OP.Parameter = P.Id AND OP.Ref = @outlet";
    query.AddParameter("outlet", outlet);
    return query.Execute();
}

function GetOutletParameterValue(outlet, parameter, parameterValue) {

    if (parameterValue == null) {
        return CreateOutletParameterValue(outlet, parameter);
    }

    else return parameterValue;
}

function CreateOutletParameterValue(outlet, parameter) {
    var d = DB.Create("Catalog.Outlet_Parameters");
    d.Ref = outlet;
    d.Parameter = parameter;
    d.Value = "";
    d.Save();
    return d.Id;
}

function GoToParameterAction(typeDescription, parameterValue, value, outlet, parameter, control) {
    if (typeDescription == "ValueList") {
        var q = new Query();
        q.Text = "SELECT Value, Value FROM Catalog_OutletParameter_ValueList WHERE Ref=@ref";
        q.AddParameter("ref", parameter);
        Global.ValueListSelect(parameterValue, "Value", q.Execute(), Variables[control]);
    }
    if (typeDescription == "DateTime") {
        if (IsNullOrEmpty(parameterValue.Value))
            var date = DateTime.Now;
        else
            var date = DateTime.Parse(parameterValue.Value);
        Global.DateTimeDialog(parameterValue, "Value", date, Variables[control]);
    }
    if (typeDescription == "Boolean") {
        Global.BooleanDialogSelect(parameterValue, "Value", Variables[control]);
    }

}


function GetLookupList(entity, attribute) {
    var tableName = entity[attribute].Metadata().TableName;
    var query = new Query();
    query.Text = "SELECT Id, Description FROM " + tableName;
    return query.Execute();
}

function UpdateValueAndBack(entity, attribute, value) {
    if (attribute != "Answer" && attribute != "Value") {  //for Visit_Questions
        entity[attribute] = value;
        entity = UpdateEntity(entity); //set status 'New' for Outelt
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

function UpdateEntity(entity) {
    if (entity.TableName == "Catalog_Outlet") {
        entity.ConfirmationStatus = DB.Current.Constant.OutletConfirmationStatus.New;
    }
    return entity;
}

function CheckNotNullAndCommit(outlet) {
    if (CheckEmptyOutletFields(outlet)) {
        outlet.GetObject().Save();
        Workflow.Forward([]);
    }
}

function CheckEmptyOutletFields(outlet) {
    var correctDescr = CheckIfEmpty(outlet, "Description", "", "", false);
    var correctAddr = CheckIfEmpty(outlet, "Address", "", "", false);
    if (correctDescr && correctAddr) {
        return true;
    }

    Dialog.Message("#couldnt_be_cleaned#");
    return false;
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

function UpdateOtletStatus() {
    Variables["outlet"].ConfirmationStatus = DB.Current.Constant.OutletConfirmationStatus.New;
}

function CreateOutlet() {
    var outlet = DB.Create("Catalog.Outlet");
    outlet.Save();
    return outlet.Id;
}


//--------------------------case Visits----------------------


function GetQuesttionaires(outlet) {

    var q1 = new Query("SELECT Id FROM Document_Questionnaire WHERE OutletType=@type AND OutletClass=@class AND Scale=@scale ORDER BY Date desc");
    q1.AddParameter("type", outlet.Type);
    q1.AddParameter("class", outlet.Class);
    q1.AddParameter("scale", DB.Current.Constant.QuestionnaireScale.Region);

    var q2 = new Query("SELECT Id FROM Document_Questionnaire WHERE OutletType=@type AND OutletClass=@class AND Scale=@scale ORDER BY Date desc");
    q2.AddParameter("type", outlet.Type);
    q2.AddParameter("class", outlet.Class);
    q2.AddParameter("scale", DB.Current.Constant.QuestionnaireScale.Territory);

    var quest_collection = [];
    if (q1.ExecuteScalar() != null)
        quest_collection.push(q1.ExecuteScalar());
    if (q2.ExecuteScalar() != null)
        quest_collection.push(q2.ExecuteScalar());

    return quest_collection;

}

function CreateVisitIfNotExists(outlet, userRef, visit, planVisit) {

    if (visit == null) {
        visit = DB.Create("Document.Visit");
        if (planVisit != null)
            visit.Plan = planVisit;
        visit.Outlet = outlet;
        visit.SR = userRef;
        visit.Date = DateTime.Now;
        visit.StartTime = DateTime.Now;
        var location = GPS.CurrentLocation;
        if (location.NotEmpty) {
            visit.Lattitude = location.Latitude;
            visit.Longitude = location.Longitude;
        }
        visit.Status = DB.Current.Constant.VisitStatus.Processing;

        visit.Encashment = 0;
        visit.Save();
        return visit.Id;
    }


    return visit;
}


//-----------------------------------Coodinates--------------------------------

function SetLocation(outlet) {
    Dialog.Question("#setCoordinates#", LocationDialogHandler, outlet);
    function DiscardOutlet(outlet) {
        DB.Delete(outlet);
        DoBack();
    }
}

function LocationDialogHandler(answ, outlet) {
    if (answ == DialogResult.Yes) {
        var location = GPS.CurrentLocation;
        if (location.NotEmpty) {
            outlet = outlet.GetObject();
            outlet.Lattitude = location.Latitude;
            outlet.Longitude = location.Longitude;
            Dialog.Message("#coordinatesAreSet#");
            //var outlet = $.outlet;
            UpdateEntity(outlet);
            outlet.Save();
            Variables["outletCoord"].Text = (outlet.Lattitude + ", " + outlet.Longitude);
        }
        else
            NoLocationHandler(LocationDialogHandler);
    }
}

function NoLocationHandler(descriptor) {
    Dialog.Question("#locationSetFailed#", descriptor);
}


//--------------------------- Outlets ---------------------------

function DiscardNewOutlet(outlet) {
    DB.Delete(outlet);
    DoBack();
}

function SaveNewOutlet(outlet) {

    if ($.outletName.Text.Trim() != ""
        && $.outletAddress.Text.Trim() != ""
        && $.outletClass.Text.Trim() != ""
        && $.outletType.Text.Trim() != ""
        && $.outletDistr.Text.Trim() != "") {
        var q = new Query("SELECT Id FROM Catalog_Territory WHERE SR = @userRef LIMIT 1");
        q.AddParameter("userRef", $.common.UserRef);
        var territory = q.ExecuteScalar();

        var to = DB.Create("Catalog.Territory_Outlets");
        to.Ref = territory;
        to.Outlet = outlet;
        to.Save();

        outlet.GetObject().Save();
        Variables.AddGlobal("outlet", outlet);

        DoAction("Open");
    }
    else {
        Dialog.Message("#messageNulls#");
    }
}


function Back(outlet) {
    if (CheckEmptyOutletFields(outlet)) {
        outlet.GetObject().Save();

        Variables.Remove("outlet");
        DoAction("List");
    }
}

function DeleteAndBack(visit) {
    DB.Delete(visit);
    Workflow.Back();
}