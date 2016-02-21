/*jslint browser: true, indent: 2, todo: true, unparam: true */
/*global jQuery,Ornament /*/

(function (document, window, $) {

  "use strict";

  $(document).on("ornament:refresh", function () {

    var $filterSearch = $("[data-filter-results]");
    var demoMode = true;

    if($filterSearch.length) {
      $filterSearch.each(function(){

        var $search = $(this);

        // Filter blocker
        var $filterBlocker = $search.find("[data-filter-blocker]");

        // Results
        var $results = $("[data-filter-results-main]");

        // Search options
        var $searchOptions = $search.find("[data-filters]").find("input");
        var $searchSelects = $search.find("[data-filter-select]");

        // Performing a search
        var performSearch = function(){

          // Start searching
          $(document).trigger("ornament:filter-results:start");

          // Scroll up
          scrollTo(0,0);

          // Demo mode
          if(demoMode) {

            setTimeout(function(){
              // Update the count
              $("[data-filter-count]").html("9");

              // Get our results
              var results = $results.html();

              // Update the results
              $results.html(results);

              // Clean URL
              var url = document.location.pathname;
              url += "?" + $search.serialize();

              // Update URL with history state
              if(history && history.pushState) {
                var data = {
                  results: results
                }
                var title = "";
                history.pushState(data, title, url);
              }

              // Trigger complete event
              $(document).trigger("ornament:filter-results:complete");
            }, 200);

          } else {

            // Find the ajax URL to use
            var ajaxUrl = document.location.pathname;
            if(ajaxUrl.substr(ajaxUrl.length - 1) === "/") {
              ajaxUrl = ajaxUrl.substr(0, ajaxUrl.length - 1);
            }

            // Submit the form
            // $.ajax({
            //   url: ajaxUrl + ".js" + "?" + $search.serialize()
            // });

          }
        }

        // Changing options performs a search
        $searchOptions.on("change", function(){
          performSearch();
        });
        $searchSelects.on("change", function(){
          performSearch();
        });

        // Update page filters from the URL
        var updateFiltersFromURL = function(){
          var params = document.location.search;
          $searchOptions.prop("checked", false);
          if(params && params !== "?") {
            // Loop over params for sidebar filtering
            params = params.split("?")[1].split("&");
            $.each(params, function(){
              var param = this.split("=");
              var name = decodeURIComponent(param[0]);
              var value = param[1];
              if(value) {
                $("input[name='" + name + "'][value=" + value + "]").prop("checked", true);
              }
              $("select[name='" + name + "']").val(value);
            });
          } else {
            $searchOptions.prop("checked", false);
            $searchSelects.val("");
          }
        }

        // Starting a search filter should block out the controls
        $(document).on("ornament:filter-results:start", function(){
          $filterBlocker.show();
        });

        // Completing a search filter should remove the blocker
        $(document).on("ornament:filter-results:complete", function(){
          $filterBlocker.hide();
        });

        // Reload results from history
        $(window).on("popstate", function(){
          updateFiltersFromURL();
          $filterBlocker.hide();
          if(history.state && history.state.results) {
            $results.html(history.state.results);
          }
        });

        // Update filters from URL if necessary
        updateFiltersFromURL();

      });
    }

  });

}(document, window, jQuery));