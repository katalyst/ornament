Ornament = window.Ornament || {};

// =========================================================================
// Internal settings
// =========================================================================

// Header Breakpoint
// Should match $breakpoint-header in settings.css
Ornament.headerBreakpoint = 990;

// Core settings
Ornament.externalLinkExtensions = [];
Ornament.internalLinkSelectors = [];

// Map colours
Ornament.mapColours = false;
// Ornament.mapColours = [{"featureType":"water","elementType":"geometry","stylers":[{"color":"#0182c6"}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#7ac043"}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#7ac043"}]},{"featureType":"road.highway","elementType":"geometry","stylers":[{"color":"#7ac043"},{"lightness":-40}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#7ac043"},{"lightness":-20}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#7ac043"},{"lightness":-17}]},{"elementType":"labels.text.stroke","stylers":[{"color":"#ffffff"},{"visibility":"on"},{"weight":0.9}]},{"elementType":"labels.text.fill","stylers":[{"visibility":"on"},{"color":"#ffffff"}]},{"featureType":"poi","elementType":"labels","stylers":[{"visibility":"simplified"}]},{"elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#7ac043"},{"lightness":-10}]},{},{"featureType":"administrative","elementType":"geometry","stylers":[{"color":"#7ac043"},{"weight":0.7}]}];

// =========================================================================
// Components storage
// =========================================================================

// Components API
Ornament.Components = {};

// Short namespace for Components
// eg. Ornament.C.Toggles
Ornament.C = Ornament.Components;

// =========================================================================
// Service support
// =========================================================================

Ornament.serviceWorkerSupport = "serviceWorker" in navigator;
Ornament.geolocationAvailable = "geolocation" in navigator;

// =========================================================================
// Helper functions
// =========================================================================

// Animated scroll 
Ornament.bodyScroll = function(offset, timing){
  $("html,body").animate({
    scrollTop: offset
  }, timing);
};

// Asset Loader
// Loads in an array of assets then removes itself
// usage: Ornament.assetPreloader(["/assets/image1.jpg", "/assets/image2.png"]);
Ornament.assetPreloader = function(assets){
  assets = assets || [];
  $.each(assets, function(){
    var image = new Image();
    image.src = this;
  });
};

// Parameterize function
Ornament.parameterize = function(url) {
  return url.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'');
};

// OnLoad
Ornament.onLoad = function(callback) {
  $(document).on("ornament:refresh", function () {
    callback;
  });
}
