
function RequestOutlets(){
	var q = new Query("SELECT P.Id, P.Description, P.DataType, DT.Description AS TypeDescription, OP.Id AS ParameterValue, OP.Value FROM Catalog_OutletParameter P JOIN Enum_DataType DT ON DT.Id=P.DataType LEFT JOIN Catalog_Outlet_Parameters OP ON OP.Parameter = P.Id AND OP.Ref = @outlet");
	q.Execute();
}

function RequestSKUs(){
	var q = new Query("var query = new Query();
        query.Text = "SELECT S.Id, S.Description, PL.Price, S.CommonStock, G.Description AS GroupDescription, G.Id AS GroupId, G.Parent AS GroupParent, CB.Description AS Brand FROM Catalog_SKU S JOIN Catalog_SKUGroup G ON G.Id = S.Owner JOIN Document_PriceList_Prices PL ON PL.SKU = S.Id JOIN Catalog_Brands CB ON CB.Id=S.Brand"; 
        q.Execute();
}

function RequestOrderList() {

	var q = new Query("SELECT DO.Id, DO.Outlet, DO.Date AS Date, DO.Number, CO.Description AS OutletDescription, DO.Status FROM Document_Order DO JOIN Catalog_Outlet CO ON DO.Outlet=CO.Id");
	return q.Execute();
}