/*jslint browser: true, indent: 2, todo: true, unparam: true */
/*global jQuery,Ornament */

(function (document, window, $) {

  "use strict";

  $(document).on("ornament:refresh", function () {

    var repositionTooltip = function($tooltip) {

      var windowWidth, windowHeight, tHeight, tWidth,
          tTop, tRight, tBottom, tLeft;

      // measure all the things
      windowWidth = window.innerWidth;
      windowHeight = window.innerHeight;
      tHeight = $tooltip.outerHeight();
      tWidth = $tooltip.outerWidth();
      tTop = $tooltip.offset().top;
      tRight = windowWidth - tLeft;
      tBottom = windowHeight - tTop;
      tLeft = $tooltip.offset().left;

      // store original values for safe-keeping
      if ( $tooltip.data("original-left") == undefined ) {
        $tooltip.data("original-left", $tooltip.css("left"));
      }
      if ( $tooltip.data("original-top") == undefined ) {
        $tooltip.data("original-top", $tooltip.css("top"));
      }

      // check against left
      if( tLeft < 0 ) {
        var currentLeft = parseInt($tooltip.css("left"));
        var newLeft = currentLeft + Math.abs(tLeft);
        $tooltip.css("left", newLeft);
      } else {

      }
    }

    $(".tooltip").not(".tooltip-initialized").each(function () {

      var $anchor, $wrapper, $outer, $inner, $arrow, $content, $text;

      $anchor = $(this);
      $wrapper = $('<span class="tooltip--wrapper"/>');
      $outer = $('<div class="tooltip--outer"/>');
      $inner = $('<div class="tooltip--inner"/>');
      $arrow = $('<div class="tooltip--arrow"/>');
      $content = $('<div class="tooltip--content"/>');

      // If the link has an href, use that as the text.
      // Otherwise, use the title attribute.
      if ($anchor.attr("href") === undefined) {
        $text = $anchor.attr("title");
        // Remove the title attribute to prevent the OS tooltip.
        $anchor.attr("title", null);
      } else {
        // TODO: Handle external links using $.load().
        $text = $($anchor.attr("href"));
      }

      // Put all the parts together.
      $anchor.before($wrapper);
      $wrapper.append($anchor);
      $wrapper.append($outer);
      $outer.append($inner);
      $inner.append($arrow);
      $inner.append($content);
      $content.append($text);

      // Hide the content.
      $outer.hide();

      // If the anchor has tooltip-toggle, use clicks to toggle
      // the view of the tooltip. Otherwise use hovers.
      if ($anchor.hasClass("tooltip-toggle")) {

        // On click toggle the view state of the tooltip.
        $anchor.on("click", function () {
          $outer.toggle();
          // repositionTooltip($inner);
          return false;
        });

      } else {

        // Show the content on mouse enter.
        $wrapper.on("mouseenter", function () {
          $outer.show();
          // repositionTooltip($inner);
        });

        // Hide the content on mouse leave.
        $wrapper.on("mouseleave", function () {
          $outer.hide();
        });

        // Prevent click the anchor from following the link.
        $anchor.on("click", function () {
          return false;
        });

      }

      // Reposition tooltip when resizing window
      // $(window).on("resize", function(){
      //   repositionTooltip($inner);
      // });

    }).addClass("tooltip-initialized");

  });

}(document, window, jQuery));
