/*jslint browser: true, indent: 2, todo: true, unparam: true */
/*global jQuery,Ornament */

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

    document.location.hash = $link.attr("href");

    $panes.removeClass("tabs--pane-active").addClass("tabs--pane-inactive");
    $pane.removeClass("tabs--pane-inactive").addClass("tabs--pane-active");
    $tab.children("a").addClass("tabs--link-active").parent("li").siblings().children("a").removeClass("tabs--link-active");
  });

  $(document).on("ornament:refresh", function () {

    $(".tabs").not(".tabs--initialized").each(function () {

      var $thisTabset = $(this);
      var currentHash = document.location.hash;
      if( currentHash && $thisTabset.find("[data-tab-id='"+ currentHash.substr(1, currentHash.length) +"']").length > 0 ) {
        $thisTabset.find("[href='"+ currentHash +"']").trigger("click");
      } else {
        $thisTabset.find(".tabs--link").first().trigger("click");
      }

    }).addClass("tabs--initialized");

  });

}(document, window, jQuery));
