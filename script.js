// ONE API CALL FOR FORECAST
// https://api.openweathermap.org/data/2.5/onecall?lat=33.441792&lon=-94.037689&exclude=hourly,daily&appid={API key}

var cityName = '';
var weatherToday, lat, lon;
var forecastArray = [];
var dayWeatherObj = {};
var cityCoords = {};
var searchHistory = [];
var favoritesList = [];
// searchHistory = localStorage.getItem("searchHistory");
console.log("searchHistory", searchHistory);
var APIkey = "8b262eaefe86d4d8579b9c93d3ba1dfc";
var corsProxy = "https://cors-anywhere.herokuapp.com/";
var today = (moment().format('ddd, MMMM DD, YYYY'));

$('#today').text(today);


var testqueryURL = corsProxy + `http://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&exclude=hourly&appid=${APIkey}`;
// console.log(testqueryURL);

eventListeners = () => {
    $('#searchBtn').on('click', function (e) {
        e.preventDefault();
        cityName = $('#city').val();
        startQuery();
        $('#location').text(cityName);
    })
    $('#refreshCityList').on('click', function (e) {
        e.preventDefault();
        refreshCityList();
    })
}

findCityCoords = () => {

    cityName = $('#city').val();

    if (cityName == null || typeof cityName == undefined) {
        alert("cityName is null")
    }

    console.log("Running findCityCoords on this cityName", cityName);

    let cityQuery = corsProxy + `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=5&appid=${APIkey}`;
    console.log("cityQuery:", cityQuery);

    $.ajax({
        url: cityQuery,
        method: "GET",
        contentType: "application/json",
        dataType: "json",
        headers: {
        "X-Requested-With": "XMLHttpRequest"
        },
        success: function (result) {
            console.log("SUCCESS! cityCoords:", result[0]);
            cityCoords = result[0];
            console.log("city search obj:", cityCoords);
            searchHistory.push(cityCoords);
            localStorage.setItem("searchHistory",searchHistory);
            lat = cityCoords.lat;
            lon = cityCoords.lon;
            if (confirm("City coordinates found. Getting weather for "+cityName+".")) {
                getWeather(lat, lon)
            };
            return forecastArray;
        },
        error: function (result) {
            alert("Error. cityCoords not found.", result)
        }
    })
}

appendForecast = (forecastArray) => {
    console.log("Running appendForecast function on this array:", forecastArray);
    $('#forecast').empty();
    for (i=0; i < forecastArray.length - 3; i++) {
        let dayWeatherObj = forecastArray[i];
        let UTCday = dayWeatherObj.dt;
        let day = new Date(UTCday*1000);
        let shortDay = (moment(day).format('ddd MMMM Do'));
        let iconImage = `http://openweathermap.org/img/wn/${dayWeatherObj.weather[0].icon}@2x.png`;
        $('#forecast').append(
            `<div class="card" style="width: 20%;">
                <img src="${iconImage}" class="card-img-top mt-3" alt="weather icon" style="width:80px; margin:auto">
                    <div class="card-body">
                        <h5 class="card-title">${shortDay}</h5>
                        <p class="card-text">Temperature: ${dayWeatherObj.humidity}F<br>
                        Humidity: ${dayWeatherObj.humidity}%</p>
                    </div>
            </div>`)
    }
}

startQuery = async () => {

    getWeather(findCityCoords);
    cityCoords = await findCityCoords();
}

getWeather = (lat, lon) => {

    let weatherQueryURL = corsProxy + `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&exclude=hourly&appid=${APIkey}`;

    $.ajax({
        url: weatherQueryURL,
        method: "GET",
        contentType: "application/json",
        dataType: "json",
        headers: {
        "X-Requested-With": "XMLHttpRequest"
        },
        success: function(result) {
            console.log("SUCCESS ON WEATHER QUERY!", result);
            weatherToday = result.current;
            forecastArray = result.daily;
            $('#description').text(weatherToday.weather[0].description);
            $('#temp').text(weatherToday.temp + "F");
            $('#humidity').text(weatherToday.humidity+"%");
            $('#windSpeed').text(weatherToday.wind_speed + " mph");
            $('#windDirection').text(weatherToday.wind_deg + " deg");
            let iconImage = `<img src="http://openweathermap.org/img/wn/${weatherToday.weather[0].icon}@2x.png" style="width:200px"/>`;
            $('#icon').html(iconImage);
            $('#uvIndex').text(weatherToday.uvi);
            console.log("result.daily:", result.daily);
            appendForecast(forecastArray);
            return forecastArray;
        },
        error: function(error) {
            console.log(error)
        }
    });
}

refreshCityList = () => {
    favoritesList = localStorage.getItem("searchHistory");
    console.log("Getting favoritesList", favoritesList);
    for (var i = 0; i < favoritesList.length; i++) {
        let faveCity = favoritesList.cityName;
        $('#cityList').append(`<li class="list-group-item">${faveCity}</li>`)
    }
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