var parameters;

function AddSnapshot(objectRef, valueRef, func, title, path) { // optional: title, path
	SetParameters();
	title = String.IsNullOrEmpty(title) ? Translate["#snapshot#"] : title;

	var isEmpty = true;
	if (String.IsNullOrEmpty(valueRef)==false){ //if not empty value
		if (String.IsNullOrEmpty(valueRef[parameters[valueRef.Metadata().TableName]])==false)
			isEmpty = false;
	}

	if (isEmpty && !$.sessionConst.galleryChoose)
		MakeSnapshot(objectRef, func);
	else{
		var listChoice = new List;
		if ($.sessionConst.galleryChoose) //if Gallery is allowed
			listChoice.Add([0, Translate["#addFromGallery#"]]);
		listChoice.Add([1, Translate["#makeSnapshot#"]]);
		if (String.IsNullOrEmpty(path)==false) //if not an Image.xml screen
			listChoice.Add([3, Translate["#show#"]]);
		if (!isEmpty)
			listChoice.Add([2, Translate["#clearValue#"]]);


		Dialog.Choose(title, listChoice, AddSnapshotHandler, [objectRef,func,valueRef, path]);
	}
}

function AddSnapshotHandler(state, args) {
	var objRef = state[0];
	var func = state[1];
	var valueRef = state[2];

	if (parseInt(args.Result)==parseInt(0)){
		ChooseFromGallery(objRef, func);
	}

	if (parseInt(args.Result)==parseInt(1)){
		MakeSnapshot(objRef, func);
	}

	if (parseInt(args.Result)==parseInt(2)){
		DeleteImage(valueRef);
	}

	if (parseInt(args.Result)==parseInt(3)){
		var path = state[3];
		var attr = parameters[valueRef.Metadata().TableName];
		Workflow.Action("ShowImage", [path, valueRef, attr]);
	}
}

function FindImage(objectID, pictID, pictExt) {
	var sh = GetSharedImagePath(objectID, pictID, pictExt)
	if (FileSystem.Exists(sh))
		return sh;
	else
		return GetPrivateImagePath(objectID, pictID, pictExt);
}


function ChooseFromGallery(objRef, func) {
	FileSystem.CreateDirectory(String.Format("/private/{0}", GetParentFolderName(objRef)));

	var pictId = Global.GenerateGuid();
	var path = GetPrivateImagePath(objRef, pictId, ".jpg");
	Gallery.Size = $.sessionConst["SnapshotSize"];
	Gallery.Copy(path, func, [objRef, pictId, path]);
}

function MakeSnapshot(objRef, func) {
	FileSystem.CreateDirectory(String.Format("/private/{0}", GetParentFolderName(objRef)));

	var pictId = Global.GenerateGuid();
	var path = GetPrivateImagePath(objRef, pictId, ".jpg");
	Camera.Size = $.sessionConst["SnapshotSize"];
	Camera.Path = path;
	Camera.MakeSnapshot(path, $.sessionConst["SnapshotSize"], func, [ objRef, pictId, path]);
}

function DeleteImage(valueRef) {
	if (valueRef.IsNew()){
		DB.Delete(valueRef);
		Workflow.Refresh([]);
	}
	else{
		var value = valueRef.GetObject();
		value[valueRef.Metadata().TableName] = "";

		if (valueRef.Metadata().TableName == "Catalog_Outlet_Snapshots")
			value.Deleted = true;

		value.Save();
		Workflow.Refresh([]);
	}
}

function GetSharedImagePath(objectID, pictID, pictExt) {
	var objectType = GetParentFolderName(objectID);
	var r = "/shared/" + objectType + "/" + objectID.Id.ToString() + "/"
    + pictID + pictExt;
	return r;
}

function GetPrivateImagePath(objectID, pictID, pictExt) {
	var objectType = GetParentFolderName(objectID);
	var r = "/private/" + objectType + "/" + objectID.Id.ToString() + "/"
    + pictID + pictExt;
	return r;
}

function GetParentFolderName(entityRef) {
	var folder;

	if (getType(entityRef.Ref) == "System.String")
		folder = entityRef.Metadata().TableName;
	else{
		folder = entityRef.Ref.Metadata().TableName;
	}
	folder = StrReplace(folder, "_", ".");

	return folder;
}

function SetParameters() {
	parameters = new Dictionary();
	parameters.Add("Catalog_Outlet_Parameters", "Value");
	parameters.Add("Catalog_Outlet_Snapshots", "FileName");
}
