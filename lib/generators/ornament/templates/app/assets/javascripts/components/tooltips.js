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
        tooltip_position = $anchor.data("tooltip-position"),
        // get tooltip dimensions
        tooltip_height = $tooltip.outerHeight(),
        tooltip_width = $tooltip.outerWidth(),
        // get width and height of anchor
        anchor_width = $anchor.outerWidth(),
        anchor_height = $anchor.outerHeight(),
        // create dummy variables for tooltips new position
        tooltip_new_top = "auto",
        tooltip_new_right = "auto",
        tooltip_new_bottom = "auto",
        tooltip_new_left = "auto";

    // hide tooltip by default
    $tooltip.hide();

    // move tooltip in to anchor
    $tooltip.prependTo($anchor);

    switch(tooltip_position){
      case "bottom":
        tooltip_new_top = "100%",
        tooltip_new_left = -(tooltip_width / 2) + (anchor_width / 2);
        break;

      case "left":
        tooltip_new_right = "100%",
        tooltip_new_top = -(tooltip_height / 2) + (anchor_height / 2);
        break;

      case "right":
        tooltip_new_top = -(tooltip_height / 2) + (anchor_height / 2);
        tooltip_new_left = "100%";
        break;

      // (top is default)
      default:
        tooltip_new_bottom = "100%";
        tooltip_new_left = -(tooltip_width / 2) + (anchor_width / 2);
        break;
    }

    console.log(tooltip_width/2)

    // apply position to tooltip
    $tooltip.css({
      "top": tooltip_new_top,
      "right": tooltip_new_right,
      "bottom": tooltip_new_bottom,
      "left": tooltip_new_left
    });

    // click on anchor to toggle visibility of tooltip
    $anchor.click(function(){
      $tooltip.toggle();
    });

  });

});