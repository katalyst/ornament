(function (document, window, O, U) {  
  "use strict";

  // Expose to the global components namespace
  var Navigation = {

    keycodes: Ornament.U.keyCodes,

    bindParentFunctions: function($node) {
      var $parent = $node.closest(".has-children");
      var $pane = $parent.querySelector("[data-toggle]");
      if(!$pane) {
        return;
      }

      // Get all tabbable elements
      var $allActions = $pane.querySelectorAll("a, button");
      const level = $node.getAttribute("data-navigation-level") || "1";

      // When toggling parent links, focus on child menu, update titles
      Ornament.U.bindOnce($node, "ornament:toggle:toggled-on", function(){
        $allActions[0].focus();
        $node.setAttribute("title", "Close menu");
      });

      // Update title of buttons
      Ornament.U.bindOnce($node, "ornament:toggle:toggled-off", function(){
        $node.setAttribute("title", "Open menu");
      });

      // On keydown of parent element
      Ornament.U.bindOnce($node, "keydown", function(event){
        const openKey = level === "1" ? Navigation.keycodes.down : Navigation.keycodes.right;
        
        // Down = open menu
        if(event.keyCode === openKey) {
          event.preventDefault();

          // Close all other menus and open this on
          var $parentMenu = $parent.closest("ul");
          var $others = $parentMenu.querySelectorAll("[data-toggle-anchor]");
          $others.forEach(function($other){
            if($other === $node) {
              return;
            }
            Ornament.triggerEvent($other, "ornament:toggle:toggle-off");
          });

          // Toggle this one on
          if($node.hasAttribute("data-toggle-anchor")) {
            Ornament.triggerEvent($node, "ornament:toggle:toggle-on");
          } else {
            Ornament.triggerEvent($node.parentElement.querySelector("[data-toggle-anchor]"), "ornament:toggle:toggle-on");
          }
        }

        // Up = open menu
        // Esc = close menu
        const closeKeys = [Navigation.keycodes.up, Navigation.keycodes.left, Navigation.keycodes.esc];
        if(closeKeys.indexOf(event.keyCode) > -1) {
          
          const closeKeyRequired = level === "1" ? Navigation.keycodes.up : Navigation.keycodes.left;
          if(event.keyCode === closeKeyRequired) {
            event.preventDefault();
            if($node.hasAttribute("data-toggle-anchor")) {
              Ornament.triggerEvent($node, "ornament:toggle:toggle-off");
            } else {
              Ornament.triggerEvent($node.parentElement.querySelector("[data-toggle-anchor]"), "ornament:toggle:toggle-off");
            }
          }
        }
      });
    },

    bindItemFunctions: function($node) {
      var $menuContainer = $node.closest(".simple-navigation--nested");
      var $parentAnchor = $menuContainer.parentElement.querySelector("[data-toggle-anchor]");
      var $listItem = $node.closest("li"); // li
      var $list = $listItem.closest("ul"); // ul
      const level = $node.getAttribute("data-navigation-level") || "1";
      var $selectableItems = $list.querySelectorAll("button[data-navigation-level='" + level + "'], a[data-navigation-level='" + level + "']");

      Ornament.U.bindOnce($node, "keydown", function(event){

        // Down = next list item, or first list item if last
        if(event.keyCode === Navigation.keycodes.down) {
          event.preventDefault();
          // Select next element if button (split-parent)
          if($node.nextElementSibling && $node.nextElementSibling.nodeName.toLowerCase() === "button") {
            $node.nextElementSibling.focus();
          // Select next element a or button
          } else if($listItem.nextElementSibling) {
            $listItem.nextElementSibling.querySelector("a, button").focus();
          // Select item #1
          } else {
            $selectableItems[0].focus();
          }
        }

        // Up - previous list item, or last item if first
        if(event.keyCode === Navigation.keycodes.up) {
          event.preventDefault();
          const previousListItem = $listItem.previousElementSibling;
          const previousNode = $node.previousElementSibling;
          // Select link of a split-parent
          if(previousNode && previousNode.nodeName.toLowerCase() === "a") {
            previousNode.focus();
          } else if(previousListItem) {
            // Select button of a split-parent
            if(previousListItem.hasAttribute("data-split-icon-parent")) {
              previousListItem.querySelector("button").focus();
            // Select previous list item
            } else {
              previousListItem.querySelector("button, a").focus();
            }
          // Select last item in list
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