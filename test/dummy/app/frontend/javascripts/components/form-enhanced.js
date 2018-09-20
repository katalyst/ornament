(function (document, window, Orn, Utils) {
  "use strict";

  var FormsEnhanced = {

    enhancedClass: "enhanced",
    enhancedElement: "<span class='form--enhanced--control'></span>",
    enhancedSelector: "input",

    validateEnhancedInput: function($input){
      if($input.hasAttribute("type")) {
        var type = $input.getAttribute("type");
        return type === "checkbox" || type === "radio";
      } else {
        return false;
      }
    },

    init: function(){
      document.querySelectorAll("input").forEach(function($input) {
        if(!$input.classList.contains(FormsEnhanced.enhancedClass) && FormsEnhanced.validateEnhancedInput($input)) {
          $input.insertAdjacentHTML('afterend', FormsEnhanced.enhancedElement);
          $input.classList.add(FormsEnhanced.enhancedClass);
        }
      });
    }
  }
  
  Orn.registerComponent("FormsEnhanced", FormsEnhanced);

}(document, window, Ornament, Ornament.Utilities));