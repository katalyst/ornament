(function (document, window) {
  "use strict";

  var SelectLink = {
    init: function(){
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
        if ( $thisSelect.querySelector("option[value='"+currentUrl+"']") ) {
          $thisSelect.value = currentUrl;
        }
    
      });
    }
  }

  Ornament.registerComponent("SelectLink", SelectLink);

}(document, window));