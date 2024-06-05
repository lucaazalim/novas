import SidebarWidget from "@/app/components/SidebarWidget";
import WeatherForecastWidget from "@/app/components/WeatherForecastWidget";

export default async function Sidebar() {
    return <>
        <SidebarWidget title="Previsão do Tempo">
            <WeatherForecastWidget/>
        </SidebarWidget>
    </>
}