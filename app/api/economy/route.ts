import fetchQuote from "@/app/utils/economy";
import {NextRequest} from "next/server";

export async function GET(request: NextRequest) {

    const symbol = request.nextUrl.searchParams.get("symbol");

    if (!symbol) {
        return new Response("Missing symbol parameter", {status: 400});
    }

    return Response.json(await fetchQuote(symbol!));
}