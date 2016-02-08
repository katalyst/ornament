# Ornament To-Do List

## Changes

## Components

- Twitter Fetcher
- Anchor over-ride for sticky header
- Shadows:
  - Pull shadows out of tabs/selector/oslide and turn in to a re-usable component
- Momentum scrolling with JS:
  - Can be applied to things like swipable tabs, oslide etc.
  - http://www.hnldesign.nl/work/code/momentum-scrolling-using-jquery/
- Image Uploader
  - Better IE8 fallback to send asset to back-end 
- Maps
  - Filterable pins without reloading map

## Enhancements

- Fotorama Presets
  - Drop-in classes/markup for setting up various types of sliders
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
- Tooltips
  - Responsive considerations  
  - HoverIntent option  
  - Hoverable tooltips with close buttons 

## Known bugs

- Selector filtering isn't working anymore
- Mobile Menu:
  - Open/close animation doesn't work in Firefox
- Oslide:
  - [general] Cutting in to slides can cause miscalculations for isLastSlideVisible
  - [slideBy visible] Reaching the end, then sliding back only goes by 1
    - Possibly issue with marking something other than the left-most slide as active
- Tooltips
  - Scrolling the mobile menu will scroll the tooltips 