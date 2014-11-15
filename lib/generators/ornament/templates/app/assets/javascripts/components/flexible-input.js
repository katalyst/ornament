/*jslint browser: true, indent: 2, todo: true, unparam: true */
/*global jQuery,Ornament /*/

(function (document, window, $) {

  "use strict";

  $(document).on("ornament:refresh", function () {

    var $flexibleInputs = $("[data-flexible-input-container]");
    $flexibleInputs.each(function(){

      var $wrapper = $(this);
      var $input = $wrapper.find("[data-flexible-input]");
      var inputSettings = $input.attr("data-flexible-input").split("/");
      var minWidth = inputSettings[0];
      var maxWidth = inputSettings[1];
      var isInput = $input.is("input");
      var $inputField = $input;
      if(!isInput) {
        $inputField = $input.find("input");
      }

      // Resize inputs
      var resizeInput = function(width) {
        $input.width(width);
      }

      // Scaffold the input field
      $wrapper.css({
        width: minWidth,
        height: $inputField.outerHeight()
      });

      $input.css({
        position: "absolute",
        width: minWidth
      });

      $inputField.on("focus", function(){
        resizeInput(maxWidth);
      });

      $inputField.on("blur", function(){
        resizeInput(minWidth);
      });

    });

  });

}(document, window, jQuery));