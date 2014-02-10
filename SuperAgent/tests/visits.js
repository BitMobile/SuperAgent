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
	
	Console.WriteLine(CheckScreen("Outlet.xml"));
	
	var outlet=Device.GetValue("workflow[outlet].Description");
	Console.WriteLine(CheckValue("headerDescr.Controls[0].Controls[0].Controls[0].Controls[0].Text", outlet));
	
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
	
	Console.WriteLine(CheckScreen("Outlet.xml"));
	
	Console.WriteLine(CheckValue("grScrollView.Controls[12].Controls[0].Controls[0].Text", "1254"+n));
	
	var result=Device.Click("grScrollView.Controls[12]")// Проверка повторного входа на экран
	
	Console.WriteLine(CheckValue("grScrollView.Controls[2].Controls[0].Text", "1254"+ n));	
	
	var result = Device.Click("btnForward");
	Console.WriteLine(result);
	
	Console.WriteLine(CheckScreen("Outlet.xml"));
	
	Console.WriteLine(CheckValue("grScrollView.Controls[12].Controls[0].Controls[0].Text", "1254"+n));
	
	var result=Device.Click("grScrollView.Controls[18]") //Выбор параметра строкового типа(Правильная выклfдка)
	Console.WriteLine(result+"Выбор параметра строкового типа(Правильная выкладка)");
	
	Console.WriteLine(TextCheck("grScrollView.Controls[2].Controls[0]", "String" +n));	
	
	var result = Device.Click("btnBack");
	Console.WriteLine(result);
	
	Console.WriteLine(CheckScreen("Outlet.xml"));
	
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
		
		var result=Device.Click("grScrollView.Controls[14]");// Проверка повторного входа на экран
		Console.WriteLine(result);
		
		var result=CheckValue("grScrollView.Controls[2].Controls[0].Value","True");
		Console.WriteLine(result);
		
		var result = Device.Click("btnForward");
		Console.WriteLine(result);
		Console.WriteLine(CheckValue("grScrollView.Controls[14].Controls[0].Controls[0].Text", "Да"));
	}
	else{
		var result = Device.Click("btnForward");
		Console.WriteLine(result);
		Console.WriteLine(CheckValue("grScrollView.Controls[14].Controls[0].Controls[0].Text", "Нет"));
		
		var result=Device.Click("grScrollView.Controls[14]");// Проверка повторного входа на экран
		Console.WriteLine(result);
		
		var result=CheckValue("grScrollView.Controls[2].Controls[0].Value","False");
		Console.WriteLine(result);
		
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
	
	var doubleQuestion=CheckValue("grScrollVIew.Controls[6].Controls[0].Controls[0].Text", "Доля полки %");//Проверка отображения дублирующихся вопросов
	doubleQuestion= (doubleQuestion=="False")? "True": "False";
	Console.WriteLine(doubleQuestion);
	Console.WriteLine("Question (string)");
	
	Console.WriteLine(Device.GetValue("grScrollView.Controls[6].Controls[0].Controls[0].Text"));
	Console.WriteLine(CheckValue("grScrollView.Controls[6].Controls[0].Controls[0].Text","Каталог товара есть в магазине"));// Question string
	Console.WriteLine(TextCheck("grScrollView.Controls[7].Controls[0].Controls[0]", "String"+n));	
	
	Console.WriteLine("Question (Int)");
	Console.WriteLine(CheckValue("grScrollView.Controls[3].Controls[0].Controls[0].Text","Доля полки %")); //Question int
	Console.WriteLine(TextCheck("grScrollView.Controls[4].Controls[0].Controls[0]", "123546"+n));	
	
	Console.WriteLine(result+"Question (Boolean)"); // Question (Boolean)
	Console.WriteLine(Device.GetValue("grScrollView.Controls[9].Controls[0].Controls[0].Text"));
	Console.WriteLine(CheckValue("grScrollView.Controls[9].Controls[0].Controls[0].Text","Набор рекомендуемых  к размещению  POSM установлен"));
	var result=Device.Click("grScrollView.Controls[10].Controls[0].Controls[0]")

	Console.WriteLine("Question (Decimal)");
	Console.WriteLine(Device.GetValue("grScrollView.Controls[15].Controls[0].Controls[0].Text"));
	Console.WriteLine(CheckValue("grScrollView.Controls[15].Controls[0].Controls[0].Text","Стандарт по доле полки относительно конкурентов  выполнен"));  // Question (Decimal)
	Console.WriteLine(TextCheck("grScrollView.Controls[16].Controls[0].Controls[0]", "123.6"+n));	
	
	var result=Device.Click("grScrollView.Controls[19]"); // Question (List )
	Console.WriteLine(result+"Question (List)");
	Console.WriteLine(CheckScreen("ListChoice.xml"));
	
	var result = Device.Click("btnForward");
	Console.WriteLine(result);	
	
	var result=Device.Click("grScrollView.Controls[19]"); // Question (List )
	Console.WriteLine(result+"Question (List)");
	
	var result = Device.Click("btnBack");
	Console.WriteLine(result);	
	
	var result=Device.Click("grScrollView.Controls[19]"); // Question (List )
	Console.WriteLine(result+"Question (List)");
	
	var result = Device.Click("grScrollView.Controls[2]");
	Console.WriteLine(result);
	
	Console.WriteLine(Device.GetValue("grScrollView.Controls[19].Controls[0].Controls[0].Text"));
	Console.WriteLine(CheckValue("grScrollView.Controls[19].Controls[0].Controls[0].Text", "Незнаю"));
	
	var result = Device.Click("btnForward");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("Visit_SKUs.xml"));
	Console.WriteLine(Device.GetValue("grScrollView.Controls[0].Controls[0].Controls[1].Text"));
	Console.WriteLine(CheckValue("grScrollView.Controls[0].Controls[0].Controls[1].Text","500 гр,"));//проверка отображения названия Sku и количества вопросов в нем
	
	Console.WriteLine(CheckScreen("Visit_SKUs.xml"));
	
	var result=Device.Click("grScrollView.Controls[0]"); // SKU question 
	Console.WriteLine(result+"SKU question ");	
	
	Console.WriteLine(CheckScreen("Visit_SKU.xml"));
	
	var result=Device.Click("grScrollView.Controls[0].Controls[0].Controls[0]"); // SKU answer 1
	Console.WriteLine(result+"SKU answer 1");	
	
	var result = Device.Click("btnForward");
	Console.WriteLine(result);	
	
	Console.WriteLine(CheckScreen("Visit_SKUs.xml"));
	
	Console.WriteLine(CheckValue("grScrollView.Controls[0].Controls[0].Controls[0].Text", "1 из 1"));
	
	var result=Device.Click("grScrollView.Controls[0]"); // SKU question 
	Console.WriteLine(result+"SKU question ");	 //Проверка повторного входа на экран
	
	var result=Device.GetValue("grScrollView.Controls[0].Controls[0].Controls[0].Value");
	result= (result=="True")? "True":"False";
	
	var result = Device.Click("btnForward");
	Console.WriteLine(result);	
	
	var result=Device.Click("grScrollView.Controls[2]"); // SKU question 
	Console.WriteLine(result+"SKU question ");	
	
	Console.WriteLine(CheckScreen("Visit_SKU.xml"));
	
	var result=Device.Click("grScrollView.Controls[0].Controls[0].Controls[0]"); // SKU answer 1
	Console.WriteLine(result+"SKU answer 1");	
	
	Console.WriteLine(TextCheck("grScrollView.Controls[2].Controls[0].Controls[0]", "1"+n));	
	
	Console.WriteLine(TextCheck("grScrollView.Controls[4].Controls[0].Controls[0]", "14"+n));	
	
	Console.WriteLine(TextCheck("grScrollView.Controls[6].Controls[0].Controls[0]", "5" +n));	
	
	Console.WriteLine(TextCheck("grScrollView.Controls[8].Controls[0].Controls[0]", "12"+n));	
	
	var result=Device.Click("grScrollView.Controls[10].Controls[0].Controls[0]"); // SKU answer 5
	Console.WriteLine(result+"SKU answer 5");	
	
	var result = Device.Click("btnForward");
	Console.WriteLine(result);	
	
	Console.WriteLine(CheckScreen("Visit_SKUs.xml"));
	
	Console.WriteLine(CheckValue("grScrollView.Controls[2].Controls[0].Controls[0].Text", "6 из 6"));
	
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
	
	var result=CheckValue("grScrollView.Controls[0].Controls[0].Controls[0].Text", "Алкоголь"); //Checking groups
	Console.WriteLine(result+"Checking groups");
	
	var result=Device.Click("grScrollView.Controls[6]"); // Add SKU to Order
	Console.WriteLine(result);
	
	Console.WriteLine(CheckScreen("Order_EditSKU.xml"));
	
	var result=TextCheck("grScrollView.Controls[2].Controls[1].Controls[0]", "54"); //Quantity
	Console.WriteLine(result+"Quantity");
	
	var result = Device.Click("btnForward");
	Console.WriteLine(result);	
	
	Console.Pause(500);
	
	var result = Device.Click("btnForward");
	Console.WriteLine(result);	
	
	Console.WriteLine(CheckScreen("Order_Commentary.xml"));
	
	Console.WriteLine(TextCheck("grScrollView.Controls[2].Controls[0].Controls[1]", "Комментарий к заказу"));	
	
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
	if (result=="5 из 8") { result="True";
	}
	else{
		result="False";
	}
	
	Console.WriteLine(result);	
	
	var result = Device.GetValue("grScrollView.Controls[6].Controls[0].Controls[0].Text");
	Console.WriteLine(result);	
	if (result=="7 из 13") { result="True";
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