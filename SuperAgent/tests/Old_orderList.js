/*  Получить номера  заказов из 1С

Запуск бат 
var wsh = new ActiveXObject("WScript.Shell");
wsh.Run(new ActiveXObject("Scripting.FileSystemObject").GetAbsolutePathName("")+"/Schedule.bat");
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


function CheckScreen(screen) {

	var result = Device.GetValue("context.CurrentScreen.Name");
	Console.Terminate(result != screen, "  Экран"+ screen +  "не открывается!");

	return result;
}

function getRandomArbitary(min, max){
	return Math.random() * (max - min) + min;
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

function main() {

Console.CommandPause = 500;

	var result = Device.Click("btnOrder");
	Stopwatch.Start();
	Console.WriteLine(result);
	
	var result = CheckScreen("OrderList.xml");
	if (result=="OrderList.xml") {
		var result = Stopwatch.Stop();
		Console.WriteLine(result.TotalSeconds+"  OrderList loading time");
	}
	else{
		Console.WriteLine(result);
	}
	/*Old order*/
	/*var a=getRandomArbitary(0,3);*/
	var result = Device.Click("grScrollView.Controls[0]");
	Console.WriteLine(result+"Old order");
	
	Console.Pause(500);
	
	Console.WriteLine(CheckScreen("Order.xml"));
	
	Device.Click("Orderadd");
	var result = Device.GetValue("context.CurrentScreen.Name");
	Console.Terminate(result != "Order.xml", "Старые заказы не заблокированы на редактирование!");

	Device.Click("grScrollView.Controls[2]");
	var result = Device.GetValue("context.CurrentScreen.Name");
	Console.Terminate(result != "Order.xml", "Старые заказы не заблокированы на редактирование!");
	
	Device.TakeScreenshot("OldOrder");
	
	var result= Device.GetValue("Orderadd.Controls[0].Controls[0].Text");
	if (result =="0,00") {
		result="False";
	}
	else{
		result="True";
	}
	Console.WriteLine(result);
	
	Device.Click("grScrollView.Controls[0]");
	var result = Device.GetValue("context.CurrentScreen.Name");
	Console.Terminate(result != "Order.xml", "Старые заказы не заблокированы на редактирование!");

	var result= Device.GetValue("grScrollView.Controls[0].Controls[0].Controls[0].Text");
	if (result==""){
		result="False";
	}
	else {
		result="True";
	}
	Console.WriteLine(result+" Проверка отображения пустой строки в старых заказах");
	
	var result = Device.Click("btnForward");
	Console.WriteLine(result);	
	
	Console.WriteLine(CheckScreen("Order_Commentary.xml"));
	
	var result=TextCheck("grScrollView.Controls[0].Controls[0].Controls[2]", "Коммент");	
	if (result !="True; True; True"){
		result="True";
		Console.WriteLine(result + "Проверка изменения комментария в старых заказах");
	}
	else {
		Console.WriteLine(result+" Проверка изменения комментария в старых заказах");
	}
	
	var result = Device.Click("btnForward");
	Console.WriteLine(result);	
	
	Console.WriteLine(CheckScreen("Main.xml"));
}