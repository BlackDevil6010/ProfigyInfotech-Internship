document.addEventListener('DOMContentLoaded', () => {
    // VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV
    // V IMPORTANT: REPLACE 'YOUR_API_KEY' WITH YOUR ACTUAL VALID API KEY  V
    const apiKey = '944eb8d0fb0cf6786a1ee3d150d1b93b'; // <--- REPLACE THIS!
    // VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV

    const cityInput = document.getElementById('cityInput');
    const searchButton = document.getElementById('searchButton');

    const loadingDiv = document.getElementById('loading');
    const errorDiv = document.getElementById('error');
    const weatherInfoContent = document.getElementById('weather-info-content');

    const locationNameEl = document.getElementById('locationName');
    const currentDateEl = document.getElementById('currentDate');
    const weatherIconEl = document.getElementById('weatherIcon');
    const weatherDescriptionEl = document.getElementById('weatherDescription');
    const temperatureValueEl = document.getElementById('temperatureValue');

    const windSpeedEl = document.getElementById('windSpeed');
    const humidityValueEl = document.getElementById('humidityValue');
    const visibilityValueEl = document.getElementById('visibilityValue');

    // Function to format the current date as "7 Jan 2024"
    function getFormattedDate() {
        const today = new Date();
        const ऑप्शंस = { day: 'numeric', month: 'short', year: 'numeric' };
        return today.toLocaleDateString('en-GB', ऑप्शंस); // 'en-GB' for day-month-year order
    }

    searchButton.addEventListener('click', () => {
        const city = cityInput.value.trim();
        if (city) {
            fetchWeatherByCity(city);
        } else {
            showError('Please enter a city name.');
        }
    });

    cityInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            searchButton.click();
        }
    });

    function showLoading() {
        loadingDiv.style.display = 'block';
        errorDiv.style.display = 'none';
        weatherInfoContent.style.display = 'none';
    }

    function showError(message) {
        loadingDiv.style.display = 'none';
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
        weatherInfoContent.style.display = 'none';
    }

    function showWeatherContent() {
        loadingDiv.style.display = 'none';
        errorDiv.style.display = 'none';
        weatherInfoContent.style.display = 'block';
    }

    async function fetchWeatherByCity(city) {
        if (!apiKey || apiKey === 'YOUR_API_KEY') {
            showError('API Key is missing or is a placeholder. Please add your OpenWeatherMap API key to script.js');
            return;
        }
        showLoading();
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

        try {
            const response = await fetch(url);
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: "Could not parse error response." }));
                if (response.status === 401) {
                     throw new Error(`API Key is invalid or not activated: ${errorData.message || 'Unauthorized'} (Status 401)`);
                } else if (response.status === 404) {
                    throw new Error(`City not found: ${errorData.message || 'Please check the spelling.'} (Status 404)`);
                } else {
                    throw new Error(`API Error: ${errorData.message || response.statusText} (Status ${response.status})`);
                }
            }
            const data = await response.json();
            displayWeather(data);
        } catch (error) {
            console.error('Error fetching weather by city:', error);
            showError(error.message || 'Could not fetch weather data. Please try again.');
        }
    }

    // --- Geolocation Functionality (Currently not tied to a button in this UI) ---
    // You can uncomment this and add a button if you want "Use My Location" feature
    /*
    async function fetchWeatherByCoords(lat, lon) {
        if (!apiKey || apiKey === 'YOUR_API_KEY') {
            showError('API Key is missing. Please add your OpenWeatherMap API key to script.js');
            return;
        }
        showLoading();
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
        try {
            const response = await fetch(url);
            if (!response.ok) {
                 const errorData = await response.json().catch(() => ({ message: "Could not parse error response." }));
                 if (response.status === 401) {
                     throw new Error(`API Key is invalid or not activated: ${errorData.message || 'Unauthorized'} (Status 401)`);
                } else {
                    throw new Error(`API Error: ${errorData.message || response.statusText} (Status ${response.status})`);
                }
            }
            const data = await response.json();
            displayWeather(data);
        } catch (error) {
            console.error('Error fetching weather by coordinates:', error);
            showError(error.message || 'Could not fetch weather data for your location.');
        }
    }

    // Example: How you might trigger geolocation if you add a button for it
    // const getLocationBtn = document.getElementById('getLocationBtn'); // Assuming you add a button with this ID
    // if (getLocationBtn) {
    //     getLocationBtn.addEventListener('click', () => {
    //         if (navigator.geolocation) {
    //             showLoading();
    //             navigator.geolocation.getCurrentPosition(position => {
    //                 fetchWeatherByCoords(position.coords.latitude, position.coords.longitude);
    //             }, (geoError) => {
    //                 console.error("Geolocation error:", geoError);
    //                 showError(`Unable to retrieve your location: ${geoError.message}.`);
    //                 loadingDiv.style.display = 'none';
    //                 weatherInfoContent.style.display = 'none';
    //             });
    //         } else {
    //             showError('Geolocation is not supported by your browser.');
    //         }
    //     });
    // }
    */

    function displayWeather(data) {
        if (!data || !data.main || !data.weather || !data.weather[0]) {
            showError('Received incomplete weather data from API.');
            console.error("Incomplete data structure:", data);
            return;
        }
        showWeatherContent();

        locationNameEl.textContent = data.name;
        currentDateEl.textContent = getFormattedDate(); // Set current date

        weatherIconEl.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
        weatherIconEl.alt = data.weather[0].description;
        weatherDescriptionEl.textContent = data.weather[0].description;

        temperatureValueEl.textContent = Math.round(data.main.temp);

        windSpeedEl.textContent = (data.wind.speed * 3.6).toFixed(1); // m/s to km/h
        humidityValueEl.textContent = data.main.humidity;
        visibilityValueEl.textContent = (data.visibility / 1000).toFixed(1); // meters to km

        cityInput.value = ''; // Clear input field
    }

     // Initial check for API Key placeholder
    if (!apiKey || apiKey === 'YOUR_API_KEY') {
        showError('Welcome! Please configure your OpenWeatherMap API key in the script.js file to use the app.');
    } else {
        // Optional: Fetch weather for a default city on load
        // fetchWeatherByCity("Delhi"); // Example
    }
});