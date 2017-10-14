class SyncGamesManagersController < ApplicationController

  def general_activity
  end

  def user_activity
    @player = User.find(params[:id])
  end
  
  def enqueue
  end

  def dequeue
  end

  def accept_inivte
  end

  def decline_invite
  end

  def quit_game
  end

  def register
  end
  
end
