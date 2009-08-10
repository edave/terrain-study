class Waypoints < ActiveRecord::Migration
  def self.up
    add_column :experiments,    "path_length",  :float,   :default => 0
    add_column :experiments,    "path_length_2d",  :float,   :default => 0
    add_column :experiments,    "processed_waypoints", :text,   :default => nil 
    add_column :experiments,    "elevation_change", :float, :default => 0
    
  end

  def self.down
    remove_column :experiments, "path_length"
    remove_column :experiments, "elevation_change"
  end
end
