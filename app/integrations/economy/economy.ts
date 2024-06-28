export type Quote = {
    symbol: string;
    shortName: string;
    longName: string;
    lastPrice: number;
    changePercent: number;
    historicalPrices: HistoricalPrice[];
}

export type HistoricalPrice = {
    date: Date;
    close: number;
}

export function formatPrice(price: number, symbol: string): string {

    if (symbol.startsWith("^")) {
        return (price | 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " pts";
    }

    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(price)

}