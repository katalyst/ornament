module OrnamentSeoHelper

  # Polyfill for missing seo helper from Koi
  if !defined?(seo)
    def seo(value)
      false
    end
  end

  # Meta helper
  #
  # This will take a hash of keys and values and populate
  # a system of yields for meta content
  #
  # Example usage:
  #
  # meta({
  #   title: resource.to_s,
  #   description: resource.short_description,
  #   image: resource.image,
  #   facebook: {
  #     title: "Custom facebook title",
  #   }
  # })
  #
  # What does it actually do?
  #
  # This will yield the value to the hash key, eg:
  # title: "Test title" = yeild(:meta_title) = "Test title"
  # Nested hashes will join, eg:
  # facebook[:title] = "Facebook title" = yeild(:meta_facebook_title) = "Facebook title"
  # 
  def meta(options={}, context="")
    options.each do |key,value|
      if key.eql?(:facebook)
        meta(value, "facebook_")
      elsif key.eql?(:twitter)
        meta(value, "twitter_")
      else
        full_key = "meta_#{context}#{key}".to_sym
        formatted_value = value
    
        # Builtin formatters
        formatted_value = share_description(value) if key.eql?(:description)
        formatted_value = absolute_url(value) if key.eql?(:url)

        content_for full_key, formatted_value
      end
    end
  end

  # Append | <postfix> to the end of title if necessary
  def meta_postfixer(title, postfix, seperator=" - ")
    if !postfix.blank? && !title.include?(postfix)
      raw "#{title}#{seperator}#{postfix}"
    else
      title
    end
  end

  # Share image helper
  #
  # Can just be a static asset
  # share_image("/assets/my-share-image.jpg")
  #
  # Can be a dragonfly asset
  # share_image(resource.banner_image)
  #
  # Can be provided a custom crop
  # share_image(resource.banner_image, "800x600")
  #
  def share_image(resource, crop="1200x630#")

    # If it's just a URL, return the URL
    if resource.is_a?(String)
      absolute_url(resource)

    # If it's an image asset, return a cropped asset
    else
      resource.thumb(crop).url
    end
  end

  # Function to convert an URL to absolute URL
  # Mostly used for images
  def absolute_url(url)
    if url && !url.include?("http") 
      URI.join(root_url, url)
    else
      url
    end
  end

  # Method to clean input from Koi 
  def clean_share_input(input) 
    raw(input).gsub(/"/, '\'')
  end

  # Format share descriptions a bit nicer by converting <br> and
  # <br /> to spaces.
  def share_description(value) 
    raw(value).gsub("<br>", " ").gsub("<br />", " ")
  end

end