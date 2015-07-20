module ApplicationHelper

  def render_source(code)
      @html_encoder ||= HTMLEntities.new
      raw(@html_encoder.encode(code))
  end

end
