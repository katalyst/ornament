// import { tns } from 'tiny-slider/src/tiny-slider';
import '../vendor/libs/tiny-slider';

(function (document, window, tns) {
  "use strict";

  var Carousel = {
    selector: "data-carousel",
    activeClass: "carousel-active",
    autoplayVideos: false,

    getVideos: function($container) {
      return $container.querySelectorAll("iframe[src*='youtube']");
    },

    playCurrentVideo(info){
      const currentSlide = info.slideItems[info.index];
      const videos = Carousel.getVideos(currentSlide);
      if(videos[0] && videos[0].contentWindow) {
        videos[0].contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
      }
    },

    buildSlider: function($container) {

      // Default options
      var options = {
        container: $container,
        items: 1,
        slideBy: 'page',
        lazyload: false,
        mouseDrag: true,
        autoHeight: true,
        navPosition: "bottom",
      }

      // Custom slides node
      var $slides = $container.querySelector("[data-carousel-slides]");
      if($slides) {
        options.container = $slides;
      }

      // Add embed API for youtube videos
      var $videos = Carousel.getVideos($container);
      $videos.forEach(function($video) {
        var src = $video.src;
        if(src.indexOf("enablejsapi") > -1) {
          return;
        }
        if(src.indexOf("?") > -1) {
          src += "&";
        } else {
          src += "?";
        }
        src += "enablejsapi=1";
        $video.src = src;
      });

      // Gallery variation
      if($container.hasAttribute("data-carousel-gallery")) {
        options.mode = "gallery";
        options.navAsThumbnails = true;
      }

      // Move navigation to designated navigation container
      var counterNav = false;
      var $navContainer = $container.querySelector("[data-carousel-nav]");
      if($navContainer) {
        options.navContainer = $navContainer;
        counterNav = $navContainer.getAttribute("data-carousel-nav") === "counter";
        $navContainer.classList.add("tns-nav");

        if(!$navContainer.childNodes.length) {
          
          // Counter navigation disables built=in navigation
          // and just apply a custom class for styling
          if(counterNav) {
            options.nav = false;
            $navContainer.classList.add("tns-nav__counter");

          // Build out autogenerated thumbnails
          } else if(options.navAsThumbnails) {
            $navContainer.classList.add("tns-nav__thumbnails");
            var $ul = document.createElement("ul");

            options.container.childNodes.forEach(function($slide){
              // Don't do anything for #text nodes
              if($slide.nodeType !== Node.ELEMENT_NODE) {
                return;
              }

              var thumbnail;

              // Custom thumbnail via data attribute
              if($slide.hasAttribute("data-carousel-thumbnail")) {
                thumbnail = $slide.getAttribute("data-carousel-thumbnail");
              }

              // Youtube embed thumbnail
              var $videos = Carousel.getVideos($slide);
              $videos.forEach(function($video){
                var yid = $video.src.split("/embed/")[1];
                yid = yid.split("?")[0];
                thumbnail = "https://img.youtube.com/vi/" + yid + "/default.jpg";
              });

              // Image thumbnail
              var $image = $slide.querySelector("img")
              if($image) {
                thumbnail = $image.src;
              }

              // Add either image or generic button if can't find an image
              var $li = document.createElement("li");
              if(thumbnail) {
                var $thumbnailImage = document.createElement("img");
                $thumbnailImage.src = thumbnail;
                $li.appendChild($thumbnailImage);
              } else {
                $li.appendChild(document.createElement("button"));
              }
              $ul.appendChild($li);
            });
            $navContainer.appendChild($ul);

            // Update navContainer to point to the UL
            options.navContainer = $ul;

          // Build out dots
          } else {
            var numberOfSlides = Ornament.U.nodeListArray(options.container.childNodes).filter(function(node){
              return node.nodeType === Node.ELEMENT_NODE;
            }).length;
            for(var i = 0; i < numberOfSlides; i++) {
              $navContainer.appendChild(document.createElement("button"));
            }
          }
        }
      }

      // Autoplay
      if($container.hasAttribute("data-carousel-autoplay")) {
        options.autoplay = true;
        options.autoplayTimeout = 5000;
      }

      // Allow no navigation dots
      if($container.hasAttribute("data-carousel-no-nav")) {
        options.nav = false;
      }

      // Cards variation
      if($container.hasAttribute("data-carousel-cards")) {
        options.items = 3;
        options.gutter = 16;
        options.slideBy = "page";
        options.nav = false;
        options.fixedWidth = 250;
        options.loop = false;
      }

      // Custom arrows
      var $customNextButton = $container.querySelector("[data-carousel-next]");
      var $customPreviousButton = $container.querySelector("[data-carousel-previous]");
      if($customNextButton || $customPreviousButton) {
        options.controls = false;
      }

      // Helper function to popuplate the counter navigtation element with
      // the current display status
      const buildCounterNavigation = info => {
        if(counterNav) {
          const $nav = $container.querySelector("[data-carousel-nav]");
          if($nav) {
            $nav.innerHTML = info.displayIndex + "/" + info.slideCount;
          }
        }
      }

      options.onInit = function(info) {
        // Inject arrow icons in to buttons
        if(!$customNextButton) {
          var $nextButton = info.nextButton;
          if($nextButton) {
            var $icon = document.createElement("div");
            $icon.innerHTML = Ornicons.chevronRight;
            $nextButton.innerHTML = "";
            $nextButton.appendChild($icon);
          }
        }
        if(!$customPreviousButton) {
          var $previousButton = info.prevButton;
          if($previousButton) {
            var $icon = document.createElement("div");
            $icon.innerHTML = Ornicons.chevronLeft;
            $previousButton.innerHTML = "";
            $previousButton.appendChild($icon);
          }
        }
        buildCounterNavigation(info);
      }

      // Initialise the slider
      var api = tns(options);

      // Bind custom arrows
      if($customNextButton) {
        Ornament.U.bindOnce($customNextButton, "click", function(){
          api.goTo("next");
        });
      }
      if($customPreviousButton) {
        Ornament.U.bindOnce($customPreviousButton, "click", function(){
          api.goTo("prev");
        });
      }

      // Callbacks
      api.events.on("transitionStart", function(info){
        // When transitioning, pause any youtube videos
        $videos.forEach(function($video){
          var youtube = $video.contentWindow;
          youtube.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
        });

        buildCounterNavigation(info);
      });

      api.events.on("transitionEnd", function(info){
        // Autoplay video when transition ends
        if(Carousel.autoplayVideos) {
          Carousel.playCurrentVideo(info);
        }
      });
    },

    init: function(){
      document.querySelectorAll("[" + Carousel.selector + "]").forEach(function($node){
        Carousel.buildSlider($node);
      });
    }
  }

  Ornament.registerComponent("Carousel", Carousel);

}(document, window, window.tns));
