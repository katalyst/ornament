/*jslint browser: true, indent: 2, todo: true, unparam: true */
/*global jQuery,Ornament /*/

(function (document, window, $) {

  "use strict";

  $(document).on("ornament:enhance-forms", function () {

    // Enhance simple_form
    $(".form--enhanced input").not(".enhanced").each(function(){
      $(this).addClass("enhanced").after("<span class='form--enhanced--control'></span>");
    });

  });

  $(document).on("ornament:refresh", function () {
    $(document).trigger("ornament:enhance-forms");
  });

}(document, window, jQuery));