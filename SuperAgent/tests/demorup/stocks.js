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
   
  	var result = Device.Click("btnDistr");
	Stopwatch.Start();
	Console.WriteLine(result);
	
	var result = CheckScreen("Stock_SKUs.xml");
	if (result=="Stock_SKUs.xml") {
		var result = Stopwatch.Stop();
		Console.WriteLine(result.TotalSeconds);
	}
	else{
		Console.WriteLine(result);
	}
	
   // var result = Device.GetCount("sku");
    // Console.WriteLine(result);    
	
	// Console.WriteLine(Search("edtSearch", "торт"));	
	
		 var result=Device.Click("grScrollView.Controls[2]"); // Choose SKU
	Console.WriteLine(result);
	
	var result = CheckScreen("SKU_Image.xml");
	
	Console.Pause(1000);
	
		Device.TakeScreenshot("StockWithoutImage");
	
	var result = Device.Click("btnBack");
    Console.WriteLine(result);
	
	// Console.WriteLine(Search("edtSearch", "шуруп"));	
	
		var result=Device.Click("grScrollView.Controls[2]"); // Choose SKU
	Console.WriteLine(result);
	
	var result = CheckScreen("SKU_Image.xml");
	
		Device.TakeScreenshot("StockWithImage");
	
	var result = Device.Click("btnBack");
    Console.WriteLine(result);
	
	var result = Device.Click("btnBack");
    Console.WriteLine(result);   
   
}