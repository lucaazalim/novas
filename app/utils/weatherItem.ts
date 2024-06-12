type WeatherItem = {
    datetime?: Date;
    description: string;
    iconUrl: string;
    temperature: number;
}

export type Weather = {
    city: string;
    current: WeatherItem;
    forecast: WeatherItem[];
}

export async function fetchWeather(lat: number, lon: number): Promise<Weather> {

    const currentResponse = await fetchOpenWeatherMap("weather", lat, lon);
    const forecastResponse = await fetchOpenWeatherMap("forecast", lat, lon);

    const weatherItemFromRawResponse = (response: any, datetime?: Date): WeatherItem => ({
        datetime: datetime,
        description: response.weather[0].description,
        iconUrl: getWeatherIconURL(response.weather[0].icon),
        temperature: response.main.temp | 0
    });

    const current = weatherItemFromRawResponse(currentResponse);
    const forecast = forecastResponse.list.map((item: any) => weatherItemFromRawResponse(item, new Date(item.dt * 1000)));

    return {city: currentResponse.name, current, forecast};

}

async function fetchOpenWeatherMap(type: "weather" | "forecast", lat: number, lon: number) {

    const response = await fetch(
        `https://api.openweathermap.org/data/2.5/${type}?lat=${lat}&lon=${lon}&appid=${process.env.OPEN_WEATHER_API_KEY}&units=metric&lang=en_us`
    );

    return await response.json();

}

export function getWeatherIconURL(icon: string) {
    return `https://openweathermap.org/img/wn/${icon}.png`;
}