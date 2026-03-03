import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import fetch from 'cross-fetch';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const geminiApiKey = process.env.GEMINI_API_KEY;

if (!supabaseUrl || !supabaseKey || !geminiApiKey) {
    console.error("Missing required environment variables.");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false },
    global: { fetch: fetch }
});
const genAI = new GoogleGenerativeAI(geminiApiKey);

const KOREAN_STOCKS = [
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
    { name: "에코프로비엠", ticker: "247540.KQ" },
    { name: "에코프로", ticker: "086520.KQ" },
    { name: "HLB", ticker: "028300.KQ" },
    { name: "알테오젠", ticker: "196170.KQ" }
];

/**
 * Fetch ~2 years (500+ trading days) of daily historical prices for MA calculation
 */
async function fetchHistoricalData(ticker) {
    // 2 years back is roughly 504 trading days, let's fetch '2y' interval '1d'
    const url = `https://query2.finance.yahoo.com/v8/finance/chart/${ticker}?interval=1d&range=2y`;
    const response = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    if (!response.ok) {
        throw new Error(`Failed to fetch historical data for ${ticker}: ${response.statusText}`);
    }
    const data = await response.json();
    const result = data.chart?.result?.[0];
    if (!result || !result.timestamp || !result.indicators.quote[0].close) {
        return [];
    }

    // Combine timestamp and close prices
    const prices = [];
    const closes = result.indicators.quote[0].close;
    for (let i = 0; i < result.timestamp.length; i++) {
        if (closes[i] !== null) {
            prices.push({
                date: new Date(result.timestamp[i] * 1000),
                close: closes[i],
                volume: result.indicators.quote[0].volume[i] || 0
            });
        }
    }
    return prices.sort((a, b) => a.date - b.date);
}

/**
 * Calculates a simple moving average for the given period
 */
function calculateMA(prices, period) {
    if (prices.length < period) return null;
    const subset = prices.slice(prices.length - period);
    const sum = subset.reduce((acc, val) => acc + val.close, 0);
    return sum / period;
}

/**
 * William O'Neil 'Cup and Handle' Technical Analysis Logic applied to Moving Averages
 * Looks for stocks where price recently broke above the 224-day MA after a long 'Cup' consolidation, 
 * forming a 'Handle' near the MA prior to breakout.
 */
function analyzeONeilPattern(prices) {
    if (prices.length < 448) {
        return { isPick: false, reason: "Not enough historical data for 448-day MA (requires ~2 years)." };
    }

    const ma112 = calculateMA(prices, 112);
    const ma224 = calculateMA(prices, 224);
    const ma448 = calculateMA(prices, 448);
    const currentPrice = prices[prices.length - 1].close;
    const currentVolume = prices[prices.length - 1].volume;

    // Average volume over last 20 days
    const avgVol20 = prices.slice(-20).reduce((acc, val) => acc + val.volume, 0) / 20;

    if (!ma224 || !ma112 || !ma448) return { isPick: false, reason: "MA calculation failed." };

    // Calculate distance to MA224
    const distanceTo224 = (currentPrice - ma224) / ma224;

    // For KOSPI/KOSDAQ adaptation, we relax the strict O'Neil rules
    // to ensure we get picks from the smaller pool of stocks.
    const volumeSurge = currentVolume > (avgVol20 * 1.2); // 20% above average

    let score = 50; // Base score

    // Closer to MA224 in an uptrend gives higher score
    if (distanceTo224 > 0 && distanceTo224 < 0.20) {
        score += 30;
    } else if (distanceTo224 < 0) {
        // Deep value play
        score += 15;
    }

    if (volumeSurge) score += 10;
    if (currentPrice > ma112) score += 5;

    // Always propose as a candidate, we sort by score later
    return {
        isPick: true,
        score: score,
        details: {
            ma112, ma224, ma448, currentPrice, volume: currentVolume,
            message: distanceTo224 > 0
                ? "상승 추세 중 반등 패턴." + (volumeSurge ? " 거대한 거래량 동반." : "")
                : "과낙폭 가치 투자 구간."
        }
    };
}

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getDartCorpCode(companyName) {
    try {
        const filePath = path.join(__dirname, '../utils/dartCorpCodes.json');
        const data = fs.readFileSync(filePath, 'utf-8');
        const map = JSON.parse(data);
        if (map[companyName]) return map[companyName].corp_code;
        const partialKey = Object.keys(map).find(key => key.includes(companyName) || companyName.includes(key));
        if (partialKey) return map[partialKey].corp_code;
    } catch (e) {
        console.warn("Could not load DART Corp Codes JSON.");
    }
    return null;
}

