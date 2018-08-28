//= require libs/tiny-slider

(function (document, window) {

  "use strict";

  var Carousel = {
    selector: "data-carousel",
    activeClass: "carousel-active",

    init: function(){
      document.querySelectorAll("[" + Carousel.selector + "]").forEach(function($node){
        var slider = tns({
          container: $node,
          items: 1,
          slideBy: 'page'
        });
      });
    }
  }

  Ornament.registerComponent("Carousel", Carousel);

}(document, window));
