const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config({ path: '.env.local' });

async function listModels() {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    try {
        console.log("Fetching models...");
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // Dummy init to get properly authorized client if needed, though listModels is on genAI usually? 
        // Actually listModels is often directly on the client or via a specific manager, but SDK specific.
        // In @google/generative-ai, it is implicit or we just try a few known ones.

        // For this SDK, there isn't a direct "listModels" helper exposed easily in the main class in all versions.
        // Let's just try to generate with a few candidates and see which one doesn't throw 404.

        const candidates = [
            "gemini-1.5-flash",
            "gemini-1.5-flash-latest",
            "gemini-1.5-pro",
            "gemini-1.5-pro-latest",
            "gemini-2.0-flash-exp",
            "gemini-1.0-pro"
        ];

        for (const modelName of candidates) {
            console.log(`Testing ${modelName}...`);
            try {
                const m = genAI.getGenerativeModel({ model: modelName }, { apiVersion: 'v1beta' });
                await m.generateContent("Hello");
                console.log(`✅ ${modelName} WORKED on v1beta`);
            } catch (e) {
                console.log(`❌ ${modelName} FAILED on v1beta: ${e.message.split('[')[0]}`); // Shorten error
            }
        }

    } catch (error) {
        console.error("Fatal:", error);
    }
}

listModels();
