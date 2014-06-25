
function GetReceivables(outlet) {

    var receivables = new Query("SELECT RD.DocumentName, RD.DocumentSum FROM Document_AccountReceivable_ReceivableDocuments RD JOIN Document_AccountReceivable AR ON AR.Id=RD.Ref WHERE AR.Outlet = @outlet ORDER BY AR.Date, RD.LineNumber");
    receivables.AddParameter("outlet", outlet);
    var d = receivables.Execute();

    var r = GetAmount(d);
    Variables.Add("receivableAmount", r);
    return d;

}

function GetAmount(receivables) {
    //var receivables = new Query("SELECT SUM(RD.DocumentName) FROM Document_AccountReceivable_ReceivableDocuments RD JOIN Document_AccountReceivable AR ON AR.Id=RD.Ref WHERE AR.Outlet = @outlet");
    //receivables.AddParameter("outlet", outlet);
    //var amount = receivables.ExecuteScalar();
    //return amount;
    var receivables = new Query("SELECT RD.DocumentName, RD.DocumentSum FROM Document_AccountReceivable_ReceivableDocuments RD JOIN Document_AccountReceivable AR ON AR.Id=RD.Ref WHERE AR.Outlet = @outlet ORDER BY RD.LineNumber");
    receivables.AddParameter("outlet", outlet);
    var d = receivables.Execute();
    var amount = parseInt(0);
    while (d.Next()) {
        amount += d.DocumentSum;
    }
    return amount;

}

function CreateEncashmentIfNotExist(visit) {//, textValue) {
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
    //query.Text = "select single(*) from Document.Encashment_EncashmentDocuments where Ref == @docRef && DocumentName == @docName";
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
    var receivables = new Query("SELECT RD.DocumentName, RD.DocumentSum FROM Document_AccountReceivable_ReceivableDocuments RD JOIN Document_AccountReceivable AR ON AR.Id=RD.Ref WHERE AR.Outlet = @outlet ORDER BY RD.LineNumber");
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
            encRowObj.EncashmentSum = d.DocumentSum;
            sumToSpread = sumToSpread - d.DocumentSum;
        }
        else {
            encRowObj.EncashmentSum = sumToSpread;
            sumToSpread = Converter.ToDecimal(0);
        }
        encRowObj.Save();
    }
    Workflow.Refresh([]);
}

function SaveAndForward(encashment) {
	ClearEmptyRecDocs(encashment);
	if (parseInt(encashment.EncashmentAmount)!=parseInt(0))
		encashment.GetObject().Save();
	else
		DB.Delete(encashment);
	Workflow.Forward([]);
}

function ClearEmptyRecDocs(encashment){
	var q = new Query("SELECT Id, EncashmentSum FROM Document_Encashment_EncashmentDocuments WHERE Ref=@ref AND EncashmentSum = 0");
	q.AddParameter("ref", encashment);
	var rows = q.Execute();
	while (rows.Next()){
		DB.Delete(rows.Id);
	}
}
