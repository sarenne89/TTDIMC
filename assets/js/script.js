const ticketmasterAPI = "TovktxkNd9SCHIbV6i86RNM5LCG0A2r9";
const weatherAPI = "aefc3d833526ac11a10cd57951b4969d";
const searchLocation = $("#search-input").val()
const geoURL = "https://api.openweathermap.org/geo/1.0/direct?q=" + searchLocation + "&limit=5&appid=" + weatherAPI;
const ticketmasterURL = "https://app.ticketmaster.com/discovery/v2/events.json?countryCode=UK&apikey=" + ticketmasterAPI;

$( function() {
    $("#datepicker").datepicker();
  } );


function exampleBanner() {
    fetch(ticketmasterURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
        console.log(data)
    eventImage = $(".event-image")
    eventBanner = $(".event")
    eventInfo = $(".event-info")
    eventBackgroundImage = $("<img>").attr({"src": data._embedded.events[0].images[0].url, "height": "200px"})
    eventImage.append(eventBackgroundImage)
    eventName = $("<h3>").text(data._embedded.events[0].name).attr("class", "text-center bg-primary text-light p-4 m-0")
    eventVenue = $("<p>").text(data._embedded.events[0]._embedded.venues[0].name)
    eventCity = $("<p>").text(data._embedded.events[0]._embedded.venues[0].city.name)
    eventDate = $("<p>").text(data._embedded.events[0].dates.start.localDate)
    eventTime = $("<p>").text(data._embedded.events[0].dates.start.localTime)
    eventLink = $("<button>").text("BUY TICKETS NOW").attr("class", "buyTickets btn btn-primary")
    eventInfo.append(eventName, eventVenue, eventCity, eventDate, eventTime, eventLink)
    const buyTicketsButton = $(".buyTickets")
    buyTicketsButton.on("click", function() {
      window.open(data._embedded.events[0].url)
    })
  })
}

exampleBanner()

