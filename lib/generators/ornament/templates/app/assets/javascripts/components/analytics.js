/*jslint browser: true, indent: 2, todo: true, unparam: true */
/*global jQuery,Ornament /*/

(function (document, window, $) {

  "use strict";

  $(document).on("ornament:refresh", function () {

    var Analytics = Ornament.Components.Analytics = {

      // Settings
      // type can be "ga.js", "analytics.js", "guess" or false
      trackingType: "guess", 
      trackingDebug: false,
      trackLinkSelector: "data-track",
      categorySelector: "data-track-category",
      labelSelector: "data-track-label",

      guessTrackingType: function(){
        if(typeof(_gaq) !== "undefined") {
          Analytics.trackingType = "ga.js";
        } else if(typeof(ga) !== "undefined") {
          Analytics.trackingType = "analytics.js";
        } else {
          Analytics.trackingType = false;
        }
      },

      // Push an event to Google Analytics
      trackEvent: function(category, label, type){
        type = type || "click";
        if(Analytics.trackingType === "ga.js") {
          if(Analytics.trackingDebug) {
            alert(['_trackEvent', category, type, label]);
          } else {
            _gaq.push(['_trackEvent', category, type, label]);
          }
        } else if (Analytics.trackingType === "analytics.js") {
          if(Analytics.trackingDebug) {
            alert("'send', 'event', '" + category + "', type, '" + label + "'");
          } else {
            ga('send', 'event', category, type, label);
          }
        }
      },

      // Build options from a link and then track it
      trackLink: function($anchor){
        $anchor.on("click", function(){
          var linkCategory = $anchor.text().trim() || "No text";
          var linkLabel = $anchor.attr("href");
          if($anchor.is("[" + Analytics.categorySelector + "]")) {
            linkCategory = $anchor.attr(Analytics.categorySelector);
          }
          if($anchor.is("[" + Analytics.labelSelector + "]")) {
            linkLabel = $anchor.attr(Analytics.labelSelector);
          }
          Analytics.trackEvent(linkCategory, linkLabel, "click");
        });
      },

      init: function(){
        if(Analytics.trackingType === "guess") {
          Analytics.guessTrackingType();
        }
        $("[" + Analytics.trackLinkSelector + "]").each(function(){
          Analytics.trackButton($(this));
        });
      }

    }

    Analytics.init();

  });

}(document, window, jQuery));