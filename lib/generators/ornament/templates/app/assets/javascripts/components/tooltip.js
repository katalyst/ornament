/*jslint browser: true, indent: 2, todo: true */
/*global jQuery*/

(function($) {
  "use strict";

  $(".tooltip").livequery(function() {

    var $anchor, $wrapper, $outer, $inner, $arrow, $content;

    $anchor = $(this);
    $wrapper = $('<span class="tooltip--wrapper"/>');
    $outer = $('<div class="tooltip--outer"/>');
    $inner = $('<div class="tooltip--inner"/>');

    // If the link has an href, use that as the content.
    // Otherwise, use the title attribute.
    if ($anchor.attr("href") === undefined) {
      $content = $anchor.attr("title");
      // Remove the title attribute to prevent the OS tooltip.
      $anchor.attr("title", null);
    } else {
      // TODO: Handle external links using $.load().
      $content = $($anchor.attr("href"));
    }

    // Put all the parts together.
    $anchor.before($wrapper);
    $wrapper.append($anchor);
    $wrapper.append($outer);
    $outer.append($inner);
    $inner.append($content);

    // Hide the content.
    $outer.hide();

    // If the anchor has tooltip-toggle, use clicks to toggle
    // the view of the tooltip. Otherwise use hovers. 
    if( $anchor.hasClass("tooltip-toggle") ) {
      // On click toggle the view state of the tooltip.
      $anchor.on("click", function(e){
        e.preventDefault();
        $outer.toggle();
      });
    } else {
      // Show the content on mouse enter.
      $anchor.on("mouseenter", function() {
        $outer.show();
      });

      // Hide the content on mouse leave.
      $anchor.on("mouseleave", function() {
        $outer.hide();
      });

      // Prevent click the anchor from following the link.
      $anchor.on("click", function() {
        return false;
      });
    }
  });

}(jQuery));
