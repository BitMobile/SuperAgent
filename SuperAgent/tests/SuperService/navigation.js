function CheckScreen(screen) {

	var result = Device.GetValue("context.CurrentScreen.Name");
	Console.Terminate(result != screen, " Экран" + screen + "не открывается!");

	return result;
}

function main() {

	Console.WriteLine("-----Клиенты------");
	var result = Device.Click("btnCustomers");
	Console.WriteLine(result);

	var result = CheckScreen("CustomersList.xml");
	Console.WriteLine(result);
			
	var result = Device.Click("btnCancel");
	Console.WriteLine(result);

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

	var result = Device.Click("grScrollView.Controls[6]");
	Console.WriteLine(result);

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

	var result = Device.Click("grScrollView.Controls[6]");
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

	var result = Device.Click("btnTasks");
	Console.WriteLine(result);

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

	var result = Device.Click("grScrollView.Controls[0]");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("TaskInformation.xml"));

	var result = Device.Click("btnBack");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("TaskCalendar.xml"));

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