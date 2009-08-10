class SubjectsController < ApplicationController
  before_filter :check_subject, :except => [:start, :index, :create, :show, :new, :edit]
  # GET /subjects
  # GET /subjects.xml
  def index
    @subjects = Subject.all

    respond_to do |format|
      format.html # index.html.erb
      format.xml  { render :xml => @subjects }
    end
  end

  # GET /subjects/1
  # GET /subjects/1.xml
  def show
    #@subject = Subject.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.xml  { render :xml => @subject }
    end
  end

  # GET /subjects/new
  # GET /subjects/new.xml
  def new
    @subject = Subject.new

    respond_to do |format|
      format.html # new.html.erb
      format.xml  { render :xml => @subject }
    end
  end

  # GET /subjects/1/edit
  def edit
    #@subject = Subject.find(params[:id])
  end

  # POST /subjects
  # POST /subjects.xml
  def create
    @subject = Subject.new(params[:subject])
    
    respond_to do |format|
      if @subject.save!
        reset_session
        #flash[:notice] = 'Subject was successfully created.'
        session[:subject_id] = @subject.id
        format.html { redirect_to("http://www.surveymonkey.com/s.aspx?sm=zT4wKjP74XnOnco6wFy54Q_3d_3d&c="+@subject.id.to_s) }
        format.xml  { render :xml => @subject, :status => :created, :location => @subject }
      else
        format.html { render :action => "new" }
        format.xml  { render :xml => @subject.errors, :status => :unprocessable_entity }
      end
    end
  end

  # PUT /subjects/1
  # PUT /subjects/1.xml
  def update
   # @subject = Subject.find(params[:id])

    respond_to do |format|
      if @subject.update_attributes(params[:subject])
        flash[:notice] = 'Subject was successfully updated.'
        format.html { redirect_to(@subject) }
        format.xml  { head :ok }
      else
        format.html { render :action => "edit" }
        format.xml  { render :xml => @subject.errors, :status => :unprocessable_entity }
      end
    end
  end
  
  def start
    
  end
  
  def subject_id
    
  end
  
  def exit_survey

   subject = Subject.find(session[:subject_id])
   subject.exit_survey = true
   subject.save!
 end
 
 def demo_survey
   subject = Subject.find(session[:subject_id])
   subject.demo_survey = true
   subject.save!
   redirect_to(:controller => :subjects, :action => :choose_experiments, :id => session[:subject_id])
 end
  
  def choose_experiments
    if !session[:first].nil? || !session[:second].nil?
       redirect_to(:controller => :experiments, :action => :choose, :id => session[:subject_id])
       return
    end
    factors = Factor.find(:all)
    bin = Array.new()
    for factor in factors:
      bin << {:id => factor.id, :value => factor.count}
    end
    bin.sort!{ |x,y| x[:value] <=> y[:value]}
    #low_bin = Array.new(bin)
    #equal_lows = 0
    #last_value = -1
    #while low_bin.length > 0
    #  shift_value = low_bin.shift[:value]
    #  if shift_value
    #end
    factor_id = bin[0][:id]
    factor = Factor.find_by_id(factor_id)
    factor.start_count = factor.start_count + 1
    factor.save!
    session[:first] = factor.id
    second_type = 0
    second_location = 0
    if factor.type_id == 1
       second_type = 2
    else
      second_type = 1
    end
    if factor.location_id == 1
        second_location = 2
    else 
        second_location = 1
    end
    second_factor = Factor.find(:first, :conditions=> {:type_id => second_type, :location_id => second_location})
    session[:second] = second_factor.id
    redirect_to(:controller => :experiments, :action => :choose, :id => session[:subject_id])
  end

  # DELETE /subjects/1
  # DELETE /subjects/1.xml
  def destroy
    #@subject = Subject.find(params[:id])
    #@subject.destroy

    respond_to do |format|
      format.html { redirect_to(subjects_url) }
      format.xml  { head :ok }
    end
  end
end
