/* Создать визит с задачей, вопросами , вопросами по SKU, прайс-листами и инкассацией.
*/
function TextCheck (path, text) {
	var result1= Device.SetFocus(path);
	
	var result2 = Device.SetText(path, text);
	
	var textp=path+".Text";
	
	var result3= Device.GetValue(textp);
	
	if (result3==text) { 	result3 = "True";
	}
	else{ 
		result3 = "False";
	}
	var result=result1+"; "+result2+"; "+result3;
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

function random_even(a,b){
	var k=getRandomArbitary(a,b);
	if (k%2>0){
		var num=k+1;
	}
	else {
		var num=k;
	}
	return num;
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

function CurrTime(){

	var curr=new Date();

	var hour = curr.getHours();
	hour= (hour < 10 )? '0' + hour : hour;
	var min = curr.getMinutes();
	min=min+3;
	min= (min < 10 )? '0' + min : min;
	var result=hour+":"+min;
	return  result;
}

function Sync(){
	var timer= Stopwatch.Elapsed();
	timer=timer.TotalSeconds;
	Console.WriteLine(timer+" totalsec")
	if (timer=="180" ||  timer>"180"){
		Console.WriteLine(Device.Click("btnSync")+"Синхронизация произведена");
		var st=0;
		Console.Pause(1000);
	}
	else {
		var st=1;
		Console.WriteLine("Еще рано");
	}
	return st;
}

function CheckEmptyScreens(){
	
	Console.WriteLine(screen+"   test")
	switch (screen){
	case "Tasks.xml":
		
		Console.WriteLine("Экран "+screen);	
		var result=Device.Click("grScrollView.Controls[0]"); // Task 
		Console.WriteLine(result+"Task ");
		
		Console.WriteLine(CheckScreen("Visit_Task.xml"));
		
		var result=Device.Click("grScrollView.Controls[2].Controls[0].Controls[0]");  // Task - result
		Console.WriteLine(result+"Task - result");
		
		var result = Device.Click("btnForward");
		Console.WriteLine(result);
		var result=Stopwatch.Elapsed();
		Console.WriteLine(result.TotalSeconds+"   sec");      //Check sec
		
		var result = Device.Click("btnForward");
		Console.WriteLine(result);
		
	case "Visit_Questions.xml":
		Console.WriteLine("Экран "+screen);	
		Console.WriteLine(TextCheck("grScrollView.Controls[10].Controls[0].Controls[0]", "String"+n));	//Каталог товара есть в магазине" Question string
		
		Console.WriteLine(TextCheck("grScrollView.Controls[7].Controls[0].Controls[0]", "123546"+n));	//,"Доля полки %" //Question int
		
		Console.WriteLine(CheckValue("grScrollView.Controls[12].Controls[0].Controls[0].Text","Набор рекомендуемых  к размещению  POSM установлен"));//,"Набор рекомендуемых  к размещению  POSM установлен"   Question (Boolean)
		
		var result=Device.Click("grScrollView.Controls[13].Controls[0].Controls[0]")

		Console.WriteLine(TextCheck("grScrollView.Controls[19].Controls[0].Controls[0]", "123.6"+n));	//Стандарт по доле полки относительно конкурентов  выполнен"));   Question (Decimal)
		
		var result = Device.Click("btnForward");
		Console.WriteLine(result);
		
	case "Visit_SKUs.xml":
		Console.WriteLine("Экран "+screen);	
		var result=Device.GetValue("grScrollView.Controls[0].Controls[0].Controls[0].Text"); // SKU question 

		var result=Device.Click("grScrollView.Controls[0]"); // SKU question 
		Console.WriteLine(result+"SKU question ");	
		
		Console.WriteLine(CheckScreen("Visit_SKU.xml"));
		
		var result=Device.Click("grScrollView.Controls[0].Controls[0].Controls[0]"); // SKU answer 1
		Console.WriteLine(result+"SKU answer 1");	
		
		
		var result = Device.Click("btnForward");
		Console.WriteLine(result);	
		
		
		var result = Device.Click("btnForward");
		Console.WriteLine(result);	
		
		var result=Stopwatch.Elapsed();       //Check sec
		Console.WriteLine(result.TotalSeconds+"   sec");
	}
}

function main() {

	Console.CommandPause = 300;

	var i=0;
	var st=0;
	while (i<3000){
		if (st==1){
			Console.WriteLine("Continue...");
			
		}
		else{
			Stopwatch.Start();
			Console.WriteLine("Timer is nulled");
		}
		var n=getRandomArbitary(1,865);
		Console.WriteLine(n);
		
		i++;
		Console.WriteLine(i);

		var result = Device.Click("btnVisit");
		Console.WriteLine(result);
		
		Console.WriteLine(CheckScreen("Outlets.xml"));
		
		var m=random_even(0,53);
		var k="grScrollView.Controls["+ m+"]";
		Console.WriteLine(k);
		
		var result=Stopwatch.Elapsed();                           //Check sec
		Console.WriteLine(result.TotalSeconds+"   sec");
		
		var result = Device.Click(k);
		Console.WriteLine(result);
		
		Console.WriteLine(CheckScreen("Outlet.xml"));
		
		var outlet=Device.GetValue("workflow[outlet].Description");
		Console.WriteLine( outlet);
		
		//Вставить установку координат
		
		var result=Device.Click("grScrollView.Controls[12]") //Выбор параметра
		Console.WriteLine(result+"Выбор параметра ");
		
		Console.WriteLine(CheckScreen("OutletParameter.xml"));
		
		Console.WriteLine(TextCheck("grScrollView.Controls[2].Controls[0]", "1254"));	
		
		var result = Device.Click("btnForward");
		Console.WriteLine(result);
		
		var result = Device.Click("btnForward");
		Console.WriteLine(result);
		
		Console.Pause(500);
		var screen=Device.GetValue("context.CurrentScreen.Name");
		while (screen!="Order.xml"){
			CheckEmptyScreens();
			var screen =Device.GetValue("context.CurrentScreen.Name");
		}
		/*Order*/

		Console.WriteLine("Its works")
		
		var result=Device.Click("Orderadd.Controls[0].Controls[0].Controls[0]");
		Console.WriteLine(result);
		
		Console.WriteLine(CheckScreen("Order_Info.xml"));
		
		var result=Device.GetValue("grScrollView.Controls[2].Controls[0].Controls[0].Text"); 
		Console.WriteLine(result);
		if (result=="Для этой торговой точки нет прайс-листов"){
			Console.WriteLine("Прайс-листов нет");
			var result = Device.Click("btnForward");
			Console.WriteLine(result);	
			
			
		}
		else{
			Console.WriteLine("Прайс-лист есть");
			
			var result = Device.Click("btnForward");
			Console.WriteLine(result);	
			var result=Stopwatch.Elapsed();       //Check sec
			Console.WriteLine(result.TotalSeconds+"   sec");
			
			var result = Device.Click("Orderadd.Controls[0].Controls[0].Controls[2]");
			//Stopwatch.Start();
			Console.WriteLine(result);
			
			
			var result = CheckScreen("Order_SKUs.xml");
			//	if (result=="Order_SKUs.xml") {
			// var result = Stopwatch.Stop();
			// Console.WriteLine(result.TotalSeconds);
			// }
			// else{
			Console.WriteLine(result);
			//}
			
			// var result=Device.SetFocus("grScrollView.Controls[0]"); //Checking groups
			// Console.WriteLine(result+" Checking groups");
			
			var result=Stopwatch.Elapsed();       //Check sec
			Console.WriteLine(result.TotalSeconds+"   sec");
			
			var m=random_even(0,7);
			var k="grScrollView.Controls["+ m+"]";
			Console.WriteLine(k);
			var result=Device.Click(k); // Add SKU to Order
			Console.WriteLine(result);
			
			Console.Pause(500);
			
			var result=Device.GetValue("context.CurrentScreen.Name");
			if (result=="Order_EditSKU.xml"){
				Console.WriteLine("1");
				var result=TextCheck("grScrollView.Controls[2].Controls[1].Controls[0]", n);
				Console.WriteLine(result+"Quantity");
				
				var result = Device.Click("btnForward");
				Console.WriteLine(result);	
			}
			else{
				Console.WriteLine("2");
				m=m+2;
				k="grScrollView.Controls["+ m+"]";
				var result=Device.Click(k); // Add SKU to Order
				Console.WriteLine(result);
				Console.WriteLine(TextCheck("grScrollView.Controls[2].Controls[1].Controls[0]", n));
				Console.WriteLine(result+"Quantity");
				
				var result = Device.Click("btnForward");
				Console.WriteLine(result);	
			}	
		}
		
		var result = Device.Click("btnForward");
		Console.WriteLine(result);	
		
		Console.WriteLine(CheckScreen("Order_Commentary.xml"));
		
		Console.WriteLine(TextCheck("grScrollView.Controls[2].Controls[0].Controls[1]", "Комментарий к заказу  "+ n ));	
		
		var result = Device.Click("btnForward");
		Console.WriteLine(result);	
		
		Console.WriteLine(CheckScreen("Receivables.xml"));
		
		Console.WriteLine(TextCheck("grScrollView.Controls[0].Controls[1].Controls[0]", n));	//Quantity
		
		var result = Device.Click("grScrollView.Controls[2]");
		Console.WriteLine(result);	
		
		var result = Device.Click("btnForward");
		Console.WriteLine(result);	
		
		Console.WriteLine(CheckScreen("Visit_Total.xml"));
		
		Device.TakeScreenshot("Total"+n);
		
		var result = Device.Click("btnForward");
		Console.WriteLine(result);	
		
		Console.WriteLine(CheckScreen("Main.xml"));
		
		st=Sync();
		
		
	}
}