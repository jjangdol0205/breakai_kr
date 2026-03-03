const fetch = require('cross-fetch');
async function test() {
    const res = await fetch("https://query2.finance.yahoo.com/v1/finance/search?q=" + encodeURIComponent("삼성전자") + "&quotesCount=1");
    const data = await res.json();
    console.log(JSON.stringify(data, null, 2));
}
test();
