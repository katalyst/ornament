// =========================================================================
// Open external links in a new window 
// =========================================================================

(function (document, window, Ornament) {
  "use strict";

  var config = {
    noOpener: true,
    noFollow: true,
    trackExternalLinks: true,
    trackExternalCategory: "External Link",
    externalFileExtensionSelectors: [
      "doc",
      "docx",
      "pdf",
      "ppt",
      "pptx",
      "xls",
      "xlsx"
    ],
    externalLinkSelectors: [
      "[href^='http://']", 
      "[href^='https://']"
    ],
    internalLinkSelectors: [
      "[rel='internal']",
      "[data-internal-link]"
    ]
  }

  // Merge file extension selectors with configured external link
  // selectors 
  config.externalFileExtensionSelectors.forEach(function(selector) {
    config.externalLinkSelectors.push("[href$='." + selector + "']");
    config.externalLinkSelectors.push("[href$='." + selector.toUpperCase() + "']");
  });

  var bindExternalLink = function(node) {
    var isExternal = true;
    config.internalLinkSelectors.forEach(function(selector) {
      if(node.matches(selector)) {
        isExternal = false;
      }
    });
    if(isExternal) {
      node.setAttribute("target", "_blank");
      var rel = node.getAttribute("rel") || "";
      var updateRel = false;
      // Update rel attribute with noopener and nofollow if configured to
      if(config.noOpener && rel.indexOf("noopener") === -1) {
        rel += " noopener";
        updateRel = true;
      }
      if(config.noFollow && rel.indexOf("nofollow") === -1) {
        rel += " nofollow";
        updateRel = true;
      }
      if(updateRel) {
        node.setAttribute("rel", rel);
      }
      // Event tracking for external links
      if(config.trackExternalLinks && Ornament.Components.Analytics && Ornament.Components.Analytics.trackingType) {
        Ornament.Components.Analytics.trackLink(node);
      }
    }
  }

  // Loop over all our external links and target them for 
  // a new window 
  var init = function(){
    config.externalLinkSelectors.forEach(function(selector){
      var externalLinks = document.querySelectorAll(selector);
      for(var nodeCount = 0; nodeCount < externalLinks.length; nodeCount++) {
        bindExternalLink(externalLinks[nodeCount]);
      }
    });
  }

  // Run init onLoad, this isn't a component so it won't run automatically 
  Ornament.onLoad(init);

  // Expose to Ornament API 
  Ornament.U.ExternalLinks = {
    config: config,
    bindExternalLink: bindExternalLink,
    init: init
  }

}(document, window, Ornament, Ornament.Utilities));