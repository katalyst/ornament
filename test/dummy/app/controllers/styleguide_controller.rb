class StyleguideController < ActionController::Base
  # include CommonControllerActions
  layout "styleguide/ornament"

  def lightbox_ajax_sample
    render layout: "lightbox_ajax"
  end
end
