(function (document, window) {
  "use strict";

  var EmbedHelpers = {

    classes: {
      youtube: "embed__youtube"
    },

    // SOME HELPER FUNCTIONS FOR MOBILE ISSUU EMBEDS
    updateMobileIssuu: function($issuu){
      if( $issuu.classList.contains("issuu-isrendered") ) {
        $issuu.classList.add("issuu__mobile");
      } else {
        // debounce class 
        setTimeout(function(){
          updateMobileIssuu($issuu);
        }, 200);
      }
    },

    // Update all mobile issuus
    updateMobileIssuus: function(){
      var $mobileIssuus = document.querySelector(".issuuembed .pcover");
      $mobileIssuus.forEach(function($node){
        var $issuu = $node.parentNode;
        if($issuu && $issuu.classList.contains("issuuembed")) {
          EmbedHelpers.updateMobileIssuu($issuu);
        }
      });
    },

    // Youtube helper
    wrapYoutube: function($video) {
      if($video.parentNode.classList.contains(EmbedHelpers.classes.youtube)) {
        return;
      }
      var $wrapper = document.createElement("div");
      $wrapper.classList.add(EmbedHelpers.classes.youtube);
      $video.parentNode.insertBefore($video, $wrapper);
      $wrapper.appendChild($video);
    },

    init: function(){
      // Update issuu api on page load
      window.onIssuuReadersLoaded = function(){
        EmbedHelpers.updateMobileIssuus();
      }

      document.querySelectorAll("iframe[src^='//www.youtube']").forEach(function($video){
        EmbedHelpers.wrapYoutube($video);
      });

      document.querySelectorAll("iframe[src^='https://www.youtube']").forEach(function($video) {
        EmbedHelpers.wrapYoutube($video);
      });
    }

  }

  Ornament.registerComponent("EmbedHelpers", EmbedHelpers);

}(document, window));