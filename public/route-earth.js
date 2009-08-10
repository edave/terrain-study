var ge;
var dragInfo = null;
var waypointStyle;
var midPointStyle;
var routeLine;
var startMarker;
var endMarker;

var routeMarkers;
var midPointMarkers = [];
var routeLineLocations = [];


function init() {
    document.getElementById('content').innerHTML = '';

    google.earth.createInstance('content', initCB, failureCB);
}

function initCB(instance) {
    ge = instance;
    ge.getWindow().setVisibility(true);


    // add a navigation control
    ge.getNavigationControl().setVisibility(ge.VISIBILITY_AUTO);

    // add some layers
    ge.getLayerRoot().enableLayerById(ge.LAYER_BORDERS, true);
    ge.getLayerRoot().enableLayerById(ge.LAYER_ROADS, true);

    var icon = ge.createIcon('');
    icon.setHref('http://maps.google.com/mapfiles/kml/paddle/red-circle.png');
    waypointStyle = ge.createStyle('');
    waypointStyle.getIconStyle().setIcon(icon);
    waypointStyle.getIconStyle().getHotSpot().set(0.5, ge.UNITS_FRACTION,
    0, ge.UNITS_FRACTION);
    
     var startIcon = ge.createIcon('');
    startIcon.setHref('http://terrain-study.hci4.me/images/campground.png');
    var startStyle = ge.createStyle('');
    startStyle.getIconStyle().setIcon(startIcon);
    startStyle.getIconStyle().getHotSpot().set(0.5, ge.UNITS_FRACTION,
    0, ge.UNITS_FRACTION);
    
    var endIcon = ge.createIcon('');
    endIcon.setHref('http://terrain-study.hci4.me/images/flag.png');
    var endStyle = ge.createStyle('');
    endStyle.getIconStyle().setIcon(endIcon);
    endStyle.getIconStyle().getHotSpot().set(0.5, ge.UNITS_FRACTION,
    0, ge.UNITS_FRACTION);

    var midPointIcon = ge.createIcon('newicon');
    midPointIcon.setHref('http://terrain-study.hci4.me/images/midpoint-large.png');
    midPointStyle = ge.createStyle('newstyle');
    midPointStyle.getIconStyle().setIcon(midPointIcon);
    midPointStyle.getIconStyle().setScale(0.5);

    var startPoint = ge.createPoint('');
    startPoint.setLatitude(startEndArray[locationSelect][0][0]);
    startPoint.setLongitude(startEndArray[locationSelect][0][1]);
    startMarker = ge.createPlacemark('');
    startMarker.setStyleSelector(startStyle);
    startMarker.setGeometry(startPoint);
    ge.getFeatures().appendChild(startMarker);

    var endPoint = ge.createPoint('');
    endPoint.setLatitude(startEndArray[locationSelect][1][0]);
    endPoint.setLongitude(startEndArray[locationSelect][1][1]);
    endMarker = ge.createPlacemark('');
    endMarker.setStyleSelector(endStyle);
    endMarker.setGeometry(endPoint);
    ge.getFeatures().appendChild(endMarker);

    lineStringPlacemark = ge.createPlacemark('');
    routeLine = ge.createLineString('');
    lineStringPlacemark.setGeometry(routeLine);
    routeLine.setTessellate(true);
    ge.getFeatures().appendChild(lineStringPlacemark);
    lineStringPlacemark.setStyleSelector(ge.createStyle(''));

    // The Style of a Feature is retrieved as feature.getStyleSelector().
    // The Style itself contains a LineStyle, which is what we manipulate
    // to change the color and width of the line.
    var lineStyle = lineStringPlacemark.getStyleSelector().getLineStyle();
    lineStyle.setWidth(10);
    lineStyle.getColor().set('BE0A1D90');

    /*
	var styleMap = ge.createStyleMap('midPointStyleMap');
	
	var midPointIcon = ge.createIcon('');
  	midPointIcon.setHref('images/midpoint.png');
    var midPointStyle = ge.createStyle('styleMidPointIcon');
  	midPointStyle.getIconStyle().setIcon(midPointIcon);
	var highlight = ge.createIcon('');
	  highlight.setHref('images/midpoint.png');
	  iconHighlight = ge.createStyle('styleIconHighlight');
	  iconHighlight.getIconStyle().setIcon(highlight);
	

	styleMap.setHighlightStyleUrl('#styleIconHighlight');
	styleMap.setNormalStyleUrl('#styleMidPointIcon');
*/
    //routeLine.getCoordinates().push(startPoint.getLatitude(), startPoint.ge);
    //routeLine.getCoordinates().push(endPoint);
    routeMarkers = [startMarker, endMarker];
    InsertIntoLineLocations(startPoint, 0);
    InsertIntoLineLocations(endPoint, 1);

    var midPoint = GetMidPoint(startPoint, endPoint);

    AddWayPoint(midPoint, 1);


    // look at the placemark we created
    var la = ge.createLookAt('');
    la.set(midPoint.getLatitude(),midPoint.getLongitude(),
    300,
    // altitude
    ge.ALTITUDE_RELATIVE_TO_GROUND,
    0,
    // heading
    45,
    // straight-down tilt
    800
    // range (inverse of zoom)
    );
    ge.getView().setAbstractView(la);
    // listen for mousedown on the window (look specifically for point placemarks)
    google.earth.addEventListener(ge.getWindow(), 'mousedown',
    function(event) {
        var target = event.getTarget();
        if (target.getType() == 'KmlPlacemark' &&
        target.getGeometry().getType() == 'KmlPoint'
        && target != endMarker
        && target != startMarker) {
            //event.preventDefault();
            var placemark = event.getTarget();
			ge.setBalloon(null);
            dragInfo = {
                placemark: event.getTarget(),
                dragged: false
            };
        }
    });

    // listen for mousemove on the globe
    google.earth.addEventListener(ge.getGlobe(), 'mousemove',
    function(event) {
        if (dragInfo) {
            event.preventDefault();
            var point = dragInfo.placemark.getGeometry();
            point.setLatitude(event.getLatitude());
            point.setLongitude(event.getLongitude());
            dragInfo.dragged = true;
        }
    });

    // listen for mouseup on the window
    google.earth.addEventListener(ge.getWindow(), 'mouseup',
    function(event) {
        if (dragInfo) {
            //window.console.log('there is drag info');
            if (dragInfo.dragged) {
                //window.console.log('and its being dragged');
                // if the placemark was dragged, prevent balloons from popping up
                event.preventDefault();
                var marker = dragInfo.placemark;
                var location = marker.getGeometry();
                var index = FindMarkerIndex(marker);
                
                var midPointIndex = FindMidpointIndex(marker);
				routeLineLocations.remove(index);
                if (midPointIndex > -1) {
                    
					//window.console.log("MidPoint");
                    routeMarkers.remove(index);
                    midPointMarkers.remove(midPointIndex);
                    AddWayPoint(location, index);
                } else {
                    //window.console.log("Marker");
					InsertIntoLineLocations(location, index);
					var lowerGeometry = routeMarkers[index - 2].getGeometry();
                    
				    var lowerMidPointLocation = GetMidPoint(location, lowerGeometry);
				   
                    routeLineLocations.remove(index - 1);
				    
                    InsertIntoLineLocations(lowerMidPointLocation, index - 1);
                    
				    routeMarkers[index - 1].setGeometry(lowerMidPointLocation);
				    
				    var upperMidPointLocation = GetMidPoint(location, routeMarkers[index + 2].getGeometry());
				    routeLineLocations.remove(index + 1);
				    InsertIntoLineLocations(upperMidPointLocation, index + 1);
				    routeMarkers[index + 1].setGeometry(upperMidPointLocation);
				    
					RebuildLine();
                }
            } else {
                event.preventDefault();
                var marker = event.getTarget();
                //console.log("Click!");
                if (FindMidpointIndex(marker) < 0) {
                    //console.log("Marker!");
                    var balloon = ge.createHtmlStringBalloon('');
                    balloon.setFeature(marker);
                    balloon.setContentString(GetInfoWindowString(marker));
                    balloon.setMaxWidth(300);
                    ge.setBalloon(balloon);
                }
            }
			//console.info("Setting null");
            dragInfo = null;
        }
    });
	FinishInit();
}

