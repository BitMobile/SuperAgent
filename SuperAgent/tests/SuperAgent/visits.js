/* Создать плановый визит с задачей, вопросами , вопросами по SKU, прайс-листами и инкассацией.
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

	var SelectedItem = Dialog.SelectItem(0);
	
	//Console.WriteLine(result);
	var result = (SelectedItem == "Error: Operation is not valid due to the current state of the object") ? "True" : "False";

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
		var i = i + 2;
	}

	if (k > 1) {
		DoubleResult = "False";
	} else {
		DoubleResult = "True";
	}

	return DoubleResult;
}


function main() {

	var n = getRandomArbitary(1, 865);
	Console.WriteLine(n);

	var result = Device.Click("swipe_layout.Controls[0].Controls[1]");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("Visit\\Visits.xml")); // Console.WriteLine(Search("edtSearch", "Болеро"));

	Console.WriteLine(Device.GetValue("grScrollView.Controls[8].Controls[1].Controls[0].Text"));

	var result = Device.Click("grScrollView.Controls[8]");// Choose outlet Console.WriteLine(result);

	Console.WriteLine(CheckScreen("Outlet.xml"));

	var outlet = Device.GetValue("workflow[outlet].Description");
	Console.WriteLine(outlet);

	//var outlet = "ООО Болеро";

	Console.WriteLine(CheckTextViewValue("grScrollView.Controls[2].Controls[0].Controls[1].Text", outlet));

	Console.WriteLine(EditTextCheck("grScrollView.Controls[4].Controls[0].Controls[1]", "Новый адрес" + n)); // Вставить установку координат

	Console.WriteLine(ValueListFieldIsUnEditable("grScrollView.Controls[10]")); //Check that main outlet parameters (class, type) are not editable

	Console.WriteLine(ValueListFieldIsUnEditable("grScrollView.Controls[12]"));

	ClickAndCheck("valueList", "grScrollView.Controls[14]", "2", "Выбор дистрибьютора");

	var result = EditTextCheck("grScrollView.Controls[18].Controls[1]", n); //Integer

	Console.WriteLine(result + " Наличие акционных моделей");

	Console.WriteLine(EditTextCheck("grScrollView.Controls[24].Controls[1]", n) + " Правильная выкладка "); //string

	Console.WriteLine(EditTextCheck("grScrollView.Controls[44].Controls[1]", n) + " Размер дебиторской задолженности "); //decimal

	Console.WriteLine(EditTextCheck("grScrollView.Controls[24].Controls[1]", "1," + n) + " Правильная выкладка "); //string

	//ClickAndCheck("bool", "grScrollView.Controls[20]", "Да", "Оформление витрины samsung");

	//ClickAndSetDateTime("grScrollView.Controls[28]", "14.04.2014 8:45", "14.05.2014 8:45", "Время посещения");

	/* Add check that placeholders are saving after editing field
	 */

	var result = Device.Click("btnForward");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("Visit\\Tasks.xml"));

	Console.WriteLine(TaskExecute("grScrollView.Controls[2].Controls[1]"));

	var result = Device.Click("btnForward"); // Переход к экрану Общих вопросов Console.WriteLine(result + "Переход к экрану Общих вопросов");

	Console.WriteLine(CheckScreen("Visit\\Questions.xml"));

	ClickAndSetDateTime("grScrollView.Controls[2].Controls[0]", "14.04.2014 8:45", "14.05.2014 8:45", "Дата и время");

	Console.WriteLine(EditTextCheck("grScrollView.Controls[4].Controls[0].Controls[1]", "1," + n) + " Десятичная дробь "); // decimal

	Console.WriteLine(EditTextCheck("grScrollView.Controls[6].Controls[0].Controls[1]", n) + " Доля полки "); // Int

	//ClickAndCheck("bool", "grScrollView.Controls[12].Controls[0]", "Да", "POSM Фокусного SKU месяца размещены");

	//ClickAndCheck("valueList", "grScrollView.Controls[14].Controls[0]", "2", "Ценник у товара присутствует");

	Console.WriteLine(CheckDoubleGrid("2", "30"));

	Console.WriteLine(CheckDoubleGrid("6", "30"));

	Console.WriteLine(CheckDoubleGrid("8", "30"));

	Console.WriteLine(CheckDoubleGrid("14", "30"));

	var result = Device.Click("btnForward");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("Visit\\SKUs.xml"));

	var SKUDescription = Console.WriteLine(Device.GetValue("grScrollView.Controls[2].Controls[0].Controls[1].Text"));

	Console.WriteLine(CheckTextViewValue("grScrollView.Controls[2].Controls[0].Controls[1].Text", "Barenhof конфитюр ананас 350 г Россия (1/10),"));

	var AnswerCount = Device.GetValue("grScrollView.Controls[2].Controls[0].Controls[0].Text"); //Remember questions count
	Console.WriteLine(AnswerCount);

	Console.WriteLine(CheckTextViewValue("grScrollView.Controls[2].Controls[0].Controls[0].Text", "0 из 7"));

	var result = Device.Click("grScrollView.Controls[2]"); // Open and answer to the question
	Console.WriteLine(result);

	ClickAndCheck("bool", "grScrollView.Controls[0].Controls[0]", "Да", "Доступность");

	Console.WriteLine(EditTextCheck("grScrollView.Controls[2].Controls[0].Controls[1]", n) + " Фейсинг");

	Console.WriteLine(EditTextCheck("grScrollView.Controls[8].Controls[0].Controls[1]", n) + " Наценка");

	Console.WriteLine(Device.Click("btnDone"));

	Console.WriteLine(CheckTextViewValue("grScrollView.Controls[2].Controls[0].Controls[0].Text", "3 из 7")); // Check question count

	var result = Device.Click("grScrollView.Controls[2]"); // Open question and delete answers
	Console.WriteLine(result);

	ClickAndCheck("bool", "grScrollView.Controls[0].Controls[0]", "NoAnswer", "Доступность");

	Console.WriteLine(EditTextCheck("grScrollView.Controls[2].Controls[0].Controls[1]", " ") + " Фейсинг");

	Console.WriteLine(Device.Click("btnDone"));

	Console.WriteLine(CheckTextViewValue("grScrollView.Controls[2].Controls[0].Controls[0].Text", "0 из 7"));

	Console.WriteLine(Device.Click("btnForward"));

	Console.WriteLine(CheckScreen("Order\\Order.xml"));

	var result = Device.Click("btnAdd"); // Order
	Console.WriteLine(result);

	var result = CheckScreen("Order\\Order_SKUs.xml");
	Console.WriteLine(result);

	var result = CheckTextViewValue("grScrollView.Controls[0].Controls[0].Text", " /Алкоголь"); // Checking groups
	Console.WriteLine(result + " Checking groups");

	var result = Device.Click("grScrollView.Controls[2]"); // Add SKU to Order
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("Order_EditSKU.xml"));

	var result = EditTextCheck("grScrollView.Controls[4].Controls[1]", "54"); // Quantity
	Console.WriteLine(result + "Quantity");

	var result = Device.Click("btnAdd");
	Console.WriteLine(result);
	
	var result = Device.Click("btnDone");
	Console.WriteLine(result);

	var result = Device.Click("btnForward");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("Receivables.xml")); // Инкассация

	Console.WriteLine(CheckTextViewValue("grScrollView.Controls[0].Controls[0].Text", "СУММА ЗАДОЛЖЕННОСТИ: 476"));

	Console.WriteLine(CheckTextViewValue("grScrollView.Controls[9].Controls[0].Controls[1].Controls[1].Text", "Долг: 434"));

	Console.WriteLine(CheckTextViewValue("grScrollView.Controls[11].Controls[0].Controls[1].Controls[1].Text", "Долг: 42"));

	Console.WriteLine(EditTextCheck("grScrollView.Controls[3].Controls[0].Controls[1]", "465")); // Enter enc value

	var result = Device.Click("grScrollView.Controls[5]");
	Console.WriteLine(result);

	Console.WriteLine(CheckTextViewValue("grScrollView.Controls[9].Controls[0].Controls[1].Controls[1].Text", "Долг: 434"));

	Console.WriteLine(CheckTextViewValue("grScrollView.Controls[11].Controls[0].Controls[1].Controls[1].Text", "Долг: 31"));

	var result = Device.Click("btnForward");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("Visit\\Total.xml"));

	//Check the date- has to be tomorrow

	Console.WriteLine(ClickAndSetDateTime(grScrollView.Controls[2], "14.07.2014 8:45", "14.06.2014 8:45", "Дата доставки")); // Change delivery date
	
	Console.WriteLine(EditTextCheck("grScrollView.Controls[4].Controls[0].Controls[1]", "Comment"));

	Console.WriteLine(CheckTextViewValue("grScrollView.Controls[7].Controls[1].Text", "6 из 61"));

	Console.WriteLine(CheckTextViewValue("grScrollView.Controls[9].Controls[1].Text", "0 из 1"));

	Console.WriteLine(CheckTextViewValue("grScrollView.Controls[11].Controls[1].Text", "6 из 61"));

	Console.WriteLine(CheckTextViewValue("grScrollView.Controls[13].Controls[1].Text", "6 из 61"));
	//	
	//	var CheckMessage = Dialog.GetMessage();
	//
	//	var result = (CheckMessage == "Причина визита должна быть заполнена") ? "True" : "False";
	//	Console.WriteLine(result);
	//
	//	Dialog.ClickPositive();
	//
	//	ClickAndCheck("valueList", "grScrollView.Controls[8]", "grScrollView.Controls[0]", "ListChoice.xml", "Выбор причины визита");
	//
	var result = Device.Click("btnForward");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("Main.xml"));

}