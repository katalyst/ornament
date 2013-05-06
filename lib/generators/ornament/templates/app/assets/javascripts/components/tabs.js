$(function(){

  // Wrapped functionality in a .each() to 
  // enable multiple tabbed areas on the same page
  $(".tabs").each(function(){

    // Save our objects as variables
    var $tabs = $(this),
        $navLinks = $tabs.find(".tabs--nav a"),
        $panes = $tabs.find(".tabs--panes > div");

    // Hide all panes
    function tabsHideAll(){
      $panes.hide();
    }

    // Tab actions
    $navLinks.click(function(e){
      // Stop default actions
      e.preventDefault();

      // get the target
      var $tab = $(this),
          target = $tab.attr("href");

      console.log(target);

      // Show pane
      tabsHideAll();
      $tabs.find(target).show();

      // Set active states
      $navLinks.removeClass("is-active");
      $tab.addClass("is-active");

    });

    // Activate first tab by default
    $navLinks.first().click();

  });

});