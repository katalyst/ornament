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
      const level = $node.getAttribute("data-navigation-level") || "1";

      // When toggling parent links, focus on child menu
      Ornament.U.bindOnce($node, "ornament:toggle:toggled-on", function(){
        $allActions[0].focus();
      });

      // On keydown of parent element
      Ornament.U.bindOnce($node, "keydown", function(event){
        const openKey = level === "1" ? Navigation.keycodes.down : Navigation.keycodes.right;
        
        // Down = open menu
        if(event.keyCode === openKey) {
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
        const closeKeys = [Navigation.keycodes.up, Navigation.keycodes.left, Navigation.keycodes.esc];
        if(closeKeys.indexOf(event.keyCode) > -1) {
          if($node.hasAttribute("data-toggle-anchor")) {
            const closeKeyRequired = level === "1" ? Navigation.keycodes.up : Navigation.keycodes.left;
            if(event.keyCode === closeKeyRequired) {
              event.preventDefault();
              Ornament.triggerEvent($node, "ornament:toggle:toggle-off");
            }
          }
        }
      });
    },

    bindItemFunctions: function($node) {
      var $menuContainer = $node.parentElement.parentElement.hasAttribute("data-toggle") ? $node.parentElement.parentElement : $node.parentElement.parentElement.parentElement;
      var $parentAnchor = $menuContainer.parentElement.querySelector("[data-toggle-anchor]");
      var $listItem = $node.parentElement; // li
      var $list = $listItem.parentElement; // ul
      const level = $node.getAttribute("data-navigation-level") || "1";
      var $selectableItems = $list.querySelectorAll("button[data-navigation-level='" + level + "'], a[data-navigation-level='" + level + "']");

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
        if(event.keyCode === Navigation.keycodes.esc || level === "3" && event.keyCode === Navigation.keycodes.left) {
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