/*jslint browser: true, indent: 2, todo: true, unparam: true */
/*global jQuery,Ornament */

(function (document, window, $) {

  "use strict";

  $(document).on("ornament:refresh", function () {

    var TrayNav = Ornament.C.TrayNav = {

      // Classes
      layoutOpenClass:            "layout-open",
      layoutTransitionClass:      "layout-transitioning",
      paneClass:                  "pane", // all lists are panes
      firstPaneClass:             "pane__first", // unique class for the first pane
      nonPaneClass:               "non-pane", // lists that aren't a separate pane (eg. multiple list might makeup one "pane")
      hasChildren:                "has-children", // links that have children
      cmsActiveClass:             "selected", // active class given to items via the CMS
      menuSelectedClass:          "active", // selected class given to items via the menu to determine depth and pane visibility
      menuNavigationClass:        "pane--navigation-container", // class that contains our navigation list
      menuNavItemClass:           "navigation-item", // list items that are navigation triggers for styling purposes
      menuReadyClass:             "ready", // ready class, only used so that scaffolding won't happen more than once
      backContainerClass:         "back", // class used for back button containers
      backButtonClass:            "button__primary", // class used for back buttons
      descriptionClass:           "description",
      descriptionTitleClass:      "description--title",
      descriptionBodyClass:       "description--body",
      descriptionOverviewClass:   "description--overview",

      // Settings
      simple:                     true, // simple accordion style menu instead of moving panes
      animationDuration:          500, // opening the menu transition time
      animationBuffer:            100, // buffer for good measure
      slideTransitionTime:        200, // transition between pane sliding
      jumpToCurrent:              true, // jump to current page in the menu rather than starting at top-level
      showOverviewLinks:          false, // will show overview links on secodary panes
      keepScrollPosition:         false, // keep scroll position when opening tabs, dangerous if button isn't fixed
      closeForAnchors:            false, // close menu when clicking on anchors
      svgSupport:                 false, // use Ornament.icon svgs for modern sites 

      // Customisable text strings
      viewOverviewText:           "View Overview",
      backText:                   "Back",

      // Selectors
      tray:                       $(".navigation-mobile"),
      anchor:                     $("[data-mobile-menu-switch]"),
      contentElement:             $(".layout--content"),
      layoutElement:              $(".layout"),
      layoutPositioner:           $("[data-layout-positioner]"), // the element we move up and down to keep the user scroll position

      // Core Settings
      currentLevel: 1, // initial level
      timeout: null, // temporary variable for later, used for keeping track of timeouts
      scrollPosition: 0, // keeps track of the scroll position, used when keepScrollPosition:true
      closeTimeout: null, 

      startMenuTimeout: function(){
        TrayNav.timeout = setTimeout(function () {
          TrayNav.layoutElement.removeClass(TrayNav.layoutTransitionClass);
        }, TrayNav.animationDuration + TrayNav.animationBuffer);
      },

      clearMenuTimeout: function(){
        if (TrayNav.timeout !== undefined) {
          clearTimeout(TrayNav.timeout);
        }
      },

      // Return a true if the menu is open, false if closed
      isOpen: function() {
        return TrayNav.layoutElement.hasClass(TrayNav.layoutOpenClass);
      },

      // Return a true if the menu is transitioning 
      isTransitioning: function() {
        return TrayNav.layoutElement.hasClass(TrayNav.layoutTransitionClass);
      },

      // Destroy the tab indexes of all the links in the mobile menu
      // This is used to stop screen readers and tabbing 
      destroyTabIndexes: function() {
        if(TrayNav.simple) {
          return false;
        }
        TrayNav.tray.find(".pane").removeAttr("tabIndex");
        TrayNav.tray.find("a").attr("tabIndex", "-1");
      },

      // Create tabindexes for the current visible pane
      createTabIndexesForCurrentPane: function() {
        if(TrayNav.simple) {
          return false;
        }
        var currentPane = TrayNav.getCurrentPane();
        var tabIndex = 2;
        currentPane.attr("tabIndex", 1);
        currentPane.children("ul").children("li").children("a").each(function(){
          tabIndex++;
          $(this).attr("tabIndex", tabIndex);
        });
      },

      destroyTabIndexesAndCreateForCurrentPane: function() {
        if(TrayNav.simple) {
          return false;
        }
        TrayNav.destroyTabIndexes();
        TrayNav.createTabIndexesForCurrentPane();
      },

      // Close menu
      closeMenu: function(){
        TrayNav.layoutElement.removeClass(TrayNav.layoutOpenClass).addClass(TrayNav.layoutTransitionClass);
        TrayNav.contentElement.off("click", "*");
        TrayNav.clearMenuTimeout();
        TrayNav.startMenuTimeout();

        if(TrayNav.keepScrollPosition) {
          TrayNav.closeTimeout = setTimeout(function(){
            TrayNav.layoutPositioner.css({
              position: "static",
              top: 0
            });
            scrollTo(0,TrayNav.scrollPosition);
          }, TrayNav.animationDuration + TrayNav.animationBuffer);
        }
      },

      // Open menu
      openMenu: function(){
        if(!TrayNav.simple) {
          TrayNav.updateMenuHeight();
        }

        // get scroll position and update
        if(TrayNav.keepScrollPosition) {
          clearTimeout(TrayNav.closeTimeout);
          if(!TrayNav.isTransitioning()) {
            TrayNav.scrollPosition = $(window).scrollTop();
            TrayNav.layoutPositioner.css({
              position: "relative",
              top: TrayNav.scrollPosition * -1
            });
          }
        }

        // update classes on page
        TrayNav.layoutElement.addClass(TrayNav.layoutOpenClass + " " + TrayNav.layoutTransitionClass);

        // clicking on content wilgl close menu
        TrayNav.contentElement.on("click", "*", function (event) {
          TrayNav.toggleMenu();
          return false;
        });

        // start animation timings
        TrayNav.clearMenuTimeout();
        TrayNav.startMenuTimeout();
        TrayNav.updateMenuHeightWithDelay();

        // Focus on the first link
        setTimeout(function(){
          TrayNav.destroyTabIndexesAndCreateForCurrentPane();
          TrayNav.getCurrentPane().focus();
        }, TrayNav.slideTransitionTime);

      },

      // Toggle menu. Open if closed, close if open.
      toggleMenu: function(){
        if( TrayNav.isOpen() ) {
          TrayNav.closeMenu();
        } else {
          TrayNav.openMenu();
        }
      },

      // Return the last selected element
      getCurrentTab: function(){
        return TrayNav.tray.find("."+ TrayNav.menuSelectedClass ).last();
      },

      // Get active page from CMS
      getCMSActivePage: function(){
        return TrayNav.tray.find("."+ TrayNav.cmsActiveClass ).last();
      },

      getNestedMenus: function(){
        return TrayNav.tray.find("ul ul");
      },

      getCurrentPane: function(){
        if( TrayNav.currentLevel === 1 ) {
          return TrayNav.tray.find("." + TrayNav.menuNavigationClass)
        } else {
          return TrayNav.getCurrentTab().children(".pane");
        }
      },

      // Update mobile menu height based on content
      updateMenuHeight: function(){

        var windowHeight = Ornament.windowHeight();
        var $currentTab = TrayNav.getCurrentTab();
        var paneHeight = 0;
        var navHeight = 0;

        // Get the height of the required elements
        if( TrayNav.currentLevel == 1 ) {
          paneHeight = TrayNav.tray.find("." + TrayNav.menuNavigationClass).outerHeight();
        } else if ( $currentTab.is("a") ) {
          paneHeight = $currentTab.parent("li").parent("ul").outerHeight();
        } else {
          paneHeight = $currentTab.children("div").children("ul").outerHeight();
        }

        // Check which is larger, window or pane?
        if( windowHeight > paneHeight ) {
          navHeight = windowHeight;
        } else {
          navHeight = paneHeight;
        }

        // Apply the height, yo.
        TrayNav.tray.height(navHeight);

      },

      // Update heights on a delay (eg. when moving between panes)
      updateMenuHeightWithDelay: function() {
        setTimeout(function(){
          TrayNav.updateMenuHeight();
        }, TrayNav.slideTransitionTime);
      },

      // Go back one level
      goBack: function(){
        // don't do anything if it's animating already
        if(TrayNav.tray.is(":animated")) {
          return false;
        }
        // Animate back to the previous pane
        TrayNav.currentLevel = TrayNav.currentLevel - 1;
        TrayNav.tray.attr("data-level", TrayNav.currentLevel);
        setTimeout(function(){
          // Remove selected class on the parent selected element
          // Do this after it has animated back to the previous pane via timeout
          TrayNav.getCurrentTab().removeClass(TrayNav.menuSelectedClass);
          TrayNav.updateMenuHeight();
          TrayNav.destroyTabIndexesAndCreateForCurrentPane();
        }, TrayNav.slideTransitionTime);
      },

      // Go to a particular item in the menu by passing in a tab
      goTo: function($tab) {
        // get the depth of this tab and update level
        TrayNav.currentLevel = $tab.parents("ul").length;
        // reset level to 1 if zero
        if(TrayNav.currentLevel == 0) {
          TrayNav.currentLevel = 1;
        }
        // apply current level
        TrayNav.tray.attr("data-level", TrayNav.currentLevel);
        TrayNav.tray.find("."+TrayNav.menuSelectedClass).removeClass(TrayNav.menuSelectedClass);
        $tab.parents("li").first().addClass(TrayNav.menuSelectedClass);
        TrayNav.markParentAsActive($tab);
        // update heights
        TrayNav.updateMenuHeightWithDelay();
        setTimeout(function(){
          TrayNav.destroyTabIndexesAndCreateForCurrentPane();
        }, TrayNav.slideTransitionTime);
      },

      // Match an ID and navigate to it
      // You can pass in an ID pre-hashed or not
      // ie. goToId("key1") or goToId("#key1")
      goToId: function(key) {
        // Add in a hash if one wasn't passed
        if(key.substr(0,1) != "#") {
          key = "#" + key;
        }
        var $keyNode = $(key);
        // Only go to it if it exists
        if($keyNode.length) {
          // Check if the node is a link or a list
          if($keyNode.is("a")) {
            TrayNav.goTo($keyNode);
          } else {
            TrayNav.goTo($keyNode.children("a"));
          }
        }
      },

      // Mark all pages as inactive and then go to root
      goToRoot: function(){
        TrayNav.tray.find("."+TrayNav.menuSelectedClass).removeClass(TrayNav.menuSelectedClass);
        TrayNav.currentLevel = 1;
        TrayNav.tray.attr("data-level", TrayNav.currentLevel);
        TrayNav.destroyTabIndexesAndCreateForCurrentPane();
      },

      // Mark a parent node as active
      markParentAsActive: function($node) {
        var $parent = $node.parent("li").parent("ul").parent(".pane").parent("li");
        if($parent.length) {
          $parent.addClass(TrayNav.menuSelectedClass);
          // Keep going up the tree until you can't go no mo.
          TrayNav.markParentAsActive($parent.children("a"));
        }
      },

      updateMenuBindingForAnchor: function(){

        // Binding clicks on anchor to toggle menu
        TrayNav.anchor.on("click", function(e) {
          e.preventDefault();
          TrayNav.toggleMenu();
          return false;
        });

      },

      // Apply bindings to all back, forward and anchor buttons
      updateMenuBindings: function(){

        TrayNav.updateMenuBindingForAnchor();

        if(TrayNav.simple) {

          // Clicking on parent links toggles the ones below it
          var $parentLinks = TrayNav.tray.find("[data-mobilenav-accordion] > a");
          $parentLinks.off("click").on("click", function(e){
            e.preventDefault();
            $(this).parent("li").toggleClass("visible");
            TrayNav.updateMenuHeight();
          });

        } else {

          // Making forward buttons work
          TrayNav.tray.find("[data-mobilenav-forward]").children("a").off("click").on("click", function(e) {
            e.preventDefault();
            // abort if already animating
            if(TrayNav.tray.is(":animated")) {
              return false;
            }
            var $thisForward = $(this);
            $thisForward.parent("li").addClass(TrayNav.menuSelectedClass).siblings().removeClass(TrayNav.menuSelectedClass);
            TrayNav.currentLevel = TrayNav.currentLevel + 1;
            TrayNav.tray.attr("data-level", TrayNav.currentLevel);
            TrayNav.updateMenuHeightWithDelay();
            setTimeout(function(){
              TrayNav.destroyTabIndexesAndCreateForCurrentPane();
            }, TrayNav.slideTransitionTime);
          });

          // Making back buttons work
          TrayNav.tray.find("[data-mobilenav-back]").off("click").on("click", function(e){
            e.preventDefault();
            TrayNav.goBack();
          });

        }

        if(TrayNav.closeForAnchors) {

          // Make anchor links close the menu
          TrayNav.tray.on("click", "a[href*=#]:not([href=#])", function(e){

            var $anchor = $(e.originalEvent.target);
            var shouldOverride = true;

            // Don't override for forward links
            if( $anchor.parent("li").is("[data-mobilenav-forward]") ) {
              shouldOverride = false;
            }

            // Don't override for back buttons
            if( $anchor.is("[data-mobilenav-back]") ) {
              shouldOverride = false;
            }

            // Close menu when clicking on anchor links if not matched above
            if( shouldOverride ) {
              TrayNav.closeMenu();
            }

          });

        }

      },

      // Scaffold the complex mobile menu
      scaffoldMobileMenu: function(){

        var $tray = TrayNav.tray;

        // Abort if already scaffolded
        if( $tray.hasClass(TrayNav.menuReadyClass) ) {
          return false;
        }

        $tray.addClass("complex");

        // Add class to current tab
        var $currentTab = TrayNav.getCMSActivePage();
        $currentTab.parent("li").addClass(TrayNav.menuSelectedClass);

        // Wrap each list in a pane div to assist in animation and sizing
        $tray.find("ul").not("."+TrayNav.nonPaneClass).wrap("<div class='"+TrayNav.paneClass+"' />");

        // Add helper class to first pane
        var $firstPane = $tray.find("."+TrayNav.paneClass).first();
        $firstPane.addClass(TrayNav.firstPaneClass);

        // Adding classes to pre-existing nav elements for styling purposes
        $tray.find("."+TrayNav.menuNavigationClass).find("li").addClass(TrayNav.menuNavItemClass);

        // Jump to current pane if required
        if(TrayNav.jumpToCurrent) {
          TrayNav.goTo( TrayNav.getCurrentTab() );
        }

        // Update menu heights for first time
        TrayNav.updateMenuHeight();

        // Add forward buttons
        TrayNav.tray.find("li").not(TrayNav.menuDescriptionClass).each(function(){
          var $parentNode = $(this);
          if($parentNode.children("div").length > 0) {
            $parentNode.addClass(TrayNav.hasChildren).attr("data-mobilenav-forward","");
            if(TrayNav.svgSupport) {
              $parentNode.children("a").append(Ornament.icons.plus);
            }
          } else {
            if(TrayNav.svgSupport) {
              $parentNode.children("a").append(Ornament.icons.chevron);
            }
          }
        });

        // Add back button and description blocks
        TrayNav.getNestedMenus().each(function(){
          var $nestedNode = $(this);
          var $parentPane = $nestedNode.parent("."+TrayNav.paneClass);
          var nodeTitle = $parentPane.prev().text();
          var nodeDescription = $parentPane.parent("li").attr("data-description");
          var $nodeLink = $parentPane.parent("li").children("a");

          // build description block
          var $descriptionBlock = $("<li class='" + TrayNav.descriptionClass + "' />");
          $descriptionBlock.append("<div class='" + TrayNav.descriptionTitleClass + "'>" + nodeTitle + "</div>");

          // only add description if available
          if(nodeDescription) {
            $descriptionBlock.append("<div class='" + TrayNav.descriptionBodyClass + "'>" + nodeDescription + "</div>");
          }

          // only add overview link if there's a link to be overviewed
          if ( TrayNav.showOverviewLinks ) {
            $descriptionBlock.append("<div class='" + TrayNav.descriptionOverviewClass + "'><a href='"+$nodeLink.attr("href")+"' class='icon_arrow_right'>" + TrayNav.viewOverviewText + "</a></div>");
          }
          $nestedNode.prepend($descriptionBlock);

          // add the back button
          $nestedNode.prepend("<li class='" + TrayNav.backContainerClass + "'><a href='#' class='" + TrayNav.backButtonClass + "' data-mobilenav-back>" + (TrayNav.svgSupport ? Ornament.icons.chevron : false) + TrayNav.backText + "</a></li>");
        });

        // Run bindings
        TrayNav.updateMenuBindings();

        // Add ready class to prevent re-scaffolding
        $tray.addClass(TrayNav.menuReadyClass);

      },

      // Scaffolind the simple version of the menu
      scaffoldSimpleMenu: function(){

        // Abort if already ready
        if(TrayNav.tray.hasClass(TrayNav.menuReadyClass)) {
          return false;
        }

        // Add simple class for styling purposes
        TrayNav.tray.addClass("simple");

        // Add data attributes to parent links
        var $parentLinks = TrayNav.tray.find("ul ul").parent("li");
        $parentLinks.attr("data-mobilenav-accordion","");

        // Update key bindings
        TrayNav.updateMenuBindings();

        // Add ready class
        TrayNav.tray.addClass(TrayNav.menuReadyClass);

      }
    };

    // Create menu on page load
    if(TrayNav.simple) {

      TrayNav.scaffoldSimpleMenu();

    } else {

      // Scaffold the complex menu and apply bindings
      TrayNav.scaffoldMobileMenu();

      // Update heights on resize
      $(window).on("resize", function(){
        TrayNav.updateMenuHeightWithDelay();
      });

    }

  });

}(document, window, jQuery));