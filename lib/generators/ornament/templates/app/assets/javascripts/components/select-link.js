/*jslint browser: true, indent: 2, todo: true, unparam: true */
/*global jQuery,Ornament /*/

(function (document, window, $) {

  "use strict";

  $(document).on("ornament:refresh", function () {

    var $linkableSelects = document.querySelectorAll("[data-select-link]");
    var currentUrl = document.location.pathname;

    // On click change
    $linkableSelects.forEach(function($thisSelect){
      
      Ornament.U.bindOnce($thisSelect, "change", function(){
        var url = $thisSelect.value;
        if(url != "") {
          document.location = url;
        }
      });

      // Default state
      if ( $thisSelect.querySelector("option[value='"+currentUrl+"']").length > 0 ) {
        $thisSelect.value = currentUrl;
      }

    });

  });

}(document, window, jQuery));