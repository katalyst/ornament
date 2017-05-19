/*jslint browser: true, indent: 2, todo: true, unparam: true */
/*global jQuery,Ornament */

(function (document, window, Ornament, $) {

  "use strict";

  var query = [];

  // Add suffixes to query.
  $.each(Ornament.externalLinkExtensions, function (i, v) {
    query.push("[href$='." + v + "']");
    query.push("[href$='." + v.toUpperCase() + "']");
  });

  // Add prefixes to query.
  $.each([ "http://", "https://" ], function (i, v) {
    query.push("[href^='" + v + "']");
  });

  $(document).on("ornament:refresh", function () {
    // Handle clicks.
    $(query.join(", ")).each(function(){
      var $button = $(this);

      // Ignore on-site links
      if(!$button.is("[data-internal-link]")) {
        // Make externals open in a new window
        $button.attr("target","_blank");
      }

      // Event Tracking
      if(Ornament.Components.Analytics && Ornament.Components.Analytics.trackingType) {
        Ornament.Components.Analytics.trackLink($button);
      }

      // Noopener and noreferrer
      $("a[target='_blank']").each(function(){
        var $link = $(this);
        var rel = $link.attr("rel");
        if(rel && !rel.indexOf("noopener") > -1) {
          rel += " noopener";
        }
        if(rel && !rel.indexOf("noreferrer") > -1) {
          rel += " noreferrer";
        }
        $link.attr("rel", rel);
      });

    });
  });

}(document, window, Ornament, jQuery));
