import fetchQuote from "@/app/utils/economy";
import {NextRequest} from "next/server";

export async function GET(request: NextRequest) {
    const symbol = request.nextUrl.searchParams.get("symbol");
    return Response.json(await fetchQuote(symbol!));
}