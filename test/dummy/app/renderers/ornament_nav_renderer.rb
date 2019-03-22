#
# Ornament SimpleNavigation Renderer
#
# Custom renderer to add some common enhancements
#
# Use basic version just renders a standard UL:
# 
# render_navigation({
#   renderer: ornament_menu,
#   levels: 1..3,
#   expand_all: true,
# })
#
# Custom options:
# 
# id_namespace: "string"
# Namespace the `id` attributes to prevent duplicate IDs when navitems
# appear on the same page more than once
#
# class_prefix: "string"
# Namespace the classes to provide unique styling options without having to
# worry about naming collisions or specificity
#
# toggles: true || "split"
# Warning: This requires the ornament library `toggle`
# Make parent links act as `button` elements with toggles to show child
# menus
# If set to true, the entire link acts as the toggle button
# If set to "split", there will be a second button next to the link
# that will act as the toggle
#
# icons: true || { expand: icon("plus"), collapse: icon("minus") }
# Renders SVG icons inside parent links/toggle buttons
# If set to true, the default chevron icons will be used
# If set to a hash it will use the `expand` when closed and `collapse`
# when opened

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
    item_container.dom_class += " " + get_class(has_icons ? "__with-icons" : "__without-icons")
    item_container.dom_class += " " + get_class(has_toggles ? "__with-toggles" : "__without-toggles")
    item_container.dom_class += " level-#{item_container.level}"
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

  # Build a class with either an optional prefix or the default
  # get_class("--my-class") => "simple-navigation--my-class"
  def get_class(className)
    prefix = options[:class_prefix] || "simple-navigation"
    "#{prefix}#{className}"
  end

  # Helper to build out markup for icons
  # Will return HTML
  def get_icons

    # Get icons from settings
    icons = options[:icons]

    # Return nothing if icons is false (default)
    # To continue add the icons property to your navigation
    if !icons
      return
    end
    
    # If icons = true, we need to build a quick hash of the expand/collapse
    # icons to match the custom icon format
    if icons.eql?(true)
      icons = { 
        expand: icon('chevron_right'),
      }
    end

    # Store the icons as variables
    expand_icon = icons[:expand]
    if icons[:collapse]
      collapse_icon = icons[:collapse]
    end

    # If there's a collapse icon, we want to render both icons
    # CSS can be used to show/hide the exapnded/collapsed icons
    if collapse_icon
      content_tag(:div, (
        content_tag(:div, expand_icon, class: get_class("--icon--expand")) + 
        (content_tag(:div, collapse_icon, class: get_class("--icon--collapse")) if collapse_icon)
      ), class: get_class("--icon"));

    # If there's only an expand icon, we simplify the markup
    else
      content_tag(:div, expand_icon, class: get_class("--icon"));
    end
  end

  # =========================================================================
  # Flags and settings determined by wrapper
  # =========================================================================

  # Flag to check if toggles should be present
  # toggles: true
  def has_toggles
    options.has_key?(:toggles)
  end

  # Flag to see if toggles should be split
  # toggles: "split"
  def has_split_toggles
    options.has_key?(:toggles) && options[:toggles].eql?("split")
  end

  # Flag to check if the item should be toggled open by default
  def has_toggle_default_open(item)
    options.has_key?(:open_active_toggle) && item.selected?
  end

  # Flag to check if temporary toggles should be present
  # temporary_toggles: true
  def has_temporary_toggles
    options.has_key?(:temporary_toggles)
  end

  # Flag to check if icons should be present
  # icons: true
  def has_icons
    options.has_key?(:icons)
  end

  # Flag to check if descriptions should show
  def has_descriptions
    options[:descriptions]
  end

  # Flag to check if keyboard access attributes should be added
  def accessible
    has_toggles
  end

  # =========================================================================
  # List item renderer
  # =========================================================================

  # Customised simple-navigation method
  # Building out custom navigation items
  def list_content(item_container)

    item_container.items.map { |item|
      li_options = item.html_options.except(:link, :description)

      # ID namespace 
      if options[:id_namespace] 
        li_options[:id] = build_item_key(item)
      end

      # Adding the ARIA role tag to the list item to
      # supress the list semantics
      li_options[:role] = "presentation"

      # Build the tag for the link/button/span
      li_content = tag_for(item, item_container.level)
      li_options[:class] = li_options[:class] || ""

      # Check if this item has children
      if include_sub_navigation?(item)
        li_options[:class] += " has-children"

        li_options[:data] = li_options[:data] ||{}
        if has_split_toggles
          li_options[:data][:split_icon_parent] = ""
        end

        # Build subnavigation with accessible considerations
        # if accessible is enabled
        subnav_container_options = {}
        subnav_container_options[:class] = get_class("--nested")
        subnav_container_options[:data] ||= {}
        subnav_container_options[:data][:navigation_nested] = ""
        subnav_container_options[:data] ||= {}

        if has_toggles
          subnav_container_options[:data][:toggle] = build_item_key(item)
          subnav_container_options[:data][:toggle_temporary] = "" if has_temporary_toggles
          subnav_container_options[:data][:toggle_default] = "" if has_toggle_default_open(item)
        end

        if !has_toggles
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
    link_options = options_for(item)
    link_options[:data] ||= {}

    # Store toggle options
    toggle_options = {}
    toggle_options[:data] ||= {}
    toggle_options[:class] ||= ""
    toggle_options[:title] = "Open menu"

    if accessible
      toggle_options[:data][:navigation_level] = level
      link_options[:data][:navigation_level] = level
    end

    if level && level > 1 && accessible
      link_options[:data][:navigation_item] = ""
      toggle_options[:data][:navigation_item] = ""
    end

    # Add navigation data attributes for navigation.js 
    # accessibility
    if include_sub_navigation?(item) && accessible
      link_options[:data][:navigation_parent] = ""
      toggle_options[:data][:navigation_parent] = ""
    end

    item_content = item.name

    # Add description to link item
    if has_descriptions
      description = item.html_options[:description]
      show_description = has_descriptions.eql?(true) || has_descriptions.include?(level)
      if has_toggles
        item_content = "<span>#{item_content}<span class='#{get_class("--item-description")}'>#{description}</span></span>" if show_description
      else
        link_options["data-description"] = description
      end
    end

    # Parent links
    if include_sub_navigation?(item)
      
      # Add data-toggle attributes
      if has_toggles
        toggle_options[:data][:toggle_anchor] = build_item_key(item)
        toggle_options[:data][:toggle_timing] = "100"
        toggle_options[:data][:toggle_temporary_anchor] = "" if has_temporary_toggles
        toggle_options[:class] += "active" if has_toggle_default_open(item)
      end

      if has_icons && !has_split_toggles
        item_content = "#{item_content} #{get_icons()}"
      end

      # Split parents have a link + button
      if has_split_toggles
        content_tag(:div, (
          link_to(content_tag(:span, item_content), item.url, link_options) +
          content_tag('button', get_icons(), toggle_options)
        ), class: get_class("--split-parent"))

      # Non-split parents have just a button
      elsif has_toggles
        content_tag('button', content_tag(:span, item_content), link_options.merge(toggle_options))
      else
        link_to(content_tag(:span, item_content), item.url, link_options)
      end

    # Non-parents get either just a span (for no link) or a link
    else
      if suppress_link?(item)
        content_tag('span', item_content, link_options)
      else
        link_to(content_tag(:span, item_content), item.url, link_options)
      end
    end
  end

end
