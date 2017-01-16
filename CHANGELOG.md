# Changelog

## v1.2.5

### Features

- Added styleguide code highlighting  
- Fixed `.button__icon` sizing to be in-line with the default button heights  
- Added `.button__small.button__icon` variation  
- Added `.button-set` for a grouping of buttons that always have consistent space between themselves  
- Added `Ornament.version` to return the current version of Ornament  
- Added `ShiftyJS`, a new JS component for moving elements around the page between breakpoints  
- Added [what-input](https://github.com/ten1seven/what-input) and added a sass mixin `disable-mouse-outline` that disabled outlines on elements when mouse is detected as main input device, applied to buttons by default  
- Updated spang documentation  

### Changes

- Moved the button mixins in to `_button-mixins.scss` to better seperate concerns and allow buttons to be made outside of `_button.scss`  
- Moved the `layout--container` code out in to it's own series of `container` mixins and added some documentation for them  
- Renamed `mobile_navigation` to `tray_navigation` to better represent the component  
- Replaced TODO link in styleguide with a link to the project board on github  
- Reorganised and reformatted the `_settings.scss` file to bring more in line with the future of ornament  
- Updated the specificity of the `.controls` margin-top to only add it when preceeded by a `.control-label`  

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