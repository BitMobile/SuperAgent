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
	Console.Terminate(result != screen, " Экран " + screen + " не открывается!");

	return result;
}

function RunStopWatch(StartButton, StopScreen) {
	Device.Click(StartButton);
	Stopwatch.Start();
	do {
		var CurrScreen = Device.GetValue("context.CurrentScreen.Name");
	} while (CurrScreen != StopScreen);
	var result = Stopwatch.Stop();
	Console.WriteLine(result.TotalSeconds + " "+ StopScreen + "  loading time");

}


function main() {


	Console.WriteLine("-----Модуль Расписание------");
	
	RunStopWatch("btnSchedule", "ScheduledVisits.xml");
	
	var result = Device.Click("btnBack");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("Main.xml"));

	var result = Device.Click("btnSchedule");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("ScheduledVisits.xml"));

	RunStopWatch("grScrollView.Controls[2]", "Outlet.xml");
	
	RunStopWatch("grScrollView.Controls[4]", "ListChoice.xml");
	
	var result = Device.Click("btnBack");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("Outlet.xml"));

	var result = Device.Click("grScrollView.Controls[4]");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("ListChoice.xml"));

	RunStopWatch("grScrollView.Controls[2]", "Outlet.xml");
	
	var result = Device.Click("grScrollView.Controls[4]");
	Console.WriteLine(result);

	var result = Device.Click("btnForward");
	Console.WriteLine(result);

	var result = Device.Click("grScrollView.Controls[0]");
	Console.WriteLine(result);

	RunStopWatch("grScrollView.Controls[12]", "OutletParameter.xml"); //Выбор параметра целого типа(Наличие акционных моделей)
	
	var result = Device.Click("btnForward");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("Outlet.xml"));

	var result = Device.Click("grScrollView.Controls[18]");// Выбор параметра строкового типа(Правильная выклfдка)
	Console.WriteLine(result
			+ "Выбор параметра строкового типа(Правильная выкладка)");

	var result = Device.Click("btnBack");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("Outlet.xml"));

	var result = Device.Click("grScrollView.Controls[14]");// Выбор параметра Логического типа (Оформление витрины samsung)
	Console.WriteLine(result
			+ "Выбор параметра Логического типа (Оформление витрины samsung)");

	var result = Device.Click("btnForward");
	Console.WriteLine(result);

	RunStopWatch("btnForward", "Tasks.xml");
	
	var result = Device.Click("btnBack");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("Outlet.xml"));

	var result = Device.Click("btnForward");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("Tasks.xml"));
	
	RunStopWatch("grScrollView.Controls[0]", "Visit_Task.xml");

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

	var result = Device.Click("Orderadd.Controls[0].Controls[0].Controls[0]");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("Order_Info.xml"));

	Console.WriteLine(Device.Click("grScrollView.Controls[2]"));

	var CheckCurrentScreen = CheckScreen("Order_Info.xml");
	var result = (CheckCurrentScreen == "Order_Info.xml") ? "True" : "False";
	Console.WriteLine(result);

	var result = Device.Click("btnForward");
	Console.WriteLine(result);

	var result = Device.Click("btnForward");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("Receivables.xml"));

	var result = Device.Click("btnBack");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("Order.xml"));

	var result = Device.Click("btnForward");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("Receivables.xml"));

	var result = Device.Click("btnForward");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("Visit_Total.xml"));
	
	Console.WriteLine(Device.Click("grScrollView.Controls[8]"));
	
	Console.WriteLine(CheckScreen("ListChoice.xml"));
	
	Console.WriteLine(Device.Click("grScrollView.Controls[0]"));

	var result = Device.Click("btnBack");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("Receivables.xml"));

	var result = Device.Click("btnForward");
	Console.WriteLine(result);

	var result = Device.Click("btnForward");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("Main.xml"));

	/*VISIT-----------------------------------------------------------------------------------------------------------------------------------*/

	Console.WriteLine("-----Модуль Визит------");

	RunStopWatch("btnVisit", "Outlets.xml");

	var result = Device.Click("btnBack");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("Main.xml"));

	var result = Device.Click("btnVisit");
	Console.WriteLine(result);

	Console.WriteLine(Search("edtSearch", "Альба"));

	var result = Device.Click("grScrollView.Controls[0]");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("Outlet.xml"));

	var result = Device.Click("grScrollView.Controls[4]");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("ListChoice.xml"));

	var result = Device.Click("btnBack");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("Outlet.xml"));

	var result = Device.Click("grScrollView.Controls[4]");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("ListChoice.xml"));

	var result = Device.Click("grScrollView.Controls[2]");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("Outlet.xml"));

	var result = Device.Click("grScrollView.Controls[4]");
	Console.WriteLine(result);

	var result = Device.Click("btnForward");
	Console.WriteLine(result);

	var result = Device.Click("grScrollView.Controls[0]");
	Console.WriteLine(result);

	var result = Device.Click("grScrollView.Controls[12]"); //Выбор параметра целого типа(Наличие акционных моделей)
	Console.WriteLine(result
			+ "Выбор параметра целого типа(Наличие акционных моделей)");

	Console.WriteLine(CheckScreen("OutletParameter.xml"));

	var result = Device.Click("btnForward");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("Outlet.xml"));

	var result = Device.Click("grScrollView.Controls[18]"); //Выбор параметра строкового типа(Правильная выклfдка)
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

	var result = Device.Click("btnForward");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("Tasks.xml"));

	var result = Device.Click("btnBack");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("Outlet.xml"));

	var result = Device.Click("btnForward");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("Tasks.xml"));

	var result = Device.Click("grScrollView.Controls[0]"); // Task
	Console.WriteLine(result + " Task");

	Console.WriteLine(CheckScreen("Visit_Task.xml"));

	var result = Device.Click("btnForward");
	Console.WriteLine(result);

	var result = Device.Click("grScrollView.Controls[0]"); // Task
	Console.WriteLine(result + " Task");

	Console.WriteLine(CheckScreen("Visit_Task.xml"));

	var result = Device.Click("btnBack");
	Console.WriteLine(result);

	var result = Device.Click("btnForward");
	// Переход к экрану Общих вопросов
	Console.WriteLine(result + "Переход к экрану Общих вопросов");

	Console.WriteLine(CheckScreen("Visit_Questions.xml"));

	var result = Device.Click("btnBack");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("Tasks.xml"));

	var result = Device.Click("btnForward");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("Visit_Questions.xml"));

	var result = Device.Click("btnForward");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("Visit_SKUs.xml"));

	var result = Device.Click("btnBack");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("Visit_Questions.xml"));

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

	Console.WriteLine(CheckScreen("Receivables.xml"));

	var result = Device.Click("btnBack");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("Order.xml"));

	var result = Device.Click("btnForward");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("Receivables.xml"));

	var result = Device.Click("btnForward");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("Visit_Total.xml"));

	Console.WriteLine(Device.Click("grScrollView.Controls[8]"));
	
	Console.WriteLine(CheckScreen("ListChoice.xml"));
	
	Console.WriteLine(Device.Click("grScrollView.Controls[0]"));
	
	var result = Device.Click("btnBack");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("Receivables.xml"));

	var result = Device.Click("btnForward");
	Console.WriteLine(result);

	var result = Device.Click("btnForward");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("Main.xml"));

	/*ORDER-----------------------------------------------------------------------------------------------------------*/

	Console.WriteLine("-----Модуль Заказ------");

	RunStopWatch("btnOrder", "OrderList.xml");
		var result = Device.Click("btnBack");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("Main.xml"));

	var result = Device.Click("btnOrder");
	Console.WriteLine(result);

	var result = Device.Click("btnForward");
	Console.WriteLine(result);

	var CurrentScreenName = Device.GetValue("context.CurrentScreen.Name");
	if (CurrentScreenName == "OrderList.xml") {
		result = "True";
		Console.WriteLine(result);
	} else {
		Console.Terminate(CurrentScreenName != "OrderList.xml",
				"На экране OrderList не заблокирован переход вперед!");
	}

	var result = Device.Click("grScrollView.Controls[0]");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("Order.xml"));

	var result = Device.Click("btnForward");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("Order_Commentary.xml"));

	var result = Device.Click("btnBack");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("Order.xml"));

	var result = Device.Click("btnForward");
	Console.WriteLine(result);

	var result = Device.Click("btnForward");
	Console.WriteLine(result);

	
	Console.WriteLine(CheckScreen("Main.xml"));

	var result = Device.Click("btnOrder");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("OrderList.xml"));

	var result = Device.Click("NewOrder");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("Outlets.xml"));

	var result = Device.Click("btnForward");
	Console.WriteLine(result);

	var result = Device.GetValue("context.CurrentScreen.Name");
	if (result == "Outlets.xml") {
		result = "True";
		Console.WriteLine(result);
	} else {
		Console.Terminate(result != "Outlets.xml",
				"На экране Outlets не заблокирован переход вперед!");
	}

	Console.WriteLine(Search("edtSearch", "Альба"));

	var result = Device.Click("grScrollView.Controls[0]");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("Order.xml"));

	RunStopWatch("Orderadd.Controls[0].Controls[0].Controls[2]","Order_SKUs.xml");

	var result = Device.Click("btnBack");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("Order.xml"));

	var result = Device.Click("Orderadd.Controls[0].Controls[0].Controls[2]");// Order
	Console.WriteLine(result);

	var result = Device.Click("btnForward");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("Order.xml"));

	var result = Device.Click("Orderadd.Controls[0].Controls[0].Controls[2]");// Order
	Console.WriteLine(result + "Order");

	var result = Device.Click("grScrollView.Controls[6]"); // Add SKU to Order
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("Order_EditSKU.xml"));

	var result = Device.Click("btnBack");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("Order_SKUs.xml"));

	var result = Device.Click("grScrollView.Controls[4]"); // Add SKU to Order
	Console.WriteLine(result + "Add SKU to Order");

	var result = Device.Click("btnForward");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("Order.xml"));

	var result = Device.Click("btnForward");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("Main.xml"));

	/*	-------------Outlets	--------------------------------------------------*/
	Console.WriteLine("-----Модуль Магазин------");

	RunStopWatch("btnOutlets", "Outlets.xml");
	
	var result = Device.Click("btnBack");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("Main.xml"));

	var result = Device.Click("btnOutlets");
	Console.WriteLine(result);

	var result = Device.Click("NewOutlet.Controls[0].Controls[0]");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("Outlet.xml"));

	var result = Device.Click("grScrollView.Controls[0]");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("Outlet.xml"));

	var result = Device.Click("grScrollView.Controls[6]");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("ListChoice.xml"));

	var result = Device.Click("btnBack");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("Outlet.xml"));

	var result = Device.Click("grScrollView.Controls[6]");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("ListChoice.xml"));

	var result = Device.Click("grScrollView.Controls[2]");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("Outlet.xml"));

	var result = Device.Click("grScrollView.Controls[6]");
	Console.WriteLine(result);

	var result = Device.Click("btnForward");
	Console.WriteLine(result);

	var result = Device.Click("grScrollView.Controls[0]");
	Console.WriteLine(result);

	var result = Device.Click("grScrollView.Controls[14]"); //Выбор параметра целого типа(Наличие акционных моделей)
	Console.WriteLine(result
			+ "Выбор параметра целого типа(Наличие акционных моделей)");

	Console.WriteLine(CheckScreen("OutletParameter.xml"));

	var result = Device.Click("btnForward");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("Outlet.xml"));

	var result = Device.Click("grScrollView.Controls[20]"); //Выбор параметра строкового типа(Правильная выклfдка)
	Console.WriteLine(result
			+ "Выбор параметра строкового типа(Правильная выкладка)");

	var result = Device.Click("btnBack");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("Outlet.xml"));

	var result = Device.Click("grScrollView.Controls[16]"); //Выбор параметра Логического типа (Оформление витрины samsung)
	Console.WriteLine(result
			+ "Выбор параметра Логического типа (Оформление витрины samsung)");

	var result = Device.Click("btnForward");
	Console.WriteLine(result);

	var result = Device.Click("btnBack");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("Main.xml"));

	/*------------------Tasks---------------------------*/

	Console.WriteLine("-----Модуль Задачи----");

	RunStopWatch("btnTodo", "Tasks.xml");
	
	var result = Device.Click("btnBack");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("Main.xml"));

	var result = Device.Click("btnTodo");
	Console.WriteLine(result);

	var result = Device.Click("grScrollView.Controls[0]");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("Task.xml"));

	var result = Device.Click("btnBack");
	Console.WriteLine(result + "Назад");

	Console.WriteLine(CheckScreen("Tasks.xml"));

	var result = Device.Click("grScrollView.Controls[0]");
	Console.WriteLine(result);

	var result = Device.Click("btnForward");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("Tasks.xml"));

	var result = Device.Click("btnForward");
	Console.WriteLine(result + "Вперед");

	var CurrentScreenName = Device.GetValue("context.CurrentScreen.Name");
	if (CurrentScreenName == "Tasks.xml") {
		var result = Device.Click("btnBack");
		Console.WriteLine(result);
	} else {
		Console.Terminate(CurrentScreenName != "Tasks.xml",
				"Кнопка Вперед не заблокирована!");
	}

	Console.WriteLine(CheckScreen("Main.xml"));

	/*-------------------------------------KPI--------------------------------------*/

	Console.WriteLine("-----Модуль KPI----");

	var result = Device.Click("btnKpi");
	Console.WriteLine(result);

	var result = Device.GetValue("context.CurrentScreen.Name");
	Console.Terminate(result != "Main.xml", "Кнопка Цели не заблокирована!");

	/*-------------------------------------Stocks--------------------------------------*/

	Console.WriteLine("-----Модуль Stocks----");

	RunStopWatch("btnDistr", "Stock_SKUs.xml");
	
	var result = Device.Click("btnBack");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("Main.xml"));

	var result = Device.Click("btnDistr");
	Console.WriteLine(result);

	var result = Device.Click("grScrollView.Controls[2]");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("SKU_Image.xml"));

	var result = Device.Click("btnBack");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("Stock_SKUs.xml"));

	var result = Device.Click("grScrollView.Controls[2]");
	Console.WriteLine(result);

	var result = Device.Click("btnForward");
	Console.WriteLine(result);

	var CurrentScreeName= Device.GetValue("context.CurrentScreen.Name");
	if (CurrentScreeName == "SKU_Image.xml") {
		var result = Device.Click("btnBack");
		Console.WriteLine(result);
	} else {
		Console.Terminate(CurrentScreeName != "SKU_Image.xml",
				"Кнопка Вперед не заблокирована!");
	}

	var result = Device.Click("btnForward");
	Console.WriteLine(result);

	var CurrentScreeName = Device.GetValue("context.CurrentScreen.Name");
	if (CurrentScreeName == "Stock_SKUs.xml") {
		var result = Device.Click("btnBack");
		Console.WriteLine(result);
	} else {
		Console.Terminate(CurrentScreeName != "Stock_SKUs.xml",
				"Кнопка Вперед не заблокирована!");
	}

	Console.WriteLine(CheckScreen("Main.xml"));

	/*-------------------------------------Sync pics-------------------------------------*/

	Console.WriteLine("-----Модуль Sync pics---");

	var result = Device.Click("btnSettings");
	Console.WriteLine(result);

	

	/*-------------------------------------Sync-------------------------------------*/

	Console.WriteLine("-----Модуль Sync---");

	var result = Device.Click("btnSync");
	Console.WriteLine(result);
}