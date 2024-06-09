import {NextRequest} from "next/server";
import fetchNews, {Categories, Countries} from "@/app/utils/news";

export async function GET(request: NextRequest) {

    const searchParams = request.nextUrl.searchParams;

    const countryCode = searchParams.get("country");
    const categoryKey = searchParams.get("category");

    const country = Countries.find(country => country.code === countryCode);

    if (!country) {
        return Response.error();
    }

    const category = Categories.find(category => category.key === categoryKey);

    if (!category) {
        return Response.error();
    }

    return Response.json(await fetchNews({country, category}));

}