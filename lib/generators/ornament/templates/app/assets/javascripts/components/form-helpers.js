/*jslint browser: true, indent: 2, todo: true, unparam: true */
/*global jQuery,Ornament /*/

(function (document, window, $) {

  "use strict";

  var FormHelpers = Ornament.Components.FormHelpers = {

    // =========================================================================
    // Settings
    // =========================================================================

    jQueryUI: false,
    enhancedClass: "enhanced",
    enhancedElement: "<span class='form--enhanced--control'></span>",
    datePickerInitialisedClass: "datepicker__enabled",
    passwordRevealerInitialisedClass: "password-revealer__enabled",

    // =========================================================================
    // Password Score Settings
    // =========================================================================

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
    hasZxcvbn: typeof(zxcvbn) !== "undefined",

    // =========================================================================
    // Selectors
    // =========================================================================

    enhancedContainerClass: "form--enhanced",
    enhancedSelector: ".form--enhanced input",
    datePickerSelectors: "input.datepicker, .datepicker input",
    dateTimePickerSelectors: "input.datetimepicker, .datetimepicker input",
    passwordScoreSelector: "[data-password-score]",
    passwordRevealerSelector: "[data-password-reveal]",

    // =========================================================================
    // Date picker defaults
    // =========================================================================

    datePickerSettings: {
      dateFormat: 'dd/mm/yy',
      showButtonPanel: true,
      changeMonth: true,
      changeYear: true
    },

    dateTimePickerSettings: {
      stepMinute:  5,
      controlType: 'select',
      timeFormat:  'h:mm TT',
      dateFormat:  'D, M d yy at',
      showButtonPanel: true,
      changeMonth: true,
      changeYear: true
    },

    // =========================================================================
    // Datepicker Settings builder
    // Take the defaults and merge in some custom settings based on the field
    // attributes 
    // =========================================================================

    _buildDatePickerSettingsForField: function($field, defaultSettings) {
      defaultSettings = defaultSettings || {};
      // List of settings we can check against
      var settingsToCheck = [
        "dateFormat", 
        "yearRange",
        "timeFormat",
        "showButtonPanel", 
        "changeMonth",
        "changeYear",
        "stepMinute",
        "controlType",
        "showButtonPanel",
      ];
      // Loop over the array of options above and over-write 
      // the default settings with the new ones
      $.each(settingsToCheck, function(){
        var attribute = "data-datepicker-" + this.toLowerCase();
        if($field.is("[data-datepicker-" + attribute + "]")) {
          defaultSettings[this] = $field.attr(attribute);
        }
      });
      return defaultSettings;
    },

    // =========================================================================
    // Password Score functions
    // =========================================================================

    _scaffoldPasswordScoreField: function($fieldContainer){
      if($fieldContainer.hasClass(FormHelpers.passwordScoreInitialisedClass)) {
        return false;
      }
      var $field = $fieldContainer.find("input");
      var passwordLabel = $fieldContainer.is("[data-password-score-label]") ? $fieldContainer.attr("data-password-score-label") : FormHelpers.passwordDefaultLabel;
      // Scaffold up some markup around the field
      var $passwordWrapper = $("<div class='password-score' />");
      var $scoreLabel = $("<span class='password-score--label' data-password-score-label>" + passwordLabel + "</span>");
      var $passwordRating = $("<span class='password-score--rating' data-password-score-rating></span>");
      var $passwordProgressBar = $("<div class='password-score--bar'><div class='password-score--progress' /></div>");
      $passwordWrapper.append($scoreLabel).append($passwordRating).append($passwordProgressBar);
      $field.after($passwordWrapper);
      if(!FormHelpers.hasZxcvbn) {
        $field.before("<div class='password-score--demo-mode'>Demo mode: Password score library not found</div>");
      }
      // Trigger the first password score check (incase the field already has a value in it)
      FormHelpers._onPasswordFieldChange($field);
    },

    _setPasswordScoreTo: function($fieldContainer, passwordScore) {
      // Remove the current password classes
      var potentialPasswordScores = [0,1,2,3,4];
      $.each(potentialPasswordScores, function(){
        $fieldContainer.removeClass(FormHelpers.passwordScoreClass + this);
      });
      // Set the class of the current password score
      $fieldContainer.addClass(FormHelpers.passwordScoreClass + passwordScore);
      // Update password score label
      $fieldContainer.find("[data-password-score-rating]").text(FormHelpers.passwordScoreMessages[passwordScore]);
    },

    // Test a field to see what score it gets
    _onPasswordFieldChange: function(event){
      var $field = event.target ? $(event.target) : event;
      var value = $field.val();
      if(value === "") {
        var passwordScore = "empty";
      } else {
        if(FormHelpers.hasZxcvbn) {
          var passwordScore = zxcvbn($field.val()).score;
        } else {
          var passwordScore = Math.floor(Math.random() * 5);
        }
      }
      FormHelpers._setPasswordScoreTo($field.closest(FormHelpers.passwordScoreSelector), passwordScore);
    },

    // =========================================================================
    // Password Revealer functions
    // =========================================================================

    _isPasswordFieldRevealed: function($field){
      return $field[0].type === "text";
    },

    _togglePasswordRevealer: function($field) {
      var $button = $field.siblings("[data-password-revealer-button]");
      if(FormHelpers._isPasswordFieldRevealed($field)) {
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
        FormHelpers._togglePasswordRevealer($field);
      });
      $field.wrap("<div class='form--password-revealer' />").after($revealer);
    },

    // =========================================================================
    // Bind jQueryUI datepickers
    // =========================================================================

    bindJQueryUI: function(){
      // Datepicker
      $(FormHelpers.datePickerSelectors).not("." + FormHelpers.datePickerInitialisedClass).each(function(){
        var $datepicker = $(this);
        var customSettings = FormHelpers._buildDatePickerSettingsForField($datepicker, FormHelpers.datePickerSettings);
        $datepicker.datepicker(customSettings).addClass(FormHelpers.datePickerInitialisedClass);
      });
      // Datetime Picker
      $(FormHelpers.dateTimePickerSelectors).not("." + FormHelpers.datePickerInitialisedClass).each(function(){
        var $datetimepicker = $(this);
        var customSettings = FormHelpers._buildDatePickerSettingsForField($datetimepicker, FormHelpers.dateTimePickerSettings);
        $datetimepicker.datetimepicker(customSettings).addClass(FormHelpers.datePickerInitialisedClass);
      });
    },

    // =========================================================================
    // Bind password scores
    // =========================================================================

    bindPasswordScores: function(){
      $(FormHelpers.passwordScoreSelector).not("." + FormHelpers.passwordScoreInitialisedClass).each(function(){
        var $fieldContainer = $(this);
        FormHelpers._scaffoldPasswordScoreField($fieldContainer);
        $fieldContainer.addClass(FormHelpers.passwordScoreInitialisedClass).find("input").off("keyup", FormHelpers._onPasswordFieldChange).on("keyup", FormHelpers._onPasswordFieldChange);
      });
    },

    // =========================================================================
    // Bind password revealers
    // =========================================================================

    bindPasswordRevealers: function(){
      $(FormHelpers.passwordRevealerSelector).not("." + FormHelpers.passwordRevealerInitialisedClass).each(function(){
        var $field = $(this).addClass(FormHelpers.passwordRevealerInitialisedClass);
        FormHelpers._scaffoldPasswordRevealer($field);
      });
    },

    // =========================================================================
    // Enhanced radio and checkboxes scaffolding
    // =========================================================================

    enhanceForms: function(){
      if(Ornament.features.ie8) {
        $("." + FormHelpers.enhancedContainerClass).removeClass(FormHelpers.enhancedContainerClass);
      } else {
        $(FormHelpers.enhancedSelector).not("." + FormHelpers.enhancedClass).each(function(){
          $(this).addClass(FormHelpers.enhancedClass).after(FormHelpers.enhancedElement);
        });
      }
    },

    // =========================================================================
    // Billing to Shipping Helper
    // =========================================================================

    billingToShipping: function(checkboxSelector, fields) {
      var $checkbox = $(checkboxSelector);
      var fieldKeys = Object.keys(fields);

      var toggleFields = function() {
        for (var i = fieldKeys.length - 1; i >= 0; i--) {
          var $shippingField = $(fields[fieldKeys[i]]);

          // if checked, get keys and copy values in to fields
          if($checkbox.is(":checked")) {
            var $billingField = $(fieldKeys[i]);
            $shippingField.val($billingField.val());

          // if unchecked, empty shipping fields 
          } else {
            $shippingField.val("");
          }
        }
      }

      // toggleFields on page load
      toggleFields();

      // bind change event
      $checkbox.off("change", toggleFields).on("change", toggleFields);
    },

    // =========================================================================
    // Init, do everything
    // =========================================================================

    init: function(){
      this.enhanceForms();
      if(FormHelpers.jQueryUI) {
        this.bindJQueryUI();
      }
      this.bindPasswordScores();
      this.bindPasswordRevealers();
    }

  }

  // Initialise the form helpers on page load 
  Ornament.onLoad(function(){
    FormHelpers.init();
  });

  // Legacy support for document triggers
  $(document).on("ornament:enhance-forms", function () {
    FormHelpers.enhanceForms();
  });

}(document, window, jQuery));