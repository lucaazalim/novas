import {NextRequest} from "next/server";
import fetchNews, {getCategoryByKey, getCountryByCode} from "@/app/utils/news";

export async function GET(request: NextRequest) {

    const searchParams = request.nextUrl.searchParams;

    const countryCode = searchParams.get("country");
    const categoryKey = searchParams.get("category");

    if (!countryCode) {
        return new Response("Missing country parameter", {status: 400});
    }

    if (!categoryKey) {
        return new Response("Missing category parameter", {status: 400});
    }

    const country = getCountryByCode(countryCode);

    if (!country) {
        return new Response("Invalid country", {status: 400});
    }

    const category = getCategoryByKey(categoryKey);

    if (!category) {
        return new Response("Invalid category", {status: 400});
    }

    try {
        const response = await fetchNews({country, category});
        return Response.json(response);
    } catch (error) {
        return new Response("Failed to fetch news: " + error, {status: 500});
    }

}