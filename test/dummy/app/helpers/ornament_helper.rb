module OrnamentHelper

  # Change a country code to a human-readable country
  # country_name("AU") = "Australia"
  # NOTE: Requires country_select gem 
  def country_name(country_code)
    country = ISO3166::Country[country_code]
    country.name
  end

  # Yes or no, turns true/false in to yes/no
  # yes_or_no(true) = "Yes"
  def yes_or_no(value=false)
    value ? "Yes" : "No"
  end

  # Format share descriptions a bit nicer by converting <br> and
  # <br /> to spaces.
  def share_description(value) 
    raw(value).gsub("<br>", " ").gsub("<br />", " ")
  end

  # Link helper
  # takes a URL and outputs a link with a custom label with http
  # and www stripped out
  def link_helper(url)

    # set up another variable for the link
    link = url

    # add http if missing from url
    if !url.include?("http://") && !url.include?("https://")
      url = "http://" + url
    end

    # strip out http/https from link
    if link.include?("http://") || link.include?("https://")
      link = link.split("://")[1]
    end

    # strip out the www from the link
    if link.include?("www.")
      link = link.split("www.")[1]
    end

    # remove trailing slash
    if link[link.length-1].eql?("/")
      link = link[0..(link.length - 2)]
    end

    # return a link_to with the final link and url
    link_to(link, url)
  end

  # Icon Helper
  # <%= icon("close", width: 24, height: 24, stroke: "#BADA55", fill: "purple") -%>
  def icon(icon_path, options={})
    options[:stroke] = "#000000" unless options[:stroke].present?
    options[:fill] = "#000000" unless options[:fill].present?
    options[:class] = "" unless options[:class].present?
    path = "shared/icons"
    if options[:koi] && defined?(Koi) 
      path = "koi/shared/icons"
    end
    render("#{path}/#{icon_path}", options: options)
  end

  # SVG Image Helper
  # Converts a dragonfly-stored SVG image to inline SVG with a missing
  # asset fallback. 
  def svg_image(image)
    raw image.data
  rescue Dragonfly::Job::Fetch::NotFound
    "Image missing"
  end

  # Render source code
  def render_source(code)
    @html_encoder ||= HTMLEntities.new
    raw(@html_encoder.encode(code))
  end

end
