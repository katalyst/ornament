import tippy from "tippy.js";

(function (document, window) {
  "use strict";

  var Tooltip = {

    selectors: {
      tooltip: "data-tooltip"
    },

    init: function(){
      var $tooltips = document.querySelectorAll("[" + Tooltip.selectors.tooltip + "]");
      if($tooltips) {
        tippy($tooltips, {
          //
        })
      }
    }
  }

  Ornament.registerComponent("Tooltip", Tooltip);

}(document, window));