/*jslint browser: true, indent: 2, todo: true, unparam: true */
/*global jQuery,Ornament /*/

(function (document, window, $) {

  "use strict";

  var ScrollTo = Ornament.C.ScrollTo = {

    $anchors: $("[data-scroll-to]"),
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
      Ornament.bodyScroll(targetOffset, 200);
    },

    bindScrollTo: function(event){
      event.preventDefault();
      var $anchor = $(event.target);
      if(!$anchor.is("[data-scroll-to]")) {
        $anchor = $anchor.closest("[data-scroll-to]");
      }
      var $target = $($anchor.attr("href"));
      ScrollTo.scrollToElement($target);
    },

    init: function(){
      ScrollTo.$anchors.off("click").on("click", ScrollTo.bindScrollTo);
    }

  }

  $(document).on("ornament:refresh", function () {
    ScrollTo.init();
  });

}(document, window, jQuery));