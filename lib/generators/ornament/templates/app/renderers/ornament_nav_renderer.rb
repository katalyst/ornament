# Custom simple-navigation renderer to add some enhancements 

class OrnamentNavRenderer < SimpleNavigation::Renderer::List

  include OrnamentHelper

  def render_icon(render_opts={})
    ac = ActionController::Base.new()
    ac.render_to_string(render_opts)
  end

  def render(item_container)
    # Add support for a dom_class attribute on the parent element
    item_container.dom_class = options.delete(:dom_class) if options.has_key?(:dom_class)
    item_container.dom_id = options.delete(:dom_id) if options.has_key?(:dom_id)
    super
  end

  private

  # Accessible converts parent links to buttons and adds
  # click-to-toggle data attributes
  def accessible
    true 
  end

  # Build out the key for an item based on the predefined key
  # and namespaced via the id_namespace option
  def build_item_key(item)
    if options[:id_namespace]
      "#{options[:id_namespace]}_#{item.key}"
    else
      item.key
    end
  end

  # Customised simple-navigation method
  # Building out custom navigation items
  def list_content(item_container)
    item_container.items.map { |item|
      li_options = item.html_options.except(:link)

      # ID namespace 
      if options[:id_namespace] 
        li_options[:id] = build_item_key(item)
      end

      # Adding the ARIA role tag to the list item to
      # supress the list semantics
      li_options[:role] = "presentation"

      # Build the tag for the link/button/span
      li_content = tag_for(item, item_container.level)
      if include_sub_navigation?(item)

        li_options[:class] = li_options[:class] || ""
        li_options[:class] += " has-children"

        # Build subnavigation with accessible considerations
        # if accessible is enabled
        subnav_container_options = {}
        subnav_container_options[:class] = "simple-navigation--nested"

        if accessible 
          subnav_container_options[:data] = {}
          subnav_container_options[:data][:toggle] = build_item_key(item)
          subnav_container_options[:data][:toggle_temporary] = ""
          li_content << content_tag(:div, render_sub_navigation_for(item), subnav_container_options)
        else
          # If not accessible, just generate sub_navigation like
          # normal
          li_content << content_tag(:div, render_sub_navigation_for(item), subnav_container_options)
        end
      end
      content_tag(:li, li_content, li_options)
    }.join
  end

  # Custom tag_for method to generate a button rather than a link
  # when there are nested links
  def tag_for(item, level)
    level = level || false

    # Get simple-navigation options
    item_options = options_for(item)
    item_options[:data] = item_options[:data] || {}

    # Add navigation data attributes for navigation.js 
    # accessibility
    if level && level.eql?(1)
      item_options[:data][:navigation_parent] = ""
    else
      item_options[:data][:navigation_item] = ""
      
      # Disabling tabindex on menu items
      if accessible
        item_options[:tabindex] = "-1"
      end
    end

    if accessible && include_sub_navigation?(item)
      # Add data-toggle attributes
      item_options[:data][:toggle_anchor] = build_item_key(item)
      item_options[:data][:toggle_timing] = "100"
      item_options[:data][:toggle_temporary_anchor] = ""

      # Render the button with all the options
      item_content = "#{item.name} #{icon('chevron_right')}"
      content_tag('button', item_content, item_options)
    else
      if suppress_link?(item)
        content_tag('span', item.name, item_options)
      else
        link_to(item.name, item.url, item_options)
      end
    end
  end

end
