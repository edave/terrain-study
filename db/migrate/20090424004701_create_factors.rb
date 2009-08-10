class CreateFactors < ActiveRecord::Migration
  def self.up
    create_table :factors do |t|
      t.integer :start_count, :default => 0
      t.integer :count, :default => 0
      t.integer :location_id, :default => -1
      t.integer :type_id, :default => -1
      t.integer :lock_version, :default => 0
      t.timestamps
    end
    
    Factor.new(:location_id => 1, :type_id => 1).save!
    Factor.new(:location_id => 1, :type_id => 2).save!
    Factor.new(:location_id => 2, :type_id => 1).save!
    Factor.new(:location_id => 2, :type_id => 2).save!
    
  end

  def self.down
    drop_table :factors
  end
end