function failureCB(errorCode) {
    }

function AddWayPoint(location, index) {
    var newMarker = ge.createPlacemark('');
    newMarker.setStyleSelector(waypointStyle);
    newMarker.setGeometry(location);
    ge.getFeatures().appendChild(newMarker);
    routeMarkers.splice(index, 0, newMarker);
    InsertIntoLineLocations(location, index);
    //routeLine.insertVertex(index, location);
    //map.addOverlay(newMarker);
    AddMidPoint(GetMidPoint(location, routeMarkers[index - 1].getGeometry()), index);
    AddMidPoint(GetMidPoint(location, routeMarkers[index + 2].getGeometry()), index + 2);
    RebuildLine();
    UpdateNumberOfWaypoints();
}
function DeleteWayPoint(index){
	ge.getFeatures().removeChild(routeMarkers[index]);
	var lowerMidPoint = routeMarkers[index-1];
	ge.getFeatures().removeChild(lowerMidPoint);
	midPointMarkers.remove(FindMidpointIndex(lowerMidPoint));
	routeMarkers.remove(index);
	routeMarkers.remove(index-1);
	routeLineLocations.remove(index);
	routeLineLocations.remove(index-1);
	var newMidPointLocation = GetMidPoint(routeMarkers[index-2].getGeometry(), 
								 routeMarkers[index].getGeometry());
	routeMarkers[index-1].setGeometry(newMidPointLocation);
	routeLineLocations.remove(index-1);
	InsertIntoLineLocations(newMidPointLocation, index-1);
	RebuildLine();
	ge.setBalloon(null);
	UpdateNumberOfWaypoints();
}
function GetMidPoint(location1, location2) {
    var location = ge.createPoint('');
    location.setLatLng((location1.getLatitude() + location2.getLatitude()) / 2, (location1.getLongitude() + location2.getLongitude()) / 2);
    return location;
}

