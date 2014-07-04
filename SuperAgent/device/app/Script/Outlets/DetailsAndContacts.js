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

// --------------------enternal--------------

function EmptyContact(contact) {
	if (String.IsNullOrEmpty(contact.ContactName) && String.IsNullOrEmpty(contact.PhoneNumber) && String.IsNullOrEmpty(contact.Email) && contact.Position.EmptyRef())
		return true;
	else
		return false;
}
