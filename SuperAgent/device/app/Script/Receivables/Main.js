
function GetReceivables(outlet) {

	var receivables = new Query("SELECT RD.DocumentName, RD.DocumentSum, RD.Overdue FROM Document_AccountReceivable_ReceivableDocuments RD JOIN Document_AccountReceivable AR ON AR.Id=RD.Ref WHERE AR.Outlet = @outlet ORDER BY AR.Date, RD.LineNumber");
	receivables.AddParameter("outlet", outlet);
	var d = receivables.Execute();

	Variables.Add("receivableAmount", GetAmount(d));
	Variables.Add("overdueAmount", GetOverdueAmount(outlet));

	return d;

}

function ValidateAmount(control) {
	return Global.ValidateField(control.Text, "[0-9\\.,]*", Translate["#encashmentAmount#"]);
}

function GetAmount(receivables) {
	var receivables = new Query("SELECT RD.DocumentName, RD.DocumentSum FROM Document_AccountReceivable_ReceivableDocuments RD JOIN Document_AccountReceivable AR ON AR.Id=RD.Ref WHERE AR.Outlet = @outlet ORDER BY RD.LineNumber");
	receivables.AddParameter("outlet", outlet);
	var d = receivables.Execute();
	var amount = parseInt(0);
	while (d.Next()) {
		amount += d.DocumentSum;
	}
	return amount;

}

function RefreshAmount(control, encashment, encasmentItem) {
	encasmentItem = encasmentItem.GetObject();
	if (IsNullOrEmpty(control.Text))
		encasmentItem.EncashmentSum = 0;
	else
		encasmentItem.EncashmentSum = control.Text;
	encasmentItem.Save();

	var q = new Query("SELECT SUM(EncashmentSum) FROM Document_Encashment_EncashmentDocuments WHERE Ref=@ref");
	q.AddParameter("ref", encashment);
	var s = q.ExecuteScalar();

	encashment = encashment.GetObject();
	encashment.EncashmentAmount = s;
	encashment.Save();
	$.encAmount.Text = s;
}

function CreateEncashmentIfNotExist(visit) {// , textValue) {
	var query = new Query("SELECT Id FROM Document_Encashment WHERE Visit=@visit");
	query.AddParameter("visit", visit);
	var encashment = query.ExecuteScalar();

	if (encashment == null) {
		encashment = DB.Create("Document.Encashment");
		encashment.Visit = visit;
		encashment.Date = DateTime.Now;
		encashment.EncashmentAmount = parseInt(0);
		encashment.Save();
		encashment = encashment.Id;
	}

	return encashment;
}

function CreateEncashmentItemIfNotExist(encashment, receivableDoc) {
	var query = new Query("SELECT Id FROM Document_Encashment_EncashmentDocuments WHERE Ref=@ref AND DocumentName=@docName");
	query.AddParameter("ref", encashment);
	query.AddParameter("docName", receivableDoc);
	// query.Text = "select single(*) from
	// Document.Encashment_EncashmentDocuments where Ref == @docRef &&
	// DocumentName == @docName";
	var encItem = query.ExecuteScalar();

	if (encItem == null) {
		encItem = DB.Create("Document.Encashment_EncashmentDocuments");
		encItem.Ref = encashment;
		encItem.DocumentName = receivableDoc;
		encItem.EncashmentSum = 0;
		encItem.Save();
		encItem = encItem.Id;
	}
	return encItem;
}

function SpreadEncasmentAndRefresh(encashent, outlet) {

	var receivables = new Query("SELECT RD.DocumentName, RD.DocumentSum FROM Document_AccountReceivable_ReceivableDocuments RD JOIN Document_AccountReceivable AR ON AR.Id=RD.Ref WHERE AR.Outlet = @outlet ORDER BY AR.Date, RD.LineNumber");
	receivables.AddParameter("outlet", outlet);
	var d = receivables.Execute();

	var sumToSpread = encashent.EncashmentAmount;
	while (d.Next()) {
		var query = new Query("SELECT Id FROM Document_Encashment_EncashmentDocuments WHERE Ref=@ref AND DocumentName=@docName");
		query.AddParameter("ref", encashent);
		query.AddParameter("docName", d.DocumentName);
		var encRow = query.ExecuteScalar();

		encRowObj = encRow.GetObject();
		if (Converter.ToDecimal(sumToSpread) > Converter.ToDecimal(d.DocumentSum)) {
			encRowObj.EncashmentSum = FormatValue(d.DocumentSum);
			sumToSpread = sumToSpread - d.DocumentSum;
		} else {
			encRowObj.EncashmentSum = FormatValue(sumToSpread);
			sumToSpread = Converter.ToDecimal(0);
		}
		encRowObj.Save();
	}
	Workflow.Refresh([]);
}

function SaveAndForward(encashment) {
	if (ValidateAmount($.encAmount)) {
		ClearEmptyRecDocs(encashment);
		if (parseFloat(encashment.EncashmentAmount) != parseFloat(0))
			encashment.GetObject().Save();
		else
			DB.Delete(encashment);
		Workflow.Forward([]);
	}
}

function ClearEmptyRecDocs(encashment) {
	var q = new Query("SELECT Id, EncashmentSum FROM Document_Encashment_EncashmentDocuments WHERE Ref=@ref AND EncashmentSum = 0");
	q.AddParameter("ref", encashment);
	var rows = q.Execute();
	while (rows.Next()) {
		DB.Delete(rows.Id);
	}
}

function GetOverdueAmount(outlet) {
	// var outlet = Variables["workflow"].outlet;
	var q = new Query("SELECT SUM(R.DocumentSum) FROM Document_AccountReceivable A JOIN Document_AccountReceivable_ReceivableDocuments R ON A.Id=R.Ref WHERE A.Outlet = @outlet AND Overdue=1");
	q.AddParameter("outlet", outlet);

	return q.ExecuteScalar();
}