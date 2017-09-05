/* =====================================================================

Drilldown Component

Attach to either a div or a unordered list with data-drilldown

===================================================================== */

"use strict";

(function (document, window, Ornament, Utils) {

  var Drilldown = {
    
    /* =====================================================================
    Settings
    ===================================================================== */
    
    selectors: {
      drilldowns: "data-drilldown",
      splitLinks: "data-drilldown-split",
      titles: "data-drilldown-titles",
      overviews: "data-drilldown-overviews",
      description: "data-description",
      selectedListItem: ".simple-navigation-active-leaf a.selected",
      customForward: "data-drilldown-forward",
      customBack: "data-drilldown-back",
      merge: "data-drilldown-merge"
    },
    
    lang: {
      backButtonLabel: "Back",
      overviewLabel: "Overview"
    },
    
    classes: {
      container: "drilldown",
      transitioning: "drilldown__transitioning",
      list: "drilldown--list",
      pastList: "drilldown--list__past",
      futureList: "drilldown--list__future",
      currentList: "drilldown--list__current",
      instantList: "drilldown--list__move-all",
      backButton: "drilldown--back-button",
      backListItem: "drilldown--back",
      parentListItem: "drilldown--item__parent",
      listItem: "drilldown--item",
      descriptionItem: "drilldown--description compressed",
      descriptionTitle: "drilldown--description--title",
      descriptionOverview: "drilldown--description--overview",
      overviewItem: "drilldown--overview",
      splitListItem: "drilldown--item__split",
      splitForwardLink: "drilldown--split-forward"
    },

    icons: {
      forward: "arrowright",
      back: "arrowleft"
    },
    
    // Seed transition delays through each list item so that you can 
    // stagger animate the list items 
    seedTransitionDelays: true,
    // Increment those transition delays by a certain ms value
    transitionDelaySpeed: 100,

    // Uses Ornament.icons for back/forward arrows instead of characters 
    // Should match setting in _drilldown.scss
    // Be sure to set the icons above appropriately 
    useOrnamentSvg: false,

    // Focus delay 
    focusDelay: 400,
    focusTimeout: false,

    // Namespace for event triggers 
    triggerNamespace: "ornament:drilldown",
    
    /* =====================================================================
    Set elements
    ===================================================================== */
    
    _getElements: function(){
      Drilldown.$drilldowns = Ornament.U.findData(Drilldown.selectors.drilldowns);
    },

    /* =====================================================================
    Getters
    ===================================================================== */
    
    _getContainer: function($list) {
      return $list.closest("." + Drilldown.classes.container);
    },
    
    _getListsInContainer: function($container) {
      return $container.find("." + Drilldown.classes.list);
    },
    
    _getClosestList: function(context) {
      return context.closest("." + Drilldown.classes.list);
    },
    
    _getNestedAnchor: function($listItem) {
      var $listItemAnchor = $listItem.children("a");
      var $listItemCustomForwards = $listItem.children("[" + Drilldown.selectors.customForward + "]");
      if($listItemCustomForwards.length) {
        return $listItemCustomForwards;
      } else {
        return $listItemAnchor;
      }
    },
    
    _getParentOfList: function($list) {
      return $list.data("parentList");
    },
    
    _getPreselectedListItem: function($container) {
      return $container.find(Drilldown.selectors.selectedListItem).last();
    },

    _getActiveList: function($container) {
      return $container.find("." + Drilldown.classes.currentList);
    },

    _isSplitDrilldown: function($container) {
      return $container.data("drilldownSplitLinks");
    },

    /* =====================================================================
    Resizing
    ===================================================================== */
    
    _resizeContainer: function($container, $list) {
      var listHeight = $list.outerHeight();
      if(!$list.is(":visible")) {
        var $clone = $list.clone();
        $("body").append($clone);
        listHeight = $clone.outerHeight();
        $clone.remove();
      }
      $container.outerHeight(listHeight);
      return listHeight;
    },
    
    /* =====================================================================
    Navigation
    ===================================================================== */
    
    _moveTo: function($list) {
      var $container = Drilldown._getContainer($list);
      var $lists = Drilldown._getListsInContainer($container);
      // loop over each list and set them all to future
      $lists.each(function(){
        var $thisList = $(this);
        Drilldown._setFutureList($thisList);
        $thisList.addClass(Drilldown.classes.instantList);
      });
      // check if this is the current list, mark as current
      Drilldown._setCurrentList($list);
      // Add transition class and track in a timeout
      if(Drilldown.focusTimeout) {
        clearTimeout(Drilldown.focusTimeout);
      }
      $container.addClass(Drilldown.classes.transitioning);
      $container.removeClass(Drilldown.classes.transitioning);
      Drilldown._resizeContainer($container, $list);
      Drilldown._seedZIndexes($container, $list);
      
      Drilldown.focusTimeout = setTimeout(function(){
        Drilldown._focusOnFirst($list);
        $lists.removeClass(Drilldown.classes.instantList);
      }, Drilldown.focusDelay);
    },
    
    _goBackEvent: function(event) {
      var $button = $(event.target);
      var $list = Drilldown._getClosestList($button);
      var $parent = Drilldown._getParentOfList($list);
      Drilldown._moveTo($parent);
    },
    
    /* =====================================================================
    Class manipulation 
    ===================================================================== */
    
    _setCurrentList: function($list) {
      Drilldown._clearClasses($list);
      $list.removeClass(Drilldown.classes.instantList);
      $list.addClass(Drilldown.classes.currentList);
      $list.attr("aria-hidden", "false");
      // go back over each parent and set as past
      Drilldown._setParentListPast($list);
    },
    
    _setParentListPast: function($list) {
      if($list.data("parentList")) {
        var $parent = Drilldown._getParentOfList($list);
        Drilldown._clearClasses($parent);
        $parent.addClass(Drilldown.classes.pastList).attr("aria-hidden", "true");
        Drilldown._setParentListPast($parent);
      }
    },
    
    _setFutureList: function($list) {
      Drilldown._clearClasses($list);
      $list.attr("aria-hidden", "true");
      $list.addClass(Drilldown.classes.futureList);
    },
    
    _clearClasses: function($list) {
      $list.removeClass(Drilldown.classes.pastList + " " + Drilldown.classes.futureList + " " + Drilldown.classes.currentList);
    },
    
    /* =====================================================================
    Scaffolding
    ===================================================================== */
    
    _setDataOnContainer: function($container, $drilldown) {
      // Attach settings to container for future reference
      if($drilldown.is("[" + Drilldown.selectors.overviews + "]")) {
        $container.data("drilldownOverviews", true);
      }
      if($drilldown.is("[" + Drilldown.selectors.titles + "]")) {
        $container.data("drilldownTitles", true);
      }
      if($drilldown.is("[" + Drilldown.selectors.splitLinks + "]")) {
        $container.data("drilldownSplitLinks", true);
      }
    },

    // Scaffold all lists in the drilldown 
    _scaffold: function($drilldown){
      var $originalData = $drilldown.clone();
      if($drilldown.is("[data-drilldown-init]")) {
        return true;
      } else {
        $drilldown.attr("data-drilldown-init", "");
      }
      var $container = $("<div />");
      if($drilldown.is("div")) {
        $container = $drilldown;
        var $childUl = $drilldown.children("ul");
        // Check if we need to merge multiple ULs in to one
        // drilldown 
        if($drilldown.is("[" + Drilldown.selectors.merge + "]")) {
          var $childUl = $("<ul />");
          $drilldown.children("ul").each(function(){
            var $child = $(this);
            $child.children().appendTo($childUl);
            $child.remove();
          });
        }
        if($childUl.length) {
          $drilldown = $childUl.first();
          Drilldown._setDataOnContainer($container, $container);
        } else {
          console.warn("[Ornament Drilldown] Could not find appropriate list element for drilldown.");
          return;
        }
      } else {
        $drilldown.before($container);
        Drilldown._setDataOnContainer($container, $drilldown);
      }
      // Create a container element and scaffold up the lists 
      $container.addClass(Drilldown.classes.container);
      var $firstList = Drilldown._scaffoldList($drilldown, $container);
      // Set a data attribute to the container to find the first list 
      $container.data("firstList", $firstList);
      $firstList.addClass("drilldown__initial");
      var $preselected = Drilldown._getPreselectedListItem($container);
      if($preselected.length) {
        var $list = Drilldown._getClosestList($preselected);
        Drilldown._moveTo($list);
      } else {
        Drilldown._moveTo($firstList);
      }
      // Set some triggers for external use 
      $container.on(Drilldown.triggerNamespace + ":resize", function(){
        var $list = Drilldown._getActiveList($container);
        Drilldown._resizeContainer($container, $list);
      });

      // Restore original markup before cache
      Ornament.beforeTurbolinksCache(function(){
        $container.before($originalData);
        $container.remove();
      });
    },
    
    // Scaffold an individual list and recursively loop over 
    // nested lists 
    _scaffoldList: function($ul, $container) {
      var $list = $("<div />").addClass(Drilldown.classes.list).attr("aria-hidden", true);
      var $uls = $ul.children("li").children("ul");
      $ul.attr("role", "menu");
      if($uls.length) {
        $uls.each(function(){
          var $nestedUl = $(this);
          var $parentListItem = $nestedUl.parent("li");
          var $parentLink = Drilldown._getNestedAnchor($parentListItem);
          // Add class to parent link
          $parentListItem.addClass(Drilldown.classes.parentListItem);
          // Add description block 
          Drilldown._prependDescriptionBlock($container, $parentLink, $nestedUl);
          // Add back button to nested lists 
          Drilldown._prependBackButton($nestedUl);
          // Scaffold out nested lists as their own elements 
          var $nestedList = Drilldown._scaffoldList($nestedUl, $container);
          var forwardLabel = $parentListItem.text() + " - Show more links";
          // Variation for split links
          if(Drilldown._isSplitDrilldown($container)) {
            var $forwardButton = $("<button />").attr({
              type: "button",
              "aria-label": forwardLabel
            }).text("›").addClass(Drilldown.classes.splitForwardLink)
              .off("click").on("click", function(event) {
              event.preventDefault();
              event.stopPropagation();
              Drilldown._moveTo($nestedList);
              return false;
            });
            // Add parent svg icon 
            if(Drilldown.useOrnamentSvg) {
              $forwardButton.html(Ornament.icons[Drilldown.icons.forward]);
            }
            $parentListItem.addClass(Drilldown.classes.splitListItem).append($forwardButton);
          } else {
            // Bind action to parent link
            var $originalParentLink = $parentLink;
            $parentLink = $("<button />").attr("type", "button").text($originalParentLink.text());
            $parentLink.off("click").on("click", function(event) {
              event.preventDefault();
              event.stopPropagation();
              Drilldown._moveTo($nestedList);
              return false;
            }).attr({
              "aria-label": forwardLabel
            });
            // Add parent svg icon 
            if(Drilldown.useOrnamentSvg) {
              $parentLink.append(Ornament.icons[Drilldown.icons.forward]);
            }
            $originalParentLink.before($parentLink);
            $originalParentLink.remove();
          }
          // Attach the parent list as a data attribute so we can 
          // easily navigate between lists 
          $nestedList.data("parentList", $list);
        });
      }
      $container.append($list);
      $list.append($ul);
      var delayInt = 0;
      $ul.children("li").each(function(){
        var $listItem = $(this);
        $listItem.addClass(Drilldown.classes.listItem);
        if(Drilldown.seedTransitionDelays) {
          var delay = delayInt / 1000 + "s";
          $listItem.css("transitionDelay", delay);
          delayInt += Drilldown.transitionDelaySpeed;
        }
      });
      return $list;
    },
    
    _prependBackButton: function($ul) {
      var $customBack = $ul.find("[" + Drilldown.selectors.customBack + "]");
      if($customBack.length) {
        $customBack.off("click").on("click", Drilldown._goBackEvent);
        return true;
      }
      var $li = $("<li />").addClass(Drilldown.classes.backListItem);
      var $button = $("<button />").attr({
        "type": "button",
        "aria-label": "Go back to parent list"
      }).addClass(Drilldown.classes.backButton);
      var $buttonInner = $("<div />");
      $buttonInner.html($("<span />").text(Drilldown.lang.backButtonLabel));
      if(Drilldown.useOrnamentSvg) {
        $buttonInner.prepend(Ornament.icons[Drilldown.icons.back]);
      }
      $button.append($buttonInner);
      $button.off("click").on("click", Drilldown._goBackEvent);
      $li.append($button);
      $ul.prepend($li);
    },
    
    _prependDescriptionBlock: function($container, $parentLink, $ul) {
      var hasDescription = $parentLink.is("[" + Drilldown.selectors.description + "]");
      var hasTitle = $container.data("drilldownTitles");
      var hasOverview = $container.data("drilldownOverviews");
      var descriptionHasContent = hasDescription || hasTitle;
      var hasOverviewInDescription = descriptionHasContent && hasOverview;
      var $descriptionItem = $("<li />").addClass(Drilldown.classes.descriptionItem);
      var parentLinkLabel = $parentLink.text();
      if(hasTitle) {
        var $title = $("<h2 />").addClass(Drilldown.classes.descriptionTitle).text(parentLinkLabel);
        $descriptionItem.append($title);
      }
      if(hasDescription) {
        var $description = $("<p>").text($parentLink.attr(Drilldown.selectors.description));
        $descriptionItem.append($description);
      }
      var $overviewLink = $("<a />").attr({
        "href": $parentLink.attr("href"),
      }).text(Drilldown.lang.overviewLabel);
      if(hasOverviewInDescription) {
        var $overviewContainer = $("<p>").addClass(Drilldown.classes.descriptionOverview);
        $overviewContainer.append($overviewLink);
        $descriptionItem.append($overviewContainer);
      }
      if(descriptionHasContent) {
        $ul.prepend($descriptionItem);
      } else if(hasOverview) {
        var $overviewContainer = $("<li />").addClass(Drilldown.classes.overviewItem);
        $overviewContainer.append($overviewLink);
        $ul.prepend($overviewContainer);
      }
      
    },

    /* =====================================================================
    Acceessibility 
    ===================================================================== */

    _seedZIndexes: function($container, $activeList){
      $activeList = $activeList || Drilldown._getActiveList($container);
      var targets = "button,a,[tabindex]";
      $container.find(targets).each(function(){
        $(this).attr({
          "tabindex": "-1",
          "aria-hidden": true
        });
      });
      $activeList.find(targets).each(function(){
        $(this).attr({
          "tabindex": "0",
          "aria-hidden": false
        });
      })
    },

    _focusOnFirst: function($list) {
      $list.find("[tabindex]").first().focus();
    },
    
    /* =====================================================================
    Init
    ===================================================================== */
    
    init: function(){
      Drilldown._getElements();
      Drilldown.$drilldowns.each(function(){
        var $drilldown = $(this);
        Drilldown._scaffold($drilldown);
      });
    }
  };

  Ornament.registerComponent("Drilldown", Drilldown);

}(document, window, Ornament, Ornament.Utilities));