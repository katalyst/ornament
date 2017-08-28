module OrnamentKoiHelper

  # Koi Page key traversal helpers
  # Figures out if a navitem is nested under a key
  # traverse_for_key(@page.get_nav_item, "contact") -> true
  def traverse_for_key(nav_item, key)
    if nav_item.key.eql?(key)
      true
    else
      nav_item.parent ? traverse_for_key(nav_item.parent, key) : nil
    end
  end

  # Koi Page key traversal helper to look for nearest key that matches
  # a list of specific keys
  # traverse_for_nearest_navigation_key(@page.get_nav_item) -> "contact"
  def traverse_for_nearest_navigation_key(nav_item)
    if nav_item.key.include?(["header_navigation", "footer_navigation"])
      nav_item.key
    else
      nav_item.parent ? traverse_for_nearest_navigation_key(nav_item.parent) : nil
    end
  end

  # Find a Koi Site Setting and return the value
  def get_koi_site_setting(setting)
    if defined?(Translation)
      Translation.find_by_key(setting).try(:value)
    end
  end

end