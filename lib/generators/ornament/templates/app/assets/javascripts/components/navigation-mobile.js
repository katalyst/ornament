/*jslint browser: true, indent: 2, todo: true, unparam: true */
/*global jQuery,Ornament */

(function (document, window, $) {

  "use strict";

  $(document).on("ornament:refresh", function () {

    // Global scope so we can call functions anywhere
    window.mobileNav = {

      // Classes
      layoutOpenClass:         "layout-open",
      layoutTransitionClass:   "layout-transitioning",
      paneClass:               "pane", // all lists are panes
      firstPaneClass:          "pane__first", // unique class for the first pane
      nonPaneClass:            "non-pane", // lists that aren't a separate pane (eg. multiple list might makeup one "pane")
      hasChildren:             "has-children", // links that have children
      cmsActiveClass:          "active", // active class given to items via the CMS
      menuSelectedClass:       "selected", // selected class given to items via the menu to determine depth and pane visibility
      mobileContentClass:      "navigation-mobile--content", // content that should appear on the first pane
      menuNavigationClass:     "pane--navigation-container", // class that contains our navigation list
      menuNavItemClass:        "menuNavItemClass", // list items that are navigation triggers for styling purposes
      menuReadyClass:          "ready", // ready class, only used so that scaffolding won't happen more than once

      // Selectors
      tray:                    $(".navigation-mobile"),
      anchor:                  $(".layout--switch"),
      contentElement:          $(".layout--content"),
      layoutElement:           $(".layout"),

      // Settings
      simple:                  false,
      animationDuration:       500,
      animationBuffer:         100,
      slideTransitionTime:     200,
      jumpToCurrent:           true,
      currentLevel:            1,

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
        return mobileNav.tray.find("."+ mobileNav.cmsActiveClass ).last();
      },

      // Scaffold the complex mobile menu
      scaffoldMobileMenu: function(){

        var $tray = mobileNav.tray;

        // Abort if already scaffolded
        if( $tray.hasClass(mobileNav.menuReadyClass) ) {
          return false;
        }

        // Add class to current tab
        var $currentTab = mobileNav.getCurrentTab();
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
        mobileNav.updateMobileMenuHeight();

        // Add ready class to prevent re-scaffolding
        $tray.addClass(mobileNav.menuReadyClass);

      },

      // Update mobile menu height based on content
      updateMobileMenuHeight: function(){

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
      updateMobileMenuHeightWithDelay: function() {
        setTimeout(function(){
          mobileNav.updateMobileMenuHeight();
        }, mobileNav.animationDuration + mobileNav.animationBuffer + 100);
      },

      // Go back one level
      goBack: function(){
        // don't do anything if it's animating already
        if(mobileNav.tray.is(":animated")) {
          return false;
        }
        // Remove selected class on the parent selected element
        // Do this after it has animated back to the previous pane via timeout
        setTimeout(function(){
          mobileNav.getCurrentTab().parent("." + mobileNav.menuSelectedClass).removeClass(mobileNav.menuSelectedClass);
        }, mobileNav.transitionTime);
        // Animate back to the previous pane
        mobileNav.currentLevel = mobileNav.currentLevel - 1;
        mobileNav.tray.attr("data-level", mobileNav.currentLevel);
      },

      // Go to a particular item in the menu
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
      }
    };

    // Call scaffold for the first time on page load
    if(!mobileNav.simple) {
      mobileNav.scaffoldMobileMenu();
    }

    // Binding clicks on anchor to toggle menu
    mobileNav.anchor.on("click", function(e) {
      e.preventDefault();
      mobileNav.toggleMenu();
      return false;
    });

  });

/*
  $(document).on("ornament:refresh", function () {

    $(".navigation-mobile").not(".navigation-mobile_init").each(function(){

      var $navigation, currentLevel, $nestedNodes, jumpToCurrent, transitionTime, updateHeights, $currentTab;

      $navigation = $(this);
      currentLevel = 1;
      $nestedNodes = $navigation.find("ul ul");
      jumpToCurrent = true;
      $currentTab = $navigation.find(".selected").last();
      transitionTime = 200; // needs to match css transition length

      $currentTab.parent("li").addClass("active");

      // div wrapper to help sizing
      $navigation.find("ul").not(".non-pane").wrap("<div class=pane />");

      // helper class for first pane if needed
      $navigation.find(".pane").first().addClass("pane_first");

      // content inclusions
      var $navContent = $navigation.find(".navigation-mobile--content");
      $navContent.each(function(){
        var $content, $navHTML;
        $content = $(this);
        $navHTML = $content.html();
        $navigation.find(".navigation-mobile--first").append($navHTML);
      });

      // adding classes to pre-existing nav elements so we can differentiate from them later
      $navigation.find(".pane--navigation-container").find("li").addClass("navigation-item");

      // update heights function to make sure scrolling works
      updateHeights = function(){

        setTimeout(function(){
          var windowHeight, tabHeight, navHeight;
          $currentTab = $navigation.find(".selected").last(); // reseting current tab
          windowHeight = $(window).height();
          // $navigation.css("height","auto");

          if(currentLevel == 1) {
            tabHeight = $(".pane_first").outerHeight();
          } else if ( $currentTab.is("a") ) {
            tabHeight = $currentTab.last().parent("li").parent("ul").outerHeight();
          } else {
            tabHeight = $currentTab.last().children("div").children("ul").outerHeight();
          }

          if(windowHeight > tabHeight) {
            navHeight = windowHeight;
          } else {
            navHeight = tabHeight;
          }

          $navigation.height(navHeight);
        }, (transitionTime + 100));
      };

      // update heights on page load
      updateHeights();

      // update heights again when menu slides open
      $(".layout--switch").on("click", function (e) {
        updateHeights();
      });

      // add back buttons to nested panes
      $nestedNodes.each(function(){
        var $nestedNode = $(this);
        var nodeTitle = $nestedNode.parent(".pane").prev().text();
        var nodeDescription = $nestedNode.parent(".pane").parent("li").attr("data-description");
        var $nodeLink = $nestedNode.parent(".pane").parent("li").children("a");
        // build description block
        var $descriptionBlock = $("<li class='description panel--padding_tight' />");
        $descriptionBlock.append("<div class='description--title'>"+nodeTitle+"</div>");
        // only add description if description is found
        if (nodeDescription) {
          $descriptionBlock.append("<div class='description--body'>"+nodeDescription+"</div>");
        }
        // only add overview link if there's a link to be overviewed
        // if ($nodeLink.attr("href") != "#") {
        if ( !$nodeLink.parent("li").parent("ul").parent("div").hasClass("pane--navigation-container")  ) {
          $descriptionBlock.append("<div class='description--overview'><a href='"+$nodeLink.attr("href")+"' class='icon_arrow_right'>View overview</a></div>");
        }
        $nestedNode.prepend($descriptionBlock);

        // add back button
        $nestedNode.prepend("<li class='back panel--padding_tight'><a href='#' class='button icon_arrow_left'>Back</a></li>");
      });

      // adding forward classes to required links
      $navigation.find("li").not(".description").each(function(){
        var $parentNode = $(this);
        if($parentNode.children("div").length>0){
          $parentNode.addClass("has-children");
        }
      });

      // making forward links work
      $navigation.find(".has-children").children("a").on("click", function(e){
        e.preventDefault();
        // abort if nav is animated
        if($navigation.is(":animated")){ return false; }
        // move to next level
        var $thisForward = $(this);
        $thisForward.parent("li").addClass("selected").siblings().removeClass("selected");
        currentLevel++;
        $navigation.attr("data-level",currentLevel);
        updateHeights();
      });

      // back button behaviour
      $(".back .button").on("click", function(e){
        e.preventDefault();
        var $thisBack = $(this);
        // abort if nav is animated
        if($navigation.is(":animated")){ return false; }
        // short delay on selected reset so that transition shows the appropriate nav items
        setTimeout(function(){
          $thisBack.parent(".back").parent("ul").parent("div").parent(".selected").removeClass("selected");
        },transitionTime);
        currentLevel--;
        $navigation.attr("data-level",currentLevel);
        updateHeights();
      });

      // jump to current page
      if(jumpToCurrent) {
        currentLevel = $currentTab.parents("ul").length; // get depth of current selected page
        // reset level to 1 if 0
        if(currentLevel == 0) { currentLevel = 1; }
        // apply current level
        $navigation.attr("data-level",currentLevel);
        $currentTab.parents("li").first().addClass("selected");
        updateHeights();
      }

    }).addClass("navigation-mobile_init");

  });
*/

}(document, window, jQuery));
