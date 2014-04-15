/*Создать визит для Автотехобслуживание на сегодня, удаленная работа, исполнитель Сыч, Основной контакт:Селянкин Кирилл, менеджер Резникова */

function CheckScreen(screen) {

	var result = Device.GetValue("context.CurrentScreen.Name");
	Console.Terminate(result != screen, " Экран" + screen + "не открывается!");

	return result;
}

function Search(path, text) {
	var result1 = Device.SetFocus(path);

	var result2 = Device.SetText(path, text);

	textp = path + ".Text";
	var result3 = Device.GetValue(textp);

	var result4 = Device.Click("btnSearch");

	result3 = (result3 == text) ? "True" : "False";

	if (result1 == result2 && result1 == result3 && result1 == result4
			&& result1 == "True") {
		result = "True";
	} else {
		result = result1 + "; " + result2 + "; " + result3 + "; " + result4;
	}
	return result;
}

function CheckValue(path, text) {
	var result = Device.GetValue(path);
	result = (result == text) ? "True" : "False";
	return result;
}

function TextCheck(path, text) {
	var result1 = Device.SetFocus(path);

	var result2 = Device.SetText(path, text);

	textp = path + ".Text";

	var result3 = Device.GetValue(textp);

	result3 = (result3 == text) ? "True" : "False";

	result = result1 + "; " + result2 + "; " + result3;
	return result;
}

function CurrDateTime() {

	var curr = new Date();

	var day = curr.getDate();
	day = (day < 10) ? '0' + day : day;
	var month = curr.getMonth() + 1;
	month = (month < 10) ? '0' + month : month;
	var year = curr.getFullYear();
	var hour = curr.getHours();
	hour = (hour < 10) ? '0' + hour : hour;
	var min = curr.getMinutes();
	min = (min < 10) ? '0' + min : min;

	result = day + "." + month + "." + year + " " + hour + ":" + min;

	return result;
}

function CurrDate() {

	var curr = new Date();

	var day = curr.getDate();

	var month = curr.getMonth() + 1;

	result = day + "." + month;

	return result;
}

function RunStopWatch(StartButton, StopScreen) {
	Device.Click(StartButton);
	Stopwatch.Start();
	do {
		var CurrScreen = Device.GetValue("context.CurrentScreen.Name");
	} while (CurrScreen != StopScreen);
	var result = Stopwatch.Stop();
	Console.WriteLine(result.TotalSeconds + "  " + StopScreen
			+ "  loading time");

}

