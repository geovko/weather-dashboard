const input = document.querySelector('#input');
const inputBtn = document.querySelector('#input-btn');
const historyList = document.querySelector('#history');
const weatherBox = document.querySelector('#right');
let storedCities = JSON.parse(localStorage.getItem('cities'));
let currentCity = JSON.parse(localStorage.getItem('currentCity'));
currentCity = 'Seattle';
const apiKey = '1a3482dd9672cae11ded6a5b0ae104ae';
let city = '';
let lat = '';
let lon = '';

// const currentCity (pull from most recent in local storage) (check for repeats?)
function renderHistory() {
    // Render search history
    

    console.log('rendered history');
    return;
}

function renderWeather() {
    // Render current weather
    // <div id="current" class="inner-box"></div>
    if (currentCity == null) {
        currentCity = "";
        localStorage.setItem('currentCity', JSON.stringify(currentCity));
    }

    console.log(currentCity);
    getGeo(currentCity);

    // Render 5-day forecast
    // <div id="forecast" class="inner-box"></div>

    console.log('rendered weather');
    return;
}

function renderForecast(data) {
    const list = data.list;
    console.log(data.city.name);

    // current day forecast
    const today = dayjs();
    console.log(today.format('MM/DD/YYYY hh:mma'));
    console.log(`Weather: ${list[0].weather[0].main}`);
    console.log(`Temp: ${list[0].main.temp}\u00B0F`);
    console.log(`Wind: ${list[0].wind.speed}mph`);
    console.log(`Humidity: ${list[0].main.humidity}%`);
    console.log('-----');
    
    // following five-day forecast
    for (i=7; i<40; i+=8) {
        console.log(today.add(((i+=1)/8), 'day').format('MM/DD/YYYY'));
        console.log(`Weather: ${list[i].weather[0].main}`);
        console.log(`Temp: ${list[i].main.temp}\u00B0F`);
        console.log(`Wind: ${list[i].wind.speed}mph`);
        console.log(`Humidity: ${list[i].main.humidity}%`);
    }
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
            console.log(data);
            renderForecast(data);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

function checkHistory(city) {
console.log(storedCities);
    if (storedCities == null || storedCities == '') {
        storedCities = [];
        localStorage.setItem('cities', JSON.stringify(storedCities));
    }
    console.log(storedCities);

    for (i=0; i<storedCities.length; i++) {
        if (city == storedCities[i]) {
            console.log(storedCities);
            return storedCities;
        }
    }

    storedCities.push(JSON.stringify(city.value));
    localStorage.setItem('cities', JSON.stringify(city));
    console.log(storedCities);
    return storedCities;
}

function handleInput(event) {
    event.preventDefault();

    checkHistory(input);
    currentCity = input;
    localStorage.setItem('currentCity', JSON.stringify(currentCity));
    //document.reload();
    console.log(currentCity);
    return;
}

// document ready + event listeners (submit) + history buttons
$(document).ready(function () {
    console.log('ready');
    
    //checkHistory('Seattle');
    //renderHistory();
    renderWeather();
 
    inputBtn.addEventListener('click', function (event) {
        handleInput(event);
    });
});