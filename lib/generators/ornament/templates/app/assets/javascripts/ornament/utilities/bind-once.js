(function (document, window, Ornament, Utils) {
  "use strict";

  // Bind-once function with clean unbinding on page leave and
  // turbolinks travel 
  // Ornament.bind(button, "click", onButtonClick);

  Ornament.U.bindOnce = function(target, events, func) {
    events.split(" ").map(function(event){
      // Unbind if already bound to prevent multiple 
      // bindings of the same function 
      target.removeEventListener(event, func);
    
      // Bind event to the target
      target.addEventListener(event, func);
    
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