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
	
	
    map.addOverlay(startMarker);
	map.addOverlay(endMarker);
	map.addOverlay(routeLine);
	for(var i=0; i<experimentMarkers.length; i++){
        AddWayPoint(new GLatLng(experimentMarkers[i][0], experimentMarkers[i][1]), i+1);
	}
    var mid = Math.floor(experimentMarkers.length/2);
    map.setCenter(startPoint, 13);
	
    //FinishInit();
  }
}

function GetExperimentID(){
	return 1;
}

function AddWayPoint(location, index){
	var newMarker = new GMarker(location);
	routeMarkers.splice(index, 0, newMarker);
	routeLine.insertVertex(index, location);
	map.addOverlay(newMarker);
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
    
	var waypointList = $('#waypoint-list');
    waypointList.empty();
	
	/*
    var everyOther = true;
	for(var i=0; i<routeMarkers.length; i++){
		if(everyOther){
			waypointList.append("<div>"+routeMarkers[i].getLatLng()+"</div><br/>");
		}
		everyOther = everyOther ? false : true;
	}
	everyOther = true;
	*/
	var distance = 0;
	for(var i=1; i<routeMarkers.length; i++){
		distance += routeMarkers[i].getLatLng().distanceFrom(routeMarkers[i-1].getLatLng());
	}
	waypointList.text(+distance.toFixed(2)+"m");
	
}


