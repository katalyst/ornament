module OrnamentStyleguideHelper

# Render source code
  def render_source(code)
    @html_encoder ||= HTMLEntities.new
    raw(@html_encoder.encode(code))
  end

  def form_control_group(attr, f, wrapper_opts={}, &block)
    wrapper_class = wrapper_opts[:class] || "";
    wrapper_class += " control-group"
    wrapper_class += " error" if f.error(attr)
    output =  "<div class='#{wrapper_class}'>"
    output += "  <div class='control-group--label'>"
    output += f.label(attr)
    output += f.error(attr) if f.error(attr)
    output += f.hint(attr) if f.hint(attr)
    output += "  </div>"
    output += "  #{capture(&block)}"
    output += "</div>"
    output.html_safe
  end

end