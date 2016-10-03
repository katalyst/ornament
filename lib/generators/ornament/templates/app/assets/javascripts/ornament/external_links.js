/*jslint browser: true, indent: 2, todo: true, unparam: true */
/*global jQuery,Ornament */

(function (document, window, Orn, $) {

  "use strict";

  var query = [];
  var eventTrackingType = false; // can be "ga.js", "analytics.js" or false
  var eventDebugging = false;

  // Add suffixes to query.
  $.each(Orn.externalLinkExtensions, function (i, v) {
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
      if(Ornament.eventTrackingType) {
        Ornament.Components.Analytics.trackEvent($button);
      }

    });
  });

}(document, window, Ornament, jQuery));
