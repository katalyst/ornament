/*
  Shifty is a way of moving entire blocks of dom to new areas of the page
  when a certain breakpoint is met 

  uiElements are defined on the page eg:

  Ornament.onLoad(function(){
    Ornament.C.Shifty.uiElements = [{
      desktop: document.querySelector("[data-element-desktop]"),
      mobile: document.querySelector("[data-element-mobile]"),
      desktopCallback: function(desktop, mobile){
        // do something when moved to desktop
      },
      mobileCallback: function(desktop, mobile){
        // do something when moved to mobile
      }
    }];
  });

  You can also customise the global layoutBreakpoint if necessary here too:
  layoutBreakpoint: 900

  Then make sure you init the listeners:
  Shifty.init();

*/

(function (document, window, $) {
  "use strict";

  var Shifty = {

    uiElements: [],
    layout: "desktop",
    layoutBreakpoint: Ornament.headerBreakpoint || 990,

    _resizeListener: function(force){
      if(Shifty.uiElements.length === 0) {
        return;
      }
      force = force || false;
      // Test to see what size the viewport is compared to the breakpoin
      var isDesktop = Ornament.windowWidth() >= Shifty.layoutBreakpoint + 1;
      if(isDesktop) {
        // Move to desktop
        if(Shifty.layout === "mobile" || force) {
          Shifty.uiElements.map(function(uiElement){
            var $target = uiElement.mobile.querySelector("[data-shifty-target]");
            if($target) {
              uiElement.desktop.appendChild($target);
            }
            if(uiElement.desktopCallback) {
              uiElement.desktopCallback(uiElement.desktop, uiElement.mobile);
            }
          });
          Shifty.layout = "desktop";
        }
      } else {
        // Move to mobile
        if(Shifty.layout === "desktop" || force) {
          Shifty.uiElements.map(function(uiElement){
            var $target = uiElement.desktop.querySelector("[data-shifty-target]");
            if($target) {
              uiElement.mobile.appendChild($target);
            }
            if(uiElement.mobileCallback) {
              uiElement.mobileCallback(uiElement.desktop, uiElement.mobile);
            }
          });
          Shifty.layout = "mobile";
        }
      }
    },

    init: function(){
      // Update UI based on initial screen size
      Shifty._resizeListener(Ornament.features.turbolinks);
      
      Ornament.beforeTurbolinksCache(function(){
        Shifty.uiElements = [];
        Shifty.layout = "desktop";
        Shifty._resizeListener();
      });
    }

  };

  Ornament.registerComponent("Shifty", Shifty);

}(document, window));
