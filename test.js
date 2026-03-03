const yahooFinance = require('yahoo-finance2').default;

async function test() {
    try {
        const quotes = await yahooFinance.quote(['TSLA', 'NVDA', 'AAPL', 'MSFT', 'PLTR', 'LINK-USD']);
        console.log(JSON.stringify(quotes, null, 2));
    } catch (err) {
        console.error("error:", err);
    }
}
test();
