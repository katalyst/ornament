/*jslint browser: true, indent: 2, todo: true, unparam: true */
/*global jQuery,Ornament /*/

// http://www.scriptiny.com/2012/09/jquery-input-textarea-limiter/
(function($) {
  $.fn.extend( {
    limiter: function(limit, elem, type, isMicro) {
      isMicro = isMicro || false;
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

        if(isMicro) {
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

    $("[data-limiter]").each(function(i,elem) {
      // only apply if the element is found
      var $elem = $(elem);
      var limit = $elem.data("limiter");
      var type = $elem.is("[data-limiter-word]") ? "word" : "character";
      var isMicro = $elem.is("[data-limiter-micro]");
      if($elem.length > 0) {

        var $charCountContainer = $("<span class='form--field-with-count--counter' />");
        var $charCountHeading = $("<div class='form--field-with-count--heading' />");
        var $charCountWrapper = $("<div class='form--field-with-count' />");

        // Different markup for micro style
        if(isMicro) {
          $charCountWrapper.addClass("form--field-with-count__micro"); 
        } else {
          $charCountHeading.text(limit + " " + type + " limit");
        }

        // Add a class to differentiate textarea limiters
        if($elem.is("textarea")) {
          $charCountWrapper.addClass("form--field-with-count__textarea");
        }

        $charCountHeading.append($charCountContainer);

        // Apply form width styling
        var formClass = $elem.attr("class");
        if(formClass && formClass.split("form--")[1]) {
          formClass = formClass.split("form--")[1].split(" ")[0];
          $charCountWrapper.addClass("form--" + formClass);
        }

        $elem.wrap($charCountWrapper).before($charCountHeading);
        $elem.limiter(limit,$charCountContainer,type,isMicro);

      }
    });

  });

}(document, window, jQuery));