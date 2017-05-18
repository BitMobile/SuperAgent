var count;
var SumMessage;
var order;
var thisDoc;
var doc;
var orderSumm;
var countSumm;
var fptr;
var TotalPay;
var TakeMoney;

function OnLoading() {

  if ($.workflow.currentDoc=="Order"){

    TotalPay = Translate["#TotalPay#"];
    TakeMoney = Translate["#TakeMoney#"];

  }
  else{

    TotalPay = Translate["#TotalPayReturn#"];
    TakeMoney = Translate["#TakeMoneyReturn#"];

  }

}

function OnLoad() {

  // var sum = GetOrderSUM();
  // Variables["control0"].Text = sum;



}

// -------------------- Sync Data ------------
function GoBackTo(){
    Workflow.Back();
}
function GoToLayLeft(){
  $.swipe_layout.Index = 0;
  $.LeftButton.CssClass = "mode_left_button_onPay";
  $.CenterButton.CssClass = "mode_center_button_offPay";
  $.RightButton.CssClass = "mode_right_button_offPay";
  $.LeftButton.Refresh();
  $.CenterButton.Refresh();
  $.RightButton.Refresh();
}
function GoToLayCenter(){
  $.swipe_layout.Index = 1;
  $.LeftButton.CssClass = "mode_left_button_offPay";
  $.CenterButton.CssClass = "mode_center_button_onPay";
  $.RightButton.CssClass = "mode_right_button_offPay";
  $.LeftButton.Refresh();
  $.CenterButton.Refresh();
  $.RightButton.Refresh();
}
function GoToLayRight(){
  $.swipe_layout.Index = 2;
  $.LeftButton.CssClass = "mode_left_button_offPay";
  $.CenterButton.CssClass = "mode_center_button_offPay";
  $.RightButton.CssClass = "mode_right_button_onPay";
  $.LeftButton.Refresh();
  $.CenterButton.Refresh();
  $.RightButton.Refresh();
}
function GetOrderDescription(){
  if ($.workflow.currentDoc=="Order")
    return Translate["#OrderDescript#"];
  else
    return Translate["#ReturnDescript#"];
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
		return "0";
  }
	else{
		return String.Format("{0:F2}", sum);
  }

}

function GetSUMPay() {

  // var allSum = ToFloat(GetOrderSUM());
  // var Sum = ToFloat(CountSum());
  var allSum = parseFloat(GetOrderSUM());
  var Sum = parseFloat(CountSum());

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
		return "0";
  }
	else{
		return String.Format("{0:F2}", sum);
  }
}

function GetSUMDeff() {

  // var allSum = ToFloat(GetOrderSUM());
  // var Sum = ToFloat(CountSum());
  var allSum = parseFloat(GetOrderSUM());
  var Sum = parseFloat(CountSum());
  var Mess;

  if (allSum < Sum) {
    Mess = String.Format("{0:F2}", (Sum - allSum));
  }
  else{
    Mess = "0";
  }

  return Mess;

}
function GetEmail(){
  var query = new Query("SELECT CatalogContact.Email "+
  " FROM Catalog_Outlet AS "+
  " CatalogOutlet " +
  " JOIN Document_" + doc + " AS DocumentOrder "+
  " ON CatalogOutlet.Id = DocumentOrder.Outlet " +
  " JOIN Catalog_Outlet_Contacts AS CatalogOutletContact "+
  " ON CatalogOutletContact.Ref = CatalogOutlet.Id "+
  " JOIN Catalog_ContactPersons AS CatalogContact "+
  " ON CatalogContact.Id =  CatalogOutletContact.ContactPerson"+
  " WHERE DocumentOrder.Id = @Ref");
  query.AddParameter("Ref", thisDoc);

  return query.ExecuteScalar();
}
function GetTel(){
  var query = new Query("SELECT CatalogContact.PhoneNumber "+
  " FROM Catalog_Outlet AS "+
  " CatalogOutlet " +
  " JOIN Document_" + doc + " AS DocumentOrder "+
  " ON CatalogOutlet.Id = DocumentOrder.Outlet " +
  " JOIN Catalog_Outlet_Contacts AS CatalogOutletContact "+
  " ON CatalogOutletContact.Ref = CatalogOutlet.Id "+
  " JOIN Catalog_ContactPersons AS CatalogContact "+
  " ON CatalogContact.Id =  CatalogOutletContact.ContactPerson"+
  " WHERE DocumentOrder.Id = @Ref");
  query.AddParameter("Ref", thisDoc);

  return query.ExecuteScalar();
}
function GetAddress() {

  var query = new Query("SELECT CatalogOutlet.Address FROM Catalog_Outlet AS CatalogOutlet " +
  "JOIN Document_" + doc + " AS DocumentOrder ON CatalogOutlet.Id = DocumentOrder.Outlet WHERE DocumentOrder.Id = @Ref");
	query.AddParameter("Ref", thisDoc);

  return query.ExecuteScalar();

}

