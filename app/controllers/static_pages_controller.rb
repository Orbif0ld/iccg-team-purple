class StaticPagesController < ApplicationController

  def login_status
    render json: logged_in?
  end
  
  def home
  end

  def contact
  end
end
