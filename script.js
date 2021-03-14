// OPEN WEATHER EXAMPLE API CALL
// api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}

// ONE API CALL FOR FORECAST
// https://api.openweathermap.org/data/2.5/onecall?lat=33.441792&lon=-94.037689&exclude=hourly,daily&appid={API key}


var cityName, weatherToday, lat, lon;
var forecastArray = [];
var dayWeatherObj = {};
var APIkey = "8b262eaefe86d4d8579b9c93d3ba1dfc";
var corsProxy = "https://cors-anywhere.herokuapp.com/";
var today = (moment().format('ddd, MMMM DD, YYYY'));
console.log("today:", today);
lat = 33.441792;
lon = -94.037689;

// var queryURL;
// CURRENT DAY ONLY BY CITY
// var weatherAPI = `http://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=imperial&appid=`;
// var queryURL = corsProxy + weatherAPI + cityName + "&appid=" + APIkey;
// var testqueryURL = corsProxy + "http://api.openweathermap.org/data/2.5/weather?q=Novato&units=imperial&appid=8b262eaefe86d4d8579b9c93d3ba1dfc";
var testqueryURL = corsProxy + `http://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly&appid=${APIkey}`;



// REDO: 5 DAY FORECAST BY LAT & LON 
var weatherAPI = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly,daily&appid=${APIkey}`;
var queryURL = weatherAPI + cityName + "&appid=" + APIkey;
console.log(testqueryURL);


eventListeners = () => {
    $('#searchBtn').on('click', function (e) {
        e.preventDefault();
        getWeather();
    })
}


getCity = () => {
    console.log("Running getCity function.");
    cityName = $('#city').val();
    return cityName
}

appendForecast = (array) => {
    console.log("Running appendForecast function on this array:", array);
    for (i=0; i < array.length - 3; i++) {
        let dayWeatherObj = array[i];
        console.log(dayWeatherObj);
        // let day = (moment.utc(dayWeatherObj.dt).format('ddd MMMM Do'));
        let UTCday = dayWeatherObj.dt;
        let day = new Date(UTCday*1000);
        let shortDay = (moment(day).format('ddd MMMM Do'))
        console.log("day:", day);
        $('#forecast').append(
            `<div class="card" style="width: 20%;">
                <img src="placeholder.png" class="card-img-top mt-3" alt="weather icon" style="width:80px; margin:auto">
                    <div class="card-body">
                        <h5 class="card-title">${shortDay}</h5>
                        <p class="card-text">High: </p>
                        <p>Low:</p>
                        <p>Humidity:</p>
                    </div>
            </div>`)

    }
}


getWeather = () => {
    cityName = getCity();

    console.log("Running getWeather function. City:", cityName);

    $.ajax({
        url: testqueryURL,
        method: "GET",
        contentType: "application/json",
        dataType: "json",
        headers: {
        "X-Requested-With": "XMLHttpRequest"
        },
        success: function(result) {
            weatherToday = result.current;
            forecastArray = result.daily;
            console.log("weatherToday:", weatherToday);
            console.log("forecastArray:", forecastArray);
            $('#description').text(weatherToday.weather[0].description);
            $('#temp').text(weatherToday.temp);
            $('#humidity').text(weatherToday.humidity+"%");
            $('#windSpeed').text(weatherToday.wind_speed + "mph");
            $('#windDirection').text(weatherToday.wind_deg + "deg");
            // let iconImage = `<img src="http://openweathermap.org/img/wn/${weatherToday.weather[0].icon}@2x.png" />`;
            // $('#icon').append(iconImage);
            $('#uvIndex').text(weatherToday.uvi);
            appendForecast(forecastArray);
            return weatherToday;
        },
        error: function(error) {
            console.log(error)
        }
    });
    return forecastArray
}

// ONE API CALL FOR FORECAST
// https://api.openweathermap.org/data/2.5/onecall?lat=33.441792&lon=-94.037689&exclude=hourly,daily&appid={API key}
// {
//     "lat": 33.44,
//     "lon": -94.04,
//     "timezone": "America/Chicago",
//     "timezone_offset": -21600,
//     "current": {
//       "dt": 1595243443,
//       "sunrise": 1608124431,
//       "sunset": 1608160224,
//       "temp": 274.75,
//       "feels_like": 270.4,
//       "pressure": 1017,
//       "humidity": 96,
//       "dew_point": 274.18,
//       "uvi": 0,
//       "clouds": 90,
//       "visibility": 6437,
//       "wind_speed": 3.6,
//       "wind_deg": 320,
//       "weather": [
//         {
//           "id": 701,
//           "main": "Mist",
//           "description": "mist",
//           "icon": "50n"
//         }
//       ]
//     },
//     "minutely": [
//       {
//         "dt": 1595243460,
//         "precipitation": 0
//       },
//       ...
//     },
//       "hourly": [
//       {
//         "dt": 1595242800,
//         "temp": 274.75,
//         "feels_like": 271.22,
//         "pressure": 1017,
//         "humidity": 96,
//         "dew_point": 274.18,
//         "uvi": 0,
//         "clouds": 90,
//         "visibility": 1765,
//         "wind_speed": 2.43,
//         "wind_deg": 303,
//         "weather": [
//           {
//             "id": 804,
//             "main": "Clouds",
//             "description": "overcast clouds",
//             "icon": "04n"
//           }
//         ],
//         "pop": 0.1
//       },
//       ...
//     }
//   "daily": [
//           {
//         "dt": 1595268000,
//         "sunrise": 1608124431,
//         "sunset": 1608160224,
//         "temp": {
//           "day": 278.14,
//           "min": 273.15,
//           "max": 279.4,
//           "night": 273.15,
//           "eve": 275.82,
//           "morn": 275.35
//         },
//         "feels_like": {
//           "day": 273.53,
//           "night": 270.26,
//           "eve": 271.89,
//           "morn": 272.11
//         },
//         "pressure": 1021,
//         "humidity": 70,
//         "dew_point": 273.27,
//         "wind_speed": 3.74,
//         "wind_deg": 323,
//         "weather": [
//           {
//             "id": 803,
//             "main": "Clouds",
//             "description": "broken clouds",
//             "icon": "04d"
//           }
//         ],
//         "clouds": 60,
//         "pop": 0.84,
//         "uvi": 2.41
//       },
//       ...
//       },
//   "alerts": [
//       {
//         "sender_name": "NWS Tulsa (Eastern Oklahoma)",
//         "event": "Heat Advisory",
//         "start": 1597341600,
//         "end": 1597366800,
//         "description": "...HEAT ADVISORY REMAINS IN EFFECT FROM 1 PM THIS AFTERNOON TO\n8 PM CDT THIS EVENING...\n* WHAT...Heat index values of 105 to 109 degrees expected.\n* WHERE...Creek, Okfuskee, Okmulgee, McIntosh, Pittsburg,\nLatimer, Pushmataha, and Choctaw Counties.\n* WHEN...From 1 PM to 8 PM CDT Thursday.\n* IMPACTS...The combination of hot temperatures and high\nhumidity will combine to create a dangerous situation in which\nheat illnesses are possible."
//       },
//       ...
//     ]
                          

$(document).ready(function () {
    eventListeners();
})