function main() {

	Console.WriteLine("-----Задачи на сегодня------");

	RunStopWatch("btnTasks", "TaskList.xml");

	var date = CurrDate();

	Console.WriteLine(CheckValue(
			"grScrollView.Controls[0].Controls[0].Controls[0].Text", date)
			+ "Date");
	Console.WriteLine(CheckValue(
			"grScrollView.Controls[0].Controls[0].Controls[1].Text", "00:00")
			+ "Time");
	Console.WriteLine(CheckValue(
			"grScrollView.Controls[0].Controls[0].Controls[2].Text", "00:00"));

	Console
			.WriteLine(CheckValue(
					"grScrollView.Controls[0].Controls[2].Controls[0].Controls[0].Text",
					"№: ПП0002140")
					+ "Num");
	Console
			.WriteLine(CheckValue(
					"grScrollView.Controls[0].Controls[2].Controls[0].Controls[1].Text",
					"Удалённая работа")
					+ "Type");
	Console
			.WriteLine(CheckValue(
					"grScrollView.Controls[0].Controls[2].Controls[0].Controls[2].Text",
					"Автотехобслуживание")
					+ "Description");

	RunStopWatch("grScrollView.Controls[0]", "TaskInformation.xml");

	Console.WriteLine(CheckValue("grid.Controls[0].Controls[0].Text",
			"Клиент: Автотехобслуживание")
			+ "  Description");
	Console
			.WriteLine(CheckValue(
					"grid.Controls[2].Controls[0].Text",
					"Адрес: ул. Салова 68, находятся около ГАИ, к нему  здание торцом стоит, через проходную на 3 этаж, 301 комната")
					+ "  Address");
	Console.WriteLine(Device.GetValue("grid.Controls[4].Text"));
	Console.WriteLine(CheckValue("grid.Controls[4].Text", "Метро: Волковская")
			+ "  Subway");
	Console.WriteLine(CheckValue(
			"grScrollView.Controls[6].Controls[0].Controls[0].Text",
			"Селянкин Кирилл")
			+ "  Optimus Prime contact");

	var result = Device.Click("btnStart");
	Console.WriteLine(result);
	var CurrDate = CurrDateTime();
	Console.WriteLine(CurrDate);

	var result = Device.Click("grScrollView.Controls[0]");
	Console.WriteLine(result);

	RunStopWatch("grid.Controls[0]", "EditCustomer.xml");

	Console.WriteLine(CheckValue("grScrollView.Controls[1].Controls[0].Text",
			"+7 (812) 406-81-93")
			+ "  Phone number");

	Console.WriteLine(CheckValue("grScrollView.Controls[3].Controls[0].Text",
			"2134")
			+ "  Fax");
	Console.WriteLine(CheckValue("grScrollView.Controls[8].Controls[0].Text",
			"192102, Санкт-Петербург г, Салова ул, дом № 68, лит. А")
			+ "  Fact address");
	Console.WriteLine(CheckValue("grScrollView.Controls[10].Controls[0].Text",
			"192102, Санкт-Петербург, ул. Салова, д. 68, лит. А")
			+ "  Юридический адрес");
	Console.WriteLine(CheckValue("grScrollView.Controls[15].Controls[0].Text",
			"123")
			+ "  login");
	Console.WriteLine(CheckValue("grScrollView.Controls[17].Controls[0].Text",
			"123456")
			+ "  pass");

	RunStopWatch("btnForward", "CustomerProducts.xml");

	Console.WriteLine(CheckValue("grScrollView.Controls[1].Controls[0].Text",
			"1С:Бухгалтерия 8 ПРОФ")
			+ "  Product  name");
	Console.WriteLine(CheckValue("grScrollView.Controls[3].Controls[0].Text",
			"800413217")
			+ "  Product  key");

	var result = Device.Click("btnBack");
	Console.WriteLine(result);

	RunStopWatch("btnBack", "TaskInformation.xml");

	var result = Device.Click("grid.Controls[2]");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("EditOutletAddress.xml"));

	Console
			.WriteLine(CheckValue(
					"grScrollView.Controls[1].Controls[0].Text",
					"ул. Салова 68, находятся около ГАИ, к нему  здание торцом стоит, через проходную на 3 этаж, 301 комната")
					+ " Outlet address");
	Console.WriteLine(CheckValue("grScrollView.Controls[3].Controls[0].Text",
			"Волковская")
			+ "  Subway");

	var result = Device.Click("grScrollView.Controls[3]"); // метро
	Console.WriteLine(result);

	var sub = Device
			.GetValue("grScrollView.Controls[0].Controls[0].Controls[0].Text");

	var result = Device.Click("grScrollView.Controls[0]");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("EditOutletAddress.xml"));

	Console.WriteLine(CheckValue("grScrollView.Controls[3].Controls[0].Text",
			sub));

	var result = Device.Click("btnBack");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("TaskInformation.xml"));

	Console.WriteLine(Device
			.GetValue("grScrollView.Controls[7].Controls[0].Controls[0].Text"));

	RunStopWatch("grScrollView.Controls[5]", "EditContact.xml");

	Console.WriteLine(TextCheck("grScrollView.Controls[1].Controls[0]",
			"Федоров")
			+ "  Surname");
	Console
			.WriteLine(TextCheck("grScrollView.Controls[3].Controls[0]",
					"Федор")
					+ "  Name");
	Console.WriteLine(TextCheck("grScrollView.Controls[5].Controls[0]",
			"Федорович"));

	var result = Device.Click("grScrollView.Controls[7]"); // Должность****
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("ListChoiceWithSearch.xml"));

	var result = Device.Click("grScrollView.Controls[6]");// выбор должности
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("EditContact.xml"));

	Console.WriteLine(CheckValue("grScrollView.Controls[7].Controls[0].Text",
			"Администратор"));

	Console.WriteLine(TextCheck(
			"grScrollView.Controls[9].Controls[0].Controls[0]", "+7"));
	Console.WriteLine(TextCheck(
			"grScrollView.Controls[9].Controls[1].Controls[0]", "465"));
	Console.WriteLine(TextCheck(
			"grScrollView.Controls[9].Controls[2].Controls[0]", "456547"));
	Console.WriteLine(TextCheck(
			"grScrollView.Controls[9].Controls[3].Controls[0]", "123"));
	Console.WriteLine(Device.Click("grScrollView.Controls[10].Controls[0]"));

	Console.WriteLine(TextCheck("grScrollView.Controls[12].Controls[0]",
			"Комментарий"));

	var result = Device.Click("btnBack");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("TaskInformation.xml"));

	var result = CheckValue(
			"grScrollView.Controls[39].Controls[0].Controls[0].Text",
			"Федоров Федор Федорович");
	Console.WriteLine(result);
	var result = Device.Click("grScrollView.Controls[5]");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("EditContact.xml"));

	Console.WriteLine(TextCheck("grScrollView.Controls[1].Controls[0]",
			"Сидоров"));
	Console
			.WriteLine(TextCheck("grScrollView.Controls[3].Controls[0]", "Сидр"));
	Console.WriteLine(TextCheck("grScrollView.Controls[5].Controls[0]",
			"Сидорович"));
	var result = Device.Click("grScrollView.Controls[7]"); // Должность
	Console.WriteLine(result);
	Console.WriteLine(CheckScreen("ListChoiceWithSearch.xml"));
	var result = Device.Click("grScrollView.Controls[6]");
	Console.WriteLine(result);
	Console.WriteLine(CheckScreen("EditContact.xml"));

	Console.WriteLine(CheckValue("grScrollView.Controls[7].Controls[0].Text",
			"Администратор"));

	Console.WriteLine(TextCheck(
			"grScrollView.Controls[9].Controls[0].Controls[0]", "+7"));
	Console.WriteLine(TextCheck(
			"grScrollView.Controls[9].Controls[1].Controls[0]", "465"));
	Console.WriteLine(TextCheck(
			"grScrollView.Controls[9].Controls[2].Controls[0]", "456547"));
	Console.WriteLine(TextCheck(
			"grScrollView.Controls[9].Controls[3].Controls[0]", "123"));
	Console.WriteLine(Device.Click("grScrollView.Controls[10].Controls[0]"));

	Console.WriteLine(TextCheck("grScrollView.Controls[12].Controls[0]",
			"Комментарий"));

	var result = Device.Click("btnDelete");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("TaskInformation.xml"));

	var CheckAddedContact = CheckValue(
			"grScrollView.Controls[37].Controls[0].Controls[0].Text",
			"Сидоров Сидр Сидорович");
	var result = (CheckAddedContact == "True") ? "False" : "True";
	Console.WriteLine(result);

	var result = Device.Click("grScrollView.Controls[1]");// Add kind of work
	Console.WriteLine(result);

	var kindOfWork = Device
			.GetValue("grScrollView.Controls[0].Controls[0].Controls[0].Text");// Choosen
	// kind
	// of
	// work
	Console.WriteLine(kindOfWork);

	var result = Device.Click("grScrollView.Controls[0]");// Choose kind of
	// work
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("TaskInformation.xml"));

	var GetChoosenKindOfWork = Device
			.GetValue("grScrollView.Controls[3].Controls[0].Controls[0].Text");// Check
	// choosen
	// kind
	// of
	// work
	Console.WriteLine(GetChoosenKindOfWork);
	var result = (GetChoosenKindOfWork == kindOfWork) ? "True" : "False";
	Console.WriteLine(result);

	var result = Device.Click("btnForward");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("TaskDetails.xml"));

	var result = Device.Click("grid.Controls[0]"); // Manager
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("ManagerContacts.xml"));

	Console.WriteLine(CheckValue(
			"grScrollView.Controls[0].Controls[0].Controls[0].Text", "my"));
	Console.WriteLine(Device
			.GetValue("grScrollView.Controls[0].Controls[0].Controls[1].Text"));
	Console.WriteLine(CheckValue(
			"grScrollView.Controls[0].Controls[0].Controls[1].Text", "85566"));

	Console.WriteLine(Search("edtSearch", "Ph"));

	Console.WriteLine(CheckValue(
			"grScrollView.Controls[0].Controls[0].Controls[0].Text", "phone"));
	Console
			.WriteLine(CheckValue(
					"grScrollView.Controls[0].Controls[0].Controls[1].Text",
					"4687111"));

	var result = Device.Click("btnBack");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("TaskDetails.xml"));

	Console.WriteLine(CheckValue("grScrollView.Controls[2].Text",
			"Список работ пуст"));

	var result = Device.Click("grScrollView.Controls[0]");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("EditWork.xml"));

	Console.WriteLine(TextCheck("grScrollView.Controls[1].Controls[0]", "Все"));
	Console.WriteLine(TextCheck("grScrollView.Controls[3].Controls[0]", "4"));

	var result = Device.Click("grScrollView.Controls[8]");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("ListChoiceWithSearch.xml"));

	var product = Device.GetValue("grScrollView.Controls[4].Controls[0].Text");
	var result = Device.Click("grScrollView.Controls[4]");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("EditWork.xml"));

	var result = Device.Click("btnDelete");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("TaskDetails.xml"));

	Console.WriteLine(CheckValue("grScrollView.Controls[2].Text",
			"Список работ пуст"));

	var result = Device.Click("grScrollView.Controls[0]");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("EditWork.xml"));

	Console.WriteLine(TextCheck("grScrollView.Controls[1].Controls[0]", "Все"));
	Console.WriteLine(TextCheck("grScrollView.Controls[3].Controls[0]", "4"));

	RunStopWatch("grScrollView.Controls[8]", "ListChoiceWithSearch.xml");

	var product = Device.GetValue("grScrollView.Controls[4].Controls[0].Text");
	var result = Device.Click("grScrollView.Controls[4]");
	Console.WriteLine(result);
	Console.WriteLine(CheckScreen("EditWork.xml"));
	Console.WriteLine(Device
			.GetValue("grScrollView.Controls[8].Controls[0].Text"));

	Console.WriteLine(CheckValue("grScrollView.Controls[8].Controls[0].Text",
			"1С:SNOWBALL ИГРУШКИ \"Бесконечное путешествие\""));
	Console.WriteLine(TextCheck("grScrollView.Controls[11].Controls[0]",
			"23.4(5)67ff"));
	Console.WriteLine(TextCheck("grScrollView.Controls[13].Controls[0]",
			"4525(4f)"));

	var result = Device.Click("btnBack");
	Console.WriteLine(result);
	Console.WriteLine(CheckScreen("TaskDetails.xml"));
	Console.WriteLine(Device
			.GetValue("grScrollView.Controls[2].Controls[0].Controls[0].Text"));
	Console.WriteLine(CheckValue(
			"grScrollView.Controls[2].Controls[0].Controls[0].Text",
			" 1С:SNOWBALL ИГРУШКИ \"Бесконечное путешествие\""));

	Console.WriteLine(Device
			.GetValue("grScrollView.Controls[2].Controls[0].Controls[1].Text"));
	Console
			.WriteLine(CheckValue(
					"grScrollView.Controls[2].Controls[0].Controls[1].Text",
					"4ч - Все"));

	var result = Device.Click("grScrollView.Controls[0]");
	Console.WriteLine(result);
	Console.WriteLine(CheckScreen("EditWork.xml"));
	Console.WriteLine(TextCheck("grScrollView.Controls[1].Controls[0]", "Все"));

	Console.WriteLine(TextCheck("grScrollView.Controls[3].Controls[0]", "2"));

	var result = Device.Click("grScrollView.Controls[8]");
	Console.WriteLine(result);
	Console.WriteLine(CheckScreen("ListChoiceWithSearch.xml"));
	var product = Device.GetValue("grScrollView.Controls[6].Controls[0].Text");

	var result = Device.Click("grScrollView.Controls[4]");
	Console.WriteLine(result);
	Console.WriteLine(CheckScreen("EditWork.xml"));

	var result = Device.Click("btnDelete");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("TaskDetails.xml"));
	var result = Device
			.GetValue("grScrollView.Controls[4].Controls[0].Controls[0].Text");
	result = (result == "Error: Index has to be between upper and lower bound of the array.") ? "True"
			: "False";
	Console.WriteLine(result);

	Console
			.WriteLine(CheckValue(
					"grScrollView.Controls[4].Controls[0].Controls[0].Text",
					"Аудиокурсы. X-Polyglossum English. Английский в дороге. Курс уровня Intermediate (mp3-CD)"));
	var result = Device.Click("btnForward");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("TaskResult.xml"));

	var StartDateTime = Device.GetValue("grid.Controls[1].Controls[0].Text");

	StartDateTime = StartDateTime.slice(0, -3);
	/* StartDateTime=StartDateTime.substring(0, StartDateTime.length - 3); */
	Console.WriteLine(StartDateTime);

	var result = (StartDateTime == CurrDate) ? "True" : "False";
	Console.WriteLine(result);

	Console.WriteLine(Device.GetValue("grid.Controls[5].Controls[0].Text"));
	Console.WriteLine(CheckValue("grid.Controls[5].Controls[0].Text", "4"));

	var result = Device.Click("grid.Controls[7]");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("ListChoice.xml"));

	var result = Device.Click("grScrollView.Controls[0]");
	var EndDate = CurrDateTime();
	Console.WriteLine(EndDate);

	Console.WriteLine(CheckScreen("TaskResult.xml"));

	var EndDateTime = Device.GetValue("grid.Controls[3].Controls[0].Text");
	EndDateTime = EndDateTime.substring(0, EndDateTime.length - 3);
	Console.WriteLine(EndDateTime);

	Console.WriteLine(EndDate + "  ==  " + EndDateTime);
	var result = (EndDateTime == EndDate) ? "True" : "False";
	Console.WriteLine(result);

	var result = Device.Click("btnTasks");
	Console.WriteLine(result);

	Console.WriteLine(Device
			.GetValue("grScrollView.Controls[0].Controls[0].Controls[3].Text"));
	Console.WriteLine(CheckValue(
			"grScrollView.Controls[0].Controls[0].Controls[3].Text", "4 ч"));

	Console.WriteLine(CheckScreen("TaskList.xml"));

	var result = Device.Click("grScrollView.Controls[0]");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("TaskInformation.xml"));

	var result = Device.Click("btnForward");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("TaskDetails.xml"));

	var result = Device.Click("btnForward");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("TaskResult.xml"));

	var result = Device.Click("btnSave");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("Main.xml"));
}