(function (document, window) {
  "use strict";

  var PaginationHelper = {

    enabled: false,
    breakpoint: 430,

    selectors: {
      pagination: ".pagination",
      currentPage: ".pagination--page.current",
      page: ".pagination--page"
    },

    getCurrentPage: function($pagination){
      return $pagination.querySelector(PaginationHelper.currentPageSelector);
    },

    getPages: function($pagination){
      return $pagination.querySelectorAll(PaginationHelper.pageSelector);
    },

    showHidePagination: function(){

      PaginationHelper.$pagination.forEach(function($pagination){
        var $currentPage = PaginationHelper.getCurrentPage($pagination);
        var $allPages = PaginationHelper.getPages($pagination);

        // Check if first or last page
        if($currentPage === $allPages[0] || $allPages[$allPages.length - 1]) {
          return;
        } else {
          var currentIndex = $allPages.indexOf($currentPage);
          var $minusOne = $allPages[currentIndex - 1];
          var $minusTwo = $allPages[currentIndex - 2];
          var $plusOne = $allPages[currentIndex + 1];
          var $plusTwo = $allPages[currentIndex + 2];
          var setDisplayTo = Ornament.windowWidth() <= PaginationHelper.breakpoint ? "none" : "block";
          if($minusOne) {
            $minusOne.style.display = setDisplayTo;
          }
          if($minusTwo) {
            $minusTwo.style.display = setDisplayTo;
          }
          if($plusOne) {
            $plusOne.style.display = setDisplayTo;
          }
          if($plusTwo) {
            $plusTwo.style.display = setDisplayTo;
          }
        }

      });
    },

    init: function(){
      if(!PaginationHelper.enabled) {
        return;
      }
      // push the pagination to the component
      PaginationHelper.$pagination = document.querySelectorAll(PaginationHelper.paginationSelector);
      // listen on window resize to show or hide pagination 
      Ornament.U.bindOnce(window, "resize", PaginationHelper.showHidePagination);
      // show or hide pagination on page load
      PaginationHelper.showHidePagination();
    }
  }

  Ornament.registerComponent("PaginationHelper", PaginationHelper);

}(document, window));