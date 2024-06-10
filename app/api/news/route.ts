import {NextRequest} from "next/server";
import fetchNews, {Categories, Countries} from "@/app/utils/news";

export async function GET(request: NextRequest) {

    const searchParams = request.nextUrl.searchParams;

    const countryCode = searchParams.get("country");
    const categoryKey = searchParams.get("category");

    const country = Countries.find(country => country.code === countryCode);

    if (!country) {
        return new Response("Invalid country", {status: 400});
    }

    const category = Categories.find(category => category.key === categoryKey);

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