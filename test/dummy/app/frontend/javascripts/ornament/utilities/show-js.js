/*

  Show.js 2.0.0
  Requires:
    - nodelist.foreach
    - Ornament.slideUp/slideDown
    - Ornament.triggerEvent

*/

(function (document, window, Ornament, Utils) {
  "use strict";

  var Show = {

    settings: {
      show: "data-show",
      required: "data-show-required",
      inverse: "data-show-inverse",
      disable: "data-show-disable",
      destroy: "data-show-destroy",
      seperator: "_&_",
      slideSpeed: 200,
      slideUp: Ornament.slideUp,
      slideDown: Ornament.slideDown,
      triggerEvent: Ornament.triggerEvent
    },

    // =========================================================================
    // Interrogate nodes to determine what settings are required for showing
    // =========================================================================

    getFieldIdsFromString: function(string) {
      return string.split(Show.settings.seperator);
    },

    getElementsFromIds: function(ids) {
      return ids.map(function(id) {
        return document.getElementById(id);
      });
    },

    getElementsFromScanrio: function(string) {
      return Show.getElementsFromIds(Show.getFieldIdsFromString(string));
    },

    getInputFieldsIn: function($node) {
      return $node.querySelectorAll("input,textarea,select");
    },

    isString: function($node) {
      return ($node.nodeName && $node.nodeName === "textarea") ||
             ($node.type &&
                $node.type === "text" ||
                $node.type === "number" ||
                $node.type === "search"
             );
    },

    // =========================================================================
    // Build a settings object from a single $node
    // =========================================================================

    getSettingsFor: function($node) {
      var settings = {
        $node: $node,
        scenario: false
      };
      if($node.hasAttribute(Show.settings.show)) {
        settings.scenario = $node.getAttribute(Show.settings.show);
      }
      if($node.hasAttribute(Show.settings.required)) {
        settings.scenario = $node.getAttribute(Show.settings.required);
      }
      if(!settings.scenario) {
        return settings;
      }
      settings.requiresAny = $node.hasAttribute("data-show-type") && $node.getAttribute("data-show-type") === "any";
      settings.inverse = $node.hasAttribute(Show.settings.inverse);
      settings.destroy = $node.hasAttribute(Show.settings.destroy);
      settings.disable = $node.hasAttribute(Show.settings.disable);
      settings.$controls = Show.getElementsFromScanrio(settings.scenario);
      settings.selectByText = $node.hasAttribute("data-show-option-text");
      if($node.hasAttribute("data-show-option")) {
        settings.selectOption = $node.getAttribute("data-show-option");
      }
      if($node.hasAttribute("data-show-input")) {
        settings.stringMatch = $node.getAttribute("data-show-input");
      }
      return settings;
    },

    // =========================================================================
    // Test a settings object to see if it should show or not
    // =========================================================================

    test: function(settings) {
      // Assume the test has failed by default
      var show = false;

      // We're going to be tracking how many matches we've accomplished
      // throughout our test
      // In the case of "must meet ALL requirements" we need to make sure
      // that the number of matches is the same as the number of controls
      // In the case of "must meet ANY requirement" this is ignored
      var matches = 0;

      // Loop over each control and run the test
      settings.$controls.map(function($control, controlIndex) {

        // Little helper function to increment matches and mark show as true
        var matched = function(){
          show = true;
          matches++;
        }

        // Store the node type and value of this control for various later tests
        var nodeName = $control.nodeName.toLowerCase();
        var value = $control.value;

        // String type matching
        if(Show.isString($control)) {

          // If there's a value to match against
          if(settings.stringMatch) {

            // Fuzzy match
            if(settings.requiresAny) {
              if(value.indexOf(settings.stringMatch) > -1) {
                matched();
              }

            // Exact match
            } else {
              if(value === settings.stringMatch) {
                matched();
              }
            }

          // If any value is required
          } else if($control.value) {
            matched();
          }
          
        // Checkbox/Radio checking
        } else if(nodeName === "input") {

          // is it checked?
          if($control.checked) {
            matched();
          }

        // Select matching
        } else if(nodeName === "select") {

          // If specific selection required
          if(settings.selectOption) {

            // selectOption can have seperators in it (_&_), so we can split on that 
            // and store that as an array of options
            // If there is no seperator in the string, it will still result in an array,
            // just an array of one. This makes testing much more streamlined as we are
            // always testing against an array.
            var options = settings.selectOption.split(Show.settings.seperator);

            // If selectByText is true, we need look at the label of the selected option
            // rather than the value
            var toCheck = settings.selectByText ? $control.options[$control.selectedIndex].innerHTML : value;

            // If there is more than one option and more than one control the matches 
            // need to be indexed,
            // eg. select1 matches option1, select2 matches option2 etc.
            if(options.length > 1 && settings.$controls.length > 1) {
              // If there aren't enough options, assume the value needs to be "true"
              var optionRequired = options[controlIndex] || "true";
              if(optionRequired === toCheck) {
                matched();
              }

            // If there's only one control, we just need to check the presence of
            // the value in the options array
            } else {
              if(options.indexOf(toCheck) > -1) {
                matched();
              }
            }

          // If any seletion required
          } else {
            if(value) {
              matched();
            }
          }

        // None of the top-level type matches have worked, is this even an input?
        // Is there an input we haven't thought of to test against?
        // If there are other types of control tests you would like to perform
        // put them here.
        } else {
          console.warn("[ShowJS] Unknown test for the following node:", $control);
        }
      });

      // If requires all fields to match, have all controls matched?
      if(!settings.requiresAny) {
        show = settings.$controls.length === matches;
      }

      // If inverse, swap the result
      if(settings.inverse) {
        show = !show;
      }

      return show;
    },

    // =========================================================================
    // Toggle logic
    // =========================================================================

    toggle: function(show, settings, immediate) {
      Show.settings.triggerEvent(settings.$node, "showjs:toggling");
      if(show) {
        Show.show(settings, immediate);
      } else {
        Show.hide(settings, immediate);
      }
    },

    show: function(settings, immediate){
      Show.settings.triggerEvent(settings.$node, "showjs:showing");
      Show.beforeShow(settings);
      if(immediate) {
        settings.$node.style.display = "block";
        Show.afterShow(settings);
      } else {
        Show.settings.slideDown(settings.$node, Show.settings.slideSpeed, function(){
          Show.afterShow(settings);
        });
      }
    },

    hide: function(settings, immediate) {
      Show.settings.triggerEvent(settings.$node, "showjs:hiding");
      Show.beforeHide(settings);
      if(immediate) {
        settings.$node.style.display = "none";
        Show.afterHide(settings);
      } else {
        Show.settings.slideUp(settings.$node, Show.settings.slideSpeed, function(){
          Show.afterHide(settings);
        });
      }
    },

    // =========================================================================
    // Callbacks and hooks
    // =========================================================================

    beforeShow: function(settings) {
      Show.settings.triggerEvent(settings.$node, "showjs:before-show");

      // Enable fields
      if(settings.disable) {
        Show.enableFieldsIn(settings.$node);
      }

      if(Show.settings.beforeShow) {
        Show.settings.beforeShow(settings);
      }
    },

    beforeHide: function(settings){
      Show.settings.triggerEvent(settings.$node, "showjs:before-hide");

      // Destroy or disable fields
      if(settings.destroy) {
        Show.destroyDataIn(settings.$node);
      }
      if(settings.disable) {
        Show.disableFieldsIn(settings.$node);
      }

      if(Show.settings.beforeHide) {
        Show.settings.beforeHide(settings);
      }
    },

    afterShow: function(settings){
      Show.settings.triggerEvent(settings.$node, "showjs:after-show");
      Show.settings.triggerEvent(settings.$node, "showjs:toggled");

      if(Show.settings.afterShow) {
        Show.settings.afterShow(settings);
      }
    },

    afterHide: function(settings){
      Show.settings.triggerEvent(settings.$node, "showjs:after-hide");
      Show.settings.triggerEvent(settings.$node, "showjs:toggled");
      
      if(Show.settings.afterHide) {
        Show.settings.afterHide(settings);
      }
    },

    destroyDataIn: function($node) {
      Show.getInputFieldsIn($node).forEach(function($input){
        if($input.type && ($input.type === "radio" || $input.type === "checkbox")) {
          $input.checked = false;
        } else {
          $input.value = "";
        }
      });
    },

    disableFieldsIn: function($node) {
      Show.getInputFieldsIn($node).forEach(function($input){
        $input.disabled = true;
      });
    },

    enableFieldsIn: function($node) {
      Show.getInputFieldsIn($node).forEach(function($input){
        $input.disabled = false;
      });
    },

    // =========================================================================
    // Bind all elements on the page
    // Show/hide the fields by default
    // =========================================================================

    bind: function($node, type){
      var settings = Show.getSettingsFor($node);
      if(!settings.scenario) {
        console.warn("[SHOWJS] Could not determine target rules from element");
        return;
      }

      Show.toggle(Show.test(settings), settings, true);

      var debug = settings.scenario === "form_multiple_and_raphael_&_form_multiple_and_donatello" //false;

      // If you are watching for two elements that have the same name (eg. two different
      // checkboxes in the same name group) then you could end up biding multiple times
      // to avoid this we can store the elements we've already bound for this watcher
      var elementsBound = [];

      settings.$controls.forEach(function($control){
        if(elementsBound.indexOf($control) > -1) {
          return;
        }

        
        // Events - add keyup event if string type
        var changeEvent = "change";
        if(Show.isString($control)) {
          changeEvent = "change keyup";
        }

        // Set up listener
        var listener = function($control){
          Show.toggle(Show.test(settings), settings);
        }

        // Bind event to this control
        Ornament.U.bindOnce($control, changeEvent, function(){
          listener($control);
        });

        // Push to watch list
        elementsBound.push($control);

        if($control.name) {
          var $siblingFields = document.querySelectorAll("[name='" + $control.name + "']");
          $siblingFields.forEach(function($sibling) {
            // Don't bind again if already bound above
            if(elementsBound.indexOf($sibling) > -1) {
              return;
            }

            // Bind on sibling
            Ornament.U.bindOnce($sibling, changeEvent, function(){
              listener($sibling);
            });

            // Push to watch list
            elementsBound.push($sibling);
          });
        }
      });
    },

    // =========================================================================
    // Initialise
    // =========================================================================

    init: function(){

      // Merge settings from the window object
      if(window.showJsSettings) {
        Object.keys(showJsSettings).map(function(setting) {
          windowSetting = showJsSettings[setting];
          Show.settings[setting] = windowSetting;
        });
      }

      // Bind all regular show elements
      document.querySelectorAll("[" + Show.settings.show + "]").forEach(function($node) {
        Show.bind($node, "show");
      });

      // Bind all required show elements
      document.querySelectorAll("[" + Show.settings.required + "]").forEach(function($node){
        Show.bind($node, "required");
      });
    }

  }

  Ornament.registerComponent("Show", Show);

}(document, window, Ornament, Ornament.Utilities));