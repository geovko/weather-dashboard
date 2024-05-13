const input = $('#input');
const inputBtn = $('#input-btn');
const historyList = $('#history');
const weatherBox = $('#right');
let pastCities = JSON.parse(localStorage.getItem('cities'));
let currentCity = JSON.parse(localStorage.getItem('currentCity'));
const apiKey = '1a3482dd9672cae11ded6a5b0ae104ae';

// const currentCity (pull from most recent in local storage) (check for repeats?)
function renderHistory() {
    // Render search history
    if (pastCities.length>10) {
        pastCities.splice(0, 1);
    }

    historyList.append('<h2>Past Searches:</h2>')
    for (i=(pastCities.length-1); i>-1; i--) {
        const pastCity = $(`<div>${pastCities[i]}</div>`);
        pastCity.addClass('past-city');
        historyList.append(pastCity);
    }

    return;
}

// renders page, deals with initial stage of webpage
function renderPage() {
    // SET INITIAL
    if (pastCities == null || pastCities == []) {
        pastCities = ['Seattle'];
        localStorage.setItem('cities', JSON.stringify(pastCities));
        location.reload();
    }
    
    if (currentCity == null || currentCity == '') {
        currentCity = pastCities[(pastCities.length-1)];
        localStorage.setItem('currentCity', JSON.stringify(currentCity));
        currentCity = pastCities[(pastCities.length-1)];
        alert('Please enter a city!');
    }
    
    renderHistory();

    if (currentCity != '') { 
        getGeo(currentCity);
    }

    return;
}

// makes a single card of weather info
function weatherStats(data, index) {
    const list = data.list;
    const card = $('<div>');
    card.append(`<p>Status: ${list[index].weather[0].main}</p>`);
    card.append(`<p>Temp: ${list[index].main.temp}\u00B0F</p>`);
    card.append(`<p>Wind: ${list[index].wind.speed}mph</p>`);
    card.append(`<p>Humidity: ${list[index].main.humidity}%</p>`);

    return card;
}

// render weather forecast data
function renderForecast(data) {
    const today = dayjs();

    // current day forecast
    const weatherNow = $('<div>');
    weatherNow.addClass('inner-box');
    weatherNow.addClass('current');
    weatherNow.append(`<h2>${data.city.name} (${data.city.country}): ${today.format('MM/DD/YYYY')}</h2>`);
    weatherNow.append(weatherStats(data, 0));
    weatherBox.append(weatherNow);

    // following five-day forecast
    const weatherLater = $('<div>');
    weatherLater.addClass('inner-box');
    weatherLater.attr('id', 'weather-forecast');
    weatherLater.append('<h2>5-Day Forecast:</h2>')
    
    const forecastBox = $('<div>');
    forecastBox.addClass('forecast-box');
    
    for (i=7; i<40; i+=8) {
        const card = $('<div>');
        card.addClass('forecast');
        card.append(`<h3>${today.add(((i+1)/8), 'day').format('MM/DD/YYYY')}</h3>`);
        card.append(weatherStats(data, i));
        forecastBox.append(card);
    }

    forecastBox.appendTo(weatherLater);
    weatherBox.append(weatherLater);
}

// get lat and lon from city name
function getGeo(city) {
    fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`)
        .then(response => {
            return response.json();
        })
        .then(data => {
            lat = data[0].lat;
            lon = data[0].lon;
            // SEND TO GET DATA
            for (i=0; i<pastCities.length; i++) {
                if (data[0].name == pastCities[i]) {
                    pastCities.splice(i, 1);
                }
            }
            pastCities.push(data[0].name);
            localStorage.setItem('cities', JSON.stringify(pastCities));
            getWeather(lat, lon);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

// get weather data from API
function getWeather(lat, lon) {
    fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`)
        .then(response => {
            return response.json();
        })
        .then(data => {
            // SEND TO RENDER
            renderForecast(data);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

// handles the input event
function handleInput(event) {
    event.preventDefault();
    
    currentCity = input[0].value.trim();
    console.log(currentCity);
    localStorage.setItem('currentCity', JSON.stringify(currentCity));

    location.reload();
    return;
}

// load page...
$(document).ready(function () {
    console.log('ready');

    renderPage();
 
    inputBtn.on('click', function (event) {
        handleInput(event);
    });

    $('.past-city').on('click', function (event) {
        currentCity = event.target.textContent;
        localStorage.setItem('currentCity', JSON.stringify(currentCity));
        location.reload();
    });
});