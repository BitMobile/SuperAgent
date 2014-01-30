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

Console.CommandPause = 1000;

	var result = Device.Click("btnOrder");
	Stopwatch.Start();
	Console.WriteLine(result);
	
	var result = CheckScreen("OrderList.xml");
	if (result=="OrderList.xml") {
		var result = Stopwatch.Stop();
		Console.WriteLine(result.TotalSeconds+"  OrderList loading time");
	}
	else{
		Console.WriteLine(result);
	}
	/*Old order*/
	/*var a=getRandomArbitary(0,3);*/
	var result = Device.Click("grScrollView.Controls[0]");
	Console.WriteLine(result+"Old order");
	
	Console.Pause(500);
	
	Console.WriteLine(CheckScreen("Order.xml"));
	
	Device.Click("Orderadd");
	var result = Device.GetValue("context.CurrentScreen.Name");
	Console.Terminate(result != "Order.xml", "Старые заказы не заблокированы на редактирование!");

	Device.Click("grScrollView.Controls[2]");
	var result = Device.GetValue("context.CurrentScreen.Name");
	Console.Terminate(result != "Order.xml", "Старые заказы не заблокированы на редактирование!");
	
	Device.TakeScreenshot("OldOrder");
	
	var result= Device.GetValue("Orderadd.Controls[0].Controls[0].Text");
	if (result =="0,00") {
		result="False";
	}
	else{
		result="True";
	}
	Console.WriteLine(result);
	
	Device.Click("grScrollView.Controls[0]");
	var result = Device.GetValue("context.CurrentScreen.Name");
	Console.Terminate(result != "Order.xml", "Старые заказы не заблокированы на редактирование!");

	var result= Device.GetValue("grScrollView.Controls[0].Controls[0].Controls[0].Text");
	if (result==""){
		result="False";
	}
	else {
		result="True";
	}
	Console.WriteLine(result+" Проверка отображения пустой строки в старых заказах");
	
	var result = Device.Click("btnForward");
	Console.WriteLine(result);	
	
	Console.WriteLine(CheckScreen("Order_Commentary.xml"));
	
	var result=TextCheck("grScrollView.Controls[0].Controls[0].Controls[2]", "Коммент");	
	if (result !="True; True; True"){
		result="True";
		Console.WriteLine(result + "Проверка изменения комментария в старых заказах");
	}
	else {
		Console.WriteLine(result+" Проверка изменения комментария в старых заказах");
	}
	
	var result = Device.Click("btnForward");
	Console.WriteLine(result);	
	
	/*-----------------ADDING NEW ORDER-------------------------*/
	var result=Device.Click("btnOrder");
	Console.WriteLine(result);
	
	var result = Device.Click("NewOrder");
	Console.WriteLine(result);
	
	Console.WriteLine(CheckScreen("Outlets.xml"));
	
 Console.WriteLine(Search("edtSearch", "new"));	
  Stopwatch.Start();
	Console.WriteLine(result);
	
	var result = CheckValue("grScrollView.Controls[0].Controls[0].Controls[0].Text", "New iOS outlet");
	if (result=="True") {
		var result = Stopwatch.Stop();
		Console.WriteLine(result.TotalSeconds+"  Outlets search loading time");
	}
	else{
		Console.WriteLine(result);
	}
	
	var outlet=Device.GetValue("grScrollView.Controls[0].Controls[0].Controls[0].Text");
	Console.WriteLine("Заказ для "+ outlet);
	
	Console.Pause(1000);
	
	var result = Device.Click("grScrollView.Controls[0]");
	Console.WriteLine(result);
	/* Took outlet descr from workflow in future*/
	
	Console.Pause(1000);
	
	Console.WriteLine(CheckScreen("Order.xml"));
	
	Console.WriteLine(CheckValue("grScrollView.Controls[0].Controls[0].Controls[0].Text", "Не выбран"));
	
	var result=Device.Click("grScrollView.Controls[0]"); // Price-list
	Console.WriteLine(result+"Price-list");
	
	Console.WriteLine(CheckScreen("ListChoice.xml"));
	
	var priceList=Device.GetValue("grScrollView.Controls[2].Controls[0].Controls[0].Text");
	var result=Device.Click("grScrollView.Controls[2]"); // Choose Price-list
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

	Console.WriteLine(CheckScreen("Features.xml"));
	
	var feature=Device.GetValue("grScrollView.Controls[0].Controls[0].Controls[0].Text");
	
	var result=Device.Click("grScrollView.Controls[0]"); // Choose feature
	Stopwatch.Start();
	Console.WriteLine(result);
	
	
	var result = CheckScreen("Order_EditSKU.xml");
	if (result=="Order_EditSKU.xml") {
		var result = Stopwatch.Stop();
		Console.WriteLine(result.TotalSeconds+"  Order_EditSKU loading time");
	}
	else{
		Console.WriteLine(result);
	}
		
	/*var sku=Device.GetValue("workflow[orderitem].Total");
	Console.WriteLine(sku);*/
	
	/*Check descriptions*/
		Console.WriteLine(Device.GetValue("grScrollView.Controls[0].Controls[0].Controls[0].Text"));
	Console.WriteLine(CheckValue("grScrollView.Controls[0].Controls[0].Controls[0].Text", "Гвоздь 10ка, Красный, шоколад")+ "  Check SKU description and feature");
	
	Console.WriteLine(CheckValue("grScrollView.Controls[0].Controls[0].Controls[1].Text", "Пересчитать цену")+ "  Check descriptions RecountPrice");
	Console.WriteLine(CheckValue("grScrollView.Controls[2].Controls[0].Controls[1].Text", "Цена")+ "  Check descriptions Price");
	Console.WriteLine(CheckValue("grScrollView.Controls[2].Controls[1].Controls[0].Text", "0") +"Discount Value is 0");
	Console.WriteLine(CheckValue("grScrollView.Controls[2].Controls[1].Controls[1].Text", "Скидка") +"  Check descriptions Discount");
	Console.WriteLine(CheckValue("grScrollView.Controls[2].Controls[2].Controls[0].Checked", "False") + "  Discount/MarkUp value is false");
	Console.WriteLine(CheckValue("grScrollView.Controls[2].Controls[2].Controls[1].Text", "Скидка/Наценка") + "  Check descriptions Discount/MarkUp");
	Console.WriteLine(CheckValue("grScrollView.Controls[4].Controls[0].Controls[0].Text", "0")+ "   Quantity value is 0");
	Console.WriteLine(CheckValue("grScrollView.Controls[4].Controls[0].Controls[1].Text", "Количество")+ "  Check descriptions Quantity");
	Console.WriteLine(CheckValue("grScrollView.Controls[4].Controls[1].Controls[0].Text", "шт.") + "  Units шт");
	Console.WriteLine(CheckValue("grScrollView.Controls[4].Controls[1].Controls[1].Text", "Ед. упаковки") + "  Check descriptions Units");
	Console.WriteLine(CheckValue("grScrollView.Controls[5].Controls[0].Controls[0].Text", "0") + "  Quantity 2 is 0");
	Console.WriteLine(CheckValue("grScrollView.Controls[5].Controls[0].Controls[1].Text", "Количество") + "  Check descriptions Quantity 2");
	Console.WriteLine(CheckValue("grScrollView.Controls[5].Controls[1].Controls[0].Text", "шт.")+ " Base Units шт.");
	Console.WriteLine(CheckValue("grScrollView.Controls[5].Controls[1].Controls[1].Text", "Баз. единица изм.")+ "   Check descriptions Base Units");
	Console.WriteLine(CheckValue("grScrollView.Controls[7].Controls[0].Controls[0].Text", "Выберите единицу измерения:")+ "  Check descriptions Choose units");
	Console.WriteLine(CheckValue("grScrollView.Controls[9].Controls[0].Controls[0].Text", "Коробка")+ "Unit to Select коробка");
	Console.WriteLine(CheckValue("grScrollView.Controls[11].Controls[0].Controls[0].Text", "шт.")+ "Units to Select шт");

	var price = Device.GetValue("grScrollView.Controls[2].Controls[0].Controls[0].Text");
	if (price != "0,00"  || price != "") {
		result="True";
	}
	else {
		result="False";
	}
	Console.WriteLine(result);
	
	var quantity="23";
	Console.WriteLine(TextCheck("grScrollView.Controls[4].Controls[0].Controls[0]", quantity));
	
	
	var result = Device.Click("btnForward");
	Console.WriteLine(result);	
	
	
	Console.WriteLine(CheckScreen("Order.xml"));
		Console.WriteLine(Device.GetValue("grScrollView.Controls[0].Controls[0].Controls[0].Text"));
	Console.WriteLine(CheckValue("grScrollView.Controls[2].Controls[0].Controls[0].Text", "Гвоздь 10ка, "+ feature)+ "  Check SKU description and feature in order");
	
	/*var amount=price*quantity;*/
	
	
	/*var result=CheckValue("grScrollView.Controls[2].Controls[0].Controls[1].Text", "Количество:"+quantity+ "Итого:"+ amount);
	Console.WriteLine(result);	*/
	
	/*ORDER WITH DISCOUNT and second feature */
	
	
	var result=Device.Click("Orderadd");
	Console.WriteLine(result);
	
	Console.WriteLine(Search("edtSearch", "гв 10"));	
	
	var result=Device.Click("grScrollView.Controls[2]"); // Add SKU to Order
	Console.WriteLine(result);
	
	Console.WriteLine(CheckScreen("Features.xml"));
	
	var feature=Device.GetValue("grScrollView.Controls[0].Controls[0].Controls[0].Text");
	
	var result=Device.Click("grScrollView.Controls[4]"); // Choose feature
	Console.WriteLine(result);
	
	Console.WriteLine(CheckScreen("Order_EditSKU.xml"));
	
	Console.WriteLine(CheckValue("grScrollView.Controls[0].Controls[0].Controls[0].Text", "Гвоздь 10ка, "+ feature)+ "  Check SKU description and feature");
	
	var price = Device.GetValue("grScrollView.Controls[2].Controls[0].Controls[0].Text");
	if (price != "0,00"  || price != "") {
		result="True";
	}
	else {
		result="False";
	}

	var quantity="5";
	TextCheck("grScrollView.Controls[4].Controls[0].Controls[0]", quantity);
	if (result !="True; True; True") {
		Console.WriteLine(result+"Количество не вводится");
	}
	else {
		result="True";
		Console.WriteLine(result);
	}
	
	var discount="30.65";
	TextCheck("grScrollView.Controls[2].Controls[1].Controls[0]", discount);
	if (result !="True; True; True") {
		Console.WriteLine(result+ "Скидка не вводится");
	}
	else {
		result="True";
		Console.WriteLine(result);
	}
	
	var result = Device.Click("grScrollView.Controls[0].Controls[0]");
	Console.WriteLine(result);	
	
	Console.WriteLine(CheckValue("grScrollView.Controls[2].Controls[0].Controls[0].Text", "Скидка") +"  Check descriptions Disc");
	
	price= price*((-discount/100)+1);
	Console.WriteLine(price);
	
	Console.WriteLine(Device.GetValue("grScrollView.Controls[2].Controls[0].Controls[0].Text"));
	Console.WriteLine(CheckValue("grScrollView.Controls[2].Controls[0].Controls[0].Text", price)+ "  Check Price");
		Console.WriteLine(Device.GetValue("grScrollView.Controls[0].Controls[0].Controls[0].Text"));
	Console.WriteLine(CheckValue("grScrollView.Controls[0].Controls[0].Controls[0].Text", "Гвоздь 10ка, синий, металл")+ "  Check SKU description and feature");
	
	Console.WriteLine(CheckValue("grScrollView.Controls[0].Controls[0].Controls[1].Text", "Пересчитать цену")+ "  Check descriptions RecountPrice");
	Console.WriteLine(CheckValue("grScrollView.Controls[2].Controls[0].Controls[1].Text", "Цена")+ "  Check descriptions Price");
	Console.WriteLine(CheckValue("grScrollView.Controls[2].Controls[1].Controls[0].Text", "-30,65")+"  Discount Value is " + discount);
	Console.WriteLine(CheckValue("grScrollView.Controls[2].Controls[1].Controls[1].Text", "Скидка") +"  Check descriptions Discount");
	Console.WriteLine(CheckValue("grScrollView.Controls[2].Controls[2].Controls[0].Checked", "False") + "  Discount/MarkUp value is false");
	Console.WriteLine(CheckValue("grScrollView.Controls[2].Controls[2].Controls[1].Text", "Скидка/Наценка") + "  Check descriptions Discount/MarkUp");
	Console.WriteLine(CheckValue("grScrollView.Controls[4].Controls[0].Controls[0].Text", quantity)+ "   Quantity value is  " + quantity);
	Console.WriteLine(CheckValue("grScrollView.Controls[4].Controls[0].Controls[1].Text", "Количество")+ "  Check descriptions Quantity");
	Console.WriteLine(CheckValue("grScrollView.Controls[4].Controls[1].Controls[0].Text", "шт.") + "  Units шт");
	Console.WriteLine(CheckValue("grScrollView.Controls[4].Controls[1].Controls[1].Text", "Ед. упаковки") + "  Check descriptions Units");
	Console.WriteLine(CheckValue("grScrollView.Controls[5].Controls[0].Controls[0].Text", quantity)+ "  Quantity 2 is  " + quantity);
	Console.WriteLine(CheckValue("grScrollView.Controls[5].Controls[0].Controls[1].Text", "Количество") + "  Check descriptions Quantity 2");
	Console.WriteLine(CheckValue("grScrollView.Controls[5].Controls[1].Controls[0].Text", "шт.")+ " Base Units шт.");
	Console.WriteLine(CheckValue("grScrollView.Controls[5].Controls[1].Controls[1].Text", "Баз. единица изм.")+ "   Check descriptions Base Units");
	Console.WriteLine(CheckValue("grScrollView.Controls[7].Controls[0].Controls[0].Text", "Выберите единицу измерения:")+ "  Check descriptions Choose units");
	Console.WriteLine(CheckValue("grScrollView.Controls[9].Controls[0].Controls[0].Text", "Коробка")+ "Unit to Select коробка");
	Console.WriteLine(CheckValue("grScrollView.Controls[11].Controls[0].Controls[0].Text", "шт.")+ "Units to Select шт");
	
	var amount=price*quantity;
	/*amount=amount.toFixed(2);*/
	Console.WriteLine(amount);
	
	var result = Device.Click("btnForward");
	Console.WriteLine(result);	
	
	Console.WriteLine(CheckScreen("Order.xml"));
		Console.WriteLine(Device.GetValue("grScrollView.Controls[0].Controls[0].Controls[0].Text"));
	Console.WriteLine(CheckValue("grScrollView.Controls[4].Controls[0].Controls[0].Text", "Гвоздь 10ка, "+ feature)+ "  Check SKU description and feature in order");
	
	
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
		Console.WriteLine(Device.GetValue("grScrollView.Controls[0].Controls[0].Controls[0].Text"));
	Console.WriteLine(CheckValue("grScrollView.Controls[0].Controls[0].Controls[0].Text", "Тюльпан желтый, Красный")+  "Check SKU description and feature");
	
	var price = Device.GetValue("grScrollView.Controls[2].Controls[0].Controls[0].Text");
	if (price != "0,00"  || price != "") {
		result="True";
	}
	else {
		result="False";
	}

	var quantity="5";
	TextCheck("grScrollView.Controls[4].Controls[0].Controls[0]", quantity);
	if (result !="True; True; True") {
		Console.WriteLine(result+"Количество не вводится");
	}
	else {
		result="True";
		Console.WriteLine(result);
	}
	
	Device.Click("grScrollView.Controls[2].Controls[2].Controls[0]");
	
	var markup="30";
	TextCheck("grScrollView.Controls[2].Controls[1].Controls[0]", markup);
	if (result !="True; True; True") {
		Console.WriteLine(result+ "Наценка не вводится");
	}
	else {
		result="True";
		Console.WriteLine(result);
	}
	
	var result = Device.Click("grScrollView.Controls[0].Controls[0]");
	Console.WriteLine(result);	
	
	Console.WriteLine(CheckValue("grScrollView.Controls[2].Controls[1].Controls[1].Text", "Наценка") +"  Check descriptions Markup");
	
	
	price= price*((markup/100)+1);
	Console.WriteLine(price);
	
	Console.WriteLine(CheckValue("grScrollView.Controls[2].Controls[0].Controls[0].Text", price)+ "  Check Price");
	
	var amount=price*quantity;
	/*amount=amount.toFixed(2);*/
	Console.WriteLine(amount);
	
	var result = Device.Click("grScrollView.Controls[0].Controls[0]");
	Console.WriteLine(result);	
		Console.WriteLine(Device.GetValue("grScrollView.Controls[0].Controls[0].Controls[0].Text"));
	Console.WriteLine(CheckValue("grScrollView.Controls[0].Controls[0].Controls[0].Text", "Тюльпан желтый, Красный")+ "  Check SKU description and feature");
	
	Console.WriteLine(CheckValue("grScrollView.Controls[0].Controls[0].Controls[1].Text", "Пересчитать цену")+ "  Check descriptions RecountPrice");
	Console.WriteLine(CheckValue("grScrollView.Controls[2].Controls[0].Controls[1].Text", "Цена")+ "  Check descriptions Price");
	Console.WriteLine(CheckValue("grScrollView.Controls[2].Controls[1].Controls[0].Text", markup) +"Markup Value is " + markup);
	Console.WriteLine(CheckValue("grScrollView.Controls[2].Controls[1].Controls[1].Text", "Наценка") +"  Check descriptions Markup");
	Console.WriteLine(CheckValue("grScrollView.Controls[2].Controls[2].Controls[0].Checked", "True") + "  Discount/MarkUp value is true");
	Console.WriteLine(CheckValue("grScrollView.Controls[2].Controls[2].Controls[1].Text", "Скидка/Наценка") + "  Check descriptions Discount/MarkUp");
	Console.WriteLine(CheckValue("grScrollView.Controls[4].Controls[0].Controls[0].Text", quantity)+ "   Quantity value is" + quantity);
	Console.WriteLine(CheckValue("grScrollView.Controls[4].Controls[0].Controls[1].Text", "Количество")+ "  Check descriptions Quantity");
	Console.WriteLine(CheckValue("grScrollView.Controls[4].Controls[1].Controls[0].Text", "шт.") + "  Units шт");
	Console.WriteLine(CheckValue("grScrollView.Controls[4].Controls[1].Controls[1].Text", "Ед. упаковки") + "  Check descriptions Units");
	Console.WriteLine(CheckValue("grScrollView.Controls[5].Controls[0].Controls[0].Text", quantity) + "  Quantity 2 is " + quantity);
	Console.WriteLine(CheckValue("grScrollView.Controls[5].Controls[0].Controls[1].Text", "Количество") + "  Check descriptions Quantity 2");
	Console.WriteLine(CheckValue("grScrollView.Controls[5].Controls[1].Controls[0].Text", "шт.")+ " Base Units шт.");
	Console.WriteLine(CheckValue("grScrollView.Controls[5].Controls[1].Controls[1].Text", "Баз. единица изм.")+ "   Check descriptions Base Units");
	Console.WriteLine(CheckValue("grScrollView.Controls[7].Controls[0].Controls[0].Text", "Выберите единицу измерения:")+ "  Check descriptions Choose units");
	Console.WriteLine(CheckValue("grScrollView.Controls[9].Controls[0].Controls[0].Text", "шт.")+ "Units to Select шт");
	
	var result = Device.Click("btnForward");
	Console.WriteLine(result);	
	
	Console.WriteLine(CheckScreen("Order.xml"));
		Console.WriteLine(Device.GetValue("grScrollView.Controls[0].Controls[0].Controls[0].Text"));
	Console.WriteLine(CheckValue("grScrollView.Controls[2].Controls[0].Controls[0].Text", "Тюльпан желтый, Красный")+ "Check SKU description and feature in order");
	
	
	var result=CheckValue("grScrollView.Controls[6].Controls[0].Controls[1].Text", "Количество: 5   Итого: 188,50");
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
	
	Console.WriteLine(CheckValue("grScrollView.Controls[0].Controls[0].Controls[0].Text",outlet)+ "Проверка названия новой т.т.");	
	
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
	
	var result=Device.Click("grScrollView.Controls[2]"); // Choose Price-list
	Console.WriteLine(result+"Choose Price-list");
	
	Console.Pause(500);
	
	Console.WriteLine(CheckValue("Orderadd.Controls[0].Controls[0].Text", "489,84"));
	Console.WriteLine(CheckValue("grScrollView.Controls[2].Controls[0].Controls[1].Text", "Количество: 23   Итого: 115,00"));
	
	Device.Click("grScrollView.Controls[2]");
	
	var result = Device.GetValue("context.CurrentScreen.Name");
	if (result != "Order.xml"){
		result="True";
	}
	else {
		result="False";
	}
	Console.WriteLine (result+"New orders editing")
	
	
