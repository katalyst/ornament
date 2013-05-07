//= require jquery.tipsy

$(function(){

  // MINI TOOLTIPS

  $("[data-tooltip]").tipsy({
    title: "data-tooltip",
    gravity: $.fn.tipsy.autoNS
  });

  // MEGA TOOLTIPS
  $(".tooltip-mega--anchor").each(function(){

    var $anchor = $(this),
        // get tooltip id
        $tooltip = $("#"+$anchor.data("tooltip-id")),
        // get position setting of tooltip (top, bottom, left, right)
        tooltipPosition = $anchor.data("tooltip-position"),
        // get tooltip dimensions
        tooltipHeight = $tooltip.outerHeight(),
        tooltipWidth = $tooltip.outerWidth(),
        // get width and height of anchor
        anchorWidth = $anchor.outerWidth(),
        anchorHeight = $anchor.outerHeight(),
        // create dummy variables for tooltips new position
        newTop = "auto",
        newRight = "auto",
        newBottom = "auto",
        newLeft = "auto";

    // hide tooltip by default
    $tooltip.hide();

    // move tooltip in to anchor
    $tooltip.prependTo($anchor);

    switch(tooltipPosition){
      case "bottom":
        newTop = "100%",
        newLeft = -(tooltipWidth / 2) + (anchorWidth / 2);
        break;

      case "left":
        newRight = "100%",
        newTop = -(tooltipHeight / 2) + (anchorHeight / 2);
        break;

      case "right":
        newTop = -(tooltipHeight / 2) + (anchorHeight / 2);
        newLeft = "100%";
        break;

      // (top is default)
      default:
        newBottom = "100%";
        newLeft = -(tooltipWidth / 2) + (anchorWidth / 2);
        break;
    }

    // apply position to tooltip
    $tooltip.css({
      "top": newTop,
      "right": newRight,
      "bottom": newBottom,
      "left": newLeft
    });

    // click on anchor to toggle visibility of tooltip
    $anchor.click(function(){
      $tooltip.toggle();
    });

  });

});