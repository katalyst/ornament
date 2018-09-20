(function (document, window, Orn, Utils) {
  "use strict";

  var FormDatepicker = {

    enabled: false,
    datePickerInitialisedClass: "datepicker__enabled",
    datePickerSelectors: "input.datepicker, .datepicker input",
    dateTimePickerSelectors: "input.datetimepicker, .datetimepicker input",

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
    // Bind jQueryUI datepickers
    // =========================================================================
    
    init: function(){
      if(FormDatepicker.enabled) {
        // Datepicker
        $(FormDatepicker.datePickerSelectors).not("." + FormDatepicker.datePickerInitialisedClass).each(function(){
          var $datepicker = $(this);
          var customSettings = FormDatepicker._buildDatePickerSettingsForField($datepicker, FormDatepicker.datePickerSettings);
          $datepicker.datepicker(customSettings).addClass(FormDatepicker.datePickerInitialisedClass);
        });
        // Datetime Picker
        $(FormDatepicker.dateTimePickerSelectors).not("." + FormDatepicker.datePickerInitialisedClass).each(function(){
          var $datetimepicker = $(this);
          var customSettings = FormDatepicker._buildDatePickerSettingsForField($datetimepicker, FormDatepicker.dateTimePickerSettings);
          $datetimepicker.datetimepicker(customSettings).addClass(FormDatepicker.datePickerInitialisedClass);
        });
      }
    }
  }
  
  Orn.registerComponent("FormDatepicker", FormDatepicker);

}(document, window, Ornament, Ornament.Utilities));