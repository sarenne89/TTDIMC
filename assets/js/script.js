const ticketmasterAPI = "TovktxkNd9SCHIbV6i86RNM5LCG0A2r9";
const weatherAPI = "aefc3d833526ac11a10cd57951b4969d";
// The variable keeps track of the current page
let currentPage = 1;

function displayEvents(events) {
  // Created an events container in the form of an id to store all the event details
  const eventsContainer = $("#events");

  // The logic below clears the html element before the new request is appended to the html element
  eventsContainer.empty();
  // The if statement checks to see that the array, events is not empty before proceeding with the loop
  if (events.length > 0) {
    events.forEach((event) => {
      // I created a variable that stores the event details
      const eventName = event.name || "Event Name Not Available";
      const eventStartDate =
        event.dates.start.localDate || "Start Date Not Available";
      const venueName =
        event._embedded.venues[0].name || "Venue Name Not Available";
      const venueTime = event.dates.start.localTime;
      const buttonLink = event.url;
      const eventImage = event.images[0].url;

      // The variable eventHtml stores the html tags where the event details are embedded
      const eventHtml = `
        <div class="event row mb-0 p-3">
          <div class="col-6 event-info text-center mb-0">
            <h3 class="text-center bg-primary text-light p-4 mx-0">${eventName}</h3>
            <p>Date: ${eventStartDate}</p>
            <p>Venue: ${venueName}</p>
            <p>Time: ${venueTime}</p>
          </div>
          <div class='col-6 event-image justify-content-center'>
            <img class="d-flex" src=${eventImage} height="250">
          <div>
        </div>
      `;
      // Appends the details received from the container with id, events into the html tags
      const buttonSection = $("<div>").attr("class", "row");
      const eventButton = $("<button>")
        .attr("class", "event-button btn btn-warning col-12 mx-auto mb-5")
        .text("Buy Tickets Now!");
      eventButton.on("click", function () {
        window.open(buttonLink);
      });
      eventsContainer.append(eventHtml, buttonSection);
      buttonSection.append(eventButton);
    });
    // I am adding a div that will store the buttons at the end of the page
    const buttonDiv = $("<div>").attr("class", "row mt-3");

    // The variable stores the previous button and when it is clicked it returns to the previous page and displays the data
    const prevBtn = $("<button>")
      .attr("class", "btn btn-secondary col-6")
      .text("Previous")
      .on("click", function () {
        if (currentPage > 1) {
          currentPage--;
        }
      });

    // The variable below stores the next button and fetches new data when it is clicked
    const nextBtn = $("<button>")
      .attr("class", "btn btn-primary col-6")
      .text("Next")
      .on("click", function () {
        currentPage++;
      });

    buttonDiv.append(prevBtn, nextBtn);
    eventsContainer.append(buttonDiv);
  } else {
    eventsContainer.text("No events found for the selected location.");
  }
}

$(function () {
  $("#datepicker").datepicker();

  $("#search-form").submit(function (event) {
    event.preventDefault();

    const searchLocation = $("#search-input").val();
    const geoURL =
      "https://api.openweathermap.org/geo/1.0/direct?q=" +
      searchLocation +
      "&limit=1&appid=" +
      weatherAPI;

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
