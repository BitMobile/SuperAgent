var count;
var SumMessage;
var chek;
var PayArray;
var doc;
var thisDoc;
var descriptionTitle;
var Title;

function OnLoading(){

  if ($.workflow.currentDoc=="Order"){
    descriptionTitle = Translate["#PaymentsType#"];
    Title = Translate["#Payments#"];
  }
  else{
    descriptionTitle = Translate["#PaymentsTypeReturn#"];
    Title = Translate["#PaymentsReturn#"];
  }

}

function OnLoad() {

  chek = $.workflow.HasValue("chek")==true ? $.workflow.chek : null;
  //Dialog.Message(Variables["common"].OS);
  if (chek == null) {
    var sum = GetOrderSUM();
    Variables["control0"].Text = sum;
  }
  else{
    var cashCount = count;
    var index = 0;


    while(index<cashCount){
      var payType = PayArray[index];
      var TotalQuery=new Query("SELECT Total FROM Document_Check_Payments WHERE Ref=@ref AND Type=@Type");
      TotalQuery.AddParameter("ref", chek);
      TotalQuery.AddParameter("Type", payType);

      Variables["control"+index].Text = TotalQuery.ExecuteScalar();
      index++;
    }

    GetSUMPay();

  }


}

function GetBackName() {

  if ($.workflow.currentDoc=="Order")
		return Translate["#order#"];
	else
		return Translate["#return#"];

}

// -------------------- Sync Data ------------
function GoBackTo(){

  if ($.workflow.chek != null){
    var dropSKU = new Query("SELECT Id FROM Document_Check_SKUs WHERE Ref=@ref");
    dropSKU.AddParameter("ref", chek);
    var resultSKU = dropSKU.Execute();
    while (resultSKU.Next()) {
      DB.Delete(resultSKU["Id"]);
    }

    var dropPay = new Query("SELECT Id FROM Document_Check_Payments WHERE Ref=@ref");
    dropPay.AddParameter("ref", chek);
    var resultPay = dropPay.Execute();
    while (resultPay.Next()) {
      DB.Delete(resultPay["Id"]);
    }

    //DB.Delete($.workflow.chek);
  }

  Workflow.BackTo($.workflow.currentDoc);
}

function GetPayments() {

	var q = new Query();

	q.Text = "SELECT DO.Id, DO.Description " +
	" FROM Catalog_PaymentsType AS DO ORDER BY DO.Code";
  count = q.ExecuteCount();

  PayArray = [];
  var result = q.Execute();
  while (result.Next()) {
    PayArray.push(result["Id"]);
  }

	return q.Execute();
}

function CountSum() {

  var cashCount = count;
  var index = 0;
  var sum = ToFloat("0");

  while(index<cashCount){
    sum = sum +ToFloat(Variables["control"+index].Text);
    index++;
  }

	return String.Format("{0:F2}", sum);

}

// if (CurrVal!=sender.Text) {
//   if (TrimAll(sender.Text)!="") {
//     sender.Text = ToFloat(sender.Text);
//   }else {
//     sender.Text = 0;
//   }
// }
// CurrVal = sender.Text;
function ChangeTextFloat(sender){
  if (sender.Text != NULL) {
    if (TrimAll(sender.Text)!="") {
      sender.Text = String.Format("{0:F2}",parseFloat(sender.Text));
    }
  }
}
function GetSUMPay() {

  var allSum = ToFloat(GetOrderSUM());
  var Sum = ToFloat(CountSum());

  if (allSum < Sum) {
    Variables["SumMes"].Text = Translate["#PushPay#"] + " " + String.Format("{0:F2}", (Sum - allSum))+ " " + Translate["#currency#"];
  }
  else if (allSum > Sum) {
    if ($.workflow.currentDoc=="Order")
      Variables["SumMes"].Text = Translate["#NeedPay#"] + " " + String.Format("{0:F2}", (allSum - Sum))+ " " + Translate["#currency#"];
    else
      Variables["SumMes"].Text = Translate["#NeedPayReturn#"] + " " + String.Format("{0:F2}", (allSum - Sum))+ " " + Translate["#currency#"];
  }
  else if (allSum == Sum) {
    Variables["SumMes"].Text = Translate["#NoPay#"];
  }

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

	var query = new Query("SELECT SUM(Qty*Total) FROM Document_" + doc + "_SKUs WHERE Ref = @Ref");
	query.AddParameter("Ref", thisDoc);
	var sum = query.ExecuteScalar();
	if (sum == null)
		return 0;
	else
		return String.Format("{0:F2}", sum);
}

