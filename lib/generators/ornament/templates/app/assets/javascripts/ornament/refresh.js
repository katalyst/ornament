/*jslint browser: true, indent: 2, todo: true, unparam: true */
/*global jQuery,Ornament */

(function (document, window, $) {

  "use strict";

  $(document).on("ready page:change", function () {
    $(document).trigger("ornament:refresh");
  });

  $(document).on("pjax:end", "*", function () {
    $(document).trigger("ornament:refresh");
  });

  $(window).on("scroll", function(){
    $(document).trigger("ornament:scroll");
  });

}(document, window, jQuery));
