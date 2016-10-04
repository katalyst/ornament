/*jslint browser: true, indent: 2, todo: true, unparam: true */
/*global jQuery,Ornament /*/

(function (document, window, $) {

  "use strict";

  $(document).on("ornament:refresh", function () {
    
    var TransitionToggle = Ornament.Components.TransitionToggle = {

      // Selectors
      targetSelector: "data-transition",
      speedSelector: "data-transition-speed",
      transitionClassSelector: "data-transition-transitioning-class",
      openClassSelector: "data-transition-open-class",
      classTargetSelector: "data-transition-target-selector",

      // Default settings
      defaultClassTarget: "body",
      defaultTransitioningClass: "-transitioning",
      defaultOpenClass: "-open",
      defaultSpeed: 1000,

      // Get the ID of a transition from the anchor
      getTransitionId: function($anchor) {
        return $anchor.attr("data-transition");
      },

      // Get the speed of the transiion from the anchor
      getTransitionSpeed: function($anchor) {
        return $anchor.attr(TransitionToggle.speedSelector) || TransitionToggle.defaultSpeed;
      },

      getTransitionClass: function($anchor) {
        var id = TransitionToggle.getTransitionId($anchor);
        return id + ($anchor.attr(TransitionToggle.transitionClassSelector) || TransitionToggle.defaultTransitioningClass);
      },

      getOpenClass: function($anchor) {
        var id = TransitionToggle.getTransitionId($anchor);
        return id + ($anchor.attr(TransitionToggle.openClassSelector) || TransitionToggle.defaultOpenClass);
      },

      getClassTarget: function($anchor) {
        var $defaultTarget = $(TransitionToggle.defaultClassTarget);
        var $target = $($anchor.attr(TransitionToggle.classTargetSelector));
        return $target.length ? $target : $defaultTarget;
      },

      // Check if a class target has the transitioning class on it
      isTransitioning: function($anchor,$target){
        return $target.is("." + TransitionToggle.getTransitionClass($anchor));
      },

      // Check if a class target has the open class on it
      isOpen: function($anchor,$target){
        return $target.is("." + TransitionToggle.getOpenClass($anchor));
      },

      // Toggle either a transition on or off 
      transition: function($anchor) {
        var $target = TransitionToggle.getClassTarget($anchor);
        if(TransitionToggle.isTransitioning($anchor, $target)) {
          return false;
        }
        if(TransitionToggle.isOpen($anchor, $target)) {
          TransitionToggle.transitionClose($anchor);
        } else {
          TransitionToggle.transitionOpen($anchor);
        }
      },

      // Toggle on 
      transitionOpen: function($anchor, $target) {
        var id = TransitionToggle.getTransitionId($anchor,$target);
        var $target = $target || TransitionToggle.getClassTarget($anchor);
        var transitionClass = TransitionToggle.getTransitionClass($anchor);
        var openClass = TransitionToggle.getOpenClass($anchor);
        var timing = TransitionToggle.getTransitionSpeed($anchor);
        console.log(id, transitionClass, openClass, timing);
        $target.addClass(transitionClass + " " + openClass);
        setTimeout(function(){
          $target.removeClass(transitionClass);
        }, timing);
      },

      // Toggle off 
      transitionClose: function($anchor, $target) {
        var id = TransitionToggle.getTransitionId($anchor);
        var $target = $target || TransitionToggle.getClassTarget($anchor);
        var transitionClass = TransitionToggle.getTransitionClass($anchor);
        var openClass = TransitionToggle.getOpenClass($anchor);
        var timing = TransitionToggle.getTransitionSpeed($anchor);
        console.log(id, transitionClass, openClass, timing);
        $target.removeClass(openClass).addClass(transitionClass);
        setTimeout(function(){
          $target.removeClass(transitionClass);
        }, timing);
      },

      // Setup feature
      init: function(){
        // Setup $anchor targets
        TransitionToggle.$anchors = $("[" + TransitionToggle.targetSelector + "]"),
        TransitionToggle.$anchors.each(function(){
          var $anchor = $(this);
          $anchor.off("click").on("click", function(e){
            e.preventDefault();
            TransitionToggle.transition($anchor);
          });
        });
      }
    }

    TransitionToggle.init();
  });

}(document, window, jQuery));