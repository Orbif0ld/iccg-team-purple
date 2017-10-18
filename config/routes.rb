Rails.application.routes.draw do
  resources :invites
  resources :requests
  resources :collections
  resources :lines
  resources :documents
  resources :whiteboards
  resources :games
  resources :judges
  resources :guessers
  resources :readers do
    member do
      get 'ask'
    end
  end
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  # Delete when neccessary. Just to check first deployment on Heroku
  # root 'application#hello'

  root 'static_pages#home'
  # This pattern routes a GET request for the URL /help
  # to the help action in the Static Pages controller
  get  '/help', to: 'static_pages#help'
  get  '/about',   to: 'static_pages#about'
  get  '/contact', to: 'static_pages#contact'
  get  '/signup',  to: 'users#new'
  get  '/login',   to: 'sessions#new'
  post '/login',   to: 'sessions#create'
  delete '/logout',  to: 'sessions#destroy'

  get  '/waiting-players',   to: 'waiting_players#waiting'
  get '/start-new-game', to: 'waiting_players#index'

  # Add automatically RESTFul actions to operate with Users
  resources :users

  get 'sessions/new'
  get '/login_status', to: 'static_pages#login_status'
  
  resources :documents do
    resources :games
    resources :whiteboards
  end

  #  Add additional routes to the seven routes created by resources

  resource :sync_games_managers do
    get "general_activity"
    get "user_activity"
    get "send_to_game"
    post "enqueue"
    post "dequeue"
    post "accept_invite"
    post "decline_invite"
    post "quit_game"
  end

  resources :games do
    member do
      get 'game_over'
    end
    resources :readers do
      member do
        get 'show'
        get 'get_round_data'
        get 'get_document_data'
        post 'submit_question'
        post 'submit_answer'
      end
    end
    resources :guessers do
      member do
        get 'show'
        get 'get_round_data'
        post 'submit_question'
        post 'submit_answer'
      end
    end
    resources :judges do
      member do
        get 'show'
        get 'get_round_data'
        get 'get_document_data'
        post 'select_better_answer'
      end
    end
  end
  

end
