// /* Сменить класс тт на С, прайс-листами и инкассацией.
// */

function Search(path, text) {
	var result1 = Device.SetFocus(path);

	var result2 = Device.SetText(path, text);

	textp = path + ".Text";
	var result3 = Device.GetValue(textp);

	var result4 = Device.Click("btnSearch");

	if (result3 == text) {
		result3 = "True";
	} else {
		result3 = "False";
	}

	if (result1 == result2 && result1 == result3 && result1 == result4
			&& result1 == "True") {
		result = "True";
	} else {
		result = result1 + "; " + result2 + "; " + result3 + "; " + result4;
	}
	return result;
}

function CheckScreen(screen) {

	var result = Device.GetValue("context.CurrentScreen.Name");
	Console.Terminate(result != screen, " Экран " + screen + " не открывается!");
	return result;
}

function RunStopWatch(StartButton, StopScreen) {
	Device.Click(StartButton);
	Stopwatch.Start();
	do {
		var CurrScreen = Device.GetValue("context.CurrentScreen.Name");
	} while (CurrScreen != StopScreen);
	var result = Stopwatch.Stop();
	Console.WriteLine(result.TotalSeconds + " "+ StopScreen + "  loading time");

}

function ClickAndCheck(type, path, value, description) {

	if (type == "bool") {
		Console.WriteLine("---------------" + type + "---------------------");

		var result = Device.Click(path);
		Console.WriteLine(result + description);

		if (value == "NoAnswer") {
			var result = Dialog.SelectItem(0);
			Console.WriteLine(result);
			Console.WriteLine(Dialog.ClickPositive());
			value = " ";
		} else if (value == "Да") {
			var result = Dialog.SelectItem(1);
			Console.WriteLine(result);
			Console.WriteLine(Dialog.ClickPositive());
		} else if (value == "Нет") {
			var result = Dialog.SelectItem(2);
			Console.WriteLine(result);
			Console.WriteLine(Dialog.ClickPositive());
		}

		var textPath = path + ".Controls[1].Text";
		var result = CheckTextViewValue(textPath, value);
		// Console.WriteLine(result);
		if (result == "True") {
			var result = "True";
			Console.WriteLine(result + " Result= " + value);
		}

		else {
			var result = "False";
			Console.WriteLine(result + "Выбранное значение не отображается");
		}
	}

	else if (type == "valueList") {
		Console.WriteLine("---------------" + type + "---------------------");
		Console.WriteLine(type + "--" + path + "--" + value + "--" + description);

		var result = Device.Click(path);
		Console.WriteLine(result);

		var description = Dialog.GetItem(value); // Add get chosen value description

		var result = Dialog.SelectItem(value);
		Console.WriteLine(result);
		Console.WriteLine(Dialog.ClickPositive());

		// Console.WriteLine(Device.GetValue("grScrollView.Controls[14].Controls[1].Text"));
		var pathWithText = path + ".Controls[1].Text";

		Console.WriteLine(CheckTextViewValue(pathWithText, description));

	}
}

function CheckTextViewValue(path, text) {
	var result = Device.GetValue(path);
	Console.WriteLine(result + " " + text);
	if (result == text) {
		result = "True";

		Console.WriteLine(result);
	} else {
		result = "False";
		Console.WriteLine(result);
	}
	return result;
}


function EditTextCheck(path, text) {

	var result1 = Device.SetFocus(path);

	var result2 = Device.SetText(path, text);

	textp = path + ".Text";

	var result3 = Device.GetValue(textp);

	if (result3 == text) {
		result3 = "True";
	} else {
		result3 = "False";
	}
	result = result1 + "; " + result2 + "; " + result3;
	return result;
}


