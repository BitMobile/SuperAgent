function OnLoad() {
	if ($.Exists("map"))
		$.map.AddMarker("", $.outlet.Lattitude, $.outlet.Longitude, "blue");
}

function HasCoordinates(outlet) {
	if (outlet == null) {
		return false;
	}
	if (!isDefault(outlet.Lattitude) && !isDefault(outlet.Longitude)) {
		return true;
	}
	return false;
}