class StyleguideController < ActionController::Base
  layout "styleguide"
  
  # include CommonControllerActions

  def lightbox_ajax_sample
    render layout: "lightbox_ajax"
  end
end
