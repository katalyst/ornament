(function (document, window, Orn, Utils) {
  "use strict";

  const supported = "permissions" in navigator;

  const Permissions = {

    // =========================================================================
    // Requesters
    // =========================================================================

    requestLocation: (message, callbacks) => {
      if(!supported) {
        Permissions.getLocation(callbacks);
        return;
      }

      Permissions.buildRequestModal({
        message,
        okay: () => Permissions.getLocation(callbacks),
      })
    },

    // =========================================================================
    // Modal request
    // Note: Depends on Ornament.C.Modal and the AjaxModal component
    // =========================================================================

    buildRequestModal: (options={}) => {
      const message = options.message || "Permissions message missing.";
      const image = options.image || false;
      const okay = options.okay || false;
      const cancel = options.cancel || Ornament.C.Modal.closeModal;

      // Create container
      const $container = document.createElement("div");
      $container.className = "modal__permissions";
      let containerHtml = "";
      if(image) {
        containerHtml += `<div><img src='${image}' />`;
      }
      if(message) {
        containerHtml += `<div class='panel--padding content'>
          ${message}
        </div>`
      }
      containerHtml += `<div class='modal__permissions--actions panel--border-top'>
        <div class='button-set' data-modal-permissions-buttons></div>
      </div>`
      $container.innerHTML = containerHtml;

      // Build buttons
      const $buttons = $container.querySelector("[data-modal-permissions-buttons]");

      // Okay button action
      if(okay) {
        const $okayWrapper = document.createElement("div");
        const $okay = document.createElement("button");
        $okay.type = "button";
        $okay.addEventListener("click", okay);
        $okayWrapper.appendChild($okay);
        $buttons.appendChild($okayWrapper);
      }

      // Cancel button action
      const $cancelWrapper = document.createElement("div");
      const $cancel = document.createElement("button");
      $cancel.type = "button";
      $cancel.addEventListener("click", cancel);
      $cancelWrapper.appendChild($cancel);
      $buttons.appendChild($cancelWrapper);

      // Open the modal with the new HTML
      Ornament.triggerEvent("ornament:modal:global-ajax:set-content", { html: $container, size: options.size || "" });
    },

    // =========================================================================
    // Getters
    // =========================================================================

    getLocation: callbacks => {
      alert("Getting location");
    }

  }
  
  Orn.registerComponent("Permissions", Permissions);

}(document, window, Ornament, Ornament.Utilities));