/*CalendarOfTasks*/

function CheckScreen(screen) {

	var result = Device.GetValue("context.CurrentScreen.Name");
	Console.Terminate(result != screen, " Экран" + screen + "не открывается!");

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

function CurrMonthYear(butt) {

	var curr = new Date();
	var monthsarray = [ "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
			"Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь" ];
	var month = curr.getMonth();
	var year = curr.getFullYear();
	switch (butt) {
	case "0":
		month = monthsarray[month];
	case "1":
		if (month == "0") {
			month = "11";
			year = year - 1;
			month = monthsarray[month];
		} else {
			month = month - 1;
			month = monthsarray[month];
		}
	case "2":
		if (month == "11") {
			month = "0";
			year = year - 1;
			month = monthsarray[month];
		} else {
			month = month + 1;
			month = monthsarray[month];
		}
	}
	var result = month + " " + year;
	return result;
}

function main() {

	Console.WriteLine("-----Календарь задач------");

	RunStopWatch("btnCalendar", "TaskCalendar.xml");

	var CurrMonth = Device.GetValue("grid.Controls[1].Controls[1].Text");// GetMonth
	var butt = "0";
	Console.WriteLine(CurrMonth);
	var Month = CurrMonthYear(butt);

	var result = (Month == CurrMonth) ? "True" : "False";
	Console.WriteLine(result);

	var result = Device.Click("grid.Controls[1].Controls[0]"); //Left 
	Console.WriteLine(result);

	var GetMonthPrev = Device.GetValue("grid.Controls[1].Controls[1].Text");// GetMonth Previous
	var butt = "1";
	Console.WriteLine(result);

	var Month = CurrMonthYear(butt);
	Console.WriteLine(Month);
	var result = (Month == GetMonthPrev) ? "True" : "False";
	Console.WriteLine(result);

	var result = Device.Click("grid.Controls[1].Controls[2]"); //Right
	Console.WriteLine(result);

	var result = Device.Click("grid.Controls[1].Controls[2]"); //Right
	Console.WriteLine(result);

	var NextMonth = Device.GetValue("grid.Controls[1].Controls[1].Text");// GetMonth Next
	var butt = "2";
	Console.WriteLine(NextMonth);

	Console.WriteLine("1");
	var Month = CurrMonthYear(butt);

	var result = (Month == NextMonth) ? "True" : "False";
	Console.WriteLine(result);

	var result = Device.Click("grid.Controls[1].Controls[0]"); //Left 
	Console.WriteLine(result);

	/*Выбор дат  для отображения визитов*/

	var result = Device.Click("grid.Controls[2].Controls[1].Controls[4]"); //StartDate
	Console.WriteLine(result);

	var result = Device.Click("grid.Controls[2].Controls[5].Controls[1]"); //EndDate
	Console.WriteLine(result);

	var result = Device.Click("grid.Controls[3].Controls[2]"); //Применяем фильтр
	Console.WriteLine(result + " Apply filter");

	var summ = Device.GetValue("grid.Controls[4].Controls[0].Text"); //Show summ
	Console.WriteLine(summ);

	var result = Device.Click("grid.Controls[3].Controls[3]"); //Hide Calendar
	Console.WriteLine(result + " Hide Calendar");

	Device.TakeScreenshot("Minimized_Calendar");

	var GetSumm = Device.GetValue("grid.Controls[2].Controls[0].Text"); // Проверяем сворачивается ли календарь, пытаясь  получить значение суммы 
	Console.WriteLine(GetSumm);
	var result = (GetSumm == summ) ? "True" : "False";
	Console.WriteLine(result);

	var result = Device.Click("grid.Controls[1].Controls[3]"); //Show Calendar
	Console.WriteLine(result + " Show Calendar");

	Device.TakeScreenshot("Expanded_Calendar");

	var GetSumm = Device.GetValue("grid.Controls[4].Controls[0].Text"); // Проверяем разворачивается ли календарь, пытаясь  получить значение суммы 
	Console.WriteLine(GetSumm);
	var result = (GetSumm == summ) ? "True" : "False";
	Console.WriteLine(result);

	var result = Device.Click("grScrollView.Controls[0]");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("TaskInformation.xml"));

	var result = Device.Click("btnBack");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("TaskCalendar.xml"));

	var result = Device.GetValue("grid.Controls[3].Controls[0]");

	var result = Device.Click("grScrollView.Controls[0]");
	Console.WriteLine(result);

	var result = Device.Click("btnStart");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("TaskCalendar.xml"));

	var result = Device.Click("grScrollView.Controls[0]");
	Console.WriteLine(result);

	var result = Device.Click("grid.Controls[0]");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("EditCustomer.xml"));

	var result = Device.Click("btnForward");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("CustomerProducts.xml"));

	var result = Device.Click("btnBack");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("EditCustomer.xml"));

	var result = Device.Click("btnBack");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("TaskInformation.xml"));

	var result = Device.Click("grid.Controls[2]");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("EditOutletAddress.xml"));

	var result = Device.Click("grScrollView.Controls[2]"); // метро
	Console.WriteLine(result);

	var result = Device.Click("grScrollView.Controls[0]");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("EditOutletAddress.xml"));

	var result = Device.Click("grScrollView.Controls[2]");
	Console.WriteLine(result);

	var result = Device.Click("btnBack");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("TaskInformation.xml"));

	var result = Device.Click("grScrollView.Controls[5]");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("EditContact.xml"));

	var result = Device.Click("grScrollView.Controls[7]"); // Должность****
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("ListChoiceWithSearch.xml"));

	var result = Device.Click("btnBack");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("EditContact.xml"));

	var result = Device.Click("grScrollView.Controls[7]"); // Должность****
	Console.WriteLine(result);

	var result = Device.Click("grScrollView.Controls[6]");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("EditContact.xml"));

	var result = Device.Click("btnDelete");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("TaskInformation.xml"));

	var result = Device.Click("btnForward");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("TaskDetails.xml"));

	var result = Device.Click("btnBack");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("TaskInformation.xml"));

	var result = Device.Click("btnForward");
	Console.WriteLine(result);

	var result = Device.Click("grid.Controls[0]"); // Manager
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("ManagerContacts.xml"));

	var result = Device.Click("btnBack");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("TaskDetails.xml"));

	var result = Device.Click("grScrollView.Controls[0]");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("EditWork.xml"));

	var result = Device.Click("grScrollView.Controls[8]");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("ListChoiceWithSearch.xml"));

	var result = Device.Click("btnBack");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("EditWork.xml"));

	var result = Device.Click("grScrollView.Controls[8]"); //Product
	Console.WriteLine(result);

	var result = Device.Click("grScrollView.Controls[4]");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("EditWork.xml"));

	var result = Device.Click("btnDelete");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("TaskDetails.xml"));

	var result = Device.Click("btnForward");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("TaskResult.xml"));

	var result = Device.Click("grid.Controls[7]");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("ListChoice.xml"));

	var result = Device.Click("btnBack");
	Console.WriteLine(result);

	var result = Device.Click("grid.Controls[7]");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("ListChoice.xml"));

	var result = Device.Click("grScrollView.Controls[4]");

	Console.WriteLine(CheckScreen("TaskResult.xml"));

	var result = Device.Click("btnCalendar");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("TaskCalendar.xml"));

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