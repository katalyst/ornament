# Changelog

## v1.1.0

### Features

- Added SVG fix for IE9-11
- Created aspects folder in stylesheets

### Changes

- Moved content.css in to the new aspects folder and separated in to different aspects. 
- Moved input spacing out of forms.css and in to the aspects folder as inputs.css
- Changed content--title to page--title and moved in to new page.css file
- Moved grunticon loader JS file in to /grunt as it's not used for anything
- Moved show.js in to javascripts/utilities rather than javascripts/components.
- Upgraded conform.js and moved in to javascripts/utilities
- Updated docs for event tracking, moved in to new javascript utilities section in docs.
- Updated SimpleForm initialiser to use new config.label_text to avoid crashing when uncommenting the config.label_text

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