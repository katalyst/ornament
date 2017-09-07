class ErrorsController < ActionController::Base
  if defined?(Koi) 
    include CommonControllerActions
  end
  layout "styleguide/ornament"
end
