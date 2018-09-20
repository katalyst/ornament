(function (document, window, Orn, Utils) {
  "use strict";

  var Dismiss = {

    selectors: {
      dismiss: "data-dismiss",
    },

    time: 10, // seconds

    // Start counting down to dismiss
    start: function($item) {
      var time = $item.getAttribute(Dismiss.selectors.dismiss) || Dismiss.time;
      Ornament.triggerEvent($item, "ornament:dismiss:started");
      setTimeout(function(){
        Dismiss.dismiss($item);
      }, time * 1000);
    },

    // The dismiss function
    // what happens when the timer expires
    dismiss: function($item) {
      Ornament.slideUp($item);
      Ornament.triggerEvent($item, "ornament:dismiss:dismissed");
    },

    init: function(){
      Dismiss.$items = document.querySelectorAll("[" + Dismiss.selectors.dismiss + "]");
      Dismiss.$items.forEach(function($item){
        Dismiss.start($item);
      });
    }
  }
  
  Orn.registerComponent("Dismiss", Dismiss);

}(document, window, Ornament, Ornament.Utilities));