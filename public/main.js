// Private
  // Foursquare API Info
  const clientId = '';
  const clientSecret = '';
  const url = 'https://api.foursquare.com/v2/venues/explore?near=';

  // OpenWeather Info
  const openWeatherKey = '';
  const weatherUrl = 'https://api.openweathermap.org/data/2.5/weather';

// Page Elements
const $input = $('#city');
const $submit = $('#button');
const $destination = $('#destination');
const $container = $('.container');
const $container_default = $('.container_default');
const $venueDivs = [$("#venue1"), $("#venue2"), $("#venue3"), $("#venue4"), $("#venue5"), $("#venue6")];
const $weatherDiv = $("#weather1");
const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

//AJAX
const getVenues = async () => {
  const date = '20210317';
  const userInput = $input.val();

  const urlToFetch = `${url}${userInput}&limit=10
    &client_id=${clientId}&client_secret=${clientSecret}
    &v=${date}`;
  
  try {
    const response = await fetch(urlToFetch);
    if (response.ok) {
      const jsonResponse = await response.json();
      const venues = jsonResponse.response.groups[0].items.map(item => item.venue);
      console.log(venues);
      console.log(jsonResponse);
      return venues;
    }
  } catch (error) {
      console.log(error);
  }
};

const getForecast = async () => {
  const userInput = $input.val();
  const urlToFetch = weatherUrl + '?q=' + userInput + '&units=metric&appid=' + openWeatherKey;

  try {
    const response = await fetch(urlToFetch);
    if (response.ok) {
      const jsonResponse = await response.json();
      console.log(jsonResponse);
      return jsonResponse;
    }
  } catch (error) {
    console.log(error);
  }
};

// Render functions
const renderVenues = async (venues) => {
  $venueDivs.forEach(($venue, index) => {
    const venue = venues[index];
    const venueIcon = venue.categories[0].icon;
    const venueImgSrc = venueIcon.prefix + 'bg_64' + venueIcon.suffix;
    const venueType = venue.categories[0].name;
    const venueAdress = venue.location.address;
    const venuePostal = venue.location.postalCode;
    
    let venueContent = `
        <h2>${venue.name}</h2>
        <img class="venueimage" src="${venueImgSrc}"/>
        <p>${venueType}</p>
        <p>${venueAdress}</p>
        <p>${venuePostal}</p>
    `;

    $venue.append(venueContent);
  });

  let dayOfMonth = new Date().getDay();
  let date = new Date().getDate();
  let month = new Date().getMonth();
  let year = new Date().getFullYear();
  let fullDate = weekDays[dayOfMonth] + ', ' + date + ' ' + months[month] + ' ' + year;

  let hour = new Date().getHours();
  let minutes = new Date().getMinutes();
  let time = hour + ':' + minutes;

  $destination.append(
      `<h2>${venues[0].location.city}, ${venues[0].location.country}</h2>
      <h3>${fullDate}</h3>
      <h3>${time}</h3>
      `);
}

const renderForecast = (day) => {
  let temp = 'Temperature: ' + day.main.temp.toFixed(0) + '&deg;C';
  let feelsLike = 'Feels like: ' + day.main.feels_like.toFixed(0) + '&deg;C';
  let wind = 'Wind: ' + day.wind.speed.toFixed(0) + ' m/s.';
  let condition = 'Condition: ' + day.weather[0].description;

  let weatherContent = `
    <h2>${temp}</h2>
    <h2>${feelsLike}</h2>
    <h2>${wind}</h2>
    <h2>${condition}</h2>
    <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png">
     `;

  $weatherDiv.append(weatherContent);
}

const executeSearch = () => {
  $venueDivs.forEach(venue => venue.empty());
  $weatherDiv.empty();
  $destination.empty();
  $container.css("visibility", "visible");
  $container.css("display", "block");
  $container_default.css("visibility", "hidden");
  $container_default.css("display", "none");
  getVenues().then(venues => renderVenues(venues));
  getForecast().then(forecast => renderForecast(forecast));
  return false;
}

$submit.click(executeSearch)