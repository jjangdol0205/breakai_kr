const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');
require('dotenv').config({ path: '.env.local' });

async function listModels() {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const results = [];

    const models = [
        "gemini-1.5-flash-001",
        "gemini-1.5-flash-002",
        "gemini-1.5-flash-8b",
        "gemini-1.5-pro-001",
        "gemini-1.5-pro-002",
        "gemini-1.0-pro" // fallback
    ];

    console.log("Starting checks v3...");

    // Try to use a known working model prompt
    for (const model of models) {
        console.log(`Testing ${model}...`);
        try {
            const m = genAI.getGenerativeModel({ model: model }, { apiVersion: 'v1beta' });
            const result = await m.generateContent("Hi");
            const response = await result.response;
            results.push(`✅ ${model} - WORKED: ${response.text().substring(0, 20)}...`);
        } catch (e) {
            results.push(`❌ ${model} - FAILED: ${e.message}`);
        }
    }

    fs.writeFileSync('model_check_results_v3.txt', results.join('\n'));
    console.log("Done.");
}

listModels();
