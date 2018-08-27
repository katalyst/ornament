"use strict";

(function(Ornament){

  Ornament.$ = {};

  // Remove element
  // Ornament.$.remove(node);
  Ornament.$.remove = function(element){
    element.parentNode.removeChild(element);
  }

  // Parent matcher
  // Ornament.$.parent(element, function(node){ return node.classList.contains(".my-class") });
  Ornament.$.parent = function(element, matcher) {
    if(matcher(element)) {
      return element;
    } else {
      if(element.parentNode) {
        return Ornament.$.parent(element.parentNode, matcher);
      } else {
        return false;
      }
    }
  }

  // Parent matcher for classes
  // Ornament.$.parentWithClass(element, ".my-class");
  Ornament.$.parentWithClass = function(element, className) {
    return Ornament.$.parent(element, function(node) {
      return node.classList.contains(className);
    });
  }

  // Parent matcher for attributes
  // Ornament.$.parentWithAttribute(element, "data-custom-attribute");
  Ornament.$.parentWithAttribute = function(element, attribute) {
    return Ornament.$.parent(element, function(node) {
      return node.hasAttribute(attribute);
    });
  }

  // Wrap element in wrapper type
  Ornament.$.wrap = function(element, nodeType) {
    var $wrapper = document.createElement(nodeType);
    element.parentElement.insertBefore($wrapper, element);
    $wrapper.appendChild(element);
    return $wrapper;
  }

  Ornament.$.wrapInner = function(element, wrapper) {
    if(typeof wrapper === "string") {
      document.createElement(wrapper);
    }
    while(element.firstChild !== wrapper) {
      return wrapper.appendChild(element.firstChild);
    }
  }

  Ornament.$.slide = function(element, timing, direction, callback) {
    timing = timing || 300;

    // Storing overflow and hiding
    var originalOverflow = "";
    if(element.hasAttribute("data-scroll-overflow")) {
      originalOverflow = element.getAttribute("data-scroll-overflow");
    } else {
      originalOverflow = element.style.overflow;
      element.setAttribute("data-scroll-overflow", originalOverflow);
    }
    element.style.overflow = "hidden";

    var options = {
      easing: "ease-in",
      duration: timing,
      iterations: 1,
      fill: "forwards"
    };

    // Up variations
    if(direction === "up") {
      var keyframes = [
        { maxHeight: element.offsetHeight + "px" },
        { maxHeight: "0px" }
      ]

    // Down variations
    } else {
      var originalHeight = Ornament.U.measure(element, "height");
      var keyframes = [
        { maxHeight: "0px" },
        { maxHeight: originalHeight + "px" }
      ];
    }

    var animation = element.animate(keyframes, options);
    animation.onfinish = function(){
      if(direction === "down") {
        element.style.overflow = originalOverflow;
      }
      if(callback) {
        callback();
      }
    }
    return animation;
  }

  Ornament.$.slideDown = function(element, timing, callback) {
    if(Ornament.features.webanimation) {
      return Ornament.$.slide(element, timing, "down", callback);
    } else {
      element.style.display = "block";
      return false;
    }
  }

  Ornament.$.slideUp = function(element, timing, callback) {
    if(Ornament.features.webanimation) {
      return Ornament.$.slide(element, timing, "up", callback);
    } else {
      element.style.display = "none";
      return false;
    }
  }

}(Ornament));