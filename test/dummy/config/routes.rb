Dummy::Application.routes.draw do

  get '/styleguide' => 'styleguide#index'
  get '/styleguide/:action' => 'styleguide'

  root :to => 'styleguide#index'

end
