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

function CheckValue(path,text){
	var result= Device.GetValue(path);
	if (result==text){
		result="True";
	}
	else{
		result="False";
	}
	return result;
}

function main() {

	Console.WriteLine("-----Модуль Расписание------");	
	var result = Device.Click("btnSchedule");
	Console.WriteLine(result);
	
	Console.WriteLine(CheckScreen("ScheduledVisits.xml"));
	
	Console.WriteLine(Search("edtSearch", "тор"));	
	
	
	Console.WriteLine(CheckValue("grScrollView.Controls[2].Controls[0].Controls[0].Text", "Торг 54"));
	Console.WriteLine(CheckValue("grScrollView.Controls[0].Controls[0].Controls[0].Text", "Торг 45"));
	
	Console.WriteLine(Search("edtSearch", "тор 45"));	
	
	Console.WriteLine(CheckValue("grScrollView.Controls[0].Controls[0].Controls[0].Text", "Торг 45"));
	
	var result = Device.Click("grScrollView.Controls[0]");
	Console.WriteLine(result); 
	
	Console.WriteLine(CheckScreen("Visit_Outlet.xml"));
	
	var result = Device.Click("btnForward");
	Console.WriteLine(result);
	
	Console.WriteLine(CheckScreen("Tasks.xml"));
	
	var result = Device.Click("btnForward"); // Переход к экрану Общих вопросов
	Console.WriteLine(result+"Переход к экрану Общих вопросов");
	
	Console.WriteLine(CheckScreen("Visit_Questions.xml"));
	
	var result = Device.Click("btnForward");
	Console.WriteLine(result);
	
	Console.WriteLine(CheckScreen("Visit_SKUs.xml"));
	
	var result = Device.Click("btnForward");
	Console.WriteLine(result);	
	
	Console.WriteLine(CheckScreen("Order.xml"));
	
	var result=Device.Click("grScrollView.Controls[0]"); // Price-list
	Console.WriteLine(result+"Price-list");
	
	Console.WriteLine(CheckScreen( "ListChoice.xml"));
	
	var result=Device.Click("grScrollView.Controls[0]"); // Choose Price-list
	Console.WriteLine(result+"Choose Price-list");
	
	var result=Device.Click("Orderadd"); // Order
	Console.WriteLine(result);
	
	Console.WriteLine(CheckScreen("Order_SKUs.xml"));
	
	Console.WriteLine(Search("edtSearch", "гво"));	
	
	Console.WriteLine(CheckValue("grScrollView.Controls[2].Controls[0].Controls[0].Text", "Гвоздь 10ка"));
	Console.WriteLine(CheckValue("grScrollView.Controls[4].Controls[0].Controls[0].Text", "Гвоздь 20ка"));
	
	Console.WriteLine(Search("edtSearch", "гво 20"));	
	
	Console.WriteLine(CheckValue("grScrollView.Controls[2].Controls[0].Controls[0].Text", "Гвоздь 20ка"));
	
	var result = Device.Click("btnBack");
	Console.WriteLine(result);	
	
	var result = Device.Click("btnForward");
	Console.WriteLine(result);	
	
	Console.WriteLine(CheckScreen("Visit_Order_Commentary.xml"));
	
	var result = Device.Click("btnForward");
	Console.WriteLine(result);	
	
	Console.WriteLine(CheckScreen("Receivables.xml"));
	
	var result = Device.Click("btnForward");
	Console.WriteLine(result);	
	
	Console.WriteLine(CheckScreen("Visit_Total.xml"));
	
	var result = Device.Click("btnForward");
	Console.WriteLine(result);
	
	Console.WriteLine(CheckScreen("Main.xml"));
	
	/*VISIT-----------------------------------------------------------------------------------------------------------------------------------*/
	
	Console.WriteLine("-----Модуль Визит------");	
	
	var result = Device.Click("btnVisit");
	Console.WriteLine(result);
	
	Console.WriteLine(CheckScreen("Outlets.xml"));
	
	Console.WriteLine(Search("edtSearch", "тор"));	
	
	
	Console.WriteLine(CheckValue("grScrollView.Controls[2].Controls[0].Controls[0].Text", "Торг 54"));
	Console.WriteLine(CheckValue("grScrollView.Controls[0].Controls[0].Controls[0].Text", "Торг 45"));
	
	Console.WriteLine(Search("edtSearch", "тор 54"));	
	
	Console.WriteLine(CheckValue("grScrollView.Controls[0].Controls[0].Controls[0].Text", "Торг 54"));
	
	var result = Device.Click("grScrollView.Controls[0]");
	Console.WriteLine(result);
	
	Console.WriteLine(CheckScreen("Visit_Outlet.xml"));
	
	var result = Device.Click("btnForward");
	Console.WriteLine(result);	
	
	Console.WriteLine(CheckScreen("Tasks.xml"));
	
	var result = Device.Click("btnForward"); // Переход к экрану Общих вопросов
	Console.WriteLine(result+"Переход к экрану Общих вопросов");
	
	Console.WriteLine(CheckScreen("Visit_Questions.xml"));
	
	var result = Device.Click("btnForward");
	Console.WriteLine(result);
	
	Console.WriteLine(CheckScreen("Visit_SKUs.xml"));
	
	var result = Device.Click("btnForward");
	Console.WriteLine(result);	
	
	Console.WriteLine(CheckScreen("Order.xml"));
	
	var result=Device.Click("grScrollView.Controls[0]"); // Price-list
	Console.WriteLine(result+"Price-list");
	
	Console.WriteLine(CheckScreen( "ListChoice.xml"));
	
	var result=Device.Click("grScrollView.Controls[0]"); // Choose Price-list
	Console.WriteLine(result+"Choose Price-list");
	
	var result=Device.Click("Orderadd"); // Order
	Console.WriteLine(result);
	
	Console.WriteLine(CheckScreen("Order_SKUs.xml"));
	
	Console.WriteLine(Search("edtSearch", "гво"));	
	
	Console.WriteLine(CheckValue("grScrollView.Controls[4].Controls[0].Controls[0].Text", "Гвоздь 20ка"));
	Console.WriteLine(CheckValue("grScrollView.Controls[2].Controls[0].Controls[0].Text", "Гвоздь 10ка"));
	
	Console.WriteLine(Search("edtSearch", "гво 20"));	
	
	Console.WriteLine(CheckValue("grScrollView.Controls[2].Controls[0].Controls[0].Text", "Гвоздь 20ка"));
	
	var result = Device.Click("btnBack");
	Console.WriteLine(result);	
	
	var result = Device.Click("btnForward");
	Console.WriteLine(result);	
	
	Console.WriteLine(CheckScreen("Visit_Order_Commentary.xml"));
	
	var result = Device.Click("btnForward");
	Console.WriteLine(result);	
	
	Console.WriteLine(CheckScreen("Receivables.xml"));
	
	var result = Device.Click("btnForward");
	Console.WriteLine(result);	
	
	Console.WriteLine(CheckScreen("Visit_Total.xml"));
	
	var result = Device.Click("btnForward");
	Console.WriteLine(result);
	
	Console.WriteLine(CheckScreen("Main.xml"));
	
	/*ORDER-----------------------------------------------------------------------------------------------------------*/
	
	Console.WriteLine("-----Модуль Заказ------");	

	var result = Device.Click("btnOrder");
	Console.WriteLine(result);
	
	Console.WriteLine(CheckScreen("OrderList.xml"));
	
	Console.WriteLine(Search("edtSearch", "тор"));	
	
	
	Console.WriteLine(CheckValue("grScrollView.Controls[2].Controls[0].Controls[0].Text", "Торг 54"));
	Console.WriteLine(CheckValue("grScrollView.Controls[0].Controls[0].Controls[0].Text", "Торг 45"));
	
	Console.WriteLine(Search("edtSearch", "тор 54"));	
	
	
	Console.WriteLine(CheckValue("grScrollView.Controls[0].Controls[0].Controls[0].Text", "Торг 54"));
	
	var result = Device.Click("NewOrder");
	Console.WriteLine(result);
	
	Console.WriteLine(CheckScreen("Outlets.xml"));
	
	Console.WriteLine(Search("edtSearch", "Тор"));	
	

	Console.WriteLine(CheckValue("grScrollView.Controls[2].Controls[0].Controls[0].Text", "Торг 54"));
		Console.WriteLine(CheckValue("grScrollView.Controls[0].Controls[0].Controls[0].Text", "Торг 45"));
	
	Console.WriteLine(Search("edtSearch", "тор 54"));	
	
	Console.WriteLine(CheckValue("grScrollView.Controls[0].Controls[0].Controls[0].Text", "Торг 54"));
	
	var result = Device.Click("btnForward");
	Console.WriteLine(result);	
	
	var result = Device.Click("grScrollView.Controls[0]");
	Console.WriteLine(result);
	
	Console.WriteLine(CheckScreen("Order.xml"));
	
	var result=Device.Click("grScrollView.Controls[0]"); // Price-list
	Console.WriteLine(result+"Price-list");
	
	Console.WriteLine(CheckScreen("ListChoice.xml"));
	
	var result=Device.Click("grScrollView.Controls[0]"); // Choose Price-list
	Console.WriteLine(result+"Choose Price-list");
	
	Console.Pause(1000);	
	
	var result=Device.Click("Orderadd"); // Order
	Console.WriteLine(result);
	
	Console.WriteLine(CheckScreen("Order_SKUs.xml"));
	
	Console.WriteLine(Search("edtSearch", "гво"));	
	
	Console.WriteLine(CheckValue("grScrollView.Controls[2].Controls[0].Controls[0].Text", "Гвоздь 10ка"));
	Console.WriteLine(CheckValue("grScrollView.Controls[4].Controls[0].Controls[0].Text", "Гвоздь 20ка"));
	
	Console.WriteLine(Search("edtSearch", "гво 20"));	
	
	Console.WriteLine(CheckValue("grScrollView.Controls[2].Controls[0].Controls[0].Text", "Гвоздь 20ка"));
	
	var result = Device.Click("btnBack");
	Console.WriteLine(result);	
	
	var result = Device.Click("btnForward");
	Console.WriteLine(result);	
	
	Console.WriteLine(CheckScreen("Order_Commentary.xml"));
	
	var result = Device.Click("btnForward");
	Console.WriteLine(result);
	
	Console.WriteLine(CheckScreen( "Main.xml"));
	
	/*	-------------Outlets	--------------------------------------------------*/
	Console.WriteLine("-----Модуль Магазин------");	
	
	var result = Device.Click("btnOutlets");
	Console.WriteLine(result);
	
	Console.WriteLine(CheckScreen("Outlets_Outlets.xml"));
	
	Console.WriteLine(Search("edtSearch", "тор"));	
	
	
	Console.WriteLine(CheckValue("grScrollView.Controls[2].Controls[0].Controls[0].Text", "Торг 54"));
	Console.WriteLine(CheckValue("grScrollView.Controls[0].Controls[0].Controls[0].Text", "Торг 45"));
		
	Console.WriteLine(Search("edtSearch", "тор 54"));	
	
	Console.WriteLine(CheckValue("grScrollView.Controls[0].Controls[0].Controls[0].Text", "Торг 54"));
	
	var result = Device.Click("btnBack");
	Console.WriteLine(result);
	
	Console.WriteLine(CheckScreen( "Main.xml"));
	
	/*-------------------------------------Stocks--------------------------------------*/
	
	Console.WriteLine("-----Модуль Stocks----");	
	
	var result = Device.Click("btnDistr");
	Console.WriteLine(result);
	
	Console.WriteLine(CheckScreen("Stock_SKUs.xml"));

	Console.WriteLine(Search("edtSearch", "гво"));	
	
	Console.WriteLine(CheckValue("grScrollView.Controls[2].Controls[0].Controls[0].Text", "Гвоздь 10ка"));
	Console.WriteLine(CheckValue("grScrollView.Controls[4].Controls[0].Controls[0].Text", "Гвоздь 20ка"));
	
	Console.WriteLine(Search("edtSearch", "гво 20"));	
	
	Console.WriteLine(CheckValue("grScrollView.Controls[2].Controls[0].Controls[0].Text", "Гвоздь 20ка"));
	
	var result=Device.Click("btnBack");
	Console.WriteLine(result);
	
	Console.WriteLine(CheckScreen("Main.xml"));
	}