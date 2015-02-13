# Ornament To-Do List

## Changes

- Basic Page templates

## Components

- Twitter Fetcher
- Anchor over-ride for sticky header
- Shadows:
  - Pull shadows out of tabs/selector/oslide and turn in to a re-usable component
- Momentum scrolling:
  - Can be applied to things like swipable tabs, oslide etc.
  - http://www.hnldesign.nl/work/code/momentum-scrolling-using-jquery/

## Enhancements

- Fotorama Presets
  - Drop-in classes/markup for setting up various types of sliders
- Google Map embed
  - Lock/unlock styling
  - Geolocate centreing
  - Clustering
- Tabs
  - Swipable tabs:
    - Momentum scrolling
    - Scroll to tab when deeplinking
    - Tabs retain shadow behaviour when width of tabset has been reduced, then increased again
  - Swipable body to change tabs
- Oslide:
  - Calculate itemWidth programatically
  - Gutters options to remove left/right internal gutter
  - Extend minimap functionality to allow for click to jump
  - Swipeable
- Flexible Inputs:
  - Dynamic anchoring to available space
- Tooltips
  - Responsive considerations
  - HoverIntent option
  - Hoverable tooltips, close buttons

## Known bugs

- Mobile Menu:
  - Open/close animation doesn't work in Firefox
- Oslide:
  - [general] Cutting in to slides can cause miscalculations for isLastSlideVisible
  - [slideBy visible] Reaching the end, then sliding back only goes by 1
    - Possibly issue with marking something other than the left-most slide as active