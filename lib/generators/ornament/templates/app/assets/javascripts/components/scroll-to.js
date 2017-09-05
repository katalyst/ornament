/*jslint browser: true, indent: 2, todo: true, unparam: true */
/*global jQuery,Ornament /*/

(function (document, window, $) {

  "use strict";

  var ScrollTo = Ornament.C.ScrollTo = {

    scrollToSelector: "data-scroll-to",
    stickyHeader: false, // set to sizzle selector if there is

    scrollToElement: function($target){
      var targetOffset = 0;
      try {
        targetOffset = $target.offset().top;
      } catch(error) {
        targetOffset = $($target).offset().top;
      }
      if(ScrollTo.stickyHeader) {
        targetOffset = targetOffset - ScrollTo.stickyHeader.outerHeight();
      }
      Ornament.U.bodyScroll(targetOffset, 200);
    },

    bindScrollTo: function(event){
      event.preventDefault();
      var $anchor = $(event.target);
      if(!$anchor.is("[" + ScrollTo.scrollToSelector + "]")) {
        $anchor = $anchor.closest("[" + ScrollTo.scrollToSelector + "]");
      }
      var $target = $anchor.attr(ScrollTo.scrollToSelector);
      if($anchor.is("[href]")) {
        var $target = $($anchor.attr("href"));
      }
      ScrollTo.scrollToElement($target);
    },

    init: function(){
      ScrollTo.$anchors = $("[" + ScrollTo.scrollToSelector + "]"),
      ScrollTo.$anchors.each(function(){
        Ornament.U.bindOnce(this, "click", ScrollTo.bindScrollTo);
      });
    }

  }

  $(document).on("ornament:refresh", function () {
    ScrollTo.init();
  });

}(document, window, jQuery));