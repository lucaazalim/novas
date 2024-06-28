"use client";

import {Weather} from "@/app/integrations/weather/weather";
import {useEffect, useState} from "react";
import Loading from "@/app/components/Loading";
import {FaArrowDown, FaArrowUp} from "react-icons/fa6";
import {fetchWeather} from "@/app/integrations/weather/fetchWeather";

export default function WeatherForecastWidget() {

    const [weather, setWeather] = useState<Weather>();

    useEffect(() => {
        fetchWeather().then((weather) => {
            setWeather(weather);
        });
    }, []);

    if (!weather) {
        return <Loading className="h-24"/>
    }

    const todayTemperatures = weather.forecast
        .filter(item => new Date(item.datetime!).getTime() > new Date().getTime() - 86400000)
        .map(item => item.temperature);

    const todayMinimumTemperature = Math.min(...todayTemperatures);
    const todayMaximumTemperature = Math.max(...todayTemperatures);

    return <>
        <div className="grid grid-cols-2 gap-2 items-center">
            <div className="border-r-2 h-full flex flex-col justify-center gap-2">
                <h1 className="font-semibold">{weather.city}</h1>
                <div className="flex gap-x-2">
                    <div className="row-span-2 text-4xl font-bold flex items-center">
                        {weather.current.temperature}°
                    </div>
                    <div>
                        <span className="flex items-center leading-tight">
                            <FaArrowUp className="text-xs text-red-500 mr-1"/>
                            {todayMaximumTemperature}°
                        </span>
                        <span className="flex items-center leading-tight">
                            <FaArrowDown className="text-xs text-blue-500 mr-1"/>
                            {todayMinimumTemperature}°
                        </span>
                    </div>
                </div>
            </div>
            <div className="flex-col mx-auto text-center">
                <img alt="" className="mx-auto drop-shadow-lg" src={weather.current.iconUrl}/>
                <h2>{weather.current.description}</h2>
            </div>
        </div>

    </>;

}