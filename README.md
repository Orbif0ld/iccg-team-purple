_Mooqita’s ICCG challenge_

The objective of the challenge was to develop an implementation of the game described in Toward a comprehension challenge, using crowdsourcing as a tool by P. Paritosh and G. Marcus.

The source code is on github: https://github.com/Orbif0ld/iccg-team-purple
The app is deployed on heroku: https://dry-fjord-40579.herokuapp.com/
Installing and running the ICCG app locally
The following explains how to run the app locally on a new Ubuntu installation, that is, assuming nothing has already been installed.

To install and run the app locally in your browser, open the terminal and install the required libraries by running

*sudo apt-get install ruby git ruby-all-dev zlib1g-dev libpq-dev libsqlite3-dev nodejs*

Next install ruby’s bundler gem by running

*gem install bundler*

Once bundler is installed cd to the location where the app’s folder is supposed to be created and type

*git clone https://github.com/Orbif0ld/iccg-team-purple.git*

to download the code from github. To install all ruby gems (libraries) required by the app, cd to the app’s folder and run

*bundle install*

Once bundler has finished, initialize the database by running

*rake db:migrate*

and seed it with sample stories and default users (defined in db/seeds.rb and db/documents) by running

*rake db:seed*

To start the app locally, type

*rails server*

Locally, open a browser and access http://localhost:3000. The browser should now load the app.

_Playing around with the app_

You can always play the game with 2 of your friends on heroku. If you want to run it on your own computer and play around with it on your own, three different browsers would be necessary to start and play a game. A game can be simulated using one browser however, by running

*rails console*

in a separate terminal window. You can then use the methods in sync_games_manager.rb and game.rb to simulate actions of other users.

For example, supposed you’ve logged in as the user with user_id = 1. (To see which user has which id you can run *User.all.map{|usr| [usr.name, usr.id]}* in rails console.) To simulate a game with users with ids 2 and 3, in rails console write:

*Sgm = SyncGamesManager.get
Sgm.enqueues User.find(2)
Sgm.enqueues User.find(3)*

If you press the queue button in the browser after executing these commands in rails console, an invitation to join a game should appear. To simulate users 2 and 3 accepting the invitation execute

*Sgm.joins_game User.find(2)
Sgm.joins_game User.find(3)*

If you now accept the invitation in the browser, you should get redirected to the new game. Assuming that it’s the first game played since the database was initialized, you can access the game in console by executing

*g = Game.find(1)*

(In general, if it’s the nth game started since the database was initialized, it should be g = Game.find(n).) You can then simulate actions by users 2 and 3. For example if user 2 or 3 is the Reader and is supposed to ask a question during this round

*g.submit_question(:reader, “Who is the main character?”)*

will simulate her submission.

_Deploying to Heroku_

In order to deploy your own version of the game to heroku, assuming you have a Heroku account and the Heroku toolbelt installed, run

*heroku create*

When this has finished push your version of the game to heroku like so:

*git push heroku master*

To set up the database on Heroku, run

*heroku run rake db:migrate
heroku run rake db:seed*

Your version of the game should now be available as a new heroku app.

For more information see deploying to Heroku.
