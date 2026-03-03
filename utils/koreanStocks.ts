export interface KoreanStock {
    name: string;
    ticker: string; // Yahoo Finance ticker
}

export const KOREAN_STOCKS: KoreanStock[] = [
    // KOSPI
    { name: "삼성전자", ticker: "005930.KS" },
    { name: "SK하이닉스", ticker: "000660.KS" },
    { name: "LG에너지솔루션", ticker: "373220.KS" },
    { name: "삼성바이오로직스", ticker: "207940.KS" },
    { name: "현대차", ticker: "005380.KS" },
    { name: "기아", ticker: "000270.KS" },
    { name: "셀트리온", ticker: "068270.KS" },
    { name: "POSCO홀딩스", ticker: "005490.KS" },
    { name: "NAVER", ticker: "035420.KS" },
    { name: "카카오", ticker: "035720.KS" },
    { name: "삼성SDI", ticker: "006400.KS" },
    { name: "LG화학", ticker: "051910.KS" },
    { name: "KB금융", ticker: "105560.KS" },
    { name: "신한지주", ticker: "055550.KS" },
    { name: "포스코퓨처엠", ticker: "003670.KS" },
    { name: "현대모비스", ticker: "012330.KS" },
    { name: "하나금융지주", ticker: "086790.KS" },
    { name: "KT&G", ticker: "033780.KS" },
    { name: "삼성물산", ticker: "028260.KS" },
    { name: "하이브", ticker: "352820.KS" },
    { name: "LG전자", ticker: "066570.KS" },
    { name: "SK이노베이션", ticker: "096770.KS" },
    { name: "고려아연", ticker: "010130.KS" },
    { name: "메리츠금융지주", ticker: "138040.KS" },
    { name: "삼성생명", ticker: "032830.KS" },
    { name: "크래프톤", ticker: "259960.KS" },
    { name: "두산에너빌리티", ticker: "034020.KS" },
    { name: "한화오션", ticker: "042660.KS" },
    { name: "엔씨소프트", ticker: "036570.KS" },
    { name: "한화에어로스페이스", ticker: "012450.KS" },

    // KOSDAQ
    { name: "에코프로비엠", ticker: "247540.KQ" },
    { name: "에코프로", ticker: "086520.KQ" },
    { name: "HLB", ticker: "028300.KQ" },
    { name: "알테오젠", ticker: "196170.KQ" },
    { name: "엔켐", ticker: "348370.KQ" },
    { name: "HPSP", ticker: "403870.KQ" },
    { name: "셀트리온제약", ticker: "068760.KQ" },
    { name: "리노공업", ticker: "058470.KQ" },
    { name: "레인보우로보틱스", ticker: "277810.KQ" },
    { name: "삼천당제약", ticker: "000250.KQ" },
    { name: "휴젤", ticker: "145020.KQ" },
    { name: "클래시스", ticker: "214150.KQ" },
    { name: "솔브레인", ticker: "357780.KQ" },
    { name: "이오테크닉스", ticker: "039030.KQ" },
    { name: "JYP Ent.", ticker: "035900.KQ" },
    { name: "에스엠", ticker: "041510.KQ" },
    { name: "펄어비스", ticker: "263750.KQ" },
    { name: "동진쎄미켐", ticker: "052710.KQ" },
    { name: "카카오게임즈", ticker: "293490.KQ" },
    { name: "파마리서치", ticker: "214450.KQ" }
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
