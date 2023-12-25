const  userTab = document.querySelector("[data-userWeather]")
const  searchTab = document.querySelector("[data-searchWeather]")
const userContainer = document.querySelector(".weather-container")

const grantAccessContainer = document.querySelector(".grant-location-container")
const searchForm = document.querySelector("[data-searchForm]")

const loadingScreen = document.querySelector(".loading-container")
const userInfoContainer = document.querySelector(".user-info-container")

// initiall variable---------------------------------

const API_KEY = 'd1845658f92b31c64bd94f06f7188c9c'
let currentTab = userTab;
currentTab.classList.add("current-tab")
getfromSessionStorage()

function switchTab(clickedTab){
     if(clickedTab !== currentTab){
        currentTab.classList.remove("current-tab")
        currentTab = clickedTab
        currentTab.classList.add("current-tab")

        if(!searchForm.classList.contains("active")){
            userInfoContainer.classList.remove("active")
            grantAccessContainer.classList.remove("active")
            searchForm.classList.add("active")
        }
        else{
            searchForm.classList.remove("active")
            userInfoContainer.classList.remove("active")

            getfromSessionStorage()
             
        }
     }
}

userTab.addEventListener("click",()=>{
    //passing clicked tab as input 
    switchTab(userTab)
})
searchTab.addEventListener("click",()=>{
    //passing clicked tab as input parameter
    switchTab(searchTab)
})


// check if coordinates are already present is session storage
function getfromSessionStorage(){
    let localcoordinatates = sessionStorage.getItem("user-coordinates")
    if(!localcoordinatates){
        grantAccessContainer.classList.add("active")
    }
    else{
         const coordinates = JSON.parse(localcoordinatates)
         fetchUserWeatherInfo(coordinates)
    }

}


async function fetchUserWeatherInfo(coordinates){
    const {lat , log} = coordinates;
    //make grant accesscontainer invisible 
    grantAccessContainer.classList.remove("active")
    //make loader visible
    loadingScreen.classList.add("active")

    // API CALL
    try{
        const  res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${log}&appid=${API_KEY}&units=metric`);

        const data = await res.json()
        loadingScreen.classList.remove("active")
        userInfoContainer.classList.add("active")
        renderWeatherInfo(data)
    }catch(err){
        //homework
    }

}


function renderWeatherInfo(weatherInfo){
    // first select element for put info on them

    const cityName = document.querySelector("[data-cityName]")
    const countryIcon = document.querySelector("[data-countryIcon]")
    const desc = document.querySelector("[data-weatherDesc]")
    const weatherIcon = document.querySelector("[data-weatherIcon]")
    const temp = document.querySelector("[data-temp]")
    const windSpeed = document.querySelector("[data-windSpeed]")
    const humidity = document.querySelector("[data-humidity]")
    const cloudiness = document.querySelector("[data-cloudiness]")

    //now puting weather info fetch values in elements

    cityName.innerText = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`
    desc.innerText = weatherInfo?.weather?.[0]?.description
    weatherIcon.src =  `https://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`
    temp.innerText = `${weatherInfo?.main?.temp}°C`
    windSpeed.innerText = `${weatherInfo?.wind?.speed}m/s`
    humidity.innerText = `${weatherInfo?.main?.humidity}%`
    cloudiness.innerText =  `${weatherInfo?.clouds?.all}%`
}

function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition)
    }else{
        //home Work 
        console.log("faild to load ")

    }
}

function showPosition(postion){
    const userCoordinates = {
        lat : postion.coords.latitude,
        log : postion.coords.longitude
    }

    sessionStorage.setItem("user-coordinates",JSON.stringify(userCoordinates))
    fetchUserWeatherInfo(userCoordinates)
}

const grandAccessButton = document.querySelector("[data-grantAccess]")
grandAccessButton.addEventListener("click",getLocation)






let searchInput = document.querySelector("[data-searchInput]")
searchForm.addEventListener("submit",(e)=>{
    e.preventDefault()
    let cityName = searchInput.value
    if(cityName === "") 
        return;
    else
        fetchSearchWeatherInfo(cityName)
})


async function fetchSearchWeatherInfo(city){ 
    loadingScreen.classList.add("active")
    userInfoContainer.classList.remove("active")
    grantAccessContainer.classList.remove("active")
    
    try{
        const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`)
        const data = await res.json()
        loadingScreen.classList.remove("active")
        userInfoContainer.classList.add("active")
        renderWeatherInfo(data)
    }catch(err){
        console.log("faild to load ")
    }
}















































































































































