var outlet;
var title;
var hasPartnerContacts;
var hasOutletContacts;
var newContact;

function OnLoading(){
	title = Translate["#contractors#"];
}

function OnLoad() 
{
	outlet = $.param1;
	if ($.Exists("contactOwner")) 
	{
		var isEditableContact = IsEditableContact($.contactOwner);
		if ($.owner.Text == "—" || !isEditableContact)
		{
			SetEnabledToContactScope(false);
		}
	} 	
}


//----------------------Contacts-------------------

function AddEnabled(){
	if ($.sessionConst.outletContactEditable || $.sessionConst.partnerContactEditable)
		return true;
	else
		return false;
}

function CreateContactIfNotExist(contact, owner) {

	if (contact == null) {
		newContact = true;
		contact = DB.Create("Catalog.ContactPersons");
		contact.Save();
		return contact.Id;
	} else{
		newContact = false;
		contact.LoadObject();
		return contact;
	}
}

function IsEditableContact(owner){	
	var ownerObj = owner == null ? null : owner.GetObject();
	if (getType(ownerObj)=="DefaultScope.Catalog.Outlet_Contacts"){
		return $.sessionConst.outletContactEditable;
	}
	else if (getType(ownerObj)=="DefaultScope.Catalog.Distributor_Contacts"){
		return $.sessionConst.partnerContactEditable;
	}
	else{
		return false;
	}
}

function GetOwnerType(owner)
{	
	var ownerObj = owner == null ? null : owner.GetObject();
	if (ownerObj.Ref==DB.EmptyRef("Catalog_Outlet_Contacts") 
		|| ownerObj.Ref==DB.EmptyRef("Catalog_Distributor_Contacts")
		|| ownerObj == null)
	{
		if (newContact 
			&& $.outlet.Distributor!=DB.EmptyRef("Catalog_Distributor_Contacts"))
		{
			if ($.sessionConst.outletContactEditable 
				&& $.sessionConst.partnerContactEditable)
			{
				return "—";
			}				
			else if ($.sessionConst.outletContactEditable)				
			{
				return Translate["#outlet#"];
			}
			else if ($.sessionConst.partnerContactEditable)
			{
				return Translate["#partner#"];
			}
		}
		else if(newContact 
			&& $.outlet.Distributor==DB.EmptyRef("Catalog_Distributor_Contacts"))
		{
			return Translate["#outlet#"];
		}
	}
	else if (getType(ownerObj)=="DefaultScope.Catalog.Outlet_Contacts") 
	{
		return Translate["#outlet#"];
	}
	else if (getType(ownerObj)=="DefaultScope.Catalog.Distributor_Contacts")
	{
		return Translate["#partner#"];
	}
}

function SelectOwner(owner)
{
	if ($.sessionConst.outletContactEditable && $.sessionConst.partnerContactEditable 
		&& $.outlet.Distributor != DB.EmptyRef("Catalog_Distributor_Contacts"))
	{
		Dialog.Choose(Translate["#owner#"], [[0, Translate["#partner#"]], [1, Translate["#outlet#"]]], OwnerCallBack);
	}	
}

function OwnerCallBack(state, args){	
	if ($.owner.Text == "—")
	{
		SetEnabledToContactScope(true);
	}
	$.owner.Text = args.Value;
}

function SetEnabledToContactScope(value){
	$.contact_name.Enabled = value;
	$.position.Enabled = value;
	$.phone_number.Enabled = value;
	$.email.Enabled = value;
}

function SaveAndBack(entity, owner) {	

	if (ValidEntity(entity) && ValidOwner()) {
		EditOwner(entity, owner);
		entity.GetObject().Save();
		Workflow.Back();
	}
}

function ValidOwner(){
	if ($.owner.Text == "—"){
		Dialog.Message(Translate["#emptyContactOwner#"]);
		return false;
	}
	else
		return true;
}

function EditOwner(contact, owner){

	var ownerObj = owner == null ? null : owner.GetObject();
	var ownerType = GetOwnerType(owner);
	var ownerInput = $.owner.Text;

	if (ownerType == ownerInput){
		ownerObj.Save();
	}
	else{
		DB.Delete(owner);
		var newOwner;		
		
		if (ownerInput==Translate["#partner#"]){
			newOwner = DB.Create("Catalog.Distributor_Contacts");
			Dialog.Debug($.outlet.Distributor);
			newOwner.Ref = $.outlet.Distributor;			
		}
		else{
			newOwner = DB.Create("Catalog.Outlet_Contacts");
			newOwner.Ref = $.outlet;
		}

		newOwner.NotActual = false;
		newOwner.ContactPerson = contact;	
		newOwner.Save();	
	}

}

