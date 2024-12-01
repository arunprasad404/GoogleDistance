// This example displays an address form, using the autocomplete feature
// of the Google Places API to help users fill in the information.

// This example requires the Places library. Include the libraries=places
// parameter when you first load the API. For example:
// <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">

var placeSearch, originautocomplete;
var componentForm = {
  street_number: 'short_name',
  route: 'long_name',
  locality: 'long_name',
  administrative_area_level_1: 'short_name',
  country: 'long_name',
  postal_code: 'short_name'
};

function initAutocomplete() {
  // Create the autocomplete object, restricting the search to geographical
  // location types.
  originautocomplete = new google.maps.places.Autocomplete(
    /** @type {!HTMLInputElement} */
    (document.getElementById('originautocomplete')), {
      types: ['geocode']
    });
  // Set initial restrict to the greater list of countries.
  originautocomplete.setComponentRestrictions({
      'country': ['ind']
  });

  destinationautocomplete = new google.maps.places.Autocomplete(
    (document.getElementById('destinationautocomplete')), {
      types: ['geocode']
    });

  destinationautocomplete.setComponentRestrictions({
    'country': ['ind']
  });
}


// Bias the autocomplete object to the user's geographical location,
// as supplied by the browser's 'navigator.geolocation' object.
function geolocate() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var geolocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      var circle = new google.maps.Circle({
        center: geolocation,
        radius: position.coords.accuracy
      });
      autocomplete.setBounds(circle.getBounds());
    });
  }
}

function CalculatedRecommededDistance() {
  CalculateDistanceforAllAlternativeRoutes();

    var origin = document.getElementById('originautocomplete').value;
   // var origin = 'Thiruchengodu, Tamil Nadu, India';
    console.log(origin);
  var destination = document.getElementById('destinationautocomplete').value;

  var geocoder = new google.maps.Geocoder();
  var service = new google.maps.DistanceMatrixService();

  service.getDistanceMatrix({
    origins: [origin],
    destinations: [destination],
    travelMode: 'DRIVING',
    unitSystem: google.maps.UnitSystem.METRIC,
    avoidHighways: false,
    avoidTolls: false,
    avoidFerries: false

  }, function(response, status) {
    var originList = response.originAddresses;
    var destinationList = response.destinationAddresses;
    var outputDiv = document.getElementById('outputRecommended');
    outputDiv.innerHTML = '';
    //Display distance recommended value
    for (var i = 0; i < originList.length; i++) {
      var results = response.rows[i].elements;
      for (var j = 0; j < results.length; j++) {
        outputDiv.innerHTML += originList[i] + ' to ' + destinationList[j] +
          ': ' + results[j].distance.text + ' in ' +
          results[j].duration.text + '<br>';
      }
    }
  });
}

function CalculateDistanceforAllAlternativeRoutes() {
  var directionsService = new google.maps.DirectionsService();
  var start = document.getElementById('originautocomplete').value;
  var end = document.getElementById('destinationautocomplete').value;
  var method = 'DRIVING';
  var request = {
    origin: start,
    destination: end,
    travelMode: google.maps.DirectionsTravelMode[method],
    provideRouteAlternatives: true,
    unitSystem: google.maps.UnitSystem.METRIC,
    optimizeWaypoints: true
  };

  directionsService.route(request, function(response, status) {
    var routes = response.routes;
    var distances = [];
    for (var i = 0; i < routes.length; i++) {

      var distance = 0;
      for (j = 0; j < routes[i].legs.length; j++) {
        distance = parseInt(routes[i].legs[j].distance.value) + parseInt(distance);
        //for each 'leg'(route between two waypoints) we get the distance and add it to 
      }
      //Convert into kilometer
      distances.push(distance / 1000);
    }
    //Get all the alternative distances
    var maxDistance = distances.sort(function(a, b) {
      return a - b;
    });
    //Display distance having highest value.
    var outputDiv = document.getElementById('output');
    outputDiv.innerHTML = Math.round(maxDistance[routes.length - 1]) + " KM";
  });
    showmap();
}


function showmap() {
    var directionsService = new google.maps.DirectionsService();
    var directionsDisplay = new google.maps.DirectionsRenderer();

    var myOptions = {
        zoom: 7,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    var origin = document.getElementById('originautocomplete').value;  
    console.log(origin);
    var destination = document.getElementById('destinationautocomplete').value;
    var map = new google.maps.Map(document.getElementById("map"), myOptions);
    directionsDisplay.setMap(map);

    var request = {
        origin: origin,
        destination: destination,
        travelMode: google.maps.DirectionsTravelMode.DRIVING
    };

    directionsService.route(request, function (response, status) {
        if (status == google.maps.DirectionsStatus.OK) {

            // Display the distance:
            //document.getElementById('distance').innerHTML +=
            //    response.routes[0].legs[0].distance.value + " meters";

            //// Display the duration:
            //document.getElementById('duration').innerHTML +=
            //    response.routes[0].legs[0].duration.value + " seconds";

            directionsDisplay.setDirections(response);
        }
    });
}