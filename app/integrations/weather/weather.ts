export type WeatherItem = {
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

export async function fetchOpenWeatherMap(type: "weather" | "forecast", lat: number, lon: number) {

    const response = await fetch(
        `https://api.openweathermap.org/data/2.5/${type}?lat=${lat}&lon=${lon}&appid=${process.env.OPEN_WEATHER_API_KEY}&units=metric&lang=en_us`
    );

    return await response.json();

}

export function getWeatherIconURL(icon: string) {
    return `https://openweathermap.org/img/wn/${icon}.png`;
}