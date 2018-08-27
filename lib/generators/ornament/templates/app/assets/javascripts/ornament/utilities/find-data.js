"use strict";

// Find data-elements, optionally with a value and optionally
// with a scope
// Ornament.findData("data-button") = document.querySelectorAll("[data-button]");
// Ornament.findData("data-button", "blue") = document.querySelectorAll("[data-button='blue']")
// Ornament.findData("data-button", "blue", $panel) = $panel.querySelectorAll("[data-button='blue']");
Ornament.U.findData = function(selector, value, scope, jquery) {
  value = value || false;
  jquery = jquery || false;
  if(!jquery) {
    scope = scope || document;
  }
  var selection = "[" + selector;
  if (value) {
    selection += "='" + value + "'";
  }
  selection += "]";
  if (jquery) {
    if (scope) {
      return scope.find(selection);
    } else {
      return $(selection);
    }
  } else {
    return scope.querySelectorAll(selection);
  }
};

//
// Ornament.find$Data("data-button") = $("[data-button]");
// Ornament.find$Data("data-button", "blue") = $("[data-button='blue']")
// Ornament.find$Data("data-button", "blue", $panel) = $panel.find("[data-button='blue']");
Ornament.U.find$Data = function(selector, value, scope) {
  return Ornament.U.findData(selector, value, scope, true);
}