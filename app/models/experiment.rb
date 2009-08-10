require 'json/add/rails'
require 'pp'
require "rexml/document"
include REXML

class Experiment < ActiveRecord::Base
  
  validates_presence_of :subject_id, :time, :factor_id, :waypoints_json, :num_waypoints
  validates_numericality_of :subject_id, :time, :factor_id, :num_waypoints
  belongs_to :factor
  belongs_to :subject
  
  after_create do |experiment|
    factor = Factor.find(experiment.factor_id)
    factor.count = factor.count + 1
    factor.save!
  end
  
  def raw_waypoints
    waypoints = JSON.parse(self.waypoints_json)
    return waypoints
    
  end
  
  def waypoints
    waypoints = JSON.parse(self.waypoints_json)
    for waypoint in waypoints do
      waypoint[2] = get_elevation(waypoint[0],waypoint[1])
    end
    @waypoints = waypoints
    self.processed_waypoints = JSON.generate(waypoints)
    self.save!
    return waypoints
  end
  
  def load_processed_waypoints
    if self.processed_waypoints.nil?
      self.waypoints 
    else
     @waypoints = JSON.parse(self.processed_waypoints)
   end
   return @waypoints
  end
  
  # 0.0001 = 10m
  #[39.99977484688673, -105.6399393081665], [40.00528335571289,
  
  def distance
    distance = 0
    distance_2d = 0
    elev_change = 0
    num_waypoints = 0
    if @waypoints.nil? then self.load_processed_waypoints end
    ext_waypoints =  self.extrapolated_waypoints()
    for waypoint in ext_waypoints do
      if waypoint.length < 3
        waypoint[2] = get_elevation(waypoint[0],waypoint[1])
      end
    end
    for i in 1..ext_waypoints.length-1
      waypointA = ext_waypoints[i-1]
      waypointB = ext_waypoints[i]
      #num_waypoints += 1 + sub_waypoints(waypointA, waypointB)
      elevation_diff = (waypointB[2]-waypointA[2])
      distance_flat = waypoint_distance(waypointA, waypointB)
      distance_3d = Math.sqrt(distance_flat**2 + elevation_diff**2)
      #pp [distance_3d, elevation_diff, distance_flat]
      distance += distance_3d
      distance_2d += distance_flat
      elev_change += elevation_diff.abs
    end
    return [distance, elev_change, distance_2d]
    
  end
  
  def extrapolated_waypoints
    ext_waypoints = []
    waypoints = JSON.parse(self.waypoints_json)
    for waypoint in waypoints do
      waypoint[2] = get_elevation(waypoint[0],waypoint[1])
    end
    for i in 1..waypoints.length-1
      waypointA = waypoints[i-1]
      waypointB = waypoints[i]
      ext_waypoints << waypointA
      num_sub_waypoints = sub_waypoints(waypointA, waypointB)
      sub_waypoints = []
      for i in 1..num_sub_waypoints
        sub_waypoints << get_sub_waypoint(waypointA, waypointB, i, num_sub_waypoints)
      end
      ext_waypoints.concat(sub_waypoints)
    end
    ext_waypoints << waypoints.last
    #self.processed_waypoints = JSON.generate(ext_waypoints)
    #self.save!
    return ext_waypoints
  end
  
  def sub_waypoints(waypointA, waypointB)
    lat_diff = (waypointA[0]-waypointB[0]).abs
    lng_diff = (waypointA[1]-waypointB[1]).abs
    num_waypoints = [lat_diff, lng_diff].max
    return (num_waypoints / 0.001).floor
  end
  
  def get_sub_waypoint(waypointA, waypointB, i, num_subs)
    lat_diff = (waypointB[0]-waypointA[0])
    lng_diff = (waypointB[1]-waypointA[1])
    fraction = (i.to_f/num_subs.to_f)
    lat_inc =fraction *lat_diff
    lng_inc = fraction*lng_diff
    return [lat_inc+waypointA[0], lng_inc+waypointA[1]]
  end
  
  def waypoint_distance(waypointA, waypointB)
    if waypointA[0] == waypointB[0] && waypointA[1] == waypointB[1]
      return 0
    end
    distance = Math.acos(Math.sin(waypointA[0]/57.2958)*Math.sin(waypointB[0]/57.2958) + 
                  Math.cos(waypointA[0]/57.2958)*Math.cos(waypointB[0]/57.2958) *
                  Math.cos(waypointB[1]/57.2958-waypointA[1]/57.2958)) * 6371.7
    return distance * 1000
  end
  
  def to_csv
    seconds_time = time.to_f / 1000.0
    type_id = self.factor.type_id
    location_id = self.factor.location_id
    return [id, num_waypoints, seconds_time, type_id, location_id, path_length, elevation_change]
  end
  
  def get_elevation(lat, lng)
    res = Net::HTTP.post_form(URI.parse('http://gisdata.usgs.gov/xmlwebservices2/elevation_service.asmx/getElevation'),
                                        {'X_Value'=>lng, 'Y_Value'=>lat, 'Elevation_Units'=>'METERS',
                                         'Source_Layer'=>'-1', 'Elevation_Only'=>'0'})
    elevation = -100000000;
    doc = Document.new(res.body)
    
    doc.elements.each('double') { |element| elevation = element.text.to_f }
    #pp [lat,lng, elevation]
    
    return elevation
    
  end
  
end