function GetExperimentID(){
	return 2;
}

function AddMidPoint(location, index) {
    //var newMarker = new GMarker(location, {draggable:true, icon:midPointIcon});
    var newMarker = ge.createPlacemark('');
    newMarker.setStyleSelector(midPointStyle);
    newMarker.setGeometry(location);
    ge.getFeatures().appendChild(newMarker);
    routeMarkers.splice(index, 0, newMarker);
    midPointMarkers.push(newMarker);
    InsertIntoLineLocations(location, index);
}

function MarkerDragEnd(marker, location, index) {
    //var index = FindMarkerIndex(marker);
	//console.info("Marker Drag End");
    
    //PublishWayPoints();	
}

function RebuildLine() {
    var lineCoords = routeLine.getCoordinates();
    lineCoords.clear();
    for (var i = 0; i < routeLineLocations.length; i++) {
        var location = routeLineLocations[i];
        lineCoords.pushLatLngAlt(location[0].getLatitude(), location[0].getLongitude(), location[1]);
    }
}
function FindMarkerIndex(marker) {
    var index = -1;
    var geometryM = marker.getGeometry();
    for (var i = 0; i < routeMarkers.length; i++) {
        var newMarker = routeMarkers[i];
        if (marker === newMarker) {
            index = i;
            break;
        }else{
           var newGeometry = newMarker.getGeometry();
           if(newGeometry.getLatitude() == geometryM.getLatitude() &&
              newGeometry.getLongitude() == geometryM.getLongitude()){
              index = i;
              break;
           }
        }
    }
    return index;
}

function FindMidpointIndex(marker) {
    var index = -1;
    var geometryM = marker.getGeometry();
    for (var i = 0; i < midPointMarkers.length; i++) {
        var newMarker = midPointMarkers[i];
        if (marker == newMarker) {
            index = i;
            break;
        }else{
           var newGeometry = newMarker.getGeometry();
           if(newGeometry.getLatitude() == geometryM.getLatitude() &&
              newGeometry.getLongitude() == geometryM.getLongitude()){
              index = i;
              break;
           }
        }
    }
    return index;
}

function InsertIntoLineLocations(location, index) {
    var altitude = ge.getGlobe().getGroundAltitude(location.getLatitude(), location.getLongitude());
    routeLineLocations.splice(index, 0, [location, altitude]);
}

function GetLat(marker){
	return marker.getGeometry().getLatitude();
}

function GetLng(marker){
	return marker.getGeometry().getLongitude();
}


google.setOnLoadCallback(init);