function main() {


	Console.WriteLine("-----Модуль Визиты(Плановые)------");
	
	RunStopWatch("swipe_layout.Controls[0].Controls[1]", "Visit\\Visits.xml");
	
	var result = Device.Click("btnMenu");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("Main.xml"));

	var result = Device.Click("swipe_layout.Controls[0].Controls[1]");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("Visit\\Visits.xml"));

	RunStopWatch("grScrollView.Controls[2]", "Outlets\\Outlet.xml");
	
	var result = Device.Click("btnBack");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("Visit\\Visits.xml"));
	
	RunStopWatch("grScrollView.Controls[8]", "Outlets\\Outlet.xml");
	
	RunStopWatch("btnForward", "Visit\\Tasks.xml");
		
	RunStopWatch("grScrollView.Controls[2].Controls[1]", "Visit\\Task.xml");
	
	var result = Device.Click("btnBack"); //По нажатию "Назад" не должен переходить на предыдущий экран
	Console.WriteLine(result);
	
	Console.WriteLine(CheckScreen("Visit\\Task.xml"));
	
	var result = Device.Click("btnDone");
	Console.WriteLine(result);
	
	Console.WriteLine(CheckScreen("Visit\\Tasks.xml"));
	
	RunStopWatch("btnForward", "Visit\\Questions.xml");

	var result = Device.Click("btnBack");
	Console.WriteLine(result);
	
	Console.WriteLine(CheckScreen("Visit\\Tasks.xml"));
	
	RunStopWatch("btnForward", "Visit\\Questions.xml");
	
	RunStopWatch("btnForward", "Visit\\SKUs.xml");
	
	RunStopWatch("grScrollView.Controls[2]", "Visit\\SKU.xml");
	
	var result = Device.Click("btnBack"); //По нажатию "Назад" не должен переходить на предыдущий экран
	Console.WriteLine(result);
	
	Console.WriteLine(CheckScreen("Visit\\SKU.xml"));
	
	var result = Device.Click("btnDone");
	Console.WriteLine(result);
	
	Console.WriteLine(CheckScreen("Visit\\SKUs.xml"));
	
	RunStopWatch("btnForward", "Order\\Order.xml");
	
	var result = Device.Click("btnBack");
	Console.WriteLine(result);
	
	Console.WriteLine(CheckScreen("Visit\\SKUs.xml"));	
	
	RunStopWatch("btnForward", "Order\\Order.xml");
	
	RunStopWatch("grScrollView.Controls[2]", "Order_Info.xml");
		
	//var result = Device.Click("btnBack"); //По нажатию "Назад" не должен переходить на предыдущий экран
	//Console.WriteLine(result);
	
	Console.WriteLine(CheckScreen("Order_Info.xml"));
	
	var result = Device.Click("btnDone");
	Console.WriteLine(result);
	
	Console.WriteLine(CheckScreen("Order\\Order.xml"));
	
	var result = Device.Click("btnBack");
	Console.WriteLine(result);
	
	Console.WriteLine(CheckScreen("Visit\\SKUs.xml"));	
	
	RunStopWatch("btnForward", "Order\\Order.xml");
	
	RunStopWatch("btnAdd", "Order\\Order_SKUs.xml");
		
