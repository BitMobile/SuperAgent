/*Академия эстетической медицины*/

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

function getRandomArbitary(min, max) {
	return Math.random() * (max - min) + min;
}

function CheckValue(path, text) {
	var result = Device.GetValue(path);
	if (result == text) {
		result = "True";
	} else {
		result = "False";
	}
	return result;
}

function TextCheck(path, text) {
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

function TextViewCheck(path) {
	var result1 = Device.SetFocus(path);

	var text = "проверка";

	var result2 = Device.SetText(path, text);

	textp = path + ".Text";

	var result3 = Device.GetValue(textp);

	result2 = (result2 == "True") ? "False" : "True";

	result3 = (result2 == text) ? "False" : "True";

	result = result1 + "; " + result2 + "; " + result3;

	if (result == "True; True; True") {
		result = "True";
	}

	return result;
}

function main() {

	Console.CommandPause = 500;

	Console.WriteLine("-----Клиенты------");
	var result = Device.Click("btnCustomers");
	Stopwatch.Start();
	Console.WriteLine(result);

	var result = CheckScreen("CustomersList.xml");
	Console.WriteLine(result);
	
	var result = Device.Click("grScrollView.Controls[0]");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("EditCustomer.xml"));

	/* TextView Check Customer contacts */
	Console.WriteLine(TextViewCheck("grScrollView.Controls[1].Controls[0]"));
	Console.WriteLine(TextViewCheck("grScrollView.Controls[3].Controls[0]"));
	Console.WriteLine(TextViewCheck("grScrollView.Controls[8].Controls[0]"));
	Console.WriteLine(TextViewCheck("grScrollView.Controls[10].Controls[0]"));
	Console.WriteLine(TextViewCheck("grScrollView.Controls[15].Controls[0]"));
	Console.WriteLine(TextViewCheck("grScrollView.Controls[17].Controls[0]"));

	var result = Device.Click("btnForward");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("CustomerProducts.xml"));

	/* TextView Check Customer contacts */

	Console.WriteLine(TextViewCheck("grScrollView.Controls[1].Controls[0]"));
	Console.WriteLine(TextViewCheck("grScrollView.Controls[3].Controls[0]"));

	var result = Device.Click("btnForward");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("CustomerContacts.xml"));

	var result = Device.Click("grScrollView.Controls[0]");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("EditContact.xml"));

	Console.WriteLine(TextCheck("grScrollView.Controls[1].Controls[0]",
			"Иванов"));
	Console
			.WriteLine(TextCheck("grScrollView.Controls[3].Controls[0]", "Иван"));
	Console.WriteLine(TextCheck("grScrollView.Controls[5].Controls[0]",
			"Иванович"));
	var result = Device.Click("grScrollView.Controls[7]"); // Должность
	Console.WriteLine(result);
	Console.WriteLine(CheckScreen("ListChoiceWithSearch.xml"));
	var result = Device.Click("grScrollView.Controls[6]");
	Console.WriteLine(result);
	Console.WriteLine(CheckScreen("EditContact.xml"));

	Console.WriteLine(CheckValue("grScrollView.Controls[7].Controls[0].Text",
			"Администратор"));

	Console.WriteLine(TextCheck(
			"grScrollView.Controls[9].Controls[0].Controls[0]", "8"));
	Console.WriteLine(TextCheck(
			"grScrollView.Controls[9].Controls[1].Controls[0]", "956"));
	Console.WriteLine(TextCheck(
			"grScrollView.Controls[9].Controls[2].Controls[0]", "456654"));
	Console.WriteLine(TextCheck(
			"grScrollView.Controls[9].Controls[3].Controls[0]", "1264"));
	Console.WriteLine(Device.Click("grScrollView.Controls[10].Controls[0]"));

	Console.WriteLine(TextCheck("grScrollView.Controls[12].Controls[0]",
			"Комментарий"));

	var result = Device.Click("btnBack");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("CustomerContacts.xml"));

	Console.WriteLine(CheckValue(
			"grScrollView.Controls[0].Controls[0].Controls[0].Text",
			"Иванов Иван Иванович"));

	var result = Device.Click("grScrollView.Controls[0]");
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

	Console.WriteLine(CheckScreen("CustomerContacts.xml"));

	/* ADD SEARCH */

	Console.WriteLine(Search("edtSearch", "Сидоров"));

	var result = CheckValue(
			"grScrollView.Controls[2].Controls[0].Controls[0].Text",
			"Сидоров Сидр Сидорович");
	result = (result == "True") ? "False" : "True";
	Console.WriteLine(result);

	var result = Device.Click("btnForward");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("CustomerOutlets.xml"));

	var result = Device.Click("grScrollView.Controls[0]");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("EditOutletAddress.xml"));

	var address = "Новый адрес";
	Console
			.WriteLine(TextCheck("grScrollView.Controls[1].Controls[0]",
					address));

	var result = Device.Click("grScrollView.Controls[3]"); // метро
	Console.WriteLine(result);

	var sub = Device
			.GetValue("grScrollView.Controls[0].Controls[0].Controls[0].Text");

	var result = Device.Click("grScrollView.Controls[0]");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("EditOutletAddress.xml"));

	Console.WriteLine(CheckValue("grScrollView.Controls[1].Controls[0].Text",
			address));
	Console.WriteLine(CheckValue("grScrollView.Controls[3].Controls[0].Text",
			sub));

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
}