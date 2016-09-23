Ornament = window.Ornament = {

  // SubObject for Ornament Components
  Components: {},

  // Default arrays for external links script
  externalLinkExtensions: [],
  internalLinkSelectors: [],

  // Technology support
  jQueryUISupport: false,
  serviceWorkerSupport: "serviceWorker" in navigator,
  geolocationAvailable: "geolocation" in navigator,

  // Header Breakpoint
  // Should match $breakpoint-header in settings.css
  headerBreakpoint: 990,

  // Animated scroll 
  bodyScroll: function(offset, timing){
    $("html,body").animate({
      scrollTop: offset
    }, timing);
  },

  // Parameterize function
  parameterize: function(url) {
    return url.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'');
  },

  // Map colours
  mapColours: [{"featureType":"water","elementType":"geometry","stylers":[{"color":"#0182c6"}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#7ac043"}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#7ac043"}]},{"featureType":"road.highway","elementType":"geometry","stylers":[{"color":"#7ac043"},{"lightness":-40}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#7ac043"},{"lightness":-20}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#7ac043"},{"lightness":-17}]},{"elementType":"labels.text.stroke","stylers":[{"color":"#ffffff"},{"visibility":"on"},{"weight":0.9}]},{"elementType":"labels.text.fill","stylers":[{"visibility":"on"},{"color":"#ffffff"}]},{"featureType":"poi","elementType":"labels","stylers":[{"visibility":"simplified"}]},{"elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#7ac043"},{"lightness":-10}]},{},{"featureType":"administrative","elementType":"geometry","stylers":[{"color":"#7ac043"},{"weight":0.7}]}]

};

// Short namespace for Components
// eg. Ornament.C.Toggles
Ornament.C = Ornament.Components;