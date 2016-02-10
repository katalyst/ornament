//= require priority-nav

/*jslint browser: true, indent: 2, todo: true, unparam: true */
/*global jQuery,Ornament /*/

(function (document, window, $) {

  "use strict";

  $(document).on("ornament:refresh", function () {

    // Our Menus
    var menuClass = ".menu-more";
    var menus = document.querySelector(menuClass);

    // Initialise the menu with more feature
    var menuWithMore = priorityNav.init({
      mainNavWrapper: menuClass,
      mainNav: "ul",
      breakPoint: 0
    });

    if(menus) {

      // Resize Listener
      var menuWithMoreResize = function(){
        priorityNav.doesItFit(menus);
      }

      $(window).on("resize", function(){
        menuWithMoreResize();
      });

    }

  });

}(document, window, jQuery));