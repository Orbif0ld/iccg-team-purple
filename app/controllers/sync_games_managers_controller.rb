class SyncGamesManagersController < ApplicationController

  before_action :require_login
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

  def accept_invite
    @sgm.joins_game current_user
  end

  def decline_invite
    @sgm.declines_game current_user
  end

  def quit_game
    @sgm.quits_game current_user
  end

  def send_to_game_if_ready
    role = @sgm.playing_as current_user
    if @sgm.game_started_for current_user
      if role == :reader
        render js: "window.location.pathname = #{game_reader_path(@sgm.games[current_user.id], current_user.id).to_json}"
      elsif role == :guesser
        render js: "window.location.pathname = #{game_guesser_path(@sgm.games[current_user.id], current_user.id).to_json}"
      elsif role == :judge
        render js: "window.location.pathname = #{game_judge_path(@sgm.games[current_user.id], current_user.id).to_json}"
      else
        raise StandardError "should never get here"
      end
    end
  end

  private

  def require_login
    return false unless logged_in?
  end

  def get_sgm
    @sgm = SyncGamesManager.get
  end
  
end
