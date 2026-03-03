const { GoogleGenerativeAI, DynamicRetrievalMode } = require("@google/generative-ai");
const fs = require('fs');
const path = require('path');

async function main() {
    try {
        const envPath = path.join(__dirname, '.env.local');
        const envContent = fs.readFileSync(envPath, 'utf8');
        const match = envContent.match(/GEMINI_API_KEY=(.+)/);
        const apiKey = match[1].trim();

        const genAI = new GoogleGenerativeAI(apiKey);

        const tools = [
            {
                googleSearchRetrieval: {}
            },
        ];

        const model = genAI.getGenerativeModel({
            model: "gemini-2.0-flash",
            tools: tools
        }, { apiVersion: "v1beta" });

        const prompt = "What is the latest stock price of Apple?";

        console.log("Testing Search Grounding...");
        const result = await model.generateContent(prompt);
        const response = await result.response;
        console.log("Response:", response.text());

        // Check if grounding metadata exists (if accessible via log, though here we just want to ensure no error)
        console.log("Grounding Metadata:", JSON.stringify(result.response.candidates[0].groundingMetadata, null, 2));

    } catch (error) {
        console.error("Verification Failed Message:", error.message);
        console.error("Verification Failed Details:", JSON.stringify(error, null, 2));
    }
}

main();
