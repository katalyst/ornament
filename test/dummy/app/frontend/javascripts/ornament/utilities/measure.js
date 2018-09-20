(function (document, window, Ornament, Utils) {
  "use strict";

  // Measure a hidden element by cloning it 
  // and then returning a metric from the clone
  Ornament.U.measure = function($element, metric){

    metric = metric || "height";
    var metricSize = 0;
    
    // Clone our element
    var $clone = $element.cloneNode(true);

    // Move it off the screen
    $clone.style.position = "absolute";
    $clone.style.visibility = "hidden";
    $clone.style.display = "block";
    $clone.style.height = "auto";
    $clone.style.width = "auto";

    $element.parentNode.appendChild($clone);

    if (metric === "element") {
      metricSize = $clone;
    } else if(metric === "width") {
      metricSize = $clone.offsetWidth;
    } else if (metric === "height") {
      metricSize = $clone.offsetHeight;
    }

    $clone.parentNode.removeChild($clone);

    return metricSize;
  }

}(document, window, Ornament, Ornament.Utilities));