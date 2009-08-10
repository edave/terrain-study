class ElevationsController < ApplicationController
  
  def make_principle_investigator
    session[:pi] = true
    redirect_to(:controller => :experiments, :action => :index)
  end
end
