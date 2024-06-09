export async function fetchWeather(lat: number, lon: number) {

    const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.OPEN_WEATHER_API_KEY}&units=metric&lang=pt_br`
    );

    return await response.json();

}

export function getWeatherIconURL(icon: string) {
    return `http://openweathermap.org/img/wn/${icon}.png`;
}