const apiKey = "522f2bc9e32d1d6d341ee5bca553d467"; // Replace with your OpenWeatherMap API key
const apiBaseUrl = "https://api.openweathermap.org/data/2.5/";

// Fetch weather by city name
function getWeather() {
    const city = document.getElementById("city-input").value;
    if (city) {
        fetchWeather(city);
    } else {
        alert("Please enter a city name!");
    }
}

// Fetch weather data from API
async function fetchWeather(city) {
    try {
        const response = await fetch(`${apiBaseUrl}weather?q=${city}&appid=${apiKey}&units=metric`);
        const data = await response.json();
        if (data.cod === 200) {
            displayWeather(data);
            fetchHourlyForecast(data.coord.lat, data.coord.lon);
            updateBackground(data.weather[0].main);
        } else {
            alert("City not found!");
        }
    } catch (error) {
        console.error("Error fetching weather:", error);
        alert("Something went wrong!");
    }
}

// Display current weather with more components
function displayWeather(data) {
    document.getElementById("city-name").textContent = `${data.name}, ${data.sys.country}`;
    document.getElementById("weather-icon").src = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    document.getElementById("temperature").textContent = `Temperature: ${data.main.temp}°C`;
    document.getElementById("feels-like").textContent = `Feels Like: ${data.main.feels_like}°C`;
    document.getElementById("description").textContent = `Condition: ${data.weather[0].description}`;
    document.getElementById("humidity").textContent = `Humidity: ${data.main.humidity}%`;
    document.getElementById("wind-speed").textContent = `Wind Speed: ${data.wind.speed} m/s`;
    document.getElementById("pressure").textContent = `Pressure: ${data.main.pressure} hPa`;
    document.getElementById("visibility").textContent = `Visibility: ${(data.visibility / 1000)} km`;
}

// Fetch hourly forecast
async function fetchHourlyForecast(lat, lon) {
    try {
        const response = await fetch(`${apiBaseUrl}forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`);
        const data = await response.json();
        displayHourlyForecast(data.list.slice(0, 8));
    } catch (error) {
        console.error("Error fetching hourly forecast:", error);
    }
}

// Display hourly forecast
function displayHourlyForecast(forecast) {
    const container = document.getElementById("hourly-container");
    container.innerHTML = "";
    forecast.forEach(item => {
        const time = new Date(item.dt * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        const temp = item.main.temp;
        const desc = item.weather[0].description;
        const icon = item.weather[0].icon;
        const div = document.createElement("div");
        div.classList.add("hourly-item");
        div.innerHTML = `
            <p>${time}</p>
            <img src="http://openweathermap.org/img/wn/${icon}.png" alt="${desc}">
            <p>${temp}°C</p>
            <p>${desc}</p>
        `;
        container.appendChild(div);
    });
}

// Update background based on weather condition
function updateBackground(condition) {
    const body = document.body;
    switch (condition.toLowerCase()) {
        case "clear":
            body.style.background = "linear-gradient(135deg, #87CEEB, #FFD700, #FFA500)";
            break;
        case "clouds":
            body.style.background = "linear-gradient(135deg, #B0C4DE, #708090, #4682B4)";
            break;
        case "rain":
            body.style.background = "linear-gradient(135deg, #4682B4, #2F4F4F, #1E90FF)";
            break;
        case "snow":
            body.style.background = "linear-gradient(135deg, #E6E6FA, #FFFFFF, #B0E0E6)";
            break;
        case "thunderstorm":
            body.style.background = "linear-gradient(135deg, #2F4F4F, #483D8B, #191970)";
            break;
        default:
            body.style.background = "linear-gradient(135deg, #87CEEB, #4682B4, #06c465)";
    }
}

// Geolocation weather on page load
function getWeatherByLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            const response = await fetch(`${apiBaseUrl}weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`);
            const data = await response.json();
            displayWeather(data);
            fetchHourlyForecast(lat, lon);
            updateBackground(data.weather[0].main);
        }, () => {
            alert("Geolocation denied. Please search for a city.");
        });
    }
}

// Initialize with geolocation
window.onload = getWeatherByLocation;