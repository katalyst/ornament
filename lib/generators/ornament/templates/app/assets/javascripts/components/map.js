/*jslint browser: true, indent: 2, todo: true, unparam: true */
/*global jQuery,Ornament */

(function (document, window, $) {

  "use strict";

  $(document).on("ornament:refresh", function () {

    if(typeof(google) == "undefined") {
      return false;
    }

    // Settings
    var mapPinImage = false; // "/assets/pin.png"
    var mapDefaultZoom = 15;
    var mapColours = [
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

    // Get google latlng from a pin
    var getGoogleLocation = function($pin){
      var rawLatLng = $pin.attr("data-map-pin");
      var floatLat = parseFloat(rawLatLng.split(",")[0]);
      var floatLng = parseFloat(rawLatLng.split(",")[1]);
      return new google.maps.LatLng(floatLat, floatLng);
    }

    // Adding pins to a map
    var addMarkersToMap = function(map, pinLatLng) {

      var marker = new google.maps.Marker({
        position: pinLatLng,
        map: map
      });

      if(mapPinImage) {
        marker.pin = mapPinImage;
      }

    }

    // Map Creation
    $("[data-map]").not(".map__init").each(function(i){

      var $mapContainer = $(this);
      var $mapPinElements = $mapContainer.find("[data-map-pin]");
      var firstLatLng = getGoogleLocation($mapPinElements.first());
      var mapIteration = i;

      // Add a map canvas to the map container
      var $map = $("<div class='map-canvas' id='map-canvas-"+mapIteration+"' />");
      $map.appendTo($mapContainer);

      // Add overlay if static
      if($mapContainer.is("[data-map-static]")) {
        $mapContainer.append("<div class='map--static-overlay' />");
        $mapContainer.addClass("map__static");
      }

      // Get latlong
      var defaultLocation = firstLatLng;

      // Map Options
      var mapOptions = {
        center: defaultLocation,
        zoom: mapDefaultZoom
      }

      // Conditional Options
      if($mapContainer.attr("data-map-controls") == "false") {
        mapOptions.disableDefaultUI = true;
      }

      if($mapContainer.is("[data-map-colour]")) {
        mapOptions.styles = mapColours;
      }

      if($mapContainer.is("[data-map-zoom]")) {
       mapOptions.zoom = parseInt($mapContainer.attr("data-map-zoom"));
      }

      // Create map
      var map = new google.maps.Map(document.getElementById("map-canvas-"+mapIteration), mapOptions);

      // Resizing window re-centers map
      google.maps.event.addDomListener(window, "resize", function(){
        var center = map.getCenter();
        google.maps.event.trigger(map, "resize");
        map.setCenter(center);
      });

      // Add marker to map
      $mapPinElements.each(function(){
        var latLng = getGoogleLocation($(this));
        addMarkersToMap(map, latLng);
      });

    }).addClass(".map__init");

  });

}(document, window, jQuery));
