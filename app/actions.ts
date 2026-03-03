"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { supabase } from "./lib/supabase";
import { getTickerByName } from "../utils/koreanStocks";

// Here ticker parameter is actually the Company Name (e.g. 삼성전자)
export async function analyzeTicker(companyName: string, reportType: "research" | "earnings" = "research", quarter: string = "") {
    // PRE-VALIDATION: Check if ticker exists via mapped dictionary
    let yfTicker = getTickerByName(companyName);

    // Fallback if not found in our predefined list (admin might type raw US ticker or .KS directly)
    if (!yfTicker) {
        yfTicker = companyName;
    }
    // PRE-VALIDATION: Check if ticker exists via Yahoo Finance API
    try {
        const queryTicker = yfTicker === "LNK" ? "LINK-USD" : yfTicker;
        const res = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${queryTicker}?interval=1d&range=1d`, { headers: { 'User-Agent': 'Mozilla/5.0' } });
        const data = await res.json();
        if (data?.chart?.error?.code === "Not Found" || data?.chart?.error?.description?.includes("delisted")) {
            return "Error: Invalid Company Name or Ticker. The specified company does not exist or is delisted.";
        }
    } catch (err) {
        console.error("Ticker validation fetch failed, proceeding anyway...", err);
    }

    // 1. 비밀 금고(.env.local)에서 키 꺼내기
    const apiKey = process.env.GEMINI_API_KEY;
    // Add dynamically current Date to anchor the AI to the live present timeline
    const today = new Date().toISOString().split('T')[0];
    if (!apiKey) return "Error: API Key not found.";

    // 2. 제미나이 연결
    const genAI = new GoogleGenerativeAI(apiKey);

    // Google Search Grounding 도구 설정
    const tools: any = [
        {
            googleSearch: {} // New standard for 2.5 Flash and newer models
        },
    ];

    // Priority Model List
    const modelsToTry = [
        "gemini-2.5-flash"
    ];

    // Log to capture errors for each model
    let errorLog: string[] = [];

    // Dual-Mode Prompt Definitions
    const researchPrompt = `
    당신은 월스트리트 최고 수준의 프랍 트레이더이자 애널리스트입니다. 기업의 펀더멘털 분석과 기술적 분석(스마트 머니 흐름)을 완벽하게 결합합니다.
    당신의 목표는 다음 기업에 대해 "투자가치 점수"(0-100)를 부여하고 심층 보고서를 작성하는 것입니다: ${companyName}.

    **엄격한 시간 기준 (매우 중요)**:
    **현재 날짜(매우 중요): 오늘의 날짜는 ${today} 입니다. 모든 데이터, 재무 분석, 분기 실적 및 추세 전망은 ${today} 기준으로 계산되어야 합니다. 2024년 과거 데이터를 사용하지 마십시오. 현재 연도는 2026년입니다. ${today}까지의 최신 데이터를 사용하십시오.**
    - **오늘은 ${today} 입니다.**
    - 최신 실적, 최근 신제품 출시 내역, 최신 시장 상황 등을 반드시 검색하고 반영해야 합니다.

    **자료 출처 요구사항**:
    - \`Google Search\`를 활용해 ${companyName}에 대한 ${today} 기준 최신 실시간 데이터와 뉴스를 탐색하십시오.

    **출력 형식 (매우 중요)**:
    응답은 반드시 두 부분으로 나누어 작성해야 JSON 파싱 오류가 발생하지 않습니다.
    모든 출력 언어는 **반드시 한국어(Korean)**로 작성해야 합니다.

    **PART 1: JSON METRICS**
    점수 및 요약은 반드시 \`\`\`json\`\`\` 코드 블록으로 감싸진 유효한 JSON 형식이어야 합니다. 상세 리포트를 이곳에 포함하지 마십시오.
    **투자가치 점수 분할**:
    \`investment_score\`는 정확히 4개의 카테고리로 나누어야 합니다 (가치평가, 펀더멘털 건전성, 기술적 추세, 촉매제/시장심리).
    \`\`\`json
    {
      "investment_score": {
        "total": 85,
        "breakdown": [
          { "category": "가치평가 (동종업계 대비)", "score": 22, "max_score": 30, "reason": "P/E가 확장 중이나 EPS 성장이 이를 정당화함." },
          { "category": "펀더멘털 및 잉여현금흐름(FCF)", "score": 28, "max_score": 30, "reason": "부채 비율이 안정적이고 잉여현금흐름이 견고함." },
          { "category": "기술적 추세 및 스마트머니", "score": 18, "max_score": 20, "reason": "50일 이동평균선 위에서 지속적인 거래량 누적." },
          { "category": "투자 촉매제 및 시장 심리", "score": 17, "max_score": 20, "reason": "출시 예정인 신제품 사이클로 인해 기관 등급 상향 조정." }
        ]
      },
      "verdict": "매수",
      "executive_summary": "이 펀더멘털 투자 논리를 요약하는 4개의 고부가 가치 핵심 항목(Bullet Point).",
      "bull_case_summary": "이 주식이 폭발적으로 상승할 수밖에 없는 이유를 담은 날카로운 두 문장.",
      "bear_case_summary": "이 주식에 치명적일 수 있는 위험 요소에 대한 날카로운 두 문장."
    }
    \`\`\`

    **PART 2: DETAILED REPORT (MARKDOWN)**
    JSON 블록 바로 아래에 10개 챕터로 구성된 상세 리포트를 표준 Markdown으로 작성하십시오. 모든 내용은 한국어로 작성합니다 (예: 목표가, 시가총액, 매수/매도).
    - 깊이 있고 포괄적인 분석, 비유, 구체적인 데이터 포인트를 제공하십시오. (챕터당 150-200단어 수준).
    - **가독성을 위한 핵심 포매팅 (매우 중요)**: 
      1. 월스트리트 저널 혹은 프리미엄 기관 리포트 스타일로 작성.
      2. 문단을 나눌 때 한 줄 띄어쓰기(Double Newline)를 적극 활용하여 가독성을 높이십시오.
      3. 강조할 핵심 지표는 **굵게(Bold)** 처리하고, 요약 목록은 글머리 기호(Bullet points)를 사용하며, 중요한 시사점은 인용구(\`>\`)를 활용하십시오.

    # 목차
    프롤로그: 투자의 세계에 오신 것을 환영합니다
    ## 제 1 장. 기업 재무 건전성 진단
    ## 제 2 장. 산업 및 매크로 분석
    ## 제 3 장. 왜 지금 이 기업인가?
    ## 제 4 장. 사업보고서(10-K/DART) 정밀 해부
    ## 제 5 장. 비즈니스 모델 수익성 분석
    ## 제 6 장. 핵심 경쟁 우위 (해자)
    ## 제 7 장. 주가 상승을 이끌 핵심 촉매제
    ## 제 8 장. 기술적 분석: 스마트 머니의 흔적 🎯
    ## 제 9 장. 유의해야 할 잠재적 리스크
    ## 제 10 장. 밸류에이션 및 목표주가 추정
    [에필로그] 확신을 갖는 투자 전략
    `;

    const earningsPrompt = `
    당신은 기업 실적을 분석하는 최고 수준의 월스트리트 주식 시장 애널리스트입니다.
    당신의 목표는 다음 기업의 ${quarter} 실적 발표 보고서를 평가하고 요약하는 것입니다: ${companyName}.
    분석가는 분기 대비(Q-o-Q), 전년 동기 대비(Y-o-Y) 성장 지표와 향후 가이던스(사업 전망)를 즉시 파악해야 합니다.
    
    **엄격한 시간 기준 (매우 중요)**:
    - **오늘은 ${today} 입니다. 현재 연도는 2026년입니다.**
    - 반드시 ${today} 이전에 가장 최근 마감된 분기의 실제 발표치만 보고하십시오.
    
    **자료 출처 요구사항**:
    - \`Google Search\`를 활용해 ${companyName}의 ${quarter} 실적 발표에 대한 월스트리트 컨센서스와 실제 발표된 실적을 찾아보십시오.

    **출력 제약 사항 (매우 중요)**:
    - 결과물은 오직 유효한 **JSON 형식**으로만 출력해야 합니다. JSON 블록 외부에 Markdown 혹은 일반 텍스트를 작성하지 마십시오.
    - 숫자와 화폐 단위는 정확한 문자열로 제공하십시오 (예: "15,200원", "2.1조원").
    - **매우 중요: 모든 출력 언어는 한국어로 작성되어야 합니다.**
    - 새로운 줄 바꿈은 \\n 으로 변환하고 큰 따옴표는 \\" 로 이스케이프해야 합니다.
    
    **OUTPUT JSON STRUCTURE:**
    {
        "actual_eps": "1,500원",
        "est_eps": "1,350원",
        "actual_rev": "25.1조원",
        "est_rev": "24.5조원",
        "guidance_summary": "경영진은 AI 제품 수요 확대로 인해 연간 가이던스를 상향 조정했습니다.",
        "ai_interpretation": "강세 시그널 (BULLISH). EPS와 매출 모두 예상치를 상회했으며 상향된 가이던스는 강력한 가격 결정력을 의미합니다.",
        "verdict": "매수",
        "executive_summary": "EPS 및 매출의 어닝 서프라이즈와 선행 가이던스 상향.",
        "investment_score": { "total": 90 }
    }
    
    CRITICAL INSTRUCTION: You must output ONLY valid, raw JSON. Do NOT wrap the JSON in markdown formatting or code blocks. Do NOT include any conversational text or explanations outside the JSON.
    `;

    const prompt = reportType === "earnings" ? earningsPrompt : researchPrompt;

    for (const modelName of modelsToTry) {
        try {
            console.log(`Trying model: ${modelName}...`);

            // Remove incompatible generationConfig for tools
            const currentModel = genAI.getGenerativeModel({
                model: modelName,
                tools: tools,
            }, { apiVersion: "v1beta" });

            const result = await currentModel.generateContent(prompt);
            const response = await result.response;
            let text = response.text();

            // Debug logging
            console.log(`Model ${modelName} raw response length: `, text.length);

            let jsonString = "";
            let finalMarkdown = "";

            if (reportType === "research") {
                // Safely extract the JSON block from the mixed response
                const jsonMatch = text.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/) || text.match(/\{[\s\S]*\}/);
                if (!jsonMatch) {
                    throw new Error("No JSON block found in research response");
                }

                jsonString = jsonMatch[1] || jsonMatch[0];

                // Extract everything that IS NOT the JSON string to form the robust markdown body
                finalMarkdown = text.replace(jsonMatch[0], '').trim();

            } else {
                // Earnings are entirely JSON, use robust cleanup
                let cleanText = text.replace(/```json/gi, '').replace(/```/g, '').trim();
                const start = cleanText.indexOf('{');
                const end = cleanText.lastIndexOf('}');
                if (start !== -1 && end !== -1) {
                    cleanText = cleanText.substring(start, end + 1);
                }
                const jsonMatch = cleanText.match(/\{[\s\S]*\}/);
                if (!jsonMatch) throw new Error("No JSON found in earnings response");
                jsonString = jsonMatch[0];
            }

            if (jsonString.includes("SOURCE_DATA_MISSING")) {
                return "Error: SOURCE_DATA_MISSING. (Cannot find latest data. Please check ticker.)";
            }

            let analysis;
            try {
                analysis = JSON.parse(jsonString);
                console.log(`Parsed JSON keys:`, Object.keys(analysis)); // Validating keys

                if (reportType === "research") {
                    if (!analysis.executive_summary) {
                        throw new Error("Missing executive_summary");
                    }
                    // Handle edge cases where LLM ignored instructions and put markdown inside JSON
                    if (analysis.detailed_report_markdown && finalMarkdown.length < 100) {
                        finalMarkdown = analysis.detailed_report_markdown;
                    }
                    // Append the dynamic scores directly to the safe markdown payload
                    finalMarkdown += '\n\n<!-- SCORE_BREAKDOWN: ' + JSON.stringify(analysis.investment_score) + ' -->';
                } else {
                    if (!analysis.actual_eps || !analysis.guidance_summary) {
                        throw new Error("Missing required earnings fields");
                    }
                }
            } catch (e: any) {
                console.error(`JSON Parse/Validation Error (${modelName}):`, e);
                console.error("Failed JSON Text snippet:", jsonString.substring(0, 300));
                errorLog.push(`${modelName}: JSON Parse error - ${e.message}`);
                continue;
            }

            const { error } = await supabase
                .from('reports')
                .insert({
                    ticker: companyName.toUpperCase(),
                    risk_score: analysis.investment_score?.total || 50,
                    verdict: analysis.verdict || "HOLD",
                    one_line_summary: analysis.executive_summary,
                    detailed_report: finalMarkdown,
                    analysis_text: JSON.stringify(analysis),
                    report_type: reportType,
                    quarter: quarter || null
                });

            if (error) {
                console.error("Supabase Save Error:", error);
                return `Error: Failed to save to Database - ${error.message}`;
            }

            return JSON.stringify(analysis);

        } catch (error: any) {
            console.error(`Model ${modelName} failed:`, error.message);
            errorLog.push(`${modelName}: ${error.message}`);

            if (error.message?.includes("API key")) {
                return "Error: API Key Invalid.";
            }

            if (!error.message?.includes("429")) {
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
            continue;
        }
    }

    // Return detailed error log to user
    return `Error: All models failed to analyze.\n\n[Details]\n${errorLog.join("\n")}`;
}