/* Создать визит с задачей, вопросами , вопросами по SKU, прайс-листами и инкассацией.
*/

function RunStopWatch(StartButton, StopScreen){
Console.WriteLine("Click");
Device.Click(StartButton);
	Stopwatch.Start();
	do 	{
		var CurrScreen = Device.GetValue("context.CurrentScreen.Name");
		//Console.WriteLine(CurrScreen);
	}	while (CurrScreen!=StopScreen);
	var result = Stopwatch.Stop();
	Console.WriteLine(result.TotalSeconds+StopScreen+"  loading time");

}


function main() {

	var result=Device.Click("btnOrder");
	Console.WriteLine(result);
	
	var result = Device.Click("NewOrder");
	Console.WriteLine(result);
	
	var result = Device.Click("grScrollView.Controls[0]");
	Console.WriteLine(result);
	
	RunStopWatch("Orderadd.Controls[0].Controls[0].Controls[2]", "Order_SKUs.xml");
	
	RunStopWatch("grScrollView.Controls[2]", "Order_EditSKU.xml");
	
	RunStopWatch("btnForward", "Order_SKUs.xml");
	
	RunStopWatch("grScrollView.Controls[2]", "Order_EditSKU.xml");
	
	Dialog.ClickPositive();
	
	RunStopWatch("btnForward", "Order_SKUs.xml");
	
	RunStopWatch("grScrollView.Controls[2]", "Order_EditSKU.xml");
	
	var result=Dialog.ClickPositive();
	Console.WriteLine(result);
	
	var result = Device.Click("btnForward");
	Console.WriteLine(result);	
	
	var result = Device.Click("btnForward");
	Console.WriteLine(result);	
	
	var result = Device.Click("btnForward");
	Console.WriteLine(result);	
	


	RunStopWatch("btnDistr", "Stock_SKUs.xml");
	
	var result = Device.Click("btnBack");
	Console.WriteLine(result);	
	
	RunStopWatch("btnDistr", "Stock_SKUs.xml");
	
	var result = Device.Click("btnBack");
	Console.WriteLine(result);	
	
	RunStopWatch("btnDistr", "Stock_SKUs.xml");
	
	var result = Device.Click("btnBack");
	Console.WriteLine(result);	
	
	
}