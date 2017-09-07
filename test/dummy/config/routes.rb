Dummy::Application.routes.draw do

  get '/styleguide' => 'styleguide#index', as: :styleguide
  get '/styleguide/:action' => 'styleguide'
  get '/test-404' => 'errors#404'
  get '/test-500' => 'errors#500'

  root :to => 'styleguide#index'

end
