/*jslint browser: true, indent: 2, todo: true, unparam: true */
/*global jQuery,Ornament /*/

(function (document, window, $) {

  "use strict";

  $(document).on("ornament:refresh", function () {

    // Selector
    var $moreContents = $("[data-read-more]");

    // Max height of element before "read more" becomes available
    var moreMax = 280;
    var moreText = "Keep reading..."

    // // Clone an element to get the height of it
    var getHeightOfContainer = function($element) {
      var $clone = $element.clone();
      $clone.css({
        height: "auto",
        position: "absolute",
        top: "-9999999",
        left: "-9999999"
      });
      $element.after($clone);
      var cloneHeight = $clone.outerHeight();
      $clone.remove();
      return cloneHeight;
    }

    // Reveal hidden content
    var showMore = function($moreContainer, $moreLink) {
      $moreLink.fadeOut("fast");
      $moreContainer.animate({
        height: getHeightOfContainer($moreContainer)
      }, 200);
    }

    // Set up the more container and read more link
    var initialiseMoreContainer = function($moreContent) {

      // Wrap the content in a container that we can control the size of
      $moreContent.wrapInner("<div data-read-more-container>");
      var $moreContainer = $moreContent.find("[data-read-more-container]");
      $moreContainer.height(moreMax);

      // Create a "read more" link
      var $moreLink = $("<a>").attr("href", "#").attr("data-read-more-link", "").text(moreText).wrapInner("<span />");
      $moreContent.append($moreLink);
      $moreLink.on("click", function(e){
        e.preventDefault();
        showMore($moreContainer, $moreLink);
      });
    }

    $moreContents.each(function(){
      var $moreContent = $(this);
      var contentHeight = $moreContent.outerHeight();

      if(contentHeight > moreMax) {
        initialiseMoreContainer($moreContent);
      }

    });

  });

}(document, window, jQuery));