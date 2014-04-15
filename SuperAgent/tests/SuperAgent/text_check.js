// /* Тест, проверяющий значения Text View
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
	Console.Terminate(result != screen, "Экран" + screen + "не открывается!");

	return result;
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

function main() {

	Console.CommandPause = 500;

	Console.WriteLine("-----Модуль Расписание------");
	var result = Device.Click("btnSchedule");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("ScheduledVisits.xml"));

	Console.WriteLine(CheckValue("btnSearch.Text", "Поиск"));

	Console.WriteLine(Device
			.GetValue("btnShowmap.Controls[0].Controls[0].Text"));
	Console.WriteLine(CheckValue("btnShowmap.Controls[0].Controls[0].Text",
			"Показать на карте"));

	var result = Device.Click("grScrollView.Controls[6]");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("Outlet.xml"));

	var outlet = Device.GetValue("workflow[outlet].Description");
	Console.WriteLine(outlet);
	Console.WriteLine(CheckValue(
			"headerDescr.Controls[0].Controls[0].Controls[0].Controls[0].Text",
			outlet)); // проверка отображения названия т.т.

	Console.WriteLine(CheckValue(
			"headerDescr.Controls[0].Controls[0].Controls[0].Controls[1].Text",
			"Наименование")); // проверка отображения поля "Наименование"

	var address = Device.GetValue("workflow[outlet].Address");
	Console.WriteLine(CheckValue(
			"grScrollView.Controls[0].Controls[0].Controls[0].Text", address)); // проверка
	// отображения
	// адреса

	Console.WriteLine(CheckValue(
			"grScrollView.Controls[0].Controls[0].Controls[1].Text", "Адрес")); // проверка
	// отображения
	// поля
	// "Адрес"

	Console.WriteLine(CheckValue(
			"grScrollView.Controls[2].Controls[0].Controls[0].Text",
			"Установить координаты")); // проверка отображения поля "Установить
	// координаты"

	var result = Device.Click("btnBack");
	Console.WriteLine(result);

	var result = Device.Click("btnSchedule");
	Console.WriteLine(result);
	/*
	 * Проверка отображения названия т.т (включая условие того, что папраметры
	 * т.т. изменены))
	 */
	var result = Device
			.GetValue("grScrollView.Controls[6].Controls[1].Controls[0].Text");
	// Console.WriteLine(result);
	if (result == "Торг 45") {
		Console
				.WriteLine(CheckValue(
						"grScrollView.Controls[6].Controls[1].Controls[0].Text",
						outlet)); // проверка отображения названия т.т.
		Console
				.WriteLine(Device
						.GetValue("grScrollView.Controls[6].Controls[1].Controls[1].Text"));
		Console.WriteLine(CheckValue(
				"grScrollView.Controls[6].Controls[1].Controls[1].Text",
				address)); // проверка отображения адреса
	} else {

		Console
				.WriteLine(CheckValue(
						"grScrollView.Controls[6].Controls[0].Controls[0].Text",
						outlet)); // проверка отображения названия т.т.
		Console.WriteLine(CheckValue(
				"grScrollView.Controls[6].Controls[0].Controls[1].Text",
				address)); // проверка отображения адреса
	}

	var result = Device.Click("grScrollView.Controls[6]");
	Console.WriteLine(result);

	/*
	 * Проверка отображения правильных значений в характеристиках и параметрах
	 * т.т.
	 */

	Console.WriteLine(Device
			.GetValue("grScrollView.Controls[4].Controls[0].Controls[0].Text"));
	Console.WriteLine(CheckValue(
			"grScrollView.Controls[4].Controls[0].Controls[0].Text", "А")); // Добавить
	// получение
	// данных
	// из
	// workflow
	Console.WriteLine(Device
			.GetValue("grScrollView.Controls[4].Controls[0].Controls[1].Text"));
	Console.WriteLine(CheckValue(
			"grScrollView.Controls[4].Controls[0].Controls[1].Text",
			"Класс торговой точки"));

	Console.WriteLine(Device
			.GetValue("grScrollView.Controls[6].Controls[0].Controls[0].Text"));
	Console.WriteLine(CheckValue(
			"grScrollView.Controls[6].Controls[0].Controls[0].Text",
			"Универсам")); // Добавить получение данных из workflow
	Console.WriteLine(CheckValue(
			"grScrollView.Controls[6].Controls[0].Controls[1].Text",
			"Тип торговой точки"));

	Console.WriteLine(Device
			.GetValue("grScrollView.Controls[8].Controls[0].Controls[0].Text"));
	Console
			.WriteLine(CheckValue(
					"grScrollView.Controls[8].Controls[0].Controls[0].Text",
					"samsung")); // Добавить получение данных из workflow
	Console.WriteLine(CheckValue(
			"grScrollView.Controls[8].Controls[0].Controls[1].Text",
			"Дистрибьютор"));

	Console
			.WriteLine(Device
					.GetValue("grScrollView.Controls[10].Controls[0].Controls[0].Text"));
	Console.WriteLine(CheckValue(
			"grScrollView.Controls[10].Controls[0].Controls[0].Text", "?")); // Добавить
	// получение
	// данных
	// из
	// workflow
	Console.WriteLine(CheckValue(
			"grScrollView.Controls[10].Controls[0].Controls[1].Text",
			"Размер площади"));

	var result = Device.Click("btnForward");
	Console.WriteLine(result);

	var DateTime = CurrDateTime();
	Console.WriteLine(DateTime);
	Console.WriteLine(CheckScreen("Tasks.xml"));

	Console.WriteLine(CheckValue(
			"grScrollView.Controls[0].Controls[0].Controls[0].Text", "454"));
	Console.WriteLine(CheckValue(
			"grScrollView.Controls[0].Controls[0].Controls[1].Text",
			"Торг 45, 19.11.2016"));

	Console.WriteLine(Device.Click("grScrollView.Controls[0]"));

	Console.WriteLine(CheckScreen("Visit_Task.xml"));

	Console.WriteLine(CheckValue(
			"grScrollView.Controls[0].Controls[0].Controls[0].Text", "454"));
	Console.WriteLine(CheckValue(
			"grScrollView.Controls[0].Controls[0].Controls[1].Text",
			"Наименование"));

	Console
			.WriteLine(Device
					.GetValue("grScrollView.Controls[2].Controls[0].Controls[0].Value"));
	Console.WriteLine(CheckValue(
			"grScrollView.Controls[2].Controls[0].Controls[0].Value", ""));
	Console.WriteLine(CheckValue(
			"grScrollView.Controls[2].Controls[0].Controls[1].Text",
			"Результат"));

	Console.WriteLine(CheckValue(
			"grScrollView.Controls[4].Controls[0].Controls[0].Text", "777"));
	Console.WriteLine(CheckValue(
			"grScrollView.Controls[4].Controls[0].Controls[1].Text", "Задача"));

	Console.WriteLine(CheckValue(
			"grScrollView.Controls[6].Controls[0].Controls[0].Text",
			"19.11.2016 0:00:00"));
	Console.WriteLine(CheckValue(
			"grScrollView.Controls[6].Controls[0].Controls[1].Text",
			"Плановый срок"));

	var result = Device.Click("btnForward");

	var result = Device.Click("btnForward"); // Переход к экрану Общих
	// вопросов
	Console.WriteLine(result + "Переход к экрану Общих вопросов");

	Console.WriteLine(CheckScreen("Visit_Questions.xml"));

	Console
			.WriteLine(CheckValue(
					"grScrollView.Controls[0].Controls[0].Controls[0].Text",
					"Выкладка"));

	Console.WriteLine(CheckValue(
			"grScrollView.Controls[22].Controls[0].Controls[0].Text",
			"Выберите значение.."));
	Console.WriteLine(CheckValue(
			"grScrollView.Controls[21].Controls[0].Controls[0].Text",
			"Ценник у товара присутствует"));

	Console.WriteLine(Device.Click("grScrollView.Controls[22]"));

	Console.WriteLine(CheckValue(
			"header.Controls[0].Controls[0].Controls[0].Controls[0].Text",
			"Список значений"));
	Console.WriteLine(CheckValue(
			"header.Controls[0].Controls[0].Controls[0].Controls[1].Text",
			"Выберите значение.."));

	Console.WriteLine(CheckValue(
			"grScrollView.Controls[0].Controls[0].Controls[0].Text", "Да"));
	Console
			.WriteLine(CheckValue(
					"grScrollView.Controls[2].Controls[0].Controls[0].Text",
					"Не знаю"));
	Console.WriteLine(CheckValue(
			"grScrollView.Controls[4].Controls[0].Controls[0].Text", "Нет"));

	Console.WriteLine(Device.Click("grScrollView.Controls[2]"));

	Console
			.WriteLine(CheckValue(
					"grScrollView.Controls[22].Controls[0].Controls[0].Text",
					"Не знаю"));

	var result = Device.Click("btnForward");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("Visit_SKUs.xml"));

	Console.WriteLine(CheckValue(
			"grScrollView.Controls[0].Controls[0].Controls[0].Text", "0 из 2"));
	Console.WriteLine(Device
			.GetValue("grScrollView.Controls[0].Controls[0].Controls[1].Text"));
	Console
			.WriteLine(CheckValue(
					"grScrollView.Controls[0].Controls[0].Controls[1].Text",
					"500 гр,"));

	Console.WriteLine(Device.Click("grScrollView.Controls[0]"));

	Console.WriteLine(CheckValue(
			"grScrollView.Controls[0].Controls[0].Controls[1].Text",
			"Доступность"));
	Console.WriteLine(CheckValue(
			"grScrollView.Controls[2].Controls[1].Controls[0].Text",
			"Нет фотоснимка"));

	var result = Device.Click("btnForward");
	Console.WriteLine(result);

	Console.WriteLine(Device.Click("grScrollView.Controls[2]"));

	var result = Device.Click("btnForward");
	Console.WriteLine(result);

	Console.WriteLine(Device
			.GetValue("grScrollView.Controls[2].Controls[0].Controls[0].Text"));
	Console.WriteLine(CheckValue(
			"grScrollView.Controls[2].Controls[0].Controls[0].Text", "1 из 6"));
	Console.WriteLine(CheckValue(
			"grScrollView.Controls[2].Controls[0].Controls[1].Text",
			"Дрель ударно-вращательная Kolner KED-400V"));

	Console.WriteLine(CheckValue(
			"grScrollView.Controls[0].Controls[0].Controls[0].Text", "1 из 2"));
	Console
			.WriteLine(CheckValue(
					"grScrollView.Controls[0].Controls[0].Controls[1].Text",
					"500 гр,"));

	var result = Device.Click("btnForward");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("Order.xml"));

	var result = Device.Click("Orderadd.Controls[0].Controls[0].Controls[0]"); // Price-list
	Console.WriteLine(result + "Price-list");

	Console.WriteLine(CheckScreen("Order_Info.xml"));

	Console.WriteLine(CheckValue(
			"grScrollView.Controls[0].Controls[0].Controls[0].Text", "0,00"));
	Console.WriteLine(CheckValue(
			"grScrollView.Controls[0].Controls[0].Controls[1].Text", "Итого"));

	Console.WriteLine(Device
			.GetValue("grScrollView.Controls[2].Controls[0].Controls[0].Text"));
	Console.WriteLine(CheckValue(
			"grScrollView.Controls[2].Controls[0].Controls[0].Text",
			"full price-list"));
	Console.WriteLine(CheckValue(
			"grScrollView.Controls[2].Controls[0].Controls[1].Text",
			"Прайс-лист"));

	var result = Device.Click("grScrollView.Controls[2]");

	Console.WriteLine(CheckScreen("ListChoice.xml"));

	Console.WriteLine(CheckValue(
			"header.Controls[0].Controls[0].Controls[0].Controls[0].Text",
			"Прайс-лист"));
	Console.WriteLine(CheckValue(
			"header.Controls[0].Controls[0].Controls[0].Controls[1].Text",
			"Выберите значение.."));

	Console.WriteLine(CheckValue(
			"grScrollView.Controls[0].Controls[0].Controls[0].Text",
			"full price-list"));
	Console.WriteLine(CheckValue(
			"grScrollView.Controls[2].Controls[0].Controls[0].Text", "222"));

	var result = Device.Click("grScrollView.Controls[0]"); // Choose Price-list
	Console.WriteLine(result + "Choose Price-list");

	var result = Device.Click("btnForward");
	Console.WriteLine(result);

	Console.WriteLine(CheckValue(
			"Orderadd.Controls[0].Controls[0].Controls[1].Controls[0].Text",
			"0,00"));
	Console.WriteLine(CheckValue(
			"Orderadd.Controls[0].Controls[0].Controls[1].Controls[1].Text",
			"Итого"));
	/*
	 * Console.WriteLine(CheckValue("Orderadd.Controls[1].Controls[0].Text", "Не
	 * ограничен")+"No LImit");
	 * Console.WriteLine(CheckValue("Orderadd.Controls[1].Controls[1].Text",
	 * "Лимит"));
	 */

	var result = Device.Click("Orderadd.Controls[0].Controls[0].Controls[2]"); // Order
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("Order_SKUs.xml"));

	Console.WriteLine(Search("edtSearch", "гво"));

	Console.WriteLine(CheckValue(
			"grScrollView.Controls[6].Controls[0].Controls[0].Text",
			"Гвоздь 10ка"));
	Console
			.WriteLine(Device
					.GetValue("grScrollView.Controls[6].Controls[0].Controls[1].Controls[0].Text"));
	Console
			.WriteLine(CheckValue(
					"grScrollView.Controls[6].Controls[0].Controls[1].Controls[0].Text",
					"Цена: 62,00  Остатки: 28,00"));

	var result = Device.Click("btnBack");
	Console.WriteLine(result);

	var result = Device.Click("btnForward");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("Order_Commentary.xml"));

	Console.WriteLine(Device
			.GetValue("grScrollView.Controls[0].Controls[0].Controls[1].Text"));
	Console.WriteLine(CheckValue(
			"grScrollView.Controls[0].Controls[0].Controls[1].Text",
			"Дата доставки"));

	Console.WriteLine(CheckValue(
			"grScrollView.Controls[2].Controls[0].Controls[0].Text",
			"Введите текст.."));

	var result = Device.Click("btnForward");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("Receivables.xml"));

	Console.WriteLine(CheckValue(
			"grScrollView.Controls[0].Controls[0].Controls[0].Text", "0"));
	Console.WriteLine(CheckValue(
			"grScrollView.Controls[0].Controls[0].Controls[1].Text",
			"Сумма задолженности"));

	Console.WriteLine(CheckValue(
			"grScrollView.Controls[0].Controls[1].Controls[0].Text", "0"));
	Console.WriteLine(CheckValue(
			"grScrollView.Controls[0].Controls[1].Controls[1].Text",
			"Сумма инкассации"));

	Console.WriteLine(CheckValue(
			"grScrollView.Controls[2].Controls[0].Controls[0].Text",
			"Распределить на документы"));

	Console.WriteLine(Device
			.GetValue("grScrollView.Controls[4].Controls[0].Controls[1].Text"));
	Console.WriteLine(CheckValue(
			"grScrollView.Controls[4].Controls[0].Controls[1].Text",
			"Номер документа"));

	Console.WriteLine(CheckValue(
			"grScrollView.Controls[6].Controls[0].Controls[1].Text", "ФИО"));

	Console.WriteLine(CheckValue(
			"grScrollView.Controls[8].Controls[0].Controls[1].Text",
			"Комментарий"));

	var result = Device.Click("btnForward");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("Visit_Total.xml"));

	Console.WriteLine(CheckValue(
			"grScrollView.Controls[0].Controls[0].Controls[0].Text", outlet));
	Console.WriteLine(CheckValue(
			"grScrollView.Controls[0].Controls[0].Controls[1].Text", address));

	var StartDateTime = Device
			.GetValue("grScrollView.Controls[2].Controls[0].Controls[0].Text");
	StartDateTime = StartDateTime.slice(0, -3);
	Console.WriteLine(DateTime);
	Console.WriteLine(StartDateTime);
	var result = (StartDateTime == DateTime) ? "True" : "False";
	Console.WriteLine(result);
	Console.WriteLine(CheckValue(
			"grScrollView.Controls[2].Controls[0].Controls[1].Text",
			"Время начала"));
	Console.WriteLine(Device
			.GetValue("grScrollView.Controls[4].Controls[0].Controls[0].Text"));
	Console.WriteLine(CheckValue(
			"grScrollView.Controls[4].Controls[0].Controls[0].Text", "2 из 9"));
	Console
			.WriteLine(CheckValue(
					"grScrollView.Controls[4].Controls[0].Controls[1].Text",
					"Вопросы"));
	Console.WriteLine(Device
			.GetValue("grScrollView.Controls[6].Controls[0].Controls[0].Text"));
	Console
			.WriteLine(CheckValue(
					"grScrollView.Controls[6].Controls[0].Controls[0].Text",
					"2 из 20"));
	Console.WriteLine(CheckValue(
			"grScrollView.Controls[6].Controls[0].Controls[1].Text",
			"Номенклатура Вопросы"));

	var result = Device.Click("btnForward");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("Main.xml"));

	/* VISIT----------------------------------------------------------------------------------------------------------------------------------- */

	Console.WriteLine("-----Модуль Визит------");

	var result = Device.Click("btnVisit");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("Outlets.xml"));

	Console.WriteLine(CheckValue("btnSearch.Text", "Поиск"));

	Console.WriteLine(Search("edtSearch", "тор 54"));

	var result = Device.Click("grScrollView.Controls[0]");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("Outlet.xml"));

	var outlet = Device.GetValue("workflow[outlet].Description");
	Console.WriteLine(CheckValue(
			"headerDescr.Controls[0].Controls[0].Controls[0].Controls[0].Text",
			outlet)); // проверка отображения названия т.т.

	Console.WriteLine(CheckValue(
			"headerDescr.Controls[0].Controls[0].Controls[0].Controls[1].Text",
			"Наименование")); // проверка отображения поля "Наименование"

	var address = Device.GetValue("workflow[outlet].Address");
	Console.WriteLine(CheckValue(
			"grScrollView.Controls[0].Controls[0].Controls[0].Text", address)); // проверка
	// отображения
	// адреса

	Console.WriteLine(CheckValue(
			"grScrollView.Controls[0].Controls[0].Controls[1].Text", "Адрес")); // проверка
	// отображения
	// поля
	// "Адрес"

	Console.WriteLine(CheckValue(
			"grScrollView.Controls[2].Controls[0].Controls[0].Text",
			"Установить координаты")); // проверка отображения поля "Установить
	// координаты"

	var result = Device.Click("btnBack");
	Console.WriteLine(result);

	var result = Device.Click("btnSchedule");
	Console.WriteLine(result);

	Console.WriteLine(Search("edtSearch", "тор 54"));

	/*
	 * Проверка отображения названия т.т (включая условие того, что папраметры
	 * т.т. изменены))
	 */
	var result = Device
			.GetValue("grScrollView.Controls[0].Controls[1].Controls[0].Text");
	Console.WriteLine(result);
	if (result == "Торг 54") {
		Console
				.WriteLine(CheckValue(
						"grScrollView.Controls[0].Controls[1].Controls[0].Text",
						outlet)); // проверка отображения названия т.т.
		Console
				.WriteLine(Device
						.GetValue("grScrollView.Controls[0].Controls[1].Controls[1].Text"));
		Console.WriteLine(CheckValue(
				"grScrollView.Controls[0].Controls[1].Controls[1].Text",
				address)); // проверка отображения адреса
	} else {

		Console
				.WriteLine(CheckValue(
						"grScrollView.Controls[0].Controls[0].Controls[0].Text",
						outlet)); // проверка отображения названия т.т.
		Console.WriteLine(CheckValue(
				"grScrollView.Controls[0].Controls[0].Controls[1].Text",
				address)); // проверка отображения адреса
	}

	Console.WriteLine(Search("edtSearch", "тор 54"));

	var result = Device.Click("grScrollView.Controls[0]");
	Console.WriteLine(result);

	var DateTime = CurrDateTime();
	Console.WriteLine(DateTime);

	/*
	 * Проверка отображения правильных значений в характеристиках и параметрах
	 * т.т.
	 */

	Console.WriteLine(Device
			.GetValue("grScrollView.Controls[4].Controls[0].Controls[0].Text"));
	Console.WriteLine(CheckValue(
			"grScrollView.Controls[4].Controls[0].Controls[0].Text", "А")); // Добавить
	// получение
	// данных
	// из
	// workflow
	Console.WriteLine(CheckValue(
			"grScrollView.Controls[4].Controls[0].Controls[1].Text",
			"Класс торговой точки"));

	Console.WriteLine(Device
			.GetValue("grScrollView.Controls[6].Controls[0].Controls[0].Text"));
	Console.WriteLine(CheckValue(
			"grScrollView.Controls[6].Controls[0].Controls[0].Text",
			"Гипермаркет")); // Добавить получение данных из workflow
	Console.WriteLine(CheckValue(
			"grScrollView.Controls[6].Controls[0].Controls[1].Text",
			"Тип торговой точки"));

	Console.WriteLine(Device
			.GetValue("grScrollView.Controls[8].Controls[0].Controls[0].Text"));
	Console.WriteLine(CheckValue(
			"grScrollView.Controls[8].Controls[0].Controls[0].Text",
			"Дистр.Строит мат.")); // Добавить получение данных из workflow
	Console.WriteLine(CheckValue(
			"grScrollView.Controls[8].Controls[0].Controls[1].Text",
			"Дистрибьютор"));

	Console
			.WriteLine(Device
					.GetValue("grScrollView.Controls[10].Controls[0].Controls[0].Text"));
	Console.WriteLine(CheckValue(
			"grScrollView.Controls[10].Controls[0].Controls[0].Text", "?")); // Добавить
	// получение
	// данных
	// из
	// workflow
	Console.WriteLine(CheckValue(
			"grScrollView.Controls[10].Controls[0].Controls[1].Text",
			"Размер площади"));

	var result = Device.Click("btnForward");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("Tasks.xml"));

	Console.WriteLine(CheckValue(
			"grScrollView.Controls[0].Controls[0].Controls[0].Text", "7457"));
	Console.WriteLine(CheckValue(
			"grScrollView.Controls[0].Controls[0].Controls[1].Text",
			"Торг 54, 16.11.2017"));

	Console.WriteLine(Device.Click("grScrollView.Controls[0]"));

	Console.WriteLine(CheckScreen("Visit_Task.xml"));

	Console.WriteLine(CheckValue(
			"grScrollView.Controls[0].Controls[0].Controls[0].Text", "7457"));
	Console.WriteLine(CheckValue(
			"grScrollView.Controls[0].Controls[0].Controls[1].Text",
			"Наименование"));

	Console
			.WriteLine(Device
					.GetValue("grScrollView.Controls[2].Controls[0].Controls[0].Value"));
	Console.WriteLine(CheckValue(
			"grScrollView.Controls[2].Controls[0].Controls[0].Value", ""));
	Console.WriteLine(CheckValue(
			"grScrollView.Controls[2].Controls[0].Controls[1].Text",
			"Результат"));

	Console.WriteLine(CheckValue(
			"grScrollView.Controls[4].Controls[0].Controls[0].Text", "77"));
	Console.WriteLine(CheckValue(
			"grScrollView.Controls[4].Controls[0].Controls[1].Text", "Задача"));

	Console.WriteLine(CheckValue(
			"grScrollView.Controls[6].Controls[0].Controls[0].Text",
			"16.11.2017 0:00:00"));
	Console.WriteLine(CheckValue(
			"grScrollView.Controls[6].Controls[0].Controls[1].Text",
			"Плановый срок"));

	var result = Device.Click("btnForward");

	var result = Device.Click("btnForward"); // Переход к экрану Общих
	// вопросов
	Console.WriteLine(result + "Переход к экрану Общих вопросов");

	Console.WriteLine(CheckScreen("Visit_Questions.xml"));

	Console
			.WriteLine(CheckValue(
					"grScrollView.Controls[0].Controls[0].Controls[0].Text",
					"Выкладка"));

	Console.WriteLine(CheckValue(
			"grScrollView.Controls[22].Controls[0].Controls[0].Text",
			"Выберите значение.."));
	Console.WriteLine(CheckValue(
			"grScrollView.Controls[21].Controls[0].Controls[0].Text",
			"Ценник у товара присутствует"));

	Console.WriteLine(Device.Click("grScrollView.Controls[22]"));

	Console.WriteLine(CheckValue(
			"header.Controls[0].Controls[0].Controls[0].Controls[0].Text",
			"Список значений"));
	Console.WriteLine(CheckValue(
			"header.Controls[0].Controls[0].Controls[0].Controls[1].Text",
			"Выберите значение.."));

	Console.WriteLine(CheckValue(
			"grScrollView.Controls[0].Controls[0].Controls[0].Text", "Да"));
	Console
			.WriteLine(CheckValue(
					"grScrollView.Controls[2].Controls[0].Controls[0].Text",
					"Не знаю"));
	Console.WriteLine(CheckValue(
			"grScrollView.Controls[4].Controls[0].Controls[0].Text", "Нет"));

	Console.WriteLine(Device.Click("grScrollView.Controls[2]"));

	Console
			.WriteLine(CheckValue(
					"grScrollView.Controls[22].Controls[0].Controls[0].Text",
					"Не знаю"));

	var result = Device.Click("btnForward");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("Visit_SKUs.xml"));

	Console.WriteLine(Device
			.GetValue("grScrollView.Controls[0].Controls[0].Controls[0].Text"));
	Console.WriteLine(CheckValue(
			"grScrollView.Controls[0].Controls[0].Controls[0].Text", "0 из 3"));
	Console
			.WriteLine(CheckValue(
					"grScrollView.Controls[0].Controls[0].Controls[1].Text",
					"500 гр,"));

	Console.WriteLine(CheckValue(
			"grScrollView.Controls[2].Controls[0].Controls[0].Text", "0 из 3"));
	Console.WriteLine(Device
			.GetValue("grScrollView.Controls[2].Controls[0].Controls[1].Text"));
	Console.WriteLine(CheckValue(
			"grScrollView.Controls[2].Controls[0].Controls[1].Text",
			"Минимойка Karcher K2.38 M"));

	Console.WriteLine(Device.Click("grScrollView.Controls[0]"));

	Console.WriteLine(CheckValue(
			"grScrollView.Controls[0].Controls[0].Controls[1].Text",
			"Доступность"));
	Console.WriteLine(CheckValue(
			"grScrollView.Controls[2].Controls[0].Controls[1].Text", "Цена"));
	Console
			.WriteLine(CheckValue(
					"grScrollView.Controls[4].Controls[0].Controls[1].Text",
					"Наценка"));

	var result = Device.Click("btnForward");
	Console.WriteLine(result);

	Console.WriteLine(Device.Click("grScrollView.Controls[2]"));

	Console
			.WriteLine(CheckValue(
					"grScrollView.Controls[0].Controls[0].Controls[1].Text",
					"Фейсинг"));
	Console.WriteLine(CheckValue(
			"grScrollView.Controls[2].Controls[0].Controls[1].Text", "Цена"));
	Console.WriteLine(CheckValue(
			"grScrollView.Controls[4].Controls[0].Controls[1].Text",
			"Наличие на складе"));

	var result = Device.Click("btnForward");
	Console.WriteLine(result);

	Console.WriteLine(CheckValue(
			"grScrollView.Controls[0].Controls[0].Controls[0].Text", "1 из 3"));
	Console
			.WriteLine(CheckValue(
					"grScrollView.Controls[0].Controls[0].Controls[1].Text",
					"500 гр,"));

	Console.WriteLine(CheckValue(
			"grScrollView.Controls[2].Controls[0].Controls[0].Text", "1 из 3"));
	Console.WriteLine(CheckValue(
			"grScrollView.Controls[2].Controls[0].Controls[1].Text",
			"Минимойка Karcher K2.38 M"));

	var result = Device.Click("btnForward");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("Order.xml"));

	Console.WriteLine(CheckValue(
			"Orderadd.Controls[0].Controls[0].Controls[1].Controls[0].Text",
			"0,00"));
	Console.WriteLine(CheckValue(
			"Orderadd.Controls[0].Controls[0].Controls[1].Controls[1].Text",
			"Итого"));
	/*
	 * Console.WriteLine(CheckValue("Orderadd.Controls[1].Controls[0].Text",
	 * "-560"));
	 * Console.WriteLine(CheckValue("Orderadd.Controls[1].Controls[1].Text",
	 * "Лимит"));
	 */

	var result = Device.Click("Orderadd.Controls[0].Controls[0].Controls[2]");// Order
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("Order_SKUs.xml"));

	Console.WriteLine(Search("edtSearch", "гво"));

	Console.WriteLine(CheckValue(
			"grScrollView.Controls[2].Controls[0].Controls[0].Text",
			"Гвоздь 10ка"));
	Console
			.WriteLine(Device
					.GetValue("grScrollView.Controls[2].Controls[0].Controls[1].Controls[0].Text"));
	Console
			.WriteLine(CheckValue(
					"grScrollView.Controls[2].Controls[0].Controls[1].Controls[0].Text",
					"Цена: 5,00  Остатки: 28,00"));

	var result = Device.Click("btnBack");
	Console.WriteLine(result);

	var result = Device.Click("btnForward");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("Order_Commentary.xml"));

	Console.WriteLine(CheckValue(
			"grScrollView.Controls[0].Controls[0].Controls[1].Text",
			"Дата доставки"));

	Console.WriteLine(CheckValue(
			"grScrollView.Controls[2].Controls[0].Controls[0].Text",
			"Введите текст.."));

	var result = Device.Click("btnForward");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("Receivables.xml"));

	Console.WriteLine(CheckValue(
			"grScrollView.Controls[0].Controls[0].Controls[0].Text", "5560"));
	Console.WriteLine(CheckValue(
			"grScrollView.Controls[0].Controls[0].Controls[1].Text",
			"Сумма задолженности"));

	Console.WriteLine(CheckValue(
			"grScrollView.Controls[0].Controls[1].Controls[0].Text", "0"));
	Console.WriteLine(CheckValue(
			"grScrollView.Controls[0].Controls[1].Controls[1].Text",
			"Сумма инкассации"));

	Console.WriteLine(CheckValue(
			"grScrollView.Controls[2].Controls[0].Controls[0].Text",
			"Распределить на документы"));

	Console.WriteLine(CheckValue(
			"grScrollView.Controls[4].Controls[0].Controls[0].Text", "123"));

	Console.WriteLine(Device
			.GetValue("grScrollView.Controls[4].Controls[0].Controls[1].Text"));
	Console.WriteLine(CheckValue(
			"grScrollView.Controls[4].Controls[0].Controls[1].Text",
			"Сумма документа: 5560,00"));

	Console.WriteLine(Device
			.GetValue("grScrollView.Controls[6].Controls[0].Controls[1].Text"));
	Console.WriteLine(CheckValue(
			"grScrollView.Controls[6].Controls[0].Controls[1].Text",
			"Номер документа"));

	Console.WriteLine(CheckValue(
			"grScrollView.Controls[8].Controls[0].Controls[1].Text", "ФИО"));

	Console.WriteLine(CheckValue(
			"grScrollView.Controls[10].Controls[0].Controls[1].Text",
			"Комментарий"));

	Console.WriteLine(Device.Click("grScrollView.Controls[4]"));

	Console.WriteLine(CheckValue(
			"grScrollView.Controls[0].Controls[0].Controls[0].Text", "123"));
	Console
			.WriteLine(CheckValue(
					"grScrollView.Controls[0].Controls[0].Controls[1].Text",
					"Документ"));

	Console
			.WriteLine(CheckValue(
					"grScrollView.Controls[2].Controls[0].Controls[0].Text",
					"5560,00"));
	Console.WriteLine(CheckValue(
			"grScrollView.Controls[2].Controls[0].Controls[1].Text",
			"Задолженность"));

	Console.WriteLine(CheckValue(
			"grScrollView.Controls[4].Controls[0].Controls[0].Text", "0"));
	Console.WriteLine(CheckValue(
			"grScrollView.Controls[4].Controls[0].Controls[1].Text", "Сумма"));

	var result = Device.Click("btnForward");
	Console.WriteLine(result);

	var result = Device.Click("btnForward");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("Visit_Total.xml"));

	Console.WriteLine(CheckValue(
			"grScrollView.Controls[0].Controls[0].Controls[0].Text", outlet));
	Console.WriteLine(CheckValue(
			"grScrollView.Controls[0].Controls[0].Controls[1].Text", address));
	var StartDateTime = Device
			.GetValue("grScrollView.Controls[2].Controls[0].Controls[0].Text");
	StartDateTime = StartDateTime.slice(0, -3);
	Console.WriteLine(DateTime);
	Console.WriteLine(StartDateTime);
	var result = (StartDateTime == DateTime) ? "True" : "False";
	Console.WriteLine(result);
	Console.WriteLine(CheckValue(
			"grScrollView.Controls[2].Controls[0].Controls[1].Text",
			"Время начала"));
	Console.WriteLine(Device
			.GetValue("grScrollView.Controls[4].Controls[0].Controls[0].Text"));
	Console.WriteLine(CheckValue(
			"grScrollView.Controls[4].Controls[0].Controls[0].Text", "2 из 9"));
	Console
			.WriteLine(CheckValue(
					"grScrollView.Controls[4].Controls[0].Controls[1].Text",
					"Вопросы"));
	Console.WriteLine(Device
			.GetValue("grScrollView.Controls[6].Controls[0].Controls[0].Text"));
	Console.WriteLine(CheckValue(
			"grScrollView.Controls[6].Controls[0].Controls[0].Text", "2 из 6"));
	Console.WriteLine(CheckValue(
			"grScrollView.Controls[6].Controls[0].Controls[1].Text",
			"Номенклатура Вопросы"));

	var result = Device.Click("btnForward");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("Main.xml"));

	/* ORDER----------------------------------------------------------------------------------------------------------- */

	Console.WriteLine("-----Модуль Заказ------");

	var result = Device.Click("btnOrder");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("OrderList.xml"));

	Console.WriteLine(CheckValue("NewOrder.Controls[0].Controls[0].Text",
			"Создать новый заказ"));

	var result = Device.Click("NewOrder");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("Outlets.xml"));

	Console.WriteLine(Search("edtSearch", "тор 54"));

	var result = Device
			.GetValue("grScrollView.Controls[0].Controls[1].Controls[0].Text");
	Console.WriteLine(result);

	if (result == "Торг 54") {
		Console.WriteLine(CheckValue(
				"grScrollView.Controls[0].Controls[1].Controls[0].Text",
				"Торг 54")); // проверка отображения названия т.т.
	} else {

		Console.WriteLine(CheckValue(
				"grScrollView.Controls[0].Controls[0].Controls[0].Text",
				"Торг 54")); // проверка отображения названия т.т.

	}

	var result = Device.Click("grScrollView.Controls[0]");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("Order.xml"));

	var result = Device.Click("Orderadd.Controls[0].Controls[0].Controls[2]"); // Order
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("Order_SKUs.xml"));

	Console.WriteLine(Search("edtSearch", "гво"));

	Console.WriteLine(CheckValue(
			"grScrollView.Controls[2].Controls[0].Controls[0].Text",
			"Гвоздь 10ка"));
	Console
			.WriteLine(Device
					.GetValue("grScrollView.Controls[2].Controls[0].Controls[1].Controls[0].Text"));
	Console
			.WriteLine(CheckValue(
					"grScrollView.Controls[2].Controls[0].Controls[1].Controls[0].Text",
					"Цена: 5,00  Остатки: 28,00"));

	var result = Device.Click("btnBack");
	Console.WriteLine(result);

	var result = Device.Click("btnForward");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("Order_Commentary.xml"));

	Console.WriteLine(CheckValue(
			"grScrollView.Controls[2].Controls[0].Controls[0].Text",
			"Введите текст.."));

	var result = Device.Click("btnForward");
	Console.WriteLine(result);

	/* -------------Outlets -------------------------------------------------- */
	Console.WriteLine("-----Модуль Магазин------");

	var result = Device.Click("btnOutlets");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("Outlets_Outlets.xml"));

	Console
			.WriteLine(Device
					.GetValue("NewOutlet.Controls[0].Controls[0].Controls[0].Controls[0].Text"));
	Console.WriteLine(CheckValue(
			"NewOutlet.Controls[0].Controls[0].Controls[0].Controls[0].Text",
			"Создать новую торговую точку"));

	Console.WriteLine(Search("edtSearch", "тор 54"));

	Console.WriteLine(Device.Click("grScrollView.Controls[0]"));

	var result = Device
			.GetValue("grScrollView.Controls[0].Controls[1].Controls[0].Text");
	Console.WriteLine(result);

	if (result == "Торг 54") {
		var outlet = Device.GetValue("workflow[outlet].Description");
		Console.WriteLine("workflow  " + outlet);
		Console
				.WriteLine(CheckValue(
						"grScrollView.Controls[0].Controls[1].Controls[0].Text",
						outlet)); // проверка отображения названия т.т.
	} else {
		var outlet = Device.GetValue("workflow[outlet].Description");
		Console.WriteLine("workflow  " + outlet);
		Console
				.WriteLine(CheckValue(
						"grScrollView.Controls[0].Controls[0].Controls[0].Text",
						outlet)); // проверка отображения названия т.т.

	}

	Console.WriteLine(CheckValue(
			"headerDescr.Controls[0].Controls[0].Controls[0].Controls[1].Text",
			"Наименование")); // проверка отображения поля "Наименование"

	var address = Device.GetValue("workflow[outlet].Address");
	Console.WriteLine(CheckValue(
			"grScrollView.Controls[2].Controls[0].Controls[0].Text", address)); // проверка
	// отображения
	// адреса

	Console.WriteLine(CheckValue(
			"grScrollView.Controls[0].Controls[0].Controls[1].Text", "Адрес")); // проверка
	// отображения
	// поля
	// "Адрес"

	Console.WriteLine(CheckValue(
			"grScrollView.Controls[4].Controls[0].Controls[0].Text",
			"Установить координаты")); // проверка отображения поля "Установить
	// координаты"

	Console.WriteLine(Device.Click("grScrollView.Controls[4]"));

	var SetCoordinates = Dialog.GetMessage();
	var result = (SetCoordinates == "Установить координаты торговой точки по текущему расположению?") ? "True"
			: "False";
	Console.WriteLine(result);

	Console.WriteLine(Dialog.ClickNegative());

	Console.WriteLine(Device
			.GetValue("grScrollView.Controls[6].Controls[0].Controls[0].Text"));
	Console.WriteLine(CheckValue(
			"grScrollView.Controls[6].Controls[0].Controls[0].Text", "А")); // Добавить
	// получение
	// данных
	// из
	// workflow
	Console.WriteLine(CheckValue(
			"grScrollView.Controls[6].Controls[0].Controls[1].Text",
			"Класс торговой точки"));

	Console.WriteLine(Device
			.GetValue("grScrollView.Controls[8].Controls[0].Controls[0].Text"));
	Console.WriteLine(CheckValue(
			"grScrollView.Controls[8].Controls[0].Controls[0].Text",
			"Гипермаркет")); // Добавить получение данных из workflow
	Console.WriteLine(CheckValue(
			"grScrollView.Controls[8].Controls[0].Controls[1].Text",
			"Тип торговой точки"));

	Console
			.WriteLine(Device
					.GetValue("grScrollView.Controls[10].Controls[0].Controls[0].Text"));
	Console.WriteLine(CheckValue(
			"grScrollView.Controls[10].Controls[0].Controls[0].Text",
			"Дистр.Строит мат.")); // Добавить получение данных из workflow
	Console.WriteLine(CheckValue(
			"grScrollView.Controls[10].Controls[0].Controls[1].Text",
			"Дистрибьютор"));

	Console
			.WriteLine(Device
					.GetValue("grScrollView.Controls[12].Controls[0].Controls[0].Text"));
	Console.WriteLine(CheckValue(
			"grScrollView.Controls[12].Controls[0].Controls[0].Text", "?")); // Добавить получение данных из workflow
	Console.WriteLine(CheckValue(
			"grScrollView.Controls[12].Controls[0].Controls[1].Text",
			"Размер площади"));

	var result = Device.Click("btnBack");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("Main.xml"));

	/*-------------------------------------Stocks--------------------------------------*/

	Console.WriteLine("-----Модуль Stocks----");

	var result = Device.Click("btnDistr");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("Stock_SKUs.xml"));

	Console.WriteLine(Search("edtSearch", "гво 20"));

	Console.WriteLine(CheckValue(
			"grScrollView.Controls[2].Controls[0].Controls[0].Text",
			"Гвоздь 20ка"));

	Console.WriteLine(CheckValue(
			"grScrollView.Controls[2].Controls[0].Controls[1].Text",
			"44,00 шт."));

	var result = Device.Click("btnBack");
	Console.WriteLine(result);

	Console.WriteLine(CheckScreen("Main.xml"));
}