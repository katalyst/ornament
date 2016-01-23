class StyleguideController < ActionController::Base
  layout "styleguide/appliction"

  def lightbox_ajax_sample
    render layout: "lightbox_ajax"
  end
end
