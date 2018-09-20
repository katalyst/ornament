(function (document, window, Ornament, Utils) {
  "use strict";

  var TrayNav = {
    
    classes: {
      layout: "tray-container",
      layoutTransition: "tray__transitioning",
      layoutOpen: "tray__open",
      anchorDisabled: "header--menu__waiting",
      htmlOpen: "html__tray-open"
    },
    
    selectors: {
      tray: "data-tray",
      layout: "data-tray-layout",
      anchor: "data-tray-anchor",
      page: "data-tray-page"
    },
    
    // Developer Settings 
    slideTransitionTime: 600,
    keepScrollPosition: false,
    
    // Internal settings 
    transitionTimeout: null,
    closeTimeout: null,
    drilldownTimeout: null,
    scrollPosition: 0,
    
    // =========================================================================
    // Behaviours
    // =========================================================================
    
    playDrilldown: function(){
      if(TrayNav.$drilldown) {
        var activeClass = "drilldown--list__current";
        var immediateClass = "drilldown--list__immediate";
        var $currentPane = TrayNav.$drilldown.querySelector("." + activeClass);
        $currentPane.classList.remove(activeClass);
        $currentPane.classList.add(immediateClass);
        if(TrayNav.drilldownTimeout) {
          clearTimeout(TrayNav.drilldownTimeout);
        }
        TrayNav.drilldownTimeout = setTimeout(function(){
          $currentPane.classList.remove(immediateClass);
          $currentPane.classList.add(activeClass);
        }, 10);
      }
    },

    open: function(){
      // Store scroll position 
      if(TrayNav.keepScrollPosition) {
        TrayNav.clearCloseTimeout();
        if(!TrayNav.isTransitioning()) {
          TrayNav.scrollPosition = TrayNav._getWindowOffset();
          TrayNav.$page.style.top = TrayNav.scrollPosition * -1;
          scrollTo(0, 0);
        }
      }
      TrayNav._accessTrayOpen();
      // Add classes to layout to start css transitions
      TrayNav.$layout.classList.add(TrayNav.classes.layoutTransition);
      TrayNav.$layout.classList.add(TrayNav.classes.layoutOpen);
      // Remove the transition class after a timeout 
      TrayNav.clearTransitionTimeout();
      TrayNav.startTransitionTimeout();
      // Resize Drilldowns
      TrayNav.resizeDrilldowns();
      // Focus on first link if available
      setTimeout(function(){
        // TrayNav.focusOnFirstLink();
      }, TrayNav.slideTransitionTime);
      TrayNav.playDrilldown();
      // Bind overlay click event to close menu 
      TrayNav._bindOverlay();
      TrayNav.$html.classList.add(TrayNav.classes.htmlOpen);
    },
    
    close: function(){
      TrayNav._unbindOverlay();
      // Aria tags for accessibility
      TrayNav._accessTrayClosed();
      // Swap classes
      TrayNav.$layout.classList.remove(TrayNav.classes.layoutOpen);
      TrayNav.$layout.classList.add(TrayNav.classes.layoutTransition);
      TrayNav.clearTransitionTimeout();
      TrayNav.startTransitionTimeout();
      if(TrayNav.keepScrollPosition) {
        TrayNav.closeTimeout = setTimeout(function(){
          TrayNav.$page.top = 0;
          scrollTo(0, TrayNav.scrollPosition);
        }, TrayNav.slideTransitionTime);
      }
      TrayNav.$html.classList.remove(TrayNav.classes.htmlOpen);
    },
    
    toggle: function(){
      if(TrayNav.isOpen()) {
        TrayNav.close();
      } else {
        TrayNav.open();
      }
    },
    
    focusOnFirstLink: function(){
      // Get first link in pane 
      // Focus on it 
      // Return first link because it's a nice thing to do 
      var $current = false;
      var $trayDrilldown = TrayNav.$drilldown;
      if(Ornament.C.Drilldown && $trayDrilldown.length) {
        $current = TrayNav.$tray.querySelector(".drilldown--list__current [tabindex]");
      } else {
        $current = TrayNav.$tray.querySelector("a,button");
      }
      if($current) {
        $current.focus();
      }
      return $current;
    },
    
    // =========================================================================
    // Getters
    // =========================================================================
    
    _getElements: function(){
      TrayNav.$tray = document.querySelector("[" + TrayNav.selectors.tray + "]");
      TrayNav.$layout = document.querySelector("[" + TrayNav.selectors.layout + "]");
      TrayNav.$anchor = document.querySelectorAll("[" + TrayNav.selectors.anchor + "]");
      TrayNav.$page = document.querySelector("[" + TrayNav.selectors.page + "]");
      if(TrayNav.$tray) {
        TrayNav.$drilldown = TrayNav.$tray.querySelector("[data-drilldown-init]");
      }
      TrayNav.$html = document.documentElement;
    },
    
    _getWindowOffset: function(){
      return window.pageYOffset;
    },
    
    isOpen: function(){
      return TrayNav.$layout.classList.contains(TrayNav.classes.layoutOpen);
    },
    
    isTransitioning: function(){
      return TrayNav.$layout.classList.contains(TrayNav.classes.layoutTransition);
    },
    
    // =========================================================================
    // Accessorise
    // =========================================================================

    _accessTrayClosed: function(){
      TrayNav.$tray.setAttribute("tabIndex", -1);
      TrayNav.$tray.setAttribute("aria-hidden", true);

      TrayNav.$page.setAttribute("tabIndex", 0);
      TrayNav.$page.setAttribute("aria-hidden", false);

      TrayNav.$anchor.forEach(function($anchor) {
        $anchor.setAttribute("tabIndex", 0);
        $anchor.setAttribute("aria-expanded", false);
        $anchor.setAttribute("aria-label", "Open menu");
      });
    },

    _accessTrayOpen: function(){
      TrayNav.$tray.setAttribute("aria-hidden", false);
      TrayNav.$tray.removeAttribute("tabIndex");

      TrayNav.$page.setAttribute("tabIndex", -1);
      TrayNav.$page.setAttribute("aria-hidden", true);

      TrayNav.$anchor.forEach(function($anchor) {
        $anchor.setAttribute("tabIndex", 2);
        $anchor.setAttribute("aria-expanded", true);
        $anchor.setAttribute("aria-label", "Close menu");
      });
    },

    // =========================================================================
    // Timeouts
    // =========================================================================
    
    clearTransitionTimeout: function(){
      if(TrayNav.transitionTimeout !== undefined) {
        clearTimeout(TrayNav.transitionTimeout);
      }
    },
    
    startTransitionTimeout: function(){
      TrayNav.transitionTimeout = setTimeout(function(){
        TrayNav.$layout.classList.remove(TrayNav.classes.layoutTransition);
      }, TrayNav.slideTransitionTime);
    },
    
    clearCloseTimeout: function(){
      if(TrayNav.closeTimeout !== undefined) {
        clearTimeout(TrayNav.closeTimeout);
      }
    },
    
    // =========================================================================
    // Bindings
    // =========================================================================
    
    _bindAnchor: function() {
      TrayNav.$anchor.forEach(function($anchor) {
        Ornament.U.bindOnce($anchor, "click", TrayNav.toggle);
      });
      // Remove waiting class from button 
      var $waitingElements = document.querySelectorAll("." + TrayNav.classes.anchorDisabled);
      $waitingElements.forEach(function($node){
        $node.classList.remove(TrayNav.classes.anchorDisabled);
      });
    },

    _overlayClickEvent: function(event){
      event.preventDefault();
      var close = true;
      // Test for tray clicks
      if(TrayNav.$tray.contains(event.target)) {
        close = false;
        return;
      }
      // Test for anchor clicks
      TrayNav.$anchor.forEach(function($anchor){
        if($anchor.contains(event.target)) {
          close = false;
          return;
        }
      });
      if(close) {
        TrayNav.close();
      }
    },
    
    _bindOverlay: function(){
      document.removeEventListener("click", TrayNav._overlayClickEvent);
      document.addEventListener("click", TrayNav._overlayClickEvent);
    },
    
    _unbindOverlay: function(){
      document.removeEventListener("click", TrayNav._overlayClickEvent);
    },
    
    resizeDrilldowns: function(){
      if(Ornament.C.Drilldown && TrayNav.$drilldown) {
        TrayNav.$drilldown.forEach(function($drilldown){
          Ornament.triggerEvent($drilldown, Ornament.C.Drilldown.triggerNamespace + ":resize");
        });
      }
    },

    // =========================================================================
    // Init
    // =========================================================================
    
    init: function(){
      TrayNav._getElements();
      if(TrayNav.$tray) {
        TrayNav._accessTrayClosed();
        TrayNav._bindAnchor();
        if(TrayNav.isOpen()) {
          TrayNav._bindOverlay();
        }
        // Closing menu before turbolinks cache 
        Ornament.beforeTurbolinksCache(function(){
          TrayNav.close();
        });
      }
    }
  }

  Ornament.registerComponent("PushTray", TrayNav);

}(document, window, Ornament, Ornament.Utilities));
