async function test() {
    const symbol = 'AAPL';
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=1d`;
    try {
        const res = await fetch(url);
        const data = await res.json();
        console.log(data.chart.result[0].meta);
    } catch (err) {
        console.error(err);
    }
}
test();
