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

	var result = Device.Click("btnOrder");
	Stopwatch.Start();
	Console.WriteLine(result);
	
	var result = CheckScreen("OrderList.xml");
	if (result=="OrderList.xml") {
		var result = Stopwatch.Stop();
		Console.WriteLine(result.TotalSeconds);
	}
	else{
		Console.WriteLine(result);
	}
	
	var result = Device.Click("NewOrder");
	Console.WriteLine(result);
	
	Console.WriteLine(CheckScreen("Outlets.xml"));
	
	Console.WriteLine(Search("edtSearch", "new"));	
	
	var outlet=Device.GetValue("grScrollView.Controls[0].Controls[0].Controls[0].Text");
	Console.WriteLine("Заказ для "+ outlet);
	
	Console.Pause(1000);
	
	var result = Device.Click("grScrollView.Controls[0]");
	Console.WriteLine(result);
	/* Took outlet descr from workflow in future*/
	
	Console.Pause(1000);
	
	Console.WriteLine(CheckScreen("Order.xml"));
	
	var result=Device.Click("grScrollView.Controls[0]"); // Price-list
	Console.WriteLine(result+"Price-list");
	
	Console.Pause(500);
	
	Console.WriteLine(CheckScreen("ListChoice.xml"));
	
	var priceList=Device.GetValue("grScrollView.Controls[2].Controls[0].Controls[0].Text");
	
	var result=Device.Click("grScrollView.Controls[2]"); // Choose Price-list
	Console.WriteLine(result+"Choose Price-list");
	
	Console.WriteLine(CheckScreen("Order.xml"));
	
	Console.WriteLine(CheckValue("Orderadd.Controls[0].Controls[0].Text", "0,00"));
	
	Console.Pause(1000);
	
	var i=0;
	var ord=0;
	
	while (ord<40)  {
		
		Console.WriteLine("Ord="+ord);
		
		i++;
		
		var 	n=1+i;
		
		
		 if (n%2>0) {
		n=n+1;}
		 else {
		
		var result = Device.Click("Orderadd");
		Stopwatch.Start();
		Console.WriteLine(result);
		
		Console.Pause(1000);
		
		var result = CheckScreen("Order_SKUs.xml");
		if (result=="Order_SKUs.xml") {
			var result = Stopwatch.Stop();
			Console.WriteLine(result.TotalSeconds);
		}
		else{
			Console.WriteLine(result);
		}
		
		var exp="grScrollView.Controls["+n+ "]";
		
		Console.WriteLine(exp);
		
		Console.Pause(1000);
		
		var result=Device.Click(exp); // Add SKU to Order
		Console.WriteLine(result);

		Console.Pause(1000);
		
		var result = Device.GetValue("context.CurrentScreen.Name");
		if (result=="Features.xml") {
			
			var feature=Device.GetValue("grScrollView.Controls[0].Controls[0].Controls[0].Text");
			
			var result=Device.Click("grScrollView.Controls[0]"); // Choose feature
			Console.WriteLine(result);
			
			Console.WriteLine(CheckScreen("Order_EditSKU.xml"));
			
			var price = Device.GetValue("grScrollView.Controls[2].Controls[0].Controls[0].Text");
			if (price != "0,00"  || price != "") {
				result="True";
			}
			else {
				result="False";
			}
			Console.WriteLine(result);
			
			var quantity="23";
			Console.WriteLine(TextCheck("grScrollView.Controls[4].Controls[0].Controls[0]", quantity));
			
			
			var result = Device.Click("btnForward");
			Console.WriteLine(result);	
			
			
			Console.WriteLine(CheckScreen("Order.xml"));
			ord++;
		}
		
		else {
			
			if(result=="Order_EditSKU.xml") {
				
				var price = Device.GetValue("grScrollView.Controls[2].Controls[0].Controls[0].Text");
				if (price != "0,00"  || price != "") {
					result="True";
				}
				else {
					result="False";
				}

				var quantity="5";
				TextCheck("grScrollView.Controls[4].Controls[0].Controls[0]", quantity);
				if (result !="True; True; True") {
					Console.WriteLine(result+"Количество не вводится");
				}
				else {
					result="True";
					Console.WriteLine(result);
				}
				
				Device.Click("grScrollView.Controls[2].Controls[2].Controls[0]");
				
				var markup="30";
				TextCheck("grScrollView.Controls[2].Controls[1].Controls[0]", markup);
				if (result !="True; True; True") {
					Console.WriteLine(result+ "Наценка не вводится");
				}
				else {
					result="True";
					Console.WriteLine(result);
				}
				
				var result = Device.Click("grScrollView.Controls[0].Controls[0]");
				Console.WriteLine(result);	
				
				price= price*((markup/100)+1);
				Console.WriteLine(price);
				
				Console.WriteLine(CheckValue("grScrollView.Controls[2].Controls[0].Controls[0].Text", price)+ "  Check Price");
				
				var amount=price*quantity;
			
				Console.WriteLine(amount);
				
				var result = Device.Click("btnForward");
				Console.WriteLine(result);	
				
				Console.WriteLine(CheckScreen("Order.xml"));
				ord++;
				
			}
			
			else { 
				i++;
				var result = Device.Click("btnBack");
				Console.WriteLine(result);	
			}
		}
		 }
		
		
	}
	
	var result = Device.Click("btnForward");
	Console.WriteLine(result);	
	
	Console.WriteLine(CheckScreen("Order_Commentary.xml"));
	
	Console.WriteLine(TextCheck("grScrollView.Controls[0].Controls[0].Controls[2]", "Комментарий к большому заказу  "));	
	
	var result = Device.Click("btnForward");
	Console.WriteLine(result);	
	
	Console.WriteLine(CheckScreen("Main.xml"));
	
}