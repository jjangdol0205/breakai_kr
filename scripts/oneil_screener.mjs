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

const SCREENING_UNIVERSE = [
    // KOSPI (Mid/Small Cap & Thematic)
    { name: "한미반도체", ticker: "042700.KS" },
    { name: "이수페타시스", ticker: "041590.KS" },
    { name: "코스맥스", ticker: "192820.KS" },
    { name: "영원무역", ticker: "111110.KS" },
    { name: "현대일렉트릭", ticker: "267260.KS" },
    { name: "LS일렉트릭", ticker: "010120.KS" },
    { name: "효성중공업", ticker: "298040.KS" },
    { name: "씨에스윈드", ticker: "112610.KS" },
    { name: "휴비스", ticker: "079980.KS" },
    { name: "대덕전자", ticker: "353200.KS" },
    { name: "해성디에스", ticker: "195870.KS" },
    { name: "금양", ticker: "001570.KS" },
    { name: "대한전선", ticker: "001440.KS" },
    { name: "디와이", ticker: "013570.KS" },
    { name: "삼화콘덴서", ticker: "001820.KS" },
    { name: "일진머티리얼즈", ticker: "020150.KS" },
    { name: "롯데정밀화학", ticker: "004000.KS" },
    { name: "한화시스템", ticker: "272210.KS" },
    { name: "덴티움", ticker: "145720.KS" },
    { name: "두산로보틱스", ticker: "454910.KS" },

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
    { name: "주성엔지니어링", ticker: "036930.KQ" },
    { name: "파크시스템스", ticker: "140860.KQ" },
    { name: "리가켐바이오", ticker: "141080.KQ" },
    { name: "휴젤", ticker: "145020.KQ" },
    { name: "실리콘투", ticker: "257720.KQ" },
    { name: "테크윙", ticker: "089030.KQ" },
    { name: "브이티", ticker: "018290.KQ" },
    { name: "제이시스메디칼", ticker: "287410.KQ" },
    { name: "폴라리스오피스", ticker: "041020.KQ" },
    { name: "마음AI", ticker: "377480.KQ" },
    { name: "유진로봇", ticker: "056080.KQ" },
    { name: "에스피지", ticker: "058610.KQ" },
    { name: "티로보틱스", ticker: "117730.KQ" },
    { name: "코난테크놀로지", ticker: "402030.KQ" },
    { name: "솔트룩스", ticker: "304100.KQ" },
    { name: "딥노이드", ticker: "315640.KQ" },
    { name: "셀바스AI", ticker: "108860.KQ" },
    { name: "에스비비테크", ticker: "389500.KQ" }
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
 * 주식 단테 '3번자리 (밥그릇 패턴)' Technical Analysis Logic
 * Looks for stocks that have consolidated below the 224-day MA (1번자리, 2번자리),
 * and are now breaking out tightly above the 224-day MA with strong volume (3번자리 초입).
 */
function analyzeDanteThirdSpot(prices) {
    if (prices.length < 448) {
        return { isPick: false, reason: "Not enough historical data for 224-day MA (requires ~1-2 years)." };
    }

    const ma112 = calculateMA(prices, 112);
    const ma224 = calculateMA(prices, 224);
    const ma448 = calculateMA(prices, 448);
    const currentPrice = prices[prices.length - 1].close;
    const currentVolume = prices[prices.length - 1].volume;

    // Average volume over last 60 days to detect real smart money accumulation
    const avgVol60 = prices.slice(-60).reduce((acc, val) => acc + val.volume, 0) / 60;

    if (!ma224 || !ma112 || !ma448) return { isPick: false, reason: "MA calculation failed." };

    // Calculate distance to MA224
    const distanceTo224 = (currentPrice - ma224) / ma224;

    // 3번자리 핵심: 224일선 근처에서 강하게 뚫어올렸거나 지지받는 상태 (예: -5% ~ +25% 구간 안착)
    const isAboveOrNear224 = distanceTo224 >= -0.05 && distanceTo224 <= 0.25;
    const volumeSurge = currentVolume > (avgVol60 * 2.0); // 200% surge vs 60-day average! (매집봉/돌파봉)

    if (!isAboveOrNear224) {
        return { isPick: false, reason: "Not near 224-day MA 3rd Spot target zone." };
    }

    let score = 50; // Base score for being in the 3rd spot zone

    // Closer to MA224 without being overly extended gives higher score
    if (distanceTo224 >= 0.0 && distanceTo224 <= 0.15) {
        score += 30; // Perfect golden zone
    } else {
        score += 10;
    }

    // Huge premium for massive volume surge (매집봉/기준봉 출현)
    if (volumeSurge) {
        score += 15;
    } else if (currentVolume > (avgVol60 * 1.5)) {
        score += 5;
    }

    // 112일선이 224일선을 골든크로스 시도하거나 돌파했다면 추가 점수
    if (ma112 > ma224) {
        score += 5;
    }

    // Always propose as a candidate, we sort by score later
    return {
        isPick: true,
        score: score,
        details: {
            ma112, ma224, ma448, currentPrice, volume: currentVolume,
            message: volumeSurge
                ? "단테 3번자리 강력한 매집/돌파봉 출현 (224일선 안착 성공)"
                : "224일선 부근 3번자리 초입 공략 구간"
        }
    };
}

import fs from 'fs';
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
당신은 'Breakout AI'의 최고 수석 애널리스트입니다. 깊이 있는 펀더멘털 분석과 한국 주식 시장의 실전 기술적 매매 기법인 **'주식 단테의 3번자리 (밥그릇 패턴)'**을 완벽하게 결합하여 분석합니다.

**엄격한 시간 기준 (매우 중요)**:
**오늘 날짜: ${today}. 현재 연도는 2026년입니다.**
모든 데이터, 재무 분석 및 시장 상황은 ${today} 기준으로 계산되어야 합니다. Google Search 도구를 활용해 ${companyName}에 대한 최신 데이터를 찾으십시오.

우리는 ${companyName}을(를) 오늘의 #1 단테 3번자리 관심 종목으로 선정했습니다.
기술적 분석 요약: 현재가: ₩${technicalDetails.currentPrice.toLocaleString('ko-KR')}, 112일선: ₩${technicalDetails.ma112.toLocaleString('ko-KR')}, 224일(1년) 이동평균선: ₩${technicalDetails.ma224.toLocaleString('ko-KR')}, 패턴: ${technicalDetails.message}.
${dartText}

전문적이고 깊이 있는 "오늘의 차트 관심주" 심층 분석 리포트를 한국어로 작성하십시오.

**OUTPUT FORMAT (CRITICAL)**:
You MUST structure your response exactly as follows. Do NOT deviate.

1. First, provide the scores strictly in valid JSON wrapped in a \`\`\`json block.
2. Second, output the Markdown report that logically flows from Technical Analysis (Timing) to Fundamental Analysis (Conviction).

\`\`\`json
{
  "investment_score": {
    "total": 85,
    "breakdown": [
      { "category": "가치평가 (동종업계 대비)", "score": 22, "max_score": 30, "reason": "P/E가 확장 중이나 최근 턴어라운드가 이를 정당화함." },
      { "category": "기술적 추세 (단테 3번자리)", "score": 28, "max_score": 30, "reason": "1, 2번자리의 기나긴 매집을 끝내고 224일선을 강력하게 돌파하는 3번자리 초입임." },
      { "category": "스마트머니 매집 (거래량)", "score": 18, "max_score": 20, "reason": "최근 224일선 부근에서 강력한 매집봉 및 거래량 폭발 출현." },
      { "category": "투자 촉매제 및 모멘텀", "score": 17, "max_score": 20, "reason": "섹터 훈풍과 함께 다가오는 실적 턴어라운드." }
    ]
  },
  "verdict": "강력 매수",
  "executive_summary": "이 펀더멘털 투자 논리를 요약하는 4개의 고부가 가치 핵심 항목(Bullet Point).",
  "bull_case_summary": "왜 이 종목이 현재 3번자리에서 대시세(4번자리)로 갈 수밖에 없는지에 대한 두 문장.",
  "bear_case_summary": "224일선 이탈 시 손절해야 하는 리스크 요소에 대한 날카로운 두 문장."
}
\`\`\`

# ${companyName} 심층 분석 : 3번자리 호수비의 시작

[목차]
프롤로그: 왜 지금 이 기업인가?
제 1 장. 기술적 분석: 완벽한 3번자리의 도래 (224일선 안착과 세력 매집봉)
제 2 장. 펀더멘털 해부: 바닥을 다지고 턴어라운드하는 숫자들 (DART 데이터 기반)
제 3 장. 비즈니스 모델(BM)과 구조적 해자
제 4 장. 폭발적 상승 트리거: 대시세(4번자리)를 견인할 재료
제 5 장. 리스크 요인 
제 6 장. 최종 목표가 및 224일선 기준 매매 시나리오

**작성 지침**:
- 가장 먼저 **제 1 장(기술적 분석)**에서 **"단테의 3번자리(밥그릇 패턴)"** 차트 메커니즘 관점(112, 224일선 지지, 세력의 기나긴 1~2번자리 매집 이후 3번자리 머리내밀기 등)으로 이 주식을 왜 "지금" 사야 하는지 명쾌하게 서술하십시오.
- 이어서 그 차트상의 대시세 초입(3번자리)을 탄탄하게 뒷받침할 "세력의 명분"을 **제 2 장~제 4 장(재무, 비전, 촉매제)**에서 자연스럽게 풀어나가십시오.
- 이전처럼 "기술적 분석"과 "기본적 분석"을 기계적이나 인위적으로 분리하지 말고, 하나의 거대한 투자 스토리텔링 라인으로 자연스럽고 유려하게 연결하십시오.
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

    // Check how many we already picked today (for logging)
    const today = new Date().toISOString().split('T')[0];
    const { data: existing } = await supabase
        .from('oneil_picks')
        .select('id')
        .gte('pick_date', today);

    if (existing && existing.length > 0) {
        console.log(`Already found ${existing.length} pick(s) today. Finding another one...`);
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
    for (const stock of SCREENING_UNIVERSE) {
        // [IMPORTANT] recentTickers holds the TICKER, because we save stock.ticker as pick_ticker
        if (recentTickers.has(stock.ticker)) {
            continue; // Skip if already picked recently
        }

        try {
            const prices = await fetchHistoricalData(stock.ticker);
            const analysis = analyzeDanteThirdSpot(prices);

            if (analysis.isPick) {
                console.log(`  🟡 Potential Match: ${stock.name} (Score: ${analysis.score}) - ${analysis.details.message}`);
                candidates.push({
                    ticker: stock.ticker,    // Save actual TICKER symbol to DB
                    yfTicker: stock.ticker,
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
