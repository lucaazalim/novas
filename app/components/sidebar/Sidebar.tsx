"use client";

import SidebarWidget from "@/app/components/sidebar/SidebarWidget";
import WeatherForecastWidget from "@/app/components/sidebar/WeatherForecastWidget";
import EconomyWidget from "@/app/components/sidebar/EconomyWidget";
import Divisor from "@/app/components/Divisor";

export default function Sidebar() {
    return <div className="flex flex-col gap-5">
        <SidebarWidget title="Weather">
            <WeatherForecastWidget/>
        </SidebarWidget>
        <SidebarWidget title="Market">
            <div className="flex flex-col gap-4">
                <EconomyWidget symbol="^BVSP" displaySymbol="IBOV" displayName="Ibovespa"/>
                <Divisor/>
                <EconomyWidget symbol="PETR4"/>
                <Divisor/>
                <EconomyWidget symbol="ITUB4"/>
                <Divisor/>
                <EconomyWidget symbol="VALE3"/>
            </div>
        </SidebarWidget>
    </div>
}