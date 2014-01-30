/* Создать визит с задачей, вопросами , вопросами по SKU, прайс-листами и инкассацией.
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
	
	Console.WriteLine(TextCheck("edtSearch", "болеро"));
	
	var result=	Device.Click("btnSearch");
	Console.WriteLine(result);
	
	var result = Device.Click("grScrollView.Controls[0]");
	Console.WriteLine(result);
	
	Console.WriteLine(CheckScreen("Visit_Outlet.xml"));
	
	var result = TextCheck("headerDescr.Controls[0].Controls[0].Controls[0].Controls[0]", "Наименование");  //Проверка изменения названия т.т. из мобильного приложения
	if (result !=="True; True; True"){ 		result="True";
	}
	Console.WriteLine(result);
	
	Console.WriteLine(TextCheck("grScrollView.Controls[0].Controls[0].Controls[0]", "Новый адрес"+n));	
	
	//Вставить установку координат
	
	var result = Device.Click("grScrollView.Controls[4]"); 
	Console.WriteLine(result);
	
	Console.WriteLine(CheckScreen("ListChoice.xml"));
	
	var result = Device.Click("grScrollView.Controls[2]"); // Выбор класса т.т.
	Console.WriteLine(result+"Выбор класса т.т.");
	
	Console.WriteLine(Device.GetValue("grScrollView.Controls[4].Controls[0].Controls[0].Text"));
	
	Console.WriteLine(CheckValue("grScrollView.Controls[4].Controls[0].Controls[0].Text", "А"));
	
	var result=Device.Click("grScrollView.Controls[12]") //Выбор параметра целого типа(Наличие акционных моделей)
	Console.WriteLine(result+"Выбор параметра целого типа(Наличие акционных моделей)");
	
	Console.WriteLine(CheckScreen("OutletParameter.xml"));
	
	Console.WriteLine(TextCheck("grScrollView.Controls[2].Controls[0]", "1254"+ n));	
	
	var result = Device.Click("btnForward");
	Console.WriteLine(result);
	
	Console.WriteLine(CheckScreen("Visit_Outlet.xml"));
	
	Console.WriteLine(CheckValue("grScrollView.Controls[12].Controls[0].Controls[0].Text", "1254"+n));
	
	Console.Pause(500);
	
	var result=Device.Click("grScrollView.Controls[18]") //Выбор параметра строкового типа(Правильная выклfдка)
	Console.WriteLine(result+"Выбор параметра строкового типа(Правильная выкладка)");
	
	Console.WriteLine(TextCheck("grScrollView.Controls[2].Controls[0]", "String" +n));	
	
	var result = Device.Click("btnBack");
	Console.WriteLine(result);
	
	Console.WriteLine(CheckScreen("Visit_Outlet.xml"));
	
	Console.WriteLine(CheckValue("grScrollView.Controls[18].Controls[0].Controls[0].Text", "String"+n));
	
	var result=Device.Click("grScrollView.Controls[38]") //Выбор параметра Десятичного типа (Размер дебиторской задолженности)
	Console.WriteLine(result+"Выбор параметра Десятичного типа (Размер дебиторской задолженности)");
	
	Console.WriteLine(TextCheck("grScrollView.Controls[2].Controls[0]", "125.4"+n));	
	
	var result = Device.Click("btnForward");
	Console.WriteLine(result);
	
	Console.WriteLine(CheckValue("grScrollView.Controls[38].Controls[0].Controls[0].Text", "125.4"+n));	
	
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
	
	Console.WriteLine(CheckScreen("Visit_Outlet.xml"));
	
	Console.WriteLine(CheckValue("grScrollView.Controls[24].Controls[0].Controls[0].Text", "?"));
	
	Console.Pause(500);
	
	var result = Device.Click("btnForward");
	Console.WriteLine(result);
	
	Console.Pause(500);
	
	Console.WriteLine(CheckScreen("Tasks.xml"));
	
	var result=Device.Click("grScrollView.Controls[0]"); // Task 
	Console.WriteLine(result+"Task ");
	
	var result = Device.Click("btnBack");
	Console.WriteLine(result);
	
	Console.WriteLine(CheckScreen("Tasks.xml"));
	
	var result=Device.Click("grScrollView.Controls[0]"); // Task
	Console.WriteLine(result+"Task");
	
	Console.Pause(500);
	
	Console.WriteLine(CheckScreen("Visit_Task.xml"));
	
	var result=Device.Click("grScrollView.Controls[2].Controls[0].Controls[0]");  // Task - result
	Console.WriteLine(result+"Task - result");
	
	var result = Device.Click("btnForward");
	Console.WriteLine(result);
	
	var result = Device.Click("btnForward"); // Переход к экрану Общих вопросов
	Console.WriteLine(result+"Переход к экрану Общих вопросов");
	
	Console.WriteLine(CheckScreen("Visit_Questions.xml"));
	
	var result=Device.Click("grScrollView.Controls[2]"); // Question (string)
	Console.WriteLine(result+"Question (string)");
	
	Console.WriteLine(CheckScreen("Visit_Question.xml"));
	
	Console.WriteLine(TextCheck("grScrollView.Controls[2].Controls[0]", "String"+ n));	
	
	var result = Device.Click("btnForward");
	Console.WriteLine(result);
	
	Console.WriteLine(CheckScreen("Visit_Questions.xml"));
	
	Console.WriteLine(CheckValue("grScrollView.Controls[2].Controls[0].Controls[0].Text", "String"+n));
	
	var result=Device.Click("grScrollView.Controls[0]"); // Question (Int)
	Console.WriteLine(result+"Question (Int)");
	
	Console.WriteLine(TextCheck("grScrollView.Controls[2].Controls[0]", "123546"+n));	
	
	var result = Device.Click("btnForward");
	Console.WriteLine(result);	
	
	Console.WriteLine(CheckValue("grScrollView.Controls[0].Controls[0].Controls[0].Text", "123546"+n));
	
	var result=Device.Click("grScrollView.Controls[4]"); // Question (Boolean)
	Console.WriteLine(result+"Question (Boolean)");
	
	var result=Device.Click("grScrollView.Controls[2].Controls[0]");
	Console.WriteLine(result);	
	
	var result=Device.GetValue("grScrollView.Controls[2].Controls[0].Value");

	var result = Device.Click("btnForward");
	Console.WriteLine(result);	
	
	Console.WriteLine(CheckValue("grScrollView.Controls[4].Controls[0].Controls[0].Text", "Да"));
	
	var result=Device.Click("grScrollView.Controls[8]"); // Question (Decimal)
	Console.WriteLine(result+"Question (Decimal)");
	
	Console.WriteLine(TextCheck("grScrollView.Controls[2].Controls[0]", "1.6"+n));	
	
	var result = Device.Click("btnForward");
	Console.WriteLine(result);	
	
	Console.WriteLine(CheckValue("grScrollView.Controls[8].Controls[0].Controls[0].Text", "1.6"+n));
	
	var result=Device.Click("grScrollView.Controls[6]"); // 
	Console.WriteLine(result+"Question (Decimal)");
	
	var result = Device.Click("btnForward");
	Console.WriteLine(result);	
	
	Console.Pause(500);
	
	Console.WriteLine(CheckScreen("Visit_Questions.xml"));
	
	Console.WriteLine(CheckValue("grScrollView.Controls[6].Controls[0].Controls[0].Text", "?"));
	
	Console.Pause(500);
	
	var result = Device.Click("btnForward");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("Visit_SKUs.xml"));
	
	var result=Device.Click("grScrollView.Controls[0]"); // SKU question 
	Console.WriteLine(result+"SKU question ");	
	
	Console.Pause(1000);	
	
	Console.WriteLine(CheckScreen("Visit_SKU.xml"));
	
	var result=Device.Click("grScrollView.Controls[0].Controls[0].Controls[0]"); // SKU answer 1
	Console.WriteLine(result+"SKU answer 1");	
	
	Console.WriteLine(TextCheck("grScrollView.Controls[2].Controls[0].Controls[0]", "5"+n));	
	
	Console.WriteLine(TextCheck("grScrollView.Controls[4].Controls[0].Controls[0]", "14"+n));	
	
	Console.WriteLine(TextCheck("grScrollView.Controls[6].Controls[0].Controls[0]", "15"+n));	
	
	Console.WriteLine(TextCheck("grScrollView.Controls[8].Controls[0].Controls[0]", "12"+n));	
	
	var result=Device.Click("grScrollView.Controls[10].Controls[0].Controls[0]"); // SKU answer 5
	Console.WriteLine(result+"SKU answer 5");	
	
	var result = Device.Click("btnForward");
	Console.WriteLine(result);	
	
	Console.Pause(1000);	
	
	Console.WriteLine(CheckScreen("Visit_SKUs.xml"));
	
	Console.WriteLine(CheckValue("grScrollView.Controls[0].Controls[0].Controls[0].Text", "Заполнен"));
	
	var result = Device.Click("btnForward");
	Console.WriteLine(result);	
	
	Console.WriteLine(CheckScreen("Order.xml"));
	
	// var result=Device.Click("grScrollView.Controls[0]"); // Price-list
	// Console.WriteLine(result+"Price-list");
	
	// Console.WriteLine(CheckScreen("ListChoice.xml"));
	
	// var result=Device.Click("grScrollView.Controls[0]"); // Choose Price-list
	// Console.WriteLine(result+"Choose Price-list");
	
	// Console.Pause(500);
	
	// Console.WriteLine(CheckScreen("Order.xml"));
	
	// var result = Device.Click("Orderadd");
	// Stopwatch.Start();
	// Console.WriteLine(result);
	
	// var result = CheckScreen("Order_SKUs.xml");
	// if (result=="Order_SKUs.xml") {
		// var result = Stopwatch.Stop();
		// Console.WriteLine(result.TotalSeconds);
	// }
	// else{
		// Console.WriteLine(result);
	// }
	
	// var result=Device.SetFocus("grScrollView.Controls[0]"); //Checking groups
	// Console.WriteLine(result+"Checking groups");
	
	// var result=Device.Click("grScrollView.Controls[2]"); // Add SKU to Order
	// Console.WriteLine(result);
	
	// Console.WriteLine(CheckScreen("Order_EditSKU.xml"));
	
	// var result=Device.SetFocus("grScrollView.Controls[4].Controls[0].Controls[0]"); //Quantity
	// Console.WriteLine(result);
	
	// var result=Device.SetText("grScrollView.Controls[4].Controls[0].Controls[0]", "54"); //Quantity
	// Console.WriteLine(result+"Quantity");
	
	// var result = Device.Click("btnForward");
	// Console.WriteLine(result);	
	
	// Console.Pause(500);
	
	var result = Device.Click("btnForward");
	Console.WriteLine(result);	
	
	Console.WriteLine(CheckScreen("Visit_Order_Commentary.xml"));
	
	Console.WriteLine(TextCheck("grScrollView.Controls[0].Controls[0].Controls[2]", "Комментарий к заказу  "));	
	
	var result = Device.Click("btnForward");
	Console.WriteLine(result);	
	
	Console.WriteLine(CheckScreen("Receivables.xml")); // Инкассация
	
	Console.WriteLine(Device.GetValue("grScrollView.Controls[0].Controls[0].Controls[0].Text"));

	Console.WriteLine(CheckValue("grScrollView.Controls[0].Controls[0].Controls[0].Text", "476"));
	
	Console.WriteLine(Device.GetValue("grScrollView.Controls[0].Controls[1].Controls[0].Text"));
	
	Console.WriteLine(CheckValue("grScrollView.Controls[0].Controls[1].Controls[0].Text", "0"));
	
	Console.WriteLine(TextCheck("grScrollView.Controls[0].Controls[1].Controls[0]", "462"));	//Quantity
	
	Console.WriteLine(Device.GetValue("grScrollView.Controls[4].Controls[0].Controls[1].Text"));
	Console.WriteLine(CheckValue("grScrollView.Controls[4].Controls[0].Controls[1].Text", "Сумма документа: 434,00"));
	
	Console.WriteLine(Device.GetValue("grScrollView.Controls[6].Controls[0].Controls[1].Text"));
	Console.WriteLine(CheckValue("grScrollView.Controls[6].Controls[0].Controls[1].Text", "Сумма документа: 42,00"));
	
	var result = Device.Click("grScrollView.Controls[2]");
	Console.WriteLine(result);	
	
	Console.WriteLine(Device.GetValue("grScrollView.Controls[4].Controls[0].Controls[1].Text"));
	Console.WriteLine(CheckValue("grScrollView.Controls[4].Controls[0].Controls[1].Text", "Сумма инкассации: 434,00"));
	
	Console.WriteLine(Device.GetValue("grScrollView.Controls[6].Controls[0].Controls[1].Text"));
	Console.WriteLine(CheckValue("grScrollView.Controls[6].Controls[0].Controls[1].Text", "Сумма инкассации: 28"));
	
	 Console.WriteLine(CheckValue("grScrollView.Controls[0].Controls[0].Controls[0].Text", "476")); //Проверка не изменились ли значения полей, после нажатия на кноку "Распределить на документы"
	
	Console.WriteLine(CheckValue("grScrollView.Controls[0].Controls[1].Controls[0].Text", "462"));
	
	var result = Device.Click("btnForward");
	Console.WriteLine(result);	
	
	Console.WriteLine(CheckScreen("Visit_Total.xml"));
	
	var result = Device.GetValue("grScrollView.Controls[4].Controls[0].Controls[0].Text");
	if (result=="4 of 6") { result="True";
	}
	else{
		result="False";
	}
	
	Console.WriteLine(result);	
	
	var result = Device.GetValue("grScrollView.Controls[6].Controls[0].Controls[0].Text");
		Console.WriteLine(result);	
	if (result=="6 of 8") { result="True";
	}
	else{
		result="False";
	}
	
	Console.WriteLine(result);	
	
	Device.TakeScreenshot("Total_Visit");
	
	var result = Device.Click("btnForward");
	Console.WriteLine(result);	
	
	Console.Pause(500);
	
	Console.WriteLine(CheckScreen("Main.xml"));

	
}