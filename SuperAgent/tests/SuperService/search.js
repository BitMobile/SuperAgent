function CheckScreen(screen) {

	var result = Device.GetValue("context.CurrentScreen.Name");
	Console.Terminate(result != screen, "Экран" + screen + "не открывается!");

	return result;
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

	if (result1 == result2 && result1 == result3 && result1 == result4
			&& result1 == "True") {
		result = "True";
	} else {
		result = result1 + "; " + result2 + "; " + result3 + "; " + result4;
	}
	return result;
}

function main() {

	Console.WriteLine("-----Клиенты------");
	var result = Device.Click("btnCustomers");
	Stopwatch.Start();
	Console.WriteLine(result);

	var result = CheckScreen("CustomersList.xml");
	Console.WriteLine(result);
	
	var result = Device.Click("btnCancel");
	Console.WriteLine(result + "Кириллица");

	Console.WriteLine(CheckScreen("Main.xml"));

	var result = Device.Click("btnCustomers");
	Console.WriteLine(result);

	var result = Device.Click("btnSave");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("Main.xml"));

	var result = Device.Click("btnCustomers");
	Console.WriteLine(result);

	var result = Device.Click("grScrollView.Controls[0]");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("EditCustomer.xml"));

	var result = Device.Click("btnBack");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("CustomersList.xml"));

	var result = Device.Click("grScrollView.Controls[0]");
	Console.WriteLine(result);

	var result = Device.Click("btnForward");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("CustomerProducts.xml"));

	var result = Device.Click("btnBack");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("EditCustomer.xml"));

	var result = Device.Click("btnForward");
	Console.WriteLine(result);

	Console.Pause(500);

	var result = Device.Click("btnForward");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("CustomerContacts.xml"));

	var result = Device.Click("btnBack");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("CustomerProducts.xml"));

	var result = Device.Click("btnForward");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("CustomerContacts.xml"));

	var result = Device.Click("grScrollView.Controls[0]");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("EditContact.xml"));

	var result = Device.Click("btnBack");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("CustomerContacts.xml"));

	var result = Device.Click("grScrollView.Controls[0]");
	Console.WriteLine(result);

	var result = Device.Click("grScrollView.Controls[7]"); // Должность
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("ListChoiceWithSearch.xml"));

	var result = Device.Click("btnBack");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("EditContact.xml"));

	var result = Device.Click("grScrollView.Controls[7]"); // Должность
	Console.WriteLine(result);

	Console.Pause(500);

	var result = Device.Click("grScrollView.Controls[4]");
	Console.WriteLine(result);

	Console.Pause(500);

	Console.WriteLine(CheckScreen("EditContact.xml"));

	var result = Device.Click("btnDelete");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("CustomerContacts.xml"));

	var result = Device.Click("btnForward");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("CustomerOutlets.xml"));

	var result = Device.Click("btnBack");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("CustomerContacts.xml"));

	var result = Device.Click("btnForward");
	Console.WriteLine(result);

	var result = Device.Click("grScrollView.Controls[0]");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("EditOutletAddress.xml"));

	var result = Device.Click("grScrollView.Controls[2]"); // метро
	Console.WriteLine(result);

	var result = Device.Click("grScrollView.Controls[0]");
	Console.WriteLine(result);

	var result = Device.Click("btnBack");
	Console.WriteLine(result);

	var result = Device.Click("btnCustomers");
	Console.WriteLine(result);

	Console.Pause(500);

	Console.WriteLine(CheckScreen("CustomersList.xml"));

	var result = Device.Click("grScrollView.Controls[0]");
	Console.WriteLine(result);

	var result = Device.Click("btnForward");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("CustomerProducts.xml"));

	var result = Device.Click("btnForward");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("CustomerContacts.xml"));

	var result = Device.Click("btnForward");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("CustomerOutlets.xml"));

	var result = Device.Click("btnSave");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("Main.xml"));

	// /**************************************************************************************/
	Console.WriteLine("-----Задачи на сегодня------");
	var result = Device.Click("btnTasks");
	Stopwatch.Start();
	Console.WriteLine(result);

	var result = CheckScreen("TaskList.xml");
	Console.WriteLine(result);
	
	var result = Device.Click("btnCancel");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("Main.xml"));

	var result = Device.Click("btnTasks");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("TaskList.xml"));

	var result = Device.Click("btnSave");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("Main.xml"));

	var result = Device.Click("btnTasks");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("TaskList.xml"));

	var result = Device.Click("grScrollView.Controls[0]");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("TaskInformation.xml"));

	var result = Device.Click("btnBack");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("TaskList.xml"));

	var result = Device.Click("grScrollView.Controls[0]");
	Console.WriteLine(result);

	var result = Device.Click("btnStart");
	Console.WriteLine(result);

	/*	var DateTime=DateTime.Now;
	 Console.WriteLine(DateTime);*/

	Console.WriteLine(CheckScreen("TaskList.xml"));

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

	var result = Device.Click("grScrollView.Controls[0]");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("EditContact.xml"));

	var result = Device.Click("grScrollView.Controls[7]"); // Должность****
	Console.WriteLine(result);

	Console.Pause(500);

	Console.WriteLine(CheckScreen("ListChoiceWithSearch.xml"));

	var result = Device.Click("btnBack");
	Console.WriteLine(result);

	Console.Pause(500);

	Console.WriteLine(CheckScreen("EditContact.xml"));

	var result = Device.Click("grScrollView.Controls[7]"); // Должность****
	Console.WriteLine(result);

	var result = Device.Click("grScrollView.Controls[4]");
	Console.WriteLine(result);

	Console.Pause(500);

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

	Console.Pause(500);

	Console.WriteLine(CheckScreen("TaskDetails.xml"));

	var result = Device.Click("grScrollView.Controls[0]");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("EditWork.xml"));

	Console.Pause(500);

	var result = Device.Click("grScrollView.Controls[8]");
	Console.WriteLine(result);

	Console.Pause(1000);

	Console.WriteLine(CheckScreen("ListChoiceWithSearch.xml"));

	var result = Device.Click("btnBack");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("EditWork.xml"));

	var result = Device.Click("grScrollView.Controls[8]"); //Product
	Console.WriteLine(result);

	var result = Device.Click("grScrollView.Controls[4]");
	Console.WriteLine(result);

	Console.Pause(1000);

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

	var result = Device.Click("btnTasks");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("TaskList.xml"));

	var result = Device.Click("grScrollView.Controls[0]");
	Console.WriteLine(result);

	Console.Pause(1000);

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
	/*-------------------------------------------------------------------------*/

	Console.WriteLine("-----Календарь задач------");
	var result = Device.Click("btnCalendar");
	Stopwatch.Start();
	Console.WriteLine(result);

	var result = CheckScreen("TaskCalendar.xml");
	Console.WriteLine(result);
	
	var result = Device.Click("btnCancel");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("Main.xml"));

	var result = Device.Click("btnCalendar");
	Console.WriteLine(result);

	var result = Device.Click("btnSave");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("Main.xml"));

	var result = Device.Click("btnCalendar");
	Console.WriteLine(result);

	var result = Device.Click("grScrollView.Controls[10]");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("TaskInformation.xml"));

	var result = Device.Click("btnBack");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("TaskCalendar.xml"));

	var result = Device.Click("grScrollView.Controls[0]");
	Console.WriteLine(result);

	var result = Device.Click("btnStart");
	Console.WriteLine(result);

	/*	var DateTime=DateTime.Now;
	 Console.WriteLine(DateTime);*/

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

	var result = Device.Click("grScrollView.Controls[0]");
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

	var result = Device.Click("grScrollView.Controls[4]");
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

	Console.Pause(500);

	Console.WriteLine(CheckScreen("TaskDetails.xml"));

	var result = Device.Click("grScrollView.Controls[0]");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("EditWork.xml"));

	Console.Pause(500);

	var result = Device.Click("grScrollView.Controls[8]");
	Console.WriteLine(result);

	Console.Pause(1000);

	Console.WriteLine(CheckScreen("ListChoiceWithSearch.xml"));

	var result = Device.Click("btnBack");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("EditWork.xml"));

	var result = Device.Click("grScrollView.Controls[8]"); //Product
	Console.WriteLine(result);

	var result = Device.Click("grScrollView.Controls[4]");
	Console.WriteLine(result);

	Console.Pause(1000);

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

	var result = Device.Click("grScrollView.Controls[10]");
	Console.WriteLine(result);

	Console.Pause(1000);

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