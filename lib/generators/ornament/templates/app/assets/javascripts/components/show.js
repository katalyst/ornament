/*jslint browser: true, indent: 2, todo: true, unparam: true */
/*global jQuery,Ornament */

(function (document, window, $) {

  "use strict";

  $(document).on("ornament:refresh", function () {

    var $showListeners = $("[data-show]");

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
    }

    var showHideAllFields = function(){
      $showListeners.each(function(){
        var $thisField, $showTarget, $siblingTargets;

        $thisField = $(this);
        $showTarget = $("#" + $thisField.data("show") );

        // radios
        if($showTarget.is("input[type=radio]")) {
          $siblingTargets= $("[name='"+$showTarget.attr("name")+"']");

          // check on target change
          $siblingTargets.on("change", function(){
            showHideCheckRadio($showTarget, $thisField);
          });

          // check on page load
          showHideCheckRadio($showTarget, $thisField, true);

        // select elements
        } else if ( $showTarget.data("show-option") != "" ) {

          // check on select change
          $showTarget.on("change", function(){
            showHideCheckSelect($showTarget, $thisField);
          });

          // check on page load
          showHideCheckSelect($showTarget, $thisField, true);
        }
      });
    }

    showHideAllFields();

  });

}(document, window, jQuery));