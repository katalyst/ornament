(function (document, window, Orn, Utils) {
  "use strict";

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
      var $checkbox = document.querySelector(checkboxSelector);
      var fieldKeys = Object.keys(fields);

      var toggleFields = function() {
        for (var i = fieldKeys.length - 1; i >= 0; i--) {
          var $shippingField = document.querySelector(fields[fieldKeys[i]]);

          // if checked, get keys and copy values in to fields
          if($checkbox.checked) {
            var $billingField = document.querySelector(fieldKeys[i]);
            $shippingField.value = $billingField.value;

          // if unchecked, empty shipping fields 
          } else {
            $shippingField.value = "";
          }
        }
      }

      // toggleFields on page load
      toggleFields();

      // bind change event
      Ornament.U.bindOnce($checkbox, "change", toggleFields);
    },

    init: function(){
      // Maybe this should be a utility instead, there's nothing to do on load.
    }
  }
  
  Orn.registerComponent("FormBillingToShipping", FormBillingToShipping);

}(document, window, Ornament, Ornament.Utilities));