var lastError;
function GetError(){return lastError}
							function CheckError(fptr) {

								  var resultCode = fptr.GetResultCode();

								  if (resultCode >= 0) return;

								  var resultDescription = fptr.GetResultDescription();
								  var	badParameter = null;

								  if (resultCode == -6)
								    badParameter = fptr.GetBadParamDescription();

								  // Utils.TraceMessage($ "ResultCode: {resultCode} {Environment.NewLine}" +
								  //   $ "ResultDescription: {resultDescription}{Environment.NewLine}" +
								  //   $ "BadParameters: {badParameter}");
								  if (badParameter != null){
										//Errors.push(badParameter);
										if(lastError==null){lastError = badParameter}
										//Dialog.Message(badParameter);
									}
									else{
										//Errors.push(resultDescription);
										if(lastError==null){lastError = resultDescription}
										//Dialog.Message(resultDescription);
									}


								  //   throw new FPTRException(resultCode, badParameter);
								  // throw new FPTRException(resultCode, resultDescription);

								}

								function OpenCheque(fptr, type) {
									//lastError = '';
								  if (fptr.PutMode(FiscalRegistratorConsts.ModeRegistration) < 0)
								    CheckError(fptr);
								  if (fptr.SetMode() < 0)
								    CheckError(fptr);
								  if (fptr.PutCheckType(type) < 0)
								    CheckError(fptr);
								  if (fptr.OpenCheck() < 0)
								    CheckError(fptr);
								}

								function CloseCheque(fptr, typeClose) {
								  if (fptr.PutTypeClose(typeClose) < 0)
								    CheckError(fptr);
								  if (fptr.CloseCheck() < 0)
								    CheckError(fptr);
								}

								function CloseCheque(fptr) {
								  if (fptr.CloseCheck() < 0)
								    CheckError(fptr);
								}

								function RegistrationFz54(fptr, name, price, quantity, positionSum, taxNumber) {
								  // Utils.TraceMessage($ "Name: {name} Price: {price}{Environment.NewLine}" +
								  //   $ "Quantity: {quantity}" +
								  //   $ "{Environment.NewLine}{nameof(taxNumber)}: {taxNumber}");

								  if (fptr.PutPositionSum(positionSum) < 0)
								    CheckError(fptr);
								  if (fptr.PutQuantity(quantity) < 0)
								    CheckError(fptr);
								  if (fptr.PutPrice(price) < 0)
								    CheckError(fptr);
								  if (fptr.PutTaxNumber(taxNumber) < 0)
								    CheckError(fptr);
								  if (fptr.PutTextWrap(FiscalRegistratorConsts.WrapWord) < 0)
								    CheckError(fptr);
								  if (fptr.PutName(name) < 0)
								    CheckError(fptr);
								  if (fptr.Registration() < 0)
								    CheckError(fptr);
								}

								function Payment(fptr, sum, type) {
								  if (fptr.PutSumm(sum) < 0)
								    CheckError(fptr);
								  if (fptr.PutTypeClose(type) < 0)
								    CheckError(fptr);
								  if (fptr.Payment() < 0)
								    CheckError(fptr);
								}

								function PrintZ(fptr) {
								  if (fptr.PutMode(FiscalRegistratorConsts.ModeReportClear) < 0)
								    CheckError(fptr);
								  if (fptr.SetMode() < 0)
								    CheckError(fptr);
								  if (fptr.PutReportType(FiscalRegistratorConsts.ReportZ) < 0)
								    CheckError(fptr);
								  if (fptr.Report() < 0)
								    CheckError(fptr);
								}

								function PrintX(fptr) {
								  if (fptr.PutMode(FiscalRegistratorConsts.ModeReportNoClear) < 0)
								    CheckError(fptr);
								  if (fptr.SetMode() < 0)
								    CheckError(fptr);
								  if (fptr.PutReportType(FiscalRegistratorConsts.ReportX) < 0)
								    CheckError(fptr);
								  if (fptr.Report() < 0)
								    CheckError(fptr);
								}

								/// <summary>
								/// Метод для установки телефона или email на который будет отправлен чек
								/// </summary>
								/// <param name="fptr"> IFiscalRegistratorProvider interface</param>
								/// <param name="telOrNumber"> Имя телефона или email</param>
								function SetEmailOrTelephoneNumber(fptr, telOrNumber) {
								  // if (string.IsNullOrEmpty(telOrNumber)) {
								  //   Utils.TraceMessage($ "{nameof(telOrNumber)} is empty: {string.IsNullOrEmpty(telOrNumber)}");
								  //   return;
								  // }

								  // if (!(Regex.IsMatch(telOrNumber, Parameters.TelephoneRegex) ||
								  //     Regex.IsMatch(telOrNumber, Parameters.EmailRegex))) {
								  //   Utils.TraceMessage($ "{nameof(telOrNumber)} : {telOrNumber}");
									//
								  //   Utils.TraceMessage($ "In if operator value : " +
								  //     $ "{!(Regex.IsMatch(telOrNumber, Parameters.TelephoneRegex) || Regex.IsMatch(telOrNumber, Parameters.EmailRegex))}");
									//
								  //   Utils.TraceMessage(
								  //     $ "Is tel = {Regex.IsMatch(telOrNumber, Parameters.TelephoneRegex)}{Environment.NewLine}" +
								  //     $ "Is email {Regex.IsMatch(telOrNumber, Parameters.EmailRegex)}");
								  //   return;
								  // }


								  if (fptr.PutFiscalPropertyNumber(1008) < 0)
								    CheckError(fptr);
								  if (fptr.PutFiscalPropertyType(FiscalRegistratorConsts.FiscalPropertyTypeString) < 0)
								    CheckError(fptr);
								  if (fptr.PutFiscalPropertyValue(telOrNumber) < 0)
								    CheckError(fptr);
								  if (fptr.WriteFiscalProperty() < 0)
								    CheckError(fptr);
								}


								function SetKashierName(fptr, name) {
								  if (name == null)
								    return;

								  var resultName = name;
								  if (resultName.Length > 64) {
								    resultName = resultName.Substring(0, 64);
								  }

								  if (fptr.PutFiscalPropertyNumber(1021) < 0)
								    CheckError(fptr);
								  if (fptr.PutFiscalPropertyType(FiscalRegistratorConsts.FiscalPropertyTypeString) < 0)
								    CheckError(fptr);
								  if (fptr.PutFiscalPropertyValue(resultName) < 0)
								    CheckError(fptr);
								  if (fptr.WriteFiscalProperty() < 0)
								    CheckError(fptr);
								}

								function IsShiftOpened(fptr) {
								  if (fptr.PutRegisterNumber(18) < 0)
								    CheckError(fptr);
								  if (fptr.Register < 0)
								    CheckError(fptr);

								  return fptr.GetSessionOpened();
								}

								function GetChequeCount(fptr) {
								  if (fptr.PutRegisterNumber(44) < 0)
								    CheckError(fptr);
								  if (fptr.Register < 0)
								    CheckError(fptr);

								  return fptr.GetCount();
								}

								function GetChequeCountTime(fptr) {
								  if (fptr.PutRegisterNumber(45) < 0)
								    CheckError(fptr);
								  if (fptr.Register < 0)
								    CheckError(fptr);

								  return fptr.GetTime();
								}

								function FptrDateTime(fptr) {
								  if (fptr.PutRegisterNumber(17) < 0)
								    CheckError(fptr);
								  if (fptr.Register < 0)
								    CheckError(fptr);

								  return fptr.GetDateTime();
								}

								function ShiftEnDateTime(fptr) {
								  if (fptr.PutRegisterNumber(18) < 0)
								    CheckError(fptr);
								  if (fptr.Register < 0)
								    CheckError(fptr);

								  return fptr.GetDateTime();
								}

								/// <summary>
								/// В чеке после Payment
								/// </summary>
								/// <param name="fptr"></param>
								/// <returns></returns>
								function GetChequeSumm(fptr) {
								  if (fptr.PutRegisterNumber(20) < 0)
								    CheckError(fptr);
								  if (fptr.Register < 0)
								    CheckError(fptr);

								  return Convert.ToDecimal(fptr.GetSumm());
								}

								/// <summary>
								/// Можно после Payment или после закрытия чека
								/// </summary>
								/// <param name="fptr"></param>
								/// <returns></returns>
								function GetShiftNumber(fptr) {
								  if (fptr.PutRegisterNumber(21) < 0)
								    CheckError(fptr);
								  if (fptr.Register < 0)
								    CheckError(fptr);

								  return fptr.GetSession() + 1;
								}

								/// <summary>
								/// Без разницы
								/// </summary>
								/// <param name="fptr"></param>
								/// <returns></returns>
								function GetFptrSerialNumber(fptr) {
								  if (fptr.PutRegisterNumber(22) < 0)
								    CheckError(fptr);
								  if (fptr.Register < 0)
								    CheckError(fptr);

								  return fptr.GetSerialNumber();
								}

								/// <summary>
								/// Без разницы
								/// </summary>
								/// <param name="fptr"></param>
								/// <returns></returns>
								function GetNumberOfFiscalStorage(fptr) {
								  if (fptr.PutRegisterNumber(47) < 0)
								    CheckError(fptr);
								  if (fptr.Register < 0)
								    CheckError(fptr);

								  return fptr.GetSerialNumber();
								}

								/// <summary>
								/// Вызывается после закрытия чека
								/// </summary>
								/// <param name="fptr"></param>
								/// <returns></returns>
								function GetShiftChequeNumber(fptr) {
								  if (fptr.PutRegisterNumber(53) < 0)
								    CheckError(fptr);
								  if (fptr.Register < 0)
								    CheckError(fptr);

								  return fptr.GetCheckNumber();
								}

								/// <summary>
								/// После закрытия чека
								/// </summary>
								/// <param name="fptr"></param>
								/// <returns></returns>
								function GetFiscalSignOfTheDocument(fptr) {
								  if (fptr.PutRegisterNumber(52) < 0)
								    CheckError(fptr);
								  if (fptr.Register < 0)
								    CheckError(fptr);

								  return Convert.ToDecimal(fptr.GetValue());
								}

								function GetVATs(Vat) {
									if (Vat == "Percent0")
										return 1;
									else if (Vat == "Percent10")
										return 2;
									else if (Vat == "Percent18")
										return 3;
									else if (Vat == "PercentWithoOut")
										return 4;
								}

								function Annul(fptr) {
									lastError = null;
									fptr.CancelCheck();
								}
