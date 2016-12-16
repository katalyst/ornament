/*jslint browser: true, indent: 2, todo: true, unparam: true */
/*global jQuery,Ornament */

(function (document, window, $) {

  "use strict";

  Ornament.refresh = function(){
    $(document).trigger("ornament:refresh");
  }

  $(document).on("ready page:change", function () {
    Ornament.refresh();
  });

  $(document).on("pjax:end", "*", function () {
    Ornament.refresh();
  });

  $(window).on("scroll", function(){
    $(document).trigger("ornament:scroll");
  });

}(document, window, jQuery));