function GetSale() {

  var sum = 0;

  var query = new Query("SELECT ((Qty*Total) - (Qty*Price)) AS Dif FROM Document_" + doc + "_SKUs WHERE Ref = @Ref");
	query.AddParameter("Ref", thisDoc);

  var result = query.Execute();
  while (result.Next()) {
    // sum = sum + ToFloat(result["Dif"]);
    sum = sum + parseFloat(result["Dif"]);
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

    chekObj.KKTNumber = Fiscal.GetFptrSerialNumber(fptr);
    chekObj.Save();

    return chekObj.KKTNumber;

  }
  else {
    return 0;
  }

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


function Sale() {

  // var allSum = ToFloat(GetOrderSUM());
  // var Sum = ToFloat(CountSum());
  var allSum = parseFloat(GetOrderSUM());
  var Sum = parseFloat(CountSum());
  var Mess;

  if (allSum < Sum)
    return true;
  else
    return false

}

//-------------------------Common part------------------------


//---------------Common functions-----------

function ToFloat(text) {
    if (String.IsNullOrEmpty(text))
        return parseFloat(0);
    return parseFloat(text);
}

function ToInteger(text) {
    return parseInt(text);
}

function ToString(val) {
	return val.ToString();
}

function ToDecimal(val) {
    val = TrimAll(val);
	if (String.IsNullOrEmpty(val))
		return Converter.ToDecimal(0);
	else
		return Converter.ToDecimal(val);
}

function GetSum(val1, val2) {

	if (val1 == null)
		val1 = parseFloat(0);
	if (val2 == null)
		val2 = parseFloat(0);

    return parseFloat(val1) + parseFloat(val2);
}

function GetDifference(val1, val2) {
    return val1 - val2;
}

function GetGreater(val1, val2) {
    var r = val1 - val2;
    if (r > 0) {
        return false;
    }
    else
        return true;
}

function CountCollection(collection) {
    return parseInt(collection.Count());
}

function AreEqual(val1, val2) {
    if (val1.ToString() == val2.ToString())
        return true;
    else
        return false;
}

function NotEqualInt(val1, val2) {
    if (parseInt(val1) == parseInt(val2))
        return false;
    else
        return true;
}

function GetMultiple(val1, val2) {
    return (val1 * val2)
}

function FormatValue(value) {
    return String.Format("{0:F2}", value || 0);
}

function ConvertToBoolean(val) {
    if (val == "true" || val == true)
        return true;
    else
        return false;
}

function ConvertToBoolean1(val1) {
    if (val1 > 0)
        return true;
    else
        return false;
}

function IsNullOrEmpty(val1) {
    return String.IsNullOrEmpty(val1);
}

function GetControlId(count) {
    return ("control" + count);
}

function IsInCollection(item, collection) {
    var res = false;
    for (var i in collection) {
        if (item.ToString() == i.ToString())
            res = true;
    }
    return res;
}


function DeleteFromCollection(item, collection) {
    var arr = [];
    for (var i in collection) {
        if (item.ToString() != collection[i].ToString())
            arr.push(collection[i]);
    }
    return arr;
}

function EmptyRef(ref) {
    return ref.EmptyRef();
}

function IsEmptyValue(value) {

	if (String.IsNullOrEmpty(value))
		return true;
	else{
		if (getType(value)=="System.String" || getType(value)=="System.DateTime" || getType(value)=="System.Boolean")
			return false;
		else{
			if (value.EmptyRef())
	            return true;
	        else
	            return false;
		}
	}
}

function NotEmptyRef(ref) {
    if (ref.EmptyRef())
        return false;
    else
        return true;
}

function GenerateGuid() {

    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}

function S4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
}

