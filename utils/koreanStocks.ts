export interface KoreanStock {
    name: string;
    ticker: string; // Yahoo Finance ticker
}

export const KOREAN_STOCKS: KoreanStock[] = [
    // KOSPI (Mid/Small Cap & Thematic)
    { name: "한미반도체", ticker: "042700.KS" },
    { name: "이수페타시스", ticker: "041590.KS" },
    { name: "코스맥스", ticker: "192820.KS" },
    { name: "영원무역", ticker: "111110.KS" },
    { name: "현대일렉트릭", ticker: "267260.KS" },
    { name: "LS일렉트릭", ticker: "010120.KS" },
    { name: "효성중공업", ticker: "298040.KS" },
    { name: "씨에스윈드", ticker: "112610.KS" },
    { name: "파크시스템스", ticker: "140860.KQ" }, // Moved to KOSDAQ section below but kept for thematic grouping
    { name: "휴비스", ticker: "079980.KS" },
    { name: "대덕전자", ticker: "353200.KS" },
    { name: "해성디에스", ticker: "195870.KS" },
    { name: "금양", ticker: "001570.KS" },
    { name: "대한전선", ticker: "001440.KS" },
    { name: "디와이", ticker: "013570.KS" },
    { name: " 삼화콘덴서", ticker: "001820.KS" },
    { name: " 일진머티리얼즈", ticker: "020150.KS" },
    { name: " 롯데정밀화학", ticker: "004000.KS" },
    { name: " 한화시스템", ticker: "272210.KS" },
    { name: " 덴티움", ticker: "145720.KS" },

    // KOSDAQ (Mid/Small Cap & Thematic)
    { name: "리노공업", ticker: "058470.KQ" },
    { name: "HPSP", ticker: "403870.KQ" },
    { name: "알테오젠", ticker: "196170.KQ" },
    { name: "엔켐", ticker: "348370.KQ" },
    { name: "레인보우로보틱스", ticker: "277810.KQ" },
    { name: "삼천당제약", ticker: "000250.KQ" },
    { name: "이오테크닉스", ticker: "039030.KQ" },
    { name: "솔브레인", ticker: "357780.KQ" },
    { name: "클래시스", ticker: "214150.KQ" },
    { name: "동진쎄미켐", ticker: "052710.KQ" },
    { name: "파마리서치", ticker: "214450.KQ" },
    { name: "에스티팜", ticker: "237690.KQ" },
    { name: "원익IPS", ticker: "240810.KQ" },
    { name: "에스에프에이", ticker: "056190.KQ" },
    { name: "피엔티", ticker: "137400.KQ" },
    { name: "ISC", ticker: "095340.KQ" },
    { name: "루닛", ticker: "328130.KQ" },
    { name: "뷰노", ticker: "338220.KQ" },
    { name: "엠로", ticker: "058970.KQ" },
    { name: "제이오", ticker: "418550.KQ" },
    { name: "주성엔지니어링", ticker: "036930.KQ" }
];

export function getTickerByName(name: string): string | null {
    const cleanName = name.trim().toUpperCase();
    const stock = KOREAN_STOCKS.find(s => s.name.toUpperCase() === cleanName);
    return stock ? stock.ticker : null;
}

export function getNameByTicker(ticker: string): string {
    const cleanTicker = ticker.trim().toUpperCase();
    const stock = KOREAN_STOCKS.find(s => s.ticker.toUpperCase() === cleanTicker);
    return stock ? stock.name : cleanTicker;
}
