"use strict";

(function (document, window, Ornament, Utils) {

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
      if(TrayNav.$drilldown.length) {
        var activeClass = "drilldown--list__current";
        var immediateClass = "drilldown--list__immediate";
        var $currentPane = TrayNav.$drilldown.find("." + activeClass);
        $currentPane.removeClass(activeClass).addClass(immediateClass);
        if(TrayNav.drilldownTimeout) {
          clearTimeout(TrayNav.drilldownTimeout);
        }
        TrayNav.drilldownTimeout = setTimeout(function(){
          $currentPane.removeClass(immediateClass).addClass(activeClass);
        }, 10);
      }
    },

    open: function(){
      // Store scroll position 
      if(TrayNav.keepScrollPosition) {
        TrayNav.clearCloseTimeout();
        if(!TrayNav.isTransitioning()) {
          TrayNav.scrollPosition = TrayNav._getWindowOffset();
          TrayNav.$page.css({
            top: TrayNav.scrollPosition * -1
          });
          scrollTo(0, 0);
        }
      }
      TrayNav._accessTrayOpen();
      // Add classes to layout to start css transitions
      TrayNav.$layout.addClass(TrayNav.classes.layoutTransition + " " + TrayNav.classes.layoutOpen);
      // Remove the transition class after a timeout 
      TrayNav.clearTransitionTimeout();
      TrayNav.startTransitionTimeout();
      // Resize Drilldowns
      TrayNav.resizeDrilldowns()
      // Focus on first link if available
      setTimeout(function(){
        // TrayNav.focusOnFirstLink();
      }, TrayNav.slideTransitionTime);
      TrayNav.playDrilldown();
      // Bind overlay click event to close menu 
      TrayNav._bindOverlay();
      TrayNav.$html.addClass(TrayNav.classes.htmlOpen);
    },
    
    close: function(){
      TrayNav._unbindOverlay();
      // Aria tags for accessibility
      TrayNav._accessTrayClosed();
      // Swap classes
      TrayNav.$layout.removeClass(TrayNav.classes.layoutOpen).addClass(TrayNav.classes.layoutTransition);
      TrayNav.clearTransitionTimeout();
      TrayNav.startTransitionTimeout();
      if(TrayNav.keepScrollPosition) {
        TrayNav.closeTimeout = setTimeout(function(){
          TrayNav.$page.css({
            top: 0
          });
          scrollTo(0, TrayNav.scrollPosition);
        }, TrayNav.slideTransitionTime);
      }
      TrayNav.$html.removeClass(TrayNav.classes.htmlOpen);
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
        $current = TrayNav.$tray.find(".drilldown--list__current [tabindex]").first().focus();
      } else {
        $current = TrayNav.$tray.find("a,button").first().focus();
      }
      return $current;
    },
    
    // =========================================================================
    // Getters
    // =========================================================================
    
    _getElements: function(){
      TrayNav.$tray = Ornament.U.findData(TrayNav.selectors.tray);
      TrayNav.$layout = Ornament.U.findData(TrayNav.selectors.layout);
      TrayNav.$anchor = Ornament.U.findData(TrayNav.selectors.anchor);
      TrayNav.$page = Ornament.U.findData(TrayNav.selectors.page);
      TrayNav.$drilldown = TrayNav.$tray.find("[data-drilldown-init]");
      TrayNav.$html = $("html");
    },
    
    _getWindowOffset: function(){
      return $(window).scrollTop();
    },
    
    isOpen: function(){
      return TrayNav.$layout.hasClass(TrayNav.classes.layoutOpen);
    },
    
    isTransitioning: function(){
      return TrayNav.$layout.hasClass(TrayNav.classes.layoutTransition);
    },
    
    // =========================================================================
    // Accessorise
    // =========================================================================

    _accessTrayClosed: function(){
      TrayNav.$tray.attr({
        "tabIndex": -1,
        "aria-hidden": true
      });
      TrayNav.$page.attr({
        "tabIndex": 0,
        "aria-hidden": false
      });
      TrayNav.$anchor.attr({
        "tabIndex": 0,
        "aria-expanded": false,
        "aria-label": "Open Menu"
      });
    },

    _accessTrayOpen: function(){
      TrayNav.$tray.attr({
        "aria-hidden": false
      }).removeAttr("tabindex");
      TrayNav.$page.attr({
        "tabIndex": -1,
        "aria-hidden": true
      });
      TrayNav.$anchor.attr({
        "tabIndex": 2,
        "aria-expanded": true,
        "aria-label": "Close Menu"
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
        TrayNav.$layout.removeClass(TrayNav.classes.layoutTransition);
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
      TrayNav.$anchor.off("click").on("click", function(event) {
        event.preventDefault();
        TrayNav.toggle();
        return false;
      });
      // Remove waiting class from button 
      TrayNav.$anchor.closest("." + TrayNav.classes.anchorDisabled).removeClass(TrayNav.classes.anchorDisabled)
    },
    
    _bindOverlay: function(){
      TrayNav.$page.on("click", "*", function (event) {
        TrayNav.close();
        return false;
      });
    },
    
    _unbindOverlay: function(){
      TrayNav.$page.off("click", "*");
    },
    
    resizeDrilldowns: function(){
      if(Ornament.C.Drilldown) {
        TrayNav.$drilldown.each(function(){
          $(this).trigger(Ornament.C.Drilldown.triggerNamespace + ":resize");
        });
      }
    },

    // =========================================================================
    // Init
    // =========================================================================
    
    init: function(){
      TrayNav._getElements();
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

  Ornament.registerComponent("TrayNav", TrayNav);

}(document, window, Ornament, Ornament.Utilities));
