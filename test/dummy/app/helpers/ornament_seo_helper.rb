module OrnamentSeoHelper

  # Function to convert an image to absolute URL
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

  # Fix for non-seo-enabled sites
  if !defined?(seo)
    def seo(value)
      false
    end
  end

end