//= require magnific-popup

/*jslint browser: true, indent: 2, todo: true, unparam: true */
/*global jQuery,Ornament /*/

(function (document, window, $) {

  "use strict";

  $(document).on("ornament:refresh", function () {

    var Lightbox = Ornament.Components.Lightbox = {

      // Gloabl settings
      scrollable: true,
      keepScrollPosition: true,

      // Selectors
      anchorSelector: "data-lightbox",
      gallerySelector: "data-lightbox-gallery",

      // Default options
      defaults: {
        type: "inline",
        mainClass: "lightbox--main",
        removalDelay: 300,
        fixedContentPos: true,
        showCloseBtn: false,
        callbacks: {
          beforeOpen: function(){
            window.mfpScrollPosition = $(document).scrollTop();
          },
          open: function(){
            var mfp = this;
            var $anchor = $(mfp.ev.context);
            var resize = true;

            if($anchor.is("[data-lightbox]") && $anchor.attr("data-lightbox") === "ajax") {
              resize = false;
            }

            // Add class for lightbox open to body
            $("body").addClass("lightbox-open");

            if(window.mfpScrollPosition) {
              $(".layout").css({
                position: "relative",
                top: window.mfpScrollPosition * -1
              });
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

      // Show a lightbox with custom settings
      // Ornament.C.Lightbox.showLightbox({
      //   src: "#my-popup"
      // });
      showLightbox: function(settings){
        var options = $.extend(true, {}, Lightbox.defaults, settings);
        $.magnificPopup.open(options);
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

      // Setup lightbox functions
      init: function(){

        // Single lightbox anchors
        $("[" + Lightbox.anchorSelector + "]").each(function(){

          var $anchor = $(this);
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

        });

        // Lightbox galleries
        $("[" + Lightbox.gallerySelector + "]").each(function(){

          var $gallery = $(this);

          var popupOptions = Lightbox.defaults;
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
      .addClass('button')
      // We want it to sound confirmy
      .html("Yes");

    var modalHtml =   '<div class="lightbox--ajax-content content-spacing">';
        modalHtml +=  '  <div class="lightbox--body">';
        modalHtml +=  '    <h2 class="heading-two lightbox--heading">'+ element.text() +'</h2>';
        modalHtml +=  '    <div class="lightbox--content  content-spacing">';
        modalHtml +=  '      <p>';
        modalHtml +=           message;
        modalHtml +=  '      </p>';
        modalHtml +=  '    </div>';
        modalHtml +=  '    <div class="lightbox--buttons">';
        modalHtml +=  '    </div>';
        modalHtml +=  '  </div>';
        modalHtml +=  '</div>';


    var $modalHtml = $(modalHtml);

    // Create our cancel button
    var $modalButtons = $modalHtml.find(".lightbox--buttons");
    var $modalCancel = $("<button class='button button__secondary'>Cancel</button>");

    // Update confirm button text
    if(element.is("[data-confirm-confirm]")) {
      $modalConfirm.text(element.attr("data-confirm-confirm"));
    }

    // Update cancel button text
    if(element.is("[data-confirm-cancel]")) {
      $modalCancel.text(element.attr("data-confirm-cancel"));
    }

    $modalButtons.append($modalCancel);
    $modalButtons.append($modalConfirm);

    // Open popup
    $.magnificPopup.open({
      mainClass: "lightbox--main",
      removalDelay: 300,
      items: {
        src: $modalHtml,
        type: 'inline'
      }
    });

    // Clicking on the cancel button hides the popup
    $modalCancel.on("click", function(e){
      $.magnificPopup.close();
      return false;
    });

    // Prevent the original link from working
    return false
  }

}(document, window, jQuery));