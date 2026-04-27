import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { sendTelegramMessage } from './telegram_bot.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const cleanKey = (process.env.GEMINI_API_KEY || '').replace(/[^a-zA-Z0-9\-_.]/g, '');
process.env.GOOGLE_GENERATIVE_AI_API_KEY = cleanKey;

async function main() {
    console.log("Starting SEO Blog Generator...");

    const topics = [
        "주식 단테 3번자리 매매기법 완벽 분석 및 조건검색식",
        "KOSPI 주도주 찾는 방법과 거래량 분석",
        "224일 이동평균선 지지와 세력 매집 패턴의 비밀",
        "엔비디아 주가 전망과 AI 관련 수혜주 2026년 투자 전략",
        "워렌 버핏과 윌리엄 오닐의 캔들 차트 분석 비교",
        "금리 인하 시기에 폭등하는 주식 섹터 TOP 3",
        "보조지표 완벽 가이드: RSI 파이버전스와 MACD 실전 활용법",
        "세력의 흔적을 찾는 주식 차트 보는 법 (매집봉, 윗꼬리 캔들)"
    ];

    const randomTopic = topics[Math.floor(Math.random() * topics.length)];
    const dateStr = new Date().toISOString().split('T')[0];
    const slug = `seo-post-${Date.now()}`;

    const prompt = `
당신은 대한민국 최고의 주식 투자 전문 블로거이자 SEO(검색 엔진 최적화) 전문가입니다.
주제: "${randomTopic}"

위 주제에 대해 구글 검색 결과 1페이지에 노출될 수 있도록 전문적이고 길며 자세한(약 1500자 이상) 교육용 아티클을 작성하십시오.
반드시 Markdown 형식으로 작성하고, 서론, 본론(3개 이상의 소제목), 결론을 명확히 구분하십시오.
핵심 키워드를 자연스럽게 여러 번 반복하십시오.

그리고 **매우 중요**: 결론 부분 직전에 다음 문구를 삽입하여 쿠팡 스폰서 링크를 남기십시오.
"[💻 성공적인 주식 투자를 위한 HTS용 초고화질 듀얼 모니터 로켓배송 특가 보러가기 (쿠팡 파트너스)](https://coupa.ng/cmAdDy)"

글 마지막에는 "Breakout AI 시스템이 분석한 결과입니다." 라는 문구를 추가하십시오.
`;

    try {
        const { text } = await generateText({
            model: google("gemini-2.5-flash"),
            prompt: prompt,
            temperature: 0.8,
        });

        // Save to content/blog directory
        const blogDir = path.join(__dirname, '../content/blog');
        if (!fs.existsSync(blogDir)) {
            fs.mkdirSync(blogDir, { recursive: true });
        }

        const filePath = path.join(blogDir, `${slug}.md`);
        
        // Add frontmatter
        const frontmatter = `---
title: "${randomTopic}"
date: "${dateStr}"
description: "AI가 분석한 ${randomTopic}에 대한 심층 인사이트와 실전 투자 매매 전략입니다."
---

`;

        fs.writeFileSync(filePath, frontmatter + text);
        console.log(`✅ SEO Blog Post created: ${filePath}`);

        // --- Telegram Notification ---
        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://breakai.vercel.app';
        const telegramMessage = `
📝 <b>[신규 투자 인사이트 (SEO 블로그)]</b>
<i>${randomTopic}</i>

검색 트렌드 분석을 기반으로 한 새로운 실전 투자 교육 칼럼이 업데이트 되었습니다!

👇 <b>지금 웹사이트에서 전체 글을 확인하세요:</b>
<a href="${siteUrl}/blog/${slug}">👉 블로그 바로가기</a>
`;
        await sendTelegramMessage(telegramMessage.trim());

    } catch (err) {
        console.error("❌ Failed to generate SEO blog post:", err);
        process.exit(1);
    }
}

main();
