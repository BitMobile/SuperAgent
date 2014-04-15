function main() {
	//while (true) {
	//Console.Pause(500);
	//var result = Device.Click("Preved медвед");
	//Console.WriteLine(result);
	//var result = Device.SetFocus("ПолеВвода1");
	//Console.WriteLine(result);
	//}

	var result = Device.Click("btnVisit");
	Console.WriteLine(result);

	var result = Device.SetFocus("edtSearch");
	Console.WriteLine(result);

	var result = Device.SetText("edtSearch", "111");
	Console.WriteLine(result);

	var result = Device.Click("btnSearch");
	Console.WriteLine(result);

	var result = Device.GetCount("IteratorName");
	Console.WriteLine(result);

	var result = Device.Click("itmOutlet");
	Console.WriteLine(result);

	var result = Device.Click("btnForward");
	Console.WriteLine(result);

	var result = Device.Click("btnForward");
	Console.WriteLine(result);

	var result = Device.Click("btnForward");
	Console.WriteLine(result);

	var result = Device.Click("btnForward");
	Console.WriteLine(result);

	var result = Device.Click("btnForward");
	Console.WriteLine(result);

	var result = Device.Click("btnForward");
	Console.WriteLine(result);

	var result = Device.Click("btnForward");
	Console.WriteLine(result);

	var result = Device.Click("btnForward");
	Console.WriteLine(result);
}