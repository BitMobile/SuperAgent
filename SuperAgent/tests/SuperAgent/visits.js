/* Создать визит с задачей, вопросами , вопросами по SKU, прайс-листами и инкассацией.
 */
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

function CheckScreen(screen) {

	var result = Device.GetValue("context.CurrentScreen.Name");
	Console.Terminate(result != screen, "Экран" + screen + "не открывается!");

	return result;
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

function getRandomArbitary(min, max) {
	return Math.round(Math.random() * (max - min) + min);
}

function ClickAndCheck(type, path, value, screen, description) {

	if (type == "string" || type == "integer" || type == "decimal") {

		Console.WriteLine("---------------" + type + "---------------------");
		Console.WriteLine(type + "--" + path + "--" + value + "--" + screen
				+ "--" + description);
		var result = Device.Click(path);

		Console.WriteLine(result + description);

		Console.WriteLine(CheckScreen(screen));

		Console.WriteLine(TextCheck("grScrollView.Controls[2].Controls[0]",
				value));

		var result = Device.Click("btnForward");
		Console.WriteLine(result);

		var PathWithText = path + ".Controls[0].Controls[0].Text";
		Console.WriteLine(CheckValue(PathWithText, value));

		var result = Device.Click(path);

		Console.WriteLine(CheckValue(
				"grScrollView.Controls[2].Controls[0].Text", value));

		var result = Device.Click("btnForward");
		Console.WriteLine(result);

		Console.WriteLine(CheckValue(PathWithText, value));
	}

	else if (type == "bool") {
		Console.WriteLine("---------------" + type + "---------------------");
		var result = Device.Click(path);
		Console.WriteLine(result + description);

		if (value == "Да") {
			var result = Device.Click("grScrollView.Controls[2].Controls[1]");
			Console.WriteLine(result);
		} else if (value == "Нет") {
			var result = Device.Click("grScrollView.Controls[2].Controls[2]");
			Console.WriteLine(result);
		}

		var result = Device
				.GetValue("grScrollView.Controls[2].Controls[0].Controls[0].Text");
		if (result == value) {
			var result = "True";
			Console.WriteLine(result + " Result= " + value);
			var result = Device.Click("btnForward");
			Console.WriteLine(result);

			var PathWithText = path + ".Controls[0].Controls[0].Text";
			Console.WriteLine(CheckValue(PathWithText, value));

			var result = Device.Click(path);// Проверка повторного входа на
			// экран
			Console.WriteLine(result);

			var result = CheckValue(
					"grScrollView.Controls[2].Controls[0].Controls[0].Text",
					value);
			Console.WriteLine(result);

			var result = Device.Click("btnForward");
			Console.WriteLine(result);
			Console.WriteLine(CheckValue(PathWithText, value));
		}

		else {
			var result = "False";
			Console.WriteLine(result + "Выбранное значение не отображается");
		}
	}

	else if (type == "valueList") {
		Console.WriteLine("---------------" + type + "---------------------");
		Console.WriteLine(type + "--" + path + "--" + value + "--" + screen
				+ "--" + description);

		var result = Device.Click(path);
		Console.WriteLine(result);

		Console.WriteLine(CheckScreen(screen));

		var PathWithText = value + ".Controls[0].Controls[0].Text";
		Console.WriteLine(PathWithText);
		var ChoosenValue = Device.GetValue(PathWithText);
		Console.WriteLine(ChoosenValue);

		var result = Device.Click(value); // Выбор класса т.т.
		Console.WriteLine(result + description);

		var PathWithText = path + ".Controls[0].Controls[0].Text";
		var result = Device.GetValue(PathWithText);
		Console.WriteLine(result);

		Console.WriteLine(CheckValue(PathWithText, ChoosenValue));

	}

	else if (type == "task") {
		var result = Device.Click(path); // Task
		Console.WriteLine(result + description);

		var result = Device.Click("btnBack");
		Console.WriteLine(result);

		Console.WriteLine(CheckScreen(screen));

		var result = Device.Click(path); // Task
		Console.WriteLine(result + "Task");

		Console.Pause(500);

		Console.WriteLine(CheckScreen("Visit_Task.xml"));

		var result = Device
				.Click("grScrollView.Controls[2].Controls[0].Controls[0]"); // Task
		// -
		// result
		Console.WriteLine(result + "Task - result");

		var result = Device.Click("btnForward");
		Console.WriteLine(result);
	}

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

	var n = getRandomArbitary(1, 865);
	Console.WriteLine(n);

	var result = Device.Click("btnVisit");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("Outlets.xml"));

	Console.WriteLine(TextCheck("edtSearch", "болеро"));

	var result = Device.Click("btnSearch");
	Console.WriteLine(result);

	var result = Device.Click("grScrollView.Controls[0]");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("Outlet.xml"));

	var outlet = Device.GetValue("workflow[outlet].Description");
	Console.WriteLine(CheckValue(
			"headerDescr.Controls[0].Controls[0].Controls[0].Controls[0].Text",
			outlet));

	var result = TextCheck(
			"headerDescr.Controls[0].Controls[0].Controls[0].Controls[0]",
			"Наименование"); // Проверка изменения названия т.т. из
	// мобильного приложения
	if (result !== "True; True; True") {
		result = "True";
	}
	Console.WriteLine(result);

	Console.WriteLine(TextCheck(
			"grScrollView.Controls[0].Controls[0].Controls[0]", "Новый адрес"
					+ n));

	// Вставить установку координат

	ClickAndCheck("valueList", "grScrollView.Controls[4]",
			"grScrollView.Controls[2]", "ListChoice.xml", "Выбор класса т.т.");

	ClickAndCheck("integer", "grScrollView.Controls[12]", n,
			"OutletParameter.xml", "Наличие акционных моделей");

	ClickAndCheck("string", "grScrollView.Controls[18]", n,
			"OutletParameter.xml", "Правильная выкладка");

	ClickAndCheck("decimal", "grScrollView.Controls[38]", "1," + n,
			"OutletParameter.xml", "Размер дебиторской задолженности");

	ClickAndCheck("bool", "grScrollView.Controls[14]", "Да",
			"OutletParameter.xml", "Оформление витрины samsung");

	ClickAndSetDateTime("grScrollView.Controls[22]", "14.04.2014 8:45",
			"14.05.2014 8:45", "Время посещения");

	var result = Device.Click("grScrollView.Controls[10]"); //
	Console.WriteLine(result);

	var result = Device.Click("btnBack");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("Outlet.xml"));

	Console.WriteLine(CheckValue(
			"grScrollView.Controls[10].Controls[0].Controls[0].Text", "?"));

	Console.Pause(500);

	var result = Device.Click("btnForward");
	Console.WriteLine(result);

	Console.Pause(500);

	Console.WriteLine(CheckScreen("Tasks.xml"));

	ClickAndCheck("task", "grScrollView.Controls[0]", n, "Tasks.xml",
			"Ввод результата задачи");

	var result = Device.Click("btnForward"); // Переход к экрану Общих
	// вопросов
	Console.WriteLine(result + "Переход к экрану Общих вопросов");

	Console.WriteLine(CheckScreen("Visit_Questions.xml"));

	// var
	// doubleQuestion=CheckValue("grScrollVIew.Controls[3].Controls[0].Controls[0].Text",
	// "Доля полки %");//Проверка отображения дублирующихся вопросов
	// doubleQuestion= (doubleQuestion=="False")? "True": "False";
	// Console.WriteLine(doubleQuestion);
	// Console.WriteLine("Question (string)");

	// Console.WriteLine(Device.GetValue("grScrollView.Controls[6].Controls[0].Controls[0].Text"));
	// Console.WriteLine(CheckValue("grScrollView.Controls[6].Controls[0].Controls[0].Text","Каталог
	// товара есть в магазине"));// Question string
	// Console.WriteLine(TextCheck("grScrollView.Controls[7].Controls[0].Controls[0]",
	// "String"+n));

	// Console.WriteLine("Question (Int)");
	// Console.WriteLine(CheckValue("grScrollView.Controls[3].Controls[0].Controls[0].Text","Доля
	// полки %")); //Question int
	// Console.WriteLine(TextCheck("grScrollView.Controls[4].Controls[0].Controls[0]","1"+
	// n));

	// Console.WriteLine(result+"Question (Boolean)"); // Question (Boolean)
	// Console.WriteLine(Device.GetValue("grScrollView.Controls[21].Controls[0].Controls[0].Text"));
	// Console.WriteLine(CheckValue("grScrollView.Controls[21].Controls[0].Controls[0].Text","Набор
	// рекомендуемых к размещению POSM установлен"));
	// var
	// result=Device.Click("grScrollView.Controls[22].Controls[0].Controls[0]")

	// Console.WriteLine("Question (Decimal)");
	// Console.WriteLine(Device.GetValue("grScrollView.Controls[24].Controls[0].Controls[0].Text"));
	// Console.WriteLine(CheckValue("grScrollView.Controls[24].Controls[0].Controls[0].Text","Стандарт
	// по доле полки относительно конкурентов выполнен")); // Question (Decimal)
	// Console.WriteLine(TextCheck("grScrollView.Controls[25].Controls[0].Controls[0]",
	// "1."+n));

	// ClickAndCheck("valueList", "grScrollView.Controls[1]",
	// "grScrollView.Controls[2]", "ListChoice.xml", "Ценник у товара
	// присутствует");

	// ClickAndSetDateTime("grScrollView.Controls[16]", "14.04.2014
	// 8:45","14.05.2014 8:45", "Дата и время");

	var result = Device.Click("btnForward");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("Visit_SKUs.xml"));
	Console.WriteLine(Device
			.GetValue("grScrollView.Controls[2].Controls[0].Controls[1].Text"));
	Console
			.WriteLine(CheckValue(
					"grScrollView.Controls[2].Controls[0].Controls[1].Text",
					"500 гр,"));// проверка отображения названия Sku и
	// количества вопросов в нем

	var result = Device.Click("grScrollView.Controls[2]"); // SKU question
	Console.WriteLine(result + "SKU question ");

	Console.WriteLine(CheckScreen("Visit_SKU.xml"));

	var result = Device
			.Click("grScrollView.Controls[0].Controls[0].Controls[0].Controls[1]"); // SKU
	// answer
	// 1
	Console.WriteLine(result + "SKU answer 1");

	Console
			.WriteLine(CheckValue(
					"grScrollView.Controls[0].Controls[0].Controls[0].Controls[0].Controls[0].Text",
					"Да"));

	var result = Device.Click("btnForward");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("Visit_SKUs.xml"));
	Console.WriteLine(Device
			.GetValue("grScrollView.Controls[2].Controls[0].Controls[0].Text"));
	Console.WriteLine(CheckValue(
			"grScrollView.Controls[2].Controls[0].Controls[0].Text", "1 из 7"));

	var result = Device.Click("grScrollView.Controls[2]"); // SKU question
	Console.WriteLine(result + "SKU question "); // Проверка повторного входа
	// на экран

	var result = Device
			.GetValue("grScrollView.Controls[0].Controls[0].Controls[0].Value");
	result = (result == "True") ? "True" : "False";

	var result = Device.Click("btnForward");
	Console.WriteLine(result);

	var result = Device.Click("grScrollView.Controls[4]"); // SKU question
	Console.WriteLine(result + "SKU question ");

	Console.WriteLine(CheckScreen("Visit_SKU.xml"));

	var result = Device
			.Click("grScrollView.Controls[0].Controls[0].Controls[0].Controls[1]"); // SKU
	// answer
	// 1
	Console.WriteLine(result + "SKU answer 1");

	Console.WriteLine(TextCheck(
			"grScrollView.Controls[2].Controls[0].Controls[0]", "1" + n));

	Console.WriteLine(TextCheck(
			"grScrollView.Controls[4].Controls[0].Controls[0]", "14" + n));

	Console.WriteLine(TextCheck(
			"grScrollView.Controls[6].Controls[0].Controls[0]", "5" + n));

	Console.WriteLine(TextCheck(
			"grScrollView.Controls[8].Controls[0].Controls[0]", "12" + n));

	var result = Device
			.Click("grScrollView.Controls[10].Controls[0].Controls[0].Controls[1]"); // SKU
	// answer
	// 5
	Console.WriteLine(result + "SKU answer 5");

	var result = Device.Click("btnForward");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("Visit_SKUs.xml"));

	Console.WriteLine(Device
			.GetValue("grScrollView.Controls[4].Controls[0].Controls[0].Text"));
	Console.WriteLine(CheckValue(
			"grScrollView.Controls[4].Controls[0].Controls[0].Text", "6 из 6"));

	var result = Device.Click("btnForward");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("Order.xml"));

	var result = Device.Click("Orderadd.Controls[0].Controls[0].Controls[2]"); // Order
	Console.WriteLine(result);

	var result = CheckScreen("Order_SKUs.xml");
	Console.WriteLine(result);

	Console.WriteLine(Device
			.GetValue("grScrollView.Controls[0].Controls[0].Controls[0].Text"));
	var result = CheckValue(
			"grScrollView.Controls[0].Controls[0].Controls[0].Text",
			" / Продовольствие"); // Checking groups
	Console.WriteLine(result + "Checking groups");

	var result = Device.Click("grScrollView.Controls[8]"); // Add SKU to Order
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("Order_EditSKU.xml"));

	var result = TextCheck("grScrollView.Controls[2].Controls[1].Controls[0]",
			"54"); // Quantity
	Console.WriteLine(result + "Quantity");

	var result = Device.Click("btnForward");
	Console.WriteLine(result);

	var result = Device.Click("btnForward");
	Console.WriteLine(result);

	var result = Device.Click("btnForward");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("Order_Commentary.xml"));

	Console.WriteLine(TextCheck(
			"grScrollView.Controls[2].Controls[0].Controls[1]",
			"Комментарий к заказу"));

	var result = Device.Click("btnForward");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("Receivables.xml")); // Инкассация

	Console.WriteLine(Device
			.GetValue("grScrollView.Controls[0].Controls[0].Controls[0].Text"));

	Console.WriteLine(CheckValue(
			"grScrollView.Controls[0].Controls[0].Controls[0].Text", "476"));

	Console.WriteLine(Device
			.GetValue("grScrollView.Controls[0].Controls[1].Controls[0].Text"));

	Console.WriteLine(CheckValue(
			"grScrollView.Controls[0].Controls[1].Controls[0].Text", "0"));

	Console.WriteLine(TextCheck(
			"grScrollView.Controls[0].Controls[1].Controls[0]", "462")); // Quantity

	Console.WriteLine(Device
			.GetValue("grScrollView.Controls[4].Controls[0].Controls[1].Text"));
	Console.WriteLine(CheckValue(
			"grScrollView.Controls[4].Controls[0].Controls[1].Text",
			"Сумма документа: 434,00"));

	Console.WriteLine(Device
			.GetValue("grScrollView.Controls[6].Controls[0].Controls[1].Text"));
	Console.WriteLine(CheckValue(
			"grScrollView.Controls[6].Controls[0].Controls[1].Text",
			"Сумма документа: 42,00"));

	var result = Device.Click("grScrollView.Controls[2]");
	Console.WriteLine(result);

	Console.WriteLine(Device
			.GetValue("grScrollView.Controls[4].Controls[0].Controls[1].Text"));
	Console.WriteLine(CheckValue(
			"grScrollView.Controls[4].Controls[0].Controls[1].Text",
			"Сумма инкассации: 434,00"));

	Console.WriteLine(Device
			.GetValue("grScrollView.Controls[6].Controls[0].Controls[1].Text"));
	Console.WriteLine(CheckValue(
			"grScrollView.Controls[6].Controls[0].Controls[1].Text",
			"Сумма инкассации: 28"));

	Console.WriteLine(CheckValue(
			"grScrollView.Controls[0].Controls[0].Controls[0].Text", "476")); // Проверка
	// не
	// изменились
	// ли
	// значения
	// полей,
	// после
	// нажатия
	// на
	// кноку
	// "Распределить
	// на
	// документы"

	Console.WriteLine(CheckValue(
			"grScrollView.Controls[0].Controls[1].Controls[0].Text", "462"));

	var result = Device.Click("btnForward");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("Visit_Total.xml"));

	var result = Device
			.GetValue("grScrollView.Controls[4].Controls[0].Controls[0].Text");
	Console.WriteLine(result);
	if (result == "5 из 9") {
		result = "True";
	} else {
		result = "False";
	}
	Console.WriteLine(result);

	var result = Device
			.GetValue("grScrollView.Controls[6].Controls[0].Controls[0].Text");
	Console.WriteLine(result);
	if (result == "7 из 19") {
		result = "True";
	} else {
		result = "False";
	}

	Console.WriteLine(result);

	Device.TakeScreenshot("Total_Visit");

	var result = Device.Click("btnForward");
	Console.WriteLine(result);

	var CheckMessage = Dialog.GetMessage();

	var result = (CheckMessage == "Причина визита должна быть заполнена") ? "True"
			: "False";
	Console.WriteLine(result);

	Dialog.ClickPositive();

	ClickAndCheck("valueList", "grScrollView.Controls[8]",
			"grScrollView.Controls[0]", "ListChoice.xml",
			"Выбор причины визита");

	var result = Device.Click("btnForward");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("Main.xml"));

}