function AddSnapshot(objectRef, valueRef, func, listChoice, title) {
	title = String.IsNullOrEmpty(title) ? Translate["#snapshot#"] : title; 
	Dialog.Choose(title, listChoice, AddSnapshotHandler, [objectRef,func,valueRef]);	
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
		if (valueRef.IsNew()){
			DB.Delete(valueRef);
			Workflow.Refresh([]);
		}
		else{
			var value = valueRef.GetObject();
			value.Value = "";
			value.Save();
			Workflow.Refresh([]);
		}
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
	Gallery.Size = 300;
	Gallery.Copy(path, func, [objRef, pictId, path]);	
}

function MakeSnapshot(objRef, func) {
	FileSystem.CreateDirectory(String.Format("/private/{0}", GetParentFolderName(objRef)));

	var pictId = Global.GenerateGuid();
	var path = GetPrivateImagePath(objRef, pictId, ".jpg");
	Camera.Size = 300;
	Camera.Path = path;
	Camera.MakeSnapshot(path, 300, func, [ objRef, pictId, path]);
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

