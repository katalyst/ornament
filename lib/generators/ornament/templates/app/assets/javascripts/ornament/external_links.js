/*jslint browser: true, indent: 2, todo: true, unparam: true */
/*global jQuery*/

(function (document, window, $) {

  "use strict";

  var query = [];

  // Add suffixes to query.
  $.each([ "pdf", "doc", "docx", "xls", "ppt" ], function (i, v) {
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

    $link = $link.not("[rel*=internal]");

    // TODO: Exculde absolute links to the same domain.

    if ($link.length > 0) {
      window.open($link.attr("href"));
      return false;
    }

  });

}(document, window, jQuery));
