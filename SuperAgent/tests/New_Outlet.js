
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

function getRandomArbitary(min, max){
	return Math.round(Math.random() * (max - min) + min);
}

function main() {


	var n=getRandomArbitary(1,865);
	Console.WriteLine(n);

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
	
	var result = Device.Click("NewOutlet");
	Console.WriteLine(result);
	
	Console.WriteLine(CheckScreen("Outlet.xml"));
	
	var result = Device.SetFocus("headerDescr.Controls[0].Controls[0].Controls[0].Controls[0]");  //Проверка изменения названия т.т. из мобильного приложения
	Console.WriteLine(result+"Проверка изменения названия т.т. из мобильного приложения");
	
	var result = Device.SetText("headerDescr.Controls[0].Controls[0].Controls[0].Controls[0]", "Тестовая т.т");  //Проверка изменения названия т.т. из мобильного приложения
	Console.WriteLine(result);
	
	Console.WriteLine(TextCheck("grScrollView.Controls[0].Controls[0].Controls[0]", "Новый адрес"));	//Адрес т.т.
	
	
	var result = Device.Click("grScrollView.Controls[4]"); // Выбор класса т.т.
	Console.WriteLine(result+"Выбор класса т.т.");
	
	Console.WriteLine(CheckScreen("ListChoice.xml"));
	
	var result = Device.Click("grScrollView.Controls[2]"); 
	Console.WriteLine(result);
	
		Console.WriteLine(CheckScreen("Outlet.xml"));
	
	var result = Device.Click("grScrollView.Controls[6]"); //Выбор типа т.т.
	Console.WriteLine(result+"Выбор типа т.т.");
	
	Console.WriteLine(CheckScreen("ListChoice.xml"));
	
	var result = Device.Click("grScrollView.Controls[2]"); 
	Console.WriteLine(result);
	
		Console.WriteLine(CheckScreen("Outlet.xml"));
	
	var result = Device.Click("grScrollView.Controls[8]");//Выбор дистрибьютора т.т. 
	Console.WriteLine(result+"Выбор дистрибьютора т.т.");
	
	var result = Device.Click("grScrollView.Controls[2]"); 
	Console.WriteLine(result);
	
	var result=Device.Click("grScrollView.Controls[12]") //Выбор параметра целого типа(Наличие акционных моделей)
	Console.WriteLine(result+"Выбор параметра целого типа(Наличие акционных моделей)");
	
	Console.WriteLine(CheckScreen("OutletParameter.xml"));
	
	Console.WriteLine(TextCheck("grScrollView.Controls[2].Controls[0]", "1254"));	
	
	var result = Device.Click("btnForward");
	Console.WriteLine(result);
	
	Console.WriteLine(CheckScreen("Outlet.xml"));
	
	var result=Device.Click("grScrollView.Controls[18]") //Выбор параметра строкового типа(Правильная выкладка)
	Console.WriteLine(result+"Выбор параметра строкового типа(Правильная выкладка)");
	
	Console.WriteLine(TextCheck("grScrollView.Controls[2].Controls[0]", "Значение строкового типа"));	
	
	var result = Device.Click("btnBack");
	Console.WriteLine(result);
	
	var result = Device.GetValue("context.CurrentScreen.Name");
	Console.Terminate(result != "Outlet.xml", "Экран Outlet не открывается!");
	
	var result=Device.Click("grScrollView.Controls[38]") //Выбор параметра Десятичного типа (Размер дебиторской задолженности)
	Console.WriteLine(result+"Выбор параметра Десятичного типа (Размер дебиторской задолженности)");
	
	Console.WriteLine(TextCheck("grScrollView.Controls[2].Controls[0]", "125.4"));	
	
	var result = Device.Click("btnForward");
	Console.WriteLine(result);
	
	var result=Device.Click("grScrollView.Controls[14]") //Выбор параметра Логического типа (Оформление витрины samsung)
	Console.WriteLine(result+"Выбор параметра Логического типа (Оформление витрины samsung)");
	
	/*var result = Device.Click("btnForward");
	Console.WriteLine(result);	//Обращение к диалоговому окну
	*/
	var result=Device.Click("grScrollView.Controls[2].Controls[0]");
	Console.WriteLine(result);
	
	var result = Device.Click("btnForward");
	Console.WriteLine(result);
	
	var result = Device.Click("btnForward");
	Console.WriteLine(result);
	
	 var SaveMess=Dialog.GetMessage();
	var result =(SaveMess =="Сохранить изменения?")?"True": "False";
	Console.WriteLine(result);
	
	var result=Dialog.ClickPositive();
	
	Console.WriteLine(result);
	
	Console.WriteLine(CheckScreen("Main.xml"));
	
}