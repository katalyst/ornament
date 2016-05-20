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

  // Event Tracking
  var trackButton = function($button) {
    $button.on("click", function(){
      var linkCategory = $button.text().trim() || "No text";
      var linkLabel = $button.attr("href");

      if($button.is("[data-track-category]")) {
        linkCategory = $button.attr("data-track-category");
      }

      if($button.is("[data-track-label]")) {
        linkLabel = $button.attr("data-track-label");
      }

      if(eventTrackingType == "ga.js") {
        if(eventDebugging) {
          alert(['_trackEvent', linkCategory, 'click', linkLabel]);
        } else {
          _gaq.push(['_trackEvent', linkCategory, 'click', linkLabel]);
        }
      } else if (eventTrackingType == "analytics.js") {
        if(eventDebugging) {
          alert("'send', 'event', '"+linkCategory+"', 'click', '"+linkLabel+"'");
        } else {
          ga('send', 'event', linkCategory, 'click', linkLabel);
        }
      }
    });
  }

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
      if(eventTrackingType) {
        trackButton($button);
      }

    });

    $("[data-track]").each(function(){
      trackButton($(this));
    });
  });

}(document, window, Ornament, jQuery));
