class FactorsController < ApplicationController
  # GET /factors
  # GET /factors.xml
  def index
    #@factors = Factor.all

    respond_to do |format|
      format.html # index.html.erb
      format.xml  { render :xml => @factors }
    end
  end

  # GET /factors/1
  # GET /factors/1.xml
  def show
   # @factor = Factor.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.xml  { render :xml => @factor }
    end
  end

  # GET /factors/new
  # GET /factors/new.xml
  def new
    #@factor = Factor.new

    respond_to do |format|
      format.html # new.html.erb
      format.xml  { render :xml => @factor }
    end
  end

  # GET /factors/1/edit
  def edit
    #@factor = Factor.find(params[:id])
  end

  # POST /factors
  # POST /factors.xml
  def create
    #@factor = Factor.new(params[:factor])

    respond_to do |format|
      if @factor.save
        flash[:notice] = 'Factor was successfully created.'
        format.html { redirect_to(@factor) }
        format.xml  { render :xml => @factor, :status => :created, :location => @factor }
      else
        format.html { render :action => "new" }
        format.xml  { render :xml => @factor.errors, :status => :unprocessable_entity }
      end
    end
  end

  # PUT /factors/1
  # PUT /factors/1.xml
  def update
    #@factor = Factor.find(params[:id])

    respond_to do |format|
      if @factor.update_attributes(params[:factor])
        flash[:notice] = 'Factor was successfully updated.'
        format.html { redirect_to(@factor) }
        format.xml  { head :ok }
      else
        format.html { render :action => "edit" }
        format.xml  { render :xml => @factor.errors, :status => :unprocessable_entity }
      end
    end
  end

  # DELETE /factors/1
  # DELETE /factors/1.xml
  def destroy
   # @factor = Factor.find(params[:id])
   # @factor.destroy

    respond_to do |format|
      format.html { redirect_to(factors_url) }
      format.xml  { head :ok }
    end
  end
end
