"use strict";

(function (document, window, Orn, Utils) {

  var FormPasswordRevealer = {

    passwordRevealerInitialisedClass: "password-revealer__enabled",
    passwordRevealerSelector: "[data-password-reveal]",
    
    _isPasswordFieldRevealed: function($field){
      return $field[0].type === "text";
    },

    _togglePasswordRevealer: function($field) {
      var $button = $field.siblings("[data-password-revealer-button]");
      if(FormPasswordRevealer._isPasswordFieldRevealed($field)) {
        $field[0].type = "password";
        $button.removeClass("button__depressed");
      } else {
        $field[0].type = "text";
        $button.addClass("button__depressed");
      }
    },

    _scaffoldPasswordRevealer: function($field){
      var $revealer = $("<button data-password-revealer-button />").addClass("button__confirm button__pill").text("reveal");
      $revealer.off("click").on("click", function(){
        FormPasswordRevealer._togglePasswordRevealer($field);
      });
      $field.wrap("<div class='form--password-revealer' />").after($revealer);
    },
    
    init: function(){
      $(FormPasswordRevealer.passwordRevealerSelector).not("." + FormPasswordRevealer.passwordRevealerInitialisedClass).each(function(){
        var $field = $(this).addClass(FormPasswordRevealer.passwordRevealerInitialisedClass);
        FormPasswordRevealer._scaffoldPasswordRevealer($field);

        // Clean up before turbolinks cache 
        Ornament.beforeTurbolinksCache(function(){
          $field.removeClass(FormPasswordRevealer.passwordRevealerInitialisedClass);
          $field.next("[data-password-revealer-button]").remove();
          $field.attr("type", "password");
        });
      });
    }
  }
  
  Orn.registerComponent("FormPasswordRevealer", FormPasswordRevealer);

}(document, window, Ornament, Ornament.Utilities));