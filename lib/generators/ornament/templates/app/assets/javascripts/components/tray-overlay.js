"use strict";

(function (document, window, Orn, Utils) {

  var Tray = {

    selectors: {
      buttons: "data-tray-button",
      closeButtons: "data-tray-close",
      scrollPusher: "data-tray-scroll-positioner",
      overlay: "data-tray-overlay"
    },

    classes: {
      open: "overlay__open",
      transitioning: "overlay__transitioning"
    },

    // Time to wait until the transition class is removed
    transition: 200,

    // Sidebar is accessibly hidden when mobile
    hiddenWhenMobile: true,

    // Internal flags
    isOpen: false,
    transitionTimer: null,
    scrollOffset: 0,

    // Open the tray
    openTray: function(){
      if(Tray.beforeOpen) {
        Tray.beforeOpen();
      }

      Tray.isOpen = true;
      Tray.setAria();

      // Clear timer if already going
      if(Tray.transitionTimer) {
        clearTimeout(Tray.transitionTimer);
      }

      // Offset the pusher element by the amount scrolled (in the case of sticky header)
      if(Tray.$scrollPusher) {
        Tray.scrollOffset = window.scrollY;
        Tray.$scrollPusher.style.top = (Tray.scrollOffset * -1) + "px";
      }

      // Add the transition and opening classes
      Tray.$classTarget.classList.add(Tray.classes.transitioning);
      Tray.$classTarget.classList.add(Tray.classes.open);
      
      // Wait until transition is completed and remove the transitioning class
      Tray.transitionTimer = setTimeout(function(){
        Tray.$classTarget.classList.remove(Tray.classes.transitioning);

        if(Tray.afterOpen) {
          Tray.afterOpen();
        }
      }, Tray.transition);
    },

    // Close the tray
    closeTray: function(){
      if(Tray.beforeClose) {
        Tray.beforeClose();
      }

      Tray.isOpen = false;
      Tray.setAria();

      // Clear timer if already going
      if(Tray.transitionTimer) {
        clearTimeout(Tray.transitionTimer);
      }

      // Remove open class and add transitioning class
      Tray.$classTarget.classList.remove(Tray.classes.open);
      Tray.$classTarget.classList.add(Tray.classes.transitioning);

      // Offset the pusher element by the amount scrolled (in the case of sticky header)
      if(Tray.$scrollPusher) {
        Tray.$scrollPusher.style.top = "";
        window.scrollTo(0, Tray.scrollOffset);
      }

      // Wait until transition is completed and remove the transitioning class
      Tray.transitionTimer = setTimeout(function(){
        Tray.$classTarget.classList.remove(Tray.classes.transitioning);

        if(Tray.afterClose) {
          Tray.afterClose();
        }
      }, Tray.transition);
    },

    // Open or close the tray depending on the current state
    toggleTray: function(){
      if(Tray.isOpen) {
        Tray.closeTray();
      } else {
        Tray.openTray();
      }
    },

    // Bind a button to toggle the tray when clicked
    bindToggleButton: function($button) {
      Ornament.U.bindOnce($button, "click", Tray.toggleTray);
    },

    // Bind a button to close the tray when clicked
    bindCloseButton: function($button) {
      Ornament.U.bindOnce($button, "click", Tray.closeTray);
    },

    forEachButton: function(callback){
      if(Tray.$buttons.length) {
        for(var i = 0; i < Tray.$buttons.length; i++) {
          callback(Tray.$buttons[i]);
        }
      }
    },

    setAria: function(){
      var label = Tray.isOpen ? "Close menu" : "Open menu";
      Tray.forEachButton(function($button){
        $button.setAttribute("aria-label", label);
      });
    },

    init: function(){
      Tray.$buttons = document.querySelectorAll("[" + Tray.selectors.buttons + "]");
      Tray.$closeButtons = document.querySelectorAll("[" + Tray.selectors.closeButtons + "]");
      Tray.$scrollPusher = document.querySelector("[" + Tray.selectors.scrollPusher + "]");
      Tray.$classTarget = document.body;
      Tray.$overlay = document.querySelector("[" + Tray.selectors.overlay + "]");

      // Bind Toggle Buttons
      Tray.forEachButton(function($button) {
        Tray.bindToggleButton($button);
      });

      // Set aria labels
      Tray.setAria();

      // Bind Close Buttons
      if(Tray.$closeButtons.length) {
        for(var i = 0; i < Tray.$closeButtons.length; i++) {
          Tray.bindCloseButton(Tray.$closeButtons[i]);
        }
      }

      // Clicking away from the tray should close it
      Ornament.U.bindOnce(document, "mousedown", function(event){
        if(Tray.isOpen) {
          var target = event.target;
          var inOverlay = Tray.$overlay && Tray.$overlay.contains(target);
          var inAnchors = false;
          for(var i = 0; i < Tray.$buttons.length; i++) {
            if(Tray.$buttons[i].contains(target)) {
              inAnchors = true;
            }
          }
          if(!inOverlay && !inAnchors) {
            Tray.closeTray();
          }
        }
      });
    }
  }
  
  Orn.registerComponent("OverlayTray", Tray);

}(document, window, Ornament, Ornament.Utilities));