//	var result = Device.Click("btnBack"); //По нажатию "Назад" не должен переходить на предыдущий экран
//	Console.WriteLine(result);
	
	Console.WriteLine(CheckScreen("Order\\Order_SKUs.xml"));
	
	RunStopWatch("grScrollView.Controls[2]", "Order_EditSKU.xml");
	
	var result = Device.Click("btnBack"); //По нажатию "Назад" не должен переходить на предыдущий экран
	Console.WriteLine(result);
	
	Console.WriteLine(CheckScreen("Order_EditSKU.xml"));
	
	var result = Device.Click("btnCancel");
	Console.WriteLine(result);
	
	Console.WriteLine(CheckScreen("Order\\Order_SKUs.xml"));	
	
	RunStopWatch("grScrollView.Controls[2]", "Order_EditSKU.xml");
	
	var result = EditTextCheck("grScrollView.Controls[4].Controls[1]", "54"); // Quantity
	Console.WriteLine(result + "Quantity");
	
	var result = Device.Click("btnAdd");
	Console.WriteLine(result);
	
	Console.WriteLine(CheckScreen("Order\\Order_SKUs.xml"));	
	
	var result = Device.Click("btnDone");
	Console.WriteLine(result);
	
	Console.WriteLine(CheckScreen("Order\\Order.xml"));
	
	var result = Device.Click("btnBack");
	Console.WriteLine(result);
	
	Console.WriteLine(CheckScreen("Visit\\SKUs.xml"));	
	
	RunStopWatch("btnForward", "Order\\Order.xml");
	
	RunStopWatch("btnForward", "Receivables.xml");
	
	var result = Device.Click("btnBack");
	Console.WriteLine(result);
	
	Console.WriteLine(CheckScreen("Order\\Order.xml"));	
	
	RunStopWatch("btnForward", "Receivables.xml");
	
	RunStopWatch("btnForward", "Visit\\Total.xml");
		
	RunStopWatch("btnForward", "Visit\\Visits.xml");
	
	RunStopWatch("btnMenu", "Main.xml");
	

	/*VISIT-----------------------------------------------------------------------------------------------------------------------------------*/

	Console.WriteLine("-----Модуль Визит (внеплановые)------");

	RunStopWatch("swipe_layout.Controls[0].Controls[1]", "Visit\\Visits.xml");
	
	var result = Device.Click("btnMenu");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("Main.xml"));

	var result = Device.Click("swipe_layout.Controls[0].Controls[1]");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("Visit\\Visits.xml"));
	
	RunStopWatch("unPlanned", "Visit\\Visits.xml");

	RunStopWatch("grScrollView.Controls[0]", "Outlets\\Outlet.xml");
	
	var result = Device.Click("btnBack");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("Visit\\Visits.xml"));
	
	RunStopWatch("grScrollView.Controls[6]", "Outlets\\Outlet.xml");
	
	RunStopWatch("btnForward", "Visit\\Tasks.xml");
		
	RunStopWatch("grScrollView.Controls[2].Controls[1]", "Visit\\Task.xml");
	
	var result = Device.Click("btnBack"); //По нажатию "Назад" не должен переходить на предыдущий экран
	Console.WriteLine(result);
	
	Console.WriteLine(CheckScreen("Visit\\Task.xml"));
	
	var result = Device.Click("btnDone");
	Console.WriteLine(result);
	
	Console.WriteLine(CheckScreen("Visit\\Tasks.xml"));
	
	RunStopWatch("btnForward", "Visit\\Questions.xml");

	var result = Device.Click("btnBack");
	Console.WriteLine(result);
	
	Console.WriteLine(CheckScreen("Visit\\Tasks.xml"));
	
	RunStopWatch("btnForward", "Visit\\Questions.xml");
	
	RunStopWatch("btnForward", "Visit\\SKUs.xml");
	
	RunStopWatch("grScrollView.Controls[2]", "Visit\\SKU.xml");
	
	var result = Device.Click("btnBack"); //По нажатию "Назад" не должен переходить на предыдущий экран
	Console.WriteLine(result);
	
	Console.WriteLine(CheckScreen("Visit\\SKU.xml"));
	
	var result = Device.Click("btnDone");
	Console.WriteLine(result);
	
	Console.WriteLine(CheckScreen("Visit\\SKUs.xml"));
	
	RunStopWatch("btnForward", "Order\\Order.xml");
	
	var result = Device.Click("btnBack");
	Console.WriteLine(result);
	
	Console.WriteLine(CheckScreen("Visit\\SKUs.xml"));	
	
	RunStopWatch("btnForward", "Order\\Order.xml");
	
	RunStopWatch("grScrollView.Controls[2]", "Order_Info.xml");
		
	var result = Device.Click("btnBack"); //По нажатию "Назад" не должен переходить на предыдущий экран
	Console.WriteLine(result);
	
	Console.WriteLine(CheckScreen("Order_Info.xml"));
	
	var result = Device.Click("btnDone");
	Console.WriteLine(result);
	
	Console.WriteLine(CheckScreen("Order\\Order.xml"));
	
	var result = Device.Click("btnBack");
	Console.WriteLine(result);
	
	Console.WriteLine(CheckScreen("Visit\\SKUs.xml"));	
	
	RunStopWatch("btnForward", "Order\\Order.xml");
	
	RunStopWatch("btnAdd", "Order\\Order_SKUs.xml");
		
	var result = Device.Click("btnBack"); //По нажатию "Назад" не должен переходить на предыдущий экран
	Console.WriteLine(result);
	
	Console.WriteLine(CheckScreen("Order\\Order_SKUs.xml"));
	
	RunStopWatch("grScrollView.Controls[2]", "Order_EditSKU.xml");
	
	var result = Device.Click("btnBack"); //По нажатию "Назад" не должен переходить на предыдущий экран
	Console.WriteLine(result);
	
	Console.WriteLine(CheckScreen("Order_EditSKU.xml"));
	
	var result = Device.Click("btnCancel");
	Console.WriteLine(result);
	
	Console.WriteLine(CheckScreen("Order\\Order_SKUs.xml"));	
	
	RunStopWatch("grScrollView.Controls[2]", "Order_EditSKU.xml");
	
	var result = EditTextCheck("grScrollView.Controls[4].Controls[1]", "54"); // Quantity
	Console.WriteLine(result + "Quantity");
	
	var result = Device.Click("btnAdd");
	Console.WriteLine(result);
	
	Console.WriteLine(CheckScreen("Order\\Order_SKUs.xml"));	
	
	var result = Device.Click("btnDone");
	Console.WriteLine(result);
	
	Console.WriteLine(CheckScreen("Order\\Order.xml"));
	
	var result = Device.Click("btnBack");
	Console.WriteLine(result);
	
	Console.WriteLine(CheckScreen("Visit\\SKUs.xml"));	
	
	RunStopWatch("btnForward", "Order\\Order.xml");
	
	RunStopWatch("btnForward", "Receivables.xml");
	
	var result = Device.Click("btnBack");
	Console.WriteLine(result);
	
	Console.WriteLine(CheckScreen("Order\\Order.xml"));	
	
	RunStopWatch("btnForward", "Receivables.xml");
	
	RunStopWatch("btnForward", "Visit\\Total.xml");
	
	ClickAndCheck("valueList", "grScrollView.Controls[4]", "0", "Reason for visit");
	
	RunStopWatch("btnForward", "Visit\\Visits.xml");
	
	RunStopWatch("btnMenu", "Main.xml");

	/*ORDER-----------------------------------------------------------------------------------------------------------*/

	Console.WriteLine("-----Модуль Заказ------");

	RunStopWatch("swipe_layout.Controls[0].Controls[5]", "Order\\OrderList.xml");
	
	var result = Device.Click("btnMenu");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("Main.xml"));

	var result = Device.Click("swipe_layout.Controls[0].Controls[5]");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("Order\\OrderList.xml"));
	
	RunStopWatch("btnAdd", "Outlets\\Outlets.xml");
	
	var result = Device.Click("btnBack");
	Console.WriteLine(result);
	
	Console.WriteLine(CheckScreen("Order\\OrderList.xml"));	
	
	RunStopWatch("btnAdd", "Outlets\\Outlets.xml");
	
	RunStopWatch("grScrollView.Controls[2]", "Order.xml");
	
	var result = Device.Click("btnBack");
	Console.WriteLine(result);
	
	Console.WriteLine(CheckScreen("Outlets\\Outlets.xml"));	https://bitmobile.atlassian.net/browse/SUPA-188
	
	RunStopWatch("grScrollView.Controls[2]", "Order\\Order.xml");
	
	RunStopWatch("grScrollView.Controls[2]", "Order_Info.xml");
	
	var result = Device.Click("btnBack"); //По нажатию "Назад" не должен переходить на предыдущий экран
	Console.WriteLine(result);
	
	Console.WriteLine(CheckScreen("Order_Info.xml"));
		
	var result = Device.Click("btnDone");
	Console.WriteLine(result);
	
	Console.WriteLine(CheckScreen("Order.xml"));
	
	var result = Device.Click("btnBack");
	Console.WriteLine(result);
	
	Console.WriteLine(CheckScreen("Outlets\\Outlets.xml"));	
	
	RunStopWatch("grScrollView.Controls[2]", "Order.xml");
	
	RunStopWatch("btnAdd", "Order_SKUs.xml");
		
	var result = Device.Click("btnBack"); //По нажатию "Назад" не должен переходить на предыдущий экран
	Console.WriteLine(result);
	
	Console.WriteLine(CheckScreen("Order_SKUs.xml"));
	
	RunStopWatch("grScrollView.Controls[2]", "Order_EditSKU.xml");
	
	var result = Device.Click("btnBack"); //По нажатию "Назад" не должен переходить на предыдущий экран
	Console.WriteLine(result);
	
	Console.WriteLine(CheckScreen("Order_EditSKU.xml"));
	
	var result = Device.Click("btnCancel");
	Console.WriteLine(result);
	
	Console.WriteLine(CheckScreen("Order_SKUs.xml"));	
	
	RunStopWatch("grScrollView.Controls[2]", "Order_EditSKU.xml");
	
	var result = EditTextCheck("grScrollView.Controls[4].Controls[1]", "54"); // Quantity
	Console.WriteLine(result + "Quantity");
	
	var result = Device.Click("btnAdd");
	Console.WriteLine(result);
	
	Console.WriteLine(CheckScreen("Order_SKUs.xml"));	
	
	var result = Device.Click("btnDone");
	Console.WriteLine(result);
	
	Console.WriteLine(CheckScreen("Order.xml"));
	
	var result = Device.Click("btnBack");
	Console.WriteLine(result);
	
	Console.WriteLine(CheckScreen("Outlets\\Outlets.xml"));	
	
	RunStopWatch("btnForward", "Order.xml");
	
	RunStopWatch("grScrollView.Controls[6]", "Order_EditSKU.xml");
	
	var result = Device.Click("btnAdd");
	Console.WriteLine(result);
	
	Console.WriteLine(CheckScreen("Order_SKUs.xml"));
	
	var result = Device.Click("btnDone");
	Console.WriteLine(result);
	
	Console.WriteLine(CheckScreen("Order.xml"));
	
	var result = Device.Click("btnForward");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("Order\\OrderList.xml"));

	var result = Device.Click("btnForward");
	Console.WriteLine(result);
	
	Console.WriteLine(CheckScreen("Order\\OrderList.xml"));	
	
	RunStopWatch("btnMenu", "Main.xml");

	
	/*	-------------Outlets	--------------------------------------------------*/
	Console.WriteLine("-----Модуль Клиенты------");

	RunStopWatch("swipe_layout.Controls[0].Controls[3]", "Outlets\\Outlets.xml");
	
	var result = Device.Click("btnMenu");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("Main.xml"));
	
	RunStopWatch("swipe_layout.Controls[0].Controls[3]", "Outlets\\Outlets.xml");

	var result = Device.Click("btnAdd");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("Outlets\\CreateOutlet.xml"));
	
	var result = Device.Click("btnCancel");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("Outlets\\Outlets.xml"));
	
	var result = Device.Click("btnAdd");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("Outlets\\CreateOutlet.xml"));
			
	Console.WriteLine(CheckScreen("Outlets\\Outlet.xml"));
	
	var result = Device.Click("grScrollView.Controls[2]");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("Outlet.xml"));

	var result = Device.Click("btnBack");
	Console.WriteLine(result);
	
	Console.WriteLine(CheckScreen("Outlets\\Outlets.xml"));
	
	RunStopWatch("btnMenu", "Main.xml");
	

	Console.WriteLine(CheckScreen("Main.xml"));

	/*-------------------------------------Sync-------------------------------------*/

	Console.WriteLine("-----Модуль Sync------");
	
	var result = Device.Click("swipe_layout.Controls[0].Controls[9]");
	Console.WriteLine(result);
	
	var result = Device.Click("btnBack");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("Main.xml"));
	
	}