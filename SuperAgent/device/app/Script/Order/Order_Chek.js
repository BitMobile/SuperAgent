var count;
var SumMessage;
var order;
var thisDoc;
var doc;
var orderSumm;
var countSumm;
var fptr;

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
	if (sum == null){
    countSumm = 0;
		return 0;
  }
	else{
    countSumm = String.Format("{0:F2}", sum);
		return String.Format("{0:F2}", sum);
  }

}

function GetSUMPay() {

  var allSum = ToFloat(orderSumm);
  var Sum = ToFloat(countSumm);
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
	if (sum == null){
    orderSumm = 0;
		return 0;
  }
	else{
    orderSumm = String.Format("{0:F2}", sum);
		return String.Format("{0:F2}", sum);
  }
}

function ScreenChek() {


    if (fptr != NULL){


      Fiscal.OpenCheque(fptr, 1);

      Fiscal.SetEmailOrTelephoneNumber(fptr, "+79215776130");

      var query = new Query("SELECT Id, SKU, Price, Qty, Discount, Total, Units, Qty*Total AS Amount FROM Document_" + doc + "_SKUs WHERE Ref = @Ref");
  	   query.AddParameter("Ref", thisDoc);
      var result = query.Execute();

      while (result.Next()) {
        Fiscal.RegistrationFz54(fptr, result["SKU"].Description, result["Price"], result["Qty"], result["Amount"], Fiscal.GetVATs(result["SKU"].VAT.Description));
      }

      var query = new Query("SELECT * FROM Document_Check_Payments WHERE Ref = @Ref");
      query.AddParameter("Ref", $.workflow.chek);
      var result = query.Execute();

      while (result.Next()) {
        if (result['Total'] >= 0)
          Fiscal.Payment(fptr, result['Total'], ToFloat(result['Type'].PaymentCode));
      }



      Fiscal.SetKashierName(fptr, order.SR.Description);

      Fiscal.CloseCheque(fptr, 1);



      //Dialog.Message(Fiscal.GetError() + "----------error");
      var Err = Fiscal.GetError();

      if (IsEmptyValue(Err)) {

        order.Cheque = $.workflow.chek;
        order.Save();

        Workflow.Action("ChekEnd",[]);
      }
      else {
        Dialog.Message(Err);
        fptr.CancelCheck();
      }



    }
    else {
      Dialog.Message(Translate["#NoFs#"])
    }

}

function GetOrderedSKUs() {

  var query = new Query("SELECT Id, SKU, Feature, Qty, Discount, Total, Units, ROUND(Qty*Total, 2) AS Amount FROM Document_" + doc + "_SKUs WHERE Ref = @Ref");
	query.AddParameter("Ref", thisDoc);

  return query.Execute();

}

function GetCheckPays() {

  var query = new Query("SELECT * FROM Document_Check_Payments WHERE Ref = @Ref");
	query.AddParameter("Ref", $.workflow.chek);

  return query.Execute();

}

function GetSUMDef() {

  var allSum = ToFloat(orderSumm);
  var Sum = ToFloat(countSumm);
  var Mess;

  if (allSum < Sum) {
    Mess = String.Format("{0:F2}", (Sum - allSum));
  }

  return Mess;

}

function Sale() {

  var allSum = ToFloat(orderSumm);
  var Sum = ToFloat(countSumm);
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

function GetVatTranslate(vat) {
  return Translate["#" + vat + "#"];
}

function GetFSNumber() {
  fptr = $.workConst.fptr;

  if (fptr != NULL){

    var chek = $.workflow.chek;
    var chekObj = chek.GetObject();

    chekObj.KKTNumber = Fiscal.GetNumberOfFiscalStorage(fptr);
    chekObj.Save();

    return chekObj.KKTNumber;

  }
  else {
    return 0;
  }

}