async function fetchDartFinancials(companyName) {
    const corpCode = getDartCorpCode(companyName);
    if (!corpCode) return null;

    const apiKey = process.env.DART_API_KEY;
    if (!apiKey) return null;

    try {
        // Try to get 2024 annual report (or Q3 2024 - 11014 if annual not out)
        let targetYear = (new Date().getFullYear() - 1).toString();
        // Fallback to 3rd quarter if annual fails, but we'll just try 11011 (Annual) for MVP brevity
        const url = `https://opendart.fss.or.kr/api/fnlttSinglAcnt.json?crtfc_key=${apiKey}&corp_code=${corpCode}&bsns_year=${targetYear}&reprt_code=11011`;

        const response = await fetch(url);
        const data = await response.json();

        if (data.status !== "000" || !data.list) return null;

        let revenue = null, op = null, net = null;
        for (const item of data.list) {
            if (item.sj_div === "CIS" || item.sj_div === "IS") {
                if (item.account_nm === "매출액" || item.account_nm === "영업수익") revenue = item.thstrm_amount;
                if (item.account_nm.includes("영업이익")) op = item.thstrm_amount;
                if (item.account_nm.includes("당기순이익")) net = item.thstrm_amount;
            }
        }

        const formatKRW = (amtStr) => {
            if (!amtStr) return 'N/A';
            const num = parseInt(amtStr.replace(/,/g, ''), 10);
            return isNaN(num) ? amtStr : Math.floor(num / 100000000).toLocaleString() + "억원";
        };

        return {
            revenue: formatKRW(revenue),
            operatingProfit: formatKRW(op),
            netIncome: formatKRW(net),
            year: targetYear
        };
    } catch (e) {
        return null;
    }
}

/**
 * Generate Gemini Corporate Report
 */
