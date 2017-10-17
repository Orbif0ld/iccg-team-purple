class SyncGamesManagersController < ApplicationController

  before_action :require_login
  before_action :get_sgm

  def general_activity
  end

  def user_activity
  end
  
  def enqueue
    @sgm.enqueues @user
  end

  def dequeue
    @sgm.dequeues @user
  end

  def accept_inivte
  end

  def decline_invite
  end

  def quit_game
  end

  def register
  end

  private

  def require_login
    return false unless logged_in?
  end

  def get_sgm
    @sgm = SyncGamesManager.get
  end
  
end
