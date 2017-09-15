# Custom simple-navigation renderer to add some enhancements 

class OrnamentNavRenderer < SimpleNavigation::Renderer::List

  def render(item_container)
    # Add support for a dom_class attribute on the parent element
    item_container.dom_class = options.delete(:dom_class) if options.has_key?(:dom_class)
    item_container.dom_id = options.delete(:dom_id) if options.has_key?(:dom_id)
    super
  end

  private

  def list_content(item_container)
    item_container.items.map { |item|
      li_options = item.html_options.except(:link)
      li_content = tag_for(item)
      if include_sub_navigation?(item)
        # Add custom has-children class if required 
        if item.sub_navigation && item.sub_navigation.items.length > 0
          li_options[:class] = li_options[:class] || ""
          li_options[:class] += " has-children"
        end
        li_content << render_sub_navigation_for(item)
      end
      content_tag(:li, li_content, li_options)
    }.join
  end

end
