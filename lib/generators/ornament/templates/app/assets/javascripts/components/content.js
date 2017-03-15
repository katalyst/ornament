/*jslint browser: true, indent: 2, todo: true, unparam: true */
/*global jQuery,Ornament /*/

(function (document, window, $) {

  "use strict";

  $(document).on("ornament:refresh", function () {

    var ContentHelpers = Ornament.C.ContentHelpers = {

      tableWrapperClass: "table-container",

      wrapTable: function($table){
        if(!$table.parent("." + ContentHelpers.tableWrapperClass).length) {
          $table.wrap("<div class='" + ContentHelpers.tableWrapperClass + "' />");
        }
      },

      init: function(){
        $(".content,[data-scrollable-tables]").each(function(){
          var $container = $(this);
          $container.find("table").each(function(){
            ContentHelpers.wrapTable($(this));
          });
        });
      }
    };

    ContentHelpers.init();

  });

}(document, window, jQuery));