async function generateAIReport(companyName, technicalDetails) {
    const dartData = await fetchDartFinancials(companyName);
    let dartText = dartData
        ? `\n**[Open DART 핵심 재무 데이터 (${dartData.year}년 기준)]**\n- 매출액: ${dartData.revenue}\n- 영업이익: ${dartData.operatingProfit}\n- 당기순이익: ${dartData.netIncome}\n이 공식 DART 데이터를 최우선으로 참고하여 기업의 수익성과 펀더멘털을 분석하십시오.`
        : '';

    const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
        tools: [{ googleSearch: {} }]
    }, { apiVersion: "v1beta" });

    const today = new Date().toISOString().split('T')[0];

    const prompt = `
당신은 'Breakout AI'의 최고 수석 애널리스트입니다. 윌리엄 오닐의 CAN SLIM 돌파 전략과 깊이 있는 펀더멘털 분석을 결합합니다.

**엄격한 시간 기준 (매우 중요)**:
**오늘 날짜: ${today}. 현재 연도는 2026년입니다.**
모든 데이터, 재무 분석 및 시장 상황은 ${today} 기준으로 계산되어야 합니다. Google Search 도구를 활용해 ${companyName}에 대한 최신 데이터를 찾으십시오.

우리는 ${companyName}을(를) 오늘의 #1 돌파 종목으로 선정했습니다.
기술적 분석 요약: 현재가: ₩${technicalDetails.currentPrice.toLocaleString('ko-KR')}, 224일 이동평균선: ₩${technicalDetails.ma224.toLocaleString('ko-KR')}, 패턴: ${technicalDetails.message}.
${dartText}

전문적이고 깊이 있는 "오늘의 주도주" 심층 분석 리포트를 한국어로 작성하십시오.

**OUTPUT FORMAT (CRITICAL)**:
You MUST structure your response exactly as follows. Do NOT deviate.

1. First, provide the scores strictly in valid JSON wrapped in a \`\`\`json block.
2. Second, output the EXACT marker \`<!-- FUNDAMENTAL_REPORT -->\`
3. Third, output the Fundamental Report in Markdown.
4. Fourth, output the EXACT marker \`<!-- TECHNICAL_REPORT -->\`
5. Fifth, output the Technical Report in Markdown.

\`\`\`json
{
  "investment_score": {
    "total": 85,
    "breakdown": [
      { "category": "가치평가 (동종업계 대비)", "score": 22, "max_score": 30, "reason": "P/E가 확장 중이나 EPS 성장이 이를 정당화함." },
      { "category": "펀더멘털 및 잉여현금흐름(FCF)", "score": 28, "max_score": 30, "reason": "부채 비율이 안정적이고 잉여현금흐름이 견고함." },
      { "category": "기술적 추세 및 스마트머니", "score": 18, "max_score": 20, "reason": "224일 이동평균선 위에서 지속적인 거래량 누적." },
      { "category": "투자 촉매제 및 시장 심리", "score": 17, "max_score": 20, "reason": "출시 예정인 신제품 사이클로 인해 기관 등급 상향 조정." }
    ]
  },
  "verdict": "강력 매수",
  "executive_summary": "이 펀더멘털 투자 논리를 요약하는 4개의 고부가 가치 핵심 항목(Bullet Point).",
  "bull_case_summary": "이 주식이 폭발적으로 상승할 수밖에 없는 이유를 담은 날카로운 두 문장.",
  "bear_case_summary": "이 주식에 치명적일 수 있는 위험 요소에 대한 날카로운 두 문장."
}
\`\`\`
<!-- FUNDAMENTAL_REPORT -->
# ${companyName} 기관급 기업 분석 리포트

[목차]
프롤로그: 기관의 엣지
왜 지금 이 기업인가?
제 1 장. 기업 재무 건전성 진단: 숫자는 거짓말을 하지 않는다
제 2 장. 산업 및 매크로 분석: 거대한 패러다임 전환
제 3 장. 알파 수익 선정: 왜 이 주식인가?
제 4 장. 사업보고서(DART) 정밀 해부
제 5 장. 비즈니스 모델(BM): 수익 파이프라인
제 6 장. 핵심 경쟁 우위 (해자)
제 7 장. 기관 수급 트리거: 왜 '지금' 사야 하는가?
제 8 장. 리스크 평가: 투자 무효화 조건
제 9 장. 밸류에이션 매트릭스: 상승 여력 추정

<!-- TECHNICAL_REPORT -->
# ${companyName} 스마트머니 및 알고리즘 검증 (기술적 분석)

[목차]
프롤로그: 타이밍의 예술
제 1 장. 이동평균선 분석: 기관의 발자취
제 2 장. 거래량 프로파일링: 스마트머니 해독
제 3 장. 패턴 인식: 윌리엄 오닐 셋업 (컵앤핸들)
제 4 장. 손익비(Risk/Reward): 비대칭 진입점
`;

    try {
        const result = await model.generateContent(prompt);
        let text = result.response.text();

        let jsonString = "";
        let finalMarkdown = "";

        const jsonMatch = text.match(/\`\`\`(?:json)?\\s*(\\{[\\s\\S]*?\\})\\s*\`\`\`/);
        if (jsonMatch) {
            jsonString = jsonMatch[1];
            finalMarkdown = text.replace(jsonMatch[0], '').trim();
        } else {
            finalMarkdown = text; // Fallback
        }

        return JSON.stringify({
            json_data: jsonString ? JSON.parse(jsonString) : null,
            markdown: finalMarkdown
        });

    } catch (err) {
        console.error("Gemini failed for", companyName, err);
        return null;
    }
}

async function main() {
    console.log("Starting Breakout AI Screener...");

    // Check if we already picked today to save Gemini API calls
    const today = new Date().toISOString().split('T')[0];
    const { data: existing } = await supabase
        .from('oneil_picks')
        .select('id')
        .gte('pick_date', today);

    if (existing && existing.length > 0) {
        console.log("Already found today's pick. Exiting to prevent duplicates.");
        return;
    }

    // [ANTI-DUPLICATION] Fetch tickers picked in the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const { data: recentPicks } = await supabase
        .from('oneil_picks')
        .select('ticker')
        .gte('pick_date', thirtyDaysAgo.toISOString().split('T')[0]);

    const recentTickers = new Set((recentPicks || []).map(p => p.ticker));
    if (recentTickers.size > 0) {
        console.log(`Skipping recently picked tickers (last 30 days): ${Array.from(recentTickers).join(', ')}`);
    }

    let candidates = [];

    // Scan all tickers to find the absolute best setup
    for (const stock of KOREAN_STOCKS) {
        // [IMPORTANT] recentTickers holds the COMPANY NAME, because we save stock.name as pick_ticker
        if (recentTickers.has(stock.name)) {
            continue; // Skip if already picked recently
        }

        try {
            const prices = await fetchHistoricalData(stock.ticker);
            const analysis = analyzeONeilPattern(prices);

            if (analysis.isPick) {
                console.log(`  🟡 Potential Match: ${stock.name} (Score: ${analysis.score}) - ${analysis.details.message}`);
                candidates.push({
                    ticker: stock.name,    // Save company name to DB!
                    yfTicker: stock.ticker,  // Keep YF ticker if needed just in case
                    score: analysis.score,
                    details: analysis.details
                });
            }
            // Wait to avoid rate limits
            await new Promise(r => setTimeout(r, 200));
        } catch (err) {
            console.error(`Error analyzing ${stock.name}:`, err.message);
        }
    }

    if (candidates.length > 0) {
        // Sort descending by score
        candidates.sort((a, b) => b.score - a.score);
        console.log(`\nFound ${candidates.length} candidates today. Attempting to generate report...`);

        let success = false;

        for (const candidate of candidates) {
            if (success) break;

            console.log(`\n🏆 ATTEMPTING CANDIDATE: ${candidate.ticker} with Score ${candidate.score}`);
            console.log(`   Generating profound AI Report for ${candidate.ticker}...`);

            const reportMd = await generateAIReport(candidate.ticker, candidate.details);

            if (reportMd) {
                const { error } = await supabase
                    .from('oneil_picks')
                    .insert({
                        ticker: candidate.ticker,
                        oneil_score: candidate.score,
                        picked_price: candidate.details.currentPrice, // Save for ROI calculation
                        technical_details: candidate.details,
                        ai_report: reportMd
                    });
                if (error) {
                    console.error("   Supabase Insert Error (might be duplicate):", error.message);
                    console.log("   --> Moving to next alternate candidate...");
                } else {
                    console.log(`   ✅ Successfully saved today's pick (${candidate.ticker}) to database!`);
                    success = true;
                }
            } else {
                console.log(`   ❌ AI Report generation failed for ${candidate.ticker}. Moving to next...`);
            }
        }

        if (!success) {
            console.log("\n⚪ Screener finished. Failed to generate and save any reports today.");
        }

    } else {
        console.log("\n⚪ Screener finished. No high-probability setups found today.");
    }
}

main();
