import fs from 'fs';
import path from 'path';
import fetch from 'cross-fetch';

let corpCodesCache: Record<string, { corp_code: string; stock_code: string }> | null = null;

function loadCorpCodes() {
    if (corpCodesCache) return corpCodesCache;
    try {
        const filePath = path.join(process.cwd(), 'utils', 'dartCorpCodes.json');
        const fileData = fs.readFileSync(filePath, 'utf-8');
        corpCodesCache = JSON.parse(fileData);
        return corpCodesCache;
    } catch (e) {
        console.error("Failed to load DART corp codes JSON. Did you run the fetch script?", e);
        return {};
    }
}

export function getDartCorpCode(companyName: string): string | null {
    const map = loadCorpCodes();
    if (!map) return null;

    // Exact match
    if (map[companyName]) return map[companyName].corp_code;

    // Partial Match Strategy if exact fails
    const partialKey = Object.keys(map).find(key => key.includes(companyName) || companyName.includes(key));
    if (partialKey) return map[partialKey].corp_code;

    return null;
}

export type DartFinancials = {
    revenue: string | null;      // 매출액
    operatingProfit: string | null; // 영업이익
    netIncome: string | null;    // 당기순이익
    year: string;
    quarter: string;
};

/**
 * Fetch key financial statements for a specific company from DART
 * reportType defaults to "11011" (Annual Business Report)
 */
export async function getFinancialStatement(companyName: string, year: string = new Date().getFullYear().toString(), reportType: string = "11011"): Promise<DartFinancials | null> {
    const corpCode = getDartCorpCode(companyName);
    if (!corpCode) return null;

    const apiKey = process.env.DART_API_KEY;
    if (!apiKey) {
        console.warn("DART_API_KEY is not defined.");
        return null;
    }

    try {
        // We will try the current year - 1 if current year is not available yet (e.g. Q1 of the new year)
        let targetYear = year;
        const currentYear = new Date().getFullYear().toString();
        if (targetYear === currentYear) {
            targetYear = (parseInt(currentYear) - 1).toString();
        }

        const url = `https://opendart.fss.or.kr/api/fnlttSinglAcnt.json?crtfc_key=${apiKey}&corp_code=${corpCode}&bsns_year=${targetYear}&reprt_code=${reportType}`;

        const response = await fetch(url);
        const data = await response.json();

        if (data.status !== "000" || !data.list) {
            // If the report for this year/quarter doesn't exist, try the previous year or quarter
            console.log(`DART API returned status ${data.status} for ${companyName} (${targetYear}) - ${data.message}`);
            return null;
        }

        let revenue: string | null = null;
        let operatingProfit: string | null = null;
        let netIncome: string | null = null;

        // DART data list contains an array of metrics. We want the accumulated (단기) figures for the current period (당기)
        for (const item of data.list) {
            // sj_div: 'CIS' refers to Comprehensive Income Statement (포괄손익계산서)
            if (item.sj_div === "CIS" || item.sj_div === "IS") {
                if (item.account_nm === "매출액" || item.account_nm === "영업수익") revenue = item.thstrm_amount;
                if (item.account_nm === "영업이익" || item.account_nm === "영업이익(손실)") operatingProfit = item.thstrm_amount;
                if (item.account_nm === "당기순이익" || item.account_nm === "당기순이익(손실)") netIncome = item.thstrm_amount;
            }
        }

        // Helper to format large Korean numbers (e.g., 300,000,000,000 -> 3,000억원)
        const formatBillionKRW = (amtStr: string | null) => {
            if (!amtStr) return 'N/A';
            const num = parseInt(amtStr.replace(/,/g, ''), 10);
            if (isNaN(num)) return amtStr;
            const billion = num / 100000000;
            return Math.floor(billion).toLocaleString() + "억원";
        };

        return {
            revenue: formatBillionKRW(revenue),
            operatingProfit: formatBillionKRW(operatingProfit),
            netIncome: formatBillionKRW(netIncome),
            year: targetYear,
            quarter: reportType === "11011" ? "Annual" : reportType // simplistic
        };

    } catch (e) {
        console.error("DART API Error:", e);
        return null;
    }
}
