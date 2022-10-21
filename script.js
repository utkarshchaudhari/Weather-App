const searchIcon = document.querySelector('.search__icon');
const displayC = document.querySelector('.weather__unit-c');
const displayF = document.querySelector('.weather__unit-f');
const dailyBtn = document.querySelector('.daily__btn');
const hourlyBtn = document.querySelector('.hourly__btn');
const pageBtn = document.querySelector('.change__hours');
const dailyData = document.querySelector('.daily__forecast-container');
const hourlyData = document.querySelector('.hourly__forecast-container');
const dot1 = document.getElementById('dot1');
const dot2 = document.getElementById('dot2');
const dot3 = document.getElementById('dot3');
const leftBtn = document.querySelector('.left__btn');
const rightBtn = document.querySelector('.right__btn');
const hourlyPage = document.querySelectorAll('.hourly__forecast');
let clickedDot = 1;
let cityName = 'london';
let unit = 'imperial';

searchIcon.addEventListener('click', () => {
    cityName = document.querySelector('.search__box').value;
    searchWeather(cityName);
});
displayC.addEventListener('click', () => {
    unit = 'metric';
    displayC.classList.add('inactive');
    displayF.classList.remove('inactive');
    searchWeather(cityName);
});
displayF.addEventListener('click', () => {
    unit = 'imperial';
    displayF.classList.add('inactive');
    displayC.classList.remove('inactive');
    searchWeather(cityName);
});
dailyBtn.addEventListener('click', () => dailyWeather());
hourlyBtn.addEventListener('click', () => hourlyWeather());

async function searchWeather(city, units=unit) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${units}&APPID=1fca3dc70103b44d8c105b5f052ac462`;
    const cityData = await (await fetch(url)).json();
    document.querySelector('.search__box').value = '';
    document.querySelector('.error__msg').classList.remove('active');
    console.log(cityData);
    if (cityData.cod === 200) {
        const weekurl = `https://api.openweathermap.org/data/2.5/onecall?lat=${cityData.coord.lat}&lon=${cityData.coord.lon}&units=${units}&exclude=minutely,alerts&appid=20f7632ffc2c022654e4093c6947b4f4`;
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
        document.querySelector('.weather__temperature').textContent = weatherUnit(cityData.main.temp);
        document.querySelector('.weather__icon').innerHTML = getIcon(cityData.weather[0].icon);

        document.getElementById('feels-like').textContent = weatherUnit(cityData.main.feels_like);
        document.getElementById('humidity').textContent = `${cityData.main.humidity} %`;
        document.getElementById('chance-of-rain').textContent = `${Math.round(weekData.daily[0].pop * 100)} %`;
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
    const dailyIcons = document.querySelectorAll('.daily__icon');

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
    temperatureHigh.forEach((node, index) => node.textContent = weatherUnit(data.daily[index + 1].temp.max));
    temperatureLow.forEach((node, index) => node.textContent = weatherUnit(data.daily[index + 1].temp.min));
    dailyIcons.forEach((node, index) => node.innerHTML = getIcon(data.daily[index + 1].weather[0].icon));
}

function hourlyForecast(data) {
    const time = document.querySelectorAll('.hourly__time');
    const temperature = document.querySelectorAll('.hourly__temperature');
    const hourlyIcons = document.querySelectorAll('.hourly__icon');

    time.forEach((node, index) => {
        const d = new Date(data.hourly[index + 5].dt * 1000 + data.timezone_offset * 1000);
        node.textContent = formatTime(d);
    });
    temperature.forEach((node, index) => node.textContent = weatherUnit(data.hourly[index + 5].temp));
    hourlyIcons.forEach((node, index) => node.innerHTML = getIcon(data.hourly[index + 5].weather[0].icon));
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

function weatherUnit(metric) {
    return unit === 'imperial' ? `${Math.round(metric)} °F` : `${Math.round(metric)} °C`;
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
    dotClicked(clickedDot);
    dailyData.style.display = 'none';
    hourlyData.style.display = 'flex';
}

dot1.addEventListener('click', () => dotClicked(1));
dot2.addEventListener('click', () => dotClicked(2));
dot3.addEventListener('click', () => dotClicked(3));
leftBtn.addEventListener('click', () => dotClicked(clickedDot - 1));
rightBtn.addEventListener('click', () => dotClicked(clickedDot + 1));

function dotClicked(dot) {
    if (dot === 1) {
        clickedDot = 1;
        dot1.innerHTML = '<i class="fa-solid fa-circle"></i>';
        dot2.innerHTML = '<i class="fa-regular fa-circle"></i>';
        dot3.innerHTML = '<i class="fa-regular fa-circle"></i>';
        hourlyPage.forEach((node, index) => {
            if (index > 7) {
                node.style.display = 'none';
            } else {
                node.style.display = 'flex';
            }
        });
    } else if (dot === 2) {
        clickedDot = 2;
        dot2.innerHTML = '<i class="fa-solid fa-circle"></i>';
        dot1.innerHTML = '<i class="fa-regular fa-circle"></i>';
        dot3.innerHTML = '<i class="fa-regular fa-circle"></i>';
        hourlyPage.forEach((node, index) => {
            if (index <= 7 || index > 15) {
                node.style.display = 'none';
            } else {
                node.style.display = 'flex';
            }
        });
    } else if (dot === 3) {
        clickedDot = 3;
        dot3.innerHTML = '<i class="fa-solid fa-circle"></i>';
        dot2.innerHTML = '<i class="fa-regular fa-circle"></i>';
        dot1.innerHTML = '<i class="fa-regular fa-circle"></i>';
        hourlyPage.forEach((node, index) => {
            if (index < 16) {
                node.style.display = 'none';
            } else {
                node.style.display = 'flex';
            }
        });
    }
}

function getIcon(code) {
    if (code === '01d') {
        return '<i class="fa-solid fa-sun"></i>';
    } else if (code === '01n') {
        return '<i class="fa-solid fa-moon"></i>';
    } else if (code === '02d') {
        return '<i class="fa-solid fa-cloud-sun"></i>';
    } else if (code === '02n') {
        return '<i class="fa-solid fa-cloud-moon"></i>';
    } else if (code === '03d' || code === '03n') {
        return '<i class="fa-solid fa-cloud"></i>';
    } else if (code === '04d' || code === '04n') {
        return '<i class="fa-brands fa-cloudflare"></i>';
    } else if (code === '09d' || code === '09n') {
        return '<i class="fa-solid fa-cloud-showers-heavy"></i>';
    } else if (code === '10d' || code === '10n') {
        return '<i class="fa-solid fa-cloud-rain"></i>';
    } else if (code === '11d' || code === '11n') {
        return '<i class="fa-solid fa-cloud-bolt"></i>';
    } else if (code === '13d' || code === '13n') {
        return '<i class="fa-regular fa-snowflake"></i>';
    } else if (code === '50d' || code === '50n') {
        return '<i class="fa-solid fa-smog"></i>';
    }
}

searchWeather('london');