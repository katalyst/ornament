/*jslint browser: true, indent: 2, todo: true, unparam: true */
/*global jQuery,Ornament /*/

(function (document, window, $) {

  "use strict";

  $(document).on("ornament:refresh", function () {
    var Transition = Ornament.Transition = {

      $anchors: $("[data-transition]"),
      $classTarget: $("body"),
      transitionClass: "-transitioning",
      openClass: "-open",
      speed: 4000,

      getTransitionId: function($anchor) {
        return $anchor.attr("data-transition");
      },

      getTransitionSpeed: function($anchor) {
        return $anchor.attr("data-transition-speed") || Transition.speed;
      },

      transition: function($anchor) {
        var id = Transition.getTransitionId($anchor);
        if(Transition.$classTarget.is("." + id + Transition.transitionClass)) {
          return false;
        }
        if(Transition.$classTarget.is("." + id + Transition.openClass)) {
          Transition.transitionClose($anchor);
        } else {
          Transition.transitionOpen($anchor);
        }
      },

      transitionOpen: function($anchor) {
        var id = Transition.getTransitionId($anchor);
        Transition.$classTarget.addClass(id + Transition.transitionClass + " " + id + Transition.openClass);
        setTimeout(function(){
          Transition.$classTarget.removeClass(id + Transition.transitionClass);
        }, Transition.getTransitionSpeed($anchor));
      },

      transitionClose: function($anchor) {
        var id = Transition.getTransitionId($anchor);
        Transition.$classTarget.removeClass(id + Transition.openClass).addClass(id + Transition.transitionClass);
        setTimeout(function(){
          Transition.$classTarget.removeClass(id + Transition.transitionClass);
        }, Transition.getTransitionSpeed($anchor));
      },

      init: function(){
        Transition.$anchors.each(function(){
          var $anchor = $(this);
          $anchor.off("click").on("click", function(e){
            e.preventDefault();
            Transition.transition($anchor);
          });
        });
      }
    }

    Transition.init();
  });

}(document, window, jQuery));