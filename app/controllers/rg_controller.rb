class RgController < ApplicationController
  
  def get_round_data
    question = if @player.question_available? then @player.get_question else "" end
    this_answer = if @player.is_reader? then @player.get_readers_answer else @player.get_guessers_answer end
    other_answer = if @player.is_reader? then @player.get_guessers_answer else @player.get_readers_answer end
    requires_answer = if (this_answer.nil? and question != "") then true else false end
    reviewing = if (!this_answer.nil?) then true else false end
    
    round_data = {is_questioner: @player.is_questioner?,
                  new_round: @player.new_round?,
                  requires_answer: requires_answer,
                  reviewing: reviewing,
                  game_over: @player.is_game_over,
                  question_available: @player.question_available?,
                  answers_available: @player.answers_available?,
                  question: question,
                  this_answer: this_answer,
                  other_answer: other_answer,
                  scores: @player.get_scores,
                  whiteboard: @player.get_whiteboard_hashes
                 }
    render json: round_data
  end

  def submit_question
    begin
      @player.submit_question(params[:question])
    rescue NoContentError
      flash[:alert] = "You have to ask something!"
    end
  end

  def submit_answer
    begin
      @player.submit_answer(params[:answer])
    rescue
      flash[:alert] = "You have to answer something!"
    end
  end
  
end
