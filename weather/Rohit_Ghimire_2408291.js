// Name - Rohit Ghimire 
// StudentID - 2408291
const searchBox = document.querySelector(".search_box input")
const SearchBtn = document.querySelector(".search_box button")
const timeZone = document.querySelector("#timezone");
const cityName  = document.getElementById("city");
const pressureElem = document.querySelector(".pressure")
const spedElem = document.querySelector(".wind")  
const weatInfoElem = document.querySelector("#weather-type")
const tempElem  = document.querySelector(".temperature");
const humid = document.querySelector(".humidity");

async function checkWeather(city){
    try{
    // const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?&appid=3b5fc269d8d40df008cadde92801c72a&units=metric&q=${city}`);
    const response = await fetch(`http://localhost/weather/Rohit_Ghimire_2408291.php?city=${city}`);
    
    var data = await response.json();
    console.log("Data",data);
    data_length = data.length;

    d = new Date()
    localTime = d.getTime()
    localOffset = d.getTimezoneOffset() * 60000
    utc = localTime + localOffset
    var time = utc + (1000 * data[data_length-1].Timezone)
    nd = new Date(time)

    // Convert into 24-hour format
    let hour = (nd.getHours());

    let minutes = nd.getMinutes();
    let weekday = nd.toLocaleString('default', { weekday: 'long' });
    let month = nd.toLocaleString('default', { month: 'long' });
    let date = nd.getDate();
  
    const timeZone = document.querySelector("#timezone");
    timeZone.innerHTML= `${weekday} | ${month} ${date}, ${hour.toString().padStart(2,"0")}:${minutes.toString().padStart(2,"0")}`;

    cityName.innerHTML = data[data_length-1].City;

    tempElem.textContent = Math.round(data[data_length-1].Temperature)+" °C";

   
    humid.innerHTML = data[data_length-1].Humidity+" %";

    pressureElem.innerHTML = data[data_length-1].Pressure+"hPa";

    spedElem.innerHTML = data[data_length-1].Wind+" m/s";

    const iconElem = document.querySelector("#imag")
    iconElem.src = "https://github.com/pegaislethal/icon-link/blob/main/"+data[data_length-1].Icon+".png?raw=true";
    weatInfoElem.textContent= ","+data[data_length-1].Description;
    }
    catch(err){
        alert("No city found")
        const timeZone = document.querySelector("#timezone");
        timeZone.textContent="--";
        cityName.innerHTML = "--";
        tempElem.textContent = "--"
        weatInfoElem.textContent = "--";
        humid.textContent = "--%"
        pressureElem.textContent = "-- hPa"
        spedElem.textContent = "-- m/s"
    }
}

async function php_show(city) {
    const response = await fetch(`http://localhost/weather/Rohit_Ghimire_2408291.php?city=${city}`);
    var data = await response.json();
    console.log("Data",data);    
    data_length = data.length;

    for (let i = 0; i <=6; i++) {
        document.querySelector(`#temperature-value${i}`).textContent = "--";
        document.querySelector(`#day${i}`).textContent ="--";
        document.querySelector(`#humidity${i}`).textContent = "--";
        document.querySelector(`#wind${i}`).textContent = "--";
        document.querySelector(`#pressure${i}`).textContent = "--";
        document.querySelector(`#icon${i}`).src = "https://github.com/pegaislethal/icon-link/blob/main/weather_notfound.jpg?raw=true";
        document.querySelector(`#country${i}`).textContent= "--";
        document.querySelector(`#date${i}`).textContent = "--";
    }

    for (let i = 0; i <=6; i++) {
        document.querySelector(`#temperature-value${i}`).textContent = Math.round(data[data_length-i-1].Temperature) +" °C";
        document.querySelector(`#day${i}`).textContent = data[data_length-i-1].Days;
        document.querySelector(`#date${i}`).textContent = data[data_length-i-1].Date;
        document.querySelector(`#humidity${i}`).textContent = "Humidity- "+data[data_length-i-1].Humidity+ "%";
        document.querySelector(`#wind${i}`).textContent ="Wind Speed-" + data[data_length-i-1].Wind +  "m/s";
        document.querySelector(`#pressure${i}`).textContent = "Pressure- " +data[data_length-i-1].Pressure + "hPa";
        document.querySelector(`#icon${i}`).src = "https://github.com/pegaislethal/icon-link/blob/main/"+data[data_length-i-1].Icon+".png?raw=true";
        document.querySelector(`#country${i}`).textContent= data[data_length-1].City;

    }
    
}



SearchBtn.addEventListener('click',()=>{
    
    php_show(searchBox.value);
    checkWeather(searchBox.value);
})
searchBox.addEventListener('keyup',(event)=>{
    if (event.key=="Enter") {
        checkWeather(searchBox.value);
        php_show(searchBox.value);
        
    }
        
    }
)

php_show('haridwar')
checkWeather("Haridwar")

