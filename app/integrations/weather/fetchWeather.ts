"use server";

import {fetchOpenWeatherMap, getWeatherIconURL, Weather, WeatherItem} from "@/app/integrations/weather/weather";
import {fetchIPInfo, getIP} from "@/app/integrations/ip";

export async function fetchWeather(): Promise<Weather> {

    const ip = getIP();
    const {lat, lon} = await fetchIPInfo(ip);

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