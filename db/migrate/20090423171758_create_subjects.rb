class CreateSubjects < ActiveRecord::Migration
  def self.up
    create_table :subjects do |t|
      t.boolean :consent,   :default => false
      t.boolean :demo_survey,   :default => false
      t.boolean :exit_survey,   :default => false
      t.timestamps
    end
  end

  def self.down
    drop_table :subjects
  end
end
