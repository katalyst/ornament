(function (document, window, Ornament, Utils) {
  "use strict";

  // Find data-elements, optionally with a value and optionally
  // with a scope
  // Ornament.findData("data-button") = document.querySelectorAll("[data-button]");
  // Ornament.findData("data-button", "blue") = document.querySelectorAll("[data-button='blue']")
  // Ornament.findData("data-button", "blue", $panel) = $panel.querySelectorAll("[data-button='blue']");
  Ornament.U.findData = function(selector, value, scope) {
    value = value || false;
    scope = scope || document;
    var selection = "[" + selector;
    if (value) {
      selection += "='" + value + "'";
    }
    selection += "]";
    return scope.querySelectorAll(selection);
  };

}(document, window, Ornament, Ornament.Utilities));