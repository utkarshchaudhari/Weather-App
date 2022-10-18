const searchIcon = document.querySelector('.search__icon');
const dailyBtn = document.querySelector('.daily__btn');
const hourlyBtn = document.querySelector('.hourly__btn');
const pageBtn = document.querySelector('.change__hours');
const dailyData = document.querySelector('.daily__forecast-container');
const hourlyData = document.querySelector('.hourly__forecast-container');

searchIcon.addEventListener('click', () => searchWeather(document.querySelector('.search__box').value));
dailyBtn.addEventListener('click', () => dailyWeather());
hourlyBtn.addEventListener('click', () => hourlyWeather());

async function searchWeather(city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=1fca3dc70103b44d8c105b5f052ac462`;
    const cityData = await (await fetch(url)).json();
    document.querySelector('.search__box').value = '';
    document.querySelector('.error__msg').classList.remove('active');
    console.log(cityData);
    if (cityData.cod === 200) {
        const weekurl = `https://api.openweathermap.org/data/2.5/onecall?lat=${cityData.coord.lat}&lon=${cityData.coord.lon}&exclude=minutely,alerts&appid=20f7632ffc2c022654e4093c6947b4f4`;
        const weekData = await (await fetch(weekurl)).json();
        console.log(weekData);
        const d = new Date();
        const utcTime = (d.getTimezoneOffset() * 60000) + d.getTime();
        const time = utcTime + (cityData.timezone * 1000);
        const date = new Date(time);

        document.querySelector('.weather__description').textContent = (cityData.weather[0].description);
        document.querySelector('.weather__city').textContent = cityData.name;
        document.querySelector('.weather__date').textContent = weatherDate(date);
        document.querySelector('.weather__time').textContent = weatherTime(date);
        document.querySelector('.weather__temperature').textContent = getFahrenheit(cityData.main.temp);

        document.getElementById('feels-like').textContent = getFahrenheit(cityData.main.feels_like);
        document.getElementById('humidity').textContent = `${cityData.main.humidity} %`;
        document.getElementById('chance-of-rain').textContent = `${weekData.daily[0].pop * 100} %`;
        document.getElementById('wind-speed').textContent = `${Math.round(cityData.wind.speed * 3.6 * 10) / 10} Km/h`;

        dailyForecast(weekData);
        hourlyForecast(weekData);
    } else {
        document.querySelector('.error__msg').classList.add('active');
    }
}

function dailyForecast(data) {
    const days = document.querySelectorAll('.day');
    const temperatureHigh = document.querySelectorAll('.temperature__high');
    const temperatureLow = document.querySelectorAll('.temperature__low');

    days.forEach((node, index) => {
        const d = new Date(data.daily[index + 1].dt * 1000);
        let day = d.toDateString().slice(0, 3);
        if (day === 'Mon') {
            day = 'Monday';
        } else if (day === 'Tue') {
            day = 'Tuesday';
        } else if (day === 'Wed') {
            day = 'Wednesday';
        } else if (day === 'Thu') {
            day = 'Thursday';
        } else if (day === 'Fri') {
            day = 'Friday';
        } else if (day === 'Sat') {
            day = 'Saturday';
        } else if (day === 'Sun') {
            day = 'Sunday';
        }
        node.textContent = day;
    });
    temperatureHigh.forEach((node, index) => node.textContent = getFahrenheit(data.daily[index + 1].temp.max));
    temperatureLow.forEach((node, index) => node.textContent = getFahrenheit(data.daily[index + 1].temp.min));
}

function hourlyForecast(data) {
    const time = document.querySelectorAll('.hourly__time');
    const temperature = document.querySelectorAll('.hourly__temperature');

    time.forEach((node, index) => {
        const d = new Date(data.hourly[index + 5].dt * 1000 + data.timezone_offset * 1000);
        node.textContent = formatTime(d);
    });
    temperature.forEach((node, index) => node.textContent = getFahrenheit(data.hourly[index + 5].temp));
}

function formatTime(dateObj) {
    const hours = dateObj.getHours();
    if (hours === 0) return '12 am';
    return (hours > 12) ? `${hours - 12} pm` : `${hours} am`;
}

function weatherDate(dateObj) {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];

    const day = days[dateObj.getDay()];
    const date = formatDate(dateObj.getDate().toString());
    const month = months[dateObj.getMonth()];
    const year = formatYear(dateObj.getFullYear().toString());

    return `${day}, ${date} ${month} '${year}`;
}

function weatherTime(dateObj) {
    const hours = dateObj.getHours();
    const minutes = formatMin(dateObj.getMinutes());
    if (hours === 0) return `12:${minutes} am`;
    return (hours > 12) ? `${hours - 12}:${minutes} pm` : `${hours}:${minutes} am`;
}

function formatDate(d) {
    const dArray = d.split('');
    if (dArray[dArray.length - 1] === '1') {
        return `${dArray.join('')}st`;
    } else if (dArray[dArray.length - 1] === '2') {
        return `${dArray.join('')}nd`;
    } else if (dArray[dArray.length - 1] === '3') {
        return `${dArray.join('')}rd`;
    } else {
        return `${dArray.join('')}th`;
    }
}

function formatYear(y) {
    const yArray = y.split('');
    return `${yArray[yArray.length - 2]}${yArray[yArray.length - 1]}`;
}

function formatMin(m) {
    const minutes = m.toString();
    return (minutes.length === 1) ? `0${minutes}` : `${minutes}`;
}

function getFahrenheit(k) {
    return `${Math.round((k - 273.15) * 9 / 5 + 32)} °F`;
}

function dailyWeather() {
    hourlyBtn.classList.remove('active__btn');
    pageBtn.style.display = 'none';
    dailyBtn.classList.add('active__btn');
    hourlyData.style.display = 'none';
    dailyData.style.display = 'flex';
}

function hourlyWeather() {
    dailyBtn.classList.remove('active__btn');
    hourlyBtn.classList.add('active__btn');
    pageBtn.style.display = 'flex';
    dailyData.style.display = 'none';
    hourlyData.style.display = 'flex';
}

searchWeather('london');



