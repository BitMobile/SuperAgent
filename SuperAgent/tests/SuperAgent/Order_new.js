function Search(path, text) {
	var result1 = Device.SetFocus(path);

	var result2 = Device.SetText(path, text);
	textp = path + ".Text";
	var result3 = Device.GetValue(textp);

	var result4 = Device.Click("btnSearch");

	if (result3 == text) {
		result3 = "True";
	} else {
		result3 = "False";
	}

	if (result1 == result2 && result1 == result3 && result1 == result4
			&& result1 == "True") {
		result = "True";
	} else {
		result = result1 + "; " + result2 + "; " + result3 + "; " + result4;
	}
	return result;
}

function CheckScreen(screen) {

	var result = Device.GetValue("context.CurrentScreen.Name");
	Console.Terminate(result != screen, "  Экран" + screen + "не открывается!");

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

function CurrDateTime() {

	var curr = new Date();

	var day = curr.getDate();
	day = (day < 10) ? '0' + day : day;
	var month = curr.getMonth() + 1;
	month = (month < 10) ? '0' + month : month;
	var year = curr.getFullYear();
	var hour = curr.getHours();
	hour = (hour < 10) ? '0' + hour : hour;
	var min = curr.getMinutes();
	min = (min < 10) ? '0' + min : min;

	result = day + "." + month + "." + year + " " + hour + ":" + min;

	return result;
}

function RunStopWatch(StartButton, StopScreen) {
	Device.Click(StartButton);
	Stopwatch.Start();
	do {
		var CurrScreen = Device.GetValue("context.CurrentScreen.Name");
	} while (CurrScreen != StopScreen);
	var result = Stopwatch.Stop();
	Console.WriteLine(result.TotalSeconds + StopScreen + "  loading time");

}

function ClickAndSetDateTime(path, dateTime, CheckSetDateTime, description) {

	Console.WriteLine(path + "--" + dateTime + "--" + CheckSetDateTime + "--"
			+ description);
	var result = Device.Click(path);
	Console.WriteLine(result + description);

	Dialog.SetDateTime(dateTime);

	var appDateTime = Dialog.GetDateTime();
	appDateTime = String(appDateTime);
	appDateTime = appDateTime.slice(0, -3);
	Console.WriteLine(CheckSetDateTime + " --" + appDateTime);

	var result = (CheckSetDateTime == appDateTime) ? "True" : "False";
	Console.WriteLine(result);
	Console.WriteLine(Dialog.ClickPositive());

	var PathWithText = path + ".Controls[0].Controls[0].Text";
	var result = Device.GetValue(PathWithText);
	var appDateTime = Device.GetValue(PathWithText);
	appDateTime = String(appDateTime);
	appDateTime = appDateTime.slice(0, -3);
	Console.WriteLine(appDateTime);
	var result = (CheckSetDateTime == appDateTime) ? "True" : "False";
	Console.WriteLine(result
			+ "Проверка даты в Textview после внесения изменений");
}

function main() {

	/*-----------------ADDING NEW ORDER-------------------------*/

	Console.WriteLine("Adding new order");
	var result = Device.Click("btnOrder");
	Console.WriteLine(result);

	var result = Device.Click("NewOrder");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("Outlets.xml"));

	Console.WriteLine(Search("edtSearch", "new"));
	Console.WriteLine(result);

	var result = Device
			.GetValue("grScrollView.Controls[0].Controls[1].Controls[0].Text");

	if (result == "New iOS outlet") {
		Console.WriteLine(CheckValue(
				"grScrollView.Controls[0].Controls[1].Controls[0].Text",
				"New iOS outlet")); // проверка отображения названия т.т.
	} else {

		Console.WriteLine(CheckValue(
				"grScrollView.Controls[0].Controls[0].Controls[0].Text",
				"New iOS outlet")); // проверка отображения названия т.т.

	}

	var outlet = Device
			.GetValue("grScrollView.Controls[0].Controls[0].Controls[0].Text");
	if (outlet == "Error: Index has to be between upper and lower bound of the array.") {

		var outlet = Device
				.GetValue("grScrollView.Controls[0].Controls[1].Controls[0].Text");
		Console.WriteLine("Заказ для " + outlet);
	} /*else {
		Console.WriteLine("Заказ для " + outlet);
	}*/

	var result = Device.Click("grScrollView.Controls[0]");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("Order.xml"));

	var currDateTime = CurrDateTime();
	Console.WriteLine(currDateTime);

	/* Took outlet descr from workflow in future */
	var result = Device.Click("Orderadd.Controls[0].Controls[0].Controls[0]");
	Console.WriteLine(result);

	Console.WriteLine(Device.Click("grScrollView.Controls[2]"));

	var result = Device
			.GetValue("grScrollView.Controls[0].Controls[0].Controls[0].Text");
	if (result == "222") {

		Console.WriteLine("Порядок прайс-листов не совпадает, с 1С");

		var result = Device.Click("btnForward");
		Console.WriteLine(result);
	} else {
		Console.WriteLine(Device.Click("grScrollView.Controls[0]"));
	}

	var result = Device
			.GetValue("grScrollView.Controls[2].Controls[0].Controls[0].Text");
	Console.WriteLine(result);

	var result = Device.Click("btnForward");
	Console.WriteLine(result);

	RunStopWatch("Orderadd.Controls[0].Controls[0].Controls[2]",
			"Order_SKUs.xml");

	/* ORDER WITHOUT DISCOUNT and First feature */

	Console.WriteLine(Search("edtSearch", "оздь 10"));

	Console.WriteLine(Device
			.GetValue("grScrollView.Controls[2].Controls[0].Controls[0].Text"));

	RunStopWatch("grScrollView.Controls[2]", "Order_EditSKU.xml");

	/* Check descriptions */

	Console.WriteLine(Device
			.GetValue("grScrollView.Controls[0].Controls[0].Controls[0].Text"));
	Console.WriteLine(CheckValue(
			"grScrollView.Controls[0].Controls[0].Controls[0].Text",
			"Гвоздь 10ка")
			+ "  Check SKU description");

	Console.WriteLine(CheckValue(
			"grScrollView.Controls[0].Controls[0].Controls[1].Text",
			"Пересчитать цену")
			+ "  Check descriptions RecountPrice");
	Console.WriteLine(CheckValue(
			"grScrollView.Controls[2].Controls[0].Controls[1].Text", "Цена")
			+ "  Check descriptions Price");

	Console.WriteLine(CheckValue(
			"grScrollView.Controls[2].Controls[1].Controls[0].Text", "0")
			+ "   Quantity value is 0");
	Console.WriteLine(CheckValue(
			"grScrollView.Controls[2].Controls[1].Controls[1].Text",
			"Количество")
			+ "  Check descriptions Quantity");
	Console.WriteLine(CheckValue(
			"grScrollView.Controls[2].Controls[2].Controls[0].Text", "шт.")
			+ "  Units шт");
	Console.WriteLine(CheckValue(
			"grScrollView.Controls[2].Controls[2].Controls[1].Text",
			"Ед. упаковки")
			+ "  Check descriptions Units");

	Console
			.WriteLine(CheckValue(
					"grScrollView.Controls[4].Controls[0].Controls[0].Checked",
					"False")
					+ "  Discount/MarkUp value is false");
	Console.WriteLine(CheckValue(
			"grScrollView.Controls[4].Controls[0].Controls[1].Text",
			"Скидка/Наценка")
			+ "  Check descriptions Discount/MarkUp");
	/*
	 * Console.WriteLine(CheckValue("grScrollView.Controls[4].Controls[1].Controls[0].Text",
	 * "0") +"Discount Value is 0");
	 */
	Console.WriteLine(CheckValue(
			"grScrollView.Controls[4].Controls[1].Controls[1].Text", "Скидка")
			+ "  Check descriptions Discount");

	Console.WriteLine(Device
			.GetValue("grScrollView.Controls[8].Controls[0].Controls[0].Text"));
	Console.WriteLine(CheckValue(
			"grScrollView.Controls[8].Controls[0].Controls[0].Text",
			"Характеристики")
			+ " Check descriptions \" Характеристики\"");

	Console.WriteLine(CheckValue(
			"grScrollView.Controls[10].Controls[0].Controls[0].Text",
			"Default feature")
			+ "Default feature");

	Console.WriteLine(CheckValue(
			"grScrollView.Controls[12].Controls[0].Controls[0].Text",
			"синий, металл")
			+ "Синий металл");
	Console.WriteLine(Device.Click("grScrollView.Controls[12]"));// Choose
																	// first
																	// feature

	Console.WriteLine(Device
			.GetValue("grScrollView.Controls[0].Controls[0].Controls[0].Text"));
	Console.WriteLine(CheckValue(
			"grScrollView.Controls[0].Controls[0].Controls[0].Text",
			"Гвоздь 10ка, синий, металл")
			+ "  Check SKU description and feature");
	Console.WriteLine(CheckValue(
			"grScrollView.Controls[14].Controls[0].Controls[0].Text",
			"Красный, шоколад")
			+ "Красный. шоколад");

	var price = Device
			.GetValue("grScrollView.Controls[2].Controls[0].Controls[0].Text");
	if (price != "0,00" || price != "") {
		result = "True";
	} else {
		result = "False";
	}
	Console.WriteLine(result);

	var quantity = "23";
	Console.WriteLine(TextCheck(
			"grScrollView.Controls[2].Controls[1].Controls[0]", quantity));

	var result = Device.Click("btnForward");
	Console.WriteLine(result);

	/* ORDER WITH DISCOUNT and second feature */
	Console
			.WriteLine("------------------------ORDER WITH DISCOUNT and second feature----------------------------------------");

	RunStopWatch("Orderadd.Controls[0].Controls[0].Controls[2]",
			"Order_SKUs.xml");

	Console.WriteLine(Search("edtSearch", "гв 10"));

	Console.WriteLine(Device
			.GetValue("grScrollView.Controls[2].Controls[0].Controls[0].Text"));

	var result = Device.Click("grScrollView.Controls[2]"); // Add SKU to Order
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("Order_EditSKU.xml"));
	Console.WriteLine(Device
			.GetValue("grScrollView.Controls[0].Controls[0].Controls[0].Text"));
	Console.WriteLine(CheckValue(
			"grScrollView.Controls[0].Controls[0].Controls[0].Text",
			"Гвоздь 10ка")
			+ "  Check SKU description ");

	Console
			.WriteLine(Device
					.GetValue("grScrollView.Controls[14].Controls[0].Controls[0].Text"));
	var result = Device.Click("grScrollView.Controls[14]"); // Choose feature
	Console.WriteLine(result);

	var price = Device
			.GetValue("grScrollView.Controls[2].Controls[0].Controls[0].Text");
	if (price != "0,00" || price != "") {
		result = "True";
	} else {
		result = "False";
	}

	var quantity = "5";
	var result = TextCheck("grScrollView.Controls[2].Controls[1].Controls[0]",
			quantity);
	if (result != "True; True; True") {
		result = "False";
		Console.WriteLine(result + "Количество не вводится");
	} else {
		result = "True";
		Console.WriteLine(result);
	}

	var discount = "30.65";
	var result = TextCheck("grScrollView.Controls[4].Controls[1].Controls[0]",
			discount);
	if (result != "True; True; True") {
		result = "False";
		Console.WriteLine(result + "Скидка не вводится");
	} else {
		result = "True";
		Console.WriteLine(result);
	}

	var result = Device.Click("grScrollView.Controls[0].Controls[0]");
	Console.WriteLine(result);

	Console.WriteLine(CheckValue(
			"grScrollView.Controls[4].Controls[1].Controls[1].Text", "Скидка")
			+ "  Check descriptions Disc");

	price = price * ((-discount / 100) + 1);
	Console.WriteLine(price);

	Console.WriteLine(Device
			.GetValue("grScrollView.Controls[2].Controls[0].Controls[0].Text"));
	Console.WriteLine(CheckValue(
			"grScrollView.Controls[2].Controls[0].Controls[0].Text", price)
			+ "   Check price");
	Console.WriteLine(Device
			.GetValue("grScrollView.Controls[0].Controls[0].Controls[0].Text")
			+ "3");
	Console.WriteLine(CheckValue(
			"grScrollView.Controls[0].Controls[0].Controls[0].Text",
			"Гвоздь 10ка, Красный, шоколад")
			+ "  Check SKU description and feature");

	Console.WriteLine(CheckValue(
			"grScrollView.Controls[0].Controls[0].Controls[1].Text",
			"Пересчитать цену")
			+ "  Check descriptions RecountPrice");
	Console.WriteLine(CheckValue(
			"grScrollView.Controls[2].Controls[0].Controls[1].Text", "Цена")
			+ "  Check descriptions Price");

	Console.WriteLine(CheckValue(
			"grScrollView.Controls[2].Controls[1].Controls[0].Text", quantity)
			+ "   Quantity value is 0");
	Console.WriteLine(CheckValue(
			"grScrollView.Controls[2].Controls[1].Controls[1].Text",
			"Количество")
			+ "  Check descriptions Quantity");
	Console.WriteLine(CheckValue(
			"grScrollView.Controls[2].Controls[2].Controls[0].Text", "шт.")
			+ "  Units шт");
	Console.WriteLine(CheckValue(
			"grScrollView.Controls[2].Controls[2].Controls[1].Text",
			"Ед. упаковки")
			+ "  Check descriptions Units");

	Console
			.WriteLine(CheckValue(
					"grScrollView.Controls[4].Controls[0].Controls[0].Checked",
					"False")
					+ "  Discount/MarkUp value is false");
	Console.WriteLine(CheckValue(
			"grScrollView.Controls[4].Controls[0].Controls[1].Text",
			"Скидка/Наценка")
			+ "  Check descriptions Discount/MarkUp");
	Console.WriteLine(CheckValue(
			"grScrollView.Controls[4].Controls[1].Controls[0].Text", "-30,65")
			+ "Discount Value is 0");
	Console.WriteLine(CheckValue(
			"grScrollView.Controls[4].Controls[1].Controls[1].Text", "Скидка")
			+ "  Check descriptions Discount");

	Console.WriteLine(CheckValue(
			"grScrollView.Controls[8].Controls[0].Controls[0].Text",
			"Характеристики")
			+ " Check descriptions \" Характеристики\"");

	Console.WriteLine(CheckValue(
			"grScrollView.Controls[10].Controls[0].Controls[0].Text",
			"Default feature")
			+ "Default feature");

	Console.WriteLine(CheckValue(
			"grScrollView.Controls[12].Controls[0].Controls[0].Text",
			"синий, металл")
			+ "Синий металл");

	Console.WriteLine(CheckValue(
			"grScrollView.Controls[14].Controls[0].Controls[0].Text",
			"Красный, шоколад")
			+ "Красный. шоколад");

	var amount = price * quantity;
	Console.WriteLine(amount);

	var result = Device.Click("btnForward");
	Console.WriteLine(result);

	var result = Device.Click("btnForward");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("Order.xml"));
	Console.WriteLine(Device
			.GetValue("grScrollView.Controls[2].Controls[0].Controls[0].Text")
			+ "4");
	Console.WriteLine(CheckValue(
			"grScrollView.Controls[2].Controls[0].Controls[0].Text",
			"Гвоздь 10ка, Красный, шоколад")
			+ "  Check SKU description and feature in order");

	/* ORDER WITH MarkUP */

	Console
			.WriteLine("------------------------ORDER WITH MarkUP----------------------------------------");

	RunStopWatch("Orderadd.Controls[0].Controls[0].Controls[2]",
			"Order_SKUs.xml");

	Console.WriteLine(Search("edtSearch", "тюль жел"));

	Console.Pause(500);

	Console.WriteLine(Device
			.GetValue("grScrollView.Controls[2].Controls[0].Controls[0].Text"));
	var result = Device.Click("grScrollView.Controls[2]"); // Add SKU to Order
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("Order_EditSKU.xml"));

	Device.TakeScreenshot("Order_EditSKU");
	Console.WriteLine(Device
			.GetValue("grScrollView.Controls[0].Controls[0].Controls[0].Text")
			+ "5");
	Console.WriteLine(CheckValue(
			"grScrollView.Controls[0].Controls[0].Controls[0].Text",
			"Тюльпан желтый, Красный")
			+ "Check SKU description");

	var price = Device
			.GetValue("grScrollView.Controls[2].Controls[0].Controls[0].Text");
	if (price != "0,00" || price != "") {
		result = "True";
	} else {
		result = "False";
	}

	var quantity = "5";
	var result = TextCheck("grScrollView.Controls[2].Controls[1].Controls[0]",
			quantity);
	if (result != "True; True; True") {
		result = "False";
		Console.WriteLine(result + "Количество не вводится");
	} else {
		result = "True";
		Console.WriteLine(result);
	}

	Device.Click("grScrollView.Controls[4].Controls[0].Controls[0]");

	var markup = "30";
	var result = TextCheck("grScrollView.Controls[4].Controls[1].Controls[0]",
			markup);
	if (result != "True; True; True") {
		result = "False";
		Console.WriteLine(result + "Наценка не вводится");
	} else {
		result = "True";
		Console.WriteLine(result);
	}

	var result = Device.Click("grScrollView.Controls[0].Controls[0]"); // Пересчитать
																		// заказ
	Console.WriteLine(result);

	Console.WriteLine(CheckValue(
			"grScrollView.Controls[4].Controls[1].Controls[1].Text", "Наценка")
			+ "  Check descriptions Markup");

	price = price * ((markup / 100) + 1);
	Console.WriteLine(price);

	Console.WriteLine(CheckValue(
			"grScrollView.Controls[2].Controls[0].Controls[0].Text", price)
			+ "  Check Price");

	var amount = price * quantity;
	/* amount=amount.toFixed(2); */
	Console.WriteLine(amount);

	var result = Device.Click("grScrollView.Controls[0].Controls[0]");
	Console.WriteLine(result);
	Console.WriteLine(Device
			.GetValue("grScrollView.Controls[0].Controls[0].Controls[0].Text")
			+ "6");
	Console.WriteLine(CheckValue(
			"grScrollView.Controls[0].Controls[0].Controls[0].Text",
			"Тюльпан желтый, Красный")
			+ "  Check SKU description and feature");

	Console.WriteLine(CheckValue(
			"grScrollView.Controls[0].Controls[0].Controls[1].Text",
			"Пересчитать цену")
			+ "  Check descriptions RecountPrice");
	Console.WriteLine(CheckValue(
			"grScrollView.Controls[2].Controls[0].Controls[1].Text", "Цена")
			+ "  Check descriptions Price");

	Console.WriteLine(CheckValue(
			"grScrollView.Controls[2].Controls[1].Controls[0].Text", quantity)
			+ "   Quantity value is 0");
	Console.WriteLine(CheckValue(
			"grScrollView.Controls[2].Controls[1].Controls[1].Text",
			"Количество")
			+ "  Check descriptions Quantity");
	Console.WriteLine(CheckValue(
			"grScrollView.Controls[2].Controls[2].Controls[0].Text", "шт.")
			+ "  Units шт");
	Console.WriteLine(CheckValue(
			"grScrollView.Controls[2].Controls[2].Controls[1].Text",
			"Ед. упаковки")
			+ "  Check descriptions Units");

	Console.WriteLine(CheckValue(
			"grScrollView.Controls[4].Controls[0].Controls[0].Checked", "True")
			+ "  Discount/MarkUp value is True");
	Console.WriteLine(CheckValue(
			"grScrollView.Controls[4].Controls[0].Controls[1].Text",
			"Скидка/Наценка")
			+ "  Check descriptions Discount/MarkUp");
	Console.WriteLine(CheckValue(
			"grScrollView.Controls[4].Controls[1].Controls[0].Text", markup)
			+ "Markup Value is " + markup);
	Console.WriteLine(CheckValue(
			"grScrollView.Controls[4].Controls[1].Controls[1].Text", "Наценка")
			+ "  Check descriptions Markup");

	Console.WriteLine(CheckValue(
			"grScrollView.Controls[8].Controls[0].Controls[0].Text",
			"Характеристики")
			+ " Check descriptions \" Характеристики\"");

	Console
			.WriteLine(CheckValue(
					"grScrollView.Controls[10].Controls[0].Controls[0].Text",
					"Красный")
					+ "Красный");

	var result = Device.Click("btnForward");
	Console.WriteLine(result);

	var result = Device.Click("btnForward");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("Order.xml"));

	Console.WriteLine(Device
			.GetValue("grScrollView.Controls[4].Controls[0].Controls[0].Text")
			+ "7");
	Console.WriteLine(CheckValue(
			"grScrollView.Controls[4].Controls[0].Controls[0].Text",
			"Тюльпан желтый, Красный")
			+ "Check SKU description and feature in order");

	Console.WriteLine(Device
			.GetValue("grScrollView.Controls[4].Controls[0].Controls[1].Text"));
	var result = CheckValue(
			"grScrollView.Controls[4].Controls[0].Controls[1].Text",
			"Количество: 5   Итого: 188,50");
	Console.WriteLine(result);

	var result = Device.Click("btnForward");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("Order_Commentary.xml"));

	ClickAndSetDateTime("grScrollView.Controls[0]", "14.04.2014 8:45",
			"14.05.2014 8:45", "Время посещения");

	Console.WriteLine(TextCheck(
			"grScrollView.Controls[2].Controls[0].Controls[1]",
			"Комментарий к заказу  "));

	var result = Device.Click("btnForward");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("Main.xml"));

	/*-----------NEW ORDER---------------*/

	Console
			.WriteLine("------------------------Checking new order----------------------------------------");
	var result = Device.Click("btnOrder");
	Console.WriteLine(result + "New orders Check");

	Console.WriteLine(CheckScreen("OrderList.xml"));

	Device.TakeScreenshot("NewOrdersList");
	Console.WriteLine(Device
			.GetValue("grScrollView.Controls[0].Controls[0].Controls[0].Text")
			+ "8");
	Console.WriteLine(CheckValue(
			"grScrollView.Controls[0].Controls[0].Controls[0].Text",
			"New iOS outlet")
			+ "Проверка названия т.т. в новом заказе");

	var result = Device.Click("grScrollView.Controls[0]");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("Order.xml"));

	var result = Device.GetValue("Orderadd.Controls[0].Controls[0].Text");
	if (result != "0,00") {
		result = "True";
	} else {
		result = "False";
	}
	Console.WriteLine(result);

	RunStopWatch("Orderadd.Controls[0].Controls[0].Controls[2]",
			"Order_SKUs.xml");

	var result = Device.GetValue("context.CurrentScreen.Name");
	if (result != "Order.xml") {
		result = "True";
	} else {
		result = "False";
	}
	Console.WriteLine(result + "New orders editing");

	var result = Device.Click("btnBack");
	Console.WriteLine(result);

	var result = Device.Click("Orderadd.Controls[0].Controls[0].Controls[0]");
	Console.WriteLine(result);
	var result = Device.GetValue("context.CurrentScreen.Name");
	if (result == "Order_Info.xml") {
		result = "True";
	} else {
		result = "False";
	}
	Console.WriteLine(result + "New orders price-list editing");

	var result = Device.Click("grScrollView.Controls[2]");

	var result = Device.Click("grScrollView.Controls[2]"); // Change Price-list
	Console.WriteLine(result + "Change Price-list");

	var result = Device.Click("btnBack");
	Console.WriteLine(result);

	Console.WriteLine(CheckValue(
			"Orderadd.Controls[0].Controls[0].Controls[1].Controls[0].Text",
			"489,84"));
	Console.WriteLine(Device
			.GetValue("grScrollView.Controls[4].Controls[0].Controls[1].Text"));
	Console.WriteLine(CheckValue(
			"grScrollView.Controls[4].Controls[0].Controls[1].Text",
			"Количество: 5   Итого: 357,50"));

	Device.Click("grScrollView.Controls[4]");

	var result = Device.GetValue("context.CurrentScreen.Name");
	if (result != "Order.xml") {
		result = "True";
	} else {
		result = "False";
	}
	Console.WriteLine(result + "New orders editing");

	Console.WriteLine(Device
			.GetValue("grScrollView.Controls[0].Controls[0].Controls[0].Text")
			+ "9");
	Console.WriteLine(CheckValue(
			"grScrollView.Controls[0].Controls[0].Controls[0].Text",
			"Тюльпан желтый, Красный")
			+ "  Check SKU description and feature");

	Console.WriteLine(CheckValue(
			"grScrollView.Controls[0].Controls[0].Controls[1].Text",
			"Пересчитать цену")
			+ "  Check descriptions RecountPrice");
	Console.WriteLine(CheckValue(
			"grScrollView.Controls[2].Controls[0].Controls[0].Text", "71,5"));
	Console.WriteLine(CheckValue(
			"grScrollView.Controls[2].Controls[0].Controls[1].Text", "Цена")
			+ "  Check descriptions Price");

	Console.WriteLine(CheckValue(
			"grScrollView.Controls[2].Controls[1].Controls[0].Text", "5")
			+ "   Quantity value is  23");
	Console.WriteLine(CheckValue(
			"grScrollView.Controls[2].Controls[1].Controls[1].Text",
			"Количество")
			+ "  Check descriptions Quantity");
	Console.WriteLine(CheckValue(
			"grScrollView.Controls[2].Controls[2].Controls[0].Text", "шт.")
			+ "  Units шт");
	Console.WriteLine(CheckValue(
			"grScrollView.Controls[2].Controls[2].Controls[1].Text",
			"Ед. упаковки")
			+ "  Check descriptions Units");

	Console.WriteLine(CheckValue(
			"grScrollView.Controls[4].Controls[0].Controls[0].Checked", "True")
			+ "  Discount/MarkUp value is true");
	Console.WriteLine(CheckValue(
			"grScrollView.Controls[4].Controls[0].Controls[1].Text",
			"Скидка/Наценка")
			+ "  Check descriptions Discount/MarkUp");
	Console.WriteLine(CheckValue(
			"grScrollView.Controls[4].Controls[1].Controls[0].Text", "30")
			+ "  Discount Value is 30");
	Console.WriteLine(CheckValue(
			"grScrollView.Controls[4].Controls[1].Controls[1].Text", "Наценка")
			+ "  Check descriptions mark up");

	Console.WriteLine(CheckValue(
			"grScrollView.Controls[8].Controls[0].Controls[0].Text",
			"Характеристики")
			+ " Check descriptions \" Характеристики\"");

	Console
			.WriteLine(CheckValue(
					"grScrollView.Controls[10].Controls[0].Controls[0].Text",
					"Красный")
					+ "Красный");

	var result = Device.Click("btnBack");
	Console.WriteLine(result);

	Device.TakeScreenshot("NewOrder");

	var result = Device.Click("btnForward");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("Order_Commentary.xml"));

	ClickAndSetDateTime("grScrollView.Controls[0]", "14.04.2014 8:45",
			"14.05.2014 8:45", "Время посещения");

	var result = TextCheck("grScrollView.Controls[2].Controls[0].Controls[1]",
			"Комментарий изменен");
	if (result != "True; True; True") {
		Console.WriteLine(result
				+ "Проверка изменения комментария в новых заказах");
	} else {
		Console.WriteLine(result
				+ " Проверка изменения комментария в новых заказах");
	}

	var result = Device.Click("btnForward");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("Main.xml"));
}