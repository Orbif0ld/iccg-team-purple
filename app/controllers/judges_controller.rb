class JudgesController < ApplicationController

  before_action :get_judge

  def refresh_whiteboard_head
    @whiteboard = @player.get_whiteboard_hashes
    render partial: "shared/whiteboard_head"
  end

  def refresh_whiteboard_tail
    @whiteboard = @player.get_whiteboard_hashes
    render partial: "shared/whiteboard_tail"
  end

  def show
    @whiteboard = @player.get_whiteboard_hashes
    @document = @player.game.document
  end
  
  def get_round_data
    question = if @player.question_available? then @player.get_question else "" end
    answers = if (@player.answers_available? and !@player.is_game_over) then
                @player.get_answers else {} end
    round_data = {new_round: @player.new_round?,
                  question_available: @player.question_available?,
                  game_over: @player.is_game_over,
                  question: question,
                  answers_available: @player.answers_available?,
                  answers: answers,
                  scores: @player.get_scores,
                  whiteboard: @player.get_whiteboard_hashes}
    render json: round_data
  end
  
  def get_document_data
    document = {type: @player.get_document_type,
                title: @player.get_document_name,
                body: @player.get_document_text}
    render json: document
  end

  def select_better_answer
    other = {answer1: :answer2, answer2: :answer1}
    @player.more_suspect_is(other[params[:better_answer].to_sym])
  end

  private

  def get_judge
    @player = Judge.find(params[:id])
  end
  
end
