var outlet;

function OnLoad() {
	outlet = $.param1;
}

function CreateContactIfNotExist(contact, outlet) {

	if (contact == null) {
		contact = DB.Create("Catalog.Outlet_Contacts");
		contact.Ref = outlet;
		contact.NotActual = false;
		contact.Save();
		return contact.Id;
	} else
		return contact;
}

function SaveAndBack(entity, validateOutlet) {
	if (ValidEntity(entity)) {
		entity.GetObject().Save();
		Workflow.Back();
	}
}

function HasContacts(outlet) {
	var q = new Query("SELECT COUNT(Id) FROM Catalog_Outlet_Contacts WHERE ref = @outlet")
	q.AddParameter("outlet", outlet);
	var contactsCount = q.ExecuteScalar();
	return contactsCount > 0;
}

function GetContacts(outlet) {
	var q = new Query("SELECT C.Id, C.ContactName, P.Description AS Position, PhoneNumber, Email FROM Catalog_Outlet_Contacts C LEFT JOIN Catalog_Positions P ON C.Position=P.Id WHERE C.Ref=@ref AND C.NotActual=0 ORDER BY C.ContactName");
	q.AddParameter("ref", outlet);
	return q.Execute();
}

function GetPlans(outlet, sr) {
	var q = new Query("SELECT Id, strftime('%Y-%m-%d %H:%M', PlanDate) AS PlanDate FROM Document_MobileAppPlanVisit WHERE Outlet=@outlet AND SR=@sr AND Transformed = 0");
	q.AddParameter("outlet", outlet);
	q.AddParameter("sr", $.common.UserRef);
	return q.Execute();
}

function CreatePlan(outlet, plan, planDate) {
	Dialogs.ChooseDateTime(plan, "PlanDate", null, PlanHandler); //(header, planDate, PlanHandler, [ outlet, plan ]);
}

function DeleteContact(ref) {
	var contact = ref.GetObject();
	contact.NotActual = true;
	contact.Save();
	DB.Commit();
	Workflow.Refresh([ $.outlet ]);
}

function SelectOwnership(control) {
	var q = new Query();
	// q.Text = "SELECT Id, Description FROM Enum_OwnershipType UNION SELECT @emptyRef, '—' ORDER BY Description desc";// UNION SELECT NULL, '—' ORDER BY Description";
	// q.AddParameter("emptyRef",  DB.EmptyRef("Enum_OwnershipType"));
	// var res = q.Execute().Unload();

	q.Text = "SELECT Id, Description FROM Enum_OwnershipType";
	var res = q.Execute().Unload();
	var arr = [];

	arr.push([DB.EmptyRef("Enum_OwnershipType"), "-"]);
	while (res.Next()) {
		arr.push([res.Id, Translate["#" + res.Description + "#"]]);
	}

	Dialogs.DoChoose(arr, $.outlet, "OwnershipType", control, OwnTypeCallBack, Translate["#ownership#"]);

}


// --------------------internal--------------

function EmptyContact(contact) {
	if (String.IsNullOrWhiteSpace(contact.ContactName) && String.IsNullOrEmpty(contact.PhoneNumber) && String.IsNullOrEmpty(contact.Email) && String.IsNullOrEmpty(contact.Position))
		return true;
	else
		return false;
}

function PlanHandler(state, args) {
	var plan = state[0];
	if (plan == null) {
		plan = DB.Create("Document.MobileAppPlanVisit");
		plan.SR = $.common.UserRef;
		plan.Outlet = outlet;
		plan.Transformed = false;
		plan.Date = DateTime.Now;
	} else
		plan = plan.GetObject();
	plan.PlanDate = args.Result;
	plan.Save();
	Workflow.Refresh([ outlet ]);
}

function SavePhoneAndCall(contact) {
	contact = contact.GetObject();
	DoCall(contact.PhoneNumber);
}

function DialogCallBack(control, key) {
	var v = null;
	if ($.Exists("param2"))
		v = $.param2;

	Workflow.Refresh([ $.contact, $.outlet ]);
}

function ValidEntity(entity) {

	// Validate Contact
	if (getType(entity.GetObject()) == "DefaultScope.Catalog.Outlet_Contacts") {
		if (EmptyContact(entity) && entity.IsNew()) {
			DB.Delete(entity);
			DB.Commit();
			return true;
		}
		if (Global.ValidatePhoneNr(entity.PhoneNumber) && Global.ValidateEmail(entity.Email) && ValidateContactName(entity))
			result = true;
		else
			result = false;
		return result;
	}

	// Validate Details
	if (getType(entity.GetObject()) == "DefaultScope.Catalog.Outlet")
		return ValidateOutlet(entity);
}

function ValidateContactName(entity) {
	if (String.IsNullOrWhiteSpace(entity.ContactName)) {
		Dialog.Message(String.Format("{0} {1}", Translate["#incorrect#"], Translate["#contactName#"]));
		return false;
	} else {
		return true;
	}
}

function ValidateOutlet(entity) {

	var emailValid = Global.ValidateEmail(entity.Email);
	var phoneNumValid = Global.ValidatePhoneNr(entity.PhoneNumber);
	var innValid = Global.ValidateField(entity.INN, "([0-9]{10}|[0-9]{12})?", Translate["#inn#"]);
	var kppValid = Global.ValidateField(entity.KPP, "([0-9]{9})?", Translate["#kpp#"]);

	if (emailValid && phoneNumValid && innValid && kppValid) {
		return true;
	}
	return false;
}

function OwnTypeCallBack(state, args){
	AssignDialogValue(state, args);
	var control = state[2];
	if (args.Result != DB.EmptyRef("Enum_OwnershipType"))
		control.Text = Translate["#" + args.Result.Description + "#"];
	else
		control.Text = "—";
}

function FormatDate(datetime) {
	return Format("{0:g}", Date(datetime));
}
