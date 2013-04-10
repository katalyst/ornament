$(function() {
  $("body").on("click", "a[href^='#']:not(a[href='#'])", function() {
    $($(this).attr("href")).focus();
  });
});
