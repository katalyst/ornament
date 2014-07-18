/*jslint browser: true, indent: 2, todo: true, unparam: true */
/*global jQuery,Ornament */

(function (document, window, $) {

  "use strict";

  $(document).on("ornament:refresh", function () {

    $(".navigation-mobile").not(".navigation-mobile_init").each(function(){

      var $navigation, currentLevel, $nestedNodes, jumpToCurrent, transitionTime, updateHeights, $currentTab;

      $navigation = $(this);
      currentLevel = 1;
      $nestedNodes = $navigation.find("ul ul");
      jumpToCurrent = true;
      $currentTab = $navigation.find(".selected").last();
      transitionTime = 200; // needs to match css transition length

      $currentTab.parent("li").addClass("active");

      // div wrapper to help sizing
      $navigation.find("ul").not(".non-pane").wrap("<div class=pane />");

      // helper class for first pane if needed
      $navigation.find(".pane").first().addClass("pane_first");

      // content inclusions
      var $navContent = $navigation.find(".navigation-mobile--content");
      $navContent.each(function(){
        var $content, $navHTML;
        $content = $(this);
        $navHTML = $content.html();
        $navigation.find(".navigation-mobile--first").append($navHTML);
      });

      // adding classes to pre-existing nav elements so we can differentiate from them later
      $navigation.find(".pane--navigation-container").find("li").addClass("navigation-item");

      // update heights function to make sure scrolling works
      updateHeights = function(){

        setTimeout(function(){
          var windowHeight, tabHeight, navHeight;
          $currentTab = $navigation.find(".selected").last(); // reseting current tab
          windowHeight = $(window).height();
          // $navigation.css("height","auto");

          if(currentLevel == 1) {
            tabHeight = $(".pane_first").outerHeight();
          } else if ( $currentTab.is("a") ) {
            tabHeight = $currentTab.last().parent("li").parent("ul").outerHeight();
          } else {
            tabHeight = $currentTab.last().children("div").children("ul").outerHeight();
          }

          if(windowHeight > tabHeight) {
            navHeight = windowHeight;
          } else {
            navHeight = tabHeight;
          }

          $navigation.height(navHeight);
        }, (transitionTime + 100));
      };

      // update heights on page load
      updateHeights();

      // update heights again when menu slides open
      $(".layout--switch").on("click", function (e) {
        updateHeights();
      });

      // add back buttons to nested panes
      $nestedNodes.each(function(){
        var $nestedNode = $(this);
        var nodeTitle = $nestedNode.parent(".pane").prev().text();
        var nodeDescription = $nestedNode.parent(".pane").parent("li").attr("data-description");
        var $nodeLink = $nestedNode.parent(".pane").parent("li").children("a");
        // build description block
        var $descriptionBlock = $("<li class='description panel--padding_tight' />");
        $descriptionBlock.append("<div class='description--title'>"+nodeTitle+"</div>");
        // only add description if description is found
        if (nodeDescription) {
          $descriptionBlock.append("<div class='description--body'>"+nodeDescription+"</div>");
        }
        // only add overview link if there's a link to be overviewed
        // if ($nodeLink.attr("href") != "#") {
        if ( !$nodeLink.parent("li").parent("ul").parent("div").hasClass("pane--navigation-container")  ) {
          $descriptionBlock.append("<div class='description--overview'><a href='"+$nodeLink.attr("href")+"' class='icon_arrow_right'>View overview</a></div>");
        }
        $nestedNode.prepend($descriptionBlock);

        // add back button
        $nestedNode.prepend("<li class='back panel--padding_tight'><a href='#' class='button icon_arrow_left'>Back</a></li>");
      });

      // adding forward classes to required links
      $navigation.find("li").not(".description").each(function(){
        var $parentNode = $(this);
        if($parentNode.children("div").length>0){
          $parentNode.addClass("has-children");
        }
      });

      // making forward links work
      $navigation.find(".has-children").children("a").on("click", function(e){
        e.preventDefault();
        // abort if nav is animated
        if($navigation.is(":animated")){ return false; }
        // move to next level
        var $thisForward = $(this);
        $thisForward.parent("li").addClass("selected").siblings().removeClass("selected");
        currentLevel++;
        $navigation.attr("data-level",currentLevel);
        updateHeights();
      });

      // back button behaviour
      $(".back .button").on("click", function(e){
        e.preventDefault();
        var $thisBack = $(this);
        // abort if nav is animated
        if($navigation.is(":animated")){ return false; }
        // short delay on selected reset so that transition shows the appropriate nav items
        setTimeout(function(){
          $thisBack.parent(".back").parent("ul").parent("div").parent(".selected").removeClass("selected");
        },transitionTime);
        currentLevel--;
        $navigation.attr("data-level",currentLevel);
        updateHeights();
      });

      // jump to current page
      if(jumpToCurrent) {
        currentLevel = $currentTab.parents("ul").length; // get depth of current selected page
        // reset level to 1 if 0
        if(currentLevel == 0) { currentLevel = 1; }
        // apply current level
        $navigation.attr("data-level",currentLevel);
        $currentTab.parents("li").first().addClass("selected");
        updateHeights();
      }

    }).addClass("navigation-mobile_init");

  });

}(document, window, jQuery));
