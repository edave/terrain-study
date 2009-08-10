var map;
var startPoint = new GLatLng(startEndArray[locationSelect][0][0], startEndArray[locationSelect][0][1]);
var endPoint = new GLatLng(startEndArray[locationSelect][1][0], startEndArray[locationSelect][1][1]);
var startIcon = new GIcon(null, '/images/campground.png');
var endIcon = new GIcon(null, '/images/flag.png');
startIcon.iconSize = new GSize(32, 32);
startIcon.iconAnchor = new GPoint(16, 24);
endIcon.iconSize = new GSize(32, 32);
endIcon.iconAnchor = new GPoint(12, 30);
var startMarker = new GMarker(startPoint, startIcon, true);
var endMarker = new GMarker(endPoint, endIcon, true);
var midPointIcon = new GIcon(null, '/images/midpoint.png');
var midPointIconSelected = new GIcon(null, '/images/midpoint-select.png');

var routeLine =new GPolyline([
    startPoint,
	endPoint
], "#901D0A", 10, 0.65);

var routeMarkers = [startMarker, endMarker];
var routeLineLocations =[startPoint, endPoint];

function initialize() {
  if (GBrowserIsCompatible()) {
	google.load("jquery", "1.3.2");
	map = new GMap2(document.getElementById("content"));
	map.addMapType(G_PHYSICAL_MAP);
	map.setMapType(G_PHYSICAL_MAP);
	map.addControl(new GLargeMapControl());
	map.enableScrollWheelZoom();
	//routeLine.enableEditing();
	
	midPointIcon.iconSize = new GSize(16, 16);
	midPointIcon.iconAnchor = new GPoint(8, 8);
	midPointIconSelected.iconSize = new GSize(16, 16);
	midPointIconSelected.iconAnchor = new GPoint(8, 8);
	
	var midPointLoc = GetMidPoint(startPoint,endPoint);
	map.setCenter(midPointLoc, 13);
	
    map.addOverlay(startMarker);
	map.addOverlay(endMarker);
	map.addOverlay(routeLine);
	AddWayPoint(midPointLoc, 1);
	FinishInit();
  }
}

function GetExperimentID(){
	return 1;
}

function AddWayPoint(location, index){
	var newMarker = new GMarker(location, {draggable:true});
	routeMarkers.splice(index, 0, newMarker);
	GEvent.addListener(newMarker, "dragend", MarkerDragEnd);
	GEvent.addListener(newMarker, "dragstart", MarkerDragStart);
	GEvent.addListener(newMarker, "mousedown", MarkerPrepInfoWindow);
	routeLine.insertVertex(index, location);
	map.addOverlay(newMarker);
	AddMidPoint(GetMidPoint(location, routeMarkers[index-1].getLatLng()), index);
	AddMidPoint(GetMidPoint(location, routeMarkers[index+2].getLatLng()), index+2);
	PublishWayPoints();
}

function MarkerPrepInfoWindow(){
	this.bindInfoWindowHtml(GetInfoWindowString(this));
}

function DeleteWayPoint(index){
	map.removeOverlay(routeMarkers[index]);
	map.removeOverlay(routeMarkers[index-1]);
	routeMarkers.remove(index);
	routeLine.deleteVertex(index);

	routeMarkers.remove(index-1);
	routeLine.deleteVertex(index-1);
	//console.debug("RouteMarker Length:" + (routeMarkers.length-1));
	//console.debug("Upper MidPoint:" + (index));
	var newMidPointLocation = GetMidPoint(routeMarkers[index-2].getLatLng(), 
								 routeMarkers[index].getLatLng());
	routeMarkers[index-1].setLatLng(newMidPointLocation);
	routeLine.deleteVertex(index-1);
	routeLine.insertVertex(index-1, newMidPointLocation);
	PublishWayPoints();
}

function AddMidPoint(location, index){
	var newMarker = new GMarker(location, {draggable:true, icon:midPointIcon});
	GEvent.addListener(newMarker, "dragstart", MidPointDragStart);
	GEvent.addListener(newMarker, "dragend", MidPointDragEnd);
	routeMarkers.splice(index, 0, newMarker);
	routeLine.insertVertex(index, location);
	map.addOverlay(newMarker);
}

function GetMidPoint(location1, location2){
	return new GLatLng((location1.lat()+location2.lat())/2,(location1.lng()+location2.lng())/2);
}

function MidPointDragStart(){
	map.closeInfoWindow();
	this.setImage('images/midpoint-select.png');
}

function MidPointDragEnd(){
	var location = this.getLatLng();
	var index = FindMarkerIndex(this);
	map.removeOverlay(this);
	routeMarkers.remove(index);
	routeLine.deleteVertex(index);
	AddWayPoint(location, index);
}

function MarkerDragStart(){
	map.closeInfoWindow();
}

function MarkerDragEnd(){
	var location = this.getLatLng();
	var index = FindMarkerIndex(this);
	routeLine.deleteVertex(index);
	routeLine.insertVertex(index, location);
	//console.debug("RouteMarker Length:" + (routeMarkers.length-1));
	//console.debug("Lower MidPoint:" + (index - 1));
	var lowerMidPointLocation = GetMidPoint(location, routeMarkers[index-2].getLatLng());	
	routeLine.deleteVertex(index-1);
	routeLine.insertVertex(index-1, lowerMidPointLocation);
	routeMarkers[index-1].setLatLng(lowerMidPointLocation);	
	//console.debug("Upper MidPoint:" + (index + 1));
	var upperMidPointLocation = GetMidPoint(location, routeMarkers[index+2].getLatLng());
	routeLine.deleteVertex(index+1);
	routeLine.insertVertex(index+1, upperMidPointLocation);
	routeMarkers[index+1].setLatLng(upperMidPointLocation);
	PublishWayPoints();	
}

function FindMarkerIndex(marker){
	var index = -1;
	for(var i=0; i<routeMarkers.length; i++){
		if(marker === routeMarkers[i]){
			index = i;
			break;
		}
	}
	return index;
}

function GetLat(marker){
	return marker.getLatLng().lat();
}

function GetLng(marker){
	return marker.getLatLng().lng();
}

function PublishWayPoints(){
	UpdateNumberOfWaypoints();
    /*
	var waypointList = $('#waypoint-list');
	waypointList.empty();
	var everyOther = true;
	for(var i=0; i<routeMarkers.length; i++){
		if(everyOther){
			waypointList.append("<div>"+routeMarkers[i].getLatLng()+"</div><br/>");
		}
		everyOther = everyOther ? false : true;
	}
	everyOther = true;
	var distance = 0;
	for(var i=1; i<routeMarkers.length; i++){
		if(everyOther){
			distance += routeMarkers[i].getLatLng().distanceFrom(routeMarkers[i-1].getLatLng());
		}
		everyOther = everyOther ? false : true;
	}
	waypointList.append("<div><b>Distance:</b> "+distance.toFixed(2)+"m</b></div>");
	*/
}


