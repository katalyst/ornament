module OrnamentSvgHelper

# Icon Helper
  # <%= icon("close", width: 24, height: 24, stroke: "#BADA55", fill: "purple") -%>
  def icon(icon_path, options={})
    options[:stroke] = "#000000" unless options[:stroke].present?
    options[:fill] = "#000000" unless options[:fill].present?
    options[:class] = "" unless options[:class].present?

    # Get path for icons
    path = "shared/icons"
    if options[:koi] && defined?(Koi) 
      path = "koi/shared/icons"
    end

    # build styles string
    options[:styles] = ""
    {width: :width, height: :height}.each do |attribute, key|
      value = options[key]
      if value
        # allow shorthand numbers to auto-format to pixels
        value = "#{value}px" if value.is_a? Numeric
        options[:styles] += "#{attribute}: #{value}; "
      end
    end
    options[:className] ||= "icon-#{icon_path.parameterize}";
    # simple-navigation has it's own render() method so 
    # rendering partials inside simple-navigation needs a 
    # bit of trickery
    svg_path = "#{path}/#{icon_path}.svg"

    Rails.cache.fetch "#{path}-#{icon_path.parameterize}__#{options.to_s}", expires_in: 12.hours do
      if defined?(render_icon)
        render_icon(partial: svg_path, locals: { options: options })
      else
        render(svg_path, options: options)
      end
    end
  end

  # SVG Image Helper
  # Converts a dragonfly-stored SVG image to inline SVG with a missing
  # asset fallback. 
  def svg_image(image)
    raw image.data
  rescue Dragonfly::Job::Fetch::NotFound
    "Image missing"
  end

end