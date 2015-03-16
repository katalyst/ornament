Ornament = window.Ornament = {

  // Default arrays for external links script
  externalLinkExtensions: [],
  internalLinkSelectors: [],

  // Header Breakpoint
  // Should match $breakpoint-header in settings.css
  headerBreakpoint: 990,

  // See if anything is sticky and calc their heights
  getStickyHeights: function(comparison){
    var comparison = comparison || 0;
    var heightOfStickies = 0;
    var $stickies = $("[data-sticky]");

    $stickies.each(function(){

      var $sticky = $(this);
      var thisStickyOffset = $sticky.attr("data-sticky-offset");
      if(comparison > thisStickyOffset) {
        heightOfStickies = $sticky.outerHeight();
      }

    });

    return heightOfStickies;
  }

};
