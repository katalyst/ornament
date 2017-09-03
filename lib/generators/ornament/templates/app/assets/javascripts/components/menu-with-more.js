//= require libs/priority-nav

/*jslint browser: true, indent: 2, todo: true, unparam: true */
/*global jQuery,Ornament /*/

(function (document, window, $) {

  "use strict";

  var MenuWithMore = Ornament.Components.MenuWithMore = {

    menuClass: "menu-more",
    menus: false,

    resizeListener: function(){
      if(priorityNav.doesItFit) {
        priorityNav.doesItFit(MenuWithMore.menus);
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
      $(menu).find(".priority-nav__wrapper").remove();
    },

    destroy: function(){
      $(window).off("resize", MenuWithMore.resizeListener);
      $.each(MenuWithMore.menus, function(){
        MenuWithMore.destroyMenu(this);
      });
    },

    init: function(){
      MenuWithMore.menus = document.querySelector("." + MenuWithMore.menuClass);
      if(MenuWithMore.menus) {
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

  $(document).on("ornament:refresh", function () {
    if(Ornament.features.ie8) {
      return false;
    }
    MenuWithMore.init();
  });

}(document, window, jQuery));
