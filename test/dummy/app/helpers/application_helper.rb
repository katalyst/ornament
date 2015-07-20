module ApplicationHelper

  def render_source(code)
      @html_encoder ||= HTMLEntities.new
      raw(@html_encoder.encode(code))
  end

  def show_code(code)
    toggle_id = Digest::SHA1.hexdigest([Time.now, rand].join)
    code_view = ""
    code_view = "<div>"
    code_view += "  <div class='sg-toggle-code'><span data-toggle-anchor='#{toggle_id}' data-toggle-visible-label='Hide code sample'>View code sample</span></div>"
    code_view += "  <div data-toggle='#{toggle_id}'><pre class='sg-pre prettyprint'>#{render_source(code)}</pre></div>".html_safe
    code_view += "</div>"
    code_view.html_safe
  end

end
