(function (document, window, Ornament, Utils) {
  "use strict";

  Ornament.windowWidth = function(){
    return window.document.documentElement.clientWidth;
  }

  Ornament.windowHeight = function(){
    return window.document.documentElement.clientHeight;
  }

}(document, window, Ornament, Ornament.Utilities));