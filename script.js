const searchIcon = document.querySelector('.search__icon');

searchIcon.addEventListener('click', () => searchWeather(document.querySelector('.search__box').value));

async function searchWeather(city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=1fca3dc70103b44d8c105b5f052ac462`;
    const cityData = await (await fetch(url)).json();
    console.log(cityData);
    if (cityData.cod === 200) {
        
        const d = new Date();
        const utcTime = (d.getTimezoneOffset() * 60000) + d.getTime();
        const time = utcTime + (cityData.timezone * 1000);
        const date = new Date(time);

        document.querySelector('.weather__description').textContent = (cityData.weather[0].description);
        document.querySelector('.weather__city').textContent = cityData.name;
        document.querySelector('.weather__date').textContent = weatherDate(date);
        document.querySelector('.weather__time').textContent = weatherTime(date);
        document.querySelector('.weather__temperature').textContent = getFahrenheit(cityData.main.temp);

        document.getElementById('humidity').textContent = `${cityData.main.humidity} %`;
        document.getElementById('feels-like').textContent = getFahrenheit(cityData.main.feels_like);
        document.getElementById('wind-speed').textContent = `${Math.round(cityData.wind.speed * 3.6 * 10) / 10} Km/h`;
    }
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

searchWeather('london');



