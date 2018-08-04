//= require libs/clipboard

"use strict";

(function (document, window, Ornament) {

  var Styleguide = Ornament.Styleguide = {};

  Styleguide.addCopyLinkToCodeSample = function(container, index, value) {
    var copyBtnId = 'copy-btn-' + index.toString();
    var $button = document.createElement("button");
    $button.setAttribute("class", "sg-feature--copy");
    $button.setAttribute("id", copyBtnId);
    $button.setAttribute("data-copy-code", "");
    $button.setAttribute("type", "button");
    $button.innerText = "Copy";
    var content = $(container).find("pre")[0];
    $(container).prepend($button);

    var clipboard = new ClipboardJS('#' + copyBtnId, {
      target: function(trigger) {
        return content;
      }
    });

    // Change the text of the copy button when it's clicked on
    clipboard.on('success', function(event) {
      $button.innerText = 'Copied!';
      window.setTimeout(function() {
        $button.innerText = 'Copy';
      }, 3000);
    });

    // Log errors on copy failure
    clipboard.on('error', function(event) {
        console.error('Action:', event.action);
        console.error('Trigger:', event.trigger);
    });
  }

  Styleguide.init = function(){
    // Adding version details
    $("[data-ornament-version]").text("v" + Ornament.version);

    // Adding copy links to styleguide textareas
    // Stolen from foundation's documentation 
    $('[data-styleguide-code-sample]').each(function(index, value) {
      if(Ornament.features.ie8) { return true }
      Styleguide.addCopyLinkToCodeSample(this, index, value);
    });

    // Auto-anchor H2s
    $("h2").each(function(){
      var $h2 = $(this);
      var text = Ornament.U.parameterize($h2.text());
      $h2.attr("id", text);
    });
  }

  Ornament.onLoad(function(){
    Styleguide.init();
  });

})(document, window, Ornament);