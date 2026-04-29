import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import fetch from 'cross-fetch';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

// Setup Supabase
const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').replace(/[^a-zA-Z0-9\-_.://?&=]/g, '');
const supabaseKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '').replace(/[^a-zA-Z0-9\-_.]/g, '');
const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false },
    global: { fetch: fetch }
});

// Setup Gemini
const geminiApiKey = (process.env.GEMINI_API_KEY || '').replace(/[^a-zA-Z0-9\-_.]/g, '');
const genAI = new GoogleGenerativeAI(geminiApiKey);

// KOREAN_STOCKS map for name lookup
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

function getNameByTicker(ticker) {
    const cleanTicker = ticker.trim().toUpperCase();
    const stock = KOREAN_STOCKS.find(s => s.ticker.toUpperCase() === cleanTicker);
    return stock ? stock.name : cleanTicker;
}

// Replicate DART Logic
function getDartCorpCode(companyName) {
    try {
        const filePath = path.join(__dirname, '../utils/dartCorpCodes.json');
        const data = fs.readFileSync(filePath, 'utf-8');
        const map = JSON.parse(data);
        if (map[companyName]) return map[companyName].corp_code;
        const partialKey = Object.keys(map).find(key => key.includes(companyName) || companyName.includes(key));
        if (partialKey) return map[partialKey].corp_code;
    } catch (e) {
        // ignore
    }
    return null;
}

async function fetchDartFinancials(companyName) {
    const corpCode = getDartCorpCode(companyName);
    if (!corpCode) return null;
    const apiKey = (process.env.DART_API_KEY || '').replace(/[^a-zA-Z0-9\-_.]/g, '');
    if (!apiKey) return null;
    try {
        let targetYear = (new Date().getFullYear() - 1).toString();
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

// Generate new AI Report
async function generateAIReport(companyName, ticker, technicalDetails) {
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
모든 데이터, 재무 분석 및 시장 상황은 ${today} 기준으로 계산되어야 합니다. Google Search 도구를 활용해 ${companyName}(${ticker})에 대한 최신 데이터를 찾으십시오.

우리는 ${companyName}(${ticker})을(를) 오늘의 #1 단테 3번자리 관심 종목으로 선정했습니다.
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
제 7 장. 💡 애널리스트의 추천 아이템

**작성 지침**:
- 가장 먼저 **제 1 장(기술적 분석)**에서 **"단테의 3번자리(밥그릇 패턴)"** 차트 메커니즘 관점(112, 224일선 지지, 세력의 기나긴 1~2번자리 매집 이후 3번자리 머리내밀기 등)으로 이 주식을 왜 "지금" 사야 하는지 명쾌하게 서술하십시오.
- 이어서 그 차트상의 대시세 초입(3번자리)을 탄탄하게 뒷받침할 "세력의 명분"을 **제 2 장~제 4 장(재무, 비전, 촉매제)**에서 자연스럽게 풀어나가십시오.
- 이전처럼 "기술적 분석"과 "기본적 분석"을 기계적이나 인위적으로 분리하지 말고, 하나의 거대한 투자 스토리텔링 라인으로 자연스럽고 유려하게 연결하십시오.
- 마지막 **제 7 장. 💡 애널리스트의 추천 아이템** 섹션을 반드시 추가하여, 해당 종목의 섹터나 특징과 연관된 제품(예: IT주면 전자기기 등)을 1문장으로 유머러스하게 추천하고 다음 스폰서 링크를 붙여넣으십시오: "[👉 AI 추천 관련 특가 상품 확인하기 (스폰서 링크)](https://coupa.ng/cmAdDy)"
`;

    let retries = 5;
    let result = null;
    while (retries > 0) {
        try {
            result = await model.generateContent(prompt);
            break;
        } catch (e) {
            console.warn(`⚠️ Gemini API error (Retries left: ${retries - 1}):`, e.message);
            retries--;
            if (retries === 0) {
                console.warn(`❌ Exceeded max retries for ${companyName}. Skipping.`);
                return null;
            }
            await new Promise(r => setTimeout(r, 10000));
        }
    }
    
    if (!result) return null;
    
    try {
        let text = result.response.text();
        let jsonString = "";
        let finalMarkdown = "";
        const jsonMatch = text.match(/\`\`\`(?:json)?\s*(\{[\s\S]*?\})\s*\`\`\`/);
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
    console.log("Fetching all records to fix...");
    const { data: picks, error } = await supabase.from('oneil_picks').select('*');
    
    if (error || !picks) {
        console.error("Error fetching picks:", error);
        process.exit(1);
    }
    
    console.log(`Found ${picks.length} picks. Regenerating AI Reports...`);
    
    for (let i = 0; i < picks.length; i++) {
        const pick = picks[i];
        const ticker = pick.ticker;
        const name = getNameByTicker(ticker);
        
        // Skip if already correct
        if (pick.ai_report && pick.ai_report.includes(name)) {
            console.log(`[${i+1}/${picks.length}] Skipping ${name} (${ticker}) - already correct.`);
            continue;
        }
        
        let details = pick.technical_details;
        if (typeof details === 'string') {
            try { details = JSON.parse(details); } catch(e) {}
        }
        
        console.log(`[${i+1}/${picks.length}] Regenerating report for ${name} (${ticker})...`);
        const reportMd = await generateAIReport(name, ticker, details);
        
        if (reportMd) {
            const { error: updateError } = await supabase
                .from('oneil_picks')
                .update({ ai_report: reportMd })
                .eq('id', pick.id);
                
            if (updateError) {
                console.error(`Failed to update DB for ${ticker}:`, updateError);
            } else {
                console.log(`✅ Successfully updated ${name} in DB.`);
            }
        } else {
            console.log(`❌ Failed to generate report for ${name}`);
        }
        
        // Wait 3 seconds between each generation to respect Gemini rate limits
        await new Promise(r => setTimeout(r, 3000));
    }
    
    console.log("\n🎉 ALL REPORTS HAVE BEEN REGENERATED AND FIXED.");
}

main();
