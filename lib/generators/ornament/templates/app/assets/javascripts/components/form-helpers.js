/*jslint browser: true, indent: 2, todo: true, unparam: true */
/*global jQuery,Ornament /*/

(function (document, window, $) {

  "use strict";

  var FormHelpers = Ornament.Components.FormHelpers = {

    // Selectors
    enhancedSelector: ".form--enhanced input",
    datePickerSelectors: "input.datepicker, .datepicker input",
    dateTimePickerSelectors: "input.datetimepicker, .datetimepicker input",

    // Settings
    jQueryUI: false,
    enhancedClass: "enhanced",
    enhancedElement: "<span class='form--enhanced--control'></span>",
    datePickerInitialisedClass: "datepicker__enabled",

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
    buildSettingsForField: function($field, defaultSettings) {
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

    // Add jQuery Form Enhancements
    bindJQueryUI: function(){
      // Datepicker
      $(FormHelpers.datePickerSelectors).not("." + FormHelpers.datePickerInitialisedClass).each(function(){
        var $datepicker = $(this);
        var customSettings = FormHelpers.buildSettingsForField($datepicker, FormHelpers.datePickerSettings);
        $datepicker.datepicker(customSettings).addClass(FormHelpers.datePickerInitialisedClass);
      });
      // Datetime Picker
      $(FormHelpers.dateTimePickerSelectors).not("." + FormHelpers.datePickerInitialisedClass).each(function(){
        var $datetimepicker = $(this);
        var customSettings = FormHelpers.buildSettingsForField($datetimepicker, FormHelpers.dateTimePickerSettings);
        $datetimepicker.datetimepicker(customSettings).addClass(FormHelpers.datePickerInitialisedClass);
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