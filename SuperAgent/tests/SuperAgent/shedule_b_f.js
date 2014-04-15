// /* Сменить класс тт на С, прайс-листами и инкассацией.
// */

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
	Console.Terminate(result != screen, "Экран" + screen + "не открывается!");

	return result;
}

function main() {
	Console.CommandPause = 500;

	Console.WriteLine("-----Модуль Расписание------");
	var result = Device.Click("btnSchedule");
	Console.WriteLine(result);

	var result = CheckScreen("ScheduledVisits.xml");
	Console.WriteLine(result);
	
	var result = Device.Click("btnBack");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("Main.xml"));

	var result = Device.Click("btnSchedule");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("ScheduledVisits.xml"));

	var result = Device.Click("grScrollView.Controls[2]");
	Console.WriteLine(result);

	var result = CheckScreen("Outlet.xml");
	Console.WriteLine(result);
	

	var result = Device.Click("grScrollView.Controls[4]");
	Console.WriteLine(result);

	var result = CheckScreen("ListChoice.xml");
	Console.WriteLine(result);
	

	var result = Device.Click("btnBack");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("Outlet.xml"));

	var result = Device.Click("grScrollView.Controls[4]");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("ListChoice.xml"));

	var result = Device.Click("grScrollView.Controls[2]");
	Console.WriteLine(result);

	var result = CheckScreen("Outlet.xml");
	Console.WriteLine(result);
	

	var result = Device.Click("grScrollView.Controls[4]");
	Console.WriteLine(result);

	var result = Device.Click("btnForward");
	Console.WriteLine(result);

	var result = Device.Click("grScrollView.Controls[0]");
	Console.WriteLine(result);

	var result = Device.Click("grScrollView.Controls[12]"); //Выбор параметра целого типа(Наличие акционных моделей)
	Console.WriteLine(result
			+ "Выбор параметра целого типа(Наличие акционных моделей)");

	var result = CheckScreen("OutletParameter.xml");
	Console.WriteLine(result);
	
	var result = Device.Click("btnForward");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("Outlet.xml"));

	var result = Device.Click("grScrollView.Controls[18]");//Выбор параметра строкового типа(Правильная выклfдка)
	Console.WriteLine(result
			+ "Выбор параметра строкового типа(Правильная выкладка)");

	var result = Device.Click("btnBack");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("Outlet.xml"));

	var result = Device.Click("grScrollView.Controls[14]"); //Выбор параметра Логического типа (Оформление витрины samsung)
	Console.WriteLine(result
			+ "Выбор параметра Логического типа (Оформление витрины samsung)");

	var result = Device.Click("btnForward");
	Console.WriteLine(result);

	Console.Pause(500);

	var result = Device.Click("btnForward");
	Console.WriteLine(result);

	var result = CheckScreen("Tasks.xml");
	Console.WriteLine(result);
	

	var result = Device.Click("btnBack");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("Outlet.xml"));

	var result = Device.Click("btnForward");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("Tasks.xml"));

	var result = Device.Click("grScrollView.Controls[0]"); // Task
	Console.WriteLine(result + "Task");

	var result = CheckScreen("Visit_Task.xml");
	Console.WriteLine(result);
	

	var result = Device.Click("btnForward");
	Console.WriteLine(result);

	var result = Device.Click("grScrollView.Controls[0]"); // Task
	Console.WriteLine(result + "Task");

	Console.WriteLine(CheckScreen("Visit_Task.xml"));

	var result = Device.Click("btnBack");
	Console.WriteLine(result);

	var result = Device.Click("btnForward"); // Переход к экрану Общих вопросов
	Console.WriteLine(result + "Переход к экрану Общих вопросов");

	Console.WriteLine(CheckScreen("Visit_Questions.xml"));

	var result = Device.Click("btnBack");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("Tasks.xml"));

	var result = Device.Click("btnForward");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("Visit_Questions.xml"));

	var result = Device.Click("grScrollView.Controls[10]"); // Question (List )
	Console.WriteLine(result + "Question (List)");
	Console.WriteLine(CheckScreen("ListChoice.xml"));

	var result = Device.Click("btnForward");
	Console.WriteLine(result);

	var result = Device.Click("grScrollView.Controls[10]"); // Question (List )
	Console.WriteLine(result + "Question (List)");

	var result = Device.Click("btnBack");
	Console.WriteLine(result);

	var result = Device.Click("grScrollView.Controls[10]"); // Question (List )
	Console.WriteLine(result + "Question (List)");

	var result = Device.Click("grScrollView.Controls[2]");
	Console.WriteLine(result);

	Console.Pause(500);

	var result = Device.Click("btnForward");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("Visit_SKUs.xml"));

	var result = Device.Click("btnBack");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("Visit_Questions.xml"));

	var result = Device.Click("btnForward");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("Visit_SKUs.xml"));

	var result = Device.Click("grScrollView.Controls[0]"); // SKU question 
	Console.WriteLine(result + "SKU question ");

	Console.WriteLine(CheckScreen("Visit_SKU.xml"));

	var result = Device.Click("btnBack");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("Visit_SKUs.xml"));

	var result = Device.Click("grScrollView.Controls[0]"); // SKU question 
	Console.WriteLine(result + "SKU question ");

	Console.WriteLine(CheckScreen("Visit_SKU.xml"));

	var result = Device.Click("btnForward");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("Visit_SKUs.xml"));

	var result = Device.Click("btnForward");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("Order.xml"));

	var result = Device.Click("btnForward");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("Visit_Order_Commentary.xml"));

	var result = Device.Click("btnBack");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("Order.xml"));

	var result = Device.Click("btnForward");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("Visit_Order_Commentary.xml"));

	var result = Device.Click("btnForward");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("Receivables.xml"));

	var result = Device.Click("btnBack");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("Visit_Order_Commentary.xml"));

	var result = Device.Click("btnForward");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("Receivables.xml"));

	var result = Device.Click("btnForward");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("Visit_Total.xml"));

	var result = Device.Click("btnBack");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("Receivables.xml"));

	var result = Device.Click("btnForward");
	Console.WriteLine(result);

	Console.Pause(500);

	var result = Device.Click("btnForward");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("Main.xml"));
}