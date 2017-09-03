/*jslint browser: true, indent: 2, todo: true, unparam: true */
/*global jQuery,Ornament */

(function (document, window, $) {

  "use strict";

  $(document).on("ornament:refresh", function() {

    var PaginationHelper = Ornament.Components.PaginationHelper = {

      enabled: false,
      paginationSelector: ".pagination",
      currentPageSelector: ".page.current",
      pageSelector: ".page",

      getCurrentPage: function(){
        return PaginationHelper.$pagination.find(PaginationHelper.currentPageSelector);
      },

      getPages: function(){
        return PaginationHelper.$pagination.find(PaginationHelper.pageSelector);
      },

      isOnFirstPage: function(){
        return PaginationHelper.getCurrentPage().is(PaginationHelper.getPages().first());
      },

      isOnLastPage: function(){
        return PaginationHelper.getCurrentPage().is(PaginationHelper.getPages().last());
      },

      showHidePagination: function(){
        if(PaginationHelper.isOnFirstPage() || PaginationHelper.isOnLastPage()) {
          return false;
        } else {
          var $current = PaginationHelper.getCurrentPage();
          if(Ornament.windowWidth() <= 430) {
            $current.prev(".page").prev(".page").hide();
            $current.next(".page").next(".page").hide();
          } else {
            $current.prev(".page").prev(".page").show();
            $current.next(".page").next(".page").show();
          }
        }
      },

      init: function(){
        // push the pagination to the component
        PaginationHelper.$pagination = $(PaginationHelper.paginationSelector);
        // listen on window resize to show or hide pagination 
        $(window).off("resize", PaginationHelper.showHidePagination).on("resize", PaginationHelper.showHidePagination);
        // show or hide pagination on page load
        PaginationHelper.showHidePagination();
      }
    }

    if(PaginationHelper.enabled && $(PaginationHelper.paginationSelector).length > 0) {
      PaginationHelper.init();
    }

  });

}(document, window, jQuery));