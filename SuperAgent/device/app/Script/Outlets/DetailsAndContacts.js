function SaveAndBack(entity) {
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
	var q = new Query("SELECT C.Id, C.ContactName, P.Description AS Position, PhoneNumber, Email FROM Catalog_Outlet_Contacts C JOIN Catalog_Positions P ON C.Position=P.Id WHERE C.Ref=@ref");
	q.AddParameter("ref", outlet);
	return q.Execute();
}
