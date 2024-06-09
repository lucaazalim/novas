import {fetchIPInfo, getIP} from "@/app/utils/ip";
import {fetchWeather} from "@/app/utils/weather";
import {NextRequest} from "next/server";

export async function GET(request: NextRequest) {

    const ip = getIP();
    const ipInfo = await fetchIPInfo(ip);
    const weather = await fetchWeather(ipInfo.lat, ipInfo.lon);
    
    return Response.json(weather);

}