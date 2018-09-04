/* =====================================================================

Drilldown Component

Attach to either a div or a unordered list with data-drilldown

===================================================================== */

(function (document, window, Ornament, Utils) {
  "use strict";

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
      merge: "data-drilldown-merge",
      focus: "data-drilldown-focus"
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
      forward: "chevronRight",
      back: "chevronLeft"
    },
    
    // Seed transition delays through each list item so that you can 
    // stagger animate the list items 
    seedTransitionDelays: true,
    // Increment those transition delays by a certain ms value
    transitionDelaySpeed: 100,

    // Uses Ornicons for back/forward arrows instead of characters 
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
      return Ornament.$.parentWithClass($list, Drilldown.classes.container);
    },
    
    _getListsInContainer: function($container) {
      return $container.querySelectorAll("." + Drilldown.classes.list);
    },
    
    _getClosestList: function(context) {
      return Ornament.$.parentWithClass(context, Drilldown.classes.list);
    },
    
    _getNestedAnchor: function($listItem) {
      var $listItemChildren = $listItem.childNodes;
      var $listItemAnchor = false;
      var $listItemCustomForwards = false;

      Array.prototype.slice.call($listItemChildren).filter(function($node){
        var nodeName = $node.nodeName.toLowerCase();
        if(nodeName === "#text") {
          return;
        }
        if(!$listItemAnchor && (nodeName === "a" || nodeName === "button" || nodeName === "span")) {
          $listItemAnchor = $node;
        }
        if(!$listItemCustomForwards && $node.hasAttribute(Drilldown.selectors.customForward)) {
          $listItemCustomForwards = $node;
        }
      });
      if($listItemCustomForwards) {
        return $listItemCustomForwards;
      } else {
        return $listItemAnchor;
      }
    },
    
    _getParentOfList: function($list) {
      return Ornament.Data.get($list, "parentList");
    },
    
    _getPreselectedListItem: function($container) {
      var $listItems = $container.querySelectorAll(Drilldown.selectors.selectedListItem);
      return $listItems[$listItems.length - 1];
    },

    _getActiveList: function($container) {
      return $container.querySelectorAll("." + Drilldown.classes.currentList);
    },

    _isSplitDrilldown: function($container) {
      return Ornament.Data.get($container, "drilldownSplitLinks")
    },

    _shouldFocusOnInit: function($container) {
      return $container.hasAttribute(Drilldown.selectors.focus);
    },

    /* =====================================================================
    Resizing
    ===================================================================== */
    
    _resizeContainer: function($container, $list) {
      var listHeight = $list.offsetHeight;
      var $clone = $list.cloneNode(true);
      document.body.appendChild($clone);
      $clone.style.display = "block";
      listHeight = $clone.offsetHeight;
      document.body.removeChild($clone);
      $container.style.height = listHeight + "px";
      return listHeight;
    },
    
    /* =====================================================================
    Navigation
    ===================================================================== */
    
    _moveTo: function($list, focus) {
      focus = focus || false;
      var $container = Drilldown._getContainer($list);
      var $lists = Drilldown._getListsInContainer($container);
      // loop over each list and set them all to future
      $lists.forEach(function($thisList){
        Drilldown._setFutureList($thisList);
        $thisList.classList.add(Drilldown.classes.instantList);
      });
      // check if this is the current list, mark as current
      Drilldown._setCurrentList($list);
      // Add transition class and track in a timeout
      if(Drilldown.focusTimeout) {
        clearTimeout(Drilldown.focusTimeout);
      }
      $container.classList.add(Drilldown.classes.transitioning);
      $container.classList.remove(Drilldown.classes.transitioning);
      Drilldown._resizeContainer($container, $list);
      Drilldown._seedZIndexes($container, $list);
      Drilldown.focusTimeout = setTimeout(function(){
        if(focus) {
          Drilldown._focusOnFirst($list);
        }
        $lists.forEach(function($thisList){
          $thisList.classList.remove(Drilldown.classes.instantList);
        });
      }, Drilldown.focusDelay);
    },
    
    _goBackEvent: function(event) {
      var $button = event.target;
      var $list = Drilldown._getClosestList($button);
      var $parent = Drilldown._getParentOfList($list);
      Drilldown._moveTo($parent, true);
    },
    
    /* =====================================================================
    Class manipulation 
    ===================================================================== */
    
    _setCurrentList: function($list) {
      Drilldown._clearClasses($list);
      $list.classList.remove(Drilldown.classes.instantList);
      $list.classList.add(Drilldown.classes.currentList);
      $list.setAttribute("aria-hidden", "false");
      // go back over each parent and set as past
      Drilldown._setParentListPast($list);
    },
    
    _setParentListPast: function($list) {
      if(Ornament.Data.get($list, "parentList")) {
        var $parent = Drilldown._getParentOfList($list);
        Drilldown._clearClasses($parent);
        $parent.classList.add(Drilldown.classes.pastList);
        $parent.setAttribute("aria-hidden", "true");
        Drilldown._setParentListPast($parent);
      }
    },
    
    _setFutureList: function($list) {
      Drilldown._clearClasses($list);
      $list.setAttribute("aria-hidden", "true");
      $list.classList.add(Drilldown.classes.futureList);
    },
    
    _clearClasses: function($list) {
      $list.classList.remove(Drilldown.classes.pastList);
      $list.classList.remove(Drilldown.classes.futureList);
      $list.classList.remove(Drilldown.classes.currentList);
    },
    
    /* =====================================================================
    Scaffolding
    ===================================================================== */
    
    _setDataOnContainer: function($container, $drilldown) {
      // Attach settings to container for future reference
      if($drilldown.hasAttribute(Drilldown.selectors.overviews)) {
        Ornament.Data.set($container, "drilldownOverviews", true);
      }
      if($drilldown.hasAttribute(Drilldown.selectors.titles)) {
        Ornament.Data.set($container, "drilldownTitles", true);
      }
      if($drilldown.hasAttribute(Drilldown.selectors.splitLinks)) {
        Ornament.Data.set($container, "drilldownSplitLinks", true);
      }
    },

    // Scaffold all lists in the drilldown 
    _scaffold: function($drilldown){
      var $originalData = $drilldown.cloneNode(true);
      if($drilldown.hasAttribute("data-drilldown-init")) {
        return true;
      } else {
        $drilldown.setAttribute("data-drilldown-init", "");
      }
      var $container = document.createElement("div");
      if($drilldown.nodeName.toLowerCase() === "div") {
        $container = $drilldown;
        var $childUl = Ornament.U.nodeListArray($drilldown.childNodes).filter(function(node){
          return node.nodeName.toLowerCase() === "ul";
        });
        // Check if we need to merge multiple ULs in to one
        // drilldown 
        if($drilldown.hasAttribute(Drilldown.selectors.merge)) {
          var $newUl = document.createElement("ul");
          $drilldown.appendChild($newUl);
          $childUl.forEach(function($child){
            $child.childNodes.forEach(function($childChild){
              // Move all <li>s in to new merged <ul>
              if($childChild.nodeName.toLowerCase() !== "#text") {
                $newUl.appendChild($childChild);
              }
            });
            // Remove left over <ul>
            $child.parentNode.removeChild($child);
          });
          // Use new <ul>
          $childUl = [$newUl];
        }
        if($childUl.length) {
          $drilldown = $childUl[0];
          Drilldown._setDataOnContainer($container, $container);
        } else {
          console.warn("[Ornament Drilldown] Could not find appropriate list element for drilldown.");
          return;
        }
      } else {
        $drilldown.parentElement.insertBefore($container, $drilldown);
        Drilldown._setDataOnContainer($container, $drilldown);
      }
      // Create a container element and scaffold up the lists 
      $container.classList.add(Drilldown.classes.container);
      var $firstList = Drilldown._scaffoldList($drilldown, $container);
      // Set a data attribute to the container to find the first list 
      Ornament.Data.set($container, "firstList", $firstList);
      $firstList.classList.add("drilldown__initial");
      var $preselected = Drilldown._getPreselectedListItem($container);
      if($preselected) {
        var $list = Drilldown._getClosestList($preselected);
        Drilldown._moveTo($list, Drilldown._shouldFocusOnInit($container));
      } else {
        Drilldown._moveTo($firstList, Drilldown._shouldFocusOnInit($container));
      }
      // Set some triggers for external use 
      $container.addEventListener(Drilldown.triggerNamespace + ":resize", function(){
        var $list = Drilldown._getActiveList($container);
        Drilldown._resizeContainer($container, $list);
      });

      // Restore original markup before cache
      Ornament.beforeTurbolinksCache(function(){
        if($container.parentNode) {
          $container.parentNode.insertBefore($originalData, $container);
          $container.parentNode.removeChild($container);
        }
      });
    },
    
    // Scaffold an individual list and recursively loop over 
    // nested lists 
    _scaffoldList: function($ul, $container) {
      var $list = document.createElement("div");
      $list.className = Drilldown.classes.list;
      $list.setAttribute("aria-hidden", true);
      var $uls = [];
      Ornament.U.nodeListArray($ul.childNodes).map(function(ulChild) {
        if(ulChild.nodeName.toLowerCase() === "li") {
          Ornament.U.nodeListArray(ulChild.childNodes).map(function(liChild){
            if(liChild.nodeName.toLowerCase() === "ul") {
              $uls.push(liChild);
            }
          });
        }
      });
      $ul.setAttribute("role", "menu");
      if($uls.length) {
        $uls.map(function($nestedUl){
          var $parentListItem = $nestedUl.parentNode;
          var $parentLink = Drilldown._getNestedAnchor($parentListItem);
          // Add class to parent link
          $parentListItem.classList.add(Drilldown.classes.parentListItem);
          // Add description block 
          Drilldown._prependDescriptionBlock($container, $parentLink, $nestedUl);
          // Add back button to nested lists 
          Drilldown._prependBackButton($nestedUl);
          // Scaffold out nested lists as their own elements 
          var $nestedList = Drilldown._scaffoldList($nestedUl, $container);
          var forwardLabel = $parentListItem.textContent.trim() + " - Show more links";
          // Variation for split links
          if(Drilldown._isSplitDrilldown($container)) {
            var $forwardButton = document.createElement("button");
            $forwardButton.type = "button";
            $forwardButton.setAttribute("aria-label", forwardLabel);
            $forwardButton.innerText = "›";
            $forwardButton.className = Drilldown.classes.splitForwardLink;
            Ornament.U.bindOnce($forwardButton, "click", function(event) {
              event.preventDefault();
              event.stopPropagation();
              Drilldown._moveTo($nestedList, true);
              return false;
            });
            // Add parent svg icon 
            if(Drilldown.useOrnamentSvg) {
              $forwardButton.innerHTML = Ornicons[Drilldown.icons.forward];
            }
            $parentListItem.classList.add(Drilldown.classes.splitListItem);
            $parentListItem.appendChild($forwardButton);
          } else {
            // Bind action to parent link
            var $newParentLink = document.createElement("button");
            $newParentLink.type = "button";
            $newParentLink.innerText = $parentLink.textContent.trim();
            $newParentLink.setAttribute("aria-label", forwardLabel);
            Ornament.U.bindOnce($newParentLink, "click", function(event){
              event.preventDefault();
              event.stopPropagation();
              Drilldown._moveTo($nestedList, true);
              return false;
            });
            // Add parent svg icon 
            if(Drilldown.useOrnamentSvg) {
              $newParentLink.appendChild(Ornicons[Drilldown.icons.forward]);
            }
            $parentLink.parentNode.insertBefore($newParentLink, $parentLink);
            $parentLink.parentNode.removeChild($parentLink);
          }
          // Attach the parent list as a data attribute so we can 
          // easily navigate between lists 
          Ornament.Data.set($nestedList, "parentList", $list);
        });
      }
      $container.appendChild($list);
      $list.appendChild($ul);
      var delayInt = 0;

      $ul.childNodes.forEach(function($listItem){
        if($listItem.nodeName.toLowerCase() === "#text") {
          return;
        }
        $listItem.classList.add(Drilldown.classes.listItem);
        if(Drilldown.seedTransitionDelays) {
          var delay = delayInt / 1000 + "s";
          $listItem.style.transitionDelay = delay;
          delayInt += Drilldown.transitionDelaySpeed;
        }
      });
      return $list;
    },
    
    _prependBackButton: function($ul) {
      var $customBack = $ul.querySelector("[" + Drilldown.selectors.customBack + "]");
      if($customBack) {
        Ornament.U.bindOnce($customBack, "click", Drilldown._goBackEvent);
        return true;
      }
      var $li = document.createElement("li");
      $li.className = Drilldown.classes.backListItem;
      var $button = document.createElement("button");
      $button.type = "button";
      $button.setAttribute("aria-label", "Go back to parent list");
      $button.className = Drilldown.classes.backButton;
      var $buttonInner = document.createElement("div");
      $buttonInner.html = "<span>" + Drilldown.lang.backButtonLabel + "</span>";
      if(Drilldown.useOrnamentSvg) {
        $buttonInner.insertBefore(Ornicons[Drilldown.icons.back], $buttonInner.firstChild);
      }
      $button.appendChild($buttonInner);
      Ornament.U.bindOnce($button, "click", Drilldown._goBackEvent);
      $li.appendChild($button);
      $ul.insertBefore($li, $ul.firstChild);
    },
    
    _prependDescriptionBlock: function($container, $parentLink, $ul) {
      var hasDescription = $parentLink.hasAttribute(Drilldown.selectors.description);
      var hasTitle = Ornament.Data.get($container, "drilldownTitles");
      var hasOverview = Ornament.Data.get($container, "drilldownOverviews");
      var descriptionHasContent = hasDescription || hasTitle;
      var hasOverviewInDescription = descriptionHasContent && hasOverview;
      var $descriptionItem = document.createElement("li");
      $descriptionItem.className = Drilldown.classes.descriptionItem;
      var parentLinkLabel = $parentLink.textContent;
      if(hasTitle) {
        var $title = document.createElement("h2");
        $title.className = Drilldown.classes.descriptionTitle;
        $title.innerText = parentLinkLabel;
        $descriptionItem.appendChild($title);
      }
      if(hasDescription) {
        var $description = document.createElement("p");
        $description.innerText = $parentLink.getAttribute(Drilldown.selectors.description);
        $descriptionItem.appendChild($description);
      }
      var $overviewLink = document.createElement("a");
      $overviewLink.href = $parentLink.href;
      $overviewLink.innerText = Drilldown.lang.overviewLabel;
      if(hasOverviewInDescription) {
        var $overviewContainer = document.createElement("p");
        $overviewContainer.className = Drilldown.classes.descriptionOverview;
        $overviewContainer.appendChild($overviewLink);
        $descriptionItem.appendChild($overviewContainer);
      }
      if(descriptionHasContent) {
        $ul.insertBefore($descriptionItem, $ul.firstChild);
      } else if(hasOverview) {
        var $overviewContainer = document.createElement("li");
        $overviewContainer.className = Drilldown.classes.overviewItem;
        $overviewContainer.appendChild($overviewLink);
        $ul.insertBefore($overviewContainer, $ul.firstChild);
      }
      
    },

    /* =====================================================================
    Acceessibility 
    ===================================================================== */

    _seedZIndexes: function($container, $activeList){
      $activeList = $activeList || Drilldown._getActiveList($container);
      var targets = "button,a,[tabindex]";
      $container.querySelectorAll(targets).forEach(function($target){
        $target.tabIndex = "-1";
        $target.setAttribute("aria-hidden", true);
      });
      $activeList.querySelectorAll(targets).forEach(function($target){
        $target.tabIndex = "0",
        $target.setAttribute("aria-hidden", false);
      });
    },

    _focusOnFirst: function($list) {
      $list.querySelectorAll("[tabindex]")[0].focus();
    },
    
    /* =====================================================================
    Init
    ===================================================================== */
    
    init: function(){
      Drilldown._getElements();
      Drilldown.$drilldowns.forEach(function($drilldown){
        Drilldown._scaffold($drilldown);
      });
    }
  };

  Ornament.registerComponent("Drilldown", Drilldown);

}(document, window, Ornament, Ornament.Utilities));