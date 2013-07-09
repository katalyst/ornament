Dummy::Application.routes.draw do

  match '/styleguide' => 'styleguide#index'
  match '/styleguide/:action' => 'styleguide'

  root :to => 'styleguide#index'

end
