/*jslint browser: true, indent: 2, todo: true, unparam: true */
/*global jQuery,Ornament /*/

(function (document, window, $) {

  "use strict";

  $(document).on("ornament:refresh", function () {

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

      // Add jQuery Form Enhancements
      bindJQueryUI: function(){
        // Datepicker
        $(FormHelpers.datePickerSelectors).not("." + FormHelpers.datePickerInitialisedClass).each(function(){
          var $datepicker = $(this);
          $datepicker.datepicker(FormHelpers.datePickerSettings).addClass(FormHelpers.datePickerInitialisedClass);
        });
        // Datetime Picker
        $(FormHelpers.dateTimePickerSelectors).not("." + FormHelpers.datePickerInitialisedClass).each(function(){
          var $datetimepicker = $(this);
          $datetimepicker.datetimepicker().addClass(FormHelpers.datePickerInitialisedClass);
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

    FormHelpers.init();
  });

  // Legacy support for document triggers
  $(document).on("ornament:enhance-forms", function () {
    Ornament.Components.FormHelpers.enhanceForms();
  });

}(document, window, jQuery));