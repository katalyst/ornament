module OrnamentHelper

  # Yes or no, turns true/false in to yes/no
  # yes_or_no(true) = "Yes"
  def yes_or_no(value=false)
    value ? "Yes" : "No"
  end

  # Change a country code to a human-readable country
  # country_name("AU") = "Australia"
  # NOTE: Requires country_select gem 
  def country_name(country_code)
    country = ISO3166::Country[country_code]
    country.name
  end

  # Helper to optimise an image
  # image_tag optimised_jpg(resource.image).url
  def optimised_jpg(image, dragonfly_command)
    image.convert("-auto-orient").thumb(dragonfly_command).encode('jpg', "-strip -quality 75 -interlace Plane")
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

end
