/*jslint browser: true, indent: 2, todo: true, unparam: true */
/*global jQuery,Ornament /*/

(function (document, window, $) {

  "use strict";

  var ReadMore = {

    // Settings
    defaultMaxHeight: 280,
    defaultMoreText: "Read more",
    defaultLessText: "Read less",
    animationTiming: 200,

    // Selectors
    contentSelector: "data-read-more",
    heightSelector: "data-read-more-height",
    containerSelector: "data-read-more-container",
    returnSelector: "data-read-more-return",
    moreLabelSelector: "data-read-more-label",

    getMoreMaxHeight: function($content){
      if($content.is("[" + ReadMore.heightSelector + "]")) {
        return parseInt($content.attr(ReadMore.heightSelector));
      } else {
        return ReadMore.defaultMaxHeight;
      }
    },

    // Clone an element to get the height of it
    getHeightOfContainer: function($element){
      return Ornament.U.measure($element);
    },

    showLess: function($container, $moreLink, $lessLink) {
      $moreLink.fadeIn("fast");
      $container.animate({
        height: ReadMore.getMoreMaxHeight($container.parent("[" + ReadMore.contentSelector + "]"))
      }, ReadMore.animationTiming);
      $lessLink.animate({
        opacity: 0
      }, ReadMore.animationTiming);
    },

    showMore: function($container, $moreLink, $lessLink) {
      $lessLink = $lessLink || false;
      $moreLink.fadeOut("fast");
      $container.animate({
        height: ReadMore.getHeightOfContainer($container)
      }, ReadMore.animationTiming);
      if($lessLink) {
        $lessLink.animate({
          opacity: 1
        }, ReadMore.animationTiming);
      }
    },

    setupContainer: function($content) {
      var $cachedContent = $content.clone();
      var shouldShowLess = false;
      var moreMaxHeight = ReadMore.getMoreMaxHeight($content);
      var moreText = ReadMore.defaultMoreText;

      // Wrap the content in a container that we can control the size of
      $content.wrapInner("<div " + ReadMore.containerSelector + ">");
      var $moreContainer = $content.find("[" + ReadMore.containerSelector + "]");
      $moreContainer.height(moreMaxHeight);

      if($content.is("[" + ReadMore.returnSelector + "]")) {
        shouldShowLess = true;
      }

      if($content.is("[" + ReadMore.moreLabelSelector + "]")) {
        moreText = $content.attr(ReadMore.moreLabelSelector);
      }

      // Create a "read more" link
      var $moreLink = $("<a>").attr("href", "#").attr("data-read-more-link", "").text(moreText).wrapInner("<span />");
      $content.append($moreLink);

      // Create a "read less" link
      if(shouldShowLess) {
        var lessText = $content.attr(ReadMore.returnSelector) || ReadMore.defaultLessText;
        var $lessLink = $("<a>").attr("href", "#").attr("data-read-more-return-link", "").text(lessText).wrapInner("<span />");
        $content.append($lessLink);
      }

      // bindings
      if(shouldShowLess) {
        $lessLink.on("click", function(e){
          e.preventDefault();
          ReadMore.showLess($moreContainer, $moreLink, $lessLink);
        });
        $moreLink.on("click", function(e){
          e.preventDefault();
          ReadMore.showMore($moreContainer, $moreLink, $lessLink);
        });
      } else {
        $moreLink.on("click", function(e){
          e.preventDefault();
          ReadMore.showMore($moreContainer, $moreLink);
        });
      }

      Ornament.beforeTurbolinksCache(function(){
        $content.before($cachedContent);
        $content.remove();
      });
    },

    init: function(){
      $("[" + ReadMore.contentSelector + "]").each(function(){
        var $content = $(this);
        var contentHeight = $content.outerHeight();
        var moreMaxHeight = ReadMore.getMoreMaxHeight($content);
        if(contentHeight > moreMaxHeight) {
          ReadMore.setupContainer($content);
        }
      });
    }
  }

  Ornament.registerComponent("ReadMore", ReadMore);

}(document, window, jQuery));