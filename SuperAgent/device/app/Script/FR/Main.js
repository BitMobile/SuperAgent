var fptr;

function OnLoad() {
	// DrawDataReport();
	//
	// DrawFtpReport();
}


function OpenSettings() {

	// var _fptr = ClientModel3.MD.FiscalRegistrator.GetProviderInstance();
  // _fptr.Initialize();
	fptr = FiscalRegistrator.GetProviderInstance();
	fptr.Initialize();
	fptr.OpenSettings();

	Variables["workConst"]["fptr"] = fptr;

}

function PrintXReport() {

	//Dialog.Message('Печатаю Х.. отчет');
	if (fptr != NULL){

		Fiscal.PrintX(fptr);

	}
	else {
		Dialog.Message(Translate["#NoFs#"]);
	}

}

function PrintZReport() {

	Dialog.Alert(Translate["#AskPrintZ#"], PrintZ, null, Translate["#YES#"], Translate["#NO#"]);

}

function PrintZ(state, args) {
	if (args.Result == 0) {

		if (fptr != NULL){

			Fiscal.PrintZ(fptr);

		}
		else {
			Dialog.Message(Translate["#NoFs#"]);
		}

	}

}

function Connect(){

	if (fptr != NULL){

		fptr.PutDeviceSettings(fptr.Settings);
	  fptr.PutDeviceEnabled(true);
		fptr.Beep();

		
		Variables["ChequeCount"].Text = Fiscal.GetChequeCount(fptr);
		Variables["ChequeCountDate"].Text = "от " + Fiscal.FptrDateTime(fptr);
		//Dialog.Message(Fiscal.GetChequeCountTime(fptr));

	}
	else {
		Dialog.Message(Translate["#NoFs#"]);
	}

}

function AskWorkFlow(){

	if (($.workflow.name == 'Return') || ($.workflow.name == 'Order') || ($.workflow.name == 'Visit')){
		return true;
	}
	else{
		return false;
	}
}

function BackToScreen(){
	Workflow.Back();
}