function HasContacts(outlet){
	hasOutletContacts = HasOutletContacts(outlet);
	hasPartnerContacts = HasPartnerContacts(outlet);
	return hasOutletContacts || hasPartnerContacts;
}

function HasOutletContacts(outlet) {
	var q = new Query("SELECT COUNT(Id) FROM Catalog_Outlet_Contacts WHERE ref = @outlet AND NotActual=0")
	q.AddParameter("outlet", outlet);
	var contactsCount = q.ExecuteScalar();
	return contactsCount > 0;
}

function GetOutletContacts(outlet) {
	var q = new Query("SELECT P.Id, P.Description AS ContactName, C.Id AS OutletContact, C.Ref AS Owner " +
		" FROM Catalog_Outlet_Contacts C " +
		" LEFT JOIN Catalog_ContactPersons P ON C.ContactPerson = P.Id " +
		" WHERE C.Ref=@outlet AND C.NotActual=0 ORDER BY P.Description");
	q.AddParameter("outlet", outlet);
	return q.Execute();
}

function HasPartnerContacts(outlet){
	var outletObj = outlet.GetObject();
	var q = new Query("SELECT COUNT(Id) " +
		" FROM Catalog_Distributor_Contacts C " +		
		" WHERE C.Ref=@distr AND C.NotActual=0 ");
	q.AddParameter("distr", outletObj.Distributor);
	var c = q.ExecuteScalar();
	return c > 0;
}

function GetPartnerContacts(outlet){
	var outletObj = outlet.GetObject();
	var q = new Query("SELECT P.Id, P.Description AS ContactName, C.Id AS PartnerContact, C.Ref AS Owner " +
		" FROM Catalog_Distributor_Contacts C " +
		" JOIN Catalog_ContactPersons P ON C.ContactPerson = P.Id " +
		" WHERE C.Ref=@distr AND C.NotActual=0 ORDER BY P.Description ");
	q.AddParameter("distr", outletObj.Distributor);
	return q.Execute();
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


//----------------------Planning--------------


function GetPlans(outlet, sr) {
	var q = new Query("SELECT Id, strftime('%Y-%m-%d %H:%M', PlanDate) AS PlanDate FROM Document_MobileAppPlanVisit WHERE Outlet=@outlet AND SR=@sr AND Transformed = 0");
	q.AddParameter("outlet", outlet);
	q.AddParameter("sr", $.common.UserRef);
	return q.Execute();
}

function CreatePlan(outlet, plan, planDate) {
	Dialogs.ChooseDateTime(plan, "PlanDate", null, PlanHandler); //(header, planDate, PlanHandler, [ outlet, plan ]);
}


//---------------------Contractors--------------

function GetOutlets(searchText){
	var search = "";
	if (String.IsNullOrEmpty(searchText)==false) { //search processing
		searchText = StrReplace(searchText, "'", "''");
		search = " AND Contains(C.Description, '" + searchText + "') ";
	}

	var outletObj = $.outlet.GetObject();
	if (outletObj.Distributor==DB.EmptyRef("Catalog_Distributor")){
		var q = new Query("SELECT C.Id, C.Description, C.LegalAddress AS Address, '3' AS OutletStatus " +
			"FROM Catalog_Outlet_Contractors O " +
			"JOIN Catalog_Contractors C ON O.Contractor=C.Id " +
			"WHERE O.Ref=@outlet " + search + "ORDER BY C.Description");
		q.AddParameter("outlet", $.outlet);
		var result = q.Execute();
	}
	else{
		var q = new Query("SELECT  C.Id, C.Description, C.LegalAddress AS Address, '3' AS OutletStatus " +
			"FROM Catalog_Distributor_Contractors D " +
			"JOIN Catalog_Contractors C ON D.Contractor=C.Id " +
			"WHERE Ref=@distr " + search + "ORDER BY C.Description");
		q.AddParameter("distr", outletObj.Distributor);
		var result = q.Execute();
	}
	
	return result;
}

function BackMenu(){
	return true;
}

function CreateOutletEnabled(){	
	return false;
}

function AddGlobalAndAction(name, contractor, actionName){
	DoAction(actionName, contractor);
}

// --------------------internal-----------------

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

function GetPhoneAndCall(contact) {
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
	if (getType(entity.GetObject()) == "DefaultScope.Catalog.ContactPersons") {
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
