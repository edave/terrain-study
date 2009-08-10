require 'pp'
namespace :analyze do
task :data => :environment  do
  subjects = Subject.find(:all)
  subjects.each do |subject|
    if subject.completed? && subject.id > 74
      pp "Analyzing: #{subject.id}"
      subject.experiments.each do |experiment|
        #if experiment.path_length <= 0
        distances = experiment.distance
        pp distances
        experiment.path_length = distances[0]
        experiment.elevation_change = distances[1]
        experiment.path_length_2d = distances[2]
        experiment.save!
      #end
      end
    end
  end
end

end