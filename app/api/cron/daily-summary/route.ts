import { NextResponse } from 'next/server';
import { supabase } from "../../../lib/supabase";

// We import the AI SDK for Gemini
import { google } from "@ai-sdk/google";
import { generateText } from "ai";

// Vercel Cron will hit this URL automatically
export async function GET(req: Request) {
    try {
        // 1. Basic Security: Ensure the request comes from Vercel's Cron Infrastructure
        // Vercel sends a specific Authorization header with the cron secret we set
        const authHeader = req.headers.get('authorization');
        const cronSecret = process.env.CRON_SECRET;

        // Disable this check locally or if secret isn't set for easy manual testing during dev.
        // In production, ALWAYS set CRON_SECRET in Vercel.
        if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        console.log("[Cron] Starting Daily Market Summary Generation...");

        // 2. Fetch Live Market Tickers from Yahoo Finance
        // US: ^GSPC = S&P 500, ^IXIC = NASDAQ. KR: ^KS11 = KOSPI, ^KQ11 = KOSDAQ. FX: USD/KRW = KRW=X
        const indices = ['^GSPC', '^IXIC', '^KS11', '^KQ11', 'KRW=X'];
        let marketDataStr = "";

        const fetchPromises = indices.map(async (ticker) => {
            try {
                let price = 0;
                let changePercent = 0;
                let name = "";
                let isKR = false;

                if (ticker === '^KS11' || ticker === '^KQ11') {
                    // Yahoo Finance has a bug where chartPreviousClose is often incorrect for Korean indices.
                    // We fallback to Naver Finance's API for KOSPI and KOSDAQ.
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

        // Fallback if Yahoo Finance fails
        if (!marketDataStr) {
            marketDataStr = "오늘의 시장 데이터를 불러올 수 없습니다.";
        }

        const dateStr = new Date().toISOString().split('T')[0];

        // 3. Prompt Gemini AI to write the summary
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
5. Markdown 형식을 활용하여 가독성을 높이되, 핵심 키워드는 **굵게(Bold)** 처리하십시오. 이모지는 절대 사용하지 마십시오.

타이틀 작성 필수 조건:
응답의 첫 번째 줄은 반드시 아래 형식을 정확히 지켜서 작성되어야 합니다:
TITLE: [여기에 창의적이고 전문적인 뉴스 타이틀을 작성하세요]
(내용은 두 번째 줄부터 시작합니다.)
`;

        // Ensure the env is mapped if using the single function call
        if (process.env.GEMINI_API_KEY && !process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
            process.env.GOOGLE_GENERATIVE_AI_API_KEY = process.env.GEMINI_API_KEY;
        }

        const { text } = await generateText({
            model: google("gemini-2.5-flash"),
            prompt: prompt,
            temperature: 0.7,
        });

        // 4. Parse the Title and Content
        let title = `Market Briefing: ${dateStr}`;
        let content = text;

        if (text.startsWith("TITLE:")) {
            const lines = text.split('\n');
            title = lines[0].replace("TITLE:", "").trim();
            content = lines.slice(1).join('\n').trim();
        }

        // 5. Save to Supabase
        // We use an upsert/onConflict approach to avoid duplicate daily summaries if cron runs twice by accident
        const { error } = await supabase
            .from('market_summaries')
            .upsert(
                {
                    date: dateStr,
                    title: title,
                    content: content
                },
                { onConflict: 'date' }
            );

        if (error) {
            console.error("[Cron DB Error]:", error);
            return NextResponse.json({ error: error.message || String(error) }, { status: 500 });
        }

        console.log(`[Cron] Successfully generated and saved summary for ${dateStr}`);
        return NextResponse.json({ success: true, date: dateStr, title });

    } catch (error: any) {
        console.error('[Cron] Fatal error generating daily summary:', error);
        return NextResponse.json({ error: error.message || String(error) }, { status: 500 });
    }
}
