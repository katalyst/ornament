(function (document, window, Ornament, Utils) {
  "use strict";

  // Passive event listener tests
  // https://github.com/WICG/EventListenerOptions/blob/gh-pages/explainer.md#feature-detection
  Ornament.supportsPassiveEvents = false;
  try {
    var opts = Object.defineProperty({}, 'passive', {
      get: function(){
        Ornament.supportsPassiveEvents = true;
      }
    });
    window.addEventListener("testPassive", null, opts);
    window.removeEventListener("testPassive", null, opts);
  } catch(e) {}

  // Bind-once function with clean unbinding on page leave and
  // turbolinks travel 
  // Ornament.U.bindOnce(button, "click", onButtonClick);
  // You can support Chrome's passive event listeners with
  // Ornament.U.bindOnce(button, "click", onButtonClick, { passive: true });
  // Passive support is detected and gracefully falls back, unlike
  // native functionality of addEventListener

  Ornament.U.bindOnce = function(target, events, func, opts) {
    events.split(" ").map(function(event){
      // Unbind if already bound to prevent multiple 
      // bindings of the same function 
      target.removeEventListener(event, func);
    
      // Bind event to the target
      if(Ornament.supportsPassiveEvents) {
        target.addEventListener(event, func, opts);
      } else {
        target.addEventListener(event, func, opts);
      }
    
      // Clean up the event listener after page unload
      window.onunload = function(){
        target.removeEventListener(event, func);
      }
    
      // Clean up the event listener after turbolinks navigation 
      if(Ornament.features.turbolinks) {
        document.addEventListener("turbolinks:click", function(){
          target.removeEventListener(event, func);
        });
      }
    });
  }

  // Ornament.U.delegateBindOnce(document, "[data-my-target]", "click", doTheThing);
  Ornament.U.delegateBindOnce = function(wrapper, target, events, func, opposite) {
    opposite = opposite || false;
    var delegatedEvent = function(event){
      var contained = false;

      // Selector matching
      if(typeof target === "string") {
        if(event.target.matches(target)) {
          contained = true;
        }

      // Nodelist matching
      } else if(NodeList.prototype.isPrototypeOf(target)) {
        target.forEach(function($node) {
          if($node.contains(event.target)) {
            contained = true;
          }
        });

      // Single element matching
      } else {
        if(target.contains(event.target)) {
          contained = true;
        }
      }

      // Opposite matching incase you would rather delegate events to everything
      // but a particular element (eg. close when clicking away)
      if(opposite) {
        contained = !contained;
      }

      if(contained) {
        func.call(event);
      }
    }
    Ornament.U.bindOnce(wrapper, events, delegatedEvent);
  }

}(document, window, Ornament, Ornament.Utilities));