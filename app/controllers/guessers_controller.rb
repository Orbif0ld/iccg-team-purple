class GuessersController < RgController
  before_action :get_guesser

  def show
    @whiteboard = @player.get_whiteboard_hashes
    @document = @player.game.document
  end
  
  private
  
  def get_guesser
    @player = Guesser.find(params[:id])
  end
  
end