Console.WriteLine(CheckValue("grScrollView.Controls[0].Controls[0].Controls[0].Text", "Гвоздь 10ка, Красный, шоколад")+ "  Check SKU description and feature");
	
	Console.WriteLine(Device.GetValue("grScrollView.Controls[0].Controls[0].Controls[0].Text"));
	Console.WriteLine(CheckValue("grScrollView.Controls[2].Controls[0].Controls[0].Text", "5"));
	Console.WriteLine(CheckValue("grScrollView.Controls[0].Controls[0].Controls[1].Text", "Пересчитать цену")+ "  Check descriptions RecountPrice");
	Console.WriteLine(CheckValue("grScrollView.Controls[2].Controls[0].Controls[1].Text", "Цена")+ "  Check descriptions Price");
	Console.WriteLine(CheckValue("grScrollView.Controls[2].Controls[1].Controls[0].Text", "0")+"  Discount Value is 0");
	Console.WriteLine(CheckValue("grScrollView.Controls[2].Controls[1].Controls[1].Text", "Скидка") +"  Check descriptions Discount");
	Console.WriteLine(CheckValue("grScrollView.Controls[2].Controls[2].Controls[0].Checked", "False") + "  Discount/MarkUp value is false");
	Console.WriteLine(CheckValue("grScrollView.Controls[2].Controls[2].Controls[1].Text", "Скидка/Наценка") + "  Check descriptions Discount/MarkUp");
	Console.WriteLine(CheckValue("grScrollView.Controls[4].Controls[0].Controls[0].Text", "23")+ "   Quantity value is  23");
	Console.WriteLine(CheckValue("grScrollView.Controls[4].Controls[0].Controls[1].Text", "Количество")+ "  Check descriptions Quantity");
	Console.WriteLine(CheckValue("grScrollView.Controls[4].Controls[1].Controls[0].Text", "шт.") + "  Units шт");
	Console.WriteLine(CheckValue("grScrollView.Controls[4].Controls[1].Controls[1].Text", "Ед. упаковки") + "  Check descriptions Units");
	Console.WriteLine(CheckValue("grScrollView.Controls[5].Controls[0].Controls[0].Text", "23")+ "  Quantity 2 is 23 ");
	Console.WriteLine(CheckValue("grScrollView.Controls[5].Controls[0].Controls[1].Text", "Количество") + "  Check descriptions Quantity 2");
	Console.WriteLine(CheckValue("grScrollView.Controls[5].Controls[1].Controls[0].Text", "шт.")+ " Base Units шт.");
	Console.WriteLine(CheckValue("grScrollView.Controls[5].Controls[1].Controls[1].Text", "Баз. единица изм.")+ "   Check descriptions Base Units");
	Console.WriteLine(CheckValue("grScrollView.Controls[7].Controls[0].Controls[0].Text", "Выберите единицу измерения:")+ "  Check descriptions Choose units");
	Console.WriteLine(CheckValue("grScrollView.Controls[9].Controls[0].Controls[0].Text", "Коробка")+ "Unit to Select коробка");
	Console.WriteLine(CheckValue("grScrollView.Controls[11].Controls[0].Controls[0].Text", "шт.")+ "Units to Select шт");
	
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