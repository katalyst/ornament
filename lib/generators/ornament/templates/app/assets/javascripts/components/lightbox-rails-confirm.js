/*jslint browser: true, indent: 2, todo: true, unparam: true */
/*global jQuery,Ornament /*/

(function (document, window, $) {

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
    var $modalCancel = $("<button type='button' class='button button__cancel'>Cancel</button>");

    // Update confirm button text
    if(element.is("[data-confirm-confirm]")) {
      $modalConfirm.text(element.attr("data-confirm-confirm"));
    }

    // Update cancel button text
    if(element.is("[data-confirm-cancel]")) {
      $modalCancel.text(element.attr("data-confirm-cancel"));
    }

    // Build a close button
    var $modalClose = $("<button type='button' class='lightbox--close' title='Close'>" + Ornament.icons.close + "</button>");

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
      }, Ornament.C.Lightbox.defaults.removalDelay);
    } else {
      openConfirmModal();
    }

    // Bind close buttons
    var closeConfirmModal = function(e){
      $.magnificPopup.close();

      if(previousModal) {
        setTimeout(function(){
          Ornament.C.Lightbox.openLightbox({
            items: {
              src: previousModal
            }
          });
        }, Ornament.C.Lightbox.defaults.removalDelay);
      }

      return false;
    }

    // Clicking on the cancel button hides the popup
    $modalCancel.on("click", closeConfirmModal);
    $modalClose.on("click", closeConfirmModal);

    // Prevent the original link from working
    return false;
  }

}(document, window, jQuery));