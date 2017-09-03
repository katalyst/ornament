"use strict";

// Measure a hidden element by cloning it 
// and then returning a metric from the clone
Ornament.U.measure = function($element, metric){

  metric = metric || "height";
  var metricSize = 0;
  
  // Clone our element
  var $clone = $element.clone();

  // Move it off the screen
  $clone.css({
    position: "absolute",
    visibility: "hidden",
    display: "block",
    height: "auto",
    width: "auto"
  });

  $element.after($clone);

  if (metric == "element") {
    metricSize = $clone;
  } else if(metric == "width") {
    metricSize = $clone.outerWidth();
  } else if (metric == "height") {
    metricSize = $clone.outerHeight();
  }

  $clone.remove();

  return metricSize;
}