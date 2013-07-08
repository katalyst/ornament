/*jslint browser: true, indent: 2, todo: true, unparam: true */
/*global jQuery*/

(function (document, window, $) {

  "use strict";

  $(document).on("click", ".tabs--link", function (e) {
    e.preventDefault();

    var $link, index, $tabs, $panes, $pane, $tab;

    $link = $(this);
    $tab = $link.parent("li");
    index = $tab.index();
    $tabs = $tab.closest(".tabs");
    $panes = $tabs.find(".tabs--pane");
    $pane = $panes.eq(index);

    $panes.removeClass("tabs--pane-active").addClass("tabs--pane-inactive");
    $pane.removeClass("tabs--pane-inactive").addClass("tabs--pane-active");
    $tab.children("a").addClass("tabs--link-active").parent("li").siblings().children("a").removeClass("tabs--link-active");
  });

  $(document).on("ornament:refresh", function () {
    $(".tabs").not(".tabs--initialized").each(function () {
      $(this).find(".tabs--link").first().trigger("click");
    }).addClass("tabs--initialized");
  });

}(document, window, jQuery));
