/*jslint browser: true, indent: 2, todo: true, unparam: true */
/*global jQuery,Ornament */

(function (document, window, $) {

  "use strict";

  $(document).on("ornament:refresh", function () {

    // SETTINGS
    var $showListeners, controlSeperator;
    $showListeners = $("[data-show]");
    controlSeperator = "_&_";

    var showHideType = function($field) {

    }

    var showHideField = function($field, showField, instant){
      instant = instant || false;

      // show/hide field
      if(showField) {
        if(instant == true) {
          $field.show();
        } else {
          $field.slideDown('fast');
        }
      } else {
        if(instant == true) {
          $field.hide();
        } else {
          $field.slideUp('fast');
        }
      }
    }

    // check for select matches
    var showHideCheckSelect = function($target, $field, instant) {
      var showField = false;
      instant = instant || false;

      if( $target.val() == $field.attr("data-show-option") ) {
        showField = true;
      } else {
        showField = false;
      }

      showHideField($field, showField, instant);
    }

    // check for radio or checkboxes
    var showHideCheckRadio = function($target, $field, instant){
      var showField = false;
      instant = instant || false;

      // check if radio element is checked
      if( $target.prop("checked") === true ) {
        showField = true;
      } else {
        showField = false;
      }

      showHideField($field, showField, instant);
      // return showField;
    }

    // check for radio or checkboxes
    var showHideCheckMultipleRadio = function($target, $field, $showTargets, instant){
      instant = instant || false;

      var showField = false;
      var numberOfTargets = $showTargets.length;
      var numberOfTargetsHit = 0;

      // loop through all controls
      $.each($showTargets, function(){
        var $thisTarget = $(this);
        if( $thisTarget.prop("checked") === true ) {
          numberOfTargetsHit++;
        }
      });

      if( $field.data("show-type") == "any") {
        if(numberOfTargetsHit > 0) {
          showField = true;
        } else {
          showField = false;
        }
      } else {
        if(numberOfTargetsHit == numberOfTargets) {
          showField = true;
        } else {
          showField = false;
        }
      }

      showHideField($field, showField, instant);
      // return showField;
    }

    // check for input changes
    var showHideCheckInput = function($target, $field, instant) {
      var showField = false;
      instant = instant || false;

      // TODO: Exact match vs relative match
      // ie: match "hello" in "hello world"

      // check against the required value
      var valueToMatch = $field.data("show-input").toLowerCase();
      if( $target.val().toLowerCase() == valueToMatch ) {
        showField = true;
      } else {
        showField = false;
      }

      showHideField($field, showField, instant);
    }

    var showHideAllFields = function(){
      $showListeners.each(function(){
        var $thisField, $showTargets, $siblingTargets, $showOnControls, 
            showOn, multipleControls;

        $thisField = $(this);
        showOn = $thisField.data("show");
        multipleControls = false;
        $showTargets = [];

        // Create an array of required targets
        // Split on the control seperator
        if( showOn.indexOf(controlSeperator) > -1 ) {
          multipleControls = true;
          $showOnControls = showOn.split(controlSeperator);
        } else {
          $showOnControls = [showOn];
        }
        // Build the array
        $.each($showOnControls, function(){
          $showTargets.push( $("#"+ this ) );
        });

        // Count the number of required fields
        var numberOfTargets = $showTargets.length;
        var numberOfTargetsHit = 0;

        // Loop through each of the targets
        $.each($showTargets, function(){
          var $showTarget = $(this);
          var targetTrue = false;
          var typeOfTarget = showHideType($showTarget);

          // Radios and Checkboxes
          if($showTarget.is("input[type=radio]") || $showTarget.is("input[type=checkbox]")) {
            $siblingTargets= $("[name='"+$showTarget.attr("name")+"']");

            // check on target change
            $siblingTargets.on("change", function(){
              if(multipleControls) {
                showHideCheckMultipleRadio($showTarget, $thisField, $showTargets);
              } else {
                showHideCheckRadio($showTarget, $thisField);
              }
            });

            // // check on page load
            showHideCheckRadio($showTarget, $thisField, $showTargets, true);

          // Text Inputs
          } else if ( $thisField.data("show-input") !== undefined ) {

            // check on input update
            $showTarget.on("keyup", function(){
              showHideCheckInput($showTarget, $thisField);
            });

            // check on page load
            showHideCheckInput($showTarget, $thisField, true);

          // Select Elements
          } else if ( $thisField.data("show-option") !== undefined ) {

            // check on select change
            $showTarget.on("change", function(){
              showHideCheckSelect($showTarget, $thisField);
            });

            // check on page load
            showHideCheckSelect($showTarget, $thisField, true);

          }

        });

        $.each($showTargets, function(){

        });
      });
    }

    showHideAllFields();

  });

}(document, window, jQuery));