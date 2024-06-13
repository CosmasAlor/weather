 
const key = 'f9604580c3764377bca225628241206';
const searchInput = document.getElementById('search');
let timeoutId;

searchInput.addEventListener('input', function() {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(handleInput, 500); 
});

async function logWeather(searchterm) {
    try {
        const response = await fetch(`https://api.weatherapi.com/v1/search.json?key=${key}&q=${searchterm}`);
        
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        
        const weatherData = await response.json();
        const location = weatherData[0].name;
        console.log("Weather Data:", location);
    
        getCities(location); 
    } catch (error) {
        console.error('Error fetching weather data:', error);
    }
}

async function getCities(location) {
    try {
        const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${key}&q=${location}&days=3`);
        
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        
        const data = await response.json();
        display(data); 
    } catch (error) {
        console.error('Error fetching city data:', error);
    }
}

function handleInput() {
    const searchterm = searchInput.value.trim();
    console.log("Search Term:", searchterm);
    
    if (searchterm === '') {
        console.log("Empty search term");
        return;
    }
    
    logWeather(searchterm); 
}


function display(userData) {
    let cartoona = '';

    for (let i = 0; i < 3 && i < userData.forecast.forecastday.length; i++) {
        const dayData = userData.forecast.forecastday[i];
        const date = new Date(dayData.date);

        if (i === 0) {
            cartoona += `
                <div class="col-lg-4 ">
                    <div class="card">
                        <div class="card-header d-flex justify-content-between">
                            <div class="day">${date.toLocaleDateString('en-US', { weekday: 'long' })}</div>
                            <div class="date">${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
                        </div>
                        <div class="card-body">
                            <div class="day text fw-bold">${userData.location.name}</div>
                            <div style="display: inline-flex; align-items: center;">
                                <h5 class="display-2 fw-bold py-3">${dayData.day.avgtemp_c}°C</h5>
                                <img src="${dayData.day.condition.icon}" alt="Weather Icon" style="margin-left: 10px;">
                            </div>
                            <div class="day text ">${dayData.day.condition.text}</div>
                        </div>
                        <div class="card-footer text-muted d-flex justify-content-between">
                            <div class="day px-2"><i class="fa-solid fa-umbrella"></i> ${dayData.day.daily_chance_of_rain}%</div>
                            <div class="day px-2"><i class="fa-solid fa-wind"></i> ${dayData.day.maxwind_kph} km/h</div>
                            <div class="day px-2 "><i class="fa-regular fa-compass"></i> East </div>
                        </div>
                    </div>
                </div>
            `;
        } else {
            cartoona += `
                <div class="col-lg-4">
                    <div class="card">
                        <div class="card-header d-flex justify-content-between">
                            <div class="day">${date.toLocaleDateString('en-US', { weekday: 'long' })}</div>
                            <div class="date">${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
                        </div>
                        <div class="card-body text-center">
                            <div class="day text fw-bold">${userData.location.name}</div>
                            <div style="display: inline-flex; align-items: center;">
                                <h5 class="fw-bold py-5">${dayData.day.avgtemp_c}°C</h5>
                                <img src="${dayData.day.condition.icon}" alt="Weather Icon" style="margin-left: 10px;">
                            </div>
                            <div class="day text">${dayData.day.condition.text}</div>
                        </div>
                        <div class="card-footer text-muted d-flex justify-content-between">
                            <div class="day px-2"><i class="fa-solid fa-umbrella"></i> ${dayData.day.daily_chance_of_rain}%</div>
                            <div class="day px-2"><i class="fa-solid fa-wind"></i> ${dayData.day.maxwind_kph} km/h</div>
                            <div class="day px-2"><i class="fa-regular fa-compass"></i> East </div>
                        </div>
                    </div>
                </div>
            `;
        }
    }

    document.querySelector('.row').innerHTML = cartoona;
}

logWeather('London');
