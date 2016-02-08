Dummy::Application.routes.draw do

  get '/styleguide' => 'styleguide#index', as: :styleguide
  get '/styleguide/:action' => 'styleguide'

  root :to => 'styleguide#index'

end
