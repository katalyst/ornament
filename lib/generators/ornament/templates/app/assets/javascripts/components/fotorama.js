//= require fotorama

/*jslint browser: true, indent: 2, todo: true, unparam: true */
/*global jQuery,Ornament */

(function (document, window, $) {

  "use strict";

  $(document).on("ornament:refresh", function () {

    $(".fotorama").not(".fotorama-initialized").each(function () {

      $(this).fotorama();

    }).addClass("fotorama-initialized");

  });

}(document, window, jQuery));
