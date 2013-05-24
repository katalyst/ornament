$(document).on("click", ".tabs--link", function(e) {
  e.preventDefault();

  var $link, index, $tabs, $panes, $pane;
  
  $link = $(this);
  $tab = $(this).parent("li");
  index = $tab.index();
  $tabs = $tab.closest(".tabs");
  $panes = $tabs.find(".tabs--pane");
  $pane = $panes.eq(index);
  
  $panes.removeClass("tabs--pane-active").addClass("tabs--pane-inactive");
  $pane.removeClass("tabs--pane-inactive").addClass("tabs--pane-active");
  $tab.children("a").addClass("tabs--link-active").parent("li").siblings().children("a").removeClass("tabs--link-active");
});




///////////////// FOR DEMO PURPOSES ONLY ////////////////////////////////
$(function(){

  // this simulates an ajax load
  $(".demo--load-more").on("click", function(){
    var fauxAjax = '<h2 style="margin: 20px 0; font-size: 1.5em; font-weight: bold;">Simulated Ajax Load</h2>';
    fauxAjax = fauxAjax + '<div class="tabs">';
    fauxAjax = fauxAjax + '<nav class="navigation-horizontal">';
    fauxAjax = fauxAjax + '<ul>';
    fauxAjax = fauxAjax + '<li><a href="#tab1" class="tabs--link tabs--link-active">Tab #1</a></li>';
    fauxAjax = fauxAjax + '<li><a href="#tab2" class="tabs--link">Tab #2</a></li>';
    fauxAjax = fauxAjax + '<li><a href="#tab3" class="tabs--link">Tab #3</a></li>';
    fauxAjax = fauxAjax + '</ul>';
    fauxAjax = fauxAjax + '</nav>';
    fauxAjax = fauxAjax + '<div>';
    fauxAjax = fauxAjax + '<div class="tabs--pane">';
    fauxAjax = fauxAjax + 'Tab #1';
    fauxAjax = fauxAjax + '</div>';
    fauxAjax = fauxAjax + '<div class="tabs--pane">';
    fauxAjax = fauxAjax + 'Tab #2';
    fauxAjax = fauxAjax + '</div>';
    fauxAjax = fauxAjax + '<div class="tabs--pane">';
    fauxAjax = fauxAjax + 'Tab #3';
    fauxAjax = fauxAjax + '</div>';
    fauxAjax = fauxAjax + '</div>';
    fauxAjax = fauxAjax + '</div>';
    $(".layout--main").append(fauxAjax);
  });

});