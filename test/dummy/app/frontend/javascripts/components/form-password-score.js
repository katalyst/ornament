// import "libs/zxcvbn-async";

(function (document, window, Orn, Utils) {
  "use strict";

  var FormPasswordScore = {

    hasZxcvbn: typeof(zxcvbn) !== "undefined",
    passwordScoreMessages: {
      "empty": "Password Strength",
      0: "Weak",
      1: "Weak",
      2: "Fair",
      3: "Good",
      4: "Strong"
    },
    passwordDefaultLabel: "Must score good or higher",
    passwordScoreInitialisedClass: "password-score__enabled",
    passwordScoreClass: "password-score__",
    passwordScoreSelector: "data-password-score",

    _getMasterElement: function($field) {
      // Integration with password revealer 
      if($field.parentElement.classList.contains("form--password-revealer")) {
        return $field.parentElement;
      }
      return $field;
    },

    _scaffoldPasswordScoreField: function($fieldContainer, $field){
      if($fieldContainer.classList.contains(FormPasswordScore.passwordScoreInitialisedClass)) {
        return false;
      }
      $field = $field || $fieldContainer.querySelector("input");
      var $masterElement = FormPasswordScore._getMasterElement($field);
      var passwordLabel = $fieldContainer.hasAttribute("data-password-score-label") ? $fieldContainer.getAttribute("data-password-score-label") : FormPasswordScore.passwordDefaultLabel;
      var passwordWrapperMarkup = "";

      // Scaffold up some markup around the field
      passwordWrapperMarkup += "<div class='password-score'>";
      passwordWrapperMarkup += "<span class='password-score--label' data-password-score-label>" + passwordLabel + "</span>";
      passwordWrapperMarkup += "<span class='password-score--rating' data-password-score-rating></span>";
      passwordWrapperMarkup += "<div class='password-score--bar'><div class='password-score--progress' /></div>";
      passwordWrapperMarkup += "</div>";
      $masterElement.insertAdjacentHTML('afterend', passwordWrapperMarkup);

      if(!FormPasswordScore.hasZxcvbn) {
        $masterElement.insertAdjacentHTML('beforebegin', "<div class='password-score--demo-mode'>Demo mode: Password score library not found</div>");
      }

      // Trigger the first password score check (incase the field already has a value in it)
      FormPasswordScore._onPasswordFieldChange($field);
    },

    _setPasswordScoreTo: function($fieldContainer, passwordScore) {
      // Remove the current password classes
      var potentialPasswordScores = [0,1,2,3,4];
      for(var i = 0; i < potentialPasswordScores.length; i++) {
        $fieldContainer.classList.remove(FormPasswordScore.passwordScoreClass + potentialPasswordScores[i]);
      }
      // Set the class of the current password score
      $fieldContainer.classList.add(FormPasswordScore.passwordScoreClass + passwordScore);
      // Update password score label
      $fieldContainer.querySelector("[data-password-score-rating]").innerText = FormPasswordScore.passwordScoreMessages[passwordScore];
    },

    // Test a field to see what score it gets
    _onPasswordFieldChange: function(event){
      var $field = event.currentTarget || event.target || event;
      var value = $field.value;
      if(value === "") {
        var passwordScore = "empty";
      } else {
        if(FormPasswordScore.hasZxcvbn) {
          var passwordScore = zxcvbn(value).score;
        } else {
          var passwordScore = Math.floor(Math.random() * 5);
        }
      }
      var $score = Ornament.$.parentWithAttribute($field, FormPasswordScore.passwordScoreSelector);
      FormPasswordScore._setPasswordScoreTo($score, passwordScore);
    },
    
    init: function(){
      FormPasswordScore.$elements = document.querySelectorAll("[" + FormPasswordScore.passwordScoreSelector + "]");
      FormPasswordScore.$elements.forEach(function($element) {
        // Don't rebind if already has init class
        if($element.classList.contains(FormPasswordScore.passwordScoreInitialisedClass)) {
          return;
        }
        // Scaffold up the input field
        var $field = $element.querySelector("input");
        FormPasswordScore._scaffoldPasswordScoreField($element);
        $element.classList.add(FormPasswordScore.passwordScoreInitialisedClass);

        Ornament.U.bindOnce($field, "keyup", FormPasswordScore._onPasswordFieldChange);
        Ornament.beforeTurbolinksCache(function(){
          $element.classList.remove(FormPasswordScore.passwordScoreInitialisedClass);
          var $masterElement = FormPasswordScore._getMasterElement($field);
          var $parent = $masterElement.parentElement;
          var $demo = $parent.querySelector(".password-score--demo-mode");
          var $score = $parent.querySelector(".password-score");
          $parent.removeChild($demo);
          $parent.removeChild($score);
        })
        
      });
    }
  }
  
  Orn.registerComponent("FormPasswordScore", FormPasswordScore);

}(document, window, Ornament, Ornament.Utilities));