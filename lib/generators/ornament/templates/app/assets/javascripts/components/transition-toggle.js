(function (document, window) {
  "use strict";
    
  var TransitionToggle = {

    selectors: {
      target: "data-transition",
      speed: "data-transition-speed",
      transitionClass: "data-transition-transitioning-class",
      openClass: "data-transition-open-class",
      classTarget: "data-transition-target-selector"
    },

    // Default settings
    defaultClassTarget: "body",
    defaultTransitioningClass: "-transitioning",
    defaultOpenClass: "-open",
    defaultSpeed: 1000,

    // Get the ID of a transition from the anchor
    getTransitionId: function($anchor) {
      return $anchor.getAttribute("data-transition");
    },

    // Get the speed of the transiion from the anchor
    getTransitionSpeed: function($anchor) {
      return $anchor.getAttribute(TransitionToggle.selectors.speed) || TransitionToggle.defaultSpeed;
    },

    getTransitionClass: function($anchor) {
      var id = TransitionToggle.getTransitionId($anchor);
      return id + ($anchor.getAttribute(TransitionToggle.selectors.transitionClass) || TransitionToggle.defaultTransitioningClass);
    },

    getOpenClass: function($anchor) {
      var id = TransitionToggle.getTransitionId($anchor);
      return id + ($anchor.getAttribute(TransitionToggle.selectors.openClass) || TransitionToggle.defaultOpenClass);
    },

    getClassTarget: function($anchor) {
      var $target = document.querySelector(TransitionToggle.defaultClassTarget);
      if($anchor.hasAttribute(TransitionToggle.selectors.classTarget)) {
        document.querySelector($anchor.getAttribute(TransitionToggle.selectors.classTarget));
      }
      return $target;
    },

    // Check if a class target has the transitioning class on it
    isTransitioning: function($anchor,$target){
      return $target.classList.contains(TransitionToggle.getTransitionClass($anchor));
    },

    // Check if a class target has the open class on it
    isOpen: function($anchor,$target){
      return $target.classList.contains(TransitionToggle.getOpenClass($anchor));
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
      Ornament.triggerEvent(document, "ornament:toggle-transition:" + id + ":open");
      $target.classList.add(transitionClass);
      $target.classList.add(openClass);
      setTimeout(function(){
        $target.classList.remove(transitionClass);
      }, timing);
    },

    // Toggle off 
    transitionClose: function($anchor, $target, immediate) {
      immediate = immediate || false;
      var id = TransitionToggle.getTransitionId($anchor);
      var $target = $target || TransitionToggle.getClassTarget($anchor);
      var transitionClass = TransitionToggle.getTransitionClass($anchor);
      var openClass = TransitionToggle.getOpenClass($anchor);
      var timing = TransitionToggle.getTransitionSpeed($anchor);
      Ornament.triggerEvent(document, "ornament:toggle-transition:" + id + ":close");
      $target.classList.remove(openClass);
      if(immediate) {
        $target.classList.remove(transitionClass);
      } else {
        $target.classList.add(transitionClass);
        setTimeout(function(){
          $target.classList.remove(transitionClass);
        }, timing);
      }
    },

    // Setup feature
    init: function(){
      // Setup $anchor targets
      TransitionToggle.$anchors = document.querySelectorAll("[" + TransitionToggle.selectors.target + "]"),
      TransitionToggle.$anchors.forEach(function($anchor){
        Ornament.U.bindOnce($anchor, "click", function(e){
          e.preventDefault();
          TransitionToggle.transition($anchor);
        });
        Ornament.beforeTurbolinksCache(function(){
          TransitionToggle.transitionClose($anchor, false, true);
        });
      });
    }
  }

  Ornament.registerComponent("TransitionToggle", TransitionToggle);

}(document, window));