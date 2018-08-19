# Changelog

## v2.0.5

### Styleguide redesign

Continuing the redesign, the navigation has been restructured to make browsing concepts easier:

- Navigation concepts are grouped together, including menu with more, simple navigation renderer and the tray navigations
- Layout concepts like seo partial, flash messages and left/right yields are all grouped together with new docs for things like building a basic view, image optimisations, modal routes
- Form docs have been broken out in to several pages along with showjs
- General clean up of unused views and attempting to make things easier to find

### Changes

- Removed px sizing from `button.scss` and `button-mixins.scss`
- Added `app-height-variable` component as a replacement for `100vh` - [More info](https://stackoverflow.com/questions/37112218/css3-100vh-not-constant-in-mobile-browser), can be used as either `height: var(--app-height)` or `@include app-height` in SCSS.
- Renamed `TrayNav` to `PushTray` and updated docs
- Added `OverlayNav` component for an alternate mobile tray navigation, this is the navigation used in the styleguide
- Added `layouts/modal.html.erb` for easily rendering an action in the modal template
- Added `dismiss` component
- Added "External link: " at the front of generic external link event tracking categories, this will be omitted if providing a custom category
- Added `-auto-orient` command to the `optimised_jpg` rails helper
- Re-organised helpers and created two new helpers to seperate concerns a little bit, `ornament_svg_helper` and `ornament_styleguide_helper`
- Added `lazysizes` as an out-of-the-box vendor lib to allow for easy lazyloading
- Added `axios` replace `$.ajax/$.get` when not using jQuery
- Added `url-search-params` polyfill for the [URLSearchParams API](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams)
- Added basic event API `Ornament.triggerEvent(element, eventName)` as a replacement for `$(element).trigger(eventName);`

### Fixes

- Added `views/service_worker` to generator
- Removed old `service_worker.js` so it doesn't conflict with the new generated service worker
- Fixed service worker controller not being accessible in the test/dummy app
- Fixed `lastModifiedDate` not being a date object in Safari for the image uploader component

## v2.0.4

### Styleguide redesign

- New filterable navigation on the left hand side using keywords to identify links of interest, eg. "modal" will find the lightbox docs
- Press "F" to focus on the filter input for quick-filtering action

### Lib updates

- Changed to jQuery 3 by default
- Updated `underscore` to v1.9.1
- Updated `what-input` to v5.1.1
- Updated `priority-nav` to v1.0.13
- Updated `jquery-ui-timepicker-addon` to v1.6.3
- Updated `clipboard.js` to v2.0.0
- Moved `youtube-wmode` out of libs and in to polyfills and moved the include down with the other IE8 polyfills
- Removed the `menu-aim` lib and associated component stylesheets as it was no longer being used
- Removed `prevent-overscroll.js` lib as `overscroll-behavior` is now a CSS spec

### Changes

- Added `section` component for dividing full-width sectional content, applied as a replacement for `lightbox--section` and applied to the `container` docs
- Renamed `utilities/flex.scss` to `utilities/flex-mixins.scss`
- Added default sans-serif font-sizing and light blue link colouring to 500.html page
- Added `maintenance.html` template to public folder based on the 500 page
- Removed `views/errors/500` to avoid confusion, the 500 page shouldn't be served by rails and should be entirely static
- Added Rails Caching to icon partial rendering
- Added `service_worker` controller and routes for a dynamically generated webmanifest with staging/development flags in the app name.
- Added placeholder `service-worker.js`
- Removed a bunch of countries from the `form` country select element as it was causing encoding errors when deploying
- Added `simple-navigation` as a gem dependancy
- Merged docs for `sidebar_left` and `sidebar_right` with proper code samples

### Fixes

- Fixed styleguide copy buttons attempting to submit forms, very problematic on the form documentation page
- Removed double includes of `flexible-input`
- Fixed minor style issues with `page__with-sidebar-right`
- Fixed duplicate docs for `spacing-*` classes
- Fixed outdated panel class on the `flex mixins` page
- Added code samples to drilldown docs

## v2.0.3

### Privacy features

- Disabling `Ornament.features.serviceWorker` when cookies are disabled
- Added new feature detection, `Ornament.features.localStorage` and disabled when the localStorage is disabled (eg when cookies are disabled)
- Added new feature detection, `Ornament.features.tracking` and disabled when the user has opted-in to doNotTrack
- Aborting tracking events like `Ornament.C.Analytics.trackEvent` when `Ornament.features.tracking` is false

### Changes

- Much needed update to the readme
- Converted all sass `-unit`s and font-sizes to `rem`
- Added a `convert-px-to-rem()` function for easy px-to-rem conversion
- Enhanced form elements are now added to all radio/checkbox elements by default, removing the requirement for the `.form--enhanced` wrapper
- Added a new sass variable in `lightbox.scss`, `$fullscreen-mobile`. This variable will make the scrollable lightbox fullscreen at a screensize determined by the `$fullscreen-mobile` variable. You can set the variable to `false` to disable the feature entirely and keep the existing scrollable functionality
- Refactored `ornament_menu` simple-navigation renderer to show dropdown arrows and keyboard access
- Added a couple of options to `ornament_menu` renderer to allow icons and toggle behaviour to be turned off
- Added documentation for `ornament_menu` renderer in the navigation component page
- Moved vendor.js back in to the application.js bundle
- Added `$instagram` colour variable to the list of social colours
- Set system fonts as the default font
- Supported the new `event.prompt()` method of registering service workers as per [a2hs-updates](https://developers.google.com/web/updates/2018/06/a2hs-updates)
- Changed `heading(index)` to `heading-for-index(index)` and replaced first mixin so that it takes the name of the heading, `heading("one")`
- Replaced direct image paths in sass files to use `asset-path` helper instead to fix issues with Rails 5.1
- Allowed `@content` in the `font-face` mixin so you can use it to define font-families
- Align `th` to the left by default via `reset.scss`
- Changed `bg-*` helpers to `bg--*` to match the `type--` class syntax  
- Updated the `type--*` classes to modify link colours as well, along with a make-your-own-type-class mixin, `type-color($color, $hover-color)`
- Added `.type--inverse` for colouring text and links white in things like panels or `bg--*` classes
- Created a new function to track virtual pageviews in analytics, `Ornament.C.Analytics.trackVirtualPageview(path, pageTitle)` and refactored the turbolinks listener to use this function rather than it's own virtual pageview tracking
- Added docs for `icon-block`
- Made styleguide routes accessible only in development environment by default
- Moved `panel-color`, `type-color` and `icon-color` mixins in to a `color-mixins` partial for better management
- Added docs for `type--*` colours to the typography page
- Used the `bg--*`, `type--*` and `icon--*` classes on flash rather than using panel classes

### Fixes

- Fixed rails.confirm lightbox close button alignment
- Added docs for fullscreen lightboxes
- Added docs for scrollable lightbox footer
- Added docs for lightbox section classes
- Removed default left/right padding on header
- Removed default left/right padding on footer
- Added 100vh min-height to `.tray--page` to make footer default to bottom of screen
- Removed styleguide navigation from default global layout
- Added the `ornament_menu` simple-navigation renderer to the generator
- Added `element.remove` js polyfill for IE11 to fix crash with `icon-loader`  
- Added `display: none` to ornament icon div to prevent being displayed during a JS crash  
- Fixed alignment of flash message close buttons
- Fixed spacing in show.js docs by changing to simple_form helpers
- Updated docs for enabling jQUery UI support now that the datepicker components have been separated in to `form-datepicker.js` as of v2.0.0
- Fixed menu-with-more collapsing on page load, still issues with unbinding events when used with turbolinks

## v2.0.2

### Form refactors

- Simplified the `simple_form.rb` initializer by stripping out a lot of the inherited defaults  
- Added a new wrapper `ornament` that is used by default across the app  
- Added a new wrapper `oranment_boolean` that is used specifically for boolean types  
- Re-enabled html5 validation by default  
- Wrapped label, hints and errors around a single wrapper div `.control-group--label` to make grouping them together consistently  
- Added `:active` states to enhanced checkbox/radios  

### Changes

- Changed the `icon()` rails helper:
  - Generate class names from the filename of the icon 
  - Use inline styles for width/height to accomodate issues in Firefox with rem sizing
  - Icon partials are now `.svg.erb` rather than `.html.erb`
- Changed `.nvmrc` file to use node 8 by default to be more compatible with webpacker  
- Improved the contrast of the default success and alert panels
- Added missing alert panel to the panel documentation
- Added `panel__border` and `panel__bordered` class and added panel bordering docs  
- Changed `panel--padding-border` class to `panel--border-top` and added a `panel--border-bottom` class to match  
- Added new success and error colours for buttons and implemented  
- Added border transition to `button__*__line` classes  
- Rebuilt the `form-inline` class and added `form-inline--cap` to cap form fields with icons, labels or buttons  
- Removed the "Full width search" form example as it was replaced by field caps  
- Added a new `form_control_group` rails helper to make mocking up new form fields easier without having to worry about dynamically changing error classes or conditionally showing hints/errors/labels  

### Fixes

- Added `body-type` mixin in to the CKEditor `contents.css` body tag and removed default font-size and line-height from the original CKEditor boilerplate  
- Added `<small>` support to CKEditor `contents.css`  
- Fixed `overscroll-behavior` spelling  
- Fixed `ornament_renderer` adding `has_children` to every navitem that has a child navitem, regardless of if it was rendering that child or not  
- Fixed `button__icon` class in IE11  
- Removed the `styleguide` class from the default global template 
- Removed un-used `$image-border` variable from `settings.scss`

## v2.0.1

### Removed compass 

- Removed compass mixins, replicated any required ones in to ornament 
- Removed compass from gemfile and docs
- Removed compass gem from generator 

### Custom devise views

- Added a new generator `rails generate ornament_devise <model>` which will generate pre-ornament-ed devise views  
- They also come with `sessions/create.js.erb` and `sessions/new.js.erb` to support remote login forms out of the box  

### Custom simple-navigation Renderer

- Added a new simple-navigation renderer `ornament_renderer`  
- Passing in an `id_namespace` option allows you to namespace the key id attributes to prevent duplicate ids on the page  

### Features

- Added a new top-level stylesheet folder `helpers` for helper/utility classes, moved `align` in to this folder  
- Added some helper classes `.round` and `.round-ellipse` for making rounded corners and ellipses
- Added some `bg` helper classes  
- `Show.js` - Added support for select menus that match multiple options using the `_&_` syntax  
- Moved the custom `rails.allowAction` functionality in to a seperate `lightbox-rails-confirm.js` file to make it easily disabled or modified without having to impact `lightbox.js`  
- Updated the `spang` mixins to use flexbox rather than floats  
- Added `optimised_jpg` helper to convert and encode an image  
- Added automatic service-worker registration on HTTPS and on localhost if the user has `Ornament.localServiceWorkers` in their localstorage and set to true. This prevents local development sites undesirably registering serviceworkers - Note: Ornament does not ship with a service-worker by default, service-worker registration can be disabled by commenting out `register-service-worker` require statement in `application.js`  
- Added application icon boilerplate to `_seo.html.erb` partial, disabled by default
- Updated `static_map` rails helper to making signing optional  

### Fixes

- Added koi/contents.scss file to the generator
- Fixed koi site settings meta returning empty strings
- Fixed `password-revealer` submitting forms when revealing the password  
- Fixed Ornament.initComponents() so that you can pass an array of component names to it  
- Updated `carousel` breakpoint so that `breakpoint-tiny` can be removed without crashing other components  

### Changes 

- Removed some old grunticon files 
- Added some missing `-ms` flex properties for the flex mixins  
- Added slight transition to pagination hover states 
- Cleaned up the `reset.scss` file 
- Added new utility mixin `overflow-scroll` that adds overflow auto, touch scrolling and prevents scroll bleeding  
- Disabled ornament debugging by default  
- Removed unused `sticky.scss`

### Undocumented 2.0.0 changes

Some changes I accidentally left out of the 2.0.0 release changelog  

- The `flex-row` and `flex-col` mixins can now take arguments as lists instead of just values to specify different x/y values. eg. `flex-col(25%, (y-padding, x-padding))`
- `icon-block` mixin has changed from `icon-block(gruticon-name, block-width, icon-width, block-height, icon-height)` to `icon-block(block-size, icon-size)` or alternatively using lists for greater specificity: `icon-block((block-width, block-height), (icon-height, icon-width))`

## v2.0.0

### Reduced IE8/9 Support 

- Removed the .ie8 class on the body  
- Removed loading of selectivizr and css3-mediaqueries polyfills 

### Ornament JS Framework 2.0 

Ornament is taking steps toward being asynchronous and having it's own lifecycle to integrate better with things like Turbolinks and React.  

There are now convenience functions like:

```js
Ornament.onLoad(function(){
  // do something when ornament is ready
});
```

When creating a component you can use the `registerComponent` function to autobind things like an init function and resize/scroll listeners:

```js
var MyComponent = {
  resizeListener: function(){
    // this will automatically bind on resize 
  },
  scrollListener: function(){
    // this will automatically bind on scroll 
  },
  init: function(){
    // this will get run automatically on page load
    // and also when turbolinks transitions 
  }
}
Ornament.registerComponent("MyComponent", MyComponent);
```

### Reorganised JS folders

- Moved a lot of stuff out of `defaults.js` and either in to their own utility or helper file, or in to `core.js`
- Now `core.js` is where the Ornament lifecycle and initialisation functions live  
- Moved all vendor includes in to a new `vendor.js` file to keep all of our dependancies in one place  
- Cleaned up the vendor javascripts folder by seperating polyfills and libraries in to seperate folders  
- Moved `styleguide.js` in to a styleguide folder to keep it away from everything else  
- Renamed `fotorama.js` to `carousel.js` to avoid confusion between the library and the implementation file  
- Split `form-helpers.js` in to several different components to make disabling/enabling just indivudual helpers much easier, they are now `form-billing-shipping.js` for the billing-to-shipping helper, `form-datepicker` for date and time pickers, `form-enhanced.js` for the custom checkboxes/radios, `form-password-revealer.js` for revealing passwords and `form-password-score.js` for password scoring using zxcvbn.
- Added `_component-template.js` to make building new javascript components easy-as  

### Reorganised CSS folders

- Moved `fonts.scss` in to the utilities folder and renamed to `font-face.scss` to avoid confusion with the other `@include font` mixin  
- Created a `font-face` mixin for easy configuration of self-hosted webfonts, rather than relying on the developer to manually create the font-face declarations themselves  
- Moved `styleguide.css` in to a styleguide folder to keep it away from everything else  
- Moved vendor css files in to a `libs` directory to keep consistent with the JS structure  
- Renamed `fotorama-custom.scss` to `carousel.scss` to avoid confusion between the library and the implementation file  

### Typography changes 

Breaking:

- Heading mixins have been changed from `@include heading-one` to `@include heading(1)`  
- This is to make configuration of headings much easier via the two new lists configured at the top of the `typography.scss` partial  
- Simply configure your headings at the top of the partial and all the mixins and classes are automatically generated for you  

Non-breaking:

- Cleaned up order of the typography stylesheet by seperating mixins from the utility classes  
- Added a few new coloured type utility classes: `.type--error`, `.type--success` and `.type--primary`  
- Added a `$font-families` flag at the top of the typography stylesheet to make switching between merged font-family webfonts and seperated font-family webfonts easier. Eg. `strong` tags are now just `font-weight: bold` rather setting an entirely different font. This can be set to `false` to use the old behaviour  
- Updated default heading font sizes  
- Added a `$system-fonts` variable for using various system fonts rather than a webfont. Implemented on styleguide  
- Added a transition to font size changes  

### TrayNav

- The TrayNav component has been split in to two components - `drilldown` and `tray`  
- `tray` is a component whose only concern is showing and hiding a slide-out tray  
- `drilldown` is a component that lets the user drilldown through layers of list items  
- These components can now be used independantly to each other or used together like previously, there is new markup for each so be sure to read the styleguide documentation  

### Removals

- `selector.js` - never used. It's a very specific component that it would probably be rebuilt with different requirements if we need it again
- `sticky.js` - it was incomplete and buggy. Opted to use [StickyKit](http://leafo.net/sticky-kit/) instead when needed  
- `oslide.js`- it was never used and there are better alternatives like [slick carousel](http://kenwheeler.github.io/slick/)  
- `navigation.js` - it was overly complicated, may make a comeback in the future but we never used it  
- `menu-aim.js` - removed due to it's reliance on specific markup and just general inflexibility  
- `conform.js` - There are [better options](http://brm.io/jquery-match-height/) and it's only required for IE8/9 which we are dropping support for  
- Grunticon has been removed in favour of dropping IE8/9 support and the move toward inline SVG instead  

### Turbolinks enhancements

There is now an `Ornament.beforeTurbolinksCache()` function that you can pass code to that executes on the before cache event  
The following components have been enhanced to work nicer with Turbolinks:

- Carousel (formerly Fotorama)
- Readmore
- Show.js
- Analytics.js
- ScrollTo
- ShiftyJS
- Form Password Revealer
- Form Password Scorer

This is a continuing effort to move towards asynchronous and self-cleaning components. 

The following components have known issues with Turbolinks still:

- Lightbox
- Map
- Menu with more

### Other Changes

- Upgraded Fotorama to (final?) version and updated asset paths 
- Added a `site.head_scripts` site setting to allow Koi users to add their own scripts to the `head` element. This makes managing head scripts a lot easier and doesn't require deploys to update  
- Added a `site.gtm_code` site setting to allow Koi users to manage Google Tag Manager embeds  
- Fotorama carousels now need `data-carousel` to integrate with Turbolinks 
- Added some convenience functions to the top of `show.js` for doing global things when showing/hiding fields  
- Added support for matching multiple select fields in `show.js`  
- Updated `analytics.html` partial to only push ga pageview event when Turbolinks is not present. When turbolinks is present we now push virtual pageviews to either analytics.js or gtm.js when present  
- Streamlined production of coloured panels with a `panel-color` mixin. Any panels made using this mixin will autocolour links and icons  
- Better default styling for carousel dot navigation based on most common implementation  
- Added a more realistic implementation of a gallery sample on carousel page  

## v1.2.6

### Rails 5 support 

- Updated gems to work with Rails 5 projects [#33](https://github.com/katalyst/ornament/pull/33)

### Generator updates

- Made the ornament generator automatically add required gems to gemfile  
- Added an initialiser to house the asset precompile settings [#32](https://github.com/katalyst/ornament/pull/32)

### Features

- Added `spacing` class documentation in the CSS section  
- Added support for Koi's Site Settings in the SEO partial  
- Added automatically generated Google Analytics code when a Koi Site Setting for `site.google_analytics.profile_id`  
- Added a helper method for looking up general site settings from Koi  
- Updated automatic "lightbox" param that gets added to ajax lightboxes to now account for existing params  
- Added `flex-static` and `flex-fluid` mixins as short hand for `flex-grow(0), flex-shrink(0)` and `flex-grow(1), flex-shrink(1)`  
- Prevented flyingfocus from causing unnecessary whitespace when opening a lightbox  
- Added `Ornament.findData()` function to find data-attribute nodes 
- The `icon-block` mixin can now optionally take a string as the first argument and treat that as the name of a grunticon and apply it as part of the `icon-block` mixin. This reduces the need for times when all you want to do is apply a `grunticon` and `icon-block` mixin, which can result in unnecessary styling rules and simplifies the creation of icon blocks. 
- Updated kaminari views to reflect updated pagination styles from 1.2.5. 
- Added documentation for the `icon()` svg helper, added some default icons and a preview of icons in project  
- Added a helper for signing static google maps images  

### Changes

- Moved font definitions back in to `webfonts.html.erb` to support webfonts being loading in to Koi 
- Moved `spacing` out of components in to utilities  
- Improved spacing of lightbox buttons in rails confirm replacement 
- Moved the `Shadowable` component in to the `Ornament.C.Shadowable` namespace  
- Removed grunticon documentation from ornament docs, still accessible for now directly at `/styleguide/grunticons`  
- Split `application_helper.rb` in to three different helpers to avoid collisions with project files  

## v1.2.5

### Features

- Added styleguide code highlighting  
- Added auto-anchoring to the styleguide, so you can now anchor to any heading. If the heading is "Text matches", the anchor will be `#text-matches`  
- Added a couple Koi helper methods in application_helper for `traverse_for_key(nav_item, key)` and `traverse_for_nearest_navigation_key(nav_item)`  
- Fixed `.button__icon` sizing to be in-line with the default button heights  
- Added `.button__small.button__icon` variation  
- Added `.button-set` for a grouping of buttons that always have consistent space between themselves  
- Added `Ornament.version` to return the current version of Ornament  
- Added `ShiftyJS`, a new JS component for moving elements around the page between breakpoints  
- Added [what-input](https://github.com/ten1seven/what-input) and added a sass mixin `disable-mouse-outline` that disabled outlines on elements when mouse is detected as main input device, applied to buttons by default  
- Updated spang documentation  
- Added `.cocoon-fields` form component and added some styling guidelines for cocoon fields  
- Added a `billingToShipping` form helper  
- Improved pagination defaults  
- Added `rel=noopener noreferrer` to external links 
- Fixed issues with external links not tracking 
- Made the `skip-link` visible when focused for improved accesibility  
- Added `flying-focus` library for improved accessibility  
- Moved a lot of the table styles in to `table-mixins` and created classes using those mixins, allowing tables to be extended easily  
- Created a `content-table` mixin that applies to any table inside `.content` as a way of basic styling for wysiwyg tables  
- Created `Ornament.C.ContentHelpers` and the first content helper is to auto-wrap a `.table-container` around `.content table`, this will make wysiwyg tables a bit nicer on mobile  
- Added a `koi/ckeditor/contents.css` file that generates basic typography and wysiwyg aspect styles for use with Koi's CKEditor  
- Moved ShowJS in to the Ornament.C API, `Ornament.C.Show` and allowed it to be included as a stand-alone library from Ornament  
- Added the `data-show-type="*"` method to Show.JS to match anything in a string input type  

### Changes

- Reduced default button sizes  
- Moved the button mixins in to `_button-mixins.scss` to better seperate concerns and allow buttons to be made outside of `_button.scss`  
- Moved the `layout--container` code out in to it's own series of `container` mixins and added some documentation for them  
- Renamed `mobile_navigation` to `tray_navigation` to better represent the component  
- Replaced TODO link in styleguide with a link to the project board on github  
- Reorganised and reformatted the `_settings.scss` file to bring more in line with the future of ornament  
- Updated the specificity of the `.controls` margin-top to only add it when preceeded by a `.control-label`  
- Moved feature detection booleans to the new `Ornament.features` object  

## v1.2.4

Introducing the Ornament Component API!  
Starting with this version, component javascript features will be moved in to an `Ornament.Components` namespace. There is also a shorthand `Ornament.C`  

Implemented basic Components API for:
- Analytics
- FormHelpers
- Lightbox
- PaginationHelper
- ReadMore
- ScrollTo
- TextLimit
- Toggle
- TransitionToggle
- TrayNav

### Features

- Added `.eslintrc.json`, `.editorconfig.ini` and `.sass-lint.yml` files for linting and autoconfiguring goodness  
- Added a big warning message to people using IE8/9 and people without scripts enabled  
- Updated `data-lightbox` to default to internal scrolling behaviour, `data-lightbox-basic` is used for the previous lightbox behaviour  
- Exposed an easier to remember ornament trigger wrapper, `Ornament.onLoad(...)` as an alternative to `$(document).on("ornament:refresh", ...)`  
- Added `layouts/_seo.html` partial to keep all the SEO, open graph and twitter card tags, replaced opengraph documentation with seo documentation  
- Added `css_split` gem for in-built IE8/9 large-css support  
- Added an `assetPreloader` helper function to `defaults.js` for preloading images on page load  
- Added a `bodyScroll` helper function to `defaults.js` for animating a body scroll  
- Added a `ScrollTo` component that allows `[data-scroll-to]` anchors to scroll to another element on click  
- Added a `parameterize` helper function to `defaults.js` for mimicking the rails parameterize function in javascript  
- Added a `$classes` param for `normal-spacing` mixin to space based on classes rather than tags. Added a new `content-spacing-classes` class to go with it  
- Added Toggle speed customiser with `data-toggle-timing`  
- Added a TransitionToggle component with `data-transition`  
- Added analytics tracking for appinstallbanners when service workers are available  
- Added dataLayer/Google Tag Manager support for tracking analytics events  
- Added a helper vendor script that fixes youtube z-index issues in older browsers  
- Hiding the form jQueryUI datepicker documentation when `Ornament.C.FormHelpers.jQueryUI` is false  
- Added a copy button for copying code samples from the styleguide  
- Added some event listener helpers, `Ornament.onResize()` and `Ornament.onScroll()`  
- Exposed more JS helpers on the JS helpers page  

### Performance Enhancements

- Moved modernizr in to the application.js file rather than a separate js file  
- Updated google webfont loader and switched to async version for performance improvements  

### Changes

- Upgraded to `grunticon 1.6.0` to fix phantomjs install issues  
- Moved lightbox defaults out of `defaults.js` in to `lightbox.js`  
- Moved google analytics code out of `external_links.js` in to `analytics.js`  
- Simplified geolocation support check in `defaults.js`  
- Changed the default viewport `meta` tag to allow mobile users to zoom  
- Initialised Ornament at the top of the page rather than in the application.js file  
- Moved jQueryUI setting in to the new `form-helpers.js` and updated docs accordingly  
- Labelled current tab system as legacy, added a new `tabs.js` component, but it is currently undocumented, look for the styleguide to be updated to use the new tab system and include documentation on it soon  
- Refreshed default icons that ship with Ornament  
- Uploader will be replaced with a big ugly warning message if used in an unsupported browser  
- Removed `.form--inline__full` and made `.form--inline` full-width by default. Widths for inline forms can be controlled by `.form--*` classes  
- Simplified the `spacing-*` class partial making it easier to extend  
- Changed `lightbox-small` attribute to `lightbox-size=` so developers can pass in custom sizes/classes  
- Removed `vertre`  

## v1.2.3

### Features

- Added `data-show-disable` to disable fields as an alternative to `data-show-destroy` with the intention of preventing data from being sent to the server when hiding fields 
- Added `.print__break-before` and `.print__before-after` helper classes for page breaks when printing 
- Added `.button__small` and `.button__large` examples to the button page
- Added `svg_image()` rails helper for inline SVG image handling 
- Added `.buttons` for `normal` and `compressed` aspects to control spacing of buttons inside content areas  
- Added `.form-siblings` component  
- Added `toggle-temporary`, `toggle-default` and `toggle-focus` features for the toggle component  
- Added `double-arrow` mixin  
- Added custom rails datetime formats  
- Added `data-lightbox-linked` option for linking between lightboxes  
- Added reset styles for telephone links 
- Added depressed button styles 
- Added `text-size-adjust: 100%` to fix text reflow issues when switching orientation on iOS
- Added `og:type` tag to global template and set website as default value  
- Restored `fixed-footer` using `flexbox` and a toggle in `settings.scss`    

### Bugfixes

- Added `trim()` to the `external_link` tracking script when comparing link text to fix up images having white-space text in Google Analytics  
- Updated maps component to work with other google apis  

### Changes  

- Restructured button mixins  
- Removed responsive gutters by default 
- Changed `$base-pixel` to `$base-font-size` since it was only used for font size  

## v1.2.2

### Features  

- Added documentation for generating ornament 
- Added `menu-with-more` component  
- Added ruby sample for navigation  
- Added jquery-ui theme and documentation on how to enable `datepicker` and `datetimepicker`.
- Added a `share_description` for stripping out html tags  
- Added `pretty-select` mixin for styling webkit and moz select elements and applied to default select element. Also improved the styling of the custom select menu arrow  
- Added cancel action to image uploader and a visible error state  
- Added a warning to users trying to leave the page while uploads are still in progress  
- Added a new warning to the file uploader noting the requirement of Koi's asset models  
- Added confirm boxes when removing files and cancelling uploads when using the uploader  
- Updated lightbox documentation and abstracted the default lightbox settings in to `Ornament.lightboxDefaults`  
- Changed default lightbox settings to fixed background position and updated sizing logic for lightboxes  
- Added descriptions to the styleguide categories on homepage  
- Added subtle animation to the enhanced radio/checkbox elements  
- Reworked the table component to bring classes more in line with thre rest of ornament, with more out of the box style options  
- Reworked the `align` component to bring classes more in line with the rest of ornament  
- Changed `.layout--main` from a `section` to a `main` element  
- Updated styling of default `content figcaption` styling  
- Removed margins from `typography.scss` as they should be defined by their aspect  
- Removed default class of `button` from the `simple_form` initialiser  

### Bugfixes  

- Fixed `cropString` and `tempCropString` being retained on image uploader when removing the image.  
- Fixed testElement for IE mobile navigation support not working with styleguide.  
- Fixed mobile navigation's console pollution.  
- Fixed `menu-with-more` trying to do it's thang on pages with no menu-with-mores.  
- Fixed ruby button samples in form and button documentation. [30](https://github.com/katalyst/ornament/pull/30)  
- Fixed some logic in the uploader partial  
- Fixed uploader progress bar background being grey in Firefox  
- Fixed uploader progress bar being blue in Edge/IE11
- Mobile tweaks to the uploader  
- Fixed styleguide `hr` being cut off in Edge/IE11 
- Fixed bonus left/right padding on flash partial 

## v1.2.1

Documentation update!  
All new look for the ornament dummy app and styleguide that gets generated, featuring tabbed code samples and previews.   
There are now simple_form examples available where relevant.  

### Features

- Added "micro" text limiter variation by using `data-limiter-micro`  
- Added basic enhanced radio and checkbox form elements.  
- Added `@include text-wrap` mixin for force-wrapping text along with the `type--wrap` class.  
- Added `@include ellipsis` mixin for truncating text along with the `type--ellipsis` class. 
- Added `.input__tight` for thinner input fields.  
- Added `.form--auto` for auto-width select elements.  
- Added docs for spacing out form fields. 
- Added `$passive-color` and `.panel__passive`  
- Added flex mixins and basic docs  
- Added support for various `type` attributes on lists  
- Added support for `.boolean` form class that behaves the same way as `.checkbox__single`.  
- `:og_title` yield will use `:title` or `:page_title` (whichever is available, in that order) as a fallback.  
- Added `URI.join(root_path, x)` to the `:og_image` content.  
- Updated opengraph docs.  
- Added `nested-link` component.  
- Added `blankstate` component.  
- Added `card` component. 
- Added `ratio` utility for calculating ratios in sass. 
- Added `background-cover` utility for easily giving things background-cover bahaviour.  
- Added simple `navigation` component. 
- Added crop tool to image uploader, renamed partial and updated docs. 
- Added flash message docs. 

### Bugfixes

- Tabs can now be nested
- Togglable tooltips now show/hide when inside tabs 
- Fixed ul/ol being unstyled by default when applying the `.content` class  

### Changes

- Removed `.content` class font-size increaser by default. It's still there just commented out if it's ever needed again. 
- Removed `island` classes and associated docs 

## v1.2.0

### Features

- Moved mapColours in to the Ornament defaults file to make the map.js file easier to read.  
- Added togglable "clusters" to the map component by adding in `data-map-cluster` to your map element.  
- Added minimal ui option for maps to only show zoom controls by using `data-map-controls="minimal"`. 
- Added geolocation to maps by using `data-maps-geolocate` 
- Added geocoding to map pins by using `data-map-pin-geocode` 
- Extended the text limiter form component to allow for word-count rather than character count by also passing in `data-limiter-word`  
- Updated show.js to not require a value for `data-show-inverse`. This will still work if there is a value so this is a non-breaking change. 
- Added `data-show-destroy` to show.js for when you want the data removed from hidden fields. 
- Restructured the show.js documentation to be more in line with the rest of the Ornament documentation. 

## v1.1.0

This update is focused on making a better default application state for your website and less on new and modified components. 

### Features

- Added SVG fix for IE9-11  
- Added OpenGraph yields to global template  
- Created aspects folder in stylesheets  
- Conform.js rebuild - [Documentation](https://bitbucket.org/dbaines/conform/overview)  
- Added CommonControllerActions (commented out) in styleguide controller for Koi support  
- Added above_layout and below_layout yields + docs  
- Added a flexible page layout with sidebar and sidebar_right yields   
- Removed VERSION file in favour of `/ornament/version.rb`, showing version on styleguide.
- `Ornament.measure($element, metric)` is a new Ornament JS function to measure a hidden element. 
- input-placeholder mixin for targeting placeholders across browsers
- Rebuilt button mixins and classes
- Added `$delegate` to both list mixins and made padding specifically set on the sides required (eg. left/right for `list-horizontal`) to prevent specificity issues when trying to set padding on other sides.
- Added more customisation to the `icon-block` mixin to set custom widths and heights across the icon and the block. 
- Added `icon-table` for creating a vertically aligned block that consists of an icon and a label of variable height.
- Typography resets for del, sup, sub
- Added toggle.js to toggle things on/off
- Added read-more.js for revealing more content
- Added small-type mixin and moved `<small>` styles in to that mixin. 
- Added some icon button classes
- Added support for custom gutters in spang: `@include spang(1,2,$custom-gutter:2px);`
- Added onlyOneTooltipAtATime setting to the tooltip component. Defaulted to false. Setting to true will hide other tooltips when showing a new tooltip.
- Added a feature for the mobile navigation to detect IE fixed-positioning/transform bug and add a class to the page to combat it. [Bug info](http://stackoverflow.com/a/27953413).

### Changes

- Breaking change: Changed `.checkbox_single` to `.checkbox__single` to match BEM formatting.
- Moved content.css in to the new aspects folder and separated in to different aspects. 
- Moved input spacing out of forms.css and in to the aspects folder as inputs.css
- Changed content--title to page--title and moved in to new page.css file
- Moved grunticon loader JS file in to /grunt as it's not used for anything
- Moved show.js in to javascripts/utilities rather than javascripts/components.
- Moved conform.js in to javascripts/components
- Updated docs for event tracking, moved in to new javascript utilities section in docs.
- Updated SimpleForm initialiser to use new config.label_text to avoid crashing when uncommenting the config.label_text
- Better code samples in documentation. Code samples are generated by the same code as the on-page examples. Applied to:
  - Forms
  - Maps
  - Menu Aim
  - Pagination
  - Panels
  - Selector
  - Tables
  - Tabs
- Cleaned up the markup in the form samples page
- Made checkboxes and radios vertical lists by default, horizontal by applying `.form--horizontal` to the wrapper.
- The main content area now doesn't get rendered if there's no content_for :global or any other un-specified content. For example if you have a page that only consists of content_for(:above_layout), the :above_layout yield will now stretch to the header and the footer with no gap left behind for the regular content.
- Added `min-height: 1px` to columns created by `spang`, this prevents columns with no content in them from collapsing.
- Stopped page from getting smaller in IE8 - Responsiveness is effectively stopped. 
- Swapped css3-mediaqueries for respond.js for better performance and less errors in IE8. Still required for minimum media-query support. 

### Bugfixes

- Mobile Navigation - First pane is now sized based on the entire height of the `firstPaneClass` element rather than just the navigation elements. This way navigation won't cut off if the first pane contains something other than navigation such as a logo.
- Fixed psuedo-elements being misaligned in <button> elements in IE.
- Added `overflow: hidden` to `.layout--main` to stop things from breaking out in to the mobile menu.

## v1.0.0

### Features

- Documentation!
- Styleguide layout and styleguide stylesheet
- Getting started section for the styleguide
- Reworked typography and content styles with smart defaults
- Spang - Easy grids
- Vetre - Vertically centred responsive image
- Maps component for easily adding google maps
- Media Query mixin
- Breakpoint helper
- Map component for easily adding Google maps
- Lightbox compenent using Magnific Popup
- Text limiter for input fields
- Drag and Drop image uploader
- Select Links for turning a select menu in to a navigation control
- Flexible Inputs
- Selector component
- Object slider
- Sliding nested mobile navigation with heaps of public functions to control from anywhere
- `Ornament.windowWidth` and `Ornament.windowHeight` for browser agnostic window measurements
- Grunticon with sample icons for pagination, mobile menu, menu button etc.
- Basic print stylesheet
- Flash Message partial
- Responsive embeds

### Changes

- Merged mobile footer and desktop footer in to one location.
- Rebuilt tooltips using data-attributes
- Rebuilt tabs using data-attributes
- Re-organised existing form styles and added form-groups

### Removals

- Prototyping components like split and float.
- Navigation-dropdown & navigation-horizontal
- Removed some of the duplicate `.layout--container` elements from the global stylesheet
- Typography mixin