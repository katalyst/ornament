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

  // Handle clicks.
  $(document).on("click", query.join(", "), function (event) {

    var $link = $(event.target);

    $.each(Orn.internalLinkSelectors, function (i, v) {
      $link = $link.not(v);
    });

    if ($link.length > 0) {
      window.open($link.attr("href"));
      return false;
    }

  });

}(document, window, Ornament, jQuery));
