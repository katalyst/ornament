(function (document, window, Ornament, Utils) {
  "use strict";

  Ornament.U.isFullWidthOf = function(child, parent) {
    return child.offsetWidth === parent.offsetWidth;
  }

}(document, window, Ornament, Ornament.Utilities));