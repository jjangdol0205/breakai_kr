async function test() {
    const url = 'https://query2.finance.yahoo.com/v7/finance/quote?symbols=TSLA,NVDA,AAPL,MSFT,PLTR,LINK-USD';
    try {
        const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
        const data = await res.json();
        console.log(JSON.stringify(data.quoteResponse.result.map(q => `${q.symbol}: ${q.regularMarketPrice}`)));
    } catch (err) {
        console.error(err);
    }
}
test();
