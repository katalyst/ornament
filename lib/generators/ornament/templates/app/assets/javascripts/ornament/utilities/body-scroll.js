"use strict";

Ornament.U.bodyScroll = function(offset, timing){
  $("html,body").animate({
    scrollTop: offset
  }, timing);
};