(function (document, window, Ornament, Utils) {
  "use strict";

  Ornament.triggerEvent = function(element, eventName) {
    var event = document.createEvent('Event');
    event.initEvent(eventName, true, true); // can bubble, can be cancelled
    element.dispatchEvent(event);
  }

}(document, window, Ornament, Ornament.Utilities));