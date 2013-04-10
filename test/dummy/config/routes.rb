Dummy::Application.routes.draw do

  match '/styleguide' => 'application#styleguide'
  match '/:action' => 'application'

  root :to => 'application#index'

end
