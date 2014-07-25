function CreateContactIfNotExist(contact, outlet) {

	if (contact == null) {
		contact = DB.Create("Catalog.Outlet_Contacts");
		contact.Ref = outlet;
		contact.Save();
		return contact.Id;
	} else
		return contact;
}

function SaveAndBack(entity, validateOutlet) {

	if (ValidateOutlet(entity, validateOutlet)) {
		if (getType(entity.GetObject()) == "DefaultScope.Catalog.Outlet_Contacts" && EmptyContact(entity) && entity.IsNew()) {
			DB.Delete(entity);
			DB.Commit();
		} else
			entity.GetObject().Save();
		Workflow.Back();
	}

}

function ValidateOutlet(outlet, validateOutlet){
	
	if (ConvertToBoolean()==false)
		return true;
	
	var emailValid = Global.ValidateEmail(entity.Email);
	var phoneNumValid = Global.ValidatePhoneNr(entity.PhoneNumber);
	var innValid = Global.ValidateField(entity.INN, "([0-9]{10}|[0-9]{12})?", Translate["#inn#"]);
	var kppValid = Global.ValidateField(entity.KPP, "([0-9]{9})?", Translate["#kpp#"]);
	
	if (emailValid && phoneNumValid && innValid && kppValid) {
		return true;
	}
	return false;
}

function GetString(ref) {
	if (ref.EmptyRef())
		return Translate["#select_answer#"];
	else
		return ref.Description;
}

function GetContacts(outlet) {
	var q = new Query("SELECT C.Id, C.ContactName, P.Description AS Position, PhoneNumber, Email FROM Catalog_Outlet_Contacts C LEFT JOIN Catalog_Positions P ON C.Position=P.Id WHERE C.Ref=@ref ORDER BY C.ContactName");
	q.AddParameter("ref", outlet);
	return q.Execute();
}

function GetPlans(outlet, sr) {
	var q = new Query("SELECT Id, PlanDate FROM Document_MobileAppPlanVisit WHERE Outlet=@outlet AND SR=@sr");
	q.AddParameter("outlet", outlet);
	q.AddParameter("sr", $.common.UserRef);
	return q.Execute();
}

function CreatePlan(outlet, plan, planDate) {
	if (String.IsNullOrEmpty(planDate))
		planDate = DateTime.Now;
	var header = Translate["#enterDateTime#"];
	Dialog.ShowDateTime(header, planDate, PlanHandler, [ outlet, plan ]);
}

function DeleteContact(ref) {
	DB.Delete(ref);
	DB.Commit();
	Workflow.Refresh([ $.outlet ]);
}

// --------------------internal--------------

function EmptyContact(contact) {
	if (String.IsNullOrEmpty(contact.ContactName) && String.IsNullOrEmpty(contact.PhoneNumber) && String.IsNullOrEmpty(contact.Email) && contact.Position.EmptyRef())
		return true;
	else
		return false;
}

function PlanHandler(date, arr) {
	var outlet = arr[0];
	var plan = arr[1];
	if (plan == null) {
		plan = DB.Create("Document.MobileAppPlanVisit");
		plan.SR = $.common.UserRef;
		plan.Outlet = outlet;
		plan.Transformed = false;
		plan.Date = DateTime.Now;
	}
	else
		plan = plan.GetObject();
	plan.PlanDate = date;
	plan.Save();
	Workflow.Refresh([ outlet ]);
}
