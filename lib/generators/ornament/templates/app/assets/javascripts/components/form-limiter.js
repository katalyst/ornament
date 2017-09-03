/*jslint browser: true, indent: 2, todo: true, unparam: true */
/*global jQuery,Ornament /*/

// http://www.scriptiny.com/2012/09/jquery-input-textarea-limiter/
(function($) {
  $.fn.extend( {
    limiter: function(limit, elem, type, style) {
      style = style || "normal";
      $(this).on("keyup focus", function() {
        setCount(this, elem, type);
      });
      function setCount(src, elem, type) {
        if(type === "word") {
          var value = src.value.trim();
          var remaining = value.split(/\s/).filter(function(word){ return word.length > 0 }).length;
          if (remaining > limit) {
            var strippedValue = src.value.replace(/\n/, '[new_line]').split(' ').slice(0,limit).join(' ').replace('[new_line]', '\n');
            src.value = strippedValue + " ";
            remaining = limit;
          }
        } else {
          var remaining = src.value.length;
          if (remaining > limit) {
            src.value = src.value.substr(0, limit);
            remaining = limit;
          }
        }

        if(style === "micro") {
          elem.html( remaining + "/" + limit );
        } else {
          elem.html( limit - remaining + " left");
        }

      }
      setCount($(this)[0], elem, type);
    }
  });
})(jQuery);

(function (document, window, $) {

  "use strict";

  $(document).on("ornament:refresh", function () {

    var TextLimit = Ornament.Components.FormLimiter = {

      // Settings
      defaultLimit: 150,
      defaultType: "character", // "character" or "word"
      defaultStyle: "normal", // "normal" or "micro"

      // Selectors
      limiterSelector: "data-limiter",
      microSelector: "data-limiter-micro",
      wordSelector: "data-limiter-word",

      // Attach a limiter to a field
      createLimiter: function($field, limit, type, style) {
        limit = limit || TextLimit.defaultLimit;
        type = type || TextLimit.defaultType;
        style = style || TextLimit.defaultStyle;

        if($field.is(".init")) {
          return;
        }

        var $headingCounter = $("<span class='form--field-with-count--counter' />");
        var $heading = $("<div class='form--field-with-count--heading' />");
        var $fieldWrapper = $("<div class='form--field-with-count' />");

        if(style === "micro") {
          $fieldWrapper.addClass("form--field-with-count__micro"); 
        } else {
          $heading.text(limit + " " + type + " limit");
        }

        // Add a class to differentiate textarea limiters
        if($field.is("textarea")) {
          $fieldWrapper.addClass("form--field-with-count__textarea");
        }

        $heading.append($headingCounter);

        // Apply form width styling
        var formClass = $field.attr("class");
        if(formClass && formClass.split("form--")[1]) {
          formClass = formClass.split("form--")[1].split(" ")[0];
          $fieldWrapper.addClass("form--" + formClass);
        }

        $field.wrap($fieldWrapper).before($heading);
        $field.limiter(limit, $headingCounter, type, style);
        $field.addClass("init");
      },

      // Init 
      init: function(){
        $("[" + TextLimit.limiterSelector + "]").each(function(i) {
          var $field = $(this);
          var limit = $field.attr(TextLimit.limiterSelector);
          var style = $field.is("[" + TextLimit.microSelector + "]") ? "micro" : "normal";
          var type = $field.is("[" + TextLimit.wordSelector + "]") ? "word" : "character";
          TextLimit.createLimiter($field, limit, type, style);
        });
      }

    }

    TextLimit.init();
  });

}(document, window, jQuery));