class Subject < ActiveRecord::Base
  validates_acceptance_of :consent,:accept => true, :message => "must be obtained to participate in this study."
  has_many :experiments
  
  def did_experiments?
    return experiments.count == 2
  end
  
  def completed?
    return consent && demo_survey && exit_survey && did_experiments?
  end
end
