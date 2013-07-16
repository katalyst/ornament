//= require jquery.flexslider

/*jslint browser: true, indent: 2, todo: true, unparam: true */
/*global jQuery,Ornament */

(function (document, window, $) {

  "use strict";

  $(document).on("ornament:refresh", function () {

    $(".slider").not(".slider-initialized").each(function () {

      $(this).flexslider({
        namespace: "slider--",
        selector: ".slider--slides > li",
        pauseOnHover: true
        //animation: "slide"
      });

    }).addClass("slider-initialized");

  });

}(document, window, jQuery));
