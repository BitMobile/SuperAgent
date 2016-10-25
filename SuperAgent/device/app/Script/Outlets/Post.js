var outlet;
var contact;
var contactRef;
var sear;
var linkcont;

function OnLoading(){

	var qw = new Query("SELECT COUNT(Id) FROM Catalog_ContactPersons WHERE Id = @outlet")
	qw.AddParameter("outlet", $.param1);

	contactRef = $.param1;
	var contactsCount1 = qw.ExecuteScalar();
	if(contactsCount1>0) {
	linkcont = $.param1;
	Console.WriteLine("true one");
	contact = true;
	}else{
		contact = false;
		sear=contactRef;
		Console.WriteLine("false one");
}

}

function OnLoad(){

$.edtSearch.Text=sear;

}


function BackCon(){
		sear="";
		Workflow.Back();
}

function SaveAndBack(entity, owner, contactг) {

		 	var en = linkcont.GetObject();
		 	en.Position = owner;
		 	en.Save(true);
			sear="";
			GlobalWorkflow.SetOwn(owner);
			Workflow.Back();

}

function HasContacts(outlet){

	hasOutletContacts = HasOutletContacts();

	return hasOutletContacts;
}


function HasOutletContacts() {

if(contact == true) {
	Console.WriteLine("true");
	var q = new Query("SELECT COUNT(Id) FROM Catalog_ContacntDolzh ")
	Console.WriteLine("true!");
}else{
	var q = new Query("SELECT COUNT(Id) FROM Catalog_ContacntDolzh WHERE Description Like @outlet")
	q.AddParameter("outlet", "%"+contactRef+"%");
	Console.WriteLine("false!");
		Console.WriteLine(contactRef);
}

	var contactsCount = q.ExecuteScalar();
	return contactsCount>0;

}


function GetOutletContacts(outlet) {

if(contact == true) {
	var q = new Query("Select Id,Description From Catalog_ContacntDolzh  Order By Description Limit 100");

}else{

	var q = new Query("Select Id,Description From Catalog_ContacntDolzh WHERE Description Like @outlet Order By Description Limit 100");
	q.AddParameter("outlet", "%"+contactRef+"%");

}

		return q.Execute();
}
