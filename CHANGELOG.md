# Changelog


## v1.1.0

### Features

- Added SVG fix for IE9-11  
- Added OpenGraph yields to global template  
- Created aspects folder in stylesheets  
- Conform.js rebuild - [Documentation](https://bitbucket.org/dbaines/conform/overview)  
- Added CommonControllerActions (commented out) in styleguide controller for Koi support  
- Added above_layout and below_layout yields + docs  
- Added a flexible page layout with sidebar and sidebar_right yields   
- Removed VERSION file in favour of `/ornament/version.rb`, showing version on styleguide.
- Ornament.measure($element, metric) is a new Ornament JS function to measure a hidden element. 

### Changes

- Moved content.css in to the new aspects folder and separated in to different aspects. 
- Moved input spacing out of forms.css and in to the aspects folder as inputs.css
- Changed content--title to page--title and moved in to new page.css file
- Moved grunticon loader JS file in to /grunt as it's not used for anything
- Moved show.js in to javascripts/utilities rather than javascripts/components.
- Moved conform.js in to javascripts/components
- Updated docs for event tracking, moved in to new javascript utilities section in docs.
- Updated SimpleForm initialiser to use new config.label_text to avoid crashing when uncommenting the config.label_text

### Bugfixes

- Mobile Navigation - First pane is now sized based on the entire height of the `firstPaneClass` element rather than just the navigation elements. This way navigation won't cut off if the first pane contains something other than navigation such as a logo.

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