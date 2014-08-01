/*jslint browser: true, indent: 2, todo: true, unparam: true */
/*global jQuery,Ornament */

(function (document, window, $) {

  "use strict";

  $(document).on("ornament:refresh", function () {

    // Global scope so we can call functions anywhere
    window.mobileNav = {

      // Classes
      layoutOpenClass:            "layout-open",
      layoutTransitionClass:      "layout-transitioning",
      paneClass:                  "pane", // all lists are panes
      firstPaneClass:             "pane__first", // unique class for the first pane
      nonPaneClass:               "non-pane", // lists that aren't a separate pane (eg. multiple list might makeup one "pane")
      hasChildren:                "has-children", // links that have children
      cmsActiveClass:             "selected", // active class given to items via the CMS
      menuSelectedClass:          "active", // selected class given to items via the menu to determine depth and pane visibility
      mobileContentClass:         "navigation-mobile--content", // content that should appear on the first pane
      menuNavigationClass:        "pane--navigation-container", // class that contains our navigation list
      menuNavItemClass:           "navigation-item", // list items that are navigation triggers for styling purposes
      menuReadyClass:             "ready", // ready class, only used so that scaffolding won't happen more than once
      backContainerClass:         "back", // class used for back button containers
      backButtonClass:            "button", // class used for back buttons
      descriptionClass:           "description",
      descriptionTitleClass:      "description--title",
      descriptionBodyClass:       "description--body",
      descriptionOverviewClass:   "description--overview",

      // Settings
      simple:                     false, // simple accordion style menu instead of moving panes
      animationDuration:          500, // opening the menu transition time
      animationBuffer:            100, // buffer for good measure
      slideTransitionTime:        200, // transition between pane sliding
      jumpToCurrent:              true, // jump to current page in the menu rather than starting at top-level

      // Customisable text strings
      viewOverviewText:           "View Overview",
      backText:                   "Back",

      // Selectors
      tray:                       $(".navigation-mobile"),
      anchor:                     $(".layout--switch"),
      contentElement:             $(".layout--content"),
      layoutElement:              $(".layout"),

      // Core Settings
      currentLevel:               1,

      // Timing functions
      timeout: null,

      startMenuTimeout: function(){
        mobileNav.timeout = setTimeout(function () {
          mobileNav.layoutElement.removeClass(mobileNav.layoutTransitionClass);
        }, mobileNav.animationDuration + mobileNav.animationBuffer);
      },

      clearMenuTimeout: function(){
        if (mobileNav.timeout !== undefined) {
          clearTimeout(mobileNav.timeout);
        }
      },

      // Return a true if the menu is open, false if closed
      isOpen: function() {
        if (mobileNav.layoutElement.hasClass(mobileNav.layoutOpenClass)) {
          return true;
        } else {
          return false;
        }
      },

      // Close menu
      closeMenu: function(){
        mobileNav.layoutElement.removeClass(mobileNav.layoutOpenClass).addClass(mobileNav.layoutTransitionClass);
        mobileNav.contentElement.off("click", "*");
        mobileNav.clearMenuTimeout();
        mobileNav.startMenuTimeout();
      },

      // Open menu
      openMenu: function(){
        mobileNav.updateMenuHeight();
        mobileNav.layoutElement.addClass(mobileNav.layoutOpenClass + " " + mobileNav.layoutTransitionClass);
        mobileNav.contentElement.on("click", "*", function (event) {
          mobileNav.toggleMenu();
          return false;
        });
        mobileNav.clearMenuTimeout();
        mobileNav.startMenuTimeout();
      },

      // Toggle menu. Open if closed, close if open.
      toggleMenu: function(){
        if( mobileNav.isOpen() ) {
          mobileNav.closeMenu();
        } else {
          mobileNav.openMenu();
        }
      },

      // Return the last selected element
      getCurrentTab: function(){
        return mobileNav.tray.find("."+ mobileNav.menuSelectedClass ).last();
      },

      // Get active page from CMS
      getCMSActivePage: function(){
        return mobileNav.tray.find("."+ mobileNav.cmsActiveClass ).last();
      },

      getNestedMenus: function(){
        return mobileNav.tray.find("ul ul");
      },

      // Update mobile menu height based on content
      updateMenuHeight: function(){

        var windowHeight = Ornament.windowHeight();
        var $currentTab = mobileNav.getCurrentTab();
        var paneHeight = 0;
        var navHeight = 0;

        // Get the height of the required elements
        if( mobileNav.currentLevel == 1 ) {
          paneHeight = mobileNav.tray.find("." + mobileNav.firstPaneClass).outerHeight();
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
        mobileNav.tray.height(navHeight);

      },

      // Update heights on a delay (eg. when moving between panes)
      updateMenuHeightWithDelay: function() {
        setTimeout(function(){
          mobileNav.updateMenuHeight();
        }, mobileNav.slideTransitionTime);
      },

      // Go back one level
      goBack: function(){
        // don't do anything if it's animating already
        if(mobileNav.tray.is(":animated")) {
          return false;
        }
        // Animate back to the previous pane
        mobileNav.currentLevel = mobileNav.currentLevel - 1;
        mobileNav.tray.attr("data-level", mobileNav.currentLevel);
        setTimeout(function(){
          // Remove selected class on the parent selected element
          // Do this after it has animated back to the previous pane via timeout
          mobileNav.getCurrentTab().removeClass(mobileNav.menuSelectedClass);
          mobileNav.updateMenuHeight();
        }, mobileNav.slideTransitionTime);
      },

      // Go to a particular item in the menu by passing in a tab
      goTo: function($tab) {
        // get the depth of this tab and update level
        mobileNav.currentLevel = $tab.parents("ul").length;
        // reset level to 1 if zero
        if(mobileNav.currentLevel == 0) {
          mobileNav.currentLevel = 1;
        }
        // apply current level
        mobileNav.tray.attr("data-level", mobileNav.currentLevel);
        $tab.parents("li").first().addClass(mobileNav.menuSelectedClass);
        // update heights
        mobileNav.updateMenuHeightWithDelay();
      },

      updateMenuBindings: function(){

        // Binding clicks on anchor to toggle menu
        mobileNav.anchor.on("click", function(e) {
          e.preventDefault();
          mobileNav.toggleMenu();
          return false;
        });

        // Making forward buttons work
        mobileNav.tray.find("[data-mobilenav-forward]").children("a").off("click").on("click", function(e) {
          e.preventDefault();
          // abort if already animating
          if(mobileNav.tray.is(":animated")) {
            return false;
          }
          var $thisForward = $(this);
          $thisForward.parent("li").addClass(mobileNav.menuSelectedClass).siblings().removeClass(mobileNav.menuSelectedClass);
          mobileNav.currentLevel = mobileNav.currentLevel + 1;
          mobileNav.tray.attr("data-level", mobileNav.currentLevel);
          mobileNav.updateMenuHeightWithDelay();
        });

        // Making back buttons work
        mobileNav.tray.find("[data-mobilenav-back]").off("click").on("click", function(e){
          e.preventDefault();
          mobileNav.goBack();
        });

      },

      // Scaffold the complex mobile menu
      scaffoldMobileMenu: function(){

        var $tray = mobileNav.tray;

        // Abort if already scaffolded
        if( $tray.hasClass(mobileNav.menuReadyClass) ) {
          return false;
        }

        // Add class to current tab
        var $currentTab = mobileNav.getCMSActivePage();
        $currentTab.parent("li").addClass(mobileNav.menuSelectedClass);

        // Wrap each list in a pane div to assist in animation and sizing
        $tray.find("ul").not("."+mobileNav.nonPaneClass).wrap("<div class='"+mobileNav.paneClass+"' />");

        // Add helper class to first pane
        var $firstPane = $tray.find("."+mobileNav.paneClass).first();
        $firstPane.addClass(mobileNav.firstPaneClass);

        // Add additional content to first pane if required
        var $navContent = $tray.find("." + mobileNav.mobileContentClass);
        $navContent.each(function(){
          navHTML = $(this).html();
          $navigation.find("."+mobileNav.firstPaneClass).append($navHTML);
        });

        // Adding classes to pre-existing nav elements for styling purposes
        $tray.find("."+mobileNav.menuNavigationClass).find("li").addClass(mobileNav.menuNavItemClass);

        // Jump to current pane if required
        if(mobileNav.jumpToCurrent) {
          mobileNav.goTo( mobileNav.getCurrentTab() );
        }

        // Update menu heights for first time
        mobileNav.updateMenuHeight();

        // Add forward buttons
        mobileNav.tray.find("li").not(mobileNav.menuDescriptionClass).each(function(){
          var $parentNode = $(this);
          if($parentNode.children("div").length > 0) {
            $parentNode.addClass(mobileNav.hasChildren).attr("data-mobilenav-forward","");
          }
        });

        // Add back button and description blocks
        mobileNav.getNestedMenus().each(function(){
          var $nestedNode = $(this);
          var $parentPane = $nestedNode.parent("."+mobileNav.paneClass);
          var nodeTitle = $parentPane.prev().text();
          var nodeDescription = $parentPane.parent("li").attr("data-description");
          var $nodeLink = $parentPane.parent("li").children("a");

          // build description block
          var $descriptionBlock = $("<li class='" + mobileNav.descriptionClass + "' />");
          $descriptionBlock.append("<div class='" + mobileNav.descriptionTitleClass + "'>" + nodeTitle + "</div>");

          // only add description if available
          if(nodeDescription) {
            $descriptionBlock.append("<div class='" + mobileNav.descriptionBodyClass + "'>" + nodeDescription + "</div>");
          }

          // only add overview link if there's a link to be overviewed
          if ( !$nodeLink.parent("li").parent("ul").parent("div").hasClass("pane--navigation-container")  ) {
            $descriptionBlock.append("<div class='" + mobileNav.descriptionOverviewClass + "'><a href='"+$nodeLink.attr("href")+"' class='icon_arrow_right'>" + mobileNav.viewOverviewText + "</a></div>");
          }
          $nestedNode.prepend($descriptionBlock);

          // add the back button
          $nestedNode.prepend("<li class='" + mobileNav.backContainerClass + "'><a href='#' class='" + mobileNav.backButtonClass + "' data-mobilenav-back>" + mobileNav.backText + "</a></li>");
        });

        // Run bindings
        mobileNav.updateMenuBindings();

        // Add ready class to prevent re-scaffolding
        $tray.addClass(mobileNav.menuReadyClass);

      }
    };

    // Call scaffold for the first time on page load
    if(!mobileNav.simple) {
      mobileNav.scaffoldMobileMenu();
    }

    // Update heights on resize
    $(window).on("resize", function(){
      mobileNav.updateMenuHeightWithDelay();
    });

  });

}(document, window, jQuery));