function IsNew(val1) {
	return val1.IsNew();
}

function GetObject(val){
	return val.GetObject();
}

function GetSharedImagePath(objectType, objectID, pictID, pictExt) {
	var r = "/shared/" + objectType + "/" + objectID.Id.ToString() + "/"
    + pictID + pictExt;
	return r;
}

function GetPrivateImagePath(objectType, objectID, pictID, pictExt) {
	var r = "/private/" + objectType + "/" + objectID.Id.ToString() + "/"
    + pictID + pictExt;
	return r;
}

function FocusOnEditText(editFieldName, isInputField) {
  if (isInputField != null) {
    if (isInputField == '1') {
      Variables[editFieldName].SetFocus();
    }
  }
}

function FormatOutput(value) {
	if (String.IsNullOrEmpty(value) || IsEmptyValue(value))
		return "-";
	else
		return value;
}

function RoundToIntFloor(val){
  var roundInt = Round(val,0);
  if (val > 0) {
      if (roundInt>val) {
        return roundInt - 1;
      }else {
        return roundInt;
      }
  }else {
    if (roundInt>=val) {
      return roundInt;
    }else {
      return roundInt + 1;
    }

  }
}

function RoundToInt(val){

    var string = val;
    var resultString = "";

    if (typeof string != "string")
        string = string.ToString();

    for (var i = 1; i <= StrLen(string); i++){  // it's all about ot clear source from incorrect chars
        var ch = Mid(string, i, 1);

        if (validate(ch, "([0-9.,-])*") && validate((resultString + ch), "(-)?([0-9])*[.,]?[0-9]?")){
            resultString += ch;
        }
        else
            break;
    }

    if (resultString == "")
        return null;
    else
        return Round(resultString, 0);
}

function CheckUserInput(sender){
    if (TrimAll(sender.Text) == '.' || TrimAll(sender.Text) == ',')
    {
        sender.Text = '0,';
    }
}

function TranslateString(val){
    return Translate["#" + val + "#"];
}

//--------------------Clear Button part----------------------

function ShowClearButton(source, button) {
	button.Visible = true;
}

function HideClearButton(source, button) {
	button.Visible = false;
}

function ClearField(source, field, objectRef, attribute) {
    field.Text = "";
	var object = objectRef.GetObject();
	object[attribute] = "";
	object.Save();
	source.Visible = false;
}

//-------------------------Dialogs----------------------------

function AssignDialogValue(state, args) {
	var entity = state[0];
	var attribute = state[1];
	entity[attribute] = args.Result;
	entity.GetObject().Save();
	return entity;
}

//--------------------------WorkWithGPS-----------------------

function ActualLocation(location){

    var actualTime;
    if (parseInt($.sessionConst.UserCoordinatesActualityTime)==parseInt(0)){
        actualTime = true;
    }
    else{
        var locTime = location.Time.ToLocalTime();
        var maxTime = DateTime.Now.AddMinutes(-parseInt($.sessionConst.UserCoordinatesActualityTime));
        actualTime = locTime > maxTime;
    }

    return (location.NotEmpty && actualTime);
}

function OpenFRSettings(){
  Workflow.Action("FR",[]);
}

