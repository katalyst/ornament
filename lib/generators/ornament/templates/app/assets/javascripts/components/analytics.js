/*jslint browser: true, indent: 2, todo: true, unparam: true */
/*global jQuery,Ornament /*/

(function (document, window, $) {

  "use strict";

  var Analytics = Ornament.Components.Analytics = {

    // Settings
    // type can be "dataLayer", ga.js", "analytics.js", "guess" or false
    trackingType: "guess", 
    trackingDebug: false,
    trackLinkSelector: "data-track",
    categorySelector: "data-track-category",
    labelSelector: "data-track-label",

    // Guess which tracking type should be used by testing which
    // functions are defined
    guessTrackingType: function(){
      if(typeof(dataLayer) !== "undefined") {
        Analytics.trackingType = "dataLayer";
      } else if(typeof(_gaq) !== "undefined") {
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
      if(Analytics.trackingDebug) {
        alert("Category: " + category + ", Label: " + label + ", Type: " + type);
      } else {
        if(Analytics.trackingType === "ga.js") {
          _gaq.push(['_trackEvent', category, type, label]);
        } else if (Analytics.trackingType === "analytics.js") {
          ga('send', 'event', category, type, label);
        } else if (Analytics.trackingType === "dataLayer") {
          dataLayer.push({
            "event": "event",
            "category": category,
            "action": type,
            "label": label
          });
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

    // Track app install banners when service workers are available
    _trackInstallBanner: function(){
      if(Ornament.features.serviceWorker) {
        window.addEventListener('beforeinstallprompt', function(e) {
          // e.userChoice will return a Promise.
          e.userChoice.then(function(choiceResult) {
            // Debug output of user choice if a debug param is available
            // eg.  /?appbannerinstall=test
            if(document.location.search.indexOf("appbannerinstall") > -1) {
              alert(choiceResult.outcome);
            }
            // Track the choice the user makes 
            Analytics.trackEvent("Web App Install Banner", choiceResult.outcome);
          });
        });
      } else {
        console.warn("Tried attaching install banner but service workers aren't supported.");
      }
    },

    init: function(){
      if(Analytics.trackingType === "guess") {
        Analytics.guessTrackingType();
      }
      $("[" + Analytics.trackLinkSelector + "]").each(function(){
        Analytics.trackLink($(this));
      });
      if(Ornament.features.serviceWorker) {
        Analytics._trackInstallBanner();
      }
    }
  }

  $(document).on("ornament:refresh", function () {
    Analytics.init();
  });

  // Turbolinks helper for analytics
  // https://github.com/turbolinks/turbolinks/issues/73
  if(Ornament.features.turbolinks) {
    $(document).on("turbolinks:load", function(event) {
      var loadedUrl = event.originalEvent.data.url;
      if(Analytics.trackingType === "analytics.js") {
        ga("set", "location", loadedUrl);
        ga("send", "pageview");
      } else if (Analytics.trackingType === "dataLayer") {
        dataLayer.push({
          "event": "pageView",
          "virtualUrl": loadedUrl
        });
      }
    });
  }

}(document, window, jQuery));