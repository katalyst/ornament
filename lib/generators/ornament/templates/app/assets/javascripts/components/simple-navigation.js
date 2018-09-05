(function (document, window, O, U) {  
  "use strict";

  // Expose to the global components namespace
  var Navigation = {

    keycodes: Ornament.U.keyCodes,

    bindParentFunctions: function($node) {
      var $pane = $node.parentNode.querySelector("[data-toggle]");
      if(!$pane) {
        return;
      }

      // Get all tabbable elements
      var $allActions = $pane.querySelectorAll("a, button");

      // When toggling parent links, focus on child menu
      Ornament.U.bindOnce($node, "ornament:toggle:toggled-on", function(){
        $allActions[0].focus();
      });

      // On keydown of parent element
      Ornament.U.bindOnce($node, "keydown", function(event){
        // Down = close menu
        if(event.keyCode === Navigation.keycodes.down) {
          if($node.hasAttribute("data-toggle-anchor")) {
            event.preventDefault();

            // Close all other menus and open this on
            var $parent = $node.parentElement.parentElement;
            var $others = $parent.querySelectorAll("[data-toggle-anchor]");
            $others.forEach(function($other){
              if($other === $node) {
                return;
              }
              Ornament.triggerEvent($other, "ornament:toggle:toggle-off");
            });

            // Toggle this one on
            Ornament.triggerEvent($node, "ornament:toggle:toggle-on");
          }
        }
        // Up = open menu
        // Esc = close menu
        if(event.keyCode === Navigation.keycodes.up || event.keyCode === Navigation.keycodes.esc) {
          if($node.hasAttribute("data-toggle-anchor")) {
            if(event.keyCode === Navigation.keycodes.up) {
              event.preventDefault();
            }
            Ornament.triggerEvent($node, "ornament:toggle:toggle-off");
          }
        }
      });
    },

    bindItemFunctions: function($node) {
      var $menuContainer = $node.parentElement.parentElement.hasAttribute("data-toggle") ? $node.parentElement.parentElement : $node.parentElement.parentElement.parentElement;
      var $parentAnchor = $menuContainer.parentElement.querySelector("[data-toggle-anchor]");
      var $listItem = $node.parentElement; // li
      var $list = $listItem.parentElement; // ul
      var $selectableItems = $list.querySelectorAll("button, a");

      Ornament.U.bindOnce($node, "keydown", function(event){
        // Down = next list item, or first list item if last
        if(event.keyCode === Navigation.keycodes.down) {
          event.preventDefault();
          if($listItem.nextElementSibling) {
            $listItem.nextElementSibling.querySelector("a, button").focus();
          } else {
            $selectableItems[0].focus();
          }
        }
        // Up - previous list item, or last item if first
        if(event.keyCode === Navigation.keycodes.up) {
          event.preventDefault();
          if($listItem.previousElementSibling) {
            $listItem.previousElementSibling.querySelector("a, button").focus();
          } else {
            $selectableItems[$selectableItems.length - 1].focus();
          }
        }
        // Esc - close menu
        if(event.keyCode === Navigation.keycodes.esc) {
          if($menuContainer) {
            $parentAnchor.focus();
            Ornament.triggerEvent($menuContainer, "ornament:toggle:toggle-off");
          }
        }
      });
    },

    init: function(){
      Navigation.$navParents = Ornament.U.findData("data-navigation-parent");
      Navigation.$navItems = Ornament.U.findData("data-navigation-item");
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

  Ornament.registerComponent("SimpleNav", Navigation);
  
}(document, window, Ornament, Ornament.U));