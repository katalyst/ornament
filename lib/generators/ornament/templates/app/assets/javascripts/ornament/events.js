(function (document, window, Ornament, Utils) {
  "use strict";

  Ornament.triggerEvent = function(element, eventName, canBubble, canBeCancelled) {
    canBubble = canBubble || false;
    canBeCancelled = true;
    var event = document.createEvent('Event');
    event.initEvent(eventName, canBubble, canBeCancelled);
    element.dispatchEvent(event);
  }

}(document, window, Ornament, Ornament.Utilities));