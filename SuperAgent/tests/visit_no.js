/* Меридиан  без задач, вопросов , вопросов по SKU, но с прайс-листами и инкассацией.
Инкассация атомат. затем ручная
*/
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

	var result = Device.Click("btnVisit");
	Console.WriteLine(result);
	
	Console.WriteLine(CheckScreen("Outlets.xml"));
	
	Console.WriteLine(TextCheck("edtSearch", "мерид"));
	
	var result=	Device.Click("btnSearch");
	Console.WriteLine(result);
	
	var result = Device.Click("grScrollView.Controls[0]");
	Console.WriteLine(result);
	
	Console.WriteLine(CheckScreen("Outlet.xml"));
	
	var outlet=Device.GetValue("workflow[outlet].Description");
	Console.WriteLine(CheckValue("headerDescr.Controls[0].Controls[0].Controls[0].Controls[0].Text", outlet));
	
	var result = TextCheck("headerDescr.Controls[0].Controls[0].Controls[0].Controls[0]", "Наименование");  //Проверка изменения названия т.т. из мобильного приложения
	if (result !=="True; True; True"){ 		result="True";
	}
	Console.WriteLine(result);
	
	Console.WriteLine(TextCheck("grScrollView.Controls[0].Controls[0].Controls[0]", "Новый адрес"));	
	
	//Вставить установку координат
	
	var result = Device.Click("grScrollView.Controls[4]"); 
	Console.WriteLine(result);
	
	Console.WriteLine(CheckScreen("ListChoice.xml"));
	
	var result = Device.Click("grScrollView.Controls[4]"); // Выбор класса т.т.
	Console.WriteLine(result+"Выбор класса т.т.");
	
	Console.WriteLine(CheckValue("grScrollView.Controls[4].Controls[0].Controls[0].Text", "C"));
	
	var result=Device.Click("grScrollView.Controls[12]") //Выбор параметра целого типа(Наличие акционных моделей)
	Console.WriteLine(result+"Выбор параметра целого типа(Наличие акционных моделей)");
	
	Console.WriteLine(CheckScreen("OutletParameter.xml"));
	
	Console.WriteLine(TextCheck("grScrollView.Controls[2].Controls[0]", "1254"));	
	
	var result = Device.Click("btnForward");
	Console.WriteLine(result);
	
	Console.WriteLine(CheckValue("grScrollView.Controls[12].Controls[0].Controls[0].Text", "1254"));
	
	Console.Pause(500);
	
	Console.WriteLine(CheckScreen("Outlet.xml"));
	
	var result=Device.Click("grScrollView.Controls[18]") //Выбор параметра строкового типа(Правильная выклfдка)
	Console.WriteLine(result+"Выбор параметра строкового типа(Правильная выкладка)");
	
	Console.WriteLine(TextCheck("grScrollView.Controls[2].Controls[0]", "String"));	
	
	var result = Device.Click("btnBack");
	Console.WriteLine(result);
	
	Console.WriteLine(CheckScreen("Outlet.xml"));
	
	Console.WriteLine(CheckValue("grScrollView.Controls[18].Controls[0].Controls[0].Text", "String"));
	
	var result=Device.Click("grScrollView.Controls[38]") //Выбор параметра Десятичного типа (Размер дебиторской задолженности)
	Console.WriteLine(result+"Выбор параметра Десятичного типа (Размер дебиторской задолженности)");
	
	Console.WriteLine(TextCheck("grScrollView.Controls[2].Controls[0]", "125.4"));	
	
	var result = Device.Click("btnForward");
	Console.WriteLine(result);
	
	Console.WriteLine(CheckValue("grScrollView.Controls[38].Controls[0].Controls[0].Text", "125.4"));	
	
	var result=Device.Click("grScrollView.Controls[14]") //Выбор параметра Логического типа (Оформление витрины samsung)
	Console.WriteLine(result+"Выбор параметра Логического типа (Оформление витрины samsung)");
	
	var result=Device.Click("grScrollView.Controls[2].Controls[0]");
	Console.WriteLine(result);
	
	var result=Device.GetValue("grScrollView.Controls[2].Controls[0].Value");
	if (result=="True") {
		var result = Device.Click("btnForward");
		Console.WriteLine(result);
		Console.WriteLine(CheckValue("grScrollView.Controls[14].Controls[0].Controls[0].Text", "Да"));
	}
	else{
		var result = Device.Click("btnForward");
		Console.WriteLine(result);
		Console.WriteLine(CheckValue("grScrollView.Controls[14].Controls[0].Controls[0].Text", "Нет"));
	}
	
	var result=Device.Click("grScrollView.Controls[24]") //
	Console.WriteLine(result);
	
	var result = Device.Click("btnBack");
	Console.WriteLine(result);
	
	
	Console.WriteLine(CheckScreen("Outlet.xml"));
	
	Console.WriteLine(CheckValue("grScrollView.Controls[24].Controls[0].Controls[0].Text", "?"));
	
	Console.Pause(500);
	
	var result = Device.Click("btnForward");
	Console.WriteLine(result);
	
	Console.Pause(500);
	
	Console.WriteLine(CheckScreen("Tasks.xml"));
	
	var result=Device.GetValue("grScrollView.Controls[0].Controls[0].Controls[0].Text"); // Task
	if (result=="Задач нет") {
		result="True";
	}
	else { result="False";
	}
	
	Console.WriteLine(result+"No task");
	
	var result = Device.Click("btnForward"); // Переход к экрану Общих вопросов
	Console.WriteLine(result+"Переход к экрану Общих вопросов");
	
	Console.WriteLine(CheckScreen("Visit_Questions.xml"));
	
