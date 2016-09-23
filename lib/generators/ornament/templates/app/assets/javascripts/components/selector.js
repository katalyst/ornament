/*jslint browser: true, indent: 2, todo: true, unparam: true */
/*global jQuery,Ornament /*/

(function($){

  $.fn.extend({
    katSelector: function(options) {

      // TODO:
      // event to scroll to id
      // event to select id
      // search for multiple fields (eg. category, etc.)

      var defaults = {
        shadowTopClass       : "shadow-top",
        shadowBottomClass    : "shadow-bottom",
        activeListClass      : "selector--list--active",
        preventEnter         : true, 
        list                 : null,
        hiddenField          : null,
        checkbox             : false,
        inputName            : "selector",
        template             : null,
        onChange             : null,
        onListUpdate         : null
      }

      var options = $.extend(defaults, options);

      // Build up a selector from an input field
      var scaffoldSelector = function($input) {
        // Abort if already initialised
        if($input.hasClass("selector__init")) {
          return false;
        }
        $selector = $("<div class='selector' />");
        $selectorSearch = $("<div class='selector--search' />");
        $selectorPane = $("<div class='selector--pane' />");
        $selectorList = $("<ul class='selector--list' />");
        $selectorPaneParent = $("<div class='selector--pane--wrapper' />");
        $selectorPane.append($selectorList);
        $selector.append($selectorSearch);
        $selectorPaneParent.append($selectorPane);
        $selector.append($selectorPaneParent);
        $input.after($selector);
        $selectorSearch.append($input);
        $input.addClass("selector__init");
      }

      // Add top/bottom shadows when necessary
      var updatePaneShadows = function($pane){
        var listHeight = $pane.find("ul").outerHeight();
        var paneHeight = $pane.outerHeight();
        var scrollPosition = $pane.scrollTop();
        var lowestScrollPosition = listHeight - paneHeight;
        var $paneParent = $pane.parent();

        // top shadow check
        if(scrollPosition <= 0) {
          $paneParent.removeClass(options.shadowTopClass);
        } else {
          $paneParent.addClass(options.shadowTopClass);
        }
        // bottom shadow check
        if(scrollPosition >= lowestScrollPosition) {
          $paneParent.removeClass(options.shadowBottomClass);
        } else {
          $paneParent.addClass(options.shadowBottomClass);
        }
      }

      // Send value to a hidden field if needed
      var sendValueToHiddenField = function($field, $selector) {
        if(options.hiddenField) {
          $field.val(getSelectorValue($selector));
        } else {
          return false;
        }
      }

      // Filter a list with an input string
      var filterResults = function(list, inputString) {
        return _.select(list, function(listItem) {

          item = listItem.title;
          if(item == undefined) {
            item = listItem.name.toLowerCase();
          } else {
            item = listItem.title.toLowerCase();
          }

          return item != undefined && item.indexOf(inputString.toLowerCase()) > -1;
        });
      }

      // return a filtered list based on search input
      var filteredList = function($selector, list) {
        var currentInput = $selector.find(".selector--search input");
        if(currentInput.val() == "") {
          return list;
        } else {
          return filterResults(list, currentInput.val());
        }
      }

      // Update the selector with a custom value
      var reverseUpdateSelector = function($selector, value) {
        // find the matching id and select it
        var $inputToUpdate = $selector.find("input[value="+value+"]");
        var $label = $inputToUpdate.closest("label");
        $inputToUpdate.prop("checked", true);
        $label.addClass(options.activeListClass);
        // update data attribute
        $selector.attr("data-value", value);
      }

      // Scroll to a selected item
      // used on page load to show the selected item in a scrollable list
      var scrollToSelectedItem = function($selector) {
        // find selected item
        var $input = $selector.find("input:checked");

        if($input.length) {
          var $label = $input.closest("label");
          var $pane = $selector.find(".selector--pane");

          // find offset
          var labelOffset = $label.position().top;

          if(labelOffset == 0) {
            return false;
          }

          // scroll to position
          $selector.find(".selector--pane").animate({
           scrollTop: labelOffset
          }, 0);
        }
      }

      // Send value to selector search field
      var sendValueToSelectorSearch = function($selector) {
        var $pane = $selector.find(".selector--pane");
        var $input = $selector.find(".selector--search input");
        var $label = $pane.find("input:checked").closest("label");
        var $labelName = $label.find("[data-selector-name]");
        if($labelName.length) {
          var selectedText = $label.find("[data-selector-name]").text();
        } else {
          var selectedText = "";
        }
        // $input.val(selectedText);
      }

      // Update a selector with a new list
      var updateSelector = function($selector, list) {
        var $listElement = $selector.find(".selector--list");
        var listElementName = $listElement.attr("data-selector-name");
        var foundAMatch = false;

        // empty list element
        $listElement.html("");

        if(list.length) {

          // loop over list and add to UL
          $.each(list, function(i){

            var fallback = this.name.toLowerCase();
            var slug = fallback;
            var sendValue = fallback;

            if (this.slug) {
              var slug = this.slug;
            }

            if(this.value) {
              var sendValue = this.value;
            }

            var label = $("<label />").attr({
              "for": options.inputName + "__" + slug
            });

            var item = $("<li />");

            var option = $("<input />").attr({
              type: (options.checkbox ? "checkbox" : "radio"),
              id: options.inputName + "__" + slug,
              value: sendValue,
              name: options.inputName
            });

            // Auto-select an item if matching
            var title = this.title || this.name;
            if( $selector.find(".selector--search input").val() == title ) {
              option.prop("checked", true);
              label.addClass(options.activeListClass);
              foundAMatch = true;
            }

            // Build up our item
            label.append(option);

            if(options.template) {
              var itemObject = this;
              var template = options.template(itemObject, item, label, title, option, $selector);
            } else {
              var template = "<span data-selector-name>"+title+"</span>";
            }

            label.append("<div class='display-table-cell'>" + template + "</div>");
            label.wrapInner("<div class='display-table' />");
            item.append(label);
            item.find("input").wrap("<div class='display-table-cell' />");
            $listElement.append(item);
          });

        } else {
          var $noResults = $("<li />").addClass("selector--no-results").text("No results");
          $listElement.append($noResults);
        }

        // Show/hide shadows as necessary
        updatePaneShadows($selector.find(".selector--pane"));

        // Callback
        if(options.onListUpdate) {
          options.onListUpdate();
        }
      }

      // Update the data value for a selector when making a selection
      var updateSelectorValue = function($selector) {
        var $input = $selector.find("label input:checked");
        var $labels = $selector.find(".selector--list label");

        if($input.length) {
          var value = $input.val();
          var $selectedLabel = $input.closest("label");

          // update classes
          $labels.removeClass(options.activeListClass);
          $selectedLabel.addClass(options.activeListClass);
        } else {
          $labels.removeClass(options.activeListClass);
          value = "";
        }

        // send value to data attribute
        $selector.attr("data-value", value);

        // send value to search field
        sendValueToSelectorSearch($selector);

        // Callback
        if(options.onChange) {
          options.onChange($selectedLabel, value, $selector);
        }
      }

      // Get the value of the selector with a fallback to an empty value
      var getSelectorValue = function($selector) {
        if($selector.attr("data-value")) {
          return $selector.attr("data-value");
        } else {
          return "";
        }
      }

      // Apply to each selector and create bindings
      return this.each(function() {

        var $selectorField = $(this);

        // scaffold up the selector box
        scaffoldSelector($selectorField);

        var $selector = $selectorField.closest(".selector");
        var $selectorSearch = $selector.children(".selector--search");
        var $selectorPane = $selector.find(".selector--pane");

        // Picking a selection
        $selector.delegate("label input").on("change", function(){
          sendValueToSelectorSearch($selector);
          updateSelectorValue($selector);
          if(options.hiddenField) {
            sendValueToHiddenField(options.hiddenField, $selector);
          }
        });

        // Searching updates lists
        $selectorSearch.delegate("input").on("keyup", function(){
          updateSelector($selector, filteredList($selector, options.list));
          updateSelectorValue($selector);
          if(options.hiddenField) {
            sendValueToHiddenField(options.hiddenField, $selector);
          }
        });

        // Preventing enter button presses
        $selectorSearch.delegate("input").on("keypress", function(e){
          if(e.which == 13) {
            return false;
          }
        });

        // Update selector on page load
        updateSelector($selector, filteredList($selector, options.list));

        // If hidden field is available and has a value, send the value to the selector
        if( options.hiddenField && options.hiddenField.val() ) {
          reverseUpdateSelector($selector, options.hiddenField.val());
          scrollToSelectedItem($selector);
          sendValueToSelectorSearch($selector);
        }

        // Scrolling the selector panes to add/remove shadow classes
        $selectorPane.on("scroll", function(){
          updatePaneShadows($selectorPane);
        });

        // Bind events
        $selector.bind("selector:shadows", function(){
          updatePaneShadows($selectorPane);
        });

      });

    }
  });

})(jQuery);