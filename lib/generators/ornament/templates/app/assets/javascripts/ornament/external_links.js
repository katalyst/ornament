/*jslint browser: true, indent: 2, todo: true, unparam: true */
/*global jQuery,Ornament */

(function (document, window, Orn, $) {

  "use strict";

  var query = [];

  // Add suffixes to query.
  $.each(Orn.externalLinkExtensions, function (i, v) {
    query.push("[href$='." + v + "']");
    query.push("[href$='." + v.toUpperCase() + "']");
  });

  // Add prefixes to query.
  $.each([ "http://", "https://" ], function (i, v) {
    query.push("[href^='" + v + "']");
  });

  var isDragging = false;

  // Handle clicks.
  $(document).on("mousedown", query.join(", "), function (event) {

    $(window).mousemove(function(){
      isDragging = true;
      $(window).unbind("mousemove");
    });

  }).on("mouseup", function(event) {

    var wasDragging = isDragging;
    isDragging = false;
    $(window).unbind("mousemove");

    if(!wasDragging) {

      var $link = $(event.target);

      // Why are images taking focus? Detect if it's an image
      // use parent anchor instead
      if ($link.is("img")) {
        $link = $link.parent("a");
      }

      $.each(Orn.internalLinkSelectors, function (i, v) {
        $link = $link.not(v);
      });

      if ($link.length > 0) {
        window.open($link.attr("href"));
        return false;
      }
    }

  });

}(document, window, Ornament, jQuery));
