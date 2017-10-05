class Document < ApplicationRecord
  has_many :games
  has_many :whiteboards
  has_and_belongs_to_many :collections

  def get_document_type
    return self.kind.to_sym
  end
end
