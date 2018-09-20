(function (document, window) {
  "use strict";

  var Tabs = {

    selectors: {
      anchors: "data-tab",
      panes: "data-tab-for",
    },

    groupsConfigured: [],

    init: function(){
      if(!Ornament.C.Toggle) {
        console.warn("[Ornament Tabs] Cannot setup tabs - Ornament.C.Toggle not found");
        return;
      }
      
      document.querySelectorAll("[" + Tabs.selectors.anchors + "]").forEach(function($anchor){
        var toggleId = $anchor.getAttribute("data-tab");
        var group = $anchor.getAttribute("data-tab-group");
        var $panes = Ornament.U.findData(Tabs.selectors.panes, toggleId);

        $anchor.removeAttribute("data-tab");
        $anchor.removeAttribute("data-tab-group");
        $anchor.setAttribute("data-toggle-anchor", toggleId);
        $anchor.setAttribute("data-toggle-group", group);
        $anchor.setAttribute("data-toggle-one-way", true);
        $anchor.setAttribute("data-toggle-timing", 1);

        $panes.forEach(function($pane) {
          $pane.removeAttribute("data-tab-for");
          $pane.setAttribute("data-toggle", toggleId);
          $pane.setAttribute("data-toggle-immediate", true);
        });

        if(Tabs.groupsConfigured.indexOf(group) === -1) {
          $anchor.setAttribute("data-toggle-anchor-default", true);
          $anchor.classList.add(Ornament.C.Toggle.toggleClass);
          $panes[0].setAttribute("data-toggle-default", true);
          Tabs.groupsConfigured.push(group);
        }

        Ornament.C.Toggle.bindAnchor($anchor);
      });

      Ornament.beforeTurbolinksCache(function(){
        Tabs.groupsConfigured = [];
      })
    }
  }

  Ornament.registerComponent("Tabs", Tabs);

}(document, window));