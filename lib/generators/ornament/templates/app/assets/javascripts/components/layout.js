/*jslint browser: true, indent: 2, todo: true, unparam: true */
/*global jQuery,Ornament */

Ornament.layout = {
  animationDuration: 500,
  animationBuffer: 100
};

(function (document, window, Orn, $) {

  "use strict";

  $(document).on("ornament:refresh", function () {

    $(".layout").not(".layout-initialized").each(function () {

      var $layout, $content, timeout, toggle;

      $layout = $(this);
      $content = $layout.find(".layout--content");

      toggle = function () {

        if ($layout.hasClass("layout-open")) {

          $layout.removeClass("layout-open").addClass("layout-transitioning");

          $content.off("click", "*");

        } else {

          $layout.addClass("layout-open layout-transitioning");

          $content.on("click", "*", function (event) {
            toggle();
            return false;
          });

        }

        if (timeout !== undefined) {
          clearTimeout(timeout);
        }

        timeout = setTimeout(function () {
          $layout.removeClass("layout-transitioning");
        }, Orn.layout.animationDuration + Orn.layout.animationBuffer);

      };

      $layout.find(".layout--switch").on("click", function () {
        toggle();
        return false;
      });

    }).addClass("layout-initialized");

  });

}(document, window, Ornament, jQuery));
