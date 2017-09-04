//= require libs/magnific-popup

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
      selectors: {
        anchorSelector: "data-lightbox",
        gallerySelector: "data-lightbox-gallery",
        basicSelector: "data-lightbox-basic",
        positionerSelector: ".layout"
      },

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
            flyingFocus.resetFocus();
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
          close: function(){
            var $anchor = $(this.ev.context);
            $("body").removeClass("lightbox-open");

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
            Ornament.U.Shadowable.buildShadows($lightboxContent, "y");
            Ornament.U.Shadowable.setScrollShadowsY($lightboxContent);
            $lightboxContent.off("scroll", Ornament.U.Shadowable.shadowScrollY).on("scroll", Ornament.U.Shadowable.shadowScrollY);
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

    // Build a close button
    var $modalClose = $("<div class='lightbox--close' title='Close'>x</div>");

    // Build out the markup for the modal
    var modalHtml = $('<div class="lightbox--body">' + 
                    '  <div class="lightbox--header" data-lightbox-header>' + 
                    '    <div class="lightbox--title">' + 
                    '      Please confirm' + 
                    '    </div>' + 
                    '  </div>' + 
                    '  <div class="lightbox--content">' + 
                    '    <div class="panel--padding">' + 
                    '    ' + message + 
                    '    </div>' + 
                    '  </div>' + 
                    ' <div class="lightbox--footer" data-lightbox-buttons></div>' + 
                    '</div>');

    // Append our elements to the markup above 
    var $buttons = $("<div />").addClass("button-set");
    $buttons.append($("<div />").append($modalConfirm))
            .append($("<div />").append($modalCancel));
    modalHtml.find("[data-lightbox-buttons]").append($buttons);
    modalHtml.find("[data-lightbox-header]").append($modalClose);

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

    // Bind close buttons
    var closeConfirmModal = function(e){
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
    }

    // Clicking on the cancel button hides the popup
    $modalCancel.on("click", closeConfirmModal);
    $modalClose.on("click", closeConfirmModal);

    // Prevent the original link from working
    return false
  }

}(document, window, jQuery));