const ticketmasterAPI = "TovktxkNd9SCHIbV6i86RNM5LCG0A2r9";
const weatherAPI = "aefc3d833526ac11a10cd57951b4969d";
const searchLocation = $("#search-input").val()
const geoURL = "https://api.openweathermap.org/geo/1.0/direct?q=" + searchLocation + "&limit=5&appid=" + weatherAPI;
const ticketmasterURL = "https://app.ticketmaster.com/discovery/v2/attractions.json?countryCode=UK&apikey=" + ticketmasterAPI;

$( function() {
    $("#datepicker").datepicker();
  } );


  fetch(ticketmasterURL)
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    console.log(data)
  })