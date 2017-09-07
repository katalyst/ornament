//= require libs/fotorama

"use strict";

(function (document, window, $) {

  "use strict";

  var Carousel = {
    selector: "data-carousel",
    activeClass: "carousel-active",

    init: function(){
      Ornament.U.findData(Carousel.selector).not("." + Carousel.activeClass).each(function(){
        var $container = $(this);

        // Callbacks
        $container.on("fotorama:load", function(){
          // Custom svg icons 
          var $carousel = $(this);
          var $leftArrow = $carousel.find(".fotorama__arr--prev");
          var $rightArrow = $carousel.find(".fotorama__arr--next");
          $leftArrow.html(Ornament.icons["chevron-left"]);
          $rightArrow.html(Ornament.icons["chevron-right"]);
        });
        $container.fotorama();

        // Get API
        var api = $container.data("fotorama");

        // Destroy before caching
        Ornament.beforeTurbolinksCache(function(){
          api.destroy();
          $container.removeClass(Carousel.activeClass);
        });
      }).addClass(Carousel.activeClass);
    }
  }

  Ornament.registerComponent("Carousel", Carousel);

}(document, window, jQuery));
