# This file should contain all the record creation needed to seed the database
# with its default values.
#
# The data can then be loaded with the rails db:seed command (or created
# alongside the database with db:setup).

# Load the Aesop's fables from /db/documents
Dir.glob('db/documents/*.txt').each do |file_name|
  lines = File.open(file_name, 'r').readlines
  title = lines[0].chomp
  content = lines.slice(2, lines.length - 2).join.chomp

  Document.create title: title, content: content, kind: 'plain text'
end


User.create!(name:  "Kirill",
             email: "kirmesh@gmail.com",
             password:              "super_pw",
             password_confirmation: "super_pw",
             admin: true)

User.create!(name:  "CoolOrcaGuy",
             email: "orcinus@orca.ocean",
             password:              "super_pw",
             password_confirmation: "super_pw",
             admin: true)

User.create!(name:  "Sam",
             email: "sam@sg1.gov",
             password:              "super_pw",
             password_confirmation: "super_pw",
             admin: true)


User.create!(name:  "Jack",
             email: "Oneill@sg1.gov",
             password:              "super_pw",
             password_confirmation: "super_pw",
             admin: true)

3.times do |n|
  name = "user-#{n+1}"
  email = "user-#{n+1}@team-red.org"
  User.create!(name:  name,
               email: email,
               password:              "super_pw",
               password_confirmation: "super_pw",
               admin: false)
end
