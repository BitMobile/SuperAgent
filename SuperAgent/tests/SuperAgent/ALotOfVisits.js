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

function RunStopWatch(StartButton, StopScreen) {
	Device.Click(StartButton);
	Stopwatch.Start();
	do {
		var CurrScreen = Device.GetValue("context.CurrentScreen.Name");
	} while (CurrScreen != StopScreen);
	var result = Stopwatch.Stop();
	Console.WriteLine(result.TotalSeconds + StopScreen + "  loading time");

}

function main() {
	i = 0;
	while (true) {

		i++;
		Console.WriteLine(i);

		var result = Device.Click("btnVisit");
		Console.WriteLine(result);

		Console.WriteLine(CheckScreen("Outlets.xml"));

		Console.WriteLine(TextCheck("edtSearch", "Торг 45"));

		var result = Device.Click("btnSearch");
		Console.WriteLine(result);

		var result = Device.Click("grScrollView.Controls[0]");
		Console.WriteLine(result);

		Console.WriteLine(CheckScreen("Visit_Outlet.xml"));

		var result = Device
				.SetFocus("headerDescr.Controls[0].Controls[0].Controls[0].Controls[0]"); // Проверка
																							// изменения
																							// названия
																							// т.т.
																							// из
																							// мобильного
																							// приложения
		Console.WriteLine(result
				+ "Проверка изменения названия т.т. из мобильного приложения");

		var result = Device.SetText(
				"headerDescr.Controls[0].Controls[0].Controls[0].Controls[0]",
				"Наименование не вводится"); // Проверка изменения названия
												// т.т. из мобильного приложения
		if (result == "False") {
			result = "True";
		}
		Console.WriteLine(result);

		Console.WriteLine(TextCheck(
				"grScrollView.Controls[0].Controls[0].Controls[0]",
				"Новый адрес"));

		// Вставить установку координат

		var result = Device.Click("grScrollView.Controls[4]");
		Console.WriteLine(result);

		Console.WriteLine(CheckScreen("ListChoice.xml"));

		var result = Device.Click("grScrollView.Controls[4]"); // Выбор класса
																// т.т.
		Console.WriteLine(result + "Выбор класса т.т.");

		var result = Device.Click("grScrollView.Controls[0]");
		Console.WriteLine(result);

		var result = Device.Click("grScrollView.Controls[12]"); // Выбор
																// параметра
																// целого
																// типа(Наличие
																// акционных
																// моделей)
		Console.WriteLine(result
				+ "Выбор параметра целого типа(Наличие акционных моделей)");

		Console.WriteLine(CheckScreen("OutletParameter.xml"));

		Console.WriteLine(TextCheck("grScrollView.Controls[2].Controls[0]",
				"1254"));

		var result = Device.Click("btnForward");
		Console.WriteLine(result);

		Console.Pause(500);

		Console.WriteLine(CheckScreen("Visit_Outlet.xml"));

		var result = Device.Click("grScrollView.Controls[18]"); // Выбор
																// параметра
																// строкового
																// типа(Правильная
																// выклfдка)
		Console.WriteLine(result
				+ "Выбор параметра строкового типа(Правильная выкладка)");

		Console.WriteLine(TextCheck("grScrollView.Controls[2].Controls[0]",
				"String"));

		var result = Device.Click("btnBack");
		Console.WriteLine(result);

		Console.WriteLine(CheckScreen("Visit_Outlet.xml"));

		var result = Device.Click("grScrollView.Controls[38]"); // Выбор
																// параметра
																// Десятичного
																// типа (Размер
																// дебиторской
																// задолженности)
		Console
				.WriteLine(result
						+ "Выбор параметра Десятичного типа (Размер дебиторской задолженности)");

		Console.WriteLine(TextCheck("grScrollView.Controls[2].Controls[0]",
				"125.4"));

		var result = Device.Click("btnForward");
		Console.WriteLine(result);

		var result = Device.Click("grScrollView.Controls[14]"); // Выбор
																// параметра
																// Логического
																// типа
																// (Оформление
																// витрины
																// samsung)
		Console
				.WriteLine(result
						+ "Выбор параметра Логического типа (Оформление витрины samsung)");

		var result = Device.Click("grScrollView.Controls[2].Controls[0]");
		Console.WriteLine(result);

		// Проверка отображения данных либо "?"

		var result = Device.Click("btnForward");
		Console.WriteLine(result);

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

		var result = Device.Click("grScrollView.Controls[0]"); // Price-list
		Console.WriteLine(result + "Price-list");

		Console.WriteLine(CheckScreen("ListChoice.xml"));

		var result = Device.Click("grScrollView.Controls[0]"); // Choose
																// Price-list
		Console.WriteLine(result + "Choose Price-list");

		Console.Pause(500);

		Console.WriteLine(CheckScreen("Order.xml"));

		RunStopWatch("Orderadd", "Order_SKUs.xml");
		
		var result = Device.SetFocus("grScrollView.Controls[0]"); // Checking
																	// groups
		Console.WriteLine(result + "Checking groups");

		var result = Device.Click("grScrollView.Controls[2]"); // Add SKU to
																// Order
		Console.WriteLine(result);

		Console.WriteLine(CheckScreen("Order_EditSKU.xml"));

		var result = Device
				.SetFocus("grScrollView.Controls[4].Controls[0].Controls[0]"); // Quantity
		Console.WriteLine(result);

		var result = Device.SetText(
				"grScrollView.Controls[4].Controls[0].Controls[0]", "54"); // Quantity
		Console.WriteLine(result + "Quantity");

		var result = Device.Click("btnForward");
		Console.WriteLine(result);

		Console.Pause(500);

		var result = Device.Click("btnForward");
		Console.WriteLine(result);

		Console.WriteLine(CheckScreen("Visit_Order_Commentary.xml"));

		Console.WriteLine(TextCheck(
				"grScrollView.Controls[0].Controls[0].Controls[2]",
				"Комментарий к заказу  " + i));

		var result = Device.Click("btnForward");
		Console.WriteLine(result);

		Console.WriteLine(CheckScreen("Receivables.xml"));

		Console.WriteLine(TextCheck(
				"grScrollView.Controls[0].Controls[1].Controls[0]", "54")); // Quantity

		var result = Device.Click("grScrollView.Controls[2]");
		Console.WriteLine(result);

		var result = Device.Click("btnForward");
		Console.WriteLine(result);

		Console.WriteLine(CheckScreen("Visit_Total.xml"));

		var result = Device
				.GetValue("Controls[2].Controls[0].Controls[0].Text");
		if (result == "0 of 0") {
			result = "True";
		} else {
			result = "False";
		}

		var result = Device
				.GetValue("Controls[4].Controls[0].Controls[0].Text");
		if (result == "0 of 0") {
			result = "True";
		} else {
			result = "False";
		}

		Device.TakeScreenshot("Total");

		var result = Device.Click("btnForward");
		Console.WriteLine(result);

		Console.Pause(500);

		Console.WriteLine(CheckScreen("Main.xml"));

	}
}