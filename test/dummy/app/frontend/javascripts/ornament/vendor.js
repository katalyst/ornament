// =========================================================================
// Priority vendor libraries 
// =========================================================================

window.$ = require("jquery");
window.jQuery = $;

// Rails UJS
import Rails from 'rails-ujs';
Rails.start();

// Turbolinks
var Turbolinks = require("turbolinks")
Turbolinks.start();

// Underscore
import {} from "underscore";

// =========================================================================
// Secondary vendor libraries
// =========================================================================

// import "velocity";
// import "flying-focus";
import "what-input";
import "lazysizes";
window.store = window.store || require("store/dist/store.modern");

// =========================================================================
// jQuery alternatives
// =========================================================================

// axio.get = $.ajax / $.get
// import "axios";

// =========================================================================
// Polyfills
// Used for older browser support 
// =========================================================================

// TODO: Update these to NPM packages where possible

// IE8 Polyfills
// import "../vendor/polyfills/console";
// import "../vendor/polyfills/css3-mediaqueries";
// import "../vendor/polyfills/event-listeners";
// import "../vendor/polyfills/picturefill";
// import "../vendor/polyfills/selectivizr";
// import "../vendor/polyfills/jquery.touchSwipe";
// import "../vendor/polyfills/jquery.placeholder";
// import "../vendor/libs/jquery.youtube-wmode";

// IE11 Polyfills
import "../vendor/polyfills/element.remove";

// Future Polyfills
import "../vendor/polyfills/array.from";
import "../vendor/polyfills/es5-shim";
import "../vendor/polyfills/es5-sham";
import "../vendor/polyfills/classList";
import "../vendor/polyfills/closest-matches";
import "../vendor/polyfills/nodelist-foreach";
import "../vendor/polyfills/url-search-params";
import "../vendor/polyfills/array.find";
import "../vendor/polyfills/promise";
import "../vendor/polyfills/fetch";
import "../vendor/polyfills/fetch-abort-controller";