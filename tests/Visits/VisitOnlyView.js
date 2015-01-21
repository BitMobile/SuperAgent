// Тестирование модуля Visits: VisitOnlyView
//
//----------------------------
// глобальная переменная - счетчик теста 
var CountTest = 1; 

// Вызов паузы
function Pause (time_ms)
{
	Console.WriteLine ("###Call function Pause: " + time_ms/1000 + " seconds") ;
	Console.Pause(time_ms);
}
// Проход по всему визиту до окна "Завершение"
function GoVisitForward ()
{
	Console.WriteLine("###Call function GoVisitForward");
	var result = "Visit\\Total.xml";
	while (result != GetScreen ())
	{
		Device.Click ("btnForward");
	}
}

// Проверка отображения окна
function CheckScreen(screen) {

	var result = Device.GetValue("context.CurrentScreen.Name");
	Console.Terminate(result != screen, "Screen " + screen + " not_opened!");
	Console.WriteLine("Now is open: " + result + " <Passed>");
	return result;
}

// Отображение текущего экрана
function GetScreen ()
{
	var result = Device.GetValue("context.CurrentScreen.Name");
	//Console.WriteLine("Now is open: " + result + " Passed");
	return result;
}
//##### Проверка отображения параметров
function CheckListParam (param, text) 
{
var result = Device.GetValue(param);
	//Console.WriteLine(counttest);
	if (result == text)
	{
		Console.WriteLine("Test #" + CountTest++ + ": " + result + " <PASSED> \n");
	}
	else 
	{
		Console.WriteLine("###Test FAILED #" + CountTest++ + ": " + result + "\n");
	}
}

// Test_begin
function TestBegin()
{
	Console.WriteLine ("-----------< Test Begin! >----------\n")
}
//----- end begin
// Main_menu
function GoBackMainScr ()
{
	Console.WriteLine("###Call function GoBackMainScr");
	if ("Visit\\Visits.xml" == GetScreen())
		{
			Device.Click("btnMenu");
			result = Device.Click("swipe_layout.Controls[0].Controls[0]");
			if(result) 
				Console.WriteLine("\n************** Test Ended ***************");
			return 0;
		}
    var outlet = "Outlets\\Outlet.xml";
	
	while (outlet != GetScreen("Outlets\\Outlet.xml"))	
	{
		Device.Click ("btnBack");
	}
	Device.Click ("btnBack");
	Device.Click("btnMenu");
	result = Device.Click("swipe_layout.Controls[0].Controls[0]");
	 if(result) 
		Console.WriteLine("\n--------------< Test Ended >--------------");
}
//---- main


