var startEndArray = [[  [39.37597583605188, -106.81869506835938],
                        [39.29126562559484, -106.91482543945312]],
					 [[39.99977484688673, -105.6399393081665],
					  [40.18700444478755, -105.6859016418457]],
					 [[38.003737861469666, -105.48316955566406],
					  [37.933366792504366, -105.65208435058594]]
                      
					];
var locationSelect = locationID;
// Array Remove - By John Resig (MIT Licensed)
Array.prototype.remove = function(from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};

var host = "localhost:3011";

var subjectID = -1;

function FinishInit(){
	$("#finished").bind('click', CheckAndSubmit);
	StartStopwatch();
}

function StartStopwatch(){
	jQuery(function(){ 
	            // We define the clock...   
	            jQuery('#time').text('Time: ');
				jQuery('#time').epiclock({mode: EC_STOPWATCH, format:'i{m} s{s}'});       
	            // Then start the manager. 
	            jQuery.epiclock(EC_RUN); 
	 });	
}

function UpdateNumberOfWaypoints(){
	var size = routeMarkers.length - 2;
	size = Math.floor(size/2);
	jQuery('#num-waypoints').text(size + ((size > 1) ? " Waypoints" : " Waypoint"));
}

function WaypointsJSON(){
	var everyOther = true;
	var waypoints = [];
	var waypoint;
	var lat;
	var lng;
	for(var i=0; i<routeMarkers.length; i++){
		if(everyOther){
			waypoint = routeMarkers[i];
			lat = GetLat(waypoint);
			lng = GetLng(waypoint);
			waypoints.push([lat, GetLng(waypoint)]);
		}
		everyOther = !everyOther;
	}
	return $.toJSON(waypoints);
}

function CheckAndSubmit(target){
	//console.log("I'm finished!");
	var button = jQuery('#finished');
	button.html("Please Wait...");
	button.css('cursor', 'default');
	button.unbind('click', CheckAndSubmit);
	
	var msTime = HaltStopwatch();
	var numWaypoints = routeMarkers.length - 2;
	numWaypoints = Math.floor(numWaypoints/2);
	var waypointsJSON = WaypointsJSON();
	var experimentType = GetExperimentID();
	//console.log(experimentType);
	$.post("experiments", { 'experiment[time]': msTime, 
									'experiment[num_waypoints]': numWaypoints,
									'experiment[waypoints_json]': waypointsJSON },
	  SubmitComplete, "xml");
	
	SubmitComplete();
}

function SubmitComplete(data){
	jQuery('#next-step').fadeIn("slow");
	
}

function HaltStopwatch(){
	jQuery.epiclock(EC_HALT);
	var clock = jQuery('#time').data('epiClock');
	
	return clock.displace + new Date().valueOf();
}

function GetInfoWindowString(marker){
	var index = FindMarkerIndex(marker);
	var humanIndex = Math.floor(index/2);
	var htmlString = "<div class='delete-balloon' ><h3>#"+humanIndex+"</h3><img src='/images/delete-gray.png'><span style='color:#777'>Can not delete this waypoint</span></div>";
	if(routeMarkers.length > 5){
		htmlString = "<div class='delete-balloon' ><h3>#"+humanIndex+"</h3><a href=\"javascript:;\" onClick=\"DeleteWayPoint("+ index +")\" ><img src='/images/delete.png' />Delete Me</a></div>";
	}
	return htmlString;
}