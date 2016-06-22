//= require priority-nav

/*jslint browser: true, indent: 2, todo: true, unparam: true */
/*global jQuery,Ornament /*/

(function (document, window, $) {

  "use strict";

  $(document).on("ornament:refresh", function () {

    if($("body").hasClass("ie8")) {
      return false;
    }

    // Our Menus
    var menuClass = ".menu-more";
    var menus = document.querySelector(menuClass);

    // Initialise the menu with more feature
    var menuWithMore = priorityNav.init({
      mainNavWrapper: menuClass,
      navDropdownLabel: "more",
      breakPoint: 0
    });

    // Resize Listener
    var menuWithMoreResize = function(){
      priorityNav.doesItFit(menus);
    }

    if(menus) {
      setTimeout(function(){
        menuWithMoreResize();
      }, 200);

      $(window).on("resize", function(){
        menuWithMoreResize();
      });
    }

  });

}(document, window, jQuery));