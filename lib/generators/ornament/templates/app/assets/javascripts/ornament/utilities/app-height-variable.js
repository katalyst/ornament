// Set a variable on the page to window.innerHeight from javascript
// Why do this when we have vh units? Well mobile browsers have that
// fancy disappearing URL bar doesn't it? That URL bar doesn't count
// as part of the viewport, so 100vh when the URL bar is visible will
// be larger than the viewport. 
// Instead of using 100vh, you can use --app-height variable to
// get around this issue

// More info:
// https://stackoverflow.com/questions/37112218/css3-100vh-not-constant-in-mobile-browser

// Usage:
// height: 100vh;
// height: var(--app-height);
// OR:
// @include app-height;

(function (document, window, Ornament, Utils) {
  "use strict";

  // Update the variable when possible
  var setAppHeightVariableDelayed = function(){
    // Attempt to update variable as soon as possible
    Ornament.U.setAppHeightVariable();

    // Wait for an idle state and update variable again
    if(window.requestIdleCallback) {
      window.requestIdleCallback(Ornament.U.setAppHeightVariable);
    } else {
      setTimeout(Ornament.U.setAppHeightVariable, 16);
    }
  }

  // Update the variable to the innerHeight of the document
  Ornament.U.setAppHeightVariable = function() {
    document.documentElement.style.setProperty("--app-height", window.innerHeight + "px");
  }

  // Attach listeners to update the variable
  if(window && document && document.documentElement) {
    window.addEventListener("resize",setAppHeightVariableDelayed);
    document.addEventListener("DOMContentLoaded",setAppHeightVariableDelayed);
  }

}(document, window, Ornament, Ornament.Utilities));