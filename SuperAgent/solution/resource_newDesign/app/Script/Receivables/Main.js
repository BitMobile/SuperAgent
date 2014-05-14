
function GetReceivables(outlet) {

    var receivables = new Query("SELECT RD.DocumentName, RD.DocumentSum FROM Document_AccountReceivable_ReceivableDocuments RD JOIN Document_AccountReceivable AR ON AR.Id=RD.Ref WHERE AR.Outlet = @outlet ORDER BY RD.LineNumber");
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
            Dialog.Debug(d.DocumentSum);
            encRowObj.EncashmentSum = d.DocumentSum;
            sumToSpread = sumToSpread - d.DocumentSum;
        }
        else {
            Dialog.Debug(sumToSpread);
            encRowObj.EncashmentSum = sumToSpread;
            sumToSpread = Converter.ToDecimal(0);
        }
        encRowObj.Save();
        Dialog.Debug(encRowObj);
    }
    Workflow.Refresh([]);
}

function SaveAndForward(encashment) {
    encashment.GetObject().Save();
    Workflow.Forward([]);
}