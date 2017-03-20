/*jslint browser: true, indent: 2, todo: true, unparam: true */
/*global jQuery,Ornament */

(function (document, window, $) {

  "use strict";

  var Show = {

    // =========================================================================
    // Settings
    // =========================================================================

    listenerSelector: "[data-show]",
    inverseSelector: "[data-show-inverse]",
    disableSelector: "[data-show-disable]",
    destroySelector: "[data-show-destroy]",
    controlSeperator: "_&_",
    slideSpeed: "fast",

    // =========================================================================
    // Internal functions 
    // =========================================================================

    // Check if field is "checked"-able
    // (ie. if it's a radio or checkbox)
    _isInputCheckable: function($input){
      return $input.is("[type=checkbox]") || $input.is("[type=radio]");
    },

    // Disable fields (soft destroy)
    _disableFieldsIn: function($element) {
      if($element.is(Show.disableSelector)) {
        $element.find("input, select, textarea").prop("disabled", true);
      }
    },

    // Enable fields (soft destroy)
    _enableFieldsIn: function($element) {
      if($element.is(Show.disableSelector)) {
        $element.find("input, select, textarea").prop("disabled", false);
      }
    },

    // Hard destroy data in all fields inside an element
    _destroyDataIn: function($element) {
      if($element.is(Show.destroySelector)){
        $element.find("input").each(function(){
          var $input = $(this);
          if(Show._isInputCheckable($input)) {
            $input.prop("checked", false);
          } else {
            $input.val("");
          }
        });
        $element.find("select,textarea").each(function(){
          $(this).val("");
        });
      }
    },

    // Get input fields that the element should watch
    // eg. $("[data-show='thing']") will return $("#thing")
    _getTargetControlsFor: function($element) {
      var $controls = [];
      var showRules = $element.attr("data-show");
      // Create an array of required targets
      // Split on the control seperator
      if( showRules.indexOf(Show.controlSeperator) > -1 ) {
        var controlLabels = showRules.split(Show.controlSeperator);
      } else {
        var controlLabels = [showRules];
      }
      // Build the array
      if(controlLabels) {
        $.each(controlLabels, function(){
          $controls.push( $("#"+ this ) );
        });
        return $controls;
      } else {
        console.warn("[SHOWJS] No control labels found for element");
      }
    },

    // =========================================================================
    // Bind event listeners to inputs and show/hide on page load
    // =========================================================================

    _bindCheckbox: function($input, $allControls, $element, multipeControls) {
      var $siblingTargets= $("[name='"+$input.attr("name")+"']");
      var multipleControls = $allControls.length > 1;
      // check on target change
      $siblingTargets.on("change", function(){
        if(multipleControls) {
          Show.showHideCheckMultipleRadio($element, $allControls);
        } else {
          Show.showHideCheckRadio($input, $element);
        }
      });
      // check on page load
      if(multipleControls) {
        Show.showHideCheckMultipleRadio($element, $allControls, true);
      } else {
        Show.showHideCheckRadio($input, $element, true);
      }
    },

    _bindInput: function($input, $element) {
      // check on input update
      $input.on("keyup", function(){
        Show.showHideCheckInput($input, $element);
      });
      // check on page load
      Show.showHideCheckInput($input, $element, true);
    },

    _bindSelect: function($select, $element) {
      // check on select change
      $select.on("change", function(){
        Show.showHideCheckSelect($select, $element);
      });
      // check on page load
      Show.showHideCheckSelect($select, $element, true);
    },

    // =========================================================================
    // Checkers and matchers
    // =========================================================================

    // Check for select matches
    showHideCheckSelect: function($input, $element, instant) {
      instant = instant || false;
      var showField = $input.val() === $element.attr("data-show-option");
      Show.toggleElement($element, showField, instant);
    },

    // Check for radio or checkboxes
    showHideCheckRadio: function($input, $element, instant){
      instant = instant || false;
      // check if radio element is checked
      var showField = $input.prop("checked") === true;
      Show.toggleElement($element, showField, instant);
    },

    // Check for multiple radio or checkboxes
    showHideCheckMultipleRadio: function($element, $inputs, instant){
      instant = instant || false;

      var showField = false;
      var numberOfTargets = $inputs.length;
      var numberOfTargetsHit = 0;

      // loop through all controls
      $.each($inputs, function(){
        if($(this).prop("checked") === true) {
          numberOfTargetsHit++;
        }
      });

      // match any or all?
      if( $element.data("show-type") === "any") {
        showField = numberOfTargetsHit > 0;
      } else {
        showField = numberOfTargetsHit === numberOfTargets;
      }

      Show.toggleElement($element, showField, instant);
    },

    // check for input changes
    showHideCheckInput: function($input, $element, instant) {
      instant = instant || false;
      var showField = false;

      // check against the required value
      var valueToMatch = $element.data("show-input").toLowerCase();
      var valueLower = $input.val().toLowerCase();
      var showType = $element.data("show-type");

      // String matching types
      if(showType === "*") {
        // Show if there is anything in the input
        showField = valueLower.length > 0;
      } else if(showType === "any") {
        // Relative matching
        // ie. "hello" matches for "hello world"
        showField = valueLower.indexOf(valueToMatch) > -1;
      } else {
        // Exact matching
        showField = valueLower === valueToMatch;
      }

      Show.toggleElement($element, showField, instant);
    },

    // =========================================================================
    // Showing and hiding
    // =========================================================================

    show: function($element, instant){
      if(instant === true) {
        $element.show();
      } else {
        if(!$element.data("showing") === true) {
          $element.data({
            "hiding": false,
            "showing": true
          });
          $element.stop().slideDown(Show.slideSpeed, function(){
            $element.data("showing", false);
          });
        }
      }
      Show._enableFieldsIn($element);
    },

    hide: function($element, instant) {
      if(instant === true) {
        $element.hide();
      } else {
        if(!$element.data("hiding") === true) {
          $element.data({
            "hiding": true,
            "showing": false
          });
          $element.stop().slideUp(Show.slideSpeed, function(){
            $element.data("hiding", false);
          });
        }
      }
      // Destroy data
      Show._destroyDataIn($element);
      // Disable fields (soft destroy)
      Show._disableFieldsIn($element);
    },

    // Show or hide the field
    toggleElement: function($object, showObject, instant) {
      instant = instant || false;

      // apply inverse filter
      if($object.is(Show.inverseSelector)) {
        showObject = !showObject;
      }

      // show/hide field
      if(showObject) {
        Show.show($object, instant);
      } else {
        Show.hide($object, instant);
      }
    },

    // Show or hide everything that has [data-show]
    toggleAllElements: function() {
      Show.$listeners.each(function(){
        var $element = $(this);
        var $allControls = Show._getTargetControlsFor($element);

        // Count the number of required fields
        var numberOfTargetsHit = 0;

        // Loop through each of the targets
        $.each($allControls, function(){
          var $thisControl = $(this);

          // Radios and Checkboxes
          if($thisControl.is("[type=radio]") || $thisControl.is("[type=checkbox]")) {
            Show._bindCheckbox($thisControl, $allControls, $element);
          // Text Inputs
          } else if ($element.is("[data-show-input]")) {
            Show._bindInput($thisControl, $element);
          // Select Elements
          } else if ($element.is("[data-show-option]")) {
            Show._bindSelect($thisControl, $element);
          }
        });
      });
    },

    init: function(){
      Show.$listeners = $(Show.listenerSelector);
      Show.toggleAllElements();
    }

  }

  // Initialise via the Ornament API or fallback to jQuery
  if(Ornament && Ornament.Components) {
    Ornament.Components.Show = Show;
    Ornament.onLoad(function(){
      Show.init();
    });
  } else {
    $(function(){
      window.Show = Show;
      Show.init();
    })
  }

}(document, window, jQuery));