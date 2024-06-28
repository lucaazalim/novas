import {headers} from "next/headers";

export type IPInfo = {
    ip: string;
    lat: number;
    lon: number;
}

export const FALLBACK_IP_INFO: IPInfo = {
    ip: '127.0.0.1',
    lat: -19.9167,
    lon: -43.9345
}

export function getIP() {
    const header = headers();
    return (header.get('x-forwarded-for') ?? '127.0.0.1').split(',')[0];
}

export async function fetchIPInfo(ip: string): Promise<IPInfo> {

    const response = await fetch(`http://ip-api.com/json/${ip}`);
    const json = await response.json();

    if (json.status === 'fail') return FALLBACK_IP_INFO;

    return {
        ip: ip,
        lat: json.lat,
        lon: json.lon
    };

}