function ScreenChek() {

  var allSum = ToFloat(GetOrderSUM());
  var Sum = ToFloat(CountSum());
  if (allSum < ToFloat(Variables["control1"].Text)) {
    if (doc=="Order") {
      Dialog.Message(Translate["#TooMuchMoney#"]);
    }else {
      Dialog.Message(Translate["#TooMuchMoneyReturn#"]);
    }
    return;
  }
  if (Sum < allSum) {
    Dialog.Message(Translate["#ChangeScreenPay#"]);
  }
  else {

    if ($.workflow.HasValue("chek")==true)
      chek = $.workflow.chek.GetObject();
    else
      chek = DB.Create("Document.Check");

    order = thisDoc.GetObject();

    chek.Date = DateTime.Now.ToString();
    chek.OwnerDocument = order.Id;
    chek.Type = true;
    chek.Outlet = order.Outlet;
    chek.User = order.SR;
    chek.Save();
    chek = chek.Id;


    var dropSKU = new Query("SELECT Id FROM Document_Check_SKUs WHERE Ref=@ref");
    dropSKU.AddParameter("ref", chek);
    var resultSKU = dropSKU.Execute();
    while (resultSKU.Next()) {
      DB.Delete(resultSKU["Id"]);
    }

    var dropPay = new Query("SELECT Id FROM Document_Check_Payments WHERE Ref=@ref");
    dropPay.AddParameter("ref", chek);
    var resultPay = dropPay.Execute();
    while (resultPay.Next()) {
      DB.Delete(resultPay["Id"]);
    }


    var cashCount = count;
    var index = 0;


    while(index<cashCount){
      if (ToFloat(Variables["control"+index].Text) != 0){
        var p = DB.Create("Document.Check_Payments");
        //Dialog.Message(Variables["control"+index].Id);
        p.Ref = chek;
        p.Type = PayArray[index];
        p.Total = ToFloat(Variables["control"+index].Text);
        var LineNumberQuery=new Query("SELECT Max(LineNumber) FROM Document_Check_Payments WHERE Ref=@ref");
        LineNumberQuery.AddParameter("ref", p.Ref);
        p.LineNumber=LineNumberQuery.ExecuteScalar() + 1;
        p.Save();
      }
      index++;
    }

    var SKUs = new Query("SELECT SKU, Feature, Qty, Price, Discount, Total, Amount, Units, LineNumber FROM Document_" + doc + "_SKUs WHERE (Ref = @Ref AND Qty > 0)");
    SKUs.AddParameter("Ref", thisDoc);
    var result = SKUs.Execute();
    while (result.Next()) {
      var p = DB.Create("Document.Check_SKUs");
      p.Ref = chek;
      p.SKU = result["SKU"];
      p.Feature = result["Feature"];
      p.Price = result["Price"];
      p.Qty = result["Qty"];
      p.Discount = result["Discount"];
      p.LineNumber=result["LineNumber"];
      p.Total = result["Total"];
      p.Amount = result["Amount"];
      p.Units = result["Units"];
      p.VAT = result["SKU"].VAT;
      p.Save();
    }

    $.workflow.Add("chek", chek);

    Workflow.Action("Chek",[]);
  }

}
