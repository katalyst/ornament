"use strict";

// Bind-once function with clean unbinding on page leave and
// turbolinks travel 
// Ornament.bind(button, "click", onButtonClick);

Ornament.U.bindOnce = function(target, event, func) {

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
}