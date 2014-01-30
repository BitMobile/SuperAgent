/*  Получить номера  заказов из 1С

Запуск бат 
var wsh = new ActiveXObject("WScript.Shell");
wsh.Run(new ActiveXObject("Scripting.FileSystemObject").GetAbsolutePathName("")+"/Schedule.bat");
*/

function Search (path, text) {
	var result1= Device.SetFocus(path);
	
	var result2 = Device.SetText(path, text);
	
	textp=path+".Text";
	var result3= Device.GetValue(textp);

	var result4 = Device.Click("btnSearch");

	if (result3==text) { 	result3 = "True";
	}
	else{ 
		result3 = "False";
	}
	
	if (result1 == result2 && result1 ==result3  && result1== result4 && result1 == "True")
	{
		result="True";
	}
	else {
		result=result1+"; "+result2+"; "+result3+ "; " + result4;
	}
	return result;
}	


function CheckScreen(screen) {

	var result = Device.GetValue("context.CurrentScreen.Name");
	Console.Terminate(result != screen, "  Экран"+ screen +  "не открывается!");

	return result;
}

function getRandomArbitary(min, max){
	return Math.random() * (max - min) + min;
}

function CheckValue(path,text){
	var result= Device.GetValue(path);
	if (result==text){
		result="True";
	}
	else{
		result="False";
	}
	return result;
}

function TextCheck (path, text) {
	var result1= Device.SetFocus(path);
	
	var result2 = Device.SetText(path, text);
	
	
	textp=path+".Text";
	
	var result3= Device.GetValue(textp);
	
	if (result3==text) { 	result3 = "True";
	}
	else{ 
		result3 = "False";
	}
	result=result1+"; "+result2+"; "+result3;
	return result;
}	

