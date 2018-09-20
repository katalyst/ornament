(function (document, window, Orn, Utils) {
  "use strict";

  var FormPasswordRevealer = {

    classes: {
      wrapper: "form--password-revealer",
      passwordRevealerInitialised: "password-revealer__enabled",
      button: "button__confirm button__pill",
      buttonRevealed: "button__depressed"
    },

    selectors: {
      target: "data-password-reveal",
      button: "data-password-revealer-button"
    },
    
    _isPasswordFieldRevealed: function($field){
      return $field.type === "text";
    },

    _togglePasswordRevealer: function($field) {
      var $buttons = $field.parentNode.querySelectorAll("[" + FormPasswordRevealer.selectors.button + "]");

      if(FormPasswordRevealer._isPasswordFieldRevealed($field)) {
        $field.type = "password";
        $buttons.forEach(function($button) {
          $button.classList.remove(FormPasswordRevealer.classes.buttonRevealed);
        });
      } else {
        $field.type = "text";
        $buttons.forEach(function($button) {
          $button.classList.add(FormPasswordRevealer.classes.buttonRevealed);
        })
      }
    },

    _scaffoldPasswordRevealer: function($field){
      var $revealer = document.createElement("button");
      $revealer.type = "button";
      $revealer.setAttribute(FormPasswordRevealer.selectors.button, "");
      $revealer.setAttribute("class", FormPasswordRevealer.classes.button);
      $revealer.innerText = "reveal";
      Ornament.U.bindOnce($revealer, "click", function(){
        FormPasswordRevealer._togglePasswordRevealer($field);
      });
      var $wrapper = document.createElement("div");
      $field.parentElement.insertBefore($wrapper, $field);
      $wrapper.classList.add(FormPasswordRevealer.classes.wrapper);
      $wrapper.appendChild($field);
      $wrapper.appendChild($revealer);
    },
    
    init: function(){
      var $passwordFields = document.querySelectorAll("[" + FormPasswordRevealer.selectors.target + "]");
      $passwordFields.forEach(function($field){
        if($field.classList.contains(FormPasswordRevealer.classes.passwordRevealerInitialised)) {
          return;
        }
        $field.classList.add(FormPasswordRevealer.classes.passwordRevealerInitialised);
        FormPasswordRevealer._scaffoldPasswordRevealer($field);

        // Clean up before turbolinks cache 
        Ornament.beforeTurbolinksCache(function(){
          $field.classList.remove(FormPasswordRevealer.classes.passwordRevealerInitialised);
          var $revealer = $field.nextElementSibling;
          $revealer.parentNode.remove($revealer);
          $field.type = "password";
        });
      });
    }
  }
  
  Orn.registerComponent("FormPasswordRevealer", FormPasswordRevealer);

}(document, window, Ornament, Ornament.Utilities));