$(function() {
  $(".layout--switch").on("click", function() {
    $(this).closest(".layout").toggleClass("layout-open");
    return false;
  });
});
