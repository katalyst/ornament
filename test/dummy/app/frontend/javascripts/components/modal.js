(function (document, window) {
  "use strict";

  const Modal = {

    selectors: {
      anchors: "data-modal",
      closers: "data-modal-close",
      ajaxAnchors: "data-modal-ajax",
      linkedAnchors: "data-modal-link",
      size: "data-modal-size",
      pagePositioner: "data-tray-scroll-positioner",
    },

    scrollOffset: 0,

    // =========================================================================
    // Event aliasing
    // =========================================================================

    // Open a specific modal
    // <button onclick="Ornament.C.Modal.openModal('my-modal-id')">Open</button>
    // <%= react_component("Modal", props: { id: "my-modal-id" }) %>
    openModal: name => {
      Ornament.triggerEvent(`ornament:modal:${name}:open`);
    },

    // Close a specific modal
    // <button onclick="Ornament.C.Modal.closeModal('my-modal-id')">Close</button>
    closeModal: name => {
      Ornament.triggerEvent(`ornament:modal:${name}:close`);
    },

    // Close any open modals
    // <button onclick="Ornament.C.Modal.closeAnyModal()">Close any modal</button>
    closeAnyModal: () => {
      Ornament.triggerEvent(`ornament:modal:close-any`);
    },

    openAjaxModal: (url, size) => {
      Ornament.triggerEvent(`ornament:modal:global-ajax:load`, { url, size });
    },

    // =========================================================================
    // Page offset positioning
    // =========================================================================

    // When a modal opens, offset the page element to make it appear as
    // though the page scroll has been locked
    offsetPage: () => {
      if(!Modal.$positioner) {
        return;
      }

      Modal.scrollOffset = document.documentElement.scrollTop;
      Modal.$positioner.style.top = (Modal.scrollOffset * -1) + "px";
      Modal.$positioner.style.position = "relative";
      Modal.classTarget.classList.add("modal-open");
    },

    // Restore scroll position when closing modal
    restorePage: () => {
      if(!Modal.$positioner) {
        return;
      }

      Modal.classTarget.classList.remove("modal-open");
      Modal.$positioner.style.top = "";
      Modal.$positioner.style.position = "";
      scrollTo(0, Modal.scrollOffset);
      Modal.scrollOffset = 0;
    },

    // =========================================================================
    // Init
    // =========================================================================

    // Because we're using Rails.delegate, we don't want these events to be bound
    // every time a turbolinks page is loaded, so we want to only ensure this ever
    // runs once.
    // If this code were in .init() it would be run every time a page is navigated
    // to via turbolinks, which can stack multiple modal loads for one button
    // click
    initOnce: () => {
      // Delegate modal opener links
      Rails.delegate(document, `[${Modal.selectors.anchors}]`, "click", event => {
        const $node = event.target;
        const id = $node.getAttribute(Modal.selectors.anchors);
        if(!id) {
          console.warn("[MODAL] Modal anchor missing value for data-modal");
        } else {

          // If the anchor is a linked modal, close any open modals then
          // open the new modal
          if($node.hasAttribute(Modal.selectors.linkedAnchors)) {
            Modal.closeAnyModal();
            setTimeout(() => {
              Modal.openModal(id);
            }, 100);
          } else {
            Modal.openModal(id);
          }
        }
      });

      // Delegate modal closer links
      Rails.delegate(document, `[${Modal.selectors.closers}]`, "click", event => {
        const $node = event.target;
        const id = $node.getAttribute(Modal.selectors.closers);
        if(!id) {
          Modal.closeAnyModal();
        } else {
          Modal.closeModal(id);
        }
      });

      // Ajax modal openers
      Rails.delegate(document, `[${Modal.selectors.ajaxAnchors}]`, "click", event => {
        const $node = event.target;
        const url = $node.getAttribute(Modal.selectors.ajaxAnchors);
        const size = $node.getAttribute(Modal.selectors.size);
        if(!url) {
          console.warn("[MODAL] Ajax modal missing URL");
        } else {
          Modal.openAjaxModal(url, size);
        }
      });
    },

    init: () => {
      Modal.classTarget = document.querySelector("body");
      Modal.$positioner = document.querySelector(`[${Modal.selectors.pagePositioner}]`);
    }

  }

  Ornament.registerComponent("Modal", Modal);
  Modal.initOnce();

}(document, window));