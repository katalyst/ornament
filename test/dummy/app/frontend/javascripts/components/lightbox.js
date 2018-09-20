import "../vendor/libs/magnific-popup";

(function (document, window, $) {
  "use strict";

  $(document).on("ornament:refresh", function () {

    var Lightbox = Ornament.Components.Lightbox = {

      // Gloabl settings
      keepScrollPosition: true, 
      shadowable: true, // set to false to disable shadows in scrollable lightboxes
      scrollable: true, // set to false to disable scrollable lightboxes gloablly

      // Selectors
      selectors: {
        anchorSelector: "data-lightbox",
        gallerySelector: "data-lightbox-gallery",
        basicSelector: "data-lightbox-basic",
        positionerSelector: ".layout"
      },

      // The class added to the body when the lightbox is scrollable
      scrollableBodyClass: "lightbox__scrollable",

      // Determine if a lightbox should be scrollable
      shouldBeScrollable: function($modal){
        return $modal.find(".lightbox--header").length > 0;
      },

      // Default options
      defaults: {
        type: "inline",
        mainClass: "lightbox--main",
        removalDelay: 300,
        fixedContentPos: true,
        showCloseBtn: true,
        closeMarkup: "<button title='%title%' type='button' class='mfp-close'>" + Ornicons.close + "</button>",
        image: {
          markup: "<div class='mfp-figure'>" + 
                    "<div class='mfp-close'>" + Ornicons.close + "</div>" + 
                    "<div class='mfp-img'></div>" + 
                    "<div class='mfp-bottom-bar'>" + 
                      "<div class='mfp-title'></div>" + 
                      "<div class='mfp-counter'></div>" + 
                    "</div>" + 
                  "</div>"
        },
        callbacks: {
          beforeOpen: function(){
            var mfp = this;
            var $anchor = $(mfp.ev.context);

            if(Lightbox.keepScrollPosition) {
              Lightbox.currentScrollPosition = $(document).scrollTop();
            }

            // Add class for lightbox open to body
            if(!($anchor.is("[data-lightbox-size]") && $anchor.attr("data-lightbox-size") === "fullscreen")) {
              $("body").addClass("lightbox-open");
            }

            // Set scroll position
            if(Lightbox.keepScrollPosition) {
              if(Lightbox.currentScrollPosition) {
                $(Lightbox.$positioner).css({
                  position: "relative",
                  top: Lightbox.currentScrollPosition * -1
                });
              }
            }
            
          },
          open: function(){
            var mfp = this;
            var resizableTypes = mfp.currItem === "ajax" || mfp.currentItem === "inline";
            if(resizableTypes) {
              var $anchor = $(mfp.ev.context);
              var $target = $(mfp.currItem.src);
              // Add a class around basic, non-scrollable modals
              if(!Lightbox.shouldBeScrollable($target)) {
                $target.closest(".mfp-container").addClass("mfp-container__basic");
              }
              // callback on open to trigger a refresh for google maps
              // $(document).trigger("ornament:map_refresh");
            }
            scrollTo(0,0);
            if(typeof flyingFocus !== "undefined") {
              flyingFocus.resetFocus();
            }

            // Custom SVG icons for previous/next arrows 
            $(mfp.container).find(".mfp-arrow-left").html(Ornicons.chevronLeft);
            $(mfp.container).find(".mfp-arrow-right").html(Ornicons.chevronRight);
          },
          elementParse: function(item) {
            if(item.type === "ajax") {
              item.src = item.src + (item.src.indexOf("?") > -1 ? "&" : "?") + "lightbox=true";
            }
          },
          ajaxContentAdded: function() {
            $("[data-lightbox-close]").off("click").on("click", function(e){
              e.preventDefault();
              $.magnificPopup.close();
            });
          },
          close: function(mfp){
            var $anchor = false;
            if(this.ev && this.ev.context) {
              $anchor = $(this.ev.context);
            }
            $("body").removeClass("lightbox-open").removeClass(Lightbox.scrollableBodyClass);
            if(Lightbox.keepScrollPosition) {
              if(Lightbox.currentScrollPosition) {
                $(Lightbox.$positioner).css({
                  position: "static",
                  top: 0
                });
                scrollTo(0, Lightbox.currentScrollPosition);
              }
            }
          },
          resize: function(){
            // Resize to viewport
            Lightbox.sizeLightboxToViewport(this);
          }
        }
      },

      // Size a lightbox to viewport
      sizeLightboxToViewport: function(mfp){
        if(Lightbox.scrollable) {
          var $body = $("body");
          if(mfp.items && mfp.items[0] && mfp.items[0].inlineElement) {
            var $lightboxBody = mfp.items[0].inlineElement;
          } else {
            var $lightboxBody = mfp.contentContainer;
          }
          var $lightboxContent = $lightboxBody.find(".lightbox--body");
          var $lightboxHeader = $lightboxBody.find(".lightbox--header");
          var $lightboxFooter = $lightboxBody.find(".lightbox--footer");
          if($lightboxContent.length) {
            $body.addClass(Lightbox.scrollableBodyClass);
          }
          var topOffset = 20;
          var bottomOffset = 20;
          var windowHeight = Ornament.windowHeight();
          var windowWidth = Ornament.windowWidth();
          var $lightboxContainer = $lightboxBody.parent();
          if($body.hasClass(Lightbox.scrollableBodyClass) && $lightboxContainer.outerHeight() === windowHeight) {
            topOffset = 0;
            bottomOffset = 0;
          }
          var maxLightboxHeightInPixels = (windowHeight - topOffset - bottomOffset) - $lightboxHeader.outerHeight();
          if($lightboxFooter.length) {
            maxLightboxHeightInPixels = maxLightboxHeightInPixels - $lightboxFooter.outerHeight();
          }
          $lightboxContent.height("auto");

          if($lightboxContent.outerHeight() >= maxLightboxHeightInPixels) {
            $lightboxContent.height(maxLightboxHeightInPixels);
          }

          if($lightboxContent.length && Lightbox.shadowable) {
            Ornament.U.Shadowable.buildShadows($lightboxContent[0], "y");
            Ornament.U.Shadowable.setScrollShadowsY($lightboxContent[0]);
            Ornament.U.bindOnce($lightboxContent[0], "scroll", Ornament.U.Shadowable.shadowScrollY);
          }
        }
      },

      // Size the currently open lightbox to viewport
      sizeOpenLightbox: function(){
        if(Lightbox.scrollable) {
          var currentLightboxElement = $.magnificPopup.instance;
          if (currentLightboxElement.currItem) {
            Lightbox.sizeLightboxToViewport(currentLightboxElement);
          }
        }
      },

      // Show a lightbox with custom settings
      // Ornament.C.Lightbox.openLightbox({
      //   src: "#my-popup"
      // });
      openLightbox: function(settings){
        var options = $.extend(true, {}, Lightbox.defaults, settings);
        $.magnificPopup.open(options);
      },

      // Close any open modals
      closeLightbox: function() {
        $.magnificPopup.close();
      },

      // Bind MFP to an anchor and build settings based on 
      // data attributes
      bindLightboxLink: function($anchor) {
        var anchorType = "inline";

        // Setup lightbox options with a default type of "inline"
        var popupOptions = $.extend(true, {}, Lightbox.defaults);

        if($anchor.is("[data-lightbox-size]")) {
          var size = $anchor.attr("data-lightbox-size");
          popupOptions.mainClass = popupOptions.mainClass + " lightbox__" + size;
          if(size === "fullscreen") {
            popupOptions.closeOnBgClick = false;
          }
        }

        // Update type based on setting passed in to our anchor
        if($anchor.attr(Lightbox.selectors.anchorSelector)) {
          anchorType = $anchor.attr(Lightbox.selectors.anchorSelector);
          popupOptions.type = anchorType;
        }

        // Update settings if basic 
        if($anchor.is("[" + Lightbox.selectors.basicSelector + "]") || anchorType !== "inline") {
          popupOptions.showCloseBtn = true;
        }

        // Lightbox links inside modals can be defined by also
        // setting data-lightbox-link
        if($anchor.is("[data-lightbox-linked]")) {
          $anchor.on("click", function(e){
            e.preventDefault();
            $.magnificPopup.close();
            popupOptions.items = {
              src: $anchor.attr("href")
            }
            setTimeout(function(){
              $.magnificPopup.open(popupOptions);
            }, 300);
          });
        } else {
          // Init magnificPopup on our anchors
          $anchor.magnificPopup(popupOptions);
        }
      },

      // Setup lightbox functions
      init: function(){

        // Disable close button when scrollable is defaulted to true
        if(Lightbox.scrollable) {
          Lightbox.defaults.showCloseBtn = false;
        }

        Lightbox.$positioner = $(Lightbox.selectors.positionerSelector);
        var $lightboxCloseButtons = $("[data-lightbox-close]")
        var $lightboxAnchors = $("[" + Lightbox.selectors.anchorSelector + "],[" + Lightbox.selectors.basicSelector + "]");
        var $lightboxGalleries = $("[" + Lightbox.selectors.gallerySelector + "]")

        // Close button
        $lightboxCloseButtons.on("click", function(e){
          e.preventDefault();
          $.magnificPopup.close();
        });

        // Single lightbox anchors
        $lightboxAnchors.each(function(){
          Lightbox.bindLightboxLink($(this));
        });

        // Lightbox galleries
        $lightboxGalleries.each(function(){
          var $gallery = $(this);
          var popupOptions = $.extend(true, {}, Lightbox.defaults);
          popupOptions.type = "image";
          popupOptions.delegate = "a";
          popupOptions.tLoading = "Loading image #%curr%...";
          popupOptions.gallery = popupOptions.gallery || {};
          popupOptions.gallery.enabled = true;
          popupOptions.gallery.navigateByImgClick = true;
          // Will preload 0 - before current, and 1 after the current image
          popupOptions.gallery.preload = [0,1];
          popupOptions.image = popupOptions.image || {};
          popupOptions.image.tError = '<a href="%url%">The image #%curr%</a> could not be loaded.';
          $gallery.magnificPopup(popupOptions);
        });

        Ornament.beforeTurbolinksCache(function(){
          $.magnificPopup.close();
          $(".mfp-container").remove();
          $(".mfp-bg").remove();
          $(".mfp-wrap").remove();
          $("body").removeClass("lightbox-open mfp-zoom-out-cur mfp-zoom-in-cur");

          if(Lightbox.keepScrollPosition) {
            $(Lightbox.$positioner).css({
              position: "static",
              top: 0
            });
          }
        });

      }
    }

    Lightbox.init();
  });

}(document, window, jQuery));