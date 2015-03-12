/*jslint browser: true, indent: 2, todo: true, unparam: true */
/*global jQuery,Ornament /*/

(function (document, window, $) {

  "use strict";

  $(document).on("ornament:refresh", function () {

    var $toggleAnchors = $("[data-toggle-anchor]");
    var $toggles = $("[data-toggle]");
    var toggleOnClass = "active";
    var headerBreakpoint = Ornament.headerBreakpoint;

    var toggleOn = function($toggleAnchor, $toggleContent) {
      var toggleId = $toggleAnchor.attr("data-toggle-anchor");
      var $toggleAnchors = $("[data-toggle-anchor="+toggleId+"]");

      // Toggle a visible class
      $toggleAnchors.addClass(toggleOnClass);

      // Toggle sliding
      $toggleContent.slideDown(function(){
        // Reconform
        // $(document).trigger("ornament:column-conform");
      });

      if($toggleAnchor.attr("data-toggle-type") == "book-children") {
        $toggleAnchors.text("Hide supporting publications");
      }
    }

    var toggleOff = function($toggleAnchor, $toggleContent) {
      var toggleId = $toggleAnchor.attr("data-toggle-anchor");
      var $toggleAnchors = $("[data-toggle-anchor="+toggleId+"]");

      // Toggle visible class
      $toggleAnchors.removeClass(toggleOnClass);

      // Slide content
      $toggleContent.slideUp(200);

      // Update text
      if($toggleAnchor.attr("data-toggle-type") == "book-children") {
        $toggleAnchors.text("View supporting publications")
      }

      // Scroll if needed
      if($toggleAnchor.is("[data-toggle-scroll]")) {
        // Find the master toggle and find it's offset top
        var $toggleMaster = $toggleAnchors.filter("[data-toggle-scroll-master]");
        var masterOffsetTop = $toggleMaster.offset().top;

        // Account for sticky header
        masterOffsetTop = masterOffsetTop - Ornament.stickyHeightComparison(masterOffsetTop);

        // Check if user has scrolled past the master element
        // we don't want the user to be scrolled down, only up
        var scrollTop = $(document).scrollTop();
        if(scrollTop > masterOffsetTop) {
          // Animate up
          $("html,body").animate({
            scrollTop: masterOffsetTop
          }, 200);
        }
      }
    }

    var toggle = function($toggleAnchor, $toggleContent) {

      if($toggleContent.is(":animated")) {
        return false;
      }

      if($toggleAnchor.hasClass(toggleOnClass)) {
        toggleOff($toggleAnchor, $toggleContent);
      } else {
        toggleOn($toggleAnchor, $toggleContent);
      }

    }

    // Hid all toggles on page
    var hideAllToggles = function(){
      $toggles.hide();
    }

    // Hide all toggles by default
    hideAllToggles();

    // Clicking on anchors
    $toggleAnchors.on("click", function(e){
      e.preventDefault();
      var $toggleAnchor = $(this);
      var toggleId = $toggleAnchor.attr("data-toggle-anchor");
      var $toggleContent = $("[data-toggle=" + toggleId + "]");
      toggle($toggleAnchor, $toggleContent);
    });

  });

}(document, window, jQuery));