class CreateElevations < ActiveRecord::Migration
  def self.up
    create_table :elevations do |t|

      t.timestamps
    end
  end

  def self.down
    drop_table :elevations
  end
end
