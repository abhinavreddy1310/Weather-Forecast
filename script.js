const API_KEY = "b91e54c4ef394c6e94f150405262905";

const cityInput = document.getElementById("cityInput");
const suggestions = document.getElementById("suggestions");

cityInput.addEventListener("input", async () => {

    let query = cityInput.value.trim();

    if(query.length < 2){
        suggestions.innerHTML = "";
        return;
    }

    const res = await fetch(
        `https://api.weatherapi.com/v1/search.json?key=${API_KEY}&q=${query}`
    );

    const data = await res.json();

    suggestions.innerHTML = "";

    data.forEach(city => {

        const div = document.createElement("div");

        div.classList.add("suggestion-item");

        div.innerText =
        `${city.name}, ${city.country}`;

        div.addEventListener("click", () => {

            cityInput.value = city.name;

            suggestions.innerHTML = "";

            getWeather(city.name);

        });

        suggestions.appendChild(div);
    });
});

async function getWeather(city){

    try{

        const response = await fetch(
        `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${city}&days=7&aqi=no&alerts=no`
        );

        const data = await response.json();

        displayCurrentWeather(data);
        displayForecast(data);

        changeBackground(data);

    }

    catch(error){

        console.log(error);

    }

}

function displayCurrentWeather(data){

    const current = data.current;

    document.getElementById("currentWeather").innerHTML = `

        <h2>${data.location.name}</h2>

        <img
        src="https:${current.condition.icon}"
        class="weather-icon">

        <h3>${current.temp_c} °C</h3>

        <p>${current.condition.text}</p>

        <p>Humidity: ${current.humidity}%</p>

        <p>Wind: ${current.wind_kph} km/h</p>

    `;
}

function displayForecast(data){

    const forecast = document.getElementById("forecast");

    forecast.innerHTML = "";

    data.forecast.forecastday.forEach(day => {

        forecast.innerHTML += `

        <div class="forecast-card">

            <h4>${day.date}</h4>

            <img src="https:${day.day.condition.icon}">

            <p>${day.day.avgtemp_c} °C</p>

            <p>${day.day.condition.text}</p>

        </div>

        `;
    });

}

function changeBackground(data){

    const temp = data.current.temp_c;

    const isDay = data.current.is_day;

    if(!isDay){

        document.body.style.background =
        "linear-gradient(135deg,#141e30,#243b55)";
    }

    else if(temp > 35){

        document.body.style.background =
        "linear-gradient(135deg,#ff512f,#dd2476)";
    }

    else if(temp > 25){

        document.body.style.background =
        "linear-gradient(135deg,#f7971e,#ffd200)";
    }

    else{

        document.body.style.background =
        "linear-gradient(135deg,#74ebd5,#9face6)";
    }
}