function main()
{
var stop = true; // остановка теста

TestBegin();
var result = Device.Click("swipe_layout.Controls[0].Controls[1]");
CheckScreen("Visit\\Visits.xml");
CheckListParam ("VLayout.Controls[0].Controls[2].Controls[0].Text", "Визиты");
// Device.Click("planned");
// CheckListParam ("planned.Controls[0].Text", "Плановые (2)");
// CheckListParam ("unPlanned.Controls[0].Text", "Внеплановые (45)");
// CheckListParam("edtSearch.Placeholder", "Поиск");
// CheckListParam("btnSearch.Text", "Поиск");
// CheckListParam("grScrollView.Controls[0].Controls[0].Text", "НЕВЫПОЛНЕННЫЕ ВИЗИТЫ (2):");
// CheckListParam("grScrollView.Controls[7].Controls[0].Text", "ВЫПОЛНЕННЫЕ ВИЗИТЫ (0):");
// Device.Click("unPlanned");
// GetScreen();
// CheckListParam ("planned.Controls[0].Text", "Плановые (2)");
// CheckListParam ("unPlanned.Controls[0].Text", "Внеплановые (45)");
// CheckListParam("edtSearch.Placeholder", "Поиск");
// CheckListParam("btnSearch.Text", "Поиск");

//--- Плановый визит ---//
// Outlet.xml
Device.Click("planned");
Device.Click ("grScrollView.Controls[2]");
// CheckScreen("Outlets\\Outlet.xml");
// CheckListParam ("btnBack.Controls[1].Text", "Визиты");
// CheckListParam ("btnForward.Text", "Далее");
// CheckListParam ("vOutlet.Controls[2].Controls[2].Controls[0].Text", "Клиент");
// CheckListParam ("btnDetails.Controls[0].Controls[0].Text", "Реквизиты");
// CheckListParam ("btnContacts.Controls[0].Text", "Контакты");
// CheckListParam ("grScrollView.Controls[0].Controls[0].Text", "ОСНОВНОЕ:");
// CheckListParam ("grScrollView.Controls[2].Controls[0].Controls[0].Text", "Наименование");
// CheckListParam ("grScrollView.Controls[2].Controls[0].Controls[1].Text", "MarvellousTest");
// CheckListParam ("grScrollView.Controls[4].Controls[0].Controls[0].Text", "Адрес");
// CheckListParam ("grScrollView.Controls[4].Controls[0].Controls[1].Text", "999999999");
// CheckListParam ("grScrollView.Controls[6].Controls[0].Controls[0].Controls[0].Text", "Координаты");
// CheckListParam ("grScrollView.Controls[6].Controls[0].Controls[0].Controls[1].Text", "Установить");
// CheckListParam ("grScrollView.Controls[8].Controls[0].Text", "ДОПОЛНИТЕЛЬНО:");
// CheckListParam ("grScrollView.Controls[10].Controls[0].Text", "Класс торговой точки");
// CheckListParam ("grScrollView.Controls[12].Controls[0].Text", "Тип торговой точки");
// CheckListParam ("grScrollView.Controls[14].Controls[0].Text", "Дистрибьютор");
// CheckListParam ("grScrollView.Controls[16].Controls[0].Text", "Кол-во фейсингов");
// CheckListParam ("grScrollView.Controls[18].Controls[0].Text", "Наличие наших конкурентов");
// CheckListParam ("grScrollView.Controls[20].Controls[0].Text", "Канал сбыта");
// CheckListParam ("grScrollView.Controls[22].Controls[0].Text", "Фото полки");
// CheckListParam ("grScrollView.Controls[24].Controls[0].Text", "ММС");
// CheckListParam ("grScrollView.Controls[26].Controls[0].Text", "Название торговой сети");
// CheckListParam ("grScrollView.Controls[28].Controls[0].Text", "Площадь торгового зала");
// CheckListParam ("grScrollView.Controls[30].Controls[0].Text", "Оптовая торговля");
// CheckListParam ("grScrollView.Controls[32].Controls[0].Text", "Самообслуживание");
// CheckListParam ("grScrollView.Controls[34].Controls[0].Text", "Наличие торгового окна");
// CheckListParam ("grScrollView.Controls[36].Controls[0].Text", "Наличие премиальных брендов");
// CheckListParam ("grScrollView.Controls[38].Controls[0].Text", "Дебиторская задолженность");
// CheckListParam ("grScrollView.Controls[40].Controls[0].Text", "Размер дебиторской задолженности");
// CheckListParam ("grScrollView.Controls[42].Controls[0].Text", "наличие акционных моделей");
// CheckListParam ("grScrollView.Controls[44].Controls[0].Text", "оформление витрины samsung");
// CheckListParam ("grScrollView.Controls[46].Controls[0].Text", "наличие новинок");
// CheckListParam ("grScrollView.Controls[48].Controls[0].Text", "Правильная выкладка");
// CheckListParam ("grScrollView.Controls[50].Controls[0].Text", "Наличие конкурентов");
// CheckListParam ("grScrollView.Controls[52].Controls[0].Text", "Время посещения");
// CheckListParam ("grScrollView.Controls[54].Controls[0].Text", "Размер площади");
// end of Outlet.xml
Pause (3000);
Device.Click ("btnForward");
// Tasks.xml
// CheckScreen("Visit\\Tasks.xml");
// CheckListParam("btnBack.Controls[1].Text", "Назад");
// CheckListParam("vTaskLayout.Controls[0].Controls[2].Controls[0].Text", "Задачи");
// CheckListParam("btnForward.Text", "Далее");
// CheckListParam("grScrollView.Controls[0].Controls[0].Text", "НЕВЫПОЛНЕННЫЕ:");
// CheckListParam("swipe_layout1.Controls[0].Controls[0].Controls[1].Text", "Выполнить");
// CheckListParam("swipe_layout1.Controls[1].Controls[0].Controls[0].Text", "31/01/2015");
// CheckListParam("swipe_layout1.Controls[1].Controls[0].Controls[1].Text", "Узнать про промо места");
// CheckListParam("grScrollView.Controls[4].Controls[0].Text", "ВЫПОЛНЕННЫЕ:");
// end of Tasks.xml
Pause (3000);
Device.Click ("btnForward");
// Questions.xml
CheckScreen("Visit\\Questions.xml");
CheckListParam("btnBack.Controls[1].Text", "Назад");
CheckListParam("obligateredButton.Text", "Задачи");
CheckListParam("btnForward.Text", "Далее");
//
GoBackMainScr();
Console.Terminate(stop, "Test stop!");
Device.Click ("btnBack");

Device.Click("unPlanned");
//end проверка работы поиска
Device.Click ("grScrollView.Controls[0]");

Device.Click ("btnBack");
//##Visit workflow

//GoVisitForward(); // проход по визиту до окна завершнения

// end Visit workflow
//Device.Click ("btnForward"); // завершение визита

// метод возврата на главное меню
GoBackMainScr();

} // end of main