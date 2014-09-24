/*jslint browser: true, indent: 2, todo: true, unparam: true */
/*global jQuery,Ornament /*/

(function (document, window, $) {

  "use strict";

  $(document).on("ornament:refresh", function () {

    // Issuu currently has different embeds for mobile and desktop
    // Due to the nature of the mobile embed it's difficult to make it respond nicely
    // This is a little javascript helper to nudge the mobile embed in to a nicer
    // position for styling responsively.

    // Keep checking if an issuu is rendered then add a class
    var updateMobileIssuu = function($issuu){
      if( $issuu.hasClass("issuu-isrendered") ) {
        $issuu.addClass("issuu__mobile");
      } else {
        // debounce class 
        setTimeout(function(){
          updateMobileIssuu($issuu);
        }, 200);
      }
    }

    // Update all mobile issuus
    var updateMobileIssuus = function(){
      var $mobileIssuus = $(".issuuembed .pcover");
      $mobileIssuus.each(function(){
        var $issuu = $(this).parent(".issuuembed");
        if($issuu.length) {
          updateMobileIssuu($issuu);
        }
      });
    }

    // Update issuu api on page load
    window.onIssuuReadersLoaded = function(){
      updateMobileIssuus();
    }

  });

}(document, window, jQuery));