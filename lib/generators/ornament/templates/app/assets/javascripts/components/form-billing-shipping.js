"use strict";

(function (document, window, Orn, Utils) {

  var FormBillingToShipping = {

    // =========================================================================
    // Billing to Shipping Helper
    // 
    // Usage:
    // Ornament.C.FormBillingToShipping.create("#checkout_use_billing_address", {
    //   "#billing_address_1": "#shipping_address_1",
    //   "#billing_address_2": "#shipping_address_2",
    //   "#billing_state": "#shipping_state",
    //   "#billing_country": "#shipping_country"
    // });
    // =========================================================================

    create: function(checkboxSelector, fields) {
      var $checkbox = $(checkboxSelector);
      var fieldKeys = Object.keys(fields);

      var toggleFields = function() {
        for (var i = fieldKeys.length - 1; i >= 0; i--) {
          var $shippingField = $(fields[fieldKeys[i]]);

          // if checked, get keys and copy values in to fields
          if($checkbox.is(":checked")) {
            var $billingField = $(fieldKeys[i]);
            $shippingField.val($billingField.val());

          // if unchecked, empty shipping fields 
          } else {
            $shippingField.val("");
          }
        }
      }

      // toggleFields on page load
      toggleFields();

      // bind change event
      $checkbox.off("change", toggleFields).on("change", toggleFields);
    },

    init: function(){
      // Maybe this should be a utility instead, there's nothing to do on load.
    }
  }
  
  Orn.registerComponent("FormBillingToShipping", FormBillingToShipping);

}(document, window, Ornament, Ornament.Utilities));