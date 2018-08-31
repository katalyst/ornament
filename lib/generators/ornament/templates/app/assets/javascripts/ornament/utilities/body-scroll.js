(function (document, window, Ornament, Utils) {
  "use strict";

  // Scroll to an offset
  Ornament.U.bodyScroll = function(offset){
    var hasSmoothScroll = 'scrollBehavior' in document.documentElement.style;
    if(hasSmoothScroll) {
      window.scroll({
        top: offset,
        behavior: "smooth"
      });
    } else {
      window.scrollTo(0, offset);
    }
  };

  // Scroll to an element
  Ornament.U.bodyScrollToElement = function(element) {

    var offset = element.getBoundingClientRect().top + window.pageYOffset;
    Ornament.U.bodyScroll(offset);
  }

}(document, window, Ornament, Ornament.Utilities));