/*jslint browser: true, indent: 2, todo: true, unparam: true */
/*global Ornament */

(function (document, window, $) {

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
        var toggleId = $anchor.dataset.tab;
        var group = $anchor.dataset.tabGroup;
        var $panes = Ornament.U.findData(Tabs.selectors.panes, toggleId);

        $anchor.removeAttribute("data-tab");
        $anchor.removeAttribute("data-tab-set");
        $anchor.dataset.toggleAnchor = toggleId;
        $anchor.dataset.toggleGroup = group;
        $anchor.dataset.toggleOneWay = true;
        $anchor.dataset.toggleTiming = 1;

        $panes.forEach(function($pane) {
          $pane.removeAttribute("data-tab-for");
          $pane.dataset.toggle = toggleId;
          $pane.dataset.toggleImmediate = true;
        });

        if(Tabs.groupsConfigured.indexOf(group) === -1) {
          $anchor.dataset.toggleAnchorDefault = true;
          $anchor.classList.add(Ornament.C.Toggle.toggleClass);
          $panes[0].dataset.toggleDefault = true;
          Tabs.groupsConfigured.push(group);
        }

        Ornament.C.Toggle.bindAnchor($anchor);
      });
    }
  }

  Ornament.registerComponent("Tabs", Tabs);

}(document, window));