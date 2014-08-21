/* Создать визит с задачей, вопросами , вопросами по SKU, прайс-листами и инкассацией.
 */
function TextCheck(path, text) {
	var result1 = Device.SetFocus(path);

	var result2 = Device.SetText(path, text);

	var textp = path + ".Text";

	var result3 = Device.GetValue(textp);

	if (result3 == text) {
		result3 = "True";
	} else {
		result3 = "False";
	}
	var result = result1 + "; " + result2 + "; " + result3;
	return result;
}

function CheckScreen(screen) {

	var result = Device.GetValue("context.CurrentScreen.Name");
	Console.Terminate(result != screen, "Экран" + screen + "не открывается!");

	return result;
}

function getRandomArbitary(min, max) {
	return Math.round(Math.random() * (max - min) + min);
}

function random_even(a, b) {
	var k = getRandomArbitary(a, b);
	var num=0;
	if (k % 2 > 0) {
		var num = k + 1;
		return num;
	} else {
		var num = k;
		return num;
	}
	
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

function main() {

	Console.CommandPause = 300;

	var i = 0;

	while (i < 500) {
		var n = getRandomArbitary(1, 865);
		Console.WriteLine(n);

		i++;
		Console.WriteLine(i);

		var result = Device.Click("btnOrder");
		Console.WriteLine(result);

		var result = Device.Click("NewOrder");
		Console.WriteLine(result);

		Console.WriteLine(CheckScreen("Outlets.xml"));

		var m = random_even(0, 53);
		var k = "grScrollView.Controls[" + m + "]";
		Console.WriteLine(k);

		var result = Device.Click(k);
		Console.WriteLine(result);

		Console.WriteLine(CheckScreen("Order.xml"));

		var result = Device
				.Click("Orderadd.Controls[0].Controls[0].Controls[0]");
		Console.WriteLine(result);

		Console.WriteLine(CheckScreen("Order_Info.xml"));

		var result = Device
				.GetValue("grScrollView.Controls[2].Controls[0].Controls[0].Text");
		Console.WriteLine(result);
		if (result == "Для этой торговой точки нет прайс-листов") {
			Console.WriteLine("Прайс-листов нет");
			var result = Device.Click("btnForward");
			Console.WriteLine(result);

		} else {
			Console.WriteLine("Прайс-лист есть");

			var result = Device.Click("btnForward");
			Console.WriteLine(result);

			var result = Device
					.Click("Orderadd.Controls[0].Controls[0].Controls[2]");

			Console.WriteLine(result);

			var result = CheckScreen("Order_SKUs.xml");

			Console.WriteLine(result);

			var m = random_even(0, 7);
			var k = "grScrollView.Controls[" + m + "]";
			Console.WriteLine(k);
			var result = Device.Click(k); // Add SKU to Order
			Console.WriteLine(result);

			Console.Pause(500);

			var result = Device.GetValue("context.CurrentScreen.Name");
			if (result == "Order_EditSKU.xml") {
				Console.WriteLine("1");
				var result = TextCheck(
						"grScrollView.Controls[2].Controls[1].Controls[0]", n);
				Console.WriteLine(result + "Quantity");

				var result = Device.Click("btnForward");
				Console.WriteLine(result);

				var result = Device.Click("btnForward");
				Console.WriteLine(result);
				var result = Device.Click("btnForward");
				Console.WriteLine(result);
			} else {
				Console.WriteLine("2");
				m = m + 2;
				k = "grScrollView.Controls[" + m + "]";
				var result = Device.Click(k); // Add SKU to Order
				Console.WriteLine(result);
				Console.WriteLine(TextCheck(
						"grScrollView.Controls[2].Controls[1].Controls[0]", n));
				Console.WriteLine(result + "Quantity");

				var result = Device.Click("btnForward");
				Console.WriteLine(result);

				var result = Device.Click("btnForward");
				Console.WriteLine(result);
				var result = Device.Click("btnForward");
				Console.WriteLine(result);
			}
		}

		var result = Device.Click("btnForward");
		Console.WriteLine(result);

		Console.WriteLine(CheckScreen("Order_Commentary.xml"));

		Console.WriteLine(TextCheck(
				"grScrollView.Controls[2].Controls[0].Controls[1]", n));

		var result = Device.Click("btnForward");
		Console.WriteLine(result);

		Console.WriteLine(CheckScreen("Main.xml"));

	}
}