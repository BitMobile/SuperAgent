/* Создать визит с задачей, вопросами , вопросами по SKU, прайс-листами и инкассацией.
 */

function RunStopWatch(StartButton, StopScreen) {
	Console.WriteLine("Click");
	Device.Click(StartButton);
	Stopwatch.Start();
	do {
		var CurrScreen = Device.GetValue("context.CurrentScreen.Name");
		//Console.WriteLine(CurrScreen+ " == "+ StopScreen);
	} while (CurrScreen != StopScreen);
	var result = Stopwatch.Stop();
	Console.WriteLine(result.TotalSeconds + StopScreen + "  loading time");

}

function CheckScreen(screen) {

	var result = Device.GetValue("context.CurrentScreen.Name");
	Console.Terminate(result != screen, " Экран " + screen + " не открывается!");
	return result;
}

function main() {

	RunStopWatch("swipe_layout.Controls[0].Controls[5]", "Order\\OrderList.xml");

	RunStopWatch("btnAdd", "Outlets\\Outlets.xml");
	
	RunStopWatch("grScrollView.Controls[2]", "Order.xml");

	RunStopWatch("btnAdd", "Order_SKUs.xml");
	
	RunStopWatch("grScrollView.Controls[2]", "Order_EditSKU.xml");
	
	var result = Device.Click("btnAdd");
	Console.WriteLine(result);
	
    Console.WriteLine(CheckScreen("Order_SKUs.xml"));	
	
	var result = Device.Click("btnDone");
	Console.WriteLine(result);
	
	Console.WriteLine(CheckScreen("Order.xml"));
	
	var result = Device.Click("btnForward");
	Console.WriteLine(result);
	
	Console.WriteLine(CheckScreen("Outlets\\Outlets.xml"));
	
	RunStopWatch("btnAdd", "Outlets\\Outlets.xml");
	
	RunStopWatch("grScrollView.Controls[2]", "Order.xml");

	RunStopWatch("btnAdd", "Order_SKUs.xml");
	
	RunStopWatch("grScrollView.Controls[2]", "Order_EditSKU.xml");
	
	var result = Device.Click("btnAdd");
	Console.WriteLine(result);
	
    Console.WriteLine(CheckScreen("Order_SKUs.xml"));	
	
	var result = Device.Click("btnDone");
	Console.WriteLine(result);
	
	Console.WriteLine(CheckScreen("Order.xml"));
	
	var result = Device.Click("btnForward");
	Console.WriteLine(result);
	
	Console.WriteLine(CheckScreen("Outlets\\Outlets.xml"));
	
	RunStopWatch("btnAdd", "Outlets\\Outlets.xml");
	
	RunStopWatch("grScrollView.Controls[2]", "Order.xml");

	RunStopWatch("btnAdd", "Order_SKUs.xml");
	
	RunStopWatch("grScrollView.Controls[2]", "Order_EditSKU.xml");
	
	var result = Device.Click("btnAdd");
	Console.WriteLine(result);
	
    Console.WriteLine(CheckScreen("Order_SKUs.xml"));	
	
	var result = Device.Click("btnDone");
	Console.WriteLine(result);
	
	Console.WriteLine(CheckScreen("Order.xml"));
	
	var result = Device.Click("btnForward");
	Console.WriteLine(result);
	
	Console.WriteLine(CheckScreen("Outlets\\Outlets.xml"));
	
	
}