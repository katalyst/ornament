/*jslint browser: true, indent: 2, todo: true, unparam: true */
/*global jQuery,Ornament /*/

(function (document, window, O, U) {
  
  "use strict";

  $(document).on("ornament:refresh", function () {

    // Expose to the global components namespace
    var Navigation = Ornament.Components.SimpleNav = {

      keycodes: {
        down: 40,
        up: 38,
        esc: 27
      },

      bindParentFunctions: function($node) {
        var $$node = $($node);
        Ornament.U.bindOnce($node, "keydown", function(event){
          // When toggling parent links, focus on child menu
          $$node.on("ornament:toggle:toggled-on", function(){
            $$node.next("[data-toggle]").find("a, button").first().focus();
          });
          // Down = close menu
          if(event.keyCode === Navigation.keycodes.down) {
            if($node.hasAttribute("data-toggle-anchor")) {
              event.preventDefault();
              // Close all other menus and open this one
              $$node.closest("ul").find("[data-toggle-anchor]").not($$node).trigger("ornament:toggle:toggle-off");
              $$node.trigger("ornament:toggle:toggle-on");
            }
          }
          // Up = open menu
          // Esc = close menu
          if(event.keyCode === Navigation.keycodes.up || event.keyCode === Navigation.keycodes.esc) {
            if($node.hasAttribute("data-toggle-anchor")) {
              if(event.keyCode === Navigation.keycodes.up) {
                event.preventDefault();
              }
              $$node.trigger("ornament:toggle:toggle-off");
            }
          }
        });
      },

      bindItemFunctions: function($node) {
        var $$node = $($node);
        var $menuContainer = $$node.closest("[data-toggle]");
        var $parentAnchor = $menuContainer.prev("[data-toggle-anchor]");
        var $listItem = $$node.parent("li");
        var $list = $listItem.parent("ul");

        Ornament.U.bindOnce($node, "keydown", function(event){
          // Down = next list item, or first list item if last
          if(event.keyCode === Navigation.keycodes.down) {
            event.preventDefault();
            if($listItem.next("li").length) {
              $listItem.next().find("a, button").focus();
            } else {
              $list.children("li").first().find("a, button").focus();
            }
          }
          // Up - previous list item, or last item if first
          if(event.keyCode === Navigation.keycodes.up) {
            event.preventDefault();
            if($listItem.prev("li").length) {
              $listItem.prev().find("a, button").focus();
            } else {
              $list.children("li").last().find("a, button").focus();
            }
          }
          // Esc - close menu
          if(event.keyCode === Navigation.keycodes.esc) {
            if($menuContainer.length) {
              $parentAnchor.focus();
              $menuContainer.trigger("ornament:toggle:toggle-off");
            }
          }
        });
      },

      init: function(){
        Navigation.$navParents = Ornament.U.findData("data-navigation-parent", false, false, false);
        Navigation.$navItems = Ornament.U.findData("data-navigation-item", false, false, false);
        if(Navigation.$navParents.length) {
          Navigation.$navParents.forEach(function($node){
            Navigation.bindParentFunctions($node);
          });
        }
        if(Navigation.$navItems.length) {
          Navigation.$navItems.forEach(function($node){
            Navigation.bindItemFunctions($node);
          });
        }
      }
    }

    Navigation.init();

  });
  
}(document, window, Ornament, Ornament.U));