class StyleguideController < ActionController::Base
  layout "styleguide"

  def lightbox_ajax_sample
    render layout: "lightbox_ajax"
  end
end
