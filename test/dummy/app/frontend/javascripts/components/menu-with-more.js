import "../vendor/libs/priority-nav";

(function (document, window) {
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
      var $wrapper = menu.querySelectorAll(".priority-nav__wrapper");
      $wrapper.forEach(function(el){
        el.parentNode.removeChild(el);
      })
    },

    destroy: function(){
      window.removeEventListener("resize", MenuWithMore.resizeListener);
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
        Ornament.U.bindOnce(window, "resize", MenuWithMore.resizeListener);
        Ornament.beforeTurbolinksCache(MenuWithMore.destroy);
      }
    }
  }

  Ornament.registerComponent("MenuWithMore", MenuWithMore);

}(document, window));
