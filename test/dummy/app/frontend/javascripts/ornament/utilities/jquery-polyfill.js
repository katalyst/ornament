(function (document, window, Ornament, Utils) {
  "use strict";
  
  Ornament.$ = {};
  // Ornament.$ = function(query){
  //   return document.querySelectorAll(query);
  // }

  // Get the index of an element
  Ornament.$.nodeIndex = function(elm){
    var children = elm.parentNode.children;
    for(var i = 0; i < children.length; i++ ) {
      if( children[i] == elm ) {
        return i;
      }
    }
  }

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
      return node.classList && node.classList.contains(className);
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

}(document, window, Ornament, Ornament.Utilities));