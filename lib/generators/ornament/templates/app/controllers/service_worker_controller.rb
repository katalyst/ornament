class ServiceWorkerController < ActionController::Base
  protect_from_forgery except: :index

  # Main service work file
  # GET /service-worker.js
  def index
  end

  # PWA Webmanifest
  # GET /site.webmanifest
  def webmanifest
  end

end