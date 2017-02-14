var changed;

function OnLoad(){
	changed = false;
}

function Modified(sender){
	if (!changed) {
		$.title.Text = $.title.Text + "*";
		changed = true;
	}
}

function ValidateValue(sender, docObj){
	ValueBegOfDay = String.IsNullOrEmpty($.ValueBegOfDay.Text) ? 0 : parseInt($.ValueBegOfDay.Text);
	ValueEndOfDay = String.IsNullOrEmpty($.ValueEndOfDay.Text) ? 0 : parseInt($.ValueEndOfDay.Text);

	if (sender === $.ValueBegOfDay) {
		docObj.DateBegOfTheDay = CurrentDate();
	} else if (sender === $.ValueEndOfDay) {
		if(ValueBegOfDay == 0){
			Dialog.Message("Заполните показания на начало дня.");
		}

		docObj.DateEndOfTheDay = CurrentDate();
	}

	if(!String.IsNullOrEmpty($.ValueEndOfDay.Text) && ValueBegOfDay > ValueEndOfDay){
		Dialog.Message("Показания на конец дня не могут быть меньше, чем на начало.");
	}
}

function CreateOdometerDoc(){	
	var query = new Query("SELECT Id From Document_OdometerValue WHERE DATE(Date)=DATE('now', 'localtime')");
	var docref = query.ExecuteScalar();

	if (String.IsNullOrEmpty(docref))
	{
		docObj = DB.Create("Document.OdometerValue");	
		docObj.Date = CurrentDate();
		docObj.SR = $.common.UserRef;
		return docObj;
	}
	else
	{
		docObj = docref.GetObject();
		return docObj;
	}
}

function SaveNewDoc(docObj){
	docObj.Save();
	DB.Save();

	changed = false;
	$.title.Text = Translate["#Odometer#"];
}