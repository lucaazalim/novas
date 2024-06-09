"use client";

import {getWeatherIconURL} from "@/app/utils/weather";
import {useEffect, useState} from "react";
import Loading from "@/app/components/Loading";

export default function WeatherForecastWidget() {

    const [data, setData] = useState<any>(null);

    useEffect(() => {
        fetch('/api/weather')
            .then((response) => response.json())
            .then((data) => setData(data));
    }, []);

    if (!data) {
        return <Loading className="h-24"/>
    }

    const weatherCondition = data.weather[0];
    const weatherIconUrl = getWeatherIconURL(weatherCondition.icon);

    return <>
        <div className="grid grid-cols-2 gap-2 items-center">
            <div className="border-r-2 h-full flex flex-col justify-center">
                <h1 className="font-semibold">{data.name}</h1>
                <div className="text-4xl font-bold flex items-center">
                    {data.main.temp | 0}°
                </div>
            </div>
            <div className="flex-col mx-auto text-center">
                <img alt="" className="mx-auto drop-shadow-intense" src={weatherIconUrl}/>
                <h2>{weatherCondition.description}</h2>
            </div>
        </div>

    </>;

}

/*type TemperatureIconProps = {
    temperature: number;
    className: string;
}

function TemperatureIcon({temperature, className}: TemperatureIconProps) {

    if (temperature < 10) {
        return <FaTemperatureEmpty className={className}/>;
    }

    if (temperature < 20) {
        return <FaTemperatureQuarter className={className}/>;
    }

    if (temperature < 30) {
        return <FaTemperatureHalf className={className}/>;
    }

    if (temperature < 40) {
        return <FaTemperatureThreeQuarters className={className}/>
    }

    return <FaTemperatureFull className={className}/>;

}*/