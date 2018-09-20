"use strict";

// Import clipboard library
import ClipboardJS from "clipboard";

(function (document, window, Ornament) {

  var Styleguide = Ornament.Styleguide = {};

  // Fuzzysearch
  // https://github.com/bevacqua/fuzzysearch/blob/master/index.js
  Styleguide.fuzzySearch = function(needle, haystack){
    var hlen = haystack.length;
    var nlen = needle.length;
    if (nlen > hlen) {
      return false;
    }
    if (nlen === hlen) {
      return needle === haystack;
    }
    outer: for (var i = 0, j = 0; i < nlen; i++) {
      var nch = needle.charCodeAt(i);
      while (j < hlen) {
        if (haystack.charCodeAt(j++) === nch) {
          continue outer;
        }
      }
      return false;
    }
    return true;
  }

  Styleguide.addCopyLinkToCodeSample = function(container, index, value) {
    var copyBtnId = 'copy-btn-' + index.toString();
    var $button = document.createElement("button");
    $button.setAttribute("class", "sg-feature--copy");
    $button.setAttribute("id", copyBtnId);
    $button.setAttribute("data-copy-code", "");
    $button.setAttribute("type", "button");
    $button.innerText = "Copy";
    var content = container.querySelector("pre");
    container.insertBefore($button, container.firstChild);

    var clipboard = new ClipboardJS('#' + copyBtnId, {
      target: function(trigger) {
        return content;
      }
    });

    // Change the text of the copy button when it's clicked on
    clipboard.on('success', function(event) {
      $button.innerText = 'Copied!';
      window.setTimeout(function() {
        $button.innerText = 'Copy';
      }, 3000);
    });

    // Log errors on copy failure
    clipboard.on('error', function(event) {
      console.error('Action:', event.action);
      console.error('Trigger:', event.trigger);
    });
  }

  Styleguide.bindSidebarToggle = function(){
    // Updating first element after opening overlay to be the filter field
    Ornament.C.OverlayTray.focusTrap.firstAfterOpen = Styleguide.$sidebarFilter;
    Ornament.C.OverlayTray.breakTabLockAt = 920;
    // Blur filter field when closing
    Ornament.C.OverlayTray.afterClose = function(){
      Styleguide.$sidebarFilter.blur();
    }
  }

  Styleguide.filterNavigation = function(){
    var filter = Styleguide.$sidebarFilter.value;
    // Restore navigation if no filter
    if(!filter) {
      Styleguide.$sidebarFilterContainer.style.display = "none";
      Styleguide.$navigationContainer.style.display = "block";
      Styleguide.$sidebarFilterContainer.innerHTML = "";

    // Filter value is present
    } else {

      // Loop over navigation items
      var filterHTML = "";
      var $navItems = Styleguide.$navigationContainer.querySelectorAll("[data-styleguide-navigation-item]");
      for(var i = 0; i < $navItems.length; i++) {
        var $navItem = $navItems[i];
        var $link = $navItem.querySelector("a");
        var $icon = $navItem.querySelector("svg");
        var url = $link.getAttribute("href");
        var target = $link.hasAttribute("target") && $link.getAttribute("target");
        var label = $navItem.innerText;
        var section = $navItem.getAttribute("data-section");
        var keywords = $navItem.getAttribute("data-keywords") || "";

        var searchableComponents = keywords && keywords.split(",") || [];
        if(label) {
          searchableComponents.push(label.trim());
        }
        if(section) {
          searchableComponents.push(section.trim());
        }

        // Test for match
        var match = false;
        for(var j = 0; j < searchableComponents.length; j++) {
          var haystack = searchableComponents[j];
          if(Styleguide.fuzzySearch(filter.toLowerCase(), haystack.toLowerCase())) {
            match = true;
          }
        }

        // If match
        if(match) {
          filterHTML += "<div class='styleguide--filter-item'>";
          filterHTML += "  <a href='" + url + "' " + (target ? "target='" + target + "'" : "") + ">";
          filterHTML += "    <span>" + label + "</span>";
          if($icon) {
            filterHTML += $icon.outerHTML;
          }
          filterHTML += "    <br />";
          filterHTML += "    <small class='type--grey'>" + section + "</small>";
          filterHTML += "  </a>"
          filterHTML += "</div>";
        }
      }

      // Make a nicer empty state
      if(!filterHTML) {
        filterHTML = "<div class='styleguide--filter__empty'>There were no results.</div>";
      }

      // Update filter content
      Styleguide.$sidebarFilterContainer.innerHTML = filterHTML;

      // Hide navigation and show filtered content
      Styleguide.$sidebarFilterContainer.style.display = "block";
      Styleguide.$navigationContainer.style.display = "none";
    }
  }

  Styleguide.bindKeyboardShortcuts = function(){
    document.addEventListener("keyup", function(event) {
      var node = event.target.nodeName.toLowerCase();
      var abortCall = node === "input" || node === "textarea";

      // Focus on filter field with "f"
      if(event.keyCode === 70) {
        if(abortCall) {
          return;
        }
        // Open sidebar if mobile
        if(Ornament.C.OverlayTray.isMobile()) {
          Ornament.C.OverlayTray.openTray();
        } else {
          Ornament.C.OverlayTray.focusTrap.firstAfterOpen.focus();
        }
      }
    });
  }

  Styleguide.init = function(){
    // Sidebar targets
    Styleguide.$sidebarFilter = document.querySelector("[data-sidebar-filter-input]");
    Styleguide.$sidebarFilterContainer = document.querySelector("[data-sidebar-filter-list]");
    Styleguide.$navigationContainer = document.querySelector("[data-sidebar-navigation]");

    // Focus filter field when toggling sidebar
    Styleguide.bindSidebarToggle();

    // Filtering
    Styleguide.$sidebarFilter.removeEventListener("keyup", Styleguide.filterNavigation);
    Styleguide.$sidebarFilter.addEventListener("keyup", Styleguide.filterNavigation);

    // Keyboard shortcuts
    Styleguide.bindKeyboardShortcuts();

    // Adding version details
    document.querySelectorAll("[data-ornament-version]").forEach(function(node){
      node.innerText = "v" + Ornament.version;
    });

    // Adding copy links to styleguide textareas
    // Stolen from foundation's documentation 
    document.querySelectorAll('[data-styleguide-code-sample]').forEach(function(node, index, value) {
      Styleguide.addCopyLinkToCodeSample(node, index, value);
    });

    // Auto-anchor H2s
    document.querySelectorAll("h2").forEach(function($h2){
      if(!$h2.id) {
        var text = Ornament.U.parameterize($h2.innerText);
        $h2.id = text;
      }
    });
  }

  Ornament.onLoad(function(){
    Styleguide.init();
  });

  Ornament.beforeLoad(function(){
    Ornament.C.OverlayTray.alwaysVisible = true;
  });

})(document, window, Ornament);