function main() {

Console.CommandPause = 500;
	/*-----------------ADDING NEW ORDER-------------------------*/
	
	Console.WriteLine("Adding new order");
	var result=Device.Click("btnOrder");
	Console.WriteLine(result);
	
	var result = Device.Click("NewOrder");
	Console.WriteLine(result);
	
	Console.WriteLine(CheckScreen("Outlets.xml"));
	
 Console.WriteLine(Search("edtSearch", "new"));	
  Stopwatch.Start();
	Console.WriteLine(result);
	
	var result=Device.GetValue("grScrollView.Controls[0].Controls[1].Controls[0].Text");
		Console.WriteLine(result);
	
	if (result=="New iOS outlet"){
		Console.WriteLine(CheckValue("grScrollView.Controls[0].Controls[1].Controls[0].Text", "New iOS outlet")); // проверка отображения названия т.т.
		}
	else{
		
		Console.WriteLine(CheckValue("grScrollView.Controls[0].Controls[0].Controls[0].Text", "New iOS outlet")); // проверка отображения названия т.т.
		
	}
	
	
	var result = Device.Click("grScrollView.Controls[0]");
	Console.WriteLine(result);
	
	Console.WriteLine(CheckScreen("Order.xml"));
	
	var outlet=Device.GetValue("grScrollView.Controls[0].Controls[0].Controls[0].Text");
	if (outlet=="Error: Index has to be between upper and lower bound of the array.") {
	
	var outlet=Device.GetValue("grScrollView.Controls[0].Controls[1].Controls[0].Text");
	Console.WriteLine("Заказ для "+ outlet);
	}
	else{
		Console.WriteLine("Заказ для "+ outlet);
	}
	
		
	/* Took outlet descr from workflow in future*/
	
		
	Console.WriteLine(CheckValue("grScrollView.Controls[0].Controls[0].Controls[0].Text", "Не выбран"));
	
	var result=Device.Click("grScrollView.Controls[0]"); // Price-list
	Console.WriteLine(result+"Price-list");
	
	Console.WriteLine(CheckScreen("ListChoice.xml"));
	
	var priceList=Device.GetValue("grScrollView.Controls[2].Controls[0].Controls[0].Text");
	var result=Device.Click("grScrollView.Controls[0]"); // Choose Price-list
	Console.WriteLine(result+"Choose Price-list");
	
	Console.Pause(1000);
	
	Console.WriteLine(CheckScreen("Order.xml"));
	
	Console.WriteLine(CheckValue("grScrollView.Controls[0].Controls[0].Controls[0].Text", priceList)+ "  Отображение названия выбранного прайс-листа");
	
	Console.WriteLine(CheckValue("Orderadd.Controls[0].Controls[0].Text", "0,00"));
	

	
	var result = Device.Click("Orderadd");
	Stopwatch.Start();
	Console.WriteLine(result);
	
	
	var result = CheckScreen("Order_SKUs.xml");
	if (result=="Order_SKUs.xml") {
		var result = Stopwatch.Stop();
		Console.WriteLine(result.TotalSeconds+"  OrderSKUs loading time");
	}
	else{
		Console.WriteLine(result);
	}
		
	/*ORDER WITHOUT DISCOUNT and First feature*/
	
	Console.WriteLine(Search("edtSearch", "гв 10"));	
		Stopwatch.Start();
	Console.WriteLine(result);
	
	var result = CheckValue("grScrollView.Controls[2].Controls[0].Controls[0].Text", "Гвоздь 10ка");
	if (result=="True") {
		var result = Stopwatch.Stop();
		Console.WriteLine(result.TotalSeconds+"  SKU search loading time");
	}
	else{
		Console.WriteLine(result);
	}
	
	var result=Device.Click("grScrollView.Controls[2]"); // Add SKU to Order
	Console.WriteLine(result);

	var result = CheckScreen("Order_EditSKU.xml");
	if (result=="Order_EditSKU.xml") {
		var result = Stopwatch.Stop();
		Console.WriteLine(result.TotalSeconds+"  Order_EditSKU loading time");
	}
	else{
		Console.WriteLine(result);
	}
		
	/*var sku=Device.GetValue("workflow[orderitem].Description");
	Console.WriteLine(sku);*/
	
	/*Check descriptions*/
		
	Console.WriteLine(Device.GetValue("grScrollView.Controls[0].Controls[0].Controls[0].Text"));
	Console.WriteLine(CheckValue("grScrollView.Controls[0].Controls[0].Controls[0].Text", "Гвоздь 10ка")+ "  Check SKU description");
	
	Console.WriteLine(CheckValue("grScrollView.Controls[0].Controls[0].Controls[1].Text", "Пересчитать цену")+ "  Check descriptions RecountPrice");
	Console.WriteLine(CheckValue("grScrollView.Controls[2].Controls[0].Controls[1].Text", "Цена")+ "  Check descriptions Price");
	
	Console.WriteLine(CheckValue("grScrollView.Controls[2].Controls[1].Controls[0].Text", "0")+ "   Quantity value is 0");
	Console.WriteLine(CheckValue("grScrollView.Controls[2].Controls[1].Controls[1].Text", "Количество")+ "  Check descriptions Quantity");
	Console.WriteLine(CheckValue("grScrollView.Controls[2].Controls[2].Controls[0].Text", "шт.") + "  Units шт");
	Console.WriteLine(CheckValue("grScrollView.Controls[2].Controls[2].Controls[1].Text", "Ед. упаковки") + "  Check descriptions Units");
	
	Console.WriteLine(CheckValue("grScrollView.Controls[4].Controls[0].Controls[0].Checked", "False") + "  Discount/MarkUp value is false");
	Console.WriteLine(CheckValue("grScrollView.Controls[4].Controls[0].Controls[1].Text", "Скидка/Наценка") + "  Check descriptions Discount/MarkUp");
	Console.WriteLine(CheckValue("grScrollView.Controls[4].Controls[1].Controls[0].Text", "0") +"Discount Value is 0");
	Console.WriteLine(CheckValue("grScrollView.Controls[4].Controls[1].Controls[1].Text", "Скидка") +"  Check descriptions Discount");
	
	Console.WriteLine(CheckValue("grScrollView.Controls[6].Controls[0].Controls[0].Text", "Характеристики")+ " Check descriptions \" Характеристики\"");
	
	Console.WriteLine(CheckValue("grScrollView.Controls[8].Controls[0].Controls[0].Text", "Default feature")+ "Default feature");
	
	Console.WriteLine(CheckValue("grScrollView.Controls[10].Controls[0].Controls[0].Text", "синий, металл")+ "Синий металл");
	Console.WriteLine(Device.Click("grScrollView.Controls[10]"));// Choose first feature
	
	Console.WriteLine(Device.GetValue("grScrollView.Controls[0].Controls[0].Controls[0].Text"));
	Console.WriteLine(CheckValue("grScrollView.Controls[0].Controls[0].Controls[0].Text", "Гвоздь 10ка, синий, металл")+ "  Check SKU description and feature");
	Console.WriteLine(CheckValue("grScrollView.Controls[12].Controls[0].Controls[0].Text", "Красный, шоколад")+ "Красный. шоколад");

	var price = Device.GetValue("grScrollView.Controls[2].Controls[0].Controls[0].Text");
	if (price != "0,00"  || price != "") {
		result="True";
	}
	else {
		result="False";
	}
	Console.WriteLine(result);
	
	var quantity="23";
	Console.WriteLine(TextCheck("grScrollView.Controls[2].Controls[1].Controls[0]", quantity));
	
	
	var result = Device.Click("btnForward");
	Console.WriteLine(result);	
	
	
	Console.WriteLine(CheckScreen("Order.xml"));
		Console.WriteLine(Device.GetValue("grScrollView.Controls[2].Controls[0].Controls[0].Text")+"1");
	Console.WriteLine(CheckValue("grScrollView.Controls[2].Controls[0].Controls[0].Text", "Гвоздь 10ка, синий, металл")+ "  Check SKU description and feature in order");
	
	/*var amount=price*quantity;*/
	
	
	/*var result=CheckValue("grScrollView.Controls[2].Controls[0].Controls[1].Text", "Количество:"+quantity+ "Итого:"+ amount);
	Console.WriteLine(result);	*/
	
	/*ORDER WITH DISCOUNT and second feature */
	
	
	var result=Device.Click("Orderadd");
	Console.WriteLine(result);
	
	Console.WriteLine(Search("edtSearch", "гв 10"));	
	
	var result=Device.Click("grScrollView.Controls[2]"); // Add SKU to Order
	Console.WriteLine(result);
	
	/*Console.WriteLine(CheckScreen("Features.xml"));
	
	var feature=Device.GetValue("grScrollView.Controls[0].Controls[0].Controls[0].Text");
	
	var result=Device.Click("grScrollView.Controls[4]"); // Choose feature
	Console.WriteLine(result);*/
	
	Console.WriteLine(CheckScreen("Order_EditSKU.xml"));
	Console.WriteLine(Device.GetValue("grScrollView.Controls[0].Controls[0].Controls[0].Text")+"2");
	Console.WriteLine(CheckValue("grScrollView.Controls[0].Controls[0].Controls[0].Text", "Гвоздь 10ка")+ "  Check SKU description ");
	
	var result=Device.Click("grScrollView.Controls[12]"); // Choose feature
	Console.WriteLine(result);
	
	var price = Device.GetValue("grScrollView.Controls[2].Controls[0].Controls[0].Text");
	if (price != "0,00"  || price != "") {
		result="True";
	}
	else {
		result="False";
	}

	var quantity="5";
	TextCheck("grScrollView.Controls[2].Controls[1].Controls[0]", quantity);
	if (result !="True; True; True") {
		Console.WriteLine(result+"Количество не вводится");
	}
	else {
		result="True";
		Console.WriteLine(result);
	}
	
	var discount="30.65";
	TextCheck("grScrollView.Controls[4].Controls[1].Controls[0]", discount);
	if (result !="True; True; True") {
		Console.WriteLine(result+ "Скидка не вводится");
	}
	else {
		result="True";
		Console.WriteLine(result);
	}
	
	var result = Device.Click("grScrollView.Controls[0].Controls[0]");
	Console.WriteLine(result);	
	
	Console.WriteLine(CheckValue("grScrollView.Controls[4].Controls[1].Controls[1].Text", "Скидка") +"  Check descriptions Disc");
	
	price= price*((-discount/100)+1);
	Console.WriteLine(price);
	
	Console.WriteLine(Device.GetValue("grScrollView.Controls[2].Controls[0].Controls[0].Text"));
	Console.WriteLine(CheckValue("grScrollView.Controls[2].Controls[0].Controls[0].Text", price)+ "   Check price");
	Console.WriteLine(Device.GetValue("grScrollView.Controls[0].Controls[0].Controls[0].Text")+"3");
	Console.WriteLine(CheckValue("grScrollView.Controls[0].Controls[0].Controls[0].Text", "Гвоздь 10ка, Красный, шоколад")+ "  Check SKU description and feature");
	
	Console.WriteLine(CheckValue("grScrollView.Controls[0].Controls[0].Controls[1].Text", "Пересчитать цену")+ "  Check descriptions RecountPrice");
	Console.WriteLine(CheckValue("grScrollView.Controls[2].Controls[0].Controls[1].Text", "Цена")+ "  Check descriptions Price");
	
	Console.WriteLine(CheckValue("grScrollView.Controls[2].Controls[1].Controls[0].Text", quantity)+ "   Quantity value is 0");
	Console.WriteLine(CheckValue("grScrollView.Controls[2].Controls[1].Controls[1].Text", "Количество")+ "  Check descriptions Quantity");
	Console.WriteLine(CheckValue("grScrollView.Controls[2].Controls[2].Controls[0].Text", "шт.") + "  Units шт");
	Console.WriteLine(CheckValue("grScrollView.Controls[2].Controls[2].Controls[1].Text", "Ед. упаковки") + "  Check descriptions Units");
	
	Console.WriteLine(CheckValue("grScrollView.Controls[4].Controls[0].Controls[0].Checked", "False") + "  Discount/MarkUp value is false");
	Console.WriteLine(CheckValue("grScrollView.Controls[4].Controls[0].Controls[1].Text", "Скидка/Наценка") + "  Check descriptions Discount/MarkUp");
	Console.WriteLine(CheckValue("grScrollView.Controls[4].Controls[1].Controls[0].Text", "-30,65") +"Discount Value is 0");
	Console.WriteLine(CheckValue("grScrollView.Controls[4].Controls[1].Controls[1].Text", "Скидка") +"  Check descriptions Discount");
	
	Console.WriteLine(CheckValue("grScrollView.Controls[6].Controls[0].Controls[0].Text", "Характеристики")+ " Check descriptions \" Характеристики\"");
	
	Console.WriteLine(CheckValue("grScrollView.Controls[8].Controls[0].Controls[0].Text", "Default feature")+ "Default feature");
	
	Console.WriteLine(CheckValue("grScrollView.Controls[10].Controls[0].Controls[0].Text", "синий, металл")+ "Синий металл");
	
	Console.WriteLine(CheckValue("grScrollView.Controls[12].Controls[0].Controls[0].Text", "Красный, шоколад")+ "Красный. шоколад");	
	

	var amount=price*quantity;
	/*amount=amount.toFixed(2);*/
	Console.WriteLine(amount);
	
	var result = Device.Click("btnForward");
	Console.WriteLine(result);	
	
	Console.WriteLine(CheckScreen("Order.xml"));
		Console.WriteLine(Device.GetValue("grScrollView.Controls[0].Controls[0].Controls[0].Text")+"Price-list");
	Console.WriteLine(Device.GetValue("grScrollView.Controls[4].Controls[0].Controls[0].Text")+"4");
	Console.WriteLine(CheckValue("grScrollView.Controls[4].Controls[0].Controls[0].Text", "Гвоздь 10ка, Красный, шоколад")+ "  Check SKU description and feature in order");
	
	
	/*ORDER WITH MarkUP and */
	
	var result = Device.Click("Orderadd");
	Stopwatch.Start();
	Console.WriteLine(result);
	
	var result = CheckScreen("Order_SKUs.xml");
	if (result=="Order_SKUs.xml") {
		var result = Stopwatch.Stop();
		Console.WriteLine(result.TotalSeconds);
	}
	else{
		Console.WriteLine(result);
	}
	
	Console.WriteLine(Search("edtSearch", "тюль жел"));	
	
	var result=Device.Click("grScrollView.Controls[2]"); // Add SKU to Order
	Console.WriteLine(result);
	
	
	Console.WriteLine(CheckScreen("Order_EditSKU.xml"));
		Console.WriteLine(Device.GetValue("grScrollView.Controls[0].Controls[0].Controls[0].Text")+"5");
	Console.WriteLine(CheckValue("grScrollView.Controls[0].Controls[0].Controls[0].Text", "Тюльпан желтый, Красный")+  "Check SKU description");
	
	
	var price = Device.GetValue("grScrollView.Controls[2].Controls[0].Controls[0].Text");
	if (price != "0,00"  || price != "") {
		result="True";
	}
	else {
		result="False";
	}

	var quantity="5";
	TextCheck("grScrollView.Controls[2].Controls[1].Controls[0]", quantity);
	if (result !="True; True; True") {
		Console.WriteLine(result+"Количество не вводится");
	}
	else {
		result="True";
		Console.WriteLine(result);
	}
	
	Device.Click("grScrollView.Controls[4].Controls[0].Controls[0]");
	
	var markup="30";
	TextCheck("grScrollView.Controls[4].Controls[1].Controls[0]", markup);
	if (result !="True; True; True") {
		Console.WriteLine(result+ "Наценка не вводится");
	}
	else {
		result="True";
		Console.WriteLine(result);
	}
	
	var result = Device.Click("grScrollView.Controls[0].Controls[0]"); //Пересчитать заказ
	Console.WriteLine(result);	
	
	Console.WriteLine(CheckValue("grScrollView.Controls[4].Controls[1].Controls[1].Text", "Наценка") +"  Check descriptions Markup");
	
	
	price= price*((markup/100)+1);
	Console.WriteLine(price);
	
	Console.WriteLine(CheckValue("grScrollView.Controls[2].Controls[0].Controls[0].Text", price)+ "  Check Price");
	
	var amount=price*quantity;
	/*amount=amount.toFixed(2);*/
	Console.WriteLine(amount);
	
	var result = Device.Click("grScrollView.Controls[0].Controls[0]");
	Console.WriteLine(result);	
		Console.WriteLine(Device.GetValue("grScrollView.Controls[0].Controls[0].Controls[0].Text")+"6");
	Console.WriteLine(CheckValue("grScrollView.Controls[0].Controls[0].Controls[0].Text", "Тюльпан желтый, Красный")+ "  Check SKU description and feature");
	
	Console.WriteLine(CheckValue("grScrollView.Controls[0].Controls[0].Controls[1].Text", "Пересчитать цену")+ "  Check descriptions RecountPrice");
	Console.WriteLine(CheckValue("grScrollView.Controls[2].Controls[0].Controls[1].Text", "Цена")+ "  Check descriptions Price");
	
	Console.WriteLine(CheckValue("grScrollView.Controls[2].Controls[1].Controls[0].Text", quantity)+ "   Quantity value is 0");
	Console.WriteLine(CheckValue("grScrollView.Controls[2].Controls[1].Controls[1].Text", "Количество")+ "  Check descriptions Quantity");
	Console.WriteLine(CheckValue("grScrollView.Controls[2].Controls[2].Controls[0].Text", "шт.") + "  Units шт");
	Console.WriteLine(CheckValue("grScrollView.Controls[2].Controls[2].Controls[1].Text", "Ед. упаковки") + "  Check descriptions Units");
	
	Console.WriteLine(CheckValue("grScrollView.Controls[4].Controls[0].Controls[0].Checked", "True") + "  Discount/MarkUp value is True");
	Console.WriteLine(CheckValue("grScrollView.Controls[4].Controls[0].Controls[1].Text", "Скидка/Наценка") + "  Check descriptions Discount/MarkUp");
	Console.WriteLine(CheckValue("grScrollView.Controls[4].Controls[1].Controls[0].Text", markup) +"Markup Value is " + markup);
	Console.WriteLine(CheckValue("grScrollView.Controls[4].Controls[1].Controls[1].Text", "Наценка") +"  Check descriptions Markup");
	
	Console.WriteLine(CheckValue("grScrollView.Controls[6].Controls[0].Controls[0].Text", "Характеристики")+ " Check descriptions \" Характеристики\"");
	
	Console.WriteLine(CheckValue("grScrollView.Controls[8].Controls[0].Controls[0].Text", "Красный")+ "Красный");	
	
	var result = Device.Click("btnForward");
	Console.WriteLine(result);	
	
	Console.WriteLine(CheckScreen("Order.xml"));
		Console.WriteLine(Device.GetValue("grScrollView.Controls[0].Controls[0].Controls[0].Text"));
		Console.WriteLine(Device.GetValue("grScrollView.Controls[6].Controls[0].Controls[0].Text")+"7");
	Console.WriteLine(CheckValue("grScrollView.Controls[6].Controls[0].Controls[0].Text", "Тюльпан желтый, Красный")+ "Check SKU description and feature in order");
	
		Console.WriteLine(Device.GetValue("grScrollView.Controls[6].Controls[0].Controls[1].Text")+"456");
	var result=CheckValue("grScrollView.Controls[6].Controls[0].Controls[1].Text", "Количество: 5   Итого: 357,50");
	Console.WriteLine(result);	
	
	var result = Device.Click("btnForward");
	Console.WriteLine(result);	
	
	Console.WriteLine(CheckScreen("Order_Commentary.xml"));
	
	Console.WriteLine(TextCheck("grScrollView.Controls[0].Controls[0].Controls[2]", "Комментарий к заказу  "));	
	
	var result = Device.Click("btnForward");
	Console.WriteLine(result);	
	
	Console.WriteLine(CheckScreen("Main.xml"));
	
	/*-----------NEW ORDER---------------*/
	
	
	var result = Device.Click("btnOrder");
	Console.WriteLine(result+"New orders Check");
	
	Console.WriteLine(CheckScreen("OrderList.xml"));
	
	Device.TakeScreenshot("NewOrdersList");
	Console.WriteLine(Device.GetValue("grScrollView.Controls[0].Controls[0].Controls[0].Text")+"8");
	Console.WriteLine(CheckValue("grScrollView.Controls[0].Controls[0].Controls[0].Text","New iOS outlet")+ "Проверка названия т.т. в новом заказе");	
	
	/*var er=Device.GetValue("grScrollView.Controls[0].Controls[0].Controls[1].Text");
	Console.WriteLine(er)
	Console.WriteLine(CheckValue("grScrollView.Controls[0].Controls[0].Controls[1].Text", "Нет номера"+ "Проверка отображения надписи Нет номера"));	
	*/
	
	var result = Device.Click("grScrollView.Controls[0]");
	Console.WriteLine(result);
	
	Console.WriteLine(CheckScreen("Order.xml"));
	
	var result= Device.GetValue("Orderadd.Controls[0].Controls[0].Text");
	if (result !="0,00") {
		result="True";
	}
	else{
		result="False";
	}
	Console.WriteLine(result);
	
	Device.Click("Orderadd");	
	var result = Device.GetValue("context.CurrentScreen.Name");
	if (result != "Order.xml"){
		result="True";
	}
	else {
		result="False";
	}
	Console.WriteLine (result+"New orders editing")
	
	var result = Device.Click("btnBack");
	Console.WriteLine(result);
	
	var result= Device.Click("grScrollView.Controls[0]");
	
	var result = Device.GetValue("context.CurrentScreen.Name");
	if (result != "Order.xml"){
		result="True";
	}
	else {
		result="False";
	}
	Console.WriteLine (result+"New orders price-list editing")
	
	var result=Device.Click("grScrollView.Controls[2]"); // Change Price-list
	Console.WriteLine(result+"Change Price-list");
	
	Console.Pause(500);
	
	Console.WriteLine(CheckValue("Orderadd.Controls[0].Controls[0].Text", "1647,49"));
		Console.WriteLine(Device.GetValue("grScrollView.Controls[6].Controls[0].Controls[1].Text")+"586");
	Console.WriteLine(CheckValue("grScrollView.Controls[6].Controls[0].Controls[1].Text", "Количество: 5   Итого: 6,50"));
	
	Device.Click("grScrollView.Controls[6]");
	
	var result = Device.GetValue("context.CurrentScreen.Name");
	if (result != "Order.xml"){
		result="True";
	}
	else {
		result="False";
	}
	Console.WriteLine (result+"New orders editing")
	
	Console.WriteLine(Device.GetValue("grScrollView.Controls[0].Controls[0].Controls[0].Text")+"9");
	Console.WriteLine(CheckValue("grScrollView.Controls[0].Controls[0].Controls[0].Text", "Тюльпан желтый, Красный")+ "  Check SKU description and feature");
	
	Console.WriteLine(CheckValue("grScrollView.Controls[0].Controls[0].Controls[1].Text", "Пересчитать цену")+ "  Check descriptions RecountPrice");
	Console.WriteLine(CheckValue("grScrollView.Controls[2].Controls[0].Controls[0].Text", "1,3"));
	Console.WriteLine(CheckValue("grScrollView.Controls[2].Controls[0].Controls[1].Text", "Цена")+ "  Check descriptions Price");
	
	Console.WriteLine(CheckValue("grScrollView.Controls[2].Controls[1].Controls[0].Text", "5")+ "   Quantity value is  23");
	Console.WriteLine(CheckValue("grScrollView.Controls[2].Controls[1].Controls[1].Text", "Количество")+ "  Check descriptions Quantity");
	Console.WriteLine(CheckValue("grScrollView.Controls[2].Controls[2].Controls[0].Text", "шт.") + "  Units шт");
	Console.WriteLine(CheckValue("grScrollView.Controls[2].Controls[2].Controls[1].Text", "Ед. упаковки") + "  Check descriptions Units");
	
	Console.WriteLine(CheckValue("grScrollView.Controls[4].Controls[0].Controls[0].Checked", "True") + "  Discount/MarkUp value is true");
	Console.WriteLine(CheckValue("grScrollView.Controls[4].Controls[0].Controls[1].Text", "Скидка/Наценка") + "  Check descriptions Discount/MarkUp");
	Console.WriteLine(CheckValue("grScrollView.Controls[4].Controls[1].Controls[0].Text", "30")+"  Discount Value is 30");
	Console.WriteLine(CheckValue("grScrollView.Controls[4].Controls[1].Controls[1].Text",  "Наценка") +"  Check descriptions mark up");
	
	Console.WriteLine(CheckValue("grScrollView.Controls[6].Controls[0].Controls[0].Text", "Характеристики")+ " Check descriptions \" Характеристики\"");
	
	Console.WriteLine(CheckValue("grScrollView.Controls[8].Controls[0].Controls[0].Text", "Красный")+ "Красный");	
	
	var result = Device.Click("btnBack");
	Console.WriteLine(result);
	
	Device.TakeScreenshot("NewOrder");
	
	var result = Device.Click("btnForward");
	Console.WriteLine(result);	
	
	Console.WriteLine(CheckScreen("Order_Commentary.xml"));
	
	var result=TextCheck("grScrollView.Controls[0].Controls[0].Controls[2]", "Комментарий изменен");	
	if (result !="True; True; True"){
		Console.WriteLine(result + "Проверка изменения комментария в новых заказах");
	}
	else {	
		Console.WriteLine(result+" Проверка изменения комментария в новых заказах");
	}
	
	var result = Device.Click("btnForward");
	Console.WriteLine(result);	
	
	Console.WriteLine(CheckScreen("Main.xml"));
}