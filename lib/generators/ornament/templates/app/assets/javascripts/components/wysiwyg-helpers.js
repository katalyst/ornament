(function (document, window, Orn, Utils) {
  "use strict";

  var ContentHelpers = {

    // =========================================================================
    // Wrap tables with a table-container class to add responsive scrolling 
    // =========================================================================
    selectors: {
      targetAreas: ".content,[data-scrollable-tables]",
      tableWrapperClass: "table-container"
    },

    wrapTable: function($table){
      if(!$table.parentNode.classList.contains(ContentHelpers.tableWrapperClass)) {
        var $container = document.createElement("div");
        $table.parentElement.insertBefore($container, $table);
        $container.appendChild($table);
      }
    },

    init: function(){
      var $targets = document.querySelectorAll(ContentHelpers.selectors.targetAreas);

      // Find our target areas
      for(var i = 0; i < $targets.length; i++) {
        var $target = $targets[i];

        // Find tables and wrap them in scrollable container
        var $tables = $target.querySelectorAll("table");
        for(var j = 0; j < $tables.length; j++) {
          ContentHelpers.wrapTable($tables[j]);
        }
      }
    }
  };

  Ornament.registerComponent("WysiwygHelpers", ContentHelpers);

}(document, window, Ornament, Ornament.U));