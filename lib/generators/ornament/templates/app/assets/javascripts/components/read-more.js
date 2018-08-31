(function (document, window) {
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
      if($content.hasAttribute(ReadMore.heightSelector)) {
        return parseInt($content.getAttribute(ReadMore.heightSelector));
      } else {
        return ReadMore.defaultMaxHeight;
      }
    },

    // Clone an element to get the height of it
    getHeightOfContainer: function($element){
      return Ornament.U.measure($element);
    },

    showLess: function($container, $moreLink, $lessLink) {
      var $content = Ornament.$.parentWithAttribute($container, ReadMore.contentSelector);
      $container.style.height = ReadMore.getMoreMaxHeight($content) + "px";

      if($moreLink) {
        $moreLink.style.display = "block";
      }

      if($lessLink) {
        $lessLink.style.display = "none";
      }
    },

    showMore: function($container, $moreLink, $lessLink) {
      $container.style.height = ReadMore.getHeightOfContainer($container) + "px";

      if($moreLink) {
        $moreLink.style.display = "none";
      }
      if($lessLink) {
        $lessLink.style.display = "block";
      }
    },

    setupContainer: function($content) {
      var $cachedContent = $content.cloneNode(true);
      var shouldShowLess = false;
      var moreMaxHeight = ReadMore.getMoreMaxHeight($content);
      var moreText = ReadMore.defaultMoreText;

      // Wrap the content in a container that we can control the size of
      var $wrapper = document.createElement("div");
      $wrapper.setAttribute(ReadMore.containerSelector, "");
      $content.appendChild($wrapper);
      while($content.firstChild !== $wrapper)
        $wrapper.appendChild($content.firstChild);
    
      $wrapper.style.height = moreMaxHeight + "px";

      if($content.hasAttribute(ReadMore.returnSelector)) {
        shouldShowLess = true;
      }

      if($content.hasAttribute(ReadMore.moreLabelSelector)) {
        moreText = $content.getAttribute(ReadMore.moreLabelSelector);
      }

      // Create a "read more" link
      var $moreLink = document.createElement("button");
      $moreLink.setAttribute("data-read-more-link", "");
      $moreLink.innerHTML = "<span>" + moreText + "</span>";
      $content.appendChild($moreLink);

      // Create a "read less" link
      if(shouldShowLess) {
        var lessText = ReadMore.defaultLessText;
        if($content.hasAttribute(ReadMore.returnSelector)) {
          $content.getAttribute(ReadMore.returnSelector);
        }
        var $lessLink = document.createElement("button");
        $lessLink.setAttribute("data-read-more-return-link", "");
        $lessLink.innerHTML = "<span>" + lessText + "</span>";
        $content.appendChild($lessLink);
      }

      // bindings
      if(shouldShowLess) {
        $lessLink.addEventListener("click", function(e){
          e.preventDefault();
          ReadMore.showLess($wrapper, $moreLink, $lessLink);
        });
        $moreLink.addEventListener("click", function(e){
          e.preventDefault();
          ReadMore.showMore($wrapper, $moreLink, $lessLink);
        });
      } else {
        $moreLink.addEventListener("click", function(e){
          e.preventDefault();
          ReadMore.showMore($wrapper, $moreLink);
        });
      }

      Ornament.beforeTurbolinksCache(function(){
        if($content.parentNode) {
          $content.parentNode.insertBefore($cachedContent, $content);
          $content.parentNode.removeChild($content);
        }
      });
    },

    init: function(){
      document.querySelectorAll("[" + ReadMore.contentSelector + "]").forEach(function($content){
        var contentHeight = $content.offsetHeight;
        var moreMaxHeight = ReadMore.getMoreMaxHeight($content);
        if(contentHeight > moreMaxHeight) {
          ReadMore.setupContainer($content);
        }
      });
    }
  }

  Ornament.registerComponent("ReadMore", ReadMore);

}(document, window));