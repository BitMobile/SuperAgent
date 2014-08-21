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

	var result = Device.Click("btnOrder");
	Console.WriteLine(result);

	var result = CheckScreen("OrderList.xml");
	Console.WriteLine(result);
	

	/*-----------------ORDER Whithout Price-List-------------------------*/

	Console.WriteLine("------------------ORDER Whithout Price-List--------------------------");

	var result = Device.Click("NewOrder");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("Outlets.xml"));

	Console.WriteLine(TextCheck("edtSearch", "квант"));

	var result = Device.Click("btnSearch");
	Console.WriteLine(result);

	var outlet = Device.GetValue("grScrollView.Controls[0].Controls[0].Controls[0].Text");
	if (outlet == "Error: Index has to be between upper and lower bound of the array.") {

		var outlet = Device.GetValue("grScrollView.Controls[0].Controls[1].Controls[0].Text");
		Console.WriteLine("Заказ для " + outlet);
	} else {
		Console.WriteLine("Заказ для " + outlet);
	}

	var result = Device.Click("grScrollView.Controls[0]");
	Console.WriteLine(result);
	/* Took outlet descr from workflow in future */

	Console.WriteLine(CheckScreen("Order.xml"));

	var result = Device.Click("Orderadd.Controls[0].Controls[0].Controls[2]");

	var result = Device.GetValue("context.CurrentScreen.Name");
	if (result != "Order.xml") {
		Device.Click("btnBack");
		result = "False";
	} else {
		result = "True";
	}
	Console.WriteLine(result);

	var result = Device.Click("Orderadd.Controls[0].Controls[0].Controls[0]");
	Console.WriteLine(result);
	Console.WriteLine(CheckScreen("Order_Info.xml"));

	Console.WriteLine(CheckValue(
			"grScrollView.Controls[2].Controls[0].Controls[0].Text",
			"Для этой торговой точки нет прайс-листов"));

	var result = Device.Click("btnForward");
	Console.WriteLine(result);

	var result = Device.Click("btnForward");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("Order_Commentary.xml"));

	Console.WriteLine(TextCheck(
			"grScrollView.Controls[2].Controls[0].Controls[1]",
			"Комментарий к заказу без прайс-листа "));

	var result = Device.Click("btnForward");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("Main.xml"));

	/* ORDER WITH ONE PRICE_LIST */

	Console
			.WriteLine("----------------------------------------------ORDER WITH ONE PRICE_LIST-------------------------------------");

	var result = Device.Click("btnOrder");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("OrderList.xml"));

	Device.TakeScreenshot("NewOrdersList");

	var result = CheckValue(
			"grScrollView.Controls[0].Controls[0].Controls[0].Text",
			"ООО Квант");
	if (result == "False") {
		result = "True";
	} else {
		result = "Пустой заказ был создан";
	}
	Console.WriteLine(result);

	Device.TakeScreenshot("Empty_order_was_created");

	var result = Device.Click("NewOrder");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("Outlets.xml"));

	Console.WriteLine(TextCheck("edtSearch", "призма"));

	var result = Device.Click("btnSearch");
	Console.WriteLine(result);

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
	/* Took outlet descr from workflow in future */

	Console.WriteLine(CheckScreen("Order.xml"));

	var result = Device.Click("Orderadd.Controls[0].Controls[0].Controls[0]");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("Order_Info.xml"));

	var result = Device.Click("grScrollView.Controls[2]");
	Console.WriteLine(result);

	var result = Device.GetValue("context.CurrentScreen.Name");
	if (result != "Order_Info.xml") {
		Device.Click("btnBack");
		result = "False";
	} else {
		result = "True";
	}
	Console.WriteLine(result);

	Console.WriteLine(Device.Click("btnForward"));

	var result = Device.Click("Orderadd.Controls[0].Controls[0].Controls[2]");
	Console.WriteLine(result);
	
	Console.WriteLine(TextCheck("edtSearch", "тюль жел"));
	var result = Device.Click("btnSearch");

	Console.WriteLine(result + "3");

	var result = Device.Click("grScrollView.Controls[2]"); // Add SKU to Order
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("Order_EditSKU.xml"));

	Console.WriteLine(CheckValue(
			"grScrollView.Controls[0].Controls[0].Controls[1].Text",
			"Пересчитать цену")
			+ "  Check descriptions RecountPrice");
	Console.WriteLine(CheckValue(
			"grScrollView.Controls[2].Controls[0].Controls[1].Text", "Цена")
			+ "  Check descriptions Price");

	Console.WriteLine(CheckValue(
			"grScrollView.Controls[4].Controls[1].Controls[0].Text", "0")
			+ "Discount Value is 0");
	Console.WriteLine(CheckValue(
			"grScrollView.Controls[4].Controls[1].Controls[1].Text", "Скидка")
			+ "  Check descriptions Discount");
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

	var discount = "30";
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
			+ "  Check Price");

	var amount = price * quantity;
	/* amount=amount.toFixed(2); */
	Console.WriteLine(amount);

	var result = Device.Click("btnForward");
	Console.WriteLine(result);

	var result = Device.Click("Orderadd.Controls[0].Controls[0].Controls[2]");
	Console.WriteLine(result);

	Console.WriteLine(Device.Click("grScrollView.Controls[6]"));

	var changedQuantity = quantity * 50;

	var changedPrice = price * 50;

	Console.WriteLine(Device
			.GetValue("grScrollView.Controls[2].Controls[0].Controls[0].Text"));
	Console.WriteLine(CheckValue(
			"grScrollView.Controls[2].Controls[0].Controls[0].Text",
			changedPrice)
			+ "  Check Price");
	Console.WriteLine(CheckValue(
			"grScrollView.Controls[0].Controls[0].Controls[1].Text",
			"Пересчитать цену")
			+ "  Check descriptions RecountPrice");
	Console.WriteLine(CheckValue(
			"grScrollView.Controls[2].Controls[0].Controls[1].Text", "Цена")
			+ "  Check descriptions Price");

	Console.WriteLine(CheckValue(
			"grScrollView.Controls[2].Controls[1].Controls[0].Text", quantity)
			+ "   Quantity value is  " + quantity);
	Console.WriteLine(CheckValue(
			"grScrollView.Controls[2].Controls[1].Controls[1].Text",
			"Количество")
			+ "  Check descriptions Quantity");
	Console.WriteLine(CheckValue(
			"grScrollView.Controls[2].Controls[2].Controls[0].Text", "Коробка")
			+ "  Units шт");
	Console.WriteLine(CheckValue(
			"grScrollView.Controls[2].Controls[2].Controls[1].Text",
			"Ед. упаковки")
			+ "  Check descriptions Units");

	Console.WriteLine(CheckValue(
			"grScrollView.Controls[4].Controls[1].Controls[0].Text", "-30")
			+ "  Discount Value is " + discount);
	Console.WriteLine(CheckValue(
			"grScrollView.Controls[4].Controls[1].Controls[1].Text", "Скидка")
			+ "  Check descriptions Discount");
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
			"grScrollView.Controls[6].Controls[0].Controls[0].Text",
			"Характеристики")
			+ " Check descriptions \" Характеристики\"");
	Console.WriteLine(CheckValue(
			"grScrollView.Controls[8].Controls[0].Controls[0].Text", "Красный")
			+ "Красный");

	var result = Device.Click("btnForward");
	Console.WriteLine(result);
	/* проверка задвоения заказа */

	var result = Device.Click("Orderadd.Controls[0].Controls[0].Controls[2]");
	Console.WriteLine(result);

	Console.WriteLine(TextCheck("edtSearch", "тюль жел"));
	var result = Device.Click("btnSearch");

	Console.WriteLine(result + "3");

	var result = Device.Click("grScrollView.Controls[2]"); // Add SKU to Order
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("Order_EditSKU.xml"));

	Console.WriteLine(Device
			.GetValue("grScrollView.Controls[2].Controls[0].Controls[0].Text"));
	Console.WriteLine(CheckValue(
			"grScrollView.Controls[2].Controls[0].Controls[0].Text",
			changedPrice)
			+ "  Check Price");
	Console.WriteLine(CheckValue(
			"grScrollView.Controls[0].Controls[0].Controls[1].Text",
			"Пересчитать цену")
			+ "  Check descriptions RecountPrice");
	Console.WriteLine(CheckValue(
			"grScrollView.Controls[2].Controls[0].Controls[1].Text", "Цена")
			+ "  Check descriptions Price");

	Console.WriteLine(CheckValue(
			"grScrollView.Controls[2].Controls[1].Controls[0].Text", quantity)
			+ "   Quantity value is  " + quantity);
	Console.WriteLine(CheckValue(
			"grScrollView.Controls[2].Controls[1].Controls[1].Text",
			"Количество")
			+ "  Check descriptions Quantity");

	Console.WriteLine(CheckValue(
			"grScrollView.Controls[2].Controls[2].Controls[0].Text", "Коробка")
			+ "  Units шт");
	Console.WriteLine(CheckValue(
			"grScrollView.Controls[2].Controls[2].Controls[1].Text",
			"Ед. упаковки")
			+ "  Check descriptions Units");

	Console.WriteLine(CheckValue(
			"grScrollView.Controls[4].Controls[1].Controls[0].Text", "-30")
			+ "  Discount Value is " + discount);
	Console.WriteLine(CheckValue(
			"grScrollView.Controls[4].Controls[1].Controls[1].Text", "Скидка")
			+ "  Check descriptions Discount");
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
			"grScrollView.Controls[6].Controls[0].Controls[0].Text",
			"Характеристики")
			+ " Check descriptions \" Характеристики\"");
	Console.WriteLine(CheckValue(
			"grScrollView.Controls[8].Controls[0].Controls[0].Text", "Красный")
			+ "Красный");

	var quantity = "15";
	var result = TextCheck("grScrollView.Controls[4].Controls[0].Controls[0]",
			quantity);
	if (result != "True; True; True") {
		Console.WriteLine(result + "Количество не вводится");
	} else {
		result = "True";
		Console.WriteLine(result);
	}

	var result = Device.Click("btnForward");
	Console.WriteLine(result);

	Console.WriteLine(Device
			.GetValue("grScrollView.Controls[0].Controls[0].Controls[0].Text")); //
	var result = Device
			.GetValue("grScrollView.Controls[2].Controls[0].Controls[0].Text");

	result = (result == "Error: Index has to be between upper and lower bound of the array.") ? "True"
			: "False";
	Console.WriteLine(result);

	var result = Device.Click("btnForward");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("Order_Commentary.xml"));

	Console.WriteLine(TextCheck(
			"grScrollView.Controls[2].Controls[0].Controls[1]",
			"Комментарий к заказу c одним прайс-листом "));

	var result = Device.Click("btnForward");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("Main.xml"));

	/*-----------NEW ORDER---------------*/

	Console
			.WriteLine("----------------------------------------------NEW ORDER-------------------------------------");

	var result = Device.Click("btnOrder");
	Console.WriteLine(result + "New orders Check");

	Device.TakeScreenshot("NewOrdersList");

	Console.WriteLine(CheckValue(
			"grScrollView.Controls[0].Controls[0].Controls[0].Text", outlet)
			+ "Проверка отображения нового заказа");

	var result = Device.Click("grScrollView.Controls[0]");
	Console.WriteLine(result);

	var result = Device.GetValue("Orderadd.Controls[0].Controls[0].Text");
	if (result != "0,00") {
		result = "True";
	} else {
		result = "False";
	}
	Console.WriteLine(result);

	var result = Device.Click("Orderadd.Controls[0].Controls[0].Controls[2]");
	var result = Device.GetValue("context.CurrentScreen.Name");
	if (result != "Order.xml") {
		result = "True";
	} else {
		result = "False";
	}
	Console.WriteLine(result + "New orders editing");

	var result = Device.Click("btnBack");
	Console.WriteLine(result);

	var result = Device.Click("grScrollView.Controls[0]");

	var result = Device.GetValue("context.CurrentScreen.Name");
	if (result != "Order.xml") {
		result = "True";
	} else {
		result = "False";
	}
	Console.WriteLine(result + "New orders price-list editing");

	var result = Device.Click("btnBack");
	Console.WriteLine(result);

	Device.Click("grScrollView.Controls[0]");

	var result = Device.GetValue("context.CurrentScreen.Name");
	if (result != "Order.xml") {
		result = "True";
	} else {
		result = "False";
	}
	Console.WriteLine(result + "New orders editing");

	var result = Device.Click("btnBack");
	Console.WriteLine(result);

	Device.TakeScreenshot("NewOrder");

	var result = Device.Click("btnForward");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("Order_Commentary.xml"));

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