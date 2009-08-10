# Methods added to this helper will be available to all templates in the application.
module ApplicationHelper
  def google_api_key
    return "ABQIAAAAw2j6TLkV4iXMf_DFEEIhABRErTtM6A3UxKkGkCwvriuuMuL91hRMM9zmKyiFwefYKyOcQ0-J8NjHNQ"
    #return "ABQIAAAAw2j6TLkV4iXMf_DFEEIhABRErTtM6A3UxKkGkCwvriuuMuL91hRMM9zmKyiFwefYKyOcQ0-J8NjHNQ"
  end
  
  def human_experiment_type(type)
    return "Maps" if type == 1
    return "Earth" if type == 2
  end
end
