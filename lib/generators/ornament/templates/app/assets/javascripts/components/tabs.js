$(function(){

  // Wrapped functionality in a .each() to 
  // enable multiple tabbed areas on the same page
  $(".tabbed").each(function(){

    // Save our objects as variables
    var $tabbed = $(this),
        $tabs_nav = $tabbed.find(".tabs--nav a"),
        $tabs_panes = $tabbed.find(".tabs--panes > div");

    // Hide all panes
    function tabs__hide_all(){
      $tabs_panes.hide();
    }

    // Tab actions
    $tabs_nav.click(function(e){
      // Stop default actions
      e.preventDefault();

      // get the target
      var $tab = $(this),
          target = $tab.attr("data-show");

      // Show pane
      tabs__hide_all();
      $tabbed.find("#"+target).show();

      // Set active states
      $tabs_nav.removeClass("is-active");
      $tab.addClass("is-active");

    });

    // Activate first tab by default
    $tabs_nav.first().click();

  });

/*
  // save our objects as variables
  var $tabs_nav = $(".tabs--nav a"),
      $tabs_panes = $(".tabs--panes");

  // hide all panes
  function tabs__hide_all(){
    $tabs_panes.hide();
  }

  // show pane
  function tabs__show_pane(target){
    tabs__hide_all();
    $("#"+target).show();
  }

  // tab actions
  $tabs_nav.click(function(e){
    // stop right there, criminal scum
    e.preventDefault();

    // get the target
    var $tab = $(this);
    var target = $tab.attr("data-show");

    // show pane
    tabs__hide_all();
    $("#"+target).show();

    // set "is-active" on tabs
    $tabs_nav.removeClass("is-active");
    $tab.addClass("is-active");

  });

  // show first tab by default
  $tabs_nav.first().click();
*/

});