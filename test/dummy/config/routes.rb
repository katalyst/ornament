Dummy::Application.routes.draw do

  get '/' => 'styleguide#index', as: :styleguide
  get '/styleguide/:action' => 'styleguide'
  get '/test-404' => 'errors#404'

  # PWA Routes
  get '/site' => 'service_worker#webmanifest', format: :webmanifest, as: :webmanifest
  get '/service-worker' => 'service_worker#index', format: :js, as: :service_worker

  root :to => 'styleguide#index'

end
