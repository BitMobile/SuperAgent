/* Создать визит с задачей, вопросами , вопросами по SKU, прайс-листами и инкассацией.
*/

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

function TextCheck (path, text) {
	var result1= Device.SetFocus(path);
	
	var result2 = Device.SetText(path, text);
	
	
	textp=path+".Text";
	
	var result3= Device.GetValue(textp);
	
	if (result3==text) { 	result3 = "True";
	}
	else{ 
		result3 = "False";
	}
	result=result1+"; "+result2+"; "+result3;
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

function getRandomArbitary(min, max){
	return Math.round(Math.random() * (max - min) + min);
}

function main() {

	var n=getRandomArbitary(1,865);
	Console.WriteLine(n);

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
	
	Console.WriteLine(Search("edtSearch","торг 45"));
	
	var result = Device.Click("grScrollView.Controls[0]");
	Console.WriteLine(result);
	
	Console.Pause(500);	
	
	Console.WriteLine(CheckScreen("Visit_Outlet.xml"));
	
	var result = TextCheck("headerDescr.Controls[0].Controls[0].Controls[0].Controls[0]", "Наименование");  //Проверка изменения названия т.т. из мобильного приложения
	if (result !=="True; True; True"){ 		result="True";
	}
	Console.WriteLine(result);
	
	//Вставить установку координат
	
	var result = Device.Click("grScrollView.Controls[4]"); 
	Console.WriteLine(result);
	
	Console.WriteLine(CheckScreen("ListChoice.xml"));
	
	var result = Device.Click("grScrollView.Controls[0]"); // Выбор класса т.т.
	Console.WriteLine(result+"Выбор класса т.т.");
	
	Console.Pause(500);	
	
	Console.WriteLine(Device.GetValue("grScrollView.Controls[4].Controls[0].Controls[0].Text"));
	Console.WriteLine(CheckValue("grScrollView.Controls[4].Controls[0].Controls[0].Text", "В"));
	
	var result = Device.Click("btnForward");
	Console.WriteLine(result);
	
	Console.WriteLine(CheckScreen("Tasks.xml"));
	
	var result = Device.Click("btnForward");
	Console.WriteLine(result);	
	
	Console.WriteLine(CheckScreen("Visit_Questions.xml"));
	
	var result = Device.Click("btnForward");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("Visit_SKUs.xml"));
	
	var result=Device.Click("grScrollView.Controls[2]"); // SKU question 
	Console.WriteLine(result+"SKU question ");	
	
	Console.Pause(1000);	
	
	Console.WriteLine(CheckScreen("Visit_SKU.xml"));
	
	var result=Device.Click("grScrollView.Controls[0].Controls[0].Controls[0]"); // SKU answer 1
	Console.WriteLine(result+"SKU answer 1");	
	
	Console.WriteLine(CheckValue("grScrollView.Controls[0].Controls[0].Controls[1].Text", "Доступность"));
	
	Console.WriteLine(TextCheck("grScrollView.Controls[2].Controls[0].Controls[0]", "1"+n));	
	
	
	Console.WriteLine(Device.GetValue("grScrollView.Controls[2].Controls[0].Controls[1].Text"));
	Console.WriteLine(CheckValue("grScrollView.Controls[2].Controls[0].Controls[1].Text", "Остатки"));
	
	Console.WriteLine(TextCheck("grScrollView.Controls[4].Controls[0].Controls[0]", "14"+n));	
	
	Console.WriteLine(CheckValue("grScrollView.Controls[4].Controls[0].Controls[1].Text", "Наценка"));
	
	var result=Device.Click("grScrollView.Controls[6].Controls[0].Controls[0]"); // SKU answer 5
	Console.WriteLine(result+"SKU answer 5");	
	
	Console.WriteLine(CheckValue("grScrollView.Controls[6].Controls[0].Controls[1].Text", "Наличие на складе"));
	
	var result = Device.Click("btnForward");
	Console.WriteLine(result);	
	
	Console.Pause(1000);	
	
	Console.WriteLine(CheckScreen("Visit_SKUs.xml"));
	
	Console.WriteLine(CheckValue("grScrollView.Controls[2].Controls[0].Controls[0].Text", "Заполнен"));
	
	var result = Device.Click("btnForward");
	Console.WriteLine(result);	
	
	Console.WriteLine(CheckScreen("Order.xml"));
	
	var result=Device.Click("grScrollView.Controls[0]"); // Price-list
	Console.WriteLine(result+"Price-list");
	
	Console.WriteLine(CheckScreen("ListChoice.xml"));
	
	var result=Device.Click("grScrollView.Controls[0]"); // Choose Price-list
	Console.WriteLine(result+"Choose Price-list");
	
	Console.WriteLine(CheckScreen("Order.xml"));
	
	var result=Device.Click("Orderadd"); // Order
	Stopwatch.Start();
	Console.WriteLine(result);
	
	var result = CheckScreen("Order_SKUs.xml");
	if (result=="Order_SKUs.xml") {
		var result = Stopwatch.Stop();
		Console.WriteLine(result.TotalSeconds);
	}
	else{
		Console.WriteLine(result);
	}
	
	var result=Device.SetFocus("grScrollView.Controls[0]"); //Checking groups ?????
	Console.WriteLine(result+"Checking groups");
	
	Console.WriteLine(TextCheck("edtSearch", "гв 10"));	
	
	var result=	Device.Click("btnSearch");
	
	Console.WriteLine(result+"3");
	
	var result=Device.Click("grScrollView.Controls[2]"); // Add SKU to Order
	Console.WriteLine(result);
	
	Console.WriteLine(CheckScreen("Features.xml"));
	
	var result=Device.Click("grScrollView.Controls[0]"); // Choose feature
	Console.WriteLine(result);
	
	Console.Pause(500);
	
	Console.WriteLine(CheckScreen("Order_EditSKU.xml"));
	
	var result=Device.SetFocus("grScrollView.Controls[4].Controls[0].Controls[0]"); //Quantity
	Console.WriteLine(result);
	
	var result=Device.SetText("grScrollView.Controls[4].Controls[0].Controls[0]", "54"); //Quantity
	Console.WriteLine(result+"Quantity");
	
	var result = Device.Click("btnForward");
	Console.WriteLine(result);	
	
	Console.Pause(500);
	
	var result = Device.Click("btnForward");
	Console.WriteLine(result);	
	
	Console.Pause(500);
	
	Console.WriteLine(CheckScreen("Visit_Order_Commentary.xml"));
	
	Console.WriteLine(TextCheck("grScrollView.Controls[0].Controls[0].Controls[2]", "Комментарий к заказу"));	
	
	var result = Device.Click("btnForward");
	Console.WriteLine(result);	
	
	Console.WriteLine(CheckScreen("Receivables.xml")); // Инкассация
	
	var result = Device.Click("btnForward");
	Console.WriteLine(result);	
	
	Console.WriteLine(CheckScreen("Visit_Total.xml"));
	
		var result = Device.GetValue("grScrollView.Controls[4].Controls[0].Controls[0].Text");
	if (result=="0 of 6") { result="True";
	}
	else{
		result="False";
	}
	Console.WriteLine(result);	
	
	var result = Device.GetValue("grScrollView.Controls[6].Controls[0].Controls[0].Text");
	if (result=="4 of 12") { result="True";
	}
	else{
		result="False";
	}
	
	Console.WriteLine(result);	
	
	Device.TakeScreenshot("Total_Sched_ext");
	
	var result = Device.Click("btnForward");
	Console.WriteLine(result);	
	
	Console.WriteLine(CheckScreen("Main.xml"));
	
}