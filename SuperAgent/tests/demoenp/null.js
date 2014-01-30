// /* Сменить класс тт на С, прайс-листами и инкассацией.
// */

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
	Console.Terminate(result != screen, "Экран"+ screen +  "не открывается!");

	return result;
}

function main() {

	Console.WriteLine("-----Модуль Расписание------");	
	var result = Device.Click("btnSchedule");
	Stopwatch.Start();
	Console.WriteLine(result);
	
	var result = CheckScreen("ScheduledVisits.xml");
	if (result=="ScheduledVisits.xml") {
		var result = Stopwatch.Stop();
		Console.WriteLine(result.TotalSeconds);
	}
	else{
		Console.WriteLine(result);
	}
	
	var result = Device.Click("btnBack");
	Console.WriteLine(result);	
	
	Console.WriteLine(CheckScreen("Main.xml"));
	
	var result = Device.Click("btnSchedule");
	Console.WriteLine(result);
	
	Console.WriteLine(CheckScreen("ScheduledVisits.xml"));
	
	var result = Device.Click("grScrollView.Controls[2]");
	Console.WriteLine(result);
	
	Console.Pause(500);
	
	Console.WriteLine(CheckScreen("Visit_Outlet.xml"));
	
	var result = Device.Click("grScrollView.Controls[4]"); 
	Console.WriteLine(result);
	
	Console.WriteLine(CheckScreen("ListChoice.xml"));
	
	var result = Device.Click("btnBack");
	Console.WriteLine(result);
	
	Console.WriteLine(CheckScreen("Visit_Outlet.xml"));
	
	var result = Device.Click("grScrollView.Controls[4]"); 
	Console.WriteLine(result);
	
	Console.WriteLine(CheckScreen("ListChoice.xml"));
	
	var result = Device.Click("grScrollView.Controls[2]"); 
	Console.WriteLine(result);
	
	Console.WriteLine(CheckScreen("Visit_Outlet.xml"));
	
	var result = Device.Click("grScrollView.Controls[4]"); 
	Console.WriteLine(result);
	
	var result = Device.Click("btnForward");
	Console.WriteLine(result);	
	
	var result=Device.Click("grScrollView.Controls[0]")
	Console.WriteLine(result);
	
	var result=Device.Click("grScrollView.Controls[12]") //Выбор параметра целого типа(Наличие акционных моделей)
	Console.WriteLine(result+"Выбор параметра целого типа(Наличие акционных моделей)");
	
	Console.WriteLine(CheckScreen("OutletParameter.xml"));
	
	var result = Device.Click("btnForward");
	Console.WriteLine(result);
	
	Console.WriteLine(CheckScreen("Visit_Outlet.xml"));
	
	var result=Device.Click("grScrollView.Controls[18]") //Выбор параметра строкового типа(Правильная выклfдка)
	Console.WriteLine(result+"Выбор параметра строкового типа(Правильная выкладка)");
	
	var result = Device.Click("btnBack");
	Console.WriteLine(result);
	
	Console.WriteLine(CheckScreen("Visit_Outlet.xml"));
	
	var result=Device.Click("grScrollView.Controls[14]") //Выбор параметра Логического типа (Оформление витрины samsung)
	Console.WriteLine(result+"Выбор параметра Логического типа (Оформление витрины samsung)");
	
	var result = Device.Click("btnForward");
	Console.WriteLine(result);
	
	Console.Pause(500);
	
	var result = Device.Click("btnForward");
	Console.WriteLine(result);
	
	Console.WriteLine(CheckScreen("Tasks.xml"));
	
	var result = Device.Click("btnBack");
	Console.WriteLine(result);
	
	Console.WriteLine(CheckScreen("Visit_Outlet.xml"));
	
	var result = Device.Click("btnForward");
	Console.WriteLine(result);
	
	Console.WriteLine(CheckScreen("Tasks.xml"));
	
	var result=Device.Click("grScrollView.Controls[0]"); // Task
	Console.WriteLine(result+"Task");
	
	Console.WriteLine(CheckScreen("Visit_Task.xml"));
	
	var result = Device.Click("btnForward");
	Console.WriteLine(result);
	
	var result=Device.Click("grScrollView.Controls[0]"); // Task
	Console.WriteLine(result+"Task");
	
	Console.WriteLine(CheckScreen("Visit_Task.xml"));
	
	var result = Device.Click("btnBack");
	Console.WriteLine(result);
	
	var result = Device.Click("btnForward"); // Переход к экрану Общих вопросов
	Console.WriteLine(result+"Переход к экрану Общих вопросов");
	
	Console.WriteLine(CheckScreen("Visit_Questions.xml"));
	
	var result = Device.Click("btnBack");
	Console.WriteLine(result);
	
	Console.WriteLine(CheckScreen("Tasks.xml"));
	
	var result = Device.Click("btnForward");
	Console.WriteLine(result);
	
	Console.WriteLine(CheckScreen("Visit_Questions.xml"));
	
	var result=Device.Click("grScrollView.Controls[0]"); // Question (string)
	Console.WriteLine(result+"Question (string)");
	
	Console.WriteLine(CheckScreen("Visit_Question.xml"));

	var result = Device.Click("btnForward");
	Console.WriteLine(result);
	
	Console.WriteLine(CheckScreen("Visit_Questions.xml"));
	
	var result=Device.Click("grScrollView.Controls[6]"); // Question (Int)
	Console.WriteLine(result+"Question (Int)");
	
	var result = Device.Click("btnBack");
	Console.WriteLine(result);
	
	Console.WriteLine(CheckScreen("Visit_Questions.xml"));
	
	var result=Device.Click("grScrollView.Controls[2]"); // Question (Boolean)
	Console.WriteLine(result+"Question (Boolean)");
	
	var result = Device.Click("btnForward");
	Console.WriteLine(result);	
	
	var result=Device.Click("grScrollView.Controls[4]"); // Question (Decimal)
	Console.WriteLine(result+"Question (Decimal)");
	
	var result = Device.Click("btnForward");
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
	
	var result=Device.Click("grScrollView.Controls[0]"); // SKU question 
	Console.WriteLine(result+"SKU question ");	
	
	Console.WriteLine(CheckScreen("Visit_SKU.xml"));
	
	var result = Device.Click("btnBack");
	Console.WriteLine(result);
	
	Console.WriteLine(CheckScreen("Visit_SKUs.xml"));
	
	var result=Device.Click("grScrollView.Controls[0]"); // SKU question 
	Console.WriteLine(result+"SKU question ");	
	
	Console.WriteLine(CheckScreen("Visit_SKU.xml"));
	
	var result = Device.Click("btnForward");
	Console.WriteLine(result);	
	
	Console.WriteLine(CheckScreen("Visit_SKUs.xml"));
	
	var result = Device.Click("btnForward");
	Console.WriteLine(result);	
	
	Console.WriteLine(CheckScreen( "Order.xml"));
	
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
	
	
	/*VISIT-----------------------------------------------------------------------------------------------------------------------------------*/
	
	Console.WriteLine("-----Модуль Визит------");	
	
	var result = Device.Click("btnVisit");
	Stopwatch.Start();
	Console.WriteLine(result);
	
	var result = CheckScreen("Outlets.xml");
	if (result=="Outlets.xml") {
		var result = Stopwatch.Stop();
		Console.WriteLine(result.TotalSeconds);
	}
	else{
		Console.WriteLine(result);
	}
	
	var result = Device.Click("btnBack");
	Console.WriteLine(result);
	
	Console.WriteLine(CheckScreen("Main.xml"));
	
	var result = Device.Click("btnVisit");
	Console.WriteLine(result);
	
	Console.Pause(500);
	
	Console.WriteLine(Search("edtSearch", "Альба"));
	
	Console.Pause(500);
	
	var result = Device.Click("grScrollView.Controls[0]");
	Console.WriteLine(result);
	
	Console.WriteLine(CheckScreen("Visit_Outlet.xml"));
	
	var result = Device.Click("grScrollView.Controls[4]"); 
	Console.WriteLine(result);
	
	Console.WriteLine(CheckScreen("ListChoice.xml"));
	
	var result = Device.Click("btnBack");
	Console.WriteLine(result);
	
	Console.WriteLine(CheckScreen("Visit_Outlet.xml"));
	
	var result = Device.Click("grScrollView.Controls[4]"); 
	Console.WriteLine(result);
	
	Console.WriteLine(CheckScreen("ListChoice.xml"));
	
	var result = Device.Click("grScrollView.Controls[2]"); 
	Console.WriteLine(result);
	
	Console.WriteLine(CheckScreen("Visit_Outlet.xml"));
	
	var result = Device.Click("grScrollView.Controls[4]"); 
	Console.WriteLine(result);
	
	var result = Device.Click("btnForward");
	Console.WriteLine(result);	
	
	var result=Device.Click("grScrollView.Controls[0]")
	Console.WriteLine(result);
	
	var result=Device.Click("grScrollView.Controls[12]") //Выбор параметра целого типа(Наличие акционных моделей)
	Console.WriteLine(result+"Выбор параметра целого типа(Наличие акционных моделей)");
	
	Console.WriteLine(CheckScreen("OutletParameter.xml"));
	
	var result = Device.Click("btnForward");
	Console.WriteLine(result);
	
	Console.WriteLine(CheckScreen("Visit_Outlet.xml"));
	
	var result=Device.Click("grScrollView.Controls[18]") //Выбор параметра строкового типа(Правильная выклfдка)
	Console.WriteLine(result+"Выбор параметра строкового типа(Правильная выкладка)");
	
	var result = Device.Click("btnBack");
	Console.WriteLine(result);
	
	Console.WriteLine(CheckScreen("Visit_Outlet.xml"));
	
	var result=Device.Click("grScrollView.Controls[14]") //Выбор параметра Логического типа (Оформление витрины samsung)
	Console.WriteLine(result+"Выбор параметра Логического типа (Оформление витрины samsung)");
	
	var result = Device.Click("btnForward");
	Console.WriteLine(result);
	
	Console.Pause(500);
	
	var result = Device.Click("btnForward");
	Console.WriteLine(result);
	
	Console.WriteLine(CheckScreen("Tasks.xml"));
	
	var result = Device.Click("btnBack");
	Console.WriteLine(result);
	
	Console.WriteLine(CheckScreen("Visit_Outlet.xml"));
	
	var result = Device.Click("btnForward");
	Console.WriteLine(result);
	
	Console.WriteLine(CheckScreen("Tasks.xml"));
	
	var result=Device.Click("grScrollView.Controls[0]"); // Task
	Console.WriteLine(result+" Task");
	
	Console.WriteLine(CheckScreen("Visit_Task.xml"));
	
	var result = Device.Click("btnForward");
	Console.WriteLine(result);
	
	var result=Device.Click("grScrollView.Controls[0]"); // Task
	Console.WriteLine(result+" Task");
	
	Console.WriteLine(CheckScreen("Visit_Task.xml"));
	
	var result = Device.Click("btnBack");
	Console.WriteLine(result);
	
	var result = Device.Click("btnForward"); // Переход к экрану Общих вопросов
	Console.WriteLine(result+"Переход к экрану Общих вопросов");
	
	Console.WriteLine(CheckScreen("Visit_Questions.xml"));
	
	var result = Device.Click("btnBack");
	Console.WriteLine(result);
	
	Console.WriteLine(CheckScreen("Tasks.xml"));
	
	var result = Device.Click("btnForward");
	Console.WriteLine(result);
	
	Console.WriteLine(CheckScreen("Visit_Questions.xml"));
	
	var result=Device.Click("grScrollView.Controls[0]"); // Question (string)
	Console.WriteLine(result+"Question (string)");
	
	Console.WriteLine(CheckScreen("Visit_Question.xml"));

	var result = Device.Click("btnForward");
	Console.WriteLine(result);
	
	Console.WriteLine(CheckScreen("Visit_Questions.xml"));
	
	var result=Device.Click("grScrollView.Controls[6]"); // Question (Int)
	Console.WriteLine(result+"Question (Int)");
	
	var result = Device.Click("btnBack");
	Console.WriteLine(result);
	
	Console.WriteLine(CheckScreen("Visit_Questions.xml"));
	
	var result=Device.Click("grScrollView.Controls[2]"); // Question (Boolean)
	Console.WriteLine(result+"Question (Boolean)");
	
	var result = Device.Click("btnForward");
	Console.WriteLine(result);	
	
	Console.Pause(500);
	
	var result=Device.Click("grScrollView.Controls[4]"); // Question (Decimal)
	Console.WriteLine(result+"Question (Decimal)");
	
	var result = Device.Click("btnForward");
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
	
	var result = Device.Click("btnBack");
	Console.WriteLine(result);
	
	Console.WriteLine(CheckScreen("Visit_Questions.xml"));
	
	var result = Device.Click("btnForward");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("Visit_SKUs.xml"));
	
	var result=Device.Click("grScrollView.Controls[0]"); // SKU question 
	Console.WriteLine(result+"SKU question ");	
	
	Console.WriteLine(CheckScreen("Visit_SKU.xml"));
	
	var result = Device.Click("btnBack");
	Console.WriteLine(result);
	
	Console.WriteLine(CheckScreen("Visit_SKUs.xml"));
	
	var result=Device.Click("grScrollView.Controls[0]"); // SKU question 
	Console.WriteLine(result+"SKU question ");	
	
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
	
	
	/*ORDER-----------------------------------------------------------------------------------------------------------*/
	
	Console.WriteLine("-----Модуль Заказ------");	

	var result = Device.Click("btnOrder");
	Stopwatch.Start();
	Console.WriteLine(result);
	
	var result = CheckScreen("OrderList.xml");
	if (result=="OrderList.xml") {
		var result = Stopwatch.Stop();
		Console.WriteLine(result.TotalSeconds);
	}
	else{
		Console.WriteLine(result);
	}
	
	var result = Device.Click("btnBack");
	Console.WriteLine(result);	
	
	Console.WriteLine(CheckScreen("Main.xml"));
	
	var result = Device.Click("btnOrder");
	Console.WriteLine(result);
	
	Console.Pause(500);
	
	var result = Device.Click("btnForward");
	Console.WriteLine(result);	
	
	Console.Pause(500);
	
	var result = Device.GetValue("context.CurrentScreen.Name");
	if (result =="OrderList.xml") {
		result="True";
		Console.WriteLine(result);	
	}
	else {
		Console.Terminate(result != "OrderList.xml", "На экране OrderList не заблокирован переход вперед!");
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
	
	Console.WriteLine(CheckScreen("Order_Commentary.xml"));
	
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
	if (result=="Outlets.xml") {
		result="True";
		Console.WriteLine(result);	
	}
	else {
		Console.Terminate(result !="Outlets.xml", "На экране Outlets не заблокирован переход вперед!");
	}
	
	Console.Pause(500);
	
	Console.WriteLine(Search("edtSearch", "Альба"));
	
	Console.Pause(500);
	
	
	var result = Device.Click("grScrollView.Controls[0]");
	Console.WriteLine(result);
	
	Console.WriteLine(CheckScreen("Order.xml"));
	
	var result=Device.Click("grScrollView.Controls[0]"); // Price-list
	Console.WriteLine(result+"Price-list");
	
	Console.Pause(500);
	
	Console.WriteLine(CheckScreen("ListChoice.xml"));
	
	var result = Device.Click("btnForward");
	Console.WriteLine(result);	
	
	Console.Pause(500);
	
	Console.WriteLine(CheckScreen("Order.xml"));
	
	var result=Device.Click("grScrollView.Controls[0]"); // Price-list
	Console.WriteLine(result+"Price-list");
	
	var result = Device.Click("btnBack");
	Console.WriteLine(result);	
	
	Console.WriteLine(CheckScreen("Order.xml"));
	
	var result=Device.Click("grScrollView.Controls[0]"); // Price-list
	Console.WriteLine(result+"Price-list");
	
	var result=Device.Click("grScrollView.Controls[0]"); // Choose Price-list
	Console.WriteLine(result+"Choose Price-list");
	
	Console.WriteLine(CheckScreen("Order.xml"));
	
	var result=Device.Click("Orderadd"); // Order
	Stopwatch.Start();
	Console.WriteLine(result);
	
	var result = CheckScreen("Order_SKUs.xml");
	if (result=="OrderSKUs.xml") {
		var result = Stopwatch.Stop();
		Console.WriteLine(result.TotalSeconds);
	}
	else{
		Console.WriteLine(result);
	}
	
	var result = Device.Click("btnBack");
	Console.WriteLine(result);	
	
	Console.WriteLine(CheckScreen("Order.xml"));
	
	var result=Device.Click("Orderadd"); // Order
	Console.WriteLine(result);
	
	var result = Device.Click("btnForward");
	Console.WriteLine(result);	
	
	Console.WriteLine(CheckScreen("Order.xml"));
	
	var result=Device.Click("Orderadd"); // Order
	Console.WriteLine(result+"Order");
	
	var result=Device.Click("grScrollView.Controls[6]"); // Add SKU to Order
	Console.WriteLine(result);
	
	Console.WriteLine(CheckScreen("Features.xml"));
	
	var result=Device.Click("grScrollView.Controls[2]"); // Choose feature
	Console.WriteLine(result);
	
	Console.Pause(500);
	
	Console.WriteLine(CheckScreen("Order_EditSKU.xml"));
	
	var result = Device.Click("btnBack");
	Console.WriteLine(result);	
	
	Console.WriteLine(CheckScreen("Features.xml"));
	
	var result = Device.Click("btnBack");
	Console.WriteLine(result);	
	
	Console.Pause(500);
	
	Console.WriteLine(CheckScreen("Order_SKUs.xml"));
	
	var result=Device.Click("grScrollView.Controls[2]"); // Add SKU to Order
	Console.WriteLine(result+"Add SKU to Order");
	
	Console.Pause(500);
	
	var result=Device.Click("btnForward");
	Console.WriteLine(result);	
	
	Console.Pause(500);
	
	Console.WriteLine(CheckScreen("Order.xml"));
	
	var result = Device.Click("btnForward");
	Console.WriteLine(result);	
	
	Console.Pause(500);
	
	Console.WriteLine(CheckScreen("Order_Commentary.xml"));
	
	var result = Device.Click("btnBack");
	Console.WriteLine(result);	
	
	Console.WriteLine(CheckScreen("Order.xml"));
	
	var result = Device.Click("btnForward");
	Console.WriteLine(result);	
	
	Console.Pause(500);
	
	var result = Device.Click("btnForward");
	Console.WriteLine(result);	
	
	Console.WriteLine(CheckScreen("Main.xml"));
	
	/*	-------------Outlets	--------------------------------------------------*/
	Console.WriteLine("-----Модуль Магазин------");	
	
	var result = Device.Click("btnOutlets");
	Stopwatch.Start();
	Console.WriteLine(result);
	
	var result = CheckScreen("Outlets_Outlets.xml");
	if (result=="Outlets_Outlets.xml") {
		var result = Stopwatch.Stop();
		Console.WriteLine(result.TotalSeconds);
	}
	else{
		Console.WriteLine(result);
	}
	
	
	var result = Device.Click("btnBack");
	Console.WriteLine(result);
	
	Console.WriteLine(CheckScreen("Main.xml"));
	
	var result = Device.Click("btnOutlets");
	Console.WriteLine(result);
	
	/*var result = Device.Click("NewOutlet");
	Console.WriteLine(result);
	
	Console.WriteLine(CheckScreen("Outlet.xml"));
	
	var result = Device.Click("btnForward");
	Console.WriteLine(result);
	
	*/
	
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
	
	var result=Device.Click("grScrollView.Controls[0]")
	Console.WriteLine(result);
	
	var result=Device.Click("grScrollView.Controls[14]") //Выбор параметра целого типа(Наличие акционных моделей)
	Console.WriteLine(result+"Выбор параметра целого типа(Наличие акционных моделей)");
	
	Console.WriteLine(CheckScreen("OutletParameter.xml"));
	
	var result = Device.Click("btnForward");
	Console.WriteLine(result);
	
	Console.WriteLine(CheckScreen("Outlet.xml"));
	
	var result=Device.Click("grScrollView.Controls[20]") //Выбор параметра строкового типа(Правильная выклfдка)
	Console.WriteLine(result+"Выбор параметра строкового типа(Правильная выкладка)");
	
	var result = Device.Click("btnBack");
	Console.WriteLine(result);
	
	Console.WriteLine(CheckScreen("Outlet.xml"));
	
	var result=Device.Click("grScrollView.Controls[16]") //Выбор параметра Логического типа (Оформление витрины samsung)
	Console.WriteLine(result+"Выбор параметра Логического типа (Оформление витрины samsung)");
	
	/*var result = Device.Click("btnForward");
	Console.WriteLine(result);	//Обращение к диалоговому окну
	*/
	
	var result = Device.Click("btnForward");
	Console.WriteLine(result);
	
	Console.Pause(500);
	
	var result = Device.Click("btnBack");
	Console.WriteLine(result);
	
	Console.WriteLine(CheckScreen("Main.xml"));
	
	/*------------------Tasks---------------------------*/
	
	Console.WriteLine("-----Модуль Задачи----");	
	
	var result = Device.Click("btnTodo");
	Stopwatch.Start();
	Console.WriteLine(result);
	
	var result = CheckScreen("Tasks.xml");
	if (result=="Tasks.xml") {
		var result = Stopwatch.Stop();
		Console.WriteLine(result.TotalSeconds);
	}
	else{
		Console.WriteLine(result);
	}
	
	var result = Device.Click("btnBack");
	Console.WriteLine(result);
	
	Console.WriteLine(CheckScreen("Main.xml"));
	
	var result = Device.Click("btnTodo");
	Console.WriteLine(result);
	
	var result = Device.Click("grScrollView.Controls[0]");
	Console.WriteLine(result);
	
	Console.WriteLine(CheckScreen("Task.xml"));
	
	var result = Device.Click("btnBack");
	Console.WriteLine(result+"Назад");
	
	Console.WriteLine(CheckScreen("Tasks.xml"));
	
	var result = Device.Click("grScrollView.Controls[0]");
	Console.WriteLine(result);
	
	var result = Device.Click("btnForward");
	Console.WriteLine(result);
	
	Console.Pause(500);
	
	Console.WriteLine(CheckScreen("Tasks.xml"));
	
	Console.Pause(1000);
	
	var result = Device.Click("btnForward");
	Console.WriteLine(result+"Вперед");
	
	var result = Device.GetValue("context.CurrentScreen.Name");
	if (result=="Tasks.xml") {
		var result = Device.Click("btnBack");
		Console.WriteLine(result);
	}
	else {
		Console.Terminate(result != "Tasks.xml", "Кнопка Вперед не заблокирована!");
	}
	
	Console.Pause(500);
	
	Console.WriteLine(CheckScreen("Main.xml"));
	
	/*-------------------------------------KPI--------------------------------------*/
	
	Console.WriteLine("-----Модуль KPI----");	
	
	var result = Device.Click("btnKpi");
	Console.WriteLine(result);
	
	var result = Device.GetValue("context.CurrentScreen.Name");
	Console.Terminate(result != "Main.xml", "Кнопка Цели не заблокирована!");
	
	/*-------------------------------------Stocks--------------------------------------*/
	
	Console.WriteLine("-----Модуль Stocks----");	
	
	var result = Device.Click("btnDistr");
	Stopwatch.Start();
	Console.WriteLine(result);
	
	var result = CheckScreen("Stock_SKUs.xml");
	if (result=="Stock_SKUs.xml") {
	var result = Stopwatch.Stop();
	Console.WriteLine(result.TotalSeconds);
	}
	else{
	Console.WriteLine(result);
	}
	
	var result=Device.Click("btnBack");
	Console.WriteLine(result);
	
	Console.WriteLine(CheckScreen("Main.xml"));
	
	var result = Device.Click("btnDistr");
	Console.WriteLine(result);
	
	var result = Device.Click("grScrollView.Controls[2]");
	Console.WriteLine(result);
	
	Console.WriteLine(CheckScreen("SKU_Image.xml"));
	
	var result=Device.Click("btnBack");
	Console.WriteLine(result);
	
	Console.WriteLine(CheckScreen("Stock_SKUs.xml"));
	
	var result = Device.Click("grScrollView.Controls[2]");
	Console.WriteLine(result);
	
	var result=Device.Click("btnForward");
	Console.WriteLine(result);
	
	var result = Device.GetValue("context.CurrentScreen.Name");	
	if (result=="SKU_Image.xml") {
	var result = Device.Click("btnBack");
	Console.WriteLine(result);
	}
	else {
	Console.Terminate(result != "SKU_Image.xml", "Кнопка Вперед не заблокирована!");
	}
	
	var result=Device.Click("btnForward");
	Console.WriteLine(result);
	
	var result = Device.GetValue("context.CurrentScreen.Name");	
	if (result=="Stock_SKUs.xml") {
	var result = Device.Click("btnBack");
	Console.WriteLine(result);
	}
	else {
	Console.Terminate(result != "Stock_SKUs.xml", "Кнопка Вперед не заблокирована!");
	}
	
	Console.WriteLine(CheckScreen("Main.xml"));
	
	/*-------------------------------------Settings-------------------------------------*/
	
	Console.WriteLine("-----Модуль Settings---");	
	
	var result = Device.Click("btnSettings");
	Console.WriteLine(result);
	
	var result = Device.GetValue("context.CurrentScreen.Name");
	Console.Terminate(result != "Main.xml", "Кнопка Настройки не заблокирована!");
	
	/*-------------------------------------Sync-------------------------------------*/
	
	Console.WriteLine("-----Модуль Sync---");	
	
	var result = Device.Click("btnSync");
	Console.WriteLine(result);
}