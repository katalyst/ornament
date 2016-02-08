Ornament = window.Ornament = {

  // Default arrays for external links script
  externalLinkExtensions: [],
  internalLinkSelectors: [],

  // Header Breakpoint
  // Should match $breakpoint-header in settings.css
  headerBreakpoint: 990,

  // See if anything is sticky and calc their heights
  getStickyHeights: function(comparison){
    var comparison = comparison || 0;
    var heightOfStickies = 0;
    var $stickies = $("[data-sticky]");

    $stickies.each(function(){

      var $sticky = $(this);
      var thisStickyOffset = $sticky.attr("data-sticky-offset");
      if(comparison > thisStickyOffset) {
        heightOfStickies = $sticky.outerHeight();
      }

    });

    return heightOfStickies;
  },

  geolocationAvailable: function(){
    if (navigator.geolocation) {
      return true;
    } else {
      return false;
    }
  },

  // Map colours
  mapColours: [
    {
      "featureType": "water",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#0182c6"
        }
      ]
    },
    {
      "featureType": "landscape",
      "elementType": "geometry",
      "stylers": [
      {
        "color": "#7ac043"
      }
      ]
    },
    {
      "featureType": "poi",
      "elementType": "geometry",
      "stylers": [
      {
        "color": "#7ac043"
      }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#7ac043"
        },
        {
          "lightness": -40
        }
      ]
    },
    {
      "featureType": "road.arterial",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#7ac043"
        },
        {
          "lightness": -20
        }
      ]
    },
    {
      "featureType": "road.local",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#7ac043"
        },
        {
          "lightness": -17
        }
      ]
    },
    {
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "color": "#ffffff"
        },
        {
          "visibility": "on"
        },
        {
          "weight": 0.9
        }
      ]
    },
    {
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "visibility": "on"
        },
        {
          "color": "#ffffff"
        }
      ]
    },
    {
      "featureType": "poi",
      "elementType": "labels",
      "stylers": [
        {
          "visibility": "simplified"
        }
      ]
    },
    {
      "elementType": "labels.icon",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "transit",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#7ac043"
        },
        {
          "lightness": -10
        }
      ]
    },
    {},
    {
      "featureType": "administrative",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#7ac043"
        },
        {
          "weight": 0.7
        }
      ]
    }
  ]

};
