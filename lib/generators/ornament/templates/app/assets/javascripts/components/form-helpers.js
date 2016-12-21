/*jslint browser: true, indent: 2, todo: true, unparam: true */
/*global jQuery,Ornament /*/

(function (document, window, $) {

  "use strict";

  var FormHelpers = Ornament.Components.FormHelpers = {

    // Selectors
    enhancedSelector: ".form--enhanced input",
    datePickerSelectors: "input.datepicker, .datepicker input",
    dateTimePickerSelectors: "input.datetimepicker, .datetimepicker input",
    passwordScoreSelector: "input[data-password-score], [data-password-score] input",

    // Settings
    jQueryUI: false,
    enhancedClass: "enhanced",
    enhancedElement: "<span class='form--enhanced--control'></span>",
    datePickerInitialisedClass: "datepicker__enabled",

    // Password Score settings
    passwordScoreMessages: {
      0: "Weak",
      1: "Weak",
      2: "Fair",
      3: "Good",
      4: "Strong"
    },
    passwordDefaultMessage: "Password Strength",
    passwordScoreInitialisedClass: "password-score__enabled",
    passwordScoreClass: "password-score__",

    // Default JQuery UI Settings
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

    // Build settings from a field
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

    _onPasswordFieldChange: function($field){
      passwordScore = zxcvbn($field.val()).score;
      potentialPasswordScores = [0,1,2,3,4];
      // Set the class
      $.each(potentialPasswordScores, function(){
        $field.removeClass(FormHelpers.passwordScoreClass + this);
      });
      $field.addClass(FormHelpers.passwordScoreClass + passwordScore);
      // Update password score label
      $field.closest("[data-password-score-label]").text(FormHelpers.passwordScoreMessage[passwordScore]);
    },

    // Add jQuery Form Enhancements
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

    bindPasswordScores: function(){
      $(FormHelpers.passwordScoreSelector).not("." + FormHelpers.passwordScoreInitialisedClass).each(function(){
        var $field = $(this);
        $field.off("change", FormHelpers._onPasswordFieldChange).on("change", FormHelpers._onPasswordFieldChange);
        $field.addClass(FormHelpers.passwordScoreInitialisedClass);
      });
    },

    // Enhance Forms with element inputs for
    // radios and checkboxes
    enhanceForms: function(){
      $(FormHelpers.enhancedSelector).not("." + FormHelpers.enhancedClass).each(function(){
        $(this).addClass(FormHelpers.enhancedClass).after(FormHelpers.enhancedElement);
      });
    },

    init: function(){
      this.enhanceForms();
      if(FormHelpers.jQueryUI) {
        this.bindJQueryUI();
      }
    }

  }

  Ornament.onLoad(function(){
    FormHelpers.init();
  });

  // Legacy support for document triggers
  $(document).on("ornament:enhance-forms", function () {
    FormHelpers.enhanceForms();
  });

}(document, window, jQuery));