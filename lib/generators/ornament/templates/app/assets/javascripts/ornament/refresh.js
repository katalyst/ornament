/*jslint browser: true, indent: 2, todo: true, unparam: true */
/*global jQuery,Ornament */

(function (document, window, $) {

  "use strict";

  Ornament.refresh = function(){
    $(document).trigger("ornament:refresh");
    Ornament.ready = true;
  }

  $(document).on("ready page:change", function () {
    Ornament.refresh();
  });

  $(document).on("pjax:end", "*", function () {
    Ornament.refresh();
  });

  $(document).on("turbolinks:load", function() {
    Ornament.ready = false;
    Ornament.refresh();
  });

}(document, window, jQuery));
