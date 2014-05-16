// ------------------------ Main screen module ------------------------

function CloseMenu() {
    var sl = Variables["swipe_layout"];
    if (sl.Index == 1) {
        sl.Index = 0;
    }
    else if (sl.Index == 0) {
        sl.Index = 1;
    }
}

function OpenMenu() {
    var sl = Variables["swipe_layout"];
    if (sl.Index == 1) {
        sl.Index = 0;
    }
    else if (sl.Index == 0) {
        sl.Index = 1;
    }
}

function Fake() {

}

function MakeSnapshot() {
    GetCameraObject();
    Camera.MakeSnapshot();
}

function GetCameraObject() {
    FileSystem.CreateDirectory("/private/Document.Visit");
    Camera.Size = 300;
    Camera.Path = "/private/Document.Visit/1.jpg";
}