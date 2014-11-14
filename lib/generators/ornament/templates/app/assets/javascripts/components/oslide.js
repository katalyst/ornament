/*jslint browser: true, indent: 2, todo: true, unparam: true */
/*global jQuery,Ornament /*/

/*

  TODO:
  * Fix left over gutter on width calculations
  * SlideBy visible slide count
  * Swipable
  * Shadows
  * Deeplink to active slide
  * Rebuild sliders (when hidden from tabs/lightboxes/whatever)
*/

(function (document, window, $) {

  "use strict";

  $.fn.extend({
    oslide: function(options) {

      var defaults = {
        
        // Functional settings
        slideBy                 : 1,
        debug                   : true,
        swipeable               : false,
        itemWidth               : 190,
        slideTiming             : 300,
        
        // Selectors
        slideSelector           : "[data-slide]",
        
        // Classes
        oslideContainerClass    : "oslide--container",
        slideContainerClass     : "oslide--slides",
        slideClass              : "oslide--slide",
        slideActiveClass        : "oslide--slide__active",
        nextButtonClass         : "oslide--next",
        previousButtonClass     : "oslide--previous",
        initialisedClass        : "oslide__init",
        shadowLeftClass         : "shadow-left",
        shadowRightClass        : "shadow-right",

        // Text Customisations
        nextButtonText          : "Next",
        previousButtonText      : "Previous",

        // Callbacks
        onSetup                 : null,
        onDestroy               : null,
        afterSlide              : null,
        afterPreviousSlide      : null,
        afterNextSlide          : null

      }

      var options =  $.extend(defaults, options);

      // Loop over each oslide
      return this.each(function() {

        // =============================================
        // INTERNAL SETTINGS
        // =============================================

        var $oslide = $(this);
        var $slides = $oslide.find(options.slideSelector);
        var totalSlides = $slides.length;
        var $oslideContainer = null;
        var $slideContainer = null;
        var $previousButton = null;
        var $nextButton = null;
        var $activeSlide = null;
        var $lastSlide = $slides.last();

        // =============================================
        // SCAFFOLDING, DESTROYING AND REBUILDING
        // =============================================

        // Get the width of all the slides in the slider
        // so that we can extend the width of the conainer
        // to fit the slides in to it
        var getWidthNeededForSlides = function(){

          // Calculate width of all of the slides
          // DEPR: This was causing grief with images
          // Might come back at some point to see if this is possible again

          // var widthOfSlider = 0;
          // $slides.each(function(){
          //   widthOfSlider = widthOfSlider + this.getBoundingClientRect().width;
          // });
          
          var widthOfSlider = (options.itemWidth * totalSlides);
          return widthOfSlider;
        }

        // Set width of slider
        // This is probably only ever going to be used along with
        // the getWidthNeededForSlides function, but I made it 
        // possible to pass in another value if you ever need to
        var setWidthOfSlider = function(newWidth){
          $slideContainer.width(newWidth);
        }

        // Scaffold up a slider
        var setupSlider = function(){

          // add container around the slider
          // this container will be 100% width with overflow:hidden
          // so that the extended slider will cut off be still be 
          // slidable or scrollable
          $oslideContainer = $("<div class='"+options.oslideContainerClass+"' />");
          $oslide.append($oslideContainer);

          // move slides in to a container
          $slideContainer = $("<div class='"+options.slideContainerClass+"' />");
          $slides.appendTo($slideContainer);
          $oslideContainer.append($slideContainer);

          // extend width of container to fit the slides
          setWidthOfSlider(getWidthNeededForSlides);

          // add previous/next buttons
          $nextButton = $("<div class='"+options.nextButtonClass+"'>"+options.nextButtonText+"</div>");
          $previousButton = $("<div class='"+options.previousButtonClass+"'>"+options.previousButtonText+"</div>");
          $oslide.append($nextButton).append($previousButton);

          // TODO: Possibility for deep-linking here
          $activeSlide = $slides.first();
          $activeSlide.addClass(options.slideActiveClass);

          setShadows();

        }

        // Destroy a slider and return to original markup
        var destroySlider = function(){

        }

        // Destroy a slider and rebuild
        var rebuildSlider = function(){

        }

        // Set shadows on slider 
        var setShadows = function(){



          $oslide.addClass(options.shadowLeftClass);
          $oslide.addClass(options.shadowRightClass);
        }

        // =============================================
        // GETTING THINGS FROM OUR SLIDER
        // =============================================

        var getNumberOfItemsVisible = function(){
          var oslideWidth = $oslideContainer.outerWidth();
          return parseInt(oslideWidth / options.itemWidth);
        }

        // Return true or false if the last slide is visible
        var isLastSlideVisible = function(){
          if( (getCurrentSlideOffset() + $oslideContainer.outerWidth()) > getWidthNeededForSlides() ) {
            return true;
          } else {
            return false;
          }
        }

        // Return the index of the current slide
        var getCurrentSlideIndex = function(){
          return $activeSlide.index();
        }

        // Return the jQuery element of the current slide
        var getCurrentSlideElement = function(){
          return $($slides[getCurrentSlideIndex]);
        }

        // Return the offset left of a slide
        var getSlideItemOffset = function($slide) {
          // return $slide.offset().left - $oslide.offset().left;
          return getCurrentSlideIndex() * options.itemWidth;
        }

        // Return the offset left of the current slide
        // Theoretically should always be zero
        var getCurrentSlideOffset = function(){
          return getSlideItemOffset($activeSlide);
        }

        // Returns either the next slide index or the first slide 
        // index if there are no more slides
        var getNextSlideIndex = function(){

          var currentIndex = getCurrentSlideIndex();
          if(isLastSlideVisible()) {
            return 0;
          } else {
            return currentIndex + 1;
          }

        }

        // Returns either the previous slide index or the last
        // slide index if the first one is the current slide
        var getPreviousSlideIndex = function(){

          var currentIndex = getCurrentSlideIndex();
          if(currentIndex == 0) {
            return totalSlides - getNumberOfItemsVisible();
          } else {
            return currentIndex - 1;
          }

        }

        // =============================================
        // MOVEMENT FUNCTIONS
        // =============================================

        // Generic "go to slide" function
        // Takes an index and slides to it
        var goToSlide = function(index){

          // Prevent changing slides if the slider is animated
          if($oslideContainer.is(":animated")) {
            return false;
          }

          // Remove active class from current slide
          $activeSlide.removeClass(options.slideActiveClass);

          // Change active slide to the appropriate index
          $activeSlide = $($slides[index]);
          $activeSlide.addClass(options.slideActiveClass);

          // scroll to position
          $oslideContainer.animate({
           scrollLeft: getCurrentSlideOffset()
          }, options.slideTiming);

          // Callback after slide has finished
          if(options.afterSlide) {
            options.afterSlide();
          }
        }

        // Generic go to next slide function
        var goToNextSlide = function(){
          goToSlide(getNextSlideIndex());

          if(options.afterNextSlide) {
            options.afterNextSlide();
          }
        }

        // Generic go to previous slide function
        var goToPreviousSlide = function(){
          goToSlide(getPreviousSlideIndex());

          if(options.afterPreviousSlide) {
            options.afterPreviousSlide();
          }
        }

        // =============================================
        // BINDINGS AND PAGE LOAD FUNCTIONS
        // =============================================

        // Only scaffold and bind if not already initialised
        if(!$oslide.hasClass(options.initialisedClass)) {

          // Scaffold this slider
          setupSlider();

          // Slider bindings
          // eg. $(".slider").trigger("oslide:next");

          $oslide.bind("oslide:rebuild", function(){
            rebuild();
          });
          $oslide.bind("oslide:next", function(){
            goToNextSlide();
          });
          $oslide.bind("oslide:previous", function(){
            goToPreviousSlide();
          });
          $oslide.bind("oslide:update-shadows", function(){
            setShadows();
          });

          // Button bindings
          // Todo: Maybe this should be part of scaffolding
          // or maybe another bindButtons functions or something?

          if($nextButton) {
            $nextButton.bind("click", function(){
              goToNextSlide();
            });
          }
          if($previousButton) {
            $previousButton.bind("click", function(){
              goToPreviousSlide();
            });
          }

          // Things to do when resizing
          $(window).on("resize", function(){
            $oslide.trigger("oslide:update-shadows");
          });

          // Add class to say it's initialised
          $oslide.addClass(options.initialisedClass);
        }

      });
    }
  });

  // $(document).on("ornament:refresh", function(){
  //   $("[data-oslide]").oslide();
  // });

}(document, window, jQuery));