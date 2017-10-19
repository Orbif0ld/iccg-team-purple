class ReadersController < RgController

  before_action :get_reader

  def show
    @whiteboard = @player.get_whiteboard_hashes
    @document = @player.game.document
  end

  def get_document_data
    document = {type: @player.get_document_type,
                title: @player.get_document_name,
                body: @player.get_document_text}
    render json: document
  end
  
  private
  
  def get_reader
    @player = Reader.find_by_id(params[:id])
  end
  
end
