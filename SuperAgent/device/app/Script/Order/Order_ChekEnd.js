var count;
var SumMessage;
var order;
var thisDoc;
var doc;
var itemsQty;
var mainTitle;
var infoTitle;
var sumTitle;
var skuTitle;
var infoTitleSmall;
var back;
var orderSumm;
var countSumm;
var TotalPay;
var TakeMoney;
var PrintDate;
var ContactVal;
var PayDiscount;

function OnLoading() {

  if ($.workflow.currentDoc=="Order"){

    TotalPay = Translate["#TotalPay#"];
    TakeMoney = Translate["#TakeMoney#"];

  }
  else{

    TotalPay = Translate["#TotalPayReturn#"];
    TakeMoney = Translate["#TakeMoneyReturn#"];

  }

  //PrintDate = Date($.workflow.chek.PrintDate).ToString("d MMMM yyyy, H:mm");

}

function OnLoad() {

}

function OnStartAtServer() {

  if ($.workConst.HasCheque == true) {
    Variables["workflow"]["name"] = $.workConst.currentWorkFlow;
    Variables["workflow"]["currentDoc"] = $.workConst.currentWorkFlow;
    Variables["workflow"]["chek"] = $.workConst.Cheque;

    if ($.workConst.currentWorkFlow == 'Order')
      Variables["workflow"]["order"] = $.workConst.currentRef;
    else
      Variables["workflow"]["Return"] = $.workConst.currentRef;

  }
  PrintDate = $.workflow.chek.PrintDate.ToString("d MMMM yyyy, H:mm");
  ContactVal = $.workflow.chek.SendType;
  return true;

}

function GetBack(){

  var menuItem = GlobalWorkflow.GetMenuItem();
	newDoc = FindExecutedOrder();
	if (newDoc == null) {
	back = (menuItem == "Orders" || menuItem == "Returns" ? Translate["#clients#"] : Translate["#back#"]);
	}
	else {
		if ($.workflow.name == 'Return'){
			back = Translate["#returns#"];
		}
		if ($.workflow.name == 'Order'){
			back = Translate["#orders#"];
		}
	}
	if ($.workflow.name == 'Visit'){
		back = Translate["#back#"];
	}
  return back;
}

function GetOrderDescription(){
  if ($.workflow.currentDoc=="Order")
    return Translate["#OrderDescript#"];
  else
    return Translate["#ReturnDescript#"];
}

function GetPaidName(){
  if ($.workflow.currentDoc=="Order")
    return Translate["#PaidOrder#"];
  else
    return Translate["#PaidReturn#"];
}

function GetMainTitle(){
  if ($.workflow.currentDoc=='Order'){
		mainTitle = Translate["#order#"];
	}
	else{
		mainTitle = Translate["#return#"];
	}

  return mainTitle;
}

// -------------------- Sync Data ------------
function GoBackTo(){
    Workflow.Back();
}

function FindExecutedOrder(){
	if ($.Exists('executedOrder')) //this dirty hack is used in Events.js (OnApplicationRestore, OnWorkflowStart) too, think twice before edit here
		return $.executedOrder;
	else
		return null;
}

function OrderBack() {

	if ($.workflow.name == "Order" || $.workflow.name == "Return")
		Workflow.Rollback();

	else {
		ClearFilters();

		var stepNumber;
		if ($.workflow.currentDoc=="Order")
        stepNumber = '4';
		else
      stepNumber = '5';


		var q = new Query("SELECT NextStep FROM USR_WorkflowSteps WHERE StepOrder<@stepNumber AND Value=0 ORDER BY StepOrder DESC");
		q.AddParameter("stepNumber", stepNumber);
		var step = q.ExecuteScalar();
		if (step==null) {
			Workflow.BackTo("Outlet");
		}
		else
			Workflow.BackTo(step);
	}
}

function ClearFilters() {
	var checkDropF = new Query("SELECT count(*) FROM sqlite_master WHERE type='table' AND name='USR_Filters'");
	var checkDropFResult = checkDropF.ExecuteScalar();

	if (checkDropFResult == 1) {
		var dropF = new Query("DELETE FROM USR_Filters");
		dropF.Execute();
	}
}

function CheckIfEmptyAndForward(wfName) {
	var empty = parseInt(itemsQty) == parseInt(0);
  $.workflow.Remove("chek");
	if (wfName=="Visit"){
		if (empty){ //clearing parameters and delete order
			DB.Delete(order);
			var query = new Query("SELECT * FROM Document_" + $.workflow.currentDoc + "_Parameters WHERE Ref = @order")
			query.AddParameter("order", order);
			queryResult = query.Execute();
			while (queryResult.Next()) {
				DB.Delete(queryResult.Id);
			}

			if ($.workflow.currentDoc=="Order")
				$.workflow.Remove("order");
			if ($.workflow.currentDoc=="Return")
				$.workflow.Remove("Return");
		}
		else{
			var location = GPS.CurrentLocation;
			if (ActualLocation(location)) {
				var orderObj = thisDoc.GetObject();
				orderObj.Lattitude = location.Latitude;
				orderObj.Longitude = location.Longitude;
				orderObj.Save();
			}
		}
    if ($.workflow.currentDoc == "Return") {
      Workflow.Action("SkipReturn",[]);
    }else {
      Workflow.Forward([]);
    }
	}

	else if (wfName=="Order" || wfName=="Return")
	{
		if (empty){
			DB.Delete(order);
			var query = new Query("SELECT * FROM Document_" + $.workflow.currentDoc + "_Parameters WHERE Ref = @order")
			query.AddParameter("order", order);
			queryResult = query.Execute();
			while (queryResult.Next()) {
				DB.Delete(queryResult.Id);
			}
		}

		Workflow.Commit();
	}
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


  // Dialog.Message($.workConst.currentWorkFlow);
  // Dialog.Message($.workflow.order);
  // Dialog.Message($.workflow.currentDoc);
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

    Workflow.Action("ChekEnd",[]);

}

function GetOrderedSKUs() {

  var query = new Query("SELECT Id, SKU, Feature, Qty, Discount, Total, Units, ROUND(Qty*Total, 2) AS Amount FROM Document_" + doc + "_SKUs WHERE Ref = @Ref");
	query.AddParameter("Ref", thisDoc);
  itemsQty = query.ExecuteCount();
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

  if (sum > 0) {
    PayDiscount = Translate["#PayAnDiscount#"];
    return String.Format("{0:F2}",sum);
  }
  else {
    PayDiscount = Translate["#PayDiscount#"];
    return String.Format("{0:F2}",(sum * -1));
  }

}

function GetVatTranslate(vat) {
  return Translate["#" + vat + "#"];
}

function GetChequeDate() {
  fptr = $.workConst.fptr;

  if (fptr != NULL){

    return Fiscal.GetFptrSerialNumber(fptr);

  }
  else {
    return null;
  }

}

function GetFSNumber() {

    var chek = $.workflow.chek;
    return chek.KKTNumber;

}
