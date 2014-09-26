/*jslint browser: true, indent: 2, todo: true, unparam: true */
/*global jQuery,Ornament /*/

(function (document, window, $) {

  "use strict";

  $(document).on("ornament:refresh", function () {

    // Add classes to parent navigation elements
    $(".navigation-primary").find("ul ul").each(function(){
      var $children = $(this);
      $children.parent().addClass("has-children");
    });

  });

}(document, window, jQuery));