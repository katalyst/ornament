(function (document, window) {
  "use strict";

  var TextLimit = {

    // Settings
    defaultLimit: 150,
    defaultType: "character", // "character" or "word"
    defaultStyle: "normal", // "normal" or "micro"

    // Selectors
    limiterSelector: "data-limiter",
    microSelector: "data-limiter-micro",
    wordSelector: "data-limiter-word",

    // Attach a limiter to a field
    createLimiter: function($field, limit, type, style) {
      limit = limit || TextLimit.defaultLimit;
      type = type || TextLimit.defaultType;
      style = style || TextLimit.defaultStyle;

      if($field.classList.contains("init")) {
        return;
      }

      var $headingCounter = document.createElement("span");
      $headingCounter.classList.add('form--field-with-count--counter');
      var $heading = document.createElement("div");
      $heading.classList.add('form--field-with-count--heading');
      var $fieldWrapper = document.createElement("div");
      $fieldWrapper.classList.add('form--field-with-count');

      if(style === "micro") {
        $fieldWrapper.classList.add("form--field-with-count__micro"); 
      } else {
        $heading.innerText = limit + " " + type + " limit";
      }

      // Add a class to differentiate textarea limiters
      if($field.nodeName.toLowerCase() === "textarea") {
        $fieldWrapper.classList.add("form--field-with-count__textarea");
      }

      $heading.appendChild($headingCounter);

      // Apply form width styling
      var formClass = $field.className;
      if(formClass && formClass.split("form--")[1]) {
        formClass = formClass.split("form--")[1].split(" ")[0];
        $fieldWrapper.classList.add("form--" + formClass);
      }

      $field.parentElement.insertBefore($fieldWrapper, $field);
      $fieldWrapper.appendChild($heading);
      $fieldWrapper.appendChild($field);
      TextLimit.limit($field, limit, $headingCounter, type, style);
      $field.classList.add("init");
    },

    // Vanilla conversion of the jQuery limit plugin
    // http://www.scriptiny.com/2012/09/jquery-input-textarea-limiter/
    limit: function($field, limit, $counter, type, style){
      style = style || "normal";
      limit = parseInt(limit);

      function setCount() {
        var value = $field.value;

        // Word count matcher
        if(type === "word") {
          value = value.trim();
          var remaining = value.split(/\s/).filter(function(word) {
            return word.length > 0;
          }).length;
          if(remaining > limit) {
            var strippedValue = $field.value.replace(/\n/, '[new_line]').split(' ').slice(0,limit).join(' ').replace('[new_line]', '\n');
            $field.value = strippedValue + " ";
            remaining = limit;
          }

        // Character count matcher
        } else {
          var remaining = $field.value.length;
          if(remaining > limit) {
            $field.value = $field.value.substr(0, limit);
            remaining = limit;
          }
        }

        if(style === "micro") {
          $counter.innerText = remaining + "/" + limit;
        } else {
          $counter.innerText = limit - remaining + " left";
        }
      }
      
      setCount();
      Ornament.U.bindOnce($field, "keyup focus", function(){
        setCount();
      });
    },

    // Init 
    init: function(){
      document.querySelectorAll("[" + TextLimit.limiterSelector + "]").forEach(function($field) {
        var limit = $field.getAttribute(TextLimit.limiterSelector);
        var style = $field.hasAttribute(TextLimit.microSelector) ? "micro" : "normal";
        var type = $field.hasAttribute(TextLimit.wordSelector) ? "word" : "character";
        TextLimit.createLimiter($field, limit, type, style);
      });
    }

  }

  Ornament.registerComponent("FormLimiter", TextLimit);

}(document, window));