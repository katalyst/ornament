$(function() {

  $(".tooltip").not(".tooltip-initialized").each(function() {

    var $anchor, $outer, $inner, $content;

    $anchor = $(this);
    $outer = $('<div class="tooltip--outer"/>');
    $inner = $('<div class="tooltip--inner"/>');

    // If the link has a href, use as the content. Otherwise, use the title attribute.
    if ($anchor.attr("href") === undefined) {
      $content = $anchor.attr("title");
    } else {
      $content = $($anchor.attr("href"));
    }

    $anchor.append($outer);
    $outer.append($inner);
    $inner.append($content);

    // Hide the content.
    $outer.hide();

    // Show the content on mouse enter.
    $anchor.on("mouseenter", function() {
      $outer.show();
    });

    // Hide the content on mouse leave.
    $anchor.on("mouseleave", function() {
      $outer.hide();
    });

    // Mark the component to prevent it getting reinitialized.
    $anchor.addClass("tooltip-initialized");

  });

});
