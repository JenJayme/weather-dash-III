// OPEN WEATHER EXAMPLE API CALL
// api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}

var apiKey = "8b262eaefe86d4d8579b9c93d3ba1dfc";
var queryURL;
var city, weatherToday;

eventListeners = () => {
    $('#searchBtn').on('click', function (e) {
        e.preventDefault();
        getWeather();
    })
}


getForecast = () => {
    console.log("Running getForecast function.");
    $('#forecast').append(
    `<div class="card" style="width: 18rem;">
        <img src="placeholder.png" class="card-img-top mt-3" alt="weather icon" style="width:80px; margin:auto">
            <div class="card-body">
                <h5 class="card-title">Day, Date</h5>
                <p class="card-text">High: </p>
                <p>Low:</p>
                <p>Humidity:</p>
            </div>
    </div>`)
}

getWeather = () => {
    city = getCity();
    console.log("Running getWeather function. City:", city);

    $.ajax({
        url: `https://cors-anywhere.herokuapp.com/http://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`,
        method: "GET",
        contentType: "application/json",
        dataType: "json",
        success: function(result) {
            weatherToday = result;
            console.log(weatherToday);
            $('#description').text(weatherToday.weather[0].description);
            $('#temp').text(weatherToday.main.temp);
            $('#humidity').text(weatherToday.main.humidity+"%");
            $('#windSpeed').text(weatherToday.wind.speed + "mph");
            $('#windDirection').text(weatherToday.wind.deg);
            let iconImage = `<img src="http://openweathermap.org/img/wn/${weatherToday.weather[0].icon}@2x.png" />`;
            $('#icon').append(iconImage);
            return weatherToday;
        },
        error: function(error) {
            console.log(error)
        }
    })

    getForecast();
}

// {
//     "coord": {
//       "lon": -122.08,
//       "lat": 37.39
//     },
//     "weather": [
//       {
//         "id": 800,
//         "main": "Clear",
//         "description": "clear sky",
//         "icon": "01d"
//       }
//     ],
//     "base": "stations",
//     "main": {
//       "temp": 282.55,
//       "feels_like": 281.86,
//       "temp_min": 280.37,
//       "temp_max": 284.26,
//       "pressure": 1023,
//       "humidity": 100
//     },
//     "visibility": 16093,
//     "wind": {
//       "speed": 1.5,
//       "deg": 350
//     },
//     "clouds": {
//       "all": 1
//     },
//     "dt": 1560350645,
//     "sys": {
//       "type": 1,
//       "id": 5122,
//       "message": 0.0139,
//       "country": "US",
//       "sunrise": 1560343627,
//       "sunset": 1560396563
//     },
//     "timezone": -25200,
//     "id": 420006353,
//     "name": "Mountain View",
//     "cod": 200
//     }                         
                          

getCity = () => {
    console.log("Running getCity function.");
    city = $('#city').val();
    return city
}


$(document).ready(function () {
    eventListeners();
})