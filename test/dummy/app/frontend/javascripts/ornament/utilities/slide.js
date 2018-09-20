(function (document, window, Ornament, Utils) {
  "use strict";

  var slideTimers = [];

  Ornament.slide = function(element, timing, direction, callback) {
    timing = timing || 300;

    // Storing overflow and hiding
    var originalOverflow = "";
    if(element.hasAttribute("data-scroll-overflow")) {
      originalOverflow = element.getAttribute("data-scroll-overflow");
    } else {
      originalOverflow = element.style.overflow;
      element.setAttribute("data-scroll-overflow", originalOverflow);
    }
    element.style.overflow = "hidden";

    var targetHeight = 0;
    var currentHeight = element.offsetHeight;
    if(direction === "down") {
      targetHeight = Ornament.U.measure(element, "height");
    }

    // Don't do anything if this element is already the target height
    if(currentHeight === targetHeight) {
      return;
    }
    
    // Figure out how many pixels to transition by calculating the total height
    // and then dividing by how long the transition should take
    // If no timing defined, just animate by 1px
    var numberOfPixelsToTransition = 1;
    if(timing) {
      var total = currentHeight > targetHeight ? currentHeight : targetHeight;
      numberOfPixelsToTransition = total / (timing / 16); // asume 60fps
    }

    // Remove this timer from the slideTimers array
    function removeTimer(){
      // Find all timers that are on the current element
      var cancelTimers = slideTimers.filter(function(timerItem){
        return timerItem.element === element;
      });
      if(cancelTimers) {
        cancelTimers.forEach(function(cancelTimer){
          // Flag them as ended in case their RAF completes, we can
          // check for the .ended flag and abort it on that end
          cancelTimer.ended = true;
          // Cancel the RAF
          cancelAnimationFrame(cancelTimer.value);
          // Remove the slide timer attribute from the element
          element.removeAttribute("data-slide-timer");
          // Remove the timer from the array
          slideTimers.splice(slideTimers.indexOf(cancelTimer), 1);
        });
      }
    }

    // Create a new object to track the animaton and attach the element
    // so we can associate the two
    var timer = {};
    timer.element = element;

    // Cancel any in-progress animations
    if(element.hasAttribute("data-slide-timer")) {
      removeTimer();
    }

    // Set up new handler
    var timerIndex = slideTimers.length + 1;
    element.setAttribute("data-slide-timer", timerIndex);
    slideTimers.push(timer);

    // The looping animation, this function gets called every ~16ms
    function animate() {
      if(currentHeight === 0) {
        element.style.display = "none";
      } else {
        element.style.display = "block";
      }

      // Don't do anything if this timer has been marked as ended
      if(timer.ended) {
        return;
      }

      // If the element has reached the target height, we can assume
      // that the animation has finished and fire off any callbacks
      if(currentHeight === targetHeight) {
        removeTimer();
        if(callback) {
          callback();
        }

      } else {

        // Get the new desired height
        if(direction === "up") {
          currentHeight = currentHeight - numberOfPixelsToTransition;
          
          // Prevent undersizing
          if(currentHeight < targetHeight) {
            currentHeight = 0;
          }
        } else {
          currentHeight = currentHeight + numberOfPixelsToTransition;

          // Prevent oversizing
          if(currentHeight > targetHeight) {
            currentHeight = targetHeight;
          }
        }

        // Animate the height of the object either up or down
        element.style.height = currentHeight + "px";

        // Loop again
        timer.value = requestAnimationFrame(animate);
      }
    }

    // Start the loop
    timer.value = requestAnimationFrame(animate);
  }

  Ornament.slideDown = function(element, timing, callback) {
    if(timing && timing == "0" || timing == 1) {
      element.style.display = "block";
      return false;
    } else {
      return Ornament.slide(element, timing, "down", callback);
    }
  }

  Ornament.slideUp = function(element, timing, callback) {
    if(timing && timing == "0" || timing == 1) {
      element.style.display = "none";
      return false;
    } else {
      return Ornament.slide(element, timing, "up", callback);
    }
  }

}(document, window, Ornament, Ornament.Utilities));