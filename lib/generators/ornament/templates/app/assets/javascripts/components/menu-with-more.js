//= require libs/priority-nav

/*jslint browser: true, indent: 2, todo: true, unparam: true */
/*global jQuery,Ornament /*/

(function (document, window, $) {

  "use strict";

  var MenuWithMore = {

    menuClass: "menu-more",
    menus: false,

    resizeListener: function(){
      if(priorityNav.doesItFit) {
        for(var i = 0; i < MenuWithMore.menus.length; i++) {
          priorityNav.doesItFit(MenuWithMore.menus[i]);
        }
      }
    },

    // Initialise the menu with more feature
    bindPriorityNav: function(){
      var menuWithMore = priorityNav.init({
        mainNavWrapper: "." + MenuWithMore.menuClass,
        navDropdownLabel: "more",
        breakPoint: 0
      });
    },

    destroyMenu: function(menu){
      var $wrapper = $(menu).find(".priority-nav__wrapper");
      if($wrapper.length) {
        $wrapper.remove();
      }
    },

    destroy: function(){
      $(window).off("resize", MenuWithMore.resizeListener);
      for(var i = 0; i < MenuWithMore.menus.length; i++) {
        MenuWithMore.destroyMenu(MenuWithMore.menus[i]);
      }
    },

    init: function(){
      MenuWithMore.menus = document.querySelectorAll("." + MenuWithMore.menuClass);
      if(MenuWithMore.menus.length) {
        MenuWithMore.bindPriorityNav();
        setTimeout(function(){
          MenuWithMore.resizeListener();
        }, 200);
        $(window).off("resize", MenuWithMore.resizeListener).on("resize", MenuWithMore.resizeListener);
        $(document).on("turbolinks:before-cache", function() {
          MenuWithMore.destroy();
        });
      }
    }
  }

  Ornament.registerComponent("MenuWithMore", MenuWithMore);

}(document, window, jQuery));
