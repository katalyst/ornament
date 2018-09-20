(function (document, window) {
  "use strict";

  var FlexibleInput = {
    init: function(){

      var $flexibleInputs = document.querySelectorAll("[data-flexible-input-container]");
      $flexibleInputs.forEach(function($wrapper){

        var $input = $wrapper.querySelector("[data-flexible-input]");
        var inputSettings = $input.getAttribute("data-flexible-input").split("/");
        var minWidth = inputSettings[0];
        var maxWidth = inputSettings[1];
        var isInput = $input.nodeName.toLowerCase === "input";
        var $inputField = $input;
        if(!isInput) {
          $inputField = $input.querySelector("input");
        }

        // Resize inputs
        var resizeInput = function(width) {
          $input.style.width = width + "px";
        }

        // Scaffold the input field
        $wrapper.style.width = minWidth + "px";
        $wrapper.style.height = $inputField.offsetHeight + "px";
        
        $input.style.position = "absolute";
        $input.style.width = minWidth + "px";

        Ornament.U.bindOnce($inputField, "focus", function(){
          resizeInput(maxWidth);
        });

        Ornament.U.bindOnce($inputField, "blur", function(){
          resizeInput(minWidth);
        });

      });

    }
  }

  Ornament.registerComponent("FlexibleInput", FlexibleInput);

}(document, window));