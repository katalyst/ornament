/*jslint browser: true, indent: 2, todo: true, unparam: true */
/*global jQuery,Ornament /*/

/*
  Shifty is a way of moving entire blocks of dom to new areas of the page
  when a certain breakpoint is met 

  uiElements are defined on the page eg:

  $(document).on("ornament:refresh", function(){
    Ornament.C.Shifty.uiElements = [{
      desktop: $("[data-element-desktop]"),
      mobile: $("[data-element-mobile]"),
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

  var Shifty = Ornament.C.Shifty = {

    uiElements: [],
    layout: "desktop",
    layoutBreakpoint: Ornament.headerBreakpoint,

    _resizeListener: function(){
      // Test to see what size the viewport is compared to the breakpoint
      if(Ornament.windowWidth() >= Shifty.layoutBreakpoint + 1) {
        // Move to desktop
        if(Shifty.layout === "mobile") {
          $.each(Shifty.uiElements, function(){
            var uiElement = this;
            uiElement.mobile.find("[data-shifty-target]").appendTo(uiElement.desktop);
            if(uiElement.desktopCallback) {
              uiElement.desktopCallback(uiElement.desktop, uiElement.mobile);
            }
          });
          Shifty.layout = "desktop";
        }
      } else {
        // Move to mobile
        if(Shifty.layout === "desktop") {
          $.each(Shifty.uiElements, function(){
            var uiElement = this;
            uiElement.desktop.find("[data-shifty-target]").appendTo(uiElement.mobile);
            if(uiElement.mobileCallback) {
              uiElement.mobileCallback(uiElement.desktop, uiElement.mobile);
            }
          });
          Shifty.layout = "mobile";
        }
      }
    },

    init: function(){
      if(Shifty.uiElements.length > 0) {
        // Update UI based on initial screen size
        Shifty._resizeListener();
        // Update UI when the screen size changes
        $(window).off("resize", Shifty._resizeListener).on("resize", Shifty._resizeListener);
        $(document).on("turbolinks:before-cache", function() {
          $(window).off("resize", Shifty._resizeListener);
        });
      }
    }

  };

}(document, window, jQuery));
