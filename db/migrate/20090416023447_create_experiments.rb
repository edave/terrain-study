class CreateExperiments < ActiveRecord::Migration
  def self.up
    create_table :experiments do |t|
      t.text     :waypoints_json
      t.integer  :subject_id
      t.integer  :factor_id
      t.integer  :time
      t.integer  :num_waypoints
      t.string   :ip_address
      t.timestamps
    end
  end

  def self.down
    drop_table :experiments
  end
end
