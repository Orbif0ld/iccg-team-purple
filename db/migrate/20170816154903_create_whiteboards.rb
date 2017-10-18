class CreateWhiteboards < ActiveRecord::Migration[5.1]
  def change
    create_table :whiteboards do |t|
      t.belongs_to :game
      t.belongs_to :document
      
      t.timestamps
    end
  end
end
