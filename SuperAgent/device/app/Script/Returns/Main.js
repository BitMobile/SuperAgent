var title;


function OnLoading(){
	title = Translate["#returns#"];
}

function GetItems() {

	var q = new Query("SELECT DO.Id, DO.Outlet, strftime('%d/%m/%Y', DO.Date) AS Date, DO.Number, CO.Description AS OutletDescription, DO.Status FROM Document_Order DO JOIN Catalog_Outlet CO ON DO.Outlet=CO.Id ORDER BY DO.Date DESC LIMIT 100");
	return q.Execute();
}

function AssignNumberIfNotExist(number) {

	if (number == null)
		var number = Translate["#noNumber#"];

	return number;

}