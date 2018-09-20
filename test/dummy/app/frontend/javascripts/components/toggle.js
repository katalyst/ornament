(function (document, window) {
  "use strict";

  // Expose to the global components namespace
  var Toggle = {

    // Selectors
    anchorSelector: "data-toggle-anchor",
    paneSelector: "data-toggle",
    defaultPaneSelector: "data-toggle-default",
    temporaryPaneSelector: "data-toggle-temporary",
    temporaryAnchorSelector: "data-toggle-temporary-anchor",
    groupSelector: "data-toggle-group",
    visibleLabelSelector: "data-toggle-visible-label",
    hiddenLabelSelector: "data-toggle-hidden-label",
    focusOnFieldSelector: "data-toggle-focus",
    customSpeedSelector: "data-toggle-timing",
    scrollBackSelector: "data-toggle-scroll",
    scrollBackMasterSelector: "data-toggle-scroll-master",
    immediateSelector: "data-toggle-immediate",
    oneWaySelector: "data-toggle-one-way",

    // Settings
    toggleClass: "active",
    toggleSpeed: 200,
    masterScrollSpeed: 200,
    eventNameSpace: "ornament:toggle:",

    // Build elements from selectors
    updateSelectors: function(){
      this.$anchors = document.querySelectorAll("[" + Toggle.anchorSelector + "]");
      this.$panes = document.querySelectorAll("[" + Toggle.paneSelector + "]");
      this.$temporaryPanes = document.querySelectorAll("[" + Toggle.temporaryPaneSelector + "]");
      this.$anchors.forEach(function($anchor) {
        $anchor.setAttribute("aria-expanded", false);
      });
    },

    // Check if a toggle is on or off
    isToggledOn: function($anchor){
      return $anchor.classList.contains(this.toggleClass);
    },

    isOneWay: function($anchor) {
      return $anchor.hasAttribute(Toggle.oneWaySelector);
    },

    // Get panes for an anchor
    getPaneForAnAnchor: function($anchor){
      var id = $anchor.getAttribute(Toggle.anchorSelector);
      return document.querySelectorAll("[" + Toggle.paneSelector + "='" + id + "']");
    },

    // Get anchor for a pane
    getAnchorForAPane: function($pane){
      var id = $pane.getAttribute(Toggle.paneSelector);
      return document.querySelectorAll("[" + Toggle.anchorSelector + "='" + id + "']");
    },

    // Get all anchors that do the same thing as the
    // current anchor
    getAllAnchorsForAnchor: function($anchor, inclusive) {
      inclusive = inclusive || false;
      var id = $anchor.getAttribute(Toggle.anchorSelector);
      return document.querySelectorAll("[" + Toggle.anchorSelector + "='" + id + "']");
    },

    // Get the custom toggle timing for an anchor
    getToggleTiming: function($anchor){
      return $anchor.hasAttribute(Toggle.customSpeedSelector) ? parseInt($anchor.getAttribute(Toggle.customSpeedSelector)) : Toggle.toggleSpeed;
    },

    // Get the other anchors for a toggle group
    // pass in inclusive: true to include the same anchor in the
    // group of elements that are returned
    getTogglesInGroup: function($anchor,inclusive){
      inclusive = inclusive || false;
      var groupId = $anchor.getAttribute(Toggle.groupSelector);
      var $anchors = document.querySelectorAll("[" + Toggle.groupSelector + "='" + groupId + "']");
      if(inclusive) {
        return $anchors;
      } else {
        var anchorId = $anchor.getAttribute(Toggle.anchorSelector);
        return Ornament.U.nodeListArray($anchors).filter(function($node){
          return $node.getAttribute(Toggle.anchorSelector) !== anchorId;
        });
      }
    },

    // Sets all anchors for this id as active
    setAnchorActive: function($anchor){
      var $anchors = Toggle.getAllAnchorsForAnchor($anchor);
      $anchors.forEach(function($thisAnchor){
        $thisAnchor.classList.add(Toggle.toggleClass);
        $thisAnchor.setAttribute("aria-expanded", true);
      });
    },

    // Unsets all anchors for this id as active
    unsetAnchorActive: function($anchor){
      var $anchors = Toggle.getAllAnchorsForAnchor($anchor);
      $anchors.forEach(function($thisAnchor){
        $thisAnchor.classList.remove(Toggle.toggleClass)
        $thisAnchor.setAttribute("aria-expanded", false);
      });
    },

    // Find the master toggle and find it's offset top
    scrollToMasterAnchor: function($anchor) {
      var id = $anchor.getAttribute(Toggle.anchorSelector);
      var $allAnchors = Toggle.getAllAnchorsForAnchor($anchor);
      var $master = Ornament.U.nodeListArray($allAnchors).filter(function($node){
        return $node.hasAttribute(Toggle.scrollBackMasterSelector);
      });
      if($master.length) {
        Ornament.U.bodyScrollToElement($master[0]);
      }
    },

    // All functions for showing a toggle pane
    toggleOn: function($anchor, $panes){
      Toggle.setAnchorActive($anchor);

      // Hide all other toggles in the same group
      if($anchor.hasAttribute(Toggle.groupSelector)) {
        var $allToggles = Toggle.getTogglesInGroup($anchor);
        if($allToggles) {
          $allToggles.forEach(function($otherAnchor){
            var $otherPane = Toggle.getPaneForAnAnchor($otherAnchor);
            Toggle.toggleOff($otherAnchor, $otherPane);
          });
        }
      }

      // Swap anchor labels
      if($anchor.hasAttribute(Toggle.visibleLabelSelector)) {
        $anchor.innerText = $anchor.getAttribute(Toggle.visibleLabelSelector);
      }

      // Show the pane
      $panes.forEach(function($pane){
        if($pane.hasAttribute(Toggle.immediateSelector)) {
          $pane.style.display = "block";
          Toggle.afterToggleOn($anchor, $pane);
        } else {
          Ornament.slideDown($pane, Toggle.getToggleTiming($anchor), function(){
            Toggle.afterToggleOn($anchor, $pane);
          });
        }
      });
    },

    // All functions for hiding a toggle pane
    toggleOff: function($anchor, $panes){
      Toggle.unsetAnchorActive($anchor);

      // Swap anchor labels
      if($anchor.hasAttribute(Toggle.hiddenLabelSelector)) {
        $anchor.innerText = $anchor.getAttribute(Toggle.hiddenLabelSelector);
      }

      // Hide the pane
      $panes.forEach(function($pane){
        if($pane.hasAttribute(Toggle.immediateSelector)) {
          $pane.style.display = "none";
          Toggle.afterToggleOn($anchor, $pane);
        } else {
          Ornament.slideUp($pane, Toggle.getToggleTiming($anchor), function(){
            Toggle.afterToggleOff($anchor, $pane);
          });
        }
      });

      // Scroll up to anchor
      if($anchor.hasAttribute(Toggle.scrollBackSelector)) {
        Toggle.scrollToMasterAnchor($anchor);
      }
    },

    // Callback for toggling on
    afterToggleOn: function($anchor, $pane){
      Ornament.triggerEvent($anchor, Toggle.eventNameSpace + "toggled-on");
      Ornament.triggerEvent($pane, Toggle.eventNameSpace + "toggled-on");

      // Focus on the first input field when available
      if($anchor.hasAttribute(Toggle.focusOnFieldSelector)) {
        var $input = $pane.querySelector("input");
        var $textarea = $pane.querySelector("textarea");
        if($input) {
          $input.focus();
        } else if($textarea) {
          $textarea.focus();
        }
      }
    },

    // Callback for toggling off
    afterToggleOff: function($anchor, $pane){
      Ornament.triggerEvent($anchor, Toggle.eventNameSpace + "toggled-off");
      Ornament.triggerEvent($pane, Toggle.eventNameSpace + "toggled-off");
    },

    // Either toggle on or off based on current state
    toggle: function($anchor, $panes){
      // // Don't toggle in in the middle of animating
      // if($pane.matches(":animated")){
      //   return false;
      // }

      // Determine which way the pane needs to be
      // toggled
      if(Toggle.isToggledOn($anchor) && !Toggle.isOneWay($anchor)) {
        Toggle.toggleOff($anchor, $panes);
      } else {
        Toggle.toggleOn($anchor, $panes);
      }
    },

    // Hiding all toggles that aren't defaulted to on
    hideAllToggles: function(){
      Toggle.$panes.forEach(function($pane){
        if($pane.hasAttribute(Toggle.defaultPaneSelector)) {
          return;
        }
        if($pane.hasAttribute(Toggle.immediateSelector)) {
          $pane.style.display = "none";
        } else {
          Ornament.slideUp($pane, 1);
        }
      });
    },

    // Hiding temporary toggles
    hideTemporaryToggles: function(){
      Toggle.$temporaryToggles.forEach(function($pane){
        var toggleId = $pane.getAttribute("data-toggle");
        var $anchor = document.querySelectorAll("[data-toggle-anchor='" + toggleId + "']");
        Toggle.toggleOff($anchor, $pane);
      });
    },

    // Click binding for a toggle anchor
    onToggleAnchorClick: function(event){
      event.preventDefault();
      var $anchor = event.currentTarget;
      var $pane = Toggle.getPaneForAnAnchor($anchor);
      Toggle.toggle($anchor, $pane);
    },

    bindAnchor: function($anchor){
      var $panes = Toggle.getPaneForAnAnchor($anchor);
      Ornament.U.bindOnce($anchor, "click", Toggle.onToggleAnchorClick);

      // Cache old text value if we need to swap labels
      if($anchor.hasAttribute(Toggle.visibleLabelSelector)) {
        $anchor.setAttribute(Toggle.hiddenLabelSelector, $anchor.innerText);
      }

      // Bindings and triggers on anchors and panes
      Ornament.U.bindOnce($anchor, Toggle.eventNameSpace + "toggle-on", function(){
        Toggle.toggleOn($anchor, $panes);
      });
      Ornament.U.bindOnce($anchor, Toggle.eventNameSpace + "toggle-off", function(){
        Toggle.toggleOff($anchor, $panes);
      });
      Ornament.U.bindOnce($anchor, Toggle.eventNameSpace + "toggle", function(){
        Toggle.toggle($anchor, $panes);
      });
      $panes.forEach(function($pane){
        Ornament.U.bindOnce($pane, Toggle.eventNameSpace + "toggle-on", function(){
          Toggle.toggleOn($anchor, $panes);
        });
        Ornament.U.bindOnce($pane, Toggle.eventNameSpace + "toggle-off", function(){
          Toggle.toggleOff($anchor, $panes);
        });
        Ornament.U.bindOnce($pane, Toggle.eventNameSpace + "toggle", function(){
          Toggle.toggle($anchor, $panes);
        });
      });

      $anchor.setAttribute("data-toggle-anchor-ready", "");

      // Clicking away from the toggles shoud hide
      // the temporary toggles
      if($anchor.hasAttribute(Toggle.temporaryAnchorSelector)) {
        var listenForThisPaneClick = function(event){
          var $target = event.target;
          var clickedInAnchor = $anchor.contains($target);
          var clickedInPane = false;
          $panes.forEach(function($pane){
            if($pane.contains($target)){
              clickedInPane = true;
            }
          });
          if(!clickedInPane && !clickedInAnchor) {
            Toggle.toggleOff($anchor, $panes);
          }
        }
        Ornament.U.bindOnce(document, "click", listenForThisPaneClick);
      }
    },

    // Initialise the ornament toggles
    init: function(){

      // Create lists of elements
      this.updateSelectors();

      // Hide all toggles
      this.hideAllToggles();

      // Build out bindings
      this.$anchors.forEach(function($anchor){
        Toggle.bindAnchor($anchor);
      });

      // Bindings on the document level
      Ornament.U.bindOnce(document, Toggle.eventNameSpace + "toggle-all-off", Toggle.hideAllToggles);
      Ornament.U.bindOnce(document, Toggle.eventNameSpace + "toggle-init", Toggle.init);

    }
  }

  Ornament.registerComponent("Toggle", Toggle);

}(document, window));