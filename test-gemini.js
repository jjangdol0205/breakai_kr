const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config({ path: ".env.local" });

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

async function run() {
  const ticker = "AAPL";
  const reportType = "research";
  const researchPrompt = `
    You are a top-tier Wall Street proprietary trader and analyst who perfectly combines Fundamental Analysis with Technical Analysis (Tracking Smart Money).
    Your goal is to assign an "Investment Score" (0-100) to the target company: ${ticker}.

    **STRICT SOURCE REQUIREMENT**:
    - Use \`Google Search\` to find the latest data and news for ${ticker}.

    **OUTPUT FORMAT (CRITICAL)**:
    You MUST structure your response into TWO distinct parts to completely prevent JSON parsing errors.

    **PART 1: JSON METRICS**
    Provide the scores and summary strictly in valid JSON wrapped in a \`\`\`json code block. Do NOT include the detailed report in this JSON.
    \`\`\`json
    {
      "investment_score": {
        "total": 85,
        "breakdown": [
          { "category": "Fundamental Health", "score": 22, "max_score": 25, "reason": "Stable turnaround." },
          { "category": "Technical Trend", "score": 24, "max_score": 25, "reason": "Stage 3 markup." },
          { "category": "Valuation", "score": 15, "max_score": 25, "reason": "High P/E." },
          { "category": "Momentum", "score": 24, "max_score": 25, "reason": "Institutional buying." }
        ]
      },
      "verdict": "BUY",
      "executive_summary": "4 high-impact bullet points summarizing the core fundamental thesis."
    }
    \`\`\`

    **PART 2: DETAILED REPORT (MARKDOWN)**
    Immediately below the JSON block, write the 10-chapter Detailed Report in standard Markdown.
    - Provide deep, expansive analysis, analogies, and specific data points. (Aim for 150-200 words per chapter).
    - **Chapter 8**: Identify EMAs, Base Building, 4-Stage Cycle, and Bear Traps concisely.
    - **CRITICAL**: The output MUST be strictly in ENGLISH.

    # Table of Contents
    Prologue: Welcome to the World of Investing
    ## Chapter 1. Financial Health Checkup
    ## Chapter 2. Industry Analysis
    ## Chapter 3. Why This Company?
    ## Chapter 4. 10-K Breakdown
    ## Chapter 5. Business Model Analysis
    ## Chapter 6. Core Competitive Advantage
    ## Chapter 7. Top Catalysts
    ## Chapter 8. Technical Analysis: Smart Money Tracks 🎯
    ## Chapter 9. Potential Risks
    ## Chapter 10. Valuation
    [Outro] Epilogue: Investing with Conviction
    `;

  try {
    console.log(`Testing decouple architecture on gemini-2.5-flash...`);
    const currentModel = genAI.getGenerativeModel({ model: "gemini-2.5-flash", tools: [{ googleSearch: {} }] }, { apiVersion: "v1beta" });
    const result = await currentModel.generateContent(researchPrompt);
    const text = result.response.text();

    let jsonString = "";
    let finalMarkdown = "";

    // Safely extract the JSON block from the mixed response
    const jsonMatch = text.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/) || text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("No JSON block found in research response");
    }

    jsonString = jsonMatch[1] || jsonMatch[0];

    // Extract everything that IS NOT the JSON string to form the robust markdown body
    finalMarkdown = text.replace(jsonMatch[0], '').trim();

    const data = JSON.parse(jsonString);
    console.log("JSON PARSED SUCCESS:", Object.keys(data));
    console.log("MARKDOWN LENGTH:", finalMarkdown.length);
    console.log("MARKDOWN SNIPPET:", finalMarkdown.substring(0, 100).replace(/\n/g, '\\n'));
  } catch (e) {
    console.error(`Error:`, e);
  }
}
run();
