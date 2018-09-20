(function (document, window, Ornament, Utils) {
  "use strict";

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
      if($element.parentNode.hasAttribute(Shadowable.wrapperSelector)) {
        return false;
      } else {
        axis = axis || "x";
        var $shadowWrapper = document.createElement("div");
        $shadowWrapper.className = Shadowable.shadowWrapperClass;
        $shadowWrapper.setAttribute(Shadowable.wrapperSelector, "");

        // Wrap content in shadow container
        $element.parentNode.insertBefore($shadowWrapper, $element);
        $shadowWrapper.appendChild($element);

        // Add shadow elements to container
        if(axis === "x") {
          var $leftShadow = document.createElement("div");
          var $rightShadow = document.createElement("div");
          $leftShadow.className = Shadowable.leftShadowClass;
          $leftShadow.setAttribute(Shadowable.leftShadowSelector, "");
          $rightShadow.className = Shadowable.rightShadowClass;
          $rightShadow.setAttribute(Shadowable.rightShadowSelector, "");
          $shadowWrapper.appendChild($leftShadow);
          $shadowWrapper.appendChild($rightShadow);
        } else {
          var $topShadow = document.createElement("div");
          var $bottomShadow = document.createElement("div");
          $topShadow.className = Shadowable.topShadowClass;
          $topShadow.setAttribute(Shadowable.topShadowSelector, "");
          $bottomShadow.className = Shadowable.bottomShadowClass;
          $bottomShadow.setAttribute(Shadowable.bottomShadowSelector, "");
          $shadowWrapper.appendChild($topShadow);
          $shadowWrapper.appendChild($bottomShadow);
        }
      }
    },

    setScrollShadowsX: function($element){
      // TODO
    },

    setScrollShadowsY: function($element){
      var scrollTop = $element.scrollTop;
      var maxScroll = 0;
      $element.childNodes.forEach(function($childNode){
        if($childNode.offsetHeight) {
          maxScroll += parseInt($childNode.offsetHeight);
        }
      });
      maxScroll = maxScroll - $element.offsetHeight;

      var showTopShadow = false;
      var showBottomShadow = false;
      var $topShadow = $element.parentNode.querySelector("[" + Shadowable.topShadowSelector + "]");
      var $bottomShadow = $element.parentNode.querySelector("[" + Shadowable.bottomShadowSelector + "]");

      if(scrollTop != 0) {
        showTopShadow = true;
      }

      if(scrollTop < maxScroll) {
        showBottomShadow = true;
      }

      if(showTopShadow) {
        $topShadow.style.display = "block";
      } else {
        $topShadow.style.display = "none";
      }

      if(showBottomShadow) {
        $bottomShadow.style.display = "block";
      } else {
        $bottomShadow.style.display = "none";
      }
    },

    shadowScrollY: function(event){
      Shadowable.setScrollShadowsY(event.target);
    },

    attachShadowsY: function($element){
      Shadowable.buildShadows($element, "y");
      Shadowable.setScrollShadowsY($element);
      Ornament.U.bindOnce($element, "scroll", Shadowable.shadowScrollY);
    }
  }

  Ornament.U.Shadowable = {
    buildShadows: Shadowable.buildShadows,
    setScrollShadowsY: Shadowable.setScrollShadowsY,
    setScrollShadowsX: Shadowable.setScrollShadowsX,
    shadowScrollY: Shadowable.shadowScrollY,
    attachShadowsY: Shadowable.attachShadowsY
  }

}(document, window, Ornament, Ornament.Utilities));