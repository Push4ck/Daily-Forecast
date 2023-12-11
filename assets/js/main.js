const apiKey = "f060df697e384e7bf229b8b9799e9791";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric";

const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");
const weatherIcon = document.querySelector(".weather-icon");
const errorDisplay = document.querySelector(".error");
const weatherDisplay = document.querySelector(".weather");

// Function to get the user's location and call checkWeather
async function getWeatherByUserLocation() {
    if (navigator.geolocation) {
        try {
            const position = await new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject);
            });

            const { latitude, longitude } = position.coords;
            const userLocationResponse = await fetch(`${apiUrl}&lat=${latitude}&lon=${longitude}&appid=${apiKey}`);
            const userLocationData = await userLocationResponse.json();

            if (userLocationResponse.status === 200) {
                checkWeather(userLocationData.name);
            } else {
                displayError("Unable to fetch user's location weather");
            }
        } catch (error) {
            displayError("Geolocation permission denied or not supported by your browser");
        }
    } else {
        displayError("Geolocation is not supported by your browser");
    }
}

// Function to handle weather data and display
async function checkWeather(city) {
    try {
        const response = await fetch(`${apiUrl}&q=${city}&appid=${apiKey}`);
        const data = await response.json();

        if (response.status === 404) {
            displayError("City not found");
        } else {
            displayWeather(data);
        }
    } catch (error) {
        displayError("An error occurred while fetching data");
    }
}

// Function to display weather information
function displayWeather(data) {
    const { name, main, wind, weather } = data;

    document.querySelector(".city").innerHTML = name;
    document.querySelector(".temp").innerHTML = Math.round(main.temp) + "°C";
    document.querySelector(".humidity").innerHTML = main.humidity + "%";
    document.querySelector(".wind").innerHTML = wind.speed + " km/h";

    const weatherIconMap = {
        "Clouds": "clouds.png",
        "Clear": "clear.png",
        "Rain": "rain.png",
        "Drizzle": "drizzle.png",
        "Mist": "mist.png"
    };

    const weatherCondition = weather[0].main;
    weatherIcon.src = `assets/images/${weatherIconMap[weatherCondition]}`;

    weatherDisplay.style.display = "block";
    errorDisplay.style.display = "none";
}

// Function to display error messages
function displayError(message) {
    errorDisplay.innerHTML = message;
    errorDisplay.style.display = "block";
    weatherDisplay.style.display = "none";
}

// Event listener for search button click
searchBtn.addEventListener("click", () => checkWeather(searchBox.value));

// Event listener for Enter key press in the search input
searchBox.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        checkWeather(searchBox.value);
    }
});

// Initial call to get weather based on user location
document.addEventListener("DOMContentLoaded", getWeatherByUserLocation);
