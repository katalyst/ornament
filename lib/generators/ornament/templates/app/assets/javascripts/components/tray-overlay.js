(function (document, window, Orn, Utils) {
  "use strict";

  var Tray = {

    selectors: {
      buttons: "data-tray-button",
      closeButtons: "data-tray-close",
      scrollPusher: "data-tray-scroll-positioner",
      overlay: "data-tray-overlay",
    },

    classes: {
      open: "overlay__open",
      transitioning: "overlay__transitioning"
    },

    // Time to wait until the transition class is removed
    transition: 200,

    // Internal flags
    isOpen: false,
    transitionTimer: null,
    scrollOffset: 0,
    focusTrap: {},

    // pixels, should match $tray-breakpoint
    breakTabLockAt: false,

    // Simple helper to loop over all toggle buttons
    forEachButton: function(callback){
      if(Tray.$buttons.length) {
        for(var i = 0; i < Tray.$buttons.length; i++) {
          callback(Tray.$buttons[i]);
        }
      }
    },

    // Get all focusable elements in the overlay so that we can
    // lock the user in to only keyboard tabbing through the 
    // overlay and not on to the actual page
    getFocusableElementsInOverlay: function(){
      if(!Tray.$overlay) {
        return;
      }
      var focusableElementsString = 'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex="0"], [contenteditable]';
      var focusableElements = Tray.$overlay.querySelectorAll(focusableElementsString);
      // Convert NodeList to Array
      focusableElements = Array.prototype.slice.call(focusableElements);
      // Assign our tab-lock sentinals
      Tray.focusTrap.first = focusableElements[0];
      Tray.focusTrap.last = focusableElements[focusableElements.length - 1];
    },

    // Simple helper to update the aria label of each toggle button
    // based on the open state of the tray
    setAria: function(){
      var label = Tray.isOpen ? "Close menu" : "Open menu";
      Tray.forEachButton(function($button){
        $button.setAttribute("aria-label", label);
      });
    },

    isMobile: function(){
      if(Tray.breakTabLockAt) {
        return window.matchMedia("(max-width: " + Tray.breakTabLockAt + "px)").matches;
      } else {
        return true;
      }
    },

    // Open the tray
    openTray: function(){
      if(Tray.beforeOpen) {
        Tray.beforeOpen();
      }

      Tray.isOpen = true;
      Tray.setAria();
      Tray.focusTrap.opener = document.activeElement;

      // Clear timer if already going
      if(Tray.transitionTimer) {
        clearTimeout(Tray.transitionTimer);
      }

      // Offset the pusher element by the amount scrolled (in the case of sticky header)
      if(Tray.$scrollPusher) {
        Tray.scrollOffset = window.pageYOffset;
        Tray.$scrollPusher.style.top = (Tray.scrollOffset * -1) + "px";
      }

      // Add the transition and opening classes
      Tray.$classTarget.classList.add(Tray.classes.transitioning);
      Tray.$classTarget.classList.add(Tray.classes.open);
      
      // Wait until transition is completed and remove the transitioning class
      Tray.transitionTimer = setTimeout(function(){
        Tray.$classTarget.classList.remove(Tray.classes.transitioning);

        // Find first element to focus on after opening
        if(Tray.focusTrap.firstAfterOpen) {
          Tray.focusTrap.firstAfterOpen.focus();
        } else if(Tray.focusTrap.first) {
          Tray.focusTrap.first.focus();
        }

        // Callback
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

        // Re-focus on opener element
        if(Tray.focusTrap.opener) {
          Tray.focusTrap.opener.focus();
        }

        // Callback
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

    bindShortcuts: function(){
      // Populate Tray.focusTrap with our element list
      Tray.getFocusableElementsInOverlay();

      document.addEventListener("keydown", function(event) {
        // Keyboard shortcuts only when menu is open
        if(Tray.isOpen && Tray.isMobile()) {

          // Trap tab and shift+tab keys to lock user in to keyboard
          // navigating only the menu
          // On <tab> press
          if(event.keyCode === 9) {

            // On <shift + tab>
            if(event.shiftKey) {
              if(document.activeElement === Tray.focusTrap.first) {
                // Stop shift+tab default action
                event.preventDefault();
                // Focus on last element (loop focus back around)
                Tray.focusTrap.last.focus();
              }
            } else {

              if(document.activeElement === Tray.focusTrap.last) {
                // Stop default tab action
                event.preventDefault();
                // Focus on first element (loop back around)
                Tray.focusTrap.first.focus();
              }
            }
          }

          // Close sidebar when user presses "esc"
          if(event.keyCode === 27) {
            Tray.closeTray();
          }
        }

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

      // Bind Close Buttons
      if(Tray.$closeButtons.length) {
        for(var i = 0; i < Tray.$closeButtons.length; i++) {
          Tray.bindCloseButton(Tray.$closeButtons[i]);
        }
      }

      // Set aria labels
      Tray.setAria();

      // Bind keyboard shortcuts
      Tray.bindShortcuts();

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