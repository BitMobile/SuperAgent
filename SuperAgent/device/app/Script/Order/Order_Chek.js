var count;
var SumMessage;
var order;
var thisDoc;
var doc;

function OnLoad() {

  // var sum = GetOrderSUM();
  // Variables["control0"].Text = sum;



}

// -------------------- Sync Data ------------
function GoBackTo(){
    Workflow.Back();
}

function GetPayments() {

	var q = new Query();

	q.Text = "SELECT DO.Id, DO.Description " +
	" FROM Catalog_PaymentsType AS DO ORDER BY DO.Code";
  count = q.ExecuteCount();
	return q.Execute();
}

function CountSum() {

  var query = new Query("SELECT SUM(Total) FROM Document_Check_Payments WHERE Ref = @Ref");
	query.AddParameter("Ref", $.workflow.chek);
	var sum = query.ExecuteScalar();
	if (sum == null)
		return 0;
	else
		return String.Format("{0:F2}", sum);

}

function GetSUMPay() {

  var allSum = ToFloat(GetOrderSUM());
  var Sum = ToFloat(CountSum());
  var Mess;

  if (allSum < Sum) {
    Mess = Translate["#PushPay#"] + " " + String.Format("{0:F2}", (Sum - allSum))+ " " + Translate["#currency#"];
  }
  else if (allSum > Sum) {
    Mess = Translate["#NeedPay#"] + " " + String.Format("{0:F2}", (allSum - Sum))+ " " + Translate["#currency#"];
  }
  else if (allSum == Sum) {
    Mess = Translate["#NoPay#"];
  }

  return Mess;
}

function GetOrderSUM() {

	if ($.workflow.currentDoc=="Order")
		doc = "Order";
	else
		doc = "Return";


	if ($.workflow.currentDoc == 'Order')
		thisDoc = $.workflow.order;
	else
		thisDoc = $.workflow.Return;

  order = thisDoc.GetObject();

	var query = new Query("SELECT SUM(Qty*Total) FROM Document_" + doc + "_SKUs WHERE Ref = @Ref");
	query.AddParameter("Ref", thisDoc);
	var sum = query.ExecuteScalar();
	if (sum == null)
		return 0;
	else
		return String.Format("{0:F2}", sum);
}

function ScreenChek() {

    

    Workflow.Action("ChekEnd",[]);

}

function GetOrderedSKUs() {

  var query = new Query("SELECT * FROM Document_" + doc + "_SKUs WHERE Ref = @Ref");
	query.AddParameter("Ref", thisDoc);

  return query.Execute();

}

function GetCheckPays() {

  var query = new Query("SELECT * FROM Document_Check_Payments WHERE Ref = @Ref");
	query.AddParameter("Ref", $.workflow.chek);

  return query.Execute();

}

function GetSUMDef() {

  var allSum = ToFloat(GetOrderSUM());
  var Sum = ToFloat(CountSum());
  var Mess;

  if (allSum < Sum) {
    Mess = String.Format("{0:F2}", (Sum - allSum));
  }

  return Mess;

}

function Sale() {

  var allSum = ToFloat(GetOrderSUM());
  var Sum = ToFloat(CountSum());
  var Mess;

  if (allSum < Sum)
    return true;
  else
    return false

}

function GetAddress() {

  var query = new Query("SELECT CatalogOutlet.Address FROM Catalog_Outlet AS CatalogOutlet " +
  "JOIN Document_Order AS DocumentOrder ON CatalogOutlet.Id = DocumentOrder.Outlet WHERE DocumentOrder.Id = @Ref");
	query.AddParameter("Ref", thisDoc);

  return query.ExecuteScalar();

}

function GetSale() {

  var sum = 0;

  var query = new Query("SELECT ((Qty*Total) - (Qty*Price)) AS Dif FROM Document_" + doc + "_SKUs WHERE Ref = @Ref");
	query.AddParameter("Ref", thisDoc);

  var result = query.Execute();
  while (result.Next()) {
    sum = sum + ToFloat(result["Dif"]);
  }

  return (sum * -1);

}
