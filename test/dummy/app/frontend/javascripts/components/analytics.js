(function (document, window) {
  "use strict";

  var Analytics = {

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
      if(!Ornament.features.tracking) {
        Analytics.trackingType = false;
      } else if(typeof(dataLayer) !== "undefined") {
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
      if(!Ornament.features.tracking) {
        return false;
      }
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
      if(!Ornament.features.tracking) {
        return false;
      }
      Ornament.U.bindOnce($anchor, "click", function(){
        var linkCategory = $anchor.innerText.trim() || "No text";
        linkCategory = "External link: " + linkCategory;
        var linkLabel = $anchor.getAttribute("href");
        if($anchor.hasAttribute(Analytics.categorySelector)) {
          linkCategory = $anchor.getAttribute(Analytics.categorySelector);
        }
        if($anchor.hasAttribute(Analytics.labelSelector)) {
          linkLabel = $anchor.getAttribute(Analytics.labelSelector);
        }
        Analytics.trackEvent(linkCategory, linkLabel, "click");
      });
    },

    // Send a virtual pageview (eg. loading a new set of filtered data via JS)
    // Ornament.C.Analytics.trackVirtualPageview("/my-new-path?param=value");
    // Ornament.C.Analytics.trackVirtualPageview("/my-new-path?param=value", "Products - Custom filtered view");
    trackVirtualPageview: function(path, title) {
      if(!Ornament.features.tracking) {
        return false;
      }
      title = title || document.title;
      if(Analytics.trackingType === "ga.js") {
        _gaq.push(["_trackPageview", path]);
      } else if(Analytics.trackingType === "analytics.js") {
        ga("set", "location", path);
        ga("send", "pageview");
      } else if (Analytics.trackingType === "dataLayer") {
        dataLayer.push({
          "event": "VirtualPageView",
          "virtualPageUrl": path,
          "virtualPageTitle": title
        });
      }
    },

    init: function(){
      if(!Ornament.features.tracking) {
        return false;
      }
      if(Analytics.trackingType === "guess") {
        Analytics.guessTrackingType();
      }
      document.querySelectorAll("[" + Analytics.trackLinkSelector + "]").forEach(function(){
        Analytics.trackLink(this);
      });
    }
  }

  Ornament.registerComponent("Analytics", Analytics);

  // Turbolinks helper for analytics
  // https://github.com/turbolinks/turbolinks/issues/73
  // Be sure to disable default analytics on-load events otherwise
  // you will always get two pageviews for the first page load
  if(Ornament.features.turbolinks) {
    document.addEventListener("turbolinks:change", function(event){
      if(Analytics.trackingType) {
        trackVirtualPageview(event.data.url);
      }
    });
  }

}(document, window));