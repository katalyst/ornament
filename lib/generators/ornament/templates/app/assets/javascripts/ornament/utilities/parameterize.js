(function (document, window, Ornament, Utils) {
  "use strict";

  // Parameterize function
  Ornament.U.parameterize = function(url) {
    return url.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'');
  };

}(document, window, Ornament, Ornament.Utilities));