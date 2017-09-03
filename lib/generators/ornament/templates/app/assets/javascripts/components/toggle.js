/*jslint browser: true, indent: 2, todo: true, unparam: true */
/*global jQuery,Ornament /*/

(function (document, window, $) {

  "use strict";

  $(document).on("ornament:refresh", function () {

    // Expose to the global components namespace
    var Toggle = Ornament.Components.Toggle = {

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

      // Settings
      toggleClass: "active",
      toggleSpeed: 200,
      masterScrollSpeed: this.toggleSpeed,
      eventNameSpace: "ornament:toggle:",

      // Build elements from selectors
      updateSelectors: function(){
        this.$anchors = $("[" + Toggle.anchorSelector + "]");
        this.$panes = $("[" + Toggle.paneSelector + "]");
        this.$temporaryPanes = $("[" + Toggle.temporaryPaneSelector + "]");

        this.$anchors.attr({
          "aria-expanded": false
        });
      },

      // Check if a toggle is on or off
      isToggledOn: function($anchor){
        return $anchor.hasClass(this.toggleClass);
      },

      // Get panes for an anchor
      getPaneForAnAnchor: function($anchor){
        var id = $anchor.attr(Toggle.anchorSelector);
        return $("[" + Toggle.paneSelector + "='" + id + "']");
      },

      // Get anchor for a pane
      getAnchorForAPane: function($pane){
        var id = $pane.attr(Toggle.paneSelector);
        return $("[" + Toggle.anchorSelector + "='" + id + "']");
      },

      // Get all anchors that do the same thing as the
      // current anchor
      getAllAnchorsForAnchor: function($anchor, inclusive) {
        inclusive = inclusive || false;
        var id = $anchor.attr(Toggle.anchorSelector);
        return $("[" + Toggle.anchorSelector + "='" + id + "']");
      },

      // Get the custom toggle timing for an anchor
      getToggleTiming: function($anchor){
        return $anchor.is("[" + Toggle.customSpeedSelector + "]") ? parseInt($anchor.attr(Toggle.customSpeedSelector)) : Toggle.toggleSpeed;
      },

      // Get the other anchors for a toggle group
      // pass in inclusive: true to include the same anchor in the
      // group of elements that are returned
      getTogglesInGroup: function($anchor,inclusive){
        inclusive = inclusive || false;
        var groupId = $anchor.attr(Toggle.groupSelector);
        var $anchors = $("[" + Toggle.groupSelector + "='" + groupId + "']");
        if(inclusive) {
          return $anchors;
        } else {
          return $anchors.not($anchor);
        }
      },

      // Sets all anchors for this id as active
      setAnchorActive: function($anchor){
        var $anchors = Toggle.getAllAnchorsForAnchor($anchor);
        $anchors.addClass(Toggle.toggleClass);
        $anchors.attr({
          "aria-expanded": true
        });
      },

      // Unsets all anchors for this id as active
      unsetAnchorActive: function($anchor){
        var $anchors = Toggle.getAllAnchorsForAnchor($anchor);
        $anchors.removeClass(Toggle.toggleClass);
        $anchors.attr({
          "aria-expanded": false
        });
      },

      // Find the master toggle and find it's offset top
      scrollToMasterAnchor: function($anchor) {
        var id = $anchor.attr(Toggle.anchorSelector);
        var $allAnchors = Toggle.getAllAnchorsForAnchor($anchor);
        var $master = $allAnchors.filter("[" + Toggle.scrollBackMasterSelector + "]");
        var masterOffsetTop = $master.offset().top;

        // Check if user has scrolled past the master element
        // we don't want the user to be scrolled down, only up
        var scrollTop = $(document).scrollTop();
        if(scrollTop > masterOffsetTop) {
          Ornament.bodyScroll(masterOffsetTop, Toggle.getToggleTiming($master));
        }
      },

      // All functions for showing a toggle pane
      toggleOn: function($anchor, $pane){
        Toggle.setAnchorActive($anchor);

        // Hide all other toggles in the same group
        if($anchor.is("[" + Toggle.groupSelector + "]")) {
          Toggle.getTogglesInGroup($anchor).each(function(){
            var $otherAnchor = $(this);
            var $otherPane = Toggle.getPaneForAnAnchor($otherAnchor);
            Toggle.toggleOff($otherAnchor, $otherPane);
          });
        }

        // Swap anchor labels
        if($anchor.is("[" + Toggle.visibleLabelSelector + "]")) {
          $anchor.text($anchor.attr(Toggle.visibleLabelSelector));
        }

        // Show the pane
        $pane.slideDown(Toggle.getToggleTiming($anchor), function(){
          Toggle.afterToggleOn($anchor, $pane);
        });
      },

      // All functions for hiding a toggle pane
      toggleOff: function($anchor, $pane){
        Toggle.unsetAnchorActive($anchor);

        // Swap anchor labels
        if($anchor.is("[" + Toggle.hiddenLabelSelector + "]")) {
          $anchor.text($anchor.attr(Toggle.hiddenLabelSelector));
        }

        // Hide the pane
        $pane.slideUp(Toggle.getToggleTiming($anchor), function(){
          Toggle.afterToggleOff($anchor, $pane);
        });

        // Scroll up to anchor
        if($anchor.is("[" + Toggle.scrollBackSelector + "]")) {
          Toggle.scrollToMasterAnchor($anchor);
        }

      },

      // Callback for toggling on
      afterToggleOn: function($anchor, $pane){
        $anchor.trigger(Toggle.eventNameSpace + "toggled-on");
        $pane.trigger(Toggle.eventNameSpace + "toggled-on");

        // Focus on the first input field when available
        if($anchor.is("[" + Toggle.focusOnFieldSelector + "]")) {
          var $inputs = $pane.find("input");
          var $textareas = $pane.find("textarea");
          if($inputs.length) {
            $inputs.first().focus();
          } else if($textareas.length) {
            $textareas.first().focus();
          }
        }
      },

      // Callback for toggling off
      afterToggleOff: function($anchor, $pane){
        $anchor.trigger(Toggle.eventNameSpace + "toggled-off");
        $pane.trigger(Toggle.eventNameSpace + "toggled-off");
      },

      // Either toggle on or off based on current state
      toggle: function($anchor, $pane){
        // Don't toggle in in the middle of animating
        if($pane.is(":animated")){
          return false;
        }

        // Determine which way the pane needs to be
        // toggled
        if(Toggle.isToggledOn($anchor)) {
          Toggle.toggleOff($anchor, $pane);
        } else {
          Toggle.toggleOn($anchor, $pane);
        }
      },

      // Hiding all toggles that aren't defaulted to on
      hideAllToggles: function(){
        Toggle.$panes.not("[" + Toggle.defaultPaneSelector + "]").hide();
      },

      // Hiding temporary toggles
      hideTemporaryToggles: function(){
        Toggle.$temporaryToggles.each(function(){
          var $pane = $(this);
          var toggleId = $pane.attr("data-toggle");
          var $anchor = $("[data-toggle-anchor=" + toggleId + "]");
          Toggle.toggleOff($anchor, $pane);
        });
      },

      // Click binding for a toggle anchor
      onToggleAnchorClick: function(event){
        event.preventDefault();
        var $anchor = $(event.currentTarget);
        var $pane = Toggle.getPaneForAnAnchor($anchor);
        Toggle.toggle($anchor, $pane);
      },

      // Initialise the ornament toggles
      init: function(){

        // Create lists of elements
        this.updateSelectors();

        // Hide all toggles
        this.hideAllToggles();

        // Build out bindings
        this.$anchors.each(function(){
          var $anchor = $(this);
          var $pane = Toggle.getPaneForAnAnchor($anchor);
          $anchor.off("click", Toggle.onToggleAnchorClick).on("click", Toggle.onToggleAnchorClick);

          // Cache old text value if we need to swap labels
          if($anchor.is("[" + Toggle.visibleLabelSelector + "]")) {
            $anchor.attr(Toggle.hiddenLabelSelector, $anchor.text());
          }

          // Bindings and triggers on anchors and panes
          $anchor.on(Toggle.eventNameSpace + "toggle-on", function(){
            Toggle.toggleOn($anchor, $pane);
          });
          $anchor.on(Toggle.eventNameSpace + "toggle-off", function(){
            Toggle.toggleOff($anchor, $pane);
          });
          $anchor.on(Toggle.eventNameSpace + "toggle", function(){
            Toggle.toggle($anchor, $pane);
          });
          $pane.on(Toggle.eventNameSpace + "toggle-on", function(){
            Toggle.toggleOn($anchor, $pane);
          });
          $pane.on(Toggle.eventNameSpace + "toggle-off", function(){
            Toggle.toggleOff($anchor, $pane);
          });
          $pane.on(Toggle.eventNameSpace + "toggle", function(){
            Toggle.toggle($anchor, $pane);
          });

          $anchor.attr("data-toggle-anchor-ready", "");

          // Clicking away from the toggles shoud hide
          // the temporary toggles
          if($anchor.is("[" + Toggle.temporaryAnchorSelector + "]")) {
            var listenForThisPaneClick = function(event){
              var $target = $(event.target);
              var clickedInAnchor = $.contains($anchor, $target) || 
                                    $target.closest($anchor).length > 0;
              var clickedInPane = $.contains($pane, $target) || 
                                  $target.closest($pane).length > 0;
              var clickedOnAnchor = $anchor.is($target);
              var clickedOnPane = $pane.is($target);
              if(!clickedInPane && !clickedInAnchor && !clickedOnPane && !clickedOnAnchor) {
                Toggle.toggleOff($anchor, $pane);
              }
            }
            $(document).off("click", listenForThisPaneClick).on("click", listenForThisPaneClick);
          }

          // Bindings on the document level
          $(document).on(Toggle.eventNameSpace + "toggle-all-off", Toggle.hideAllToggles);
          $(document).on(Toggle.eventNameSpace + "toggle-init", Toggle.init);

        });

      }

    }

    Toggle.init();

  });

}(document, window, jQuery));