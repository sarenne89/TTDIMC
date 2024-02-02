const ticketmasterAPI = "TovktxkNd9SCHIbV6i86RNM5LCG0A2r9";
const weatherAPI = "aefc3d833526ac11a10cd57951b4969d";


function displayEvents(events) {
  console.log(events);
  // Created an events container in the form of an id to store all the event details
  const eventsContainer = $("#events");

  // The logic below clears the html element before the new request is appended to the html element
  eventsContainer.empty();
  // The if statement checks to see that the array, events is not empty before proceeding with the loop
  if (events.length > 0) {
    events.forEach((event) => {
      // I created a variable that stores the event details 
      const eventName = event.name || 'Event Name Not Available'; 
      const eventStartDate = event.dates.start.localDate || 'Start Date Not Available';
      const venueName = event._embedded.venues[0].name || 'Venue Name Not Available';
      const venueTime = event.dates.start.localTime

      // The variable eventHtml stores the html tags where the event details are embedded
      const eventHtml = `
        <div class="event">
          <h3>${eventName}</h3>
          <p>Date: ${eventStartDate}</p>
          <p>Venue: ${venueName}</p>
          <p>Time: ${venueTime}</p>
        </div>
      `;
      // Appends the details received from the container with id, events into the html tags
      eventsContainer.append(eventHtml);
    });
  } else {
    eventsContainer.text("No events found for the selected location.");
  }
}

$(function () {
  $("#datepicker").datepicker();

  $("#search-form").submit(function (event) {
    event.preventDefault();

    const searchLocation = $("#search-input").val();
    const geoURL = "https://api.openweathermap.org/geo/1.0/direct?q=" + searchLocation + "&limit=1&appid=" + weatherAPI;

    fetch(geoURL)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        // Gets the first element in the array from the fetch request
        const locationDetails = data[0];
        if (locationDetails) {
          // The city name and country are written in the div that contains the id location-details
          $("#location-details").text(
            `City: ${locationDetails.name}, Country: ${locationDetails.country}`
          );

          // the variables latitude and longitude store the lat and lon from the locationDetails object
          const latitude = locationDetails.lat;
          const longitude = locationDetails.lon;

          const ticketmasterURL = `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${ticketmasterAPI}&latlong=${latitude},${longitude}&radius=10`;

          fetch(ticketmasterURL)
            .then(function (response) {
              return response.json();
            })
            .then(function (data) {
              // returns all events and displays it
              let events = data._embedded.events || [];
              displayEvents(events);
            });
        } else {
          $("#location-details").text("Location details not found.");
        }
      });
  });
});

const searchLocation = $("#search-input").val()
const geoURL = "https://api.openweathermap.org/geo/1.0/direct?q=" + searchLocation + "&limit=5&appid=" + weatherAPI;
const ticketmasterURL = "https://app.ticketmaster.com/discovery/v2/events.json?countryCode=UK&apikey=" + ticketmasterAPI;

$( function() {
  $( "#datepicker" ).datepicker({
    showOn: "button",
    buttonImage: "images/calendar.gif",
    buttonImageOnly: true,
    buttonText: "Select date"
  });
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
