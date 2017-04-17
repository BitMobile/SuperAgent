var count;
var SumMessage;

function OnLoad() {

  var sum = GetOrderSUM();
  Variables["control0"].Text = sum;

}

// -------------------- Sync Data ------------
function GoBackTo(){
    Workflow.BackTo($.workflow.currentDoc);
}

function GetPayments() {

	var q = new Query();

	q.Text = "SELECT DO.Id, DO.Description " +
	" FROM Catalog_PaymentsType AS DO ORDER BY DO.Code";
  count = q.ExecuteCount();
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

function GetSUMPay() {

  var allSum = ToFloat(GetOrderSUM());
  var Sum = ToFloat(CountSum());


  if (allSum < Sum) {
    Variables["SumMes"].Text = Translate["#PushPay#"] + " " + String.Format("{0:F2}", (Sum - allSum))+ " " + Translate["#currency#"];
  }
  else if (allSum > Sum) {
    Variables["SumMes"].Text = Translate["#NeedPay#"] + " " + String.Format("{0:F2}", (allSum - Sum))+ " " + Translate["#currency#"];
  }
  else if (allSum == Sum) {
    Variables["SumMes"].Text = Translate["#NoPay#"];
  }

}

function GetOrderSUM() {

	var doc;
	if ($.workflow.currentDoc=="Order")
		doc = "Order";
	else
		doc = "Return";

	var thisDoc;
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
