const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');
require('dotenv').config({ path: '.env.local' });

async function listModels() {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const results = [];

    const models = [
        "gemini-1.5-flash",
        "gemini-1.5-flash-latest",
        "gemini-1.5-pro",
        "gemini-2.0-flash-exp",
        "gemini-2.0-flash", // recently released?
        "gemini-exp-1206"
    ];

    const versions = ["v1", "v1beta"];

    console.log("Starting checks...");

    for (const model of models) {
        for (const version of versions) {
            try {
                const m = genAI.getGenerativeModel({ model: model }, { apiVersion: version });
                await m.generateContent("Hi");
                results.push(`✅ ${model} (${version}) - WORKED`);
            } catch (e) {
                results.push(`❌ ${model} (${version}) - FAILED: ${e.message.split('[')[0].substring(0, 50)}...`);
            }
        }
    }

    fs.writeFileSync('model_check_results.txt', results.join('\n'));
    console.log("Done. Results saved to model_check_results.txt");
}

listModels();
