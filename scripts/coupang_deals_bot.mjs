import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { sendTelegramMessage } from './telegram_bot.mjs';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

process.env.GOOGLE_GENERATIVE_AI_API_KEY = (process.env.GEMINI_API_KEY || '').replace(/[^a-zA-Z0-9\-_.]/g, '');

async function main() {
    console.log("Starting Coupang Deals Bot...");

    const themes = [
        "장시간 차트 보는 전업 투자자를 위한 눈 영양제 (루테인) 특가",
        "허리 디스크 방지! 단테 3번자리 기다리는 용도의 최고급 사무용 의자 할인",
        "장중 집중력을 깨우는 프리미엄 캡슐 커피/머신 로켓배송",
        "단기 단타 매매 스피드를 올려줄 무접점 기계식 키보드 & 초경량 마우스 세트",
        "미장 밤샘 트레이더를 위한 꿀잠 유도 수면용품 (수면안대, 베개)",
        "여러 차트를 띄우기 위한 초가성비 4K 와이드 모니터 역대급 특가",
        "하락장 스트레스 해소용 초강력 마사지건/어깨 안마기 파격 할인"
    ];

    const randomTheme = themes[Math.floor(Math.random() * themes.length)];

    const prompt = `
당신은 수만 명의 구독자를 보유한 마케팅 전문가이자 카피라이터입니다.
주제: "${randomTheme}"

위 주제에 대해 텔레그램 메신저 구독자들이 지금 당장 충동적으로 클릭하고 싶게 만드는 짧고 강렬한(3~4문장 분량) "오늘의 타임딜 큐레이션" 메시지를 작성해 주세요.
FOMO(오늘 당장 놓치면 손해라는 심리)를 자극하고, 주식 투자자들의 애환과 공감을 이끌어내는 센스 있는 유머를 반드시 한 스푼 넣어주세요.

**작성 조건:**
- 이모지를 적절히 사용하여 시각적으로 눈에 띄게 작성할 것.
- HTML 태그(<b>, <i> 등)를 활용해 강조할 것.
- 내용 중간 또는 마지막에 아래 쿠팡 스폰서 링크를 반드시 눈에 띄게 삽입할 것:
<a href="https://coupa.ng/cmAdDy">👉 <b>[지금 로켓배송 특가 재고 확인하기]</b></a>
`;

    try {
        const { text } = await generateText({
            model: google("gemini-2.5-flash"),
            prompt: prompt,
            temperature: 0.9,
        });

        const telegramMessage = `
🛒 <b>[Breakout AI 오늘의 핫딜 큐레이션]</b>

${text.trim()}

<i style="color:gray; font-size:12px;">(이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.)</i>
`;
        await sendTelegramMessage(telegramMessage.trim());
        console.log(`✅ Deals sent successfully.`);
    } catch (err) {
        console.error("❌ Failed to generate deals post:", err);
        process.exit(1);
    }
}

main();
