/*jslint browser: true, indent: 2, todo: true, unparam: true */
/*global jQuery,Ornament /*/

(function (document, window, $) {

  "use strict";

  /*
    TODO:
    * Regular sticky
    * Second sticky that stacks
    * Header with slide in logo
    * Account for a radically different mobile header
    * Over-ride anchors to account for stickies
    * Sticky sidebar
    * Support for position: sticky if available
  */

  $(document).on("ornament:refresh", function () {

    var $stickies = $("[data-sticky]");
    var stickyClass = "sticky";

    // Seed our offset data and apply as attributes
    // for later
    var seedStickyData = function($sticky, $placeholder){

      if($sticky.hasClass(stickyClass)) {
        var $stickyElement = $placeholder;
      } else {
        var $stickyElement = $sticky;
      }

      // Get the offset of the element
      var stickyOffset = $stickyElement.offset().top;

      // Update the offset to account for other stickies
      var stickyOffsetComparison = stickyOffset - $stickyElement.outerHeight();
      var stickyOffset = stickyOffset - Ornament.getStickyHeights(stickyOffsetComparison);

      $sticky.attr("data-sticky-offset", stickyOffset);
    }

    // Make our sticky sticky
    var makeSticky = function($sticky, $placeholder) {
      var heightOfSticky = $sticky.outerHeight();
      $placeholder.height(heightOfSticky).show();
      $sticky.addClass(stickyClass);
      $sticky.css({
        top: Ornament.getStickyHeights($sticky.attr("data-sticky-offset"))
      });
    }

    // Make our sticky no longer sticky
    var makeNotSticky = function($sticky, $placeholder) {
      $placeholder.hide();
      $sticky.removeClass(stickyClass);
    }

    var checkStickyStatus = function($sticky, $placeholder) {
      var scrollPosition = $(document).scrollTop();
      var stickyTop = $sticky.attr("data-sticky-offset");
      $sticky.show();
      seedStickyData($sticky, $placeholder);

      if(scrollPosition >= stickyTop) {
        if(!$sticky.hasClass(stickyClass)) {
          makeSticky($sticky, $placeholder);
        }
      } else {
        if($sticky.hasClass(stickyClass)) {
          makeNotSticky($sticky, $placeholder);
        }
      }
    }

    // Loop over our stickies
    $stickies.each(function(){
      var $sticky = $(this);

      // Initialise
      var $placeholder = $("<div data-sticky-placeholder />");
      $sticky.before($placeholder);
      $sticky.wrapInner("<div data-sticky-inner />");

      // Seed the positions required and apply stickiness
      // on page load
      setTimeout(function(){
        seedStickyData($sticky, $placeholder);
        checkStickyStatus($sticky, $placeholder);
      }, 200);

      // On page scroll, check if we need to sticky
      $(window).on("scroll", function(){
        checkStickyStatus($sticky, $placeholder);
      });

      // On resize, check position and apply sticky
      $(window).on("resize", function(){
        checkStickyStatus($sticky, $placeholder);
      });

    });

/*
    var $header = $(".header__primary");
    var $headerNavigation = $(".navigation-primary");
    var $headerNavigationPlaceholder = $(".navigation-primary-placeholder");
    var $headerNavigationNav = $headerNavigation.find("nav");
    var $headerNavigationLogo = $(".navigation-primary__logo");
    var headerNavigationClass = "sticky";
    var headerBreakpoint = Ornament.headerBreakpoint;
    var $pageContainer = $(".layout--content");

    var showNavigationLogo = function(){
      var logoWidth = Ornament.measure($headerNavigationLogo, "width");
      $headerNavigationLogo.stop().fadeIn();
      $headerNavigationNav.stop().animate({
        paddingLeft: logoWidth
      }, 200);
    }

    var hideNavigationLogo = function(timing){
      timing = timing || 200;
      $headerNavigationLogo.stop().fadeOut(timing);
      $headerNavigationNav.stop().animate({
        paddingLeft: 0
      }, timing);
    }

    var makeNavigationSticky = function(){
      var heightOfNavigation = $headerNavigation.outerHeight();
      $headerNavigationPlaceholder.height(heightOfNavigation).show();
      $header.addClass(headerNavigationClass);
      showNavigationLogo();
    }

    var makeNavigationNotSticky = function(){
      $headerNavigationPlaceholder.hide();
      $header.removeClass(headerNavigationClass);
      hideNavigationLogo();
    }

    var makeNavigationNotStickyForMobile = function(){
      $headerNavigationPlaceholder.hide();
      $header.removeClass(headerNavigationClass);
      hideNavigationLogo(0);

      var heightOfMobilePlaceholder = $(".header__primary").outerHeight();
      $pageContainer.css({
        "padding-top": heightOfMobilePlaceholder
      });
    }

    var checkStickyStatus = function(){
      if( Ornament.windowWidth() <= headerBreakpoint ) {
        makeNavigationNotStickyForMobile();
      } else {
        $pageContainer.css({
          "padding-top": 0
        });
        var scrollPosition = $(document).scrollTop();
        var navigationTop = $headerNavigation.attr("data-offset-top");
        $headerNavigation.show();
        seedNavigationPositions();

        if(scrollPosition >= navigationTop) {
          if(!$header.hasClass(headerNavigationClass)) {
            makeNavigationSticky();
          }
        } else {
          if($header.hasClass(headerNavigationClass)) {
            makeNavigationNotSticky();
          }
        }
      }
    }

    var seedNavigationPositions = function(){
      if($header.hasClass(headerNavigationClass)) {
        var navigationOffsetTop = $headerNavigationPlaceholder.offset().top;
      } else {
        var navigationOffsetTop = $headerNavigation.offset().top;
      }
      $headerNavigation.attr("data-offset-top", navigationOffsetTop);
    }

    // Seed the positions required and apply stickiness
    // on page load
    setTimeout(function(){
      seedNavigationPositions();
      checkStickyStatus();
    }, 200);

    // On page scroll, check if we need to sticky
    $(window).on("scroll", function(){
      checkStickyStatus();
    });

    // On resize, check position and apply sticky
    $(window).on("resize", function(){
      checkStickyStatus();
    });
*/

  });

}(document, window, jQuery));