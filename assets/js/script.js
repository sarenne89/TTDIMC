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
      const eventName = event.name || 'Event Name Not Available'; 
      const eventStartDate = event.dates.start.localDate || 'Start Date Not Available';
      const venueName = event._embedded.venues[0].name || 'Venue Name Not Available';
      const venueTime = event.dates.start.localTime
      const buttonLink = event.url
      const eventImage = event.images[0].url

      eventDiv = $("<div>").attr("class", "border event row my-5 py-2 pl-2 pr-0")
      eventInfoDiv = $("<div>").attr("class", "col-6 event-info text-center m-0")
      eventTitle = $("<h3>").attr("class", "text-center bg-primary text-light p-3 mx-0").text(eventName)
      eventDate = $("<p>").text(dayjs(eventStartDate, "YYYY-DD-MM").format("DD-MMM-YYYY"))
      eventVenue = $("<p>").text(venueName)
      eventTime = $("<p>").text(venueTime)
      buttonSection = $("<div>").attr("class", "row")
      eventImageDiv = $("<div>").attr("class", "col-6 event-image row text-center m-0 p-0")
      eventImages = $("<img>").attr({"src": eventImage, "max-width": "400px"})
      // Appends the details received from the container with id, events into the html tags
      
      eventButton = $("<button>").attr("class", "event-button btn btn-warning col-12 mx-auto mb-5").text("Buy Tickets Now!")
      eventButton.on("click", function(){
        window.open(buttonLink)
      })
      eventsContainer.append(eventDiv)
      eventDiv.append(eventInfoDiv, eventImageDiv)
      eventInfoDiv.append(eventTitle, eventDate, eventVenue, eventTime, buttonSection)
      buttonSection.append(eventButton)
      eventImageDiv.append(eventImages)
  
    });

      // I am adding a div that will store the buttons at the end of the page
    const buttonDiv = $("<div>").attr("class", "row mt-3");
      
    // The variable stores the previous button and when it is clicked it returns to the previous page and displays the data
    const prevBtn = $("<button>").attr("class", "btn btn-secondary col-5 mx-auto my-3").text("<<< Previous").on("click", function(){
      if(currentPage>1){
        currentPage--;
      }
    });

    // The variable below stores the next button and fetches new data when it is clicked
    const nextBtn = $("<button>").attr("class", "btn btn-primary col-5 mx-auto my-3").text("Next >>>").on("click", function(){
      currentPage++;
    });

    buttonDiv.append(prevBtn, nextBtn);
    eventsContainer.append(buttonDiv)

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
          const requestedDate = dayjs($("#datepicker").val(), "DD/MM/YYYY").format("YYYY-MM-DD")
          const ticketmasterURL = "https://app.ticketmaster.com/discovery/v2/events.json?city=" + searchLocation + "&startDateTime=" + requestedDate + "T00:00:00Z&apikey=" + ticketmasterAPI
          const weatherURL = "https://api.openweathermap.org/data/2.5/weather?lat=" + latitude + "&lon=" + longitude + "&appid=" + weatherAPI;
          fetch(weatherURL)
                .then(function(response) {
                    return response.json()
                }).then(function(weatherData) {
                  $("#weather").attr("class", "row")
                  $("#weatherLocation").text(weatherData.name)
                  $("#weatherIcon").attr("src", "https://openweathermap.org/img/wn/" + weatherData.weather[0].icon + "@2x.png")
                  $("#weatherTemp").text("Temp: " + (weatherData.main.temp -= 273.15).toFixed(0) + "°C")
                  $("#weatherWind").text("Wind: " + weatherData.wind.speed + " m/s")
                  $("#weatherHumidity").text("Humidity: " + weatherData.main.humidity + "%")
                })

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
      })
    });
});