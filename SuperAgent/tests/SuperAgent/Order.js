/*  Получить номера  заказов из 1С

Запуск бат 
var wsh = new ActiveXObject("WScript.Shell");
wsh.Run(new ActiveXObject("Scripting.FileSystemObject").GetAbsolutePathName("")+"/Schedule.bat");
 */

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
	Console.Terminate(result != screen, "  Экран" + screen + "не открывается!");

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

function main() {

	var result = Device.Click("btnOrder");
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
	/* Took outlet descr from workflow in future */

	

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