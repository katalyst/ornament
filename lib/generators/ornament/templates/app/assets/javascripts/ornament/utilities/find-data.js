"use strict";

// Find data-elements, optionally with a value and optionally
// with a scope
// Ornament.findData("data-button") = $("[data-button]");
// Ornament.findData("data-button", "blue") = $("[data-button='blue']")
// Ornament.findData("data-button", "blue", $panel) = $panel.find("[data-button='blue']");
Ornament.U.findData = function(selector, value, scope) {
  var value = value || false;
  var selection = "[" + selector;
  if(value) {
    selection += "='" + value + "'";
  }
  selection += "]";
  if(scope) {
    return scope.find(selection);
  } else {
    return $(selection);
  }
}