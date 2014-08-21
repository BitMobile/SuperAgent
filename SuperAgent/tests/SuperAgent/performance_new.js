/*Precondition - Сделать тесты под 3 пользователями. У первого пользователя нет плана визитов, у второго есть на 50 т.т. , у третьего 500 т.т.  */
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

	if (result1 == result2 && result1 == result3 && result1 == result4 && result1 == "True") {
		result = "True";
	} else {
		result = result1 + "; " + result2 + "; " + result3 + "; " + result4;
	}
	return result;
	Console.WriteLine(result);
}

function main() {

	Console.WriteLine("-----Outlet with empty screens(Алиев ИП)------");
	
	RunStopWatch("swipe_layout.Controls[0].Controls[1]", "Visit\\Visits.xml");
	
	RunStopWatch("btnMenu", "Main.xml");
	
	RunStopWatch("swipe_layout.Controls[0].Controls[1]", "Visit\\Visits.xml");
		
	var result = Device.Click("unPlanned");
	Console.WriteLine(result);
	
	RunStopWatch("grScrollView.Controls[6]", "Outlets\\Outlet.xml");
	
	RunStopWatch("btnForward", "Order\\Order.xml");
	
	RunStopWatch("grScrollView.Controls[2]", "Order_Info.xml");
		
	var result = Device.Click("btnDone");
	Console.WriteLine(result);
	
	Console.WriteLine(CheckScreen("Order\\Order.xml"));
	
	RunStopWatch("btnAdd", "Order\\Order_SKUs.xml");
		
	Console.WriteLine(CheckScreen("Order\\Order_SKUs.xml"));
	
	RunStopWatch("grScrollView.Controls[2]", "Order_EditSKU.xml");
	
	var result = Device.Click("btnCancel");
	Console.WriteLine(result);
		
	Console.WriteLine(CheckScreen("Order\\Order_SKUs.xml"));	
	
	var result = Device.Click("btnDone");
	Console.WriteLine(result);
	
	Console.WriteLine(CheckScreen("Order\\Order.xml"));
	
	RunStopWatch("btnForward", "Receivables.xml");
	
	RunStopWatch("btnForward", "Visit\\Total.xml");
		
	RunStopWatch("btnForward", "Visit\\Visits.xml");
	
	

	/*VISIT-----------------------------------------------------------------------------------------------------------------------------------*/

	Console.WriteLine("-----Outlet with 50 lists screens(ГиперМаркет Призма)------");

	RunStopWatch("grScrollView.Controls[8]", "Outlets\\Outlet.xml");
	
	RunStopWatch("btnForward", "Visit\\Tasks.xml");
		
	RunStopWatch("grScrollView.Controls[2].Controls[1]", "Visit\\Task.xml");
	
	Console.WriteLine(CheckScreen("Visit\\Task.xml"));
	
	var result = Device.Click("btnDone");
	Console.WriteLine(result);
	
	Console.WriteLine(CheckScreen("Visit\\Tasks.xml"));
	
	RunStopWatch("btnForward", "Visit\\Questions.xml");

	RunStopWatch("btnForward", "Visit\\SKUs.xml");
		
	RunStopWatch("btnForward", "Order\\Order.xml");
		
	RunStopWatch("btnForward", "Receivables.xml");
		
	RunStopWatch("btnForward", "Visit\\Total.xml");
	
	RunStopWatch("btnForward", "Visit\\Visits.xml");
	
		
	/*------------------------Outlet with 500 lists screens----------------------------------*/
	
	Console.WriteLine("-----Outlet with 500 lists screens ООО Болеро ------");
	
	var result=Search("edtSearch", "болеро");
	Console.WriteLine(result);
	

	RunStopWatch("grScrollView.Controls[0]", "Outlets\\Outlet.xml");
	
	RunStopWatch("btnForward", "Visit\\Tasks.xml");
		
	RunStopWatch("grScrollView.Controls[2].Controls[1]", "Visit\\Task.xml");
	
	Console.WriteLine(CheckScreen("Visit\\Task.xml"));
	
	var result = Device.Click("btnDone");
	Console.WriteLine(result);
	
	Console.WriteLine(CheckScreen("Visit\\Tasks.xml"));
	
	RunStopWatch("btnForward", "Visit\\Questions.xml");
	
	RunStopWatch("btnForward", "Visit\\SKUs.xml");
	
	RunStopWatch("grScrollView.Controls[2]", "Visit\\SKU.xml");
	
	Console.WriteLine(CheckScreen("Visit\\SKU.xml"));
	
	var result = Device.Click("btnDone");
	Console.WriteLine(result);
	
	Console.WriteLine(CheckScreen("Visit\\SKUs.xml"));
	
	RunStopWatch("btnForward", "Order\\Order.xml");
		
	RunStopWatch("btnForward", "Receivables.xml");
	
	RunStopWatch("btnForward", "Visit\\Total.xml");
	
	RunStopWatch("btnForward", "Visit\\Visits.xml");
	
	RunStopWatch("btnMenu", "Main.xml");


	/*ORDER-----------------------------------------------------------------------------------------------------------*/

	Console.WriteLine("-----Модуль Заказ------");

	RunStopWatch("swipe_layout.Controls[0].Controls[5]", "Order\\OrderList.xml");
	
	RunStopWatch("grScrollView.Controls[2]", "Order\\Order.xml");
	
	var result = Device.Click("btnBack");
	Console.WriteLine(result);
		
	Console.WriteLine("Order with 50 SKUs");	
	
	RunStopWatch("grScrollView.Controls[4]", "Order\\Order.xml");
	
	Console.WriteLine("Order with 500 SKUs");
	
	var result = Device.Click("btnBack");
	Console.WriteLine(result);
		
	RunStopWatch("btnAdd", "Outlets\\Outlets.xml");
	
	RunStopWatch("grScrollView.Controls[2]", "Order.xml");
			
	RunStopWatch("grScrollView.Controls[2]", "Order_Info.xml");
	
	var result = Device.Click("btnDone");
	Console.WriteLine(result);
	
	Console.WriteLine(CheckScreen("Order.xml"));
	
	RunStopWatch("btnAdd", "Order_SKUs.xml");
		
	RunStopWatch("grScrollView.Controls[2]", "Order_EditSKU.xml");
	
	var result = Device.Click("btnCancel");
	Console.WriteLine(result);
	
	Console.WriteLine(CheckScreen("Order_SKUs.xml"));	
	
	var result = Device.Click("btnDone");
	Console.WriteLine(result);
	
	Console.WriteLine(CheckScreen("Order.xml"));
	
	var result = Device.Click("btnForward");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("Outlets\\Outlets.xml"));
	
	var result = Device.Click("btnBack");
	Console.WriteLine(result);

	RunStopWatch("btnMenu", "Main.xml");

	
	/*	-------------Outlets	with 50 contacts--------------------------------------------------*/
	Console.WriteLine("-----Модуль Клиенты------");

	RunStopWatch("swipe_layout.Controls[0].Controls[3]", "Outlets\\Outlets.xml");
	
	var result = Device.Click("btnMenu");
	Console.WriteLine(result);

	RunStopWatch("swipe_layout.Controls[0].Controls[3]", "Outlets\\Outlets.xml");

	var result = Device.Click("btnAdd");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("Outlets\\CreateOutlet.xml"));
	
	var result = Device.Click("btnCancel");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("Outlets\\Outlets.xml"));
		
	RunStopWatch("grScrollView.Controls[2]", "Outlets\\Outlet.xml");
	
	RunStopWatch("btnContacts", "ContactsList.xml");
	
	RunStopWatch("btnBack", "Outlets\\Outlet.xml");

	RunStopWatch("btnDetails", "Details.xml");
	
	var result = Device.Click("btnDone");
	Console.WriteLine(result);
	
	RunStopWatch("btnBack", "Outlets\\Outlets.xml");
	
		
	/*	-------------Outlets	with 500 contacts--------------------------------------------------*/
	
	
	var result = Device.Click("grScrollView.Controls[4]");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("Outlets\\Outlet.xml"));

	RunStopWatch("grScrollView.Controls[4]", "Outlets\\Outlet.xml");
	
	RunStopWatch("btnContacts", "ContactsList.xml");
	
	RunStopWatch("btnBack", "Outlets\\Outlet.xml");

	RunStopWatch("btnDetails", "Details.xml");
	
	var result = Device.Click("btnDone");
	Console.WriteLine(result);
	
	RunStopWatch("btnBack", "Outlets\\Outlets.xml");	
	RunStopWatch("btnMenu", "Main.xml");
	
	Console.WriteLine(CheckScreen("Main.xml"));

	/*-------------------------------------Sync-------------------------------------*/

	Console.WriteLine("-----Модуль Sync------");
	
	var result = Device.Click("swipe_layout.Controls[0].Controls[7]");
	Console.WriteLine(result);
		
	var result = Device.Click("btnMenu");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("Main.xml"));
}