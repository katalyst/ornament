(function (document, window) {
  "use strict";

  var ScrollTo = {

    scrollToSelector: "data-scroll-to",

    bindScrollTo: function(event){
      event.preventDefault();
      var $anchor = event.currentTarget || event.target;
      var target = $anchor.getAttribute(ScrollTo.scrollToSelector);
      if($anchor.hasAttribute("href")) {
        $target = $anchor.getAttribute("href");
      }
      if(!target) {
        console.warn("No target to scroll to");
        return;
      }
      var $target = document.querySelector(target);
      if(!$target) {
        console.warn("Can't find target to scroll to");
      }
      Ornament.U.bodyScrollToElement($target);
    },

    init: function(){
      ScrollTo.$anchors = document.querySelectorAll("[" + ScrollTo.scrollToSelector + "]");
      for(var i = 0; i < ScrollTo.$anchors.length; i++ ) {
        Ornament.U.bindOnce(ScrollTo.$anchors[i], "click", ScrollTo.bindScrollTo);
      }
    }
  }

  Ornament.registerComponent("ScrollTo", ScrollTo);

}(document, window));