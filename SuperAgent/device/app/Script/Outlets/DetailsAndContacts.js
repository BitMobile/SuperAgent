function CreateContactIfNotExist(contact, outlet) {

	if (contact == null) {
		contact = DB.Create("Catalog.Outlet_Contacts");
		contact.Ref = outlet;
		contact.Save();
		return contact.Id;
	} else
		return contact;
}

function SaveAndBack(entity) {
	if (getType(entity.GetObject()) == "DefaultScope.Catalog.Outlet_Contacts" && EmptyContact(entity) && entity.IsNew())
		DB.Delete(entity);
	else
		entity.GetObject().Save();
	Workflow.Back();
}

function GetString(ref) {
	if (ref.EmptyRef())
		return Translate["#select_answer#"];
	else
		return ref.Description;
}

function GetContacts(outlet) {
	var q = new Query("SELECT C.Id, C.ContactName, P.Description AS Position, PhoneNumber, Email FROM Catalog_Outlet_Contacts C LEFT JOIN Catalog_Positions P ON C.Position=P.Id WHERE C.Ref=@ref");
	q.AddParameter("ref", outlet);
	return q.Execute();
}

function GetPlans(outlet, sr) {
	var q = new Query("SELECT Id, PlanDate FROM Catalog_MAVisitPlan_PlanVisits WHERE Outlet=@outlet AND SR=@sr");
	q.AddParameter("outlet", outlet);
	q.AddParameter("sr", $.common.UserRef);
	return q.Execute();
}

function CreatePlan(outlet) {
	Dialog.ShowDateTime("select", DateTime.Now, PlanHandler, outlet);
}

// --------------------internal--------------

function EmptyContact(contact) {
	if (String.IsNullOrEmpty(contact.ContactName) && String.IsNullOrEmpty(contact.PhoneNumber) && String.IsNullOrEmpty(contact.Email) && contact.Position.EmptyRef())
		return true;
	else
		return false;
}

function PlanHandler(date, outlet) {
	var q1 = new Query("SELECT Id FROM Catalog_MAVisitPlan");
	var ref = q1.ExecuteScalar();

	var newVistPlan = DB.Create("Catalog.MAVisitPlan_PlanVisits");
	newVistPlan.Ref = ref;
	newVistPlan.SR = $.common.UserRef;
	newVistPlan.PlanDate = date;
	newVistPlan.Outlet = outlet;
	newVistPlan.Save();
	
	Workflow.Refresh([outlet]);
}
