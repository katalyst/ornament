"use strict";

(function (document, window, $, Ornament) {

  // Take the SVG icons and push them to Ornament.icons
  Ornament.icons = {};

  var loadIconsFromBody = function() {
    var container = document.querySelector("[data-ornament-icons]");
    if(container) {
      Array.from(container.children).forEach(function(element){
        var name = element.getAttribute("data-ornament-icon");
        var markup = element.innerHTML;
        Ornament.icons[name] = markup;
      });
      container.remove();
    }
  }

  Ornament.onLoad(function(){
    loadIconsFromBody();
  });

}(document, window, jQuery, Ornament));