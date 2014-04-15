/*  Получить номера  заказов из 1С
 */

function CheckScreen(screen) {

	var result = Device.GetValue("context.CurrentScreen.Name");
	Console.Terminate(result != screen, "Экран" + screen + "не открывается!");

	return result;
}

function getRandomArbitary(min, max) {
	return Math.random() * (max - min) + min;
}

function CheckValue(path, text) {
	var result = Device.GetValue(path);
	if (result == text) {
		result = "True";
	} else {
		result = "False";
	}
	return result;
}

function TextCheck(path, text) {
	var result1 = Device.SetFocus(path);

	var result2 = Device.SetText(path, text);
	textp = path + ".Text";

	var result3 = Device.GetValue(textp);

	if (result3 == text) {
		result3 = "True";
	} else {
		result3 = "False";
	}
	result = result1 + "; " + result2 + "; " + result3;
	return result;
}

function main() {
	Console.CommandPause = 500;
	var result = Device.Click("btnOrder");
	Console.WriteLine(result);

	var result = CheckScreen("OrderList.xml");
	Console.WriteLine(result);
	

	var result = Device.Click("NewOrder");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("Outlets.xml"));

	Console.WriteLine(TextCheck("edtSearch", "приз"));

	var result = Device.Click("btnSearch");

	var result = Device.Click("grScrollView.Controls[0]");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("Order.xml"));

	Console.Pause(1000);

	var result = Device.Click("Orderadd.Controls[0].Controls[0].Controls[2]");
	
	var result = CheckScreen("Order_SKUs.xml");
	Console.WriteLine(result);
	
	/* ORDER WITH quantity = 0 */

	var sku = Device
			.GetValue("grScrollView.Controls[12].Controls[0].Controls[0].Text");
	var result = Device.Click("grScrollView.Controls[12]"); // Add SKU to Order
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("Order_EditSKU.xml"));

	var price = Device
			.GetValue("grScrollView.Controls[2].Controls[0].Controls[0].Text");
	if (price != "0,00" || price != "") {
		result = "True";
	} else {
		result = "False";
	}
	Console.WriteLine(result);

	var quantity = "0";
	Console.WriteLine(TextCheck(
			"grScrollView.Controls[2].Controls[1].Controls[0]", quantity));

	var result = Device.Click("btnForward");
	Console.WriteLine(result);

	var CheckSKU = CheckValue(
			"grScrollView.Controls[2].Controls[0].Controls[0].Text", sku);

	var result = (CheckSKU == "False") ? "True" : "False";

	Console.WriteLine(result);

	/* Empty Order without quantity just "Forward" */
	var result = Device.Click("Orderadd.Controls[0].Controls[0].Controls[2]");
	Console.WriteLine(result);

	var sku = Device
			.GetValue("grScrollView.Controls[2].Controls[0].Controls[0].Text");/*
																				 * пробрасывает
																				 * на
																				 * следующий
																				 */

	var result = Device.Click("grScrollView.Controls[2]"); // Add SKU to Order
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("Order_EditSKU.xml"));

	var result = Device.Click("grScrollView.Controls[0].Controls[0]"); // recount
																		// price
	Console.WriteLine(result);

	var result = Device.Click("btnForward");
	Console.WriteLine(result);

	/* Empty Order without quantity just "Back" */
	var result = Device.Click("Orderadd.Controls[0].Controls[0].Controls[2]");
	
	var result = CheckScreen("Order_SKUs.xml");
	Console.WriteLine(result);
	

	var sku = Device
			.GetValue("grScrollView.Controls[2].Controls[0].Controls[0].Text");

	var result = Device.Click("grScrollView.Controls[2]"); // Add SKU to Order
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("Order_EditSKU.xml"));

	var result = Device.Click("grScrollView.Controls[0].Controls[0]");
	Console.WriteLine(result);

	var result = Device.Click("btnBack");
	Console.WriteLine(result);

	var result = Device.Click("btnForward");
	Console.WriteLine(result);

	var result = Device.Click("btnForward");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("Order_Commentary.xml"));

	var result = Device.Click("grScrollView.Controls[0]");
	Console.WriteLine(result);

	var SetDT = "2014.04.10 8:35";
	Dialog.SetDateTime(SetDT);
	var SetDT = "10.05.2014 8:35";
	var appDateTime = Dialog.GetDateTime();

	var result = (SetDT == appDateTime) ? "True" : "False";

	Console.WriteLine(Dialog.ClickPositive());

	var appDateTime = Device
			.GetValue("grScrollView.Controls[0].Controls[0].Controls[0].Text");
	appDateTime = String(appDateTime);
	appDateTime = appDateTime.slice(0, -3);
	Console.WriteLine(appDateTime);
	var result = (SetDT == appDateTime) ? "True" : "False";
	Console.WriteLine(result
			+ "Проверка даты в Textview после внесения изменений");

	var result = TextCheck("grScrollView.Controls[2].Controls[0].Controls[1]",
			"Комментарий к заказу  ");

	var result = Device.Click("btnForward");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("Main.xml"));
	/* Check empty orders in old orders list */

	Console.WriteLine(Device.Click("btnOrder"));

	var result = CheckValue("grScrollView.Controls[0].Controls[0].Controls[0]",
			"Гипермаркет \"Призма\" test");
	result = (result == "False") ? "True" : "False";
	Console.WriteLine(result);

	var result = Device.Click("btnBack");
	Console.WriteLine(result);
}