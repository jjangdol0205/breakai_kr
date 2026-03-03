export async function fetchLiveQuote(ticker: string) {
    try {
        const url = `https://query2.finance.yahoo.com/v8/finance/chart/${ticker}?interval=1d&range=1d`;
        const response = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' }, next: { revalidate: 60 } }); // Cache for 60 seconds
        if (!response.ok) {
            return null;
        }
        const data = await response.json();
        const result = data.chart?.result?.[0];

        if (result && result.meta && result.meta.regularMarketPrice) {
            return result.meta.regularMarketPrice;
        }
        return null;
    } catch (e) {
        console.error("Failed to fetch live quote for", ticker, e);
        return null;
    }
}
