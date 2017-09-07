"use strict";

(function (document, window, Orn, Utils) {

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
    passwordScoreSelector: "[data-password-score]",

    _getMasterElement: function($field) {
      // Integration with password revealer 
      if($field.parent(".form--password-revealer").length > 0) {
        return $field.parent();
      } else {
        return $field;
      }
    },

    _scaffoldPasswordScoreField: function($fieldContainer, $field){
      if($fieldContainer.hasClass(FormPasswordScore.passwordScoreInitialisedClass)) {
        return false;
      }
      $field = $field || $fieldContainer.find("input");
      var $masterElement = FormPasswordScore._getMasterElement($field);
      var passwordLabel = $fieldContainer.is("[data-password-score-label]") ? $fieldContainer.attr("data-password-score-label") : FormPasswordScore.passwordDefaultLabel;
      // Scaffold up some markup around the field
      var $passwordWrapper = $("<div class='password-score' />");
      var $scoreLabel = $("<span class='password-score--label' data-password-score-label>" + passwordLabel + "</span>");
      var $passwordRating = $("<span class='password-score--rating' data-password-score-rating></span>");
      var $passwordProgressBar = $("<div class='password-score--bar'><div class='password-score--progress' /></div>");
      $passwordWrapper.append($scoreLabel).append($passwordRating).append($passwordProgressBar);
      $masterElement.after($passwordWrapper);
      if(!FormPasswordScore.hasZxcvbn) {
        $masterElement.before("<div class='password-score--demo-mode'>Demo mode: Password score library not found</div>");
      }
      // Trigger the first password score check (incase the field already has a value in it)
      FormPasswordScore._onPasswordFieldChange($field);
    },

    _setPasswordScoreTo: function($fieldContainer, passwordScore) {
      // Remove the current password classes
      var potentialPasswordScores = [0,1,2,3,4];
      $.each(potentialPasswordScores, function(){
        $fieldContainer.removeClass(FormPasswordScore.passwordScoreClass + this);
      });
      // Set the class of the current password score
      $fieldContainer.addClass(FormPasswordScore.passwordScoreClass + passwordScore);
      // Update password score label
      $fieldContainer.find("[data-password-score-rating]").text(FormPasswordScore.passwordScoreMessages[passwordScore]);
    },

    // Test a field to see what score it gets
    _onPasswordFieldChange: function(event){
      var $field = event.target ? $(event.target) : event;
      var value = $field.val();
      if(value === "") {
        var passwordScore = "empty";
      } else {
        if(FormPasswordScore.hasZxcvbn) {
          var passwordScore = zxcvbn($field.val()).score;
        } else {
          var passwordScore = Math.floor(Math.random() * 5);
        }
      }
      FormPasswordScore._setPasswordScoreTo($field.closest(FormPasswordScore.passwordScoreSelector), passwordScore);
    },
    
    init: function(){
      $(FormPasswordScore.passwordScoreSelector).not("." + FormPasswordScore.passwordScoreInitialisedClass).each(function(){
        var $fieldContainer = $(this);
        var $field = $fieldContainer.find("input");
        FormPasswordScore._scaffoldPasswordScoreField($fieldContainer, $field);
        $fieldContainer.addClass(FormPasswordScore.passwordScoreInitialisedClass);
        $field.off("keyup", FormPasswordScore._onPasswordFieldChange).on("keyup", FormPasswordScore._onPasswordFieldChange);

        // Clean up before turbolinks cache
        Ornament.beforeTurbolinksCache(function(){
          $fieldContainer.removeClass(FormPasswordScore.passwordScoreInitialisedClass);
          $field.off("keyup", FormPasswordScore._onPasswordFieldChange);
          var $masterElement = FormPasswordScore._getMasterElement($field);
          $masterElement.prev(".password-score--demo-mode").remove();
          $masterElement.next(".password-score").remove();
        });
      });
    }
  }
  
  Orn.registerComponent("FormPasswordScore", FormPasswordScore);

}(document, window, Ornament, Ornament.Utilities));