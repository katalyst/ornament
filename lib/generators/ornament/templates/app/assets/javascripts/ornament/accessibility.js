/*jslint browser: true, indent: 2, todo: true, unparam: true */
/*global jQuery*/

(function (document, window, $) {

  "use strict";

  $("body").on("click", "a[href^='#']:not(a[href='#'])", function() {
    $($(this).attr("href")).focus();
  });

}(document, window, jQuery));
