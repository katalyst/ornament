"use strict";

(function (document, window, Orn, Utils) {

  var ContentHelpers = Ornament.C.WysiwygHelpers = {

    // =========================================================================
    // Wrap tables with a table-container class to add responsive scrolling 
    // =========================================================================
    tableWrapperClass: "table-container",

    wrapTable: function($table){
      if(!$table.parent("." + ContentHelpers.tableWrapperClass).length) {
        $table.wrap("<div class='" + ContentHelpers.tableWrapperClass + "' />");
      }
    },

    init: function(){
      $(".content,[data-scrollable-tables]").each(function(){
        $(this).find("table").each(function(){
          ContentHelpers.wrapTable($(this));
        });
      });
    }
  };

  $(document).on("ornament:refresh", function () {
    ContentHelpers.init();
  });

}(document, window, jQuery));