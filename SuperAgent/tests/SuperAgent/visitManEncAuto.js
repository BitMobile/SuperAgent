/* Меридиан  без задач, вопросов , вопросов по SKU, но с прайс-листами и инкассацией.
Инкассация  ручная затем авто

Итог: Инкассация с атрибутами: 55, 654. С пустыми полями документа

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

function main() {

	var result = Device.Click("btnVisit");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("Outlets.xml"));

	Console.WriteLine(TextCheck("edtSearch", "мерид"));

	var result = Device.Click("btnSearch");
	Console.WriteLine(result);

	var result = Device.Click("grScrollView.Controls[0]");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("Outlet.xml"));

	var outlet = Device.GetValue("workflow[outlet].Description");
	Console.WriteLine(CheckValue(
			"headerDescr.Controls[0].Controls[0].Controls[0].Controls[0].Text",
			outlet));

	Console.Pause(500);

	var result = Device.Click("btnForward");
	Console.WriteLine(result);

	Console.Pause(500);

	Console.WriteLine(CheckScreen("Tasks.xml"));

	var result = Device
			.GetValue("grScrollView.Controls[0].Controls[0].Controls[0].Text"); // Task
	if (result == "Задач нет") {
		result = "True";
	} else {
		result = "False";
	}

	Console.WriteLine(result + "No task");

	var result = Device.Click("btnForward"); // Переход к экрану Общих
												// вопросов
	Console.WriteLine(result + "Переход к экрану Общих вопросов");

	Console.WriteLine(CheckScreen("Visit_Questions.xml"));

	var result = Device
			.GetValue("grScrollView.Controls[0].Controls[0].Controls[0].Text"); // Questions
	if (result == "Вопросов нет") {
		result = "True";
	} else {
		result = "False";
	}

	Console.WriteLine(result + "  No questions");

	var result = Device.Click("btnForward");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("Visit_SKUs.xml"));

	var result = Device
			.GetValue("grScrollView.Controls[0].Controls[0].Controls[0].Text"); // SKU
																				// question
	if (result == "Вопросов нет") {
		result = "True";
	} else {
		result = "False";
	}
	Console.WriteLine(result + "No SKU questions ");

	var result = Device.Click("btnForward");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("Order.xml"));

	Console.Pause(500);

	var result = Device.Click("btnForward");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("Order_Commentary.xml"));

	var result = Device.Click("btnForward");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("Receivables.xml"));

	var result = Device.Click("grScrollView.Controls[2]"); // Just Spread
	Console.WriteLine(result);

	/* Just manually */

	Console.WriteLine(Device
			.GetValue("grScrollView.Controls[0].Controls[0].Controls[0].Text"));

	Console.WriteLine(CheckValue(
			"grScrollView.Controls[0].Controls[0].Controls[0].Text", "709"));

	Console.WriteLine(Device
			.GetValue("grScrollView.Controls[0].Controls[1].Controls[0].Text"));

	Console.WriteLine(CheckValue(
			"grScrollView.Controls[0].Controls[1].Controls[0].Text", "0"));

	Console.WriteLine(Device
			.GetValue("grScrollView.Controls[4].Controls[0].Controls[1].Text"));
	Console.WriteLine(CheckValue(
			"grScrollView.Controls[4].Controls[0].Controls[1].Text",
			"Сумма документа: 55,00"));

	Console.WriteLine(Device
			.GetValue("grScrollView.Controls[6].Controls[0].Controls[1].Text"));
	Console.WriteLine(CheckValue(
			"grScrollView.Controls[6].Controls[0].Controls[1].Text",
			"Сумма документа: 654,00"));

	var result = Device.Click("grScrollView.Controls[4]");
	Console.WriteLine(result);

	Console.WriteLine(CheckValue(
			"grScrollView.Controls[4].Controls[0].Controls[0].Text", "0"));

	Console.WriteLine(TextCheck(
			"grScrollView.Controls[4].Controls[0].Controls[0]", "24"));

	var result = Device.Click("btnForward");
	Console.WriteLine(result);

	Console.WriteLine(Device
			.GetValue("grScrollView.Controls[4].Controls[0].Controls[1].Text"));
	Console.WriteLine(CheckValue(
			"grScrollView.Controls[4].Controls[0].Controls[1].Text",
			"Сумма инкассации: 24"));

	Console.WriteLine(CheckValue(
			"grScrollView.Controls[0].Controls[1].Controls[0].Text", "24")); // Общая
																				// сумма
																				// инкассации

	/* проверка при повторном входе */

	var result = Device.Click("grScrollView.Controls[4]");
	Console.WriteLine(result);

	Console.WriteLine(CheckValue(
			"grScrollView.Controls[4].Controls[0].Controls[0].Text", "24"));

	var result = Device.Click("btnBack");
	Console.WriteLine(result);

	/* ручной ввод суммы второго документа */
	var result = Device.Click("grScrollView.Controls[6]");
	Console.WriteLine(result);

	Console.WriteLine(CheckValue(
			"grScrollView.Controls[4].Controls[0].Controls[0].Text", "0"));

	Console.WriteLine(TextCheck(
			"grScrollView.Controls[4].Controls[0].Controls[0]", "1654"));

	var result = Device.Click("btnForward");
	Console.WriteLine(result);

	Console.WriteLine(Device
			.GetValue("grScrollView.Controls[4].Controls[0].Controls[1].Text"));
	Console.WriteLine(CheckValue(
			"grScrollView.Controls[4].Controls[0].Controls[1].Text",
			"Сумма инкассации: 24"));

	Console.WriteLine(Device
			.GetValue("grScrollView.Controls[6].Controls[0].Controls[1].Text"));
	Console.WriteLine(CheckValue(
			"grScrollView.Controls[6].Controls[0].Controls[1].Text",
			"Сумма инкассации: 1654"));

	Console.WriteLine(Device
			.GetValue("grScrollView.Controls[0].Controls[1].Controls[0].Text"));
	Console.WriteLine(CheckValue(
			"grScrollView.Controls[0].Controls[1].Controls[0].Text", "1678")); // Общая
																				// сумма
																				// инкассации

	/* Auto */

	var result = Device.Click("grScrollView.Controls[2]"); // Just Spread
	Console.WriteLine(result);

	Console.WriteLine(Device
			.GetValue("grScrollView.Controls[4].Controls[0].Controls[1].Text"));
	Console.WriteLine(CheckValue(
			"grScrollView.Controls[4].Controls[0].Controls[1].Text",
			"Сумма инкассации: 55,00"));

	Console.WriteLine(Device
			.GetValue("grScrollView.Controls[6].Controls[0].Controls[1].Text"));
	Console.WriteLine(CheckValue(
			"grScrollView.Controls[6].Controls[0].Controls[1].Text",
			"Сумма инкассации: 654,00"));

	Console.WriteLine(Device
			.GetValue("grScrollView.Controls[0].Controls[1].Controls[0].Text"));
	Console.WriteLine(CheckValue(
			"grScrollView.Controls[0].Controls[1].Controls[0].Text", "1678")); // Общая
																				// сумма
																				// инкассации

	Device.TakeScreenshot("ManAutoEnc");

	var result = Device.Click("btnForward");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("Visit_Total.xml"));

	var result = Device.Click("btnForward");
	Console.WriteLine(result);

	Console.Pause(500);

	Console.WriteLine(CheckScreen("Main.xml"));

}