/*jslint browser: true, indent: 2, todo: true, unparam: true */
/*global jQuery,Ornament */

(function (document, window, $) {

  "use strict";

  $(document).on("ornament:refresh", function () {

    // Global settings
    var activeDeeplinking   = false;
    var tabOverScroll       = 130;
    var activeClass         = "tabs--pane__active";
    var tabActiveClass      = "tabs--link__active";
    var tabLinksClass       = ".tabs--link";
    var leftShadowClass     = "shadow-left";
    var rightShadowClass    = "shadow-right";

    // Things we need
    var $tabs               = $(".tabs");
    var currentHash         = document.location.hash;

    var scrollToTab = function($tabset, $anchor) {

      // get current active tab
      var anchorTabLeft = $anchor.offset().left - $tabset.offset().left;
      var anchorTabRight = anchorTabLeft - getWidthOfVisibleTabRow($tabset) + $anchor.outerWidth();

      // update tab list
      var $tabList = $tabset.find(".tabs--links ul");
      $tabList.attr({
        "data-tab-offset": "-"+anchorTabRight
      }).css({
        "margin-left": "-"+anchorTabRight+"px"
      });


    }

    var loadTab = function($tabset, pane){
      var $anchor  = $tabset.find("[data-tab='"+pane+"']");
      var $anchors = $tabset.find("[data-tab]");
      var $pane    = $tabset.find("[data-tab-for='"+pane+"']");
      var $panes   = $tabset.find(".tabs--pane");

      // remove nested panes and anchors
      $anchors = $anchors.not($tabset.find(".tabs [data-tab]"));
      $panes = $panes.not($tabset.find(".tabs .tabs--pane"));

      $panes.removeClass(activeClass);
      $pane.addClass(activeClass);
      $anchors.removeClass(tabActiveClass);
      $anchor.addClass(tabActiveClass);

      if($tabset.is("[data-tabs-swipable]")) {
        // scrollToTab($tabset, $anchor);
      }

      $(document).trigger("ornament:tab-change");
    }

    // Get the physical, visible with of tabset
    var getWidthOfVisibleTabRow = function($tabset) {
      return $tabset[0].getBoundingClientRect().width;
    }

    // Get the width of all the tabs in the (eg. swipable) tab row
    var getWidthOfTabRow = function($tabset, force) {

      // force recalculation
      var force = force || false;

      // check if an existing value has already been calculated and use that instead
      if( $tabset.data("row-width") && !force ) {
        return $tabset.data("row-width");
      }

      var $links = $tabset.find(".tabs--links li");
      var widthOfTabs = 0;

      $links.each(function(){
        // widthOfTabs = widthOfTabs + $(this).outerWidth();
        widthOfTabs = widthOfTabs + $(this)[0].getBoundingClientRect().width;
      });

      // store width for later so we don't need to keep recalcing
      $tabset.data("row-width", widthOfTabs);

      return widthOfTabs;
    }

    var areTabsGoingToWrap = function($tabset) {
      var tabWidth = getWidthOfTabRow($tabset);
      var tabPanesWidth = getWidthOfVisibleTabRow($tabset) - 10; // some buffer for good measure
      var $tabLinks = $tabset.find(".tabs--links");

      if( !$tabLinks.is("[data-tab-width]") ) {
        $tabLinks.attr("data-tab-width", tabWidth);
      }

      return $tabLinks.attr("data-tab-width") > tabPanesWidth;
    }

    // Dehash our hash (#tab = tab)
    var deHash = function(hash) {
      return hash.substr(1,hash.length);
    }

    // Get active pane from a tabset
    var getActivePane = function($tabset) {
      return $tabset.find(".tabs--links ."+tabActiveClass).attr("data-tab");
    }

    // Push to hash if deeplinking is turned on
    var pushHashToLocation = function($tabset, pane){
      if( activeDeeplinking || $tabset.is("[data-tabs-deeplink]") ) {
        document.location.hash = pane;
      }
    }

    // Push the current pane to the select menu
    // Used for two-way binding of select and desktop tabs
    var updateSelect = function($tabset) {

      var $fallbackSelect = $tabset.find(".tabs--fallback-select");
      if($fallbackSelect.length) {
        var activePane = getActivePane($tabset);
        $fallbackSelect.val(activePane);
      }

    }

    // Check if a select menu should be visible or not as a fallback for tabs
    // on smaller screen sizes
    var checkIfTabsNeedSelectMenu = function($tabset) {
      var $tabLinks = $tabset.find(".tabs--links");

      // check if there's already a select menu ready to be used
      var $fallbackSelect = $tabset.find(".tabs--fallback-select");

      // scaffold up a new select menu
      if( $fallbackSelect.length < 1 ) {
        $fallbackSelect = $("<select class='tabs--fallback-select' />");
        // build the options
        $tabLinks.find("li").each(function(){
          var $thisLink = $(this).children("[data-tab]");
          var tabID = $thisLink.attr("data-tab");
          var tabLabel = $thisLink.text();
          var $optionElement = $("<option />");
          $optionElement.attr({
            "data-tab-option": tabID,
            "value": tabID
          }).text(tabLabel);
          $optionElement.appendTo($fallbackSelect);
        });
        $tabset.find(".tabs--links").before($fallbackSelect);
        // on change functionality to update tabs
        $fallbackSelect.on("change", function(){
          var pane = $fallbackSelect.val();
          loadTab($tabset, pane);
          pushHashToLocation($tabset, pane);
        });
        // update selected option if required
        updateSelect($tabset);
      }

      // show the select menu if the tabs need to wrap
      if(areTabsGoingToWrap($tabset)) {
        $tabLinks.hide();
        $fallbackSelect.show();
      } else {
        $tabLinks.show();
        $fallbackSelect.hide();
      }
    }

    var resetTabScrollPosition = function($tabset) {
      var tabWidth = getWidthOfTabRow($tabset);
      var tabBarWidth = getWidthOfVisibleTabRow($tabset);
      if(tabBarWidth > tabWidth) {
        $tabset.find("tabs--links ul").attr("data-tab-offset", 0).velocity({
          marginLeft: 0
        }, 200);
        checkSwipeStatus($tabset);
      }
    }

    // Check if a tabset should be swiping or should be regular desktop behaviour
    var checkSwipeStatus = function($tabset, offset) {

      var tabWidth = getWidthOfTabRow($tabset);

      // check bounds
      var leftBound = 0;
      var rightBound = tabWidth - getWidthOfVisibleTabRow($tabset);
      var offset = offset || parseInt($tabset.find(".tabs--links ul").css("margin-left")) || 0;

      // overscroll maximums
      var leftOverscrollMax = tabOverScroll;
      var rightOverscrollMax = -(rightBound + tabOverScroll);

      if (offset >= leftBound) {
        // slow down
        offset = offset / 3;
        // overscroll to the max allowed point
        if(offset > leftOverscrollMax) {
          offset = leftOverscrollMax;
        }
        // remove left shadow class
        $tabset.removeClass(leftShadowClass);
        // add right shadow class if needed
        if(offset > -rightBound) {
          $tabset.addClass(rightShadowClass);
        } else {
          $tabset.removeClass(rightShadowClass);
        }
      } else if (offset <= -rightBound) {
        // slow down
        offset = -rightBound + ((offset - -rightBound) / 3);
        // overscroll to max allowed point
        if(offset < rightOverscrollMax) {
          offset = rightOverscrollMax;
        }
        // change classes
        $tabset.removeClass(rightShadowClass);
        if(offset < leftBound) {
          $tabset.addClass(leftShadowClass);
        } else {
          $tabset.removeClass(leftShadowClass);
        }
      } else {
        // add shadow classes
        $tabset.addClass(leftShadowClass + " " + rightShadowClass);
      }

      return offset;

    }

    // Build up some additional required markup for swiping behaviours
    var scaffoldSwipeTabs = function($tabset){
      var $tabLinksContainer = $tabset.find(".tabs--links");
      var $tabList = $tabLinksContainer.children("ul");

      // Get the height of a tab for later, set the width of the tab row to fit all tabs
      var tabHeight = $tabLinksContainer.find("li").first().outerHeight();
      var tabWidth = getWidthOfTabRow($tabset);
      $tabList.width( tabWidth );

      var $currentActiveTab = $tabList.find("."+tabActiveClass);
      scrollToTab($tabset, $currentActiveTab);

      // check if shadows are needed
      checkSwipeStatus($tabset);

      var $swipeTargets = $tabset.find(".tabs--links");
      $swipeTargets.swipe({
        excludedElements: "button, input, select, textarea, .noSwipe",
        triggerOnTouchLeave: true,
        threshold: 20,
        tap: function(event, target){
          if(!$(target).is(".tabs--link")) {
            return false;
          }

          // Binding the tab changing to tap
          // Click was selecting the tabs when you finish a swipe
          var $anchor = $(target);
          var pane    = $anchor.attr("data-tab");
          var $tabset = $anchor.closest(".tabs");

          debounce(function(){
            loadTab($tabset, pane);
            pushHashToLocation($tabset, pane);
            updateSelect($tabset);
          }, 40)();
        },
        swipeStatus: function(event, phase, direction, distance, duration, fingers){
          var $movableElement = $tabList;
          var cssLeft = "margin-left";
          var noScroll = tabWidth < getWidthOfVisibleTabRow($tabset);

          // stopping users from moving the tabs when they are snapping back
          if($movableElement.is(":animated")) {
            return false;
          }

          // get current offset
          var currentOffset = parseInt($movableElement.attr("data-tab-offset"));
          var newOffset = currentOffset;

          // move tab row based on distance swiped
          if(direction == "left") {
            newOffset = currentOffset - distance;
          } else if (direction == "right") {
            newOffset = currentOffset + distance;
          }

          // check swipe status
          // adds shadow classes, checks for overscroll requirements etc.
          newOffset = checkSwipeStatus($tabset, newOffset);

          // Tab row is shorter than tab width so we don't need to scroll
          if(noScroll) {
            newOffset = 0;
          }

          // move offset
          $movableElement.velocity("stop").css({
            marginLeft: newOffset + "px"
          });

          if ( (phase == "end" && !noScroll) || (phase == "cancel" && !noScroll) ) {
            // update tab offset on element
            // this was calling three times after swiping, so I've debounced it
            // to stop it from jumping all over the place
            debounce(function(){

              var tabWidth = getWidthOfTabRow($tabset);
              var leftBound = 0;
              // var rightBound = tabWidth - $tabset.outerWidth();
              // var rightBound = tabWidth - $tabset[0].getBoundingClientRect().width;
              var rightBound = tabWidth - getWidthOfVisibleTabRow($tabset);

              // check bounds and animate back
              if(newOffset > leftBound) {
                $movableElement.velocity({
                  marginLeft: leftBound
                }, 200);
                newOffset = leftBound;
              } else if(newOffset < -rightBound) {
                $movableElement.velocity({
                  marginLeft: -rightBound
                }, 200);
                newOffset = -rightBound;
              }

              // update data attr so we can pick up the swipe from the new offset
              $movableElement.attr("data-tab-offset", newOffset);

            }, 40)();
          }

        }
      });
    }

    // Load a tab from a hash OR load the first tab
    $tabs.each(function(){
      var $tabset = $(this);
      $tabset.find("[data-tab-for]").addClass("tabs--pane__init");

      // Only load if there is a hash, and there is a tab that exists that matches
      if(currentHash && $tabset.find(".tabs--pane[data-tab-for='" + deHash(currentHash) + "']").not($tabset.find(".tabs .tabs--pane[data-tab-for='" + deHash(currentHash) + "']")).length) {
        loadTab($tabset, deHash(currentHash));
      } else {
        // load first tab
        var pane = $tabset.find("[data-tab]").first().attr("data-tab");
        loadTab($tabset, pane);
      }
    });

    // Clicking tab links
    $(document).on("click", tabLinksClass, function (e) {

      e.preventDefault();

      var $anchor = $(this);
      var pane    = $anchor.attr("data-tab");
      var $tabset = $anchor.closest(".tabs");

      // don't do anything for swipable tabs
      // we'll be re-creating the binding for tab switching
      // using "tap" in the swipe code
      if($tabset.is("[data-tabs-swipable]")) {
        return false;
      }

      loadTab($tabset, pane);
      pushHashToLocation($tabset, pane);
      updateSelect($tabset);

    });

    // Clicking on external tab links
    $(document).on("click", "[data-tab-link]", function (e) {

      e.preventDefault();

      var $anchor = $(this);
      var pane    = $anchor.attr("data-tab-link");
      var $pane   = $("[data-tab-for='"+pane+"']");
      var $tabset = $pane.closest(".tabs");

      loadTab($tabset, pane);
      pushHashToLocation($tabset, pane);
      updateSelect($tabset);

    });

    // Initialise select fallback for tabs that need them on page load
    $("[data-tabs-fallback-select]").each(function(){
      checkIfTabsNeedSelectMenu($(this));
    });

    // Initialise swiping for tabs that need them
    $("[data-tabs-swipable]").each(function(){
      scaffoldSwipeTabs($(this));
    });

    // On resize
    $(window).on("resize", function(){

      $(".tabs").each(function(){
        var $tabset = $(this);

        // Check if a select menu is needed
        if( $tabset.is("[data-tabs-fallback-select]") ) {
          checkIfTabsNeedSelectMenu($tabset);
        }

        if( $tabset.is("[data-tabs-swipable]") ) {
          // Check if all tabs can fit and adjust accoridngly
          resetTabScrollPosition($(this));
          // Check if swiping shadows need to pop in or go away
          checkSwipeStatus($(this));
        }

      });

    });

  });

}(document, window, jQuery));
