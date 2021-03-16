const submitButton = document.querySelector("#submit");
const input = document.querySelector("#search");
const errorMessage = document.querySelector("#errorMessage");
const _location = document.querySelector("#location");
const _metricContainer = document.querySelector("#metricContainer");
    const _temperature = document.querySelector("#temp");
    const _degree = document.querySelector("#degree");
const _forecast = document.querySelector("#forecast");
const _icon = document.querySelector("#icon");
const _feelsLike = document.querySelector("#feelsLike");
const _wind = document.querySelector("#wind");
const _humidity = document.querySelector("#humidity");
let units = "imperial"; // set the initial unit to imperial
let deg = "F"; // set degree indicator to fahrenheit

submitButton.addEventListener("click", handleSubmit); // input search functionality

function handleSubmit(e) {
    e.preventDefault();
    getInput();
}

async function getInput() {
    let searchFor = ""
    if(input.value){ 
        searchFor = input.value 
    } else {
        errorMessage.innerHTML = "type in a city";
        return
    }
    let apiVariable = `https://api.openweathermap.org/data/2.5/weather?q=${searchFor}&APPID=e705fd2733337e25a8b91977646312e1&units=${units}`;
    const response = await fetch(apiVariable);
    // check if input is valid
    if (response.status === 400 || response.status === 404){
        errorMessage.innerHTML = "can't find a result"
    } else {
        errorMessage.innerHTML = "‎";
        // check if current search is already in the recent search array
        if (recentSearchArray.includes(searchFor)){
            // since the current search is already in the recent search array, 
            // remove the previous search from the array by index and then add it to the fron of the array
            var index = recentSearchArray.indexOf(searchFor);
            if (index !== -1) {
                recentSearchArray.splice(index, 1);
            }
            recentSearchArray.unshift(searchFor)
        } else {
            // if the recent search array is great than 6 then remove that oldest search after adding the current search
            if(recentSearchArray.length < 6){
                recentSearchArray.unshift(searchFor)
            } else {
                recentSearchArray.unshift(searchFor)
                recentSearchArray.pop();
            }
        }
        getWeatherData(searchFor, units);
    }
}

async function getWeatherData(searchFor, units){
    console.log("location: " + searchFor);
    let apiVariable = `https://api.openweathermap.org/data/2.5/weather?q=${searchFor}&APPID=e705fd2733337e25a8b91977646312e1&units=${units}`;
    const response = await fetch(apiVariable);
    const tempData = await response.json();
        console.log(tempData);
    // set the DOM
    _location.innerHTML = tempData.name;
    _temperature.innerHTML = Math.round(tempData.main.temp); 
    _degree.innerHTML = "°" + deg;
    _forecast.innerHTML = tempData.weather[0].description;
    _icon.src = `https://openweathermap.org/img/wn/${tempData.weather[0].icon}@2x.png`;
    _feelsLike.innerHTML = Math.round(tempData.main.feels_like) +  "°" + deg;
    _wind.innerHTML = Math.round(tempData.wind.speed) + "mph";
    _humidity.innerHTML = Math.round(tempData.main.humidity) + "%";
    getRecentSearches();
};

// recent search
const _recentSearch = document.getElementById("recentSearchContainer");
const _recentSearchHeader = document.getElementById("RStitle");
let recentSearchArray = ["New York City"]; // initialize the recent search array with the initial city that appears on load (final line)

async function getRecentSearches(){
    _recentSearch.innerHTML = "";
    // display 'recent search' header once the recent search array has more than 1 city
    if(recentSearchArray.length < 2){ _recentSearchHeader.style.display = "none" } else { _recentSearchHeader.style.display = "block" }
    // loop through the recent search array and append an element for each city to the DOM
    for(let i = 1; i < recentSearchArray.length ; i++){
        let RSapiVariable = `https://api.openweathermap.org/data/2.5/weather?q=${recentSearchArray[i]}&APPID=e705fd2733337e25a8b91977646312e1&units=${units}`;
        let RSresponse = await fetch(RSapiVariable);
        const RStempData = await RSresponse.json();
        let RSdiv = document.createElement("div");
            RSdiv.classList.add("recentSearchDiv");
            let RScity = document.createElement("span");
                RScity.classList.add("recentSearchSpan");
                RScity.innerHTML = RStempData.name;
            let RSicon = document.createElement("img");
                RSicon.classList.add("recentSearchimg");
                RSicon.src = `https://openweathermap.org/img/wn/${RStempData.weather[0].icon}@2x.png`;
            let RStemp = document.createElement("span");
                RStemp.classList.add("recentSearchSpan");
                RStemp.innerHTML = Math.round(RStempData.main.temp) +  "°" + deg; 
            RSdiv.appendChild(RScity);
            RSdiv.appendChild(RSicon);
            RSdiv.appendChild(RStemp);
        _recentSearch.appendChild(RSdiv);
    }
}

// switch temperature metric
_metricContainer.addEventListener("click", handleTempChange)

function handleTempChange (){
    searchFor = _location.innerHTML;
    if (units === "imperial"){
        units = "metric";
        deg = "C";
    } else {
        units = "imperial";
        deg = "F";
    }
    getWeatherData(searchFor, units);
}

getWeatherData("new york city", units); // initial search so the page has data on load