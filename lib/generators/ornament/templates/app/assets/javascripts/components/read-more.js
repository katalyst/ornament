/*jslint browser: true, indent: 2, todo: true, unparam: true */
/*global jQuery,Ornament /*/

(function (document, window, $) {

  "use strict";

  $(document).on("ornament:refresh", function () {

    // Selector
    var $moreContents = $("[data-read-more]");

    // Max height of element before "read more" becomes available
    var moreMax = 280;
    var moreText = "Read more"

    var getMoreMaxHeight = function($moreContent) {
      if($moreContent.is("[data-read-more-height]")) {
        return parseInt($moreContent.attr("data-read-more-height"));
      } else {
        return moreMax;
      }
    }

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

    // Hide hidden content again
    var showLess = function($moreContainer, $moreLink, $lessLink) {
      $moreLink.fadeIn("fast");
      $moreContainer.animate({
        height: getMoreMaxHeight($moreContainer.parent("[data-read-more]"))
      }, 200);
      $lessLink.animate({
        opacity: 0
      }, 200);
    }

    // Reveal hidden content
    var showMore = function($moreContainer, $moreLink, $lessLink) {
      $lessLink = $lessLink || false;
      $moreLink.fadeOut("fast");
      $moreContainer.animate({
        height: getHeightOfContainer($moreContainer)
      }, 200);
      if($lessLink) {
        $lessLink.animate({
          opacity: 1
        }, 200);
      }
    }

    // Set up the more container and read more link
    var initialiseMoreContainer = function($moreContent) {
      var shouldShowLess = false;
      var moreMaxHeight = getMoreMaxHeight($moreContent);

      // Wrap the content in a container that we can control the size of
      $moreContent.wrapInner("<div data-read-more-container>");
      var $moreContainer = $moreContent.find("[data-read-more-container]");
      $moreContainer.height(moreMaxHeight);

      if($moreContent.is("[data-read-more-return]")) {
        shouldShowLess = true;
      }

      if($moreContent.is("[data-read-more-label]")) {
        moreText = $moreContent.attr("data-read-more-label");
      }

      // Create a "read more" link
      var $moreLink = $("<a>").attr("href", "#").attr("data-read-more-link", "").text(moreText).wrapInner("<span />");
      $moreContent.append($moreLink);

      // Create a "read less" link
      if(shouldShowLess) {
        var lessText = $moreContent.attr("data-read-more-return");
        var $lessLink = $("<a>").attr("href", "#").attr("data-read-more-return-link", "").text(lessText).wrapInner("<span />");
        $moreContent.append($lessLink);
      }

      // bindings
      if(shouldShowLess) {
        $lessLink.on("click", function(e){
          e.preventDefault();
          showLess($moreContainer, $moreLink, $lessLink);
        });
        $moreLink.on("click", function(e){
          e.preventDefault();
          showMore($moreContainer, $moreLink, $lessLink);
        });
      } else {
        $moreLink.on("click", function(e){
          e.preventDefault();
          showMore($moreContainer, $moreLink);
        });
      }
    }

    $moreContents.each(function(){
      var $moreContent = $(this);
      var contentHeight = $moreContent.outerHeight();
      var moreMaxHeight = getMoreMaxHeight($moreContent);

      if(contentHeight > moreMaxHeight) {
        initialiseMoreContainer($moreContent);
      }
    });

  });

}(document, window, jQuery));