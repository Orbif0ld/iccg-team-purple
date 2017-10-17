require 'byebug'

class SyncGamesManagersController < ApplicationController

  # before_action :require_login
  before_action :get_sgm

  def general_activity
    activity = {
      idle: @sgm.idle_users,
      queued: @sgm.queued_users,
      playing: @sgm.playing_users
    }
    
    render json: activity
  end

  def user_activity
    game_available = @sgm.game_available_for?(current_user)
    will_play_as = if game_available then @sgm.will_play_as(current_user) else nil end
    activity = {
      game_available: game_available,
      will_play_as: will_play_as,
      game_started: @sgm.game_started_for(current_user),
      activity: @sgm.get_activity(current_user)
    }
    render json: activity
  end
  
  def enqueue
    @sgm.enqueues current_user
  end

  def dequeue
    @sgm.dequeues current_user
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
