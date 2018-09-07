# Custom simple-navigation renderer to add some enhancements 

class OrnamentNavRenderer < SimpleNavigation::Renderer::List
  include OrnamentSvgHelper

  # =========================================================================
  # Render
  # =========================================================================

  # The render method for parent lists
  # ie. the <ul> elements
  def render(item_container)
    # Add support for a dom_class attribute on the parent element
    item_container.dom_class = ""
    item_container.dom_class = options.delete(:dom_class) if options.has_key?(:dom_class)
    item_container.dom_id = options.delete(:dom_id) if options.has_key?(:dom_id)
    item_container.dom_class += has_icons ? " simple-navigation__with-icons" : " simple-navigation__without-icons"
    item_container.dom_class += has_toggles ? " simple-navigation__with-toggles" : " simple-navigation__without-toggles"
    super
  end

  private

  # =========================================================================
  # Helpers
  # =========================================================================

  # This is a little helper method that will assist the Ornament `icon()` helper to work
  # in the context of this renderer
  def render_icon(render_opts={})
    ac = ActionController::Base.new()
    ac.render_to_string(render_opts)
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

  # =========================================================================
  # Flags and settings determined by wrapper
  # =========================================================================

  def accessible
    true 
  end

  def has_toggles
    !is_basic &&
    !(options[:no_toggle] && options[:no_toggle].eql?(true))
  end

  def has_icons
    !is_basic &&
    !(options[:no_icons] && options[:no_icons].eql?(true))
  end

  def is_basic
    options[:basic] && options[:basic].eql?(true)
  end

  # =========================================================================
  # List item renderer
  # =========================================================================

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
          if has_toggles
            subnav_container_options[:data][:toggle] = build_item_key(item)
            subnav_container_options[:data][:toggle_temporary] = ""
          end
        end

        if is_basic
          li_content << render_sub_navigation_for(item)
        else
          li_content << content_tag(:div, render_sub_navigation_for(item), subnav_container_options)
        end
        
      end
      content_tag(:li, li_content, li_options)
    }.join
  end

  # =========================================================================
  # Link/button renderer
  # =========================================================================

  # Custom tag_for method to generate a button rather than a link
  # when there are nested links
  def tag_for(item, level)
    level = level || false

    # Get simple-navigation options
    item_options = options_for(item)
    item_options[:data] = item_options[:data] || {}

    if level && level > 1
      item_options[:data][:navigation_item] = ""
    end

    # Add navigation data attributes for navigation.js 
    # accessibility
    if include_sub_navigation?(item)
      item_options[:data][:navigation_parent] = ""
    end

    if accessible && include_sub_navigation?(item)
      # Add data-toggle attributes
      if has_toggles
        item_options[:data][:toggle_anchor] = build_item_key(item)
        item_options[:data][:toggle_timing] = "100"
        item_options[:data][:toggle_temporary_anchor] = ""
      end

      # Render the button with all the options
      if has_icons
        item_content = "#{item.name} #{icon('chevron_right')}"
      else
        item_content = item.name
      end
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
