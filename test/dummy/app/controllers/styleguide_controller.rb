class StyleguideController < ActionController::Base
  layout "global"

  def lightbox_ajax_sample
    render layout: "lightbox_ajax"
  end
end
