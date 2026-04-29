import { createClient } from '@supabase/supabase-js';
import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import fetch from 'cross-fetch';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { sendTelegramMessage } from './telegram_bot.mjs';
import { broadcastToSocialMedia } from './social_poster.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const cleanUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').replace(/[^a-zA-Z0-9\-_.://?&=]/g, '');
const cleanKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '').replace(/[^a-zA-Z0-9\-_.]/g, '');

process.env.NEXT_PUBLIC_SUPABASE_URL = cleanUrl;
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = cleanKey;
process.env.GEMINI_API_KEY = (process.env.GEMINI_API_KEY || '').replace(/[^a-zA-Z0-9\-_.]/g, '');

const supabaseUrl = cleanUrl;
const supabaseKey = cleanKey;

console.log("Breakout AI Script v3: Environment variables sanitized globally.");
if (!supabaseUrl || !supabaseKey) {
    console.error("Missing required environment variables for Supabase.");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false },
    global: { fetch: fetch }
});

async function main() {
    console.log("Starting Daily Market Briefing Generation...");

    try {
        const indices = ['^GSPC', '^IXIC', '^KS11', '^KQ11', 'KRW=X'];
        let marketDataStr = "";

        const fetchPromises = indices.map(async (ticker) => {
            try {
                let price = 0;
                let changePercent = 0;
                let name = "";
                let isKR = false;

                if (ticker === '^KS11' || ticker === '^KQ11') {
                    const naverSymbol = ticker === '^KS11' ? 'KOSPI' : 'KOSDAQ';
                    const url = `https://polling.finance.naver.com/api/realtime/domestic/index/${naverSymbol}`;
                    const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' }, cache: 'no-store' });
                    const data = await res.json();
                    const indexData = data.datas[0];
                    if (indexData) {
                        price = parseFloat(indexData.closePriceRaw);
                        changePercent = parseFloat(indexData.fluctuationsRatioRaw);
                        name = naverSymbol;
                        isKR = true;
                    }
                } else {
                    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${ticker}?interval=1d&range=1d`;
                    const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' }, cache: 'no-store' });
                    const data = await res.json();
                    const meta = data?.chart?.result?.[0]?.meta;
                    if (meta) {
                        price = meta.regularMarketPrice;
                        const prevClose = meta.chartPreviousClose;
                        if (prevClose && prevClose > 0) {
                            changePercent = ((price - prevClose) / prevClose) * 100;
                        }
                        name = ticker === '^GSPC' ? 'S&P 500' : ticker === '^IXIC' ? 'NASDAQ' : 'USD/KRW';
                        isKR = ticker === 'KRW=X';
                    }
                }

                if (name) {
                    marketDataStr += `${name}: ${price.toFixed(2)}${isKR && ticker !== 'KRW=X' ? ' KRW' : ticker === 'KRW=X' ? ' 원' : ''} (${changePercent >= 0 ? '+' : ''}${changePercent.toFixed(2)}%)\n`;
                }
            } catch (e) {
                console.error(`Failed to fetch index ${ticker}`, e);
            }
        });

        await Promise.all(fetchPromises);

        if (!marketDataStr) {
            marketDataStr = "오늘의 시장 데이터를 불러올 수 없습니다.";
        }

        const dateStr = new Date().toISOString().split('T')[0];

        const prompt = `
당신은 날카롭고 객관적이며 전문적인 월스트리트 출신 프랍 트레이더이자 마켓 애널리스트입니다.
당신의 임무는 짧고 강렬한 3문단 분량의 "일일 마켓 브리핑(Daily Market Briefing)"을 작성하는 것입니다.
기준일은 미국 및 한국 증시 마감 기준인 ${dateStr} 입니다.

아래는 주요 지수의 종가 데이터입니다:
${marketDataStr}

작성 지침:
1. 반드시 아래 3개의 섹션(1, 2, 3)으로 나누어 작성하십시오. 모든 텍스트는 **한국어(Korean)**로 유지하십시오.
2. 섹션 1: [핵심 요약 및 지수 현황] 시장이 전반적으로 상승했는지 하락했는지, 투자 심리와 주요 지수(제공된 KOSPI, KOSDAQ, S&P 500 등)의 등락률을 문장과 함께 명시적으로 나열하십시오.
3. 섹션 2: [오늘의 시장 주도 테마 3선] 오늘 한국 및 미국 시장을 움직인 가장 중요한 뉴스 헤드라인, 거시 경제 이벤트 또는 섹터 변동 3가지를 식별하여 글머리 기호(Bullet points)로 작성하십시오.
4. 섹션 3: [AI 트레이딩 뷰] 내일 시장에 대한 1~2문장 분량의 예리한 전진적 통찰력이나 기술적 경고를 제공하십시오.
5. 반드시 마지막 섹션 4: [💡 오늘의 투자 아이템] 이라는 제목으로, 오늘 시장 테마와 어울리는 제품(예: 반도체 관련이면 고성능 PC, 하락장이면 스트레스 해소용 마사지기 등)을 1문장으로 추천하고, 다음 쿠팡 링크를 그대로 삽입하십시오: "[👉 쿠팡 로켓배송 특가 보러가기](https://coupa.ng/cmAdDy)"
6. Markdown 형식을 활용하여 가독성을 높이되, 핵심 키워드는 **굵게(Bold)** 처리하십시오. 이모지는 절대 사용하지 마십시오.

타이틀 작성 필수 조건:
응답의 첫 번째 줄은 반드시 아래 형식을 정확히 지켜서 작성되어야 합니다:
TITLE: [여기에 창의적이고 전문적인 뉴스 타이틀을 작성하세요]
(내용은 두 번째 줄부터 시작합니다.)
`;

        if (process.env.GEMINI_API_KEY && !process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
            process.env.GOOGLE_GENERATIVE_AI_API_KEY = process.env.GEMINI_API_KEY;
        }

        if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
            console.error("Missing Gemini API Key");
            process.exit(1);
        }

        const { text } = await generateText({
            model: google("gemini-2.5-flash"),
            prompt: prompt,
            temperature: 0.7,
            maxRetries: 7,
        });

        let title = `Market Briefing: ${dateStr}`;
        let content = text;

        if (text.startsWith("TITLE:")) {
            const lines = text.split('\n');
            title = lines[0].replace("TITLE:", "").trim();
            content = lines.slice(1).join('\n').trim();
        }

        const { error } = await supabase
            .from('market_summaries')
            .insert({
                date: dateStr,
                title: title,
                content: content
            });

        if (error) {
            console.error("Supabase Insert Error:", error.message || String(error));
            process.exit(1);
        }

        console.log(`✅ Successfully generated and saved summary for ${dateStr}`);
        console.log(`Title: ${title}`);
        
        // --- Telegram Notification ---
        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://breakai.vercel.app';
        // Extract a small summary snippet
        const summarySnippet = content.split('\n').slice(0, 4).join('\n').replace(/[*#]/g, '').trim();
        
        const telegramMessage = `
📊 <b>[일일 마켓 브리핑 업데이트]</b>
<i>${title}</i>

${summarySnippet}...

👇 <b>지금 웹사이트에서 전체 브리핑을 무료로 확인하세요:</b>
<a href="${siteUrl}/briefing">👉 브리핑 바로가기</a>
`;
        await sendTelegramMessage(telegramMessage.trim());

        const snsMessage = `
📈 [오늘의 마켓 브리핑 요약]
${summarySnippet.substring(0, 150)}...

AI가 짚어주는 오늘의 핵심 주식 테마와 글로벌 증시 동향!
리포트 전문은 아래 사이트에서 무료로 확인하세요 👇
${siteUrl}

#주식 #국내주식 #미국주식 #단테3번자리 #BreakoutAI
`;
        await broadcastToSocialMedia(snsMessage.trim());
    } catch (err) {
        console.error("Fatal error generating daily summary:", err);
        process.exit(1);
    }
}

main();
