//= require jquery.flexslider

$(function(){

  $(".slider").flexslider({
    namespace: "slider--",
    selector: ".slider--slides > li",
    pauseOnHover: true,
    //animation: "slide"
  });

});