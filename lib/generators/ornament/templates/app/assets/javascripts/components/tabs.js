/*jslint browser: true, indent: 2, todo: true, unparam: true */
/*global jQuery,Ornament */

(function (document, window, $) {

  "use strict";

  $(document).on("ornament:refresh", function () {

    var activeClass      = "tabs--pane__active";
    var tabActiveClass   = "tabs--link__active";
    var tabLinksClass    = ".tabs--link";
    var $tabs            = $(".tabs");

    var loadTab = function($tabset, pane){
      var $anchor  = $tabset.find("[data-tab='"+pane+"']");
      var $anchors = $anchor.parent("li").siblings("li").children("a").removeClass(tabActiveClass);
      var $pane    = $tabset.find("[data-tab-for='"+pane+"']");
      var $panes   = $tabset.find(".tabs--pane");

      $panes.removeClass(activeClass);
      $pane.addClass(activeClass);
      $anchors.removeClass(tabActiveClass);
      $anchor.addClass(tabActiveClass);
    }

    // Dehash our hash (#tab = tab)
    var deHash = function(hash) {
      return hash.substr(1,hash.length);
    }

    // Check for hash for deeplinking
    var currentHash = document.location.hash;

    $tabs.each(function(){
      var $tabset = $(this);

      // Only load if there is a hash, and there is a tab that exists that matches
      if(currentHash && $tabset.find(".tabs--pane[data-tab-for='" + deHash(currentHash) + "']").length ) {
        loadTab($tabset, deHash(currentHash));
      } else {
        // load first tab
        var pane = $tabset.find("[data-tab]").first().attr("data-tab");
        loadTab($tabset, pane);
      }
    });

    // Clicking tab links
    $(document).on("click", tabLinksClass, function (e) {

      e.preventDefault();

      var $anchor = $(this);
      var pane    = $anchor.attr("data-tab");
      var $tabset = $anchor.closest(".tabs");

      if( $tabset.is("[data-tabs-deeplink]") ) {
        document.location.hash = pane;
      }

      loadTab($tabset, pane);

    });

    // Clicking on external tab links
    $(document).on("click", "[data-tab-link]", function (e) {

      e.preventDefault();

      var $anchor = $(this);
      var pane    = $anchor.attr("data-tab-link");
      var $pane   = $("[data-tab-for='"+pane+"']");
      var $tabset = $pane.closest(".tabs");

      loadTab($tabset, pane);

    });
  });

}(document, window, jQuery));
