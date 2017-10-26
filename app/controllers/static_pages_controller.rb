class StaticPagesController < ApplicationController

  def login_status
    render json: logged_in?
  end
  
  def home
    sgm = SyncGamesManager.get
    if (sgm.game_started_for current_user)
      role = sgm.playing_as current_user
      game = Game.find(sgm.games[current_user.id])
      if role == :reader
        redirect_to game_reader_path(game.id, game.reader.id)
      elsif role == :guesser
        redirect_to game_guesser_path(game.id, game.guesser.id)
      elsif role == :judge
        redirect_to game_judge_path(game.id, game.judge.id)
      else
        raise StandardError "should never get here"
      end
    end
  end

  def contact
  end
end
