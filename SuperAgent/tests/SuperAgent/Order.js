/*  Получить номера  заказов из 1С

Запуск бат 
var wsh = new ActiveXObject("WScript.Shell");
wsh.Run(new ActiveXObject("Scripting.FileSystemObject").GetAbsolutePathName("")+"/Schedule.bat");
 */
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

function CheckScreen(screen) {

	var result = Device.GetValue("context.CurrentScreen.Name");
	Console.Terminate(result != screen, "Экран " + screen + " не открывается!");

	return result;
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

function getRandomArbitary(min, max) {
	return Math.round(Math.random() * (max - min) + min);
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

function TaskExecute(path) {

	var pathToTask = path + ".Controls[0].Controls[1].Text";
	var ExecutedTask = Device.GetValue(pathToTask);
	Console.WriteLine(ExecutedTask);

	var result = Device.Click(path); // Task execute with screen Task.xml opening
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("Visit\\Task.xml"));

	var result = Device.Click("grScrollView.Controls[9].Controls[0]"); // Make task executed
	Console.WriteLine(result + " Task");

	var result = Device.Click("btnDone");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("Visit\\Tasks.xml"));

	var result = CheckTextViewValue("grScrollView.Controls[4].Controls[0].Controls[0].Controls[1].Text", ExecutedTask); // Checking that task is executed

	Console.WriteLine(result);

	var result = Device.Click("grScrollView.Controls[4]"); // Task unexecute with screen Task.xml opening
	Console.WriteLine(result);

	var result = Device.Click("grScrollView.Controls[9].Controls[0]"); // Make task unexecuted
	Console.WriteLine(result + "Task");

	var result = Device.Click("btnDone");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("Visit\\Tasks.xml"));

	var result = CheckTextViewValue("grScrollView.Controls[2].Controls[1].Controls[0].Controls[1].Text", ExecutedTask); // Checking that task is unexecuted

	Console.WriteLine(result);
	/* Execute task using swipe */
}

function ClickAndSetDateTime(path, dateTime, CheckSetDateTime, description) {

	Console.WriteLine(path + "--" + dateTime + "--" + CheckSetDateTime + "--" + description);
	var result = Device.Click(path);
	Console.WriteLine(result + description);

	Dialog.SetDateTime(dateTime);

	var appDateTime = Dialog.GetDateTime();
	appDateTime = String(appDateTime);
	appDateTime = appDateTime.slice(0, -3);
	Console.WriteLine(CheckSetDateTime + " --" + appDateTime);

	var result = (CheckSetDateTime == appDateTime) ? "True" : "False";
	Console.WriteLine(result);
	Console.WriteLine(Dialog.ClickPositive());

	var PathWithText = path + ".Controls[1].Text";
	var result = Device.GetValue(PathWithText);
	var appDateTime = Device.GetValue(PathWithText);
	appDateTime = String(appDateTime);
	appDateTime = appDateTime.slice(0, -3);
	Console.WriteLine(appDateTime);
	var result = (CheckSetDateTime == appDateTime) ? "True" : "False";
	Console.WriteLine(result + "Проверка даты в Textview после внесения изменений");
}

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

	if (result1 == result2 && result1 == result3 && result1 == result4 && result1 == "True") {
		result = "True";
	} else {
		result = result1 + "; " + result2 + "; " + result3 + "; " + result4;
	}
	return result;
}

function TextIsUnEditable(path) {

	Device.SetText(path, "Text");

	textp = path + "Controls[2].Text";

	var result = Device.GetValue(textp);

	if (result == "Text") {
		result = "True";
	} else {
		result = "False";
	}

	return result;

}

function ValueListFieldIsUnEditable(path) {

	Device.Click(path);

	var result = Dialog.SelectItem(0);
	
	//Console.WriteLine(result);
	result = (result == "Error: Operation is not valid due to the current state of the object") ? "True" : "False";

	return result;
}


