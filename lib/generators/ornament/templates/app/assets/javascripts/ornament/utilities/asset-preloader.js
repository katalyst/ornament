"use strict";

// Asset Loader
// Loads in an array of assets then removes itself
// usage: Ornament.assetPreloader(["/assets/image1.jpg", "/assets/image2.png"]);
Ornament.U.assetPreloader = function(assets){
  assets = assets || [];
  $.each(assets, function(){
    var image = new Image();
    image.src = this;
  });
};