/*jslint browser: true, indent: 2, todo: true, unparam: true */
/*global jQuery,Ornament /*/

/* 
  Conform.js v1.0
  https://bitbucket.org/dbaines/conform

  Based on:
  http://css-tricks.com/equal-height-blocks-in-rows/
*/

(function (document, window, $) {

  "use strict";

  $(document).on("ornament:refresh", function () {

    //====================================================
    // Settings
    //====================================================

    // Our target groups
    var $conformSets = $("[data-conform-set]");
    var $conformMasters = $("[data-conform-master]");
    var $conformSetsByAnyOrder = $("[data-conform-agnostic]");

    // Offset variance for conforming things that don't quite 
    // line up (in pixels)
    var offsetVariance = 10;

    // Trigger the conforming again when images inside the 
    // columns load (boolean)
    var reconformOnImageLoads = false;

    // Trigger the conforming again when the page finishes
    // loading
    var reconformOnPageLoadFinish = true;

    // Debounce conform calls
    var debounceTimeout = 100;

    // Core settings and flags
    var currentTallest = 0;
    var currentRowStart = 0;

    //====================================================
    // Utility functions
    //====================================================

    // Utility to debounce a function call
    var debounceConform = function(func, wait, immediate){
      immediate = true; 
      var timeout;
      return function() {
        var context = this, args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(function() {
          timeout = null;
          if (!immediate) func.apply(context, args);
        }, wait);
        if (immediate && !timeout) func.apply(context, args);
      };
    }
    
    // Get original height of an element by reseting the height
    // and then measuring the element
    var getOriginalHeight = function($column) {
      return $column.css("height", "auto").outerHeight();
    }

    // Set heights on an array of divs
    var setHeightsForArray = function(rowDivs) {
      for (var currentDiv = 0; currentDiv < rowDivs.length; currentDiv++) {
        rowDivs[currentDiv].outerHeight(currentTallest);
      }
    }

    //====================================================
    // The Conform Function
    //====================================================

    var conformAGroupsOfColumns = function(allDivs) {
      $.each(allDivs, function(){
        setHeightsForArray(this);
      });
    }

    var conformColumnSetByAnyOrder = function($conformSet, $columns) {

      $columns.each(function(){
        currentTallest = 0;
        var $column = $(this);
        var isVisible = $column.is(":visible");
        var columnTop = $column.position().top;
        var columnTopMin = $column.position().top - offsetVariance;
        var columnTopMax = $column.position().top + offsetVariance;
        var shouldConform = !($column.is("[data-conform-agnostic-listener]") && $column.attr("data-conform-agnostic-listener") == "active")

        // Ignore re-conforming if this column has already been listened to
        if(shouldConform) {

          // Get all divs on same line:
          // https://forum.jquery.com/topic/select-items-on-the-same-line
          var $matchingColumns = $columns.filter(function(){
            return $(this).position().top == columnTop;
          });

          // Loop over columns on the same line and conform them
          $matchingColumns.each(function(){
            var $column = $(this);
            // add a data attribute to mark this div as already considered for conforming
            // this way we don't loop over things that have already been conformed.
            $column.attr("data-conform-agnostic-listener", "active");
            var columnHeight = getOriginalHeight($column);
            if(columnHeight > currentTallest) {
              currentTallest = columnHeight;
            }
          });

          $matchingColumns.each(function(){
            var $column = $(this);
            $column.outerHeight(currentTallest);
          });

        }
      });

      // Remove listener on all columns so that we can reconform them on resize/
      // triggers etc.
      $columns.removeAttr("data-conform-agnostic-listener");
    }

    var conformColumnSet = function($conformSet) {
      var conformId = $conformSet.attr("data-conform-set");
      if(conformId) {
        var $columns = $conformSet.find("[data-conform="+conformId+"]");
      } else {
        var $columns = $conformSet.find("[data-conform]");
      }

      if($conformSet.is("[data-conform-agnostic]")) {
        conformColumnSetByAnyOrder($conformSet, $columns);
        return false;
      }

      // Create a new empty array for our columns to go into
      var rowDivs = [];

      // Loop over each olumn
      $columns.each(function(){
        var $column = $(this);
        var isVisible = $column.is(":visible");
        var columnTop = $column.position().top;
        var columnTopMin = $column.position().top - offsetVariance;
        var columnTopMax = $column.position().top + offsetVariance;

        // Only conform visible columns
        // This stops hidden columns from breaking the 
        // conform. Hidden columns will have different
        // offsets from visible columns.
        if(isVisible) {

          // console.log(currentRowStart, columnTopMin, columnTopMax);

          // If the current row start doesn't equal the top 
          // position of the current div, we can assume we've
          // come to a new row
          if(currentRowStart < columnTopMin || currentRowStart > columnTopMax) {

            // Loop over each div and size them
            setHeightsForArray(rowDivs);

            // Empty the array
            rowDivs.length = 0; 
            // Update our variables
            currentRowStart = $column.position().top;
            currentTallest = getOriginalHeight($column);
            rowDivs.push($column);

          } else {
            // Push current column in to our divs array
            rowDivs.push($column);
            // If this div is bigger than the current tallest, update the variable
            if(currentTallest < getOriginalHeight($column)) {
              currentTallest = getOriginalHeight($column);
            }
          }

          // Do last column
          setHeightsForArray(rowDivs);
        }

      });
    }

    //====================================================
    // Conforming individual things
    //====================================================

    // Conform a single conformset
    var conformASet = function($conformSet) {
      debounceConform(conformColumnSet($conformSet), debounceTimeout, false);

      // If this is a nested conform, we may need to reconform
      // any parent conform sets.
      var $parentConforms = $conformSet.parents("[data-conform-set]");
      $parentConforms.each(function(){
        var $parentConform = $(this);
        conformColumnSet($parentConform);
      });

      // Check if we need to reconform after image load
      var $conformImages = $conformSet.find("[data-conform] img");
      if(reconformOnImageLoads || $conformSet.is("[data-conform-images]")) {
        $conformImages.on("load", function(){
          debounceConform(conformColumnSet($conformSet), debounceTimeout, false);
        });
      }

      // Check if we need to reconform after page load
      if(reconformOnPageLoadFinish) {
        $(window).bind("load", function(){
          debounceConform(conformColumnSet($conformSet), debounceTimeout, false);
        });
      }
    }

    // Conform a single master/slave relationship
    var conformMasterSlave = function($conformMaster) {
      var conformMasterId = $conformMaster.attr("data-conform-master");
      var $conformSlave = $("[data-conform-slave='" + conformMasterId + "']");
      var masterHeight = getOriginalHeight($conformMaster);
      var slaveHeight = getOriginalHeight($conformSlave);
      var shouldConform = $conformMaster.offset().top == $conformSlave.offset().top;

      if(!shouldConform) {
        return false;
      }

      // Set the height from the master
      if(masterHeight > slaveHeight) {
        $conformSlave.outerHeight(masterHeight);
      } else {
        $conformSlave.height("auto");
      }

      // Reconform on image loads if needed
      if(reconformOnImageLoads) {
        $conformMaster.find("img").on("load", function(){

          // Set the height from the master
          if(masterHeight > slaveHeight) {
            $conformSlave.outerHeight(masterHeight);
          } else {
            $conformSlave.height("auto");
          }

        });
        $conformSlave.find("img").on("load", function(){

          // Set the height from the master
          if(masterHeight > slaveHeight) {
            $conformSlave.outerHeight(masterHeight);
          } else {
            $conformSlave.height("auto");
          }

        });
      }

      // Reconform on page load finish
      if(reconformOnPageLoadFinish) {
        $(window).bind("load", function(){
          conformMasterSlave($conformMaster);
        });
      }
    }

    //====================================================
    // Conforming all things
    //====================================================

    // Conform all sets
    var runAllConformSets = function() {
      $conformSets.each(function(){
        var $conformSet = $(this);
        conformASet($conformSet);
      });
    }

    // Conform master/slaves
    var runAllMasterSlaveConforms = function(){
      $conformMasters.each(function(){
        conformMasterSlave($(this));
      });
    }

    // Conform everything
    var runAllConforms = function(){
      runAllConformSets();
      runAllMasterSlaveConforms();
    }

    //====================================================
    // Bindings and Triggers
    //====================================================

    // Create bindings to conform single sets
    var bindConformTriggers = function($conformSet) {

      // Trigger conforms for a conformset
      // $(".my-conforms").trigger("reconform");
      $conformSets.each(function(){
        var $set = $(this);
        $set.bind("reconform", function(){
          conformASet($set);
        });
      });

      $conformMasters.each(function(){
        var $master = $(this);
        $master.bind("reconform", function(){
          conformMasterSlave($master);
        });
      })

      // Trigger all conforms on page
      // $(document).trigger("conform-columns");
      $(document).bind("conform-columns", function(){
        runAllConforms();
      });

      // Trigger all conform sets on the page
      // $(document).trigger("conform-column-sets");
      $(document).bind("conform-column-sets", function(){
        runAllConformSets();
      });

      // Trigger all master slave groups on page
      // $(document).trigger("conform-master-slaves");
      $(document).bind("conform-master-slaves", function(){
        runAllMasterSlaveConforms();
      });

    }

    //====================================================
    // Page Load Events
    //====================================================

    // Run all conforms on page load
    runAllConforms();

    // Bind event triggers
    bindConformTriggers();

    //====================================================
    // Window Resize Listener
    //====================================================

    // Run all conforms on window resize
    $(window).on("resize", function(){
      runAllConforms();
    });

  });

}(document, window, jQuery));