
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

function main() {

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
	
	var result = Device.Click("grScrollView.Controls[0]");
	Console.WriteLine(result);
	
	Console.WriteLine(CheckScreen("Outlet.xml"));
	
	var result = TextCheck("headerDescr.Controls[0].Controls[0].Controls[0].Controls[0]", "Наименование");  //Проверка изменения названия т.т. из мобильного приложения
	if (result !=="True; True; True"){ 		result="True";
	}
	Console.WriteLine(result);
	
	Console.WriteLine(TextCheck("grScrollView.Controls[0].Controls[0].Controls[0]", "Новый адрес"));	
	
	var result = Device.Click("grScrollView.Controls[6]"); // Выбор класса т.т.
	Console.WriteLine(result);
	
	Console.WriteLine(CheckScreen("ListChoice.xml"));
	
	var result = Device.Click("grScrollView.Controls[2]"); 
	Console.WriteLine(result);
	
	Console.WriteLine(CheckScreen("Outlet.xml"));
	
	Console.WriteLine(CheckValue("grScrollView.Controls[6].Controls[0].Controls[0].Text", "А"));
	
	var result=Device.Click("grScrollView.Controls[14]") //Выбор параметра целого типа(Наличие акционных моделей)
	Console.WriteLine(result+"Выбор параметра целого типа(Наличие акционных моделей)");
	
	Console.WriteLine(CheckScreen("OutletParameter.xml"));
	
	Console.WriteLine(TextCheck("grScrollView.Controls[2].Controls[0]", "1254"));	
	
	var result = Device.Click("btnForward");
	Console.WriteLine(result);
	
	Console.WriteLine(CheckScreen("Outlet.xml"));
	
	Console.WriteLine(CheckValue("grScrollView.Controls[14].Controls[0].Controls[0].Text", "1254"));
	
	var result=Device.Click("grScrollView.Controls[20]") //Выбор параметра строкового типа(Правильная выкладка)
	Console.WriteLine(result+"Выбор параметра строкового типа(Правильная выкладка)");
	
	Console.WriteLine(TextCheck("grScrollView.Controls[2].Controls[0]", "String"));	
	
	var result = Device.Click("btnBack");
	Console.WriteLine(result);
	
	Console.WriteLine(CheckScreen("Outlet.xml"));
	
	Console.WriteLine(CheckValue("grScrollView.Controls[20].Controls[0].Controls[0].Text", "String"));
	
	var result=Device.Click("grScrollView.Controls[40]") //Выбор параметра Десятичного типа (Размер дебиторской задолженности)
	Console.WriteLine(result+"Выбор параметра Десятичного типа (Размер дебиторской задолженности)");
	
	Console.WriteLine(TextCheck("grScrollView.Controls[2].Controls[0]", "125.4"));	
	
	var result = Device.Click("btnForward");
	Console.WriteLine(result);
	
	Console.WriteLine(CheckValue("grScrollView.Controls[40].Controls[0].Controls[0].Text", "125.4"));
	
	var result=Device.Click("grScrollView.Controls[16]") //Выбор параметра Логического типа (Оформление витрины samsung)
	Console.WriteLine(result+"Выбор параметра Логического типа (Оформление витрины samsung)");
	
	var result=Device.Click("grScrollView.Controls[2].Controls[0]");
	Console.WriteLine(result);
	
	var result=Device.GetValue("grScrollView.Controls[2].Controls[0].Value");
	if (result=="True") {
		var result = Device.Click("btnForward");
		Console.WriteLine(result);
		Console.WriteLine(CheckValue("grScrollView.Controls[16].Controls[0].Controls[0].Text", "Да"));
	}
	else{
		var result = Device.Click("btnForward");
		Console.WriteLine(result);
		Console.WriteLine(CheckValue("grScrollView.Controls[16].Controls[0].Controls[0].Text", "Нет"));
	}
	
	var result=Device.Click("grScrollView.Controls[12]") //Выбор параметра строкового типа(Правильная выкладка)
	Console.WriteLine(result);
	
	var result = Device.Click("btnBack");
	Console.WriteLine(result);
	
	Console.WriteLine(CheckScreen("Outlet.xml"));
	
	Console.WriteLine(CheckValue("grScrollView.Controls[12].Controls[0].Controls[0].Text", "?"));
	
	var result = Device.Click("btnBack");
	Console.WriteLine(result);
	
	Console.WriteLine(CheckScreen("Main.xml"));
	
}