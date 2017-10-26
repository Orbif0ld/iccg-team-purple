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
    invite_status = if game_available then current_user.invite.users_accepted.size else 0 end
    activity = {
      game_available: game_available,
      will_play_as: will_play_as,
      game_started: @sgm.game_started_for(current_user),
      activity: @sgm.get_activity(current_user),
      invite_status: invite_status
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

  def send_to_game
    if @sgm.game_started_for current_user
      role = @sgm.playing_as current_user
      game = Game.find(sgm.games[current_user.id])
      if role == :reader
        render js: "window.location.pathname = #{game_reader_path(game.id, game.reader.id).to_json}"
      elsif role == :guesser
        render js: "window.location.pathname = #{game_guesser_path(game.id, game.guesser.id).to_json}"
      elsif role == :judge
        render js: "window.location.pathname = #{game_judge_path(game.id, game.judge.id).to_json}"
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
