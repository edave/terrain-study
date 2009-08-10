require 'test_helper'

class SubjectCycleTest < ActionController::IntegrationTest
  fixtures :all
  self.use_transactional_fixtures = false
  
 # Replace this with your real tests.
  def test_full_cycle
   puts "Starting test"
   34.times do |time|
    puts "Subject #" + time.to_s
    new_session do |subject|

    subject.goes_to_start
    subject.accepts_terms
    subject.goes_to_demo_survey
    subject.setup_factors
    subject.goes_to_study
    subject.goes_to_submit_study({"experiment[time]"=>1234, 'experiment[num_waypoints]' => 3,
                  'experiment[waypoints_json]' => 'waypoints_json_test'})
    subject.goes_to_study
    subject.goes_to_submit_study({"experiment[time]"=>1234, 'experiment[num_waypoints]' => 3,
                  'experiment[waypoints_json]' => 'waypoints_json_test'})
    subject.goes_to_exit_survey
      
    end
  end
  end
  
  private

   module MyTestingDSL
      def goes_to_start
        get "/"
        assert_response :success
      end
      
      def accepts_terms
        post_via_redirect '/subjects/create', {'subject[consent]' => 1}
        #assert_response :success
      end
      
      def goes_to_demo_survey
        get "/demo_survey"
        assert_response :redirect
      end
      
      def setup_factors
        get '/subjects/choose_experiments/1'
        assert_response :redirect
      end
      
      def goes_to_exit_survey
        get "/exit_survey"
        assert_response :success
      end
      
      def goes_to_study
        get "/experiments/choose/0"
        assert_response :redirect
      end

      def goes_to_submit_study(options)
        post_via_redirect "/experiments/create", options
        assert_response :success
      end

      
    end

    def new_session
      open_session do |sess|
        sess.extend(MyTestingDSL)
        yield sess if block_given?
      end
  end
 
end
