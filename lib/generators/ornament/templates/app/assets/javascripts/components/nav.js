// Converts this:
//
// <nav class="nav">
//   <ul>
//     <li>
//       <a href="#">About</a>
//       <ul>
//         <li>
//           <a href="#">History</a>
//         </li>
//       </ul>
//     </li>
//   </ul>
// </nav>
//
// Into this:
//
// <nav class="nav">
//   <ul>
//     <li>
//       <button>About</button>
//       <ul>
//         <li>
//           <a href="#">History</a>
//         </li>
//       </ul>
//     </li>
//   </ul>
// </nav>
//
// And will toggle the visiblity on nested UL's when their corresponding button
// is clicked.
//

$(function() {
  $(".nav").each(function() {

    var $nav = $(this);

    $nav.find("li > * + ul").prev().each(function() {
      var $link = $(this);
      var $button = $("<button/>");

      $button.append($link.contents());
      $link.after($button);
      $link.remove();

      $button.next("ul").hide();

      $button.on("click", function() {
        var $ul = $button.next("ul");
        var visible = $ul.is(":visible");

        $button.closest("ul").find("li > ul").hide();

        if (!visible) {
          $ul.show()
          if ($button.is(":focus")) {
            $ul.find("a").first().focus();
          }
        }
      });
    });

    // If the user clicks on something (or tab to something) outside of the nav,
    // collapse any open sub nav lists.
    $("html").on("click onfocus", function() {
      $nav.find("li > * + ul").hide();
    });

    // Prevent "click" and "onfocus" events from propagating throught to the
    // HTML element.
    $nav.on("click onfocus", function(event) {
      event.stopPropagation();
    });

  });
});
