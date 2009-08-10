require "csv"  
class CSVData
  def initialize(filename)  
         @filename = "#{RAILS_ROOT}/lib/#{filename}"
 end
 
 def writeData  
     subjects = Subject.find(:all)
     CSV.open(@filename, 'w') do |csv|  
       subjects.each do |subject|
         if true #subject.completed?
          order_effect = 1
          subject.experiments.each do |experiment|
          csv_line = [subject.id, order_effect]
          csv_line.concat(experiment.to_csv)
          csv << csv_line
          order_effect += 1
      end
    end
       end  
     end  
  end 
end