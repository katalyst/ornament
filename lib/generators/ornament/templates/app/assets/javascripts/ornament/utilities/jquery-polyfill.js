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

  Ornament.$.slideDown = function(element, timing, callback) {
    timing = timing || 200;

  }

}(Ornament));