function CheckDoubleGrid(num, count) {
	//Сделать так, чтобы можно было просто передавать массив индексов
	var PathWithText = "grScrollView.Controls[" + num + "].Controls[0].Controls[0].Text";

	var description = Device.GetValue(PathWithText);
	//Console.WriteLine(description);
	var DoubleResult = "True";
	var k = 0;
	var i = 2;
	// Console.WriteLine(count);
	while (i <= count & k == 1 || k == 0) {

		var DoublePath = "grScrollView.Controls[" + i + "].Controls[0].Controls[0].Text";
		var DoubleDesc = Device.GetValue(DoublePath);
		//Console.WriteLine(DoubleDesc);
		if (DoubleDesc == description) {
			k++;
		}
		//  Console.WriteLine(k +" "+i);
		i = i + 2;
	}

	if (k > 1) {
		DoubleResult = "False";
	} else {
		DoubleResult = "True";
	}

	return DoubleResult;
}


function main() {

	/*var result = Device.Click("btnOrder");
	Console.WriteLine(result);

	var result = CheckScreen("OrderList.xml");
	Console.WriteLine(result);
	
	var result = Device.Click("NewOrder");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("Outlets.xml"));

	Console.WriteLine(Search("edtSearch", "new"));

	var outlet = Device
			.GetValue("grScrollView.Controls[0].Controls[0].Controls[0].Text");
	Console.WriteLine("Заказ для " + outlet);

	

	var result = Device.Click("grScrollView.Controls[0]");
	Console.WriteLine(result);
		

	Console.WriteLine(CheckScreen("Order.xml"));

	var result = Device.Click("grScrollView.Controls[0]"); // Price-list
	Console.WriteLine(result + "Price-list");

	

	Console.WriteLine(CheckScreen("ListChoice.xml"));

	var priceList = Device
			.GetValue("grScrollView.Controls[2].Controls[0].Controls[0].Text");

	var result = Device.Click("grScrollView.Controls[2]"); // Choose Price-list
	Console.WriteLine(result + "Choose Price-list");

	Console.WriteLine(CheckScreen("Order.xml"));

	Console.WriteLine(CheckValue("Orderadd.Controls[0].Controls[0].Text",
			"0,00"));

	

	var i = 0;
	var ord = 0;

	while (ord < 60) {

		Console.WriteLine("Ord=" + ord);
		i++;

		var n = 1 + i;

		if (n % 2 > 0) {
			n = n + 1;
		} else {

			var result = Device.Click("Orderadd");
			Console.WriteLine(result);

			var result = CheckScreen("Order_SKUs.xml");
			Console.WriteLine(result);
			
			var exp = "grScrollView.Controls[" + n + "]";

			Console.WriteLine(exp);

			Console.Pause(1000);

			var result = Device.Click(exp); // Add SKU to Order
			Console.WriteLine(result);

			Console.Pause(1000);

			var result = Device.GetValue("context.CurrentScreen.Name");
				

					var price = Device
							.GetValue("grScrollView.Controls[2].Controls[0].Controls[0].Text");
					if (price != "0,00" || price != "") {
						result = "True";
					} else {
						result = "False";
					}

					var quantity = "5";
					TextCheck(
							"grScrollView.Controls[4].Controls[0].Controls[0]",
							quantity);
					if (result != "True; True; True") {
						Console.WriteLine(result + "Количество не вводится");
					} else {
						result = "True";
						Console.WriteLine(result);
					}

					Device
							.Click("grScrollView.Controls[2].Controls[2].Controls[0]");

					var markup = "30";
					TextCheck(
							"grScrollView.Controls[2].Controls[1].Controls[0]",
							markup);
					if (result != "True; True; True") {
						Console.WriteLine(result + "Наценка не вводится");
					} else {
						result = "True";
						Console.WriteLine(result);
					}

					var result = Device
							.Click("grScrollView.Controls[0].Controls[0]");
					Console.WriteLine(result);

					price = price * ((markup / 100) + 1);
					Console.WriteLine(price);

					Console
							.WriteLine(CheckValue(
									"grScrollView.Controls[2].Controls[0].Controls[0].Text",
									price)
									+ "  Check Price");

					var amount = price * quantity;

					Console.WriteLine(amount);

					var result = Device.Click("btnForward");
					Console.WriteLine(result);

					Console.WriteLine(CheckScreen("Order.xml"));
					ord++;

			

				
				}
			}

	var result = Device.Click("btnForward");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("Order_Commentary.xml"));

	Console.WriteLine(TextCheck(
			"grScrollView.Controls[0].Controls[0].Controls[2]",
			"Комментарий к большому заказу  "));

	var result = Device.Click("btnForward");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("Main.xml"));

}