class ExperimentsController < ApplicationController
  layout "experiments", :except => [:maps, :earth, :maps_tutorial, :earth_tutorial, :show]
  before_filter :check_subject, :except => [:index, :show]
  
  def maps
    @factor = Factor.find(session[:current_factor])
  end
  
  def maps_tutorial
    
  end
  
  def earth
    @factor = Factor.find(session[:current_factor])
  end
  
  def earth_tutorial
    
  end
  
  def choose
    subject_id = session[:subject_id]
    factor = Factor.find(session[:first])
    first_count = Experiment.count(:conditions =>{:subject_id => subject_id,
                                  :factor_id => factor.id})
    if first_count < 1
      session[:current_factor] = factor.id
      if factor.type_id == 1
        redirect_to(:action => :maps_tutorial, :id=>0)
        return
      else
        redirect_to(:action => :earth_tutorial, :id=>0)
      return
      end
    end
    factor = Factor.find(session[:second])
    second_count = Experiment.count(:conditions =>{:subject_id => subject_id,
                                  :factor_id => factor.id})
    if second_count < 1
      session[:current_factor] = factor.id
      factor.start_count = factor.start_count + 1
      factor.save!
      if factor.type_id == 1
        redirect_to(:action => :maps_tutorial, :id=>0)
        return
      else
        redirect_to(:action => :earth_tutorial, :id=>0)
      return
      end
    end
    #Exit Survey
    redirect_to('http://www.surveymonkey.com/s.aspx?sm=VTko38b_2bTLu5jcTqvXB66Q_3d_3d&c='+session[:subject_id].to_s)
  end
  
  # GET /experiments
    # GET /experiments.xml
    def index
      @experiments = nil
      if session[:pi] == true
      @experiments = Experiment.all
      end
      respond_to do |format|
        format.html # index.html.erb
        format.xml  { render :xml => @experiments }
      end
    end

    # GET /experiments/1
    # GET /experiments/1.xml
    def show
      @experiment = nil
      if session[:pi] == true
      @experiment = Experiment.find(params[:id])
      end
      respond_to do |format|
        format.html # show.html.erb
        format.xml  { render :xml => @experiment }
      end
    end
 

  # GET /experiments/new
  # GET /experiments/new.xml
  def new
    @experiment = Experiment.new

    respond_to do |format|
      format.html # new.html.erb
      format.xml  { render :xml => @experiment }
    end
  end

  # GET /experiments/1/edit
  def edit
    #@experiment = Experiment.find(params[:id])
  end

  # POST /experiments
  # POST /experiments.xml
  def create
    @experiment = Experiment.new(params[:experiment])
    @experiment.factor_id = session[:current_factor]
    @experiment.subject_id = session[:subject_id]
    @experiment.ip_address = request.remote_ip
    respond_to do |format|
      if @experiment.save
        flash[:notice] = 'Experiment was successfully created.'
        format.html { redirect_to(:controller => :experiments, :action => :choose, :id => 0) }
        format.xml  { render :xml => @experiment, :status => :created, :location => @experiment }
      else
        format.html { render :action => "new" }
        format.xml  { render :xml => @experiment.errors, :status => :unprocessable_entity }
      end
    end
  end

  # PUT /experiments/1
  # PUT /experiments/1.xml
  def update
    #@experiment = Experiment.find(params[:id])

    respond_to do |format|
      if @experiment.update_attributes(params[:experiment])
        flash[:notice] = 'Experiment was successfully updated.'
        format.html { redirect_to(@experiment) }
        format.xml  { head :ok }
      else
        format.html { render :action => "edit" }
        format.xml  { render :xml => @experiment.errors, :status => :unprocessable_entity }
      end
    end
  end

  # DELETE /experiments/1
  # DELETE /experiments/1.xml
  def destroy
   # @experiment = Experiment.find(params[:id])
    #@experiment.destroy

    respond_to do |format|
      format.html { redirect_to(experiments_url) }
      format.xml  { head :ok }
    end
  end
end
