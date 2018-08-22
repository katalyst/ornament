"use strict";

(function(Ornament){

  // var el = document.getElementById("sidebar");
  // Ornament.nodeIndex(el);
  Ornament.U.nodeIndex = function(elm){
    var children = elm.parentNode.children;
    for(var i = 0; i < children.length; i++ ) {
      if( children[i] == elm ) {
        return i;
      }
    }
  }

  Ornament.U.isFirstNode = function(elm) {
    return Ornament.U.nodeIndex(elm) === 0;
  }

  Ornament.U.isLastNode = function(elm) {
    var totalChildren = elm.parentNode.children.length;
    return Ornament.U.nodeIndex(elm) === totalChildren;
  }

}(Ornament));