function ScreenChek() {

    var chek = $.workflow.chek;
    var chekObj = chek.GetObject();
    var metod;

    if (doc == 'Order')
      metod = 1;
    else
      metod = 2;


    if (fptr != NULL){

      Fiscal.ClearError();
      Fiscal.OpenCheque(fptr, metod);

      var telMail = null;
      if ($.swipe_layout.Index == 0) {
        telMail = $.SMS.Text;
      }
      if ($.swipe_layout.Index == 1) {
        telMail = $.EMail.Text;
      }
      if (telMail != null) {
        Fiscal.SetEmailOrTelephoneNumber(fptr, telMail);
      }


      chekObj.FNNumber = Fiscal.GetNumberOfFiscalStorage(fptr);


      var query = new Query("SELECT Id, SKU, Price, Qty, Discount, Total, Units, Qty*Total AS Amount FROM Document_" + doc + "_SKUs WHERE (Ref = @Ref AND Total > 0 AND Qty > 0)");
  	  query.AddParameter("Ref", thisDoc);
      var result = query.Execute();
    //  var i = 0;
      while (result.Next()) {
      //  while (i < 600){
          Fiscal.RegistrationFz54(fptr, result["SKU"].Description, result["Price"], result["Qty"], result["Amount"], Fiscal.GetVATs(result["SKU"].VAT.Description));
      //    i = i + 1;
      //    Dialog.Message(i);
        }
      //  i = 0;



      var query = new Query("SELECT * FROM Document_Check_Payments WHERE Ref = @Ref");
      query.AddParameter("Ref", $.workflow.chek);
      var result = query.Execute();

      while (result.Next()) {
        if (result['Total'] >= 0)
        //  Fiscal.Payment(fptr, 5000000, ToFloat(result['Type'].PaymentCode));
          Fiscal.Payment(fptr, result['Total'], ToFloat(result['Type'].PaymentCode));
      }

      //chekObj.PrintDate = Fiscal.FptrDateTime(fptr);

      Fiscal.SetKashierName(fptr, order.SR.Description);

      Fiscal.CloseCheque(fptr, metod);

      chekObj.ShiftNumber = Fiscal.GetShiftNumber(fptr);
      chekObj.DocumentShiftNumber = Fiscal.GetShiftChequeNumber(fptr);
      chekObj.Address = GetAddress();
      chekObj.PrintDate = Fiscal.FptrDateTime(fptr);
      chekObj.SendType = telMail;

      //Dialog.Message(Fiscal.GetError() + "----------error");
      var Err = Fiscal.GetError();

      if (IsEmptyValue(Err)) {

        order.Cheque = $.workflow.chek;
        //Db.Delete(order);
        //DB.Delete(order.Id);
        //var dbRef = DB.CreateRef("Document.Order", Global.GenerateGuid());
        //order.Id = "@ref[Document_Order]:"+Global.GenerateGuid();
        //order.Visit = null;
        order.Visit = null;
        order.Save(false);
        chekObj.Save(false);

        var queryPay = new Query("SELECT * FROM Document_Check_Payments WHERE Ref = @Ref");
        queryPay.AddParameter("Ref", $.workflow.chek);
        var resultPay = query.Execute();
        SaveOutTran(resultPay);

        var querySKUCheck = new Query("SELECT * FROM Document_Check_SKUs WHERE Ref = @Ref");
        querySKUCheck.AddParameter("Ref", $.workflow.chek);
        var resultSKUCheck = query.Execute();
        SaveOutTran(resultSKUCheck);

        var queryOrdedSku = new Query("SELECT * FROM Document_" + doc + "_SKUs WHERE Ref = @Ref");
    	  queryOrdedSku.AddParameter("Ref", thisDoc);
        var resultOrdedSku = query.Execute();
        SaveOutTran(resultOrdedSku);
        var deleteTranStatus = new Query("Delete From ___TranStatus Where "+
        " TableName IN ('Document_Order','Document_Check', 'Document_Check_Payments',"+
        " 'Document_Check_SKUs', 'Document_Order_SKUs','Document_Return', 'Document_Return_SKUs')");
        deleteTranStatus.Execute();
        Workflow.Action("ChekEnd",[]);
      }
      else {
        Dialog.Message(Err);
        Fiscal.Annul(fptr);
      }



    }
    else {
      Dialog.Message(Translate["#NoFs#"])
    }

}
function SaveOutTran(result){
  while (result.Next()) {
    var obj = result['Id'].GetObject();
    obj.Save(false);
  }
}
