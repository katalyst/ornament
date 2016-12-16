//= require magnific-popup

/*jslint browser: true, indent: 2, todo: true, unparam: true */
/*global jQuery,Ornament /*/

(function (document, window, $) {

  "use strict";

  $(document).on("ornament:refresh", function () {

    var Lightbox = Ornament.Components.Lightbox = {

      // Gloabl settings
      keepScrollPosition: true, 
      shadowable: true, // set to false to disable shadows in scrollable lightboxes
      scrollable: true, // set to false to disable scrollable lightboxes gloablly

      // Selectors
      anchorSelector: "data-lightbox",
      gallerySelector: "data-lightbox-gallery",

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
        callbacks: {
          beforeOpen: function(){
            var mfp = this;
            window.mfpScrollPosition = $(document).scrollTop();

            // Add class for lightbox open to body
            $("body").addClass("lightbox-open");

            // Set scroll position
            if(window.mfpScrollPosition) {
              $(".layout").css({
                position: "relative",
                top: window.mfpScrollPosition * -1
              });
            }
            
          },
          open: function(){
            var mfp = this;
            var $anchor = $(mfp.ev.context);
            var $target = $(mfp.currItem.src);
            var resize = true;

            if($anchor.is("[data-lightbox]") && $anchor.attr("data-lightbox") === "ajax") {
              resize = false;
            }

            // Add a class around basic, non-scrollable modals
            if(!Lightbox.shouldBeScrollable($target)) {
              $target.closest(".mfp-container").addClass("mfp-container__basic");
            }

            // resize to viewport
            if(resize) {
              setTimeout(function(){
                Lightbox.sizeOpenLightbox();
              }, 200);
            }

            // callback on open to trigger a refresh for google maps
            $(document).trigger("ornament:map_refresh");
          },
          elementParse: function(item) {
            if(item.type === "ajax") {
              item.src = item.src + "?lightbox=true";
            }
          },
          ajaxContentAdded: function() {
            $("[data-lightbox-close]").off("click").on("click", function(e){
              e.preventDefault();
              $.magnificPopup.close();
            });
          },
          close: function(){
            var $anchor = $(this.ev.context);
            $("body").removeClass("lightbox-open");

            if(window.mfpScrollPosition) {
              $(".layout").css({
                position: "static",
                top: 0
              });
              scrollTo(0, window.mfpScrollPosition);
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
          if(mfp.items && mfp.items[0] && mfp.items[0].inlineElement) {
            var $lightboxBody = mfp.items[0].inlineElement;
          } else {
            var $lightboxBody = mfp.contentContainer;
          }
          var $lightboxContent = $lightboxBody.find(".lightbox--body");
          var $lightboxHeader = $lightboxBody.find(".lightbox--header");
          var $lightboxFooter = $lightboxBody.find(".lightbox--footer");
          var topOffset = 20;
          var bottomOffset = 20;
          var windowHeight = Ornament.windowHeight();
          var maxLightboxHeightInPixels = (windowHeight - topOffset - bottomOffset) - $lightboxHeader.outerHeight();
          if($lightboxFooter.length) {
            maxLightboxHeightInPixels = maxLightboxHeightInPixels - $lightboxFooter.outerHeight();
          }
          $lightboxContent.height("auto");

          if($lightboxContent.outerHeight() >= maxLightboxHeightInPixels) {
            $lightboxContent.height(maxLightboxHeightInPixels);
          }

          if(Lightbox.shadowable) {
            Ornament.Shadowable.buildShadows($lightboxContent, "y");
            Ornament.Shadowable.setScrollShadowsY($lightboxContent);
            $lightboxContent.off("scroll", Ornament.Shadowable.shadowScrollY).on("scroll", Ornament.Shadowable.shadowScrollY);
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

        if($anchor.is("[data-lightbox-small]")) {
          popupOptions.mainClass = popupOptions.mainClass + " lightbox__small";
        }

        if($anchor.is("[data-lightbox-flush]")) {
          popupOptions.mainClass = popupOptions.mainClass + " lightbox__flush";
        }

        // Update type based on setting passed in to our anchor
        if($anchor.attr(Lightbox.anchorSelector)) {
          popupOptions.type = $anchor.attr(Lightbox.anchorSelector);
        }

        // Update settings if basic or not
        if($anchor.is("[data-lightbox-basic]")) {
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

        // Close button
        $("[data-lightbox-close]").on("click", function(e){
          e.preventDefault();
          $.magnificPopup.close();
        });

        // Single lightbox anchors
        $("[" + Lightbox.anchorSelector + "]").each(function(){
          Lightbox.bindLightboxLink($(this));
        });

        // Lightbox galleries
        $("[" + Lightbox.gallerySelector + "]").each(function(){

          var $gallery = $(this);

          var popupOptions = $.extend(true, {}, Lightbox.defaults);
          popupOptions.type = "image";
          popupOptions.delegate = "a";
          popupOptions.tLoading = "Loading image #%curr%...";
          popupOptions.gallery = {
            enabled: true,
            navigateByImgClick: true,
            preload: [0,1] // Will preload 0 - before current, and 1 after the current image
          };
          popupOptions.image = {
            tError: '<a href="%url%">The image #%curr%</a> could not be loaded.',
          }

          $gallery.magnificPopup(popupOptions);
        });
      }
    }

    Lightbox.init();
  });

  // Override Rails handling of confirmation
  $.rails.allowAction = function(element) {

    // The message is something like "Are you sure?"
    var message = element.data('confirm');

    // If there's no message, there's no data-confirm attribute,
    // which means there's nothing to confirm
    if(!message) {
      return true;
    }

    // Clone the clicked element (probably a delete link) so we can use it in the dialog box.
    var $modalConfirm = element.clone()
      // We don't necessarily want the same styling as the original link/button.
      .removeAttr('class')
      // We don't want to pop up another confirmation (recursion)
      .removeAttr('data-confirm')
      // We want a button
      .addClass('button__confirm')
      // We want it to sound confirmy
      .html("Yes");

    // Create buttons 
    var $modalCancel = $("<button class='button button__cancel'>Cancel</button>");

    // Update confirm button text
    if(element.is("[data-confirm-confirm]")) {
      $modalConfirm.text(element.attr("data-confirm-confirm"));
    }

    // Update cancel button text
    if(element.is("[data-confirm-cancel]")) {
      $modalCancel.text(element.attr("data-confirm-cancel"));
    }

    var modalHtml = $('<div class="lightbox--body">' + 
                    '  <div class="lightbox--header">' + 
                    '    <div class="lightbox--header--logo">' + 
                    '      Please confirm' + 
                    '    </div>' + 
                    '    <div class="lightbox--header--close" data-lightbox-close title="Close">x</div>' + 
                    '  </div>' + 
                    '  <div class="lightbox--content">' + 
                    '    <div class="panel--padding">' + 
                    '    ' + message + 
                    '    </div>' + 
                    '  </div>' + 
                    ' <div class="lightbox--footer" data-lightbox-buttons></div>' + 
                    '</div>');

    modalHtml.find("[data-lightbox-buttons]").append($modalConfirm).append(" ").append($modalCancel);

    var openConfirmModal = function(){
      Ornament.C.Lightbox.openLightbox({
        items: {
          src: modalHtml
        }
      });
    }

    // Check if there's an existing modal
    var currentModal = $.magnificPopup.instance.currItem;
    if(currentModal) {
      var previousModal = currentModal.src;
      $.magnificPopup.close();

      setTimeout(function(){
        openConfirmModal();
      }, Ornament.popupOptions.removalDelay);
    } else {
      openConfirmModal();
    }


    // Clicking on the cancel button hides the popup
    $modalCancel.on("click", function(e){
      $.magnificPopup.close();

      if(previousModal) {
        var popupOptions = $.extend({}, Ornament.popupOptions);
        popupOptions.items = {
          src: previousModal
        };
        setTimeout(function(){
          $.magnificPopup.open(popupOptions);
        }, Ornament.popupOptions.removalDelay);
      }

      return false;
    });

    // Prevent the original link from working
    return false
  }

}(document, window, jQuery));