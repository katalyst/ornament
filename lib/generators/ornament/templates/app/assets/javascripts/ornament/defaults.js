Ornament = window.Ornament || {};
Ornament.ready = false;
Ornament.version = "1.2.6";

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

Ornament.features = {}
Ornament.features.serviceWorker = "serviceWorker" in navigator;
Ornament.features.geolocation = "geolocation" in navigator;
Ornament.features.turbolinks = typeof(Turbolinks) !== "undefined" && Turbolinks.supported;

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

// Find data-elements, optionally with a value and optionally
// with a scope
// Ornament.findData("data-button") = $("[data-button]");
// Ornament.findData("data-button", "blue") = $("[data-button='blue']")
// Ornament.findData("data-button", "blue", $panel) = $panel.find("[data-button='blue']");
Ornament.findData = function(selector, value, scope) {
  var value = value || false;
  var selection = "[" + selector;
  if(value) {
    selection += "='" + value + "'";
  }
  selection += "]";
  if(scope) {
    return scope.find(selection);
  } else {
    return $(selection);
  }
}

// Parameterize function
Ornament.parameterize = function(url) {
  return url.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'');
};

// A helper wrapper to push public functions to the Component API
// Ornament.componentise("myComponent", { 
//  privateFunc: function() { alert("test"); } 
//  public: { showAlert: this.privateFunc(); } 
//});
// Ornament.C.myComponent.showAlert(); 
Ornament.componentise = function(name, component){
  Ornament.C[name] = component.public;
}

// OnLoad
// If ornament has already triggered, run it now
// If ornament isn't ready yet, wait until the refresh trigger
Ornament.onLoad = function(callback) {
  if(Ornament.ready) { callback; }
  $(document).on("ornament:refresh", callback);
}

// Bind-once function with clean unbinding on page leave and
// turbolinks travel 
// Ornament.bind(button, "click", onButtonClick);
Ornament.bind = function(target, event, func) {
  $(target).off(event, func).on(event, func);
  window.onunload = function(){
    $(target).off(event, func);
  }
  if(Ornament.features.turbolinks) {
    $(document).on("turbolinks:click", function(){
      $(target).off(event, func);
    });
  }
}


// =========================================================================
// Event Listeners
// Ornament.onScroll(function(){ console.log("hi") });
// =========================================================================

Ornament.onScroll = function(func) {
  Ornament.bind(window, "scroll", func);
}

Ornament.onResize = function(func) {
  Ornament.bind(window, "resize", func);
}

// =========================================================================
// Things to set after page is loaded
// =========================================================================
Ornament.onLoad(function(){
  Ornament.features.ie8 = $("body").hasClass("ie8");
});

// Refreshing Ornament for Turbolink visits
if(Ornament.features.turbolinks) {
  $(document).on("turbolinks:load", function(){
    Ornament.refresh && Ornament.refresh();
  });
}
