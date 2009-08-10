class Factor < ActiveRecord::Base
  validates_presence_of :type_id, :location_id
  validates_numericality_of  :type_id, :location_id
  
  has_many :experiments
  
end
