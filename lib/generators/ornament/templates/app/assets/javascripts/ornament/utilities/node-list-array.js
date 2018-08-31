(function (document, window, Ornament, Utils) {
  "use strict";

  Ornament.U.nodeListArray = function(nodeList){
    return Array.prototype.slice.call(nodeList);
  }

}(document, window, Ornament, Ornament.Utilities));