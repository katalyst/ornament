module OrnamentGoogleMapsHelper

  # Sign a URL for Google Maps Service
  def ornament_google_signer(url, api_key, api_secret)
    uri = URI(url)
    url_to_sign = "#{uri.path}?#{uri.query}"
    decoded_key = Base64.urlsafe_decode64(api_secret)
    sha1 = OpenSSL::Digest.new('sha1')
    signature = OpenSSL::HMAC.digest(sha1, decoded_key, url_to_sign)
    Base64.urlsafe_encode64(signature)
  end

  # Signed StaticMaps Helper
  # static_map(location, zoom: 14, size: "300x150")
  def static_map(resource, options={})
    # config
    api_key = ""

    # high trafficked maps require maps to be signed by
    # Google, enable signing and add the secret to sort 
    # it all out for you
    api_secret = ""
    signed = false

    # settings for this map
    location = "#{resource.latitude},#{resource.longitude}"
    pin_path = "https://www.example.com.au/assets/"
    pin = "#{pin_path}pin.png"
    zoom = options[:zoom] || 17
    size = options[:size] || "470x215"
    markers = ""
    markers += "markers=icon:#{pin}%7C#{location}"

    # keys and address
    url = "https://maps.googleapis.com/maps/api/staticmap?center=#{location}&zoom=#{zoom}&size=#{size}&maptype=roadmap&#{markers}&key=#{api_key}"
    if signed
      encoded_signature = ornament_google_signer(url, api_key, api_secret)
      url += "&signature=#{encoded_signature}"
    end

    url
  end

end
