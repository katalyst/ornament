"use strict";

(function (document, window, Orn, Utils) {

  var FormsEnhanced = {

    enhancedClass: "enhanced",
    enhancedElement: "<span class='form--enhanced--control'></span>",
    enhancedContainerClass: "form--enhanced",
    enhancedSelector: ".form--enhanced input",

    init: function(){
      if(Ornament.features.ie8) {
        $("." + FormsEnhanced.enhancedContainerClass).removeClass(FormsEnhanced.enhancedContainerClass);
      } else {
        $(FormsEnhanced.enhancedSelector).not("." + FormsEnhanced.enhancedClass).each(function(){
          $(this).addClass(FormsEnhanced.enhancedClass).after(FormsEnhanced.enhancedElement);
        });
      }
    }
  }
  
  Orn.registerComponent("FormsEnhanced", FormsEnhanced);

}(document, window, Ornament, Ornament.Utilities));