var result=Device.GetValue("grScrollView.Controls[0].Controls[0].Controls[0].Text"); // Questions
	if (result=="Вопросов нет") {
		result="True";
	}
	else { result="False";
	}
		
	Console.WriteLine(result+"  No questions");
	
	var result = Device.Click("btnForward");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("Visit_SKUs.xml"));
	
	var result=Device.GetValue("grScrollView.Controls[0].Controls[0].Controls[0].Text"); // SKU question 
	if (result=="Вопросов нет") {
		result="True";
	}
	else { result="False";
	}
	Console.WriteLine(result+"No SKU questions ");	
	
	var result = Device.Click("btnForward");
	Console.WriteLine(result);	
	
	Console.WriteLine(CheckScreen("Order.xml"));
	
	var result=Device.Click("grScrollView.Controls[0]"); // Price-list
	Console.WriteLine(result+"Price-list");
	
	Console.WriteLine(CheckScreen("ListChoice.xml"));
	
	var result=Device.Click("grScrollView.Controls[0]"); // Choose Price-list
	Console.WriteLine(result+"Choose Price-list");
	
	Console.Pause(500);
	
	Console.WriteLine(CheckScreen("Order.xml"));
	
	var result = Device.Click("Orderadd");
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
	
	var result=Device.SetFocus("grScrollView.Controls[0]"); //Checking groups
	Console.WriteLine(result+"Checking groups");
	
	var result=Device.Click("grScrollView.Controls[2]"); // Add SKU to Order
	Console.WriteLine(result);
	
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
	
	Console.WriteLine(CheckScreen("Visit_Order_Commentary.xml"));
	
	Console.WriteLine(TextCheck("grScrollView.Controls[0].Controls[0].Controls[2]", "Комментарий к заказу  "+ i ));	
	
	var result = Device.Click("btnForward");
	Console.WriteLine(result);	
	
	Console.WriteLine(CheckScreen("Receivables.xml"));
	
	var result = Device.Click("grScrollView.Controls[2]"); // Just Spread
	Console.WriteLine(result);	
	
	/* Auto then manually*/
	
	Console.WriteLine(Device.GetValue("grScrollView.Controls[0].Controls[0].Controls[0].Text"));

	Console.WriteLine(CheckValue("grScrollView.Controls[0].Controls[0].Controls[0].Text", "709"));
	
	Console.WriteLine(Device.GetValue("grScrollView.Controls[0].Controls[1].Controls[0].Text"));
	
	Console.WriteLine(CheckValue("grScrollView.Controls[0].Controls[1].Controls[0].Text", "0"));
	
	Console.WriteLine(TextCheck("grScrollView.Controls[0].Controls[1].Controls[0]", "462"));	//Quantity
	
	var result = Device.Click("grScrollView.Controls[2]");
	Console.WriteLine(result);	
	
	Console.WriteLine(Device.GetValue("grScrollView.Controls[4].Controls[0].Controls[1].Text"));
	Console.WriteLine(CheckValue("grScrollView.Controls[4].Controls[0].Controls[1].Text", "Сумма инкассации: 55,00"));
	
	Console.WriteLine(Device.GetValue("grScrollView.Controls[6].Controls[0].Controls[1].Text"));
	Console.WriteLine(CheckValue("grScrollView.Controls[6].Controls[0].Controls[1].Text", "Сумма инкассации: 407"));
	
	 Console.WriteLine(CheckValue("grScrollView.Controls[0].Controls[0].Controls[0].Text", "709")); //Проверка не изменились ли значения полей, после нажатия на кноку "Распределить на документы"
	
	Console.WriteLine(CheckValue("grScrollView.Controls[0].Controls[1].Controls[0].Text", "462"));
	
	Console.WriteLine(TextCheck("grScrollView.Controls[8].Controls[0].Controls[0]", n));    //Заполнение полей документа 
	
	Console.WriteLine(TextCheck("grScrollView.Controls[10].Controls[0].Controls[0]", "Иванов Иван Иванович")); 
	
	Console.WriteLine(TextCheck("grScrollView.Controls[12].Controls[0].Controls[0]", "комментарий")); 
	
	var result = Device.Click("grScrollView.Controls[4]");
	Console.WriteLine(result);	
	
	
	Console.WriteLine(Device.GetValue("grScrollView.Controls[4].Controls[0].Controls[0].Text"));
	Console.WriteLine(CheckValue("grScrollView.Controls[4].Controls[0].Controls[0].Text", "55,00"));
	
	Console.WriteLine(TextCheck("grScrollView.Controls[4].Controls[0].Controls[0]", "24"));
	
	var result = Device.Click("btnForward");
	Console.WriteLine(result);	
	
	Console.WriteLine(CheckValue("grScrollView.Controls[0].Controls[1].Controls[0].Text", "431"));
	
	Console.WriteLine(Device.GetValue("grScrollView.Controls[6].Controls[0].Controls[1].Text"));
	Console.WriteLine(CheckValue("grScrollView.Controls[6].Controls[0].Controls[1].Text", "Сумма инкассации: 407"));
	
	Console.WriteLine(Device.GetValue("grScrollView.Controls[4].Controls[0].Controls[1].Text"));
	Console.WriteLine(CheckValue("grScrollView.Controls[4].Controls[0].Controls[1].Text", "Сумма инкассации: 24"));
	
	var result = Device.Click("btnForward");
	Console.WriteLine(result);	
	
	Console.WriteLine(CheckScreen("Visit_Total.xml"));
	
		var result = Device.GetValue("grScrollView.Controls[4].Controls[0].Controls[0].Text");
			Console.WriteLine(result);	
	if (result=="0 of 0") { result="True";
	}
	else{
		result="False";
	}
	Console.WriteLine(result);	
	
	var result = Device.GetValue("grScrollView.Controls[6].Controls[0].Controls[0].Text");
		Console.WriteLine(result);	
	if (result=="0 of 0") { result="True";
	}
	else{
		result="False";
	}
	
	Console.WriteLine(result);	
	
	Device.TakeScreenshot("Total_VisinNo");
	
	var result = Device.Click("btnForward");
	Console.WriteLine(result);	
	
	Console.Pause(500);
	
	Console.WriteLine(CheckScreen("Main.xml"));

	
	}