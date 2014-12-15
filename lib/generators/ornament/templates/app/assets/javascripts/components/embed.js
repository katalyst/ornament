/*jslint browser: true, indent: 2, todo: true, unparam: true */
/*global jQuery,Ornament /*/

(function (document, window, $) {

  "use strict";

  $(document).on("ornament:refresh", function () {

    // SOME HELPER FUNCTIONS FOR MOBILE ISSUU EMBEDS

    // Update a single mobile issuu
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

    // ISSUU PJAX HELPERS
    // Only needed for PJAX sites
    // Could also be helpful for AJAXed ISSUUs but would need testing

    /*
    var listenForPjaxedIssuus = function($issuu) {
      var $mobileItem = $issuu.find(".pcover");
      if($mobileItem.length) {
        updateMobileIssuu($issuu);
      } else {
        setTimeout(function(){
          listenForPjaxedIssuus($issuu);
        }, 200);
      }
    }
    $(document).on('pjax:complete', function() {
      $(document).trigger("ornament:refresh");
      var $issuus = $(".issuuembed");
      $issuus.each(function(){
        listenForPjaxedIssuus($(this));
      });
    });
    */

  });

}(document, window, jQuery));