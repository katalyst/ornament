/*jslint browser: true, indent: 2, todo: true, unparam: true */
/*global jQuery,Ornament */

(function (document, window, $) {

  "use strict";

  // TODO
  // * Middle arrow position variants
  // * Changing default position on a case-by-case basis
  // * Fix flickering when moving mouse fast
  // * Responsive considerations
  // * HoverIntent option

  $(document).on("ornament:refresh", function () {

    // settings
    var repositionOnEdge  = true;
    var defaultPosition   = "right top";
    var followMouse       = false;
    var toggleTooltips    = false;
    var $tooltipAnchors   = $("[data-tooltip]");

    // positioning offsets/gutters (eg. 10px from edge of screen)
    var offsetTop         = 10;
    var offsetLeft        = 10;
    var offsetRight       = 10;
    var offsetBottom      = 10;

    // Calculate everything and position the tooltip in the appropriate place
    var positionTooltip = function($tooltip, $anchor, e){
      var mousePos = false || e;
      var positionTo = defaultPosition;
      var positionLeft = 0;
      var positionTop = 0;

      var tooltipHeight = $tooltip.find(".tooltip--inner").outerHeight();
      var tooltipWidth = $tooltip.find(".tooltip--inner").outerWidth();

      var anchorLeft = $anchor.offset().left;
      var anchorTop = $anchor.offset().top;
      var anchorRight = $anchor.offset().left + $anchor.outerWidth();
      var anchorBottom = $anchor.offset().top + $anchor.outerHeight();

      // replace anchor positioning with mouse position if required
      if(mousePos) {
        var anchorLeft = mousePos.pageX - offsetLeft;
        var anchorRight = mousePos.pageX + offsetRight;
        var anchorTop = mousePos.pageY - offsetTop;
        var anchorBottom = mousePos.pageY + offsetBottom;
      }

      var anchorTopRelativeToViewPort = anchorTop - $(document).scrollTop();
      var anchorTopRelativeToViewPortAndTooltip = anchorTopRelativeToViewPort + tooltipHeight;

      var anchorLeftAndTooltip = anchorLeft - tooltipWidth;
      var anchorRightAndTooltip = anchorRight + tooltipWidth;
      var anchorTopAndTooltip = anchorTop + tooltipHeight;

      var windowWidth = $(window).innerWidth() - offsetLeft - offsetRight;
      var windowHeight = $(window).innerHeight() - offsetTop - offsetBottom;

      var positionClasses = "top right left bottom";
      var positionTooltip = defaultPosition.split(" ")[0];
      var positionArrow   = defaultPosition.split(" ")[1];

      // check what available space there is and update the positionTo variable
      if(repositionOnEdge) {

        // not enough room on right, not enough room on bottom
        if( anchorRightAndTooltip > windowWidth && anchorTopRelativeToViewPortAndTooltip > windowHeight ) {
          positionTo = "left bottom";

        // not enough room on right, enough room on bottom
        } else if ( anchorRightAndTooltip > windowWidth && anchorTopRelativeToViewPortAndTooltip < windowHeight ) {
          positionTo = "left top";

        // enough room on right, not enough room on bottom
        } else if ( anchorRightAndTooltip < windowWidth && anchorTopRelativeToViewPortAndTooltip > windowHeight ) {
          positionTo = "right bottom";
        }

      }

      // check the positionTo variable and set where the tooltip needs to be
      switch(positionTo) {

        case "left top":
          positionLeft = anchorLeft - tooltipWidth;
          positionTop = anchorTop;
          break;

        case "left bottom":
          positionLeft = anchorLeft - tooltipWidth;
          positionTop = anchorBottom - tooltipHeight;
          break;

        case "right bottom":
          positionLeft = anchorRight;
          positionTop = anchorBottom - tooltipHeight;
          break;

        default:
          // top right
          positionLeft = anchorRight;
          positionTop = anchorTop;
          break;
      }

      // update classes on the tooltip for styling purposes
      $tooltip.removeClass(positionClasses).addClass(positionTo);

      // finally, position the tooltip
      $tooltip.css({
        left: positionLeft,
        top:  positionTop
      });
    }

    // General "show" function
    var showTooltip = function($tooltip, $anchor) {
      $("body").prepend($tooltip);
      positionTooltip($tooltip, $anchor);
    }

    // General "hide" function
    var hideTooltip = function($tooltip){
      $tooltip.remove();
    }

    // Reposition tooltips on window resize
    var repositionTooltips = function(){
      $(".tooltip--inner").each(function(){
        var $tooltip = $(this).parent();
        var thisId = $tooltip.attr("data-tooltip-from");
        var $anchor = $("[data-tooltip='"+thisId+"']");
        positionTooltip($tooltip, $anchor);
      });
    }

    // Build tooltips and attach to each tooltip anchor
    $tooltipAnchors.each(function (i) {

      var $anchor, $wrapper, $outer, $inner, $arrow, $content, $text;

      $anchor = $(this);
      $wrapper = $('<span class="tooltip--wrapper" />');
      $outer = $('<div class="tooltip--outer" data-tooltip-from="'+$anchor.attr("data-tooltip")+'" />');
      $inner = $('<div class="tooltip--inner"/>');
      $arrow = $('<div class="tooltip--arrow"/>');
      $content = $('<div class="tooltip--content"/>');
      $text = $("[data-tooltip-for='" + $(this).attr("data-tooltip") + "']").html();

      // Put all the parts together.
      $wrapper.append($outer);
      $outer.append($inner);
      $inner.append($arrow);
      $inner.append($content);
      $content.append($text);

      // Reposition tooltip to mouse if required
      if( followMouse || $anchor.is("[data-tooltip-follow]") ) {
        $anchor.on("mousemove", function(e){
          positionTooltip($outer, $anchor, e);
        });
      }

      // Show/Hide tooltips
      if( toggleTooltips || $anchor.is("[data-tooltip-toggle]") ) {

        // Toggle on click
        $anchor.on("click", function(e) {
          e.preventDefault();
          if($inner.is(":visible")) {
            hideTooltip($outer);
          } else {
            showTooltip($outer, $anchor);
          }
        });

      } else {

        // Toggle on hover
        $anchor.hover(function(){
          showTooltip($outer, $anchor);
        }, function(){
          hideTooltip($outer);
        });

      }

    });

    // Window resize functions
    $(window).on("resize", function(){
      repositionTooltips();
    });

  });

}(document, window, jQuery));