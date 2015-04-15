function AddSnapshot(objectRef, valueRef, func, listChoice, objectType) {
//	if ($.sessionConst.galleryChoose)
		Dialog.Choose(Translate["#choose_action#"], listChoice, AddSnapshotHandler, [objectRef,func,valueRef,objectType]);
//	else{
//		var pictId = GetCameraObject(objectRef);
//		var path = GetPrivateImagePath("catalog.outlet", objectRef, pictId, ".jpg");
//		Camera.MakeSnapshot(path, 300, func, [ objectRef, pictId ]);
//	}		
}

function AddSnapshotHandler(state, args) {	
	var objRef = state[0];
	var func = state[1];
	var valueRef = state[2];
	var objectType = state[3];
	
	if (parseInt(args.Result)==parseInt(0)){	
		var pictId = GenerateGuid();				
		var path = GetPrivateImagePath(objectType, objRef, pictId, ".jpg");
		Gallery.Size = 300;
		Gallery.Copy(path, func, [objRef, pictId]);					
	}
	
	if (parseInt(args.Result)==parseInt(1)){
		MakeSnapshot(objRef, objectType, func);
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
	var sh = GetSharedImagePath(null, objectID, pictID, pictExt)
	if (FileSystem.Exists(sh))
		return sh;
	else
		return GetPrivateImagePath(null, objectID, pictID, pictExt);
}

function GetSharedImagePath(objectType, objectID, pictID, pictExt) {
	if (String.IsNullOrEmpty(objectType)){
		objectType = GetParentFolderName(objectID);
	}
	var r = "/shared/" + objectType + "/" + objectID.Id.ToString() + "/"
    + pictID + pictExt;
	return r;
}

function GetPrivateImagePath(objectType, objectID, pictID, pictExt) {
	if (String.IsNullOrEmpty(objectType)){
		objectType = GetParentFolderName(objectID);
	}
	var r = "/private/" + objectType + "/" + objectID.Id.ToString() + "/"
    + pictID + pictExt;
	return r;
}

function GetParentFolderName(objectID) {
	var folder;
	
	if (getType(objectID.Ref) == "System.String")
		folder = objectID.Metadata().TableName;
	else{
		folder = objectID.Ref.Metadata().TableName;
	}
	folder = StrReplace(folder, "_", ".");
	
	return folder;
}

function MakeSnapshot(objRef, objectType, func) {
	var pictId = GetCameraObject(objRef);
	var path = GetPrivateImagePath(objectType, objRef, pictId, ".jpg");
	Camera.MakeSnapshot(path, 300, func, [ objRef, pictId, path]);
}

function GetCameraObject(entity) {
	FileSystem.CreateDirectory("/private/catalog.outlet");
	var guid = Global.GenerateGuid();
	var path = String.Format("/private/catalog.outlet/{0}/{1}.jpg", entity.Id, guid);
	Camera.Size = 300;
	Camera.Path = path;
	return guid;
}

function GenerateGuid() {

    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}

function S4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
}
