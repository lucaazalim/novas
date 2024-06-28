"use server";

import {Quote} from "@/app/integrations/economy/economy";

export default async function fetchQuote(ticker: string): Promise<Quote> {

    const response = await fetch(
        `https://brapi.dev/api/quote/${ticker}?range=1mo&interval=1d&fundamental=true&token=${process.env.BRAPI_KEY}`
    );

    const json = await response.json();
    const result = json.results?.[0];
    const historicalPrices = result.historicalDataPrice;

    return {
        symbol: result.symbol,
        shortName: result.shortName,
        longName: result.longName,
        lastPrice: result.regularMarketPrice,
        changePercent: result.regularMarketChangePercent,
        historicalPrices: historicalPrices.map((data: any) => ({
            date: new Date(data.date * 1000),
            close: data.close
        }))
    }

}