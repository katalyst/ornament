"use strict";

(function (document, window, $, Ornament) {

  var Shadowable = {

    // Settings
    leftShadowClass: "shadow__left",
    rightShadowClass: "shadow__right",
    topShadowClass: "shadow__top",
    bottomShadowClass: "shadow__bottom",
    shadowWrapperClass: "shadow--wrapper",

    // Selectors
    wrapperSelector: "data-shadow-wrapper",
    leftShadowSelector: "data-shadow-left",
    rightShadowSelector: "data-shadow-right",
    topShadowSelector: "data-shadow-top",
    bottomShadowSelector: "data-shadow-bottom",

    buildShadows: function($element, axis) {
      if($element.parent().is("[" + Shadowable.wrapperSelector + "]")) {
        return false;
      } else {
        axis = axis || "x";
        var $shadowWrapper = $("<div class='" + Shadowable.shadowWrapperClass + "' " + Shadowable.wrapperSelector + " />");
        var $topShadow = $("<div class='" + Shadowable.topShadowClass + "' " + Shadowable.topShadowSelector + " />");
        var $bottomShadow = $("<div class='" + Shadowable.bottomShadowClass + "' " + Shadowable.bottomShadowSelector + " />");
        var $leftShadow = $("<div class='" + Shadowable.leftShadowClass + "' " + Shadowable.leftShadowSelector + " />");
        var $rightShadow = $("<div class='" + Shadowable.rightShadowClass + "' " + Shadowable.rightShadowSelector + " />");
        $element.wrap($shadowWrapper);
        if(axis === "x") {
          $element.after($leftShadow).after($rightShadow);
        } else {
          $element.after($topShadow).after($bottomShadow);
        }
      }
    },

    setScrollShadowsX: function($element){},

    setScrollShadowsY: function($element){
      var scrollTop = $element.scrollTop();
      var maxScroll = 0;
      $element.children().each(function(){
        maxScroll += parseInt($(this).outerHeight());
      });
      maxScroll = maxScroll - $element.outerHeight();

      var showTopShadow = false;
      var showBottomShadow = false;
      var $topShadow = $element.parent().find("[" + Shadowable.topShadowSelector + "]");
      var $bottomShadow = $element.parent().find("[" + Shadowable.bottomShadowSelector + "]");

      if(scrollTop != 0) {
        showTopShadow = true;
      }

      if(scrollTop < maxScroll) {
        showBottomShadow = true;
      }

      if(showTopShadow) {
        $topShadow.show();
      } else {
        $topShadow.hide();
      }

      if(showBottomShadow) {
        $bottomShadow.show();
      } else {
        $bottomShadow.hide();
      }
    },

    shadowScrollY: function(event){
      Shadowable.setScrollShadowsY($(event.delegateTarget));
    },

    attachShadowsY: function($element){
      Shadowable.buildShadows($element, "y");
      Shadowable.setScrollShadowsY($element);
      $element.on("scroll", Shadowable.shadowScrollY);
    }
  }

  Ornament.U.Shadowable = {
    buildShadows: Shadowable.buildShadows,
    setScrollShadowsY: Shadowable.setScrollShadowsY,
    setScrollShadowsX: Shadowable.setScrollShadowsX,
    shadowScrollY: Shadowable.shadowScrollY,
    attachShadowsY: Shadowable.attachShadowsY
  }

}(document, window, jQuery, Ornament));