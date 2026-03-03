const fs = require('fs');
const path = require('path');

async function main() {
    try {
        const envPath = path.join(__dirname, '.env.local');
        const envContent = fs.readFileSync(envPath, 'utf8');
        const match = envContent.match(/GEMINI_API_KEY=(.+)/);
        const apiKey = match[1].trim();

        const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

        console.log("Fetching v1beta models...");
        const response = await fetch(url);

        if (!response.ok) {
            console.error(`Error Status: ${response.status} ${response.statusText}`);
            const text = await response.text();
            console.log(text);
        } else {
            const data = await response.json();
            console.log("Models in v1beta:", data.models ? data.models.length : 0);
            if (data.models) {
                // Filter for flash models
                data.models.filter(m => m.name.includes("flash")).forEach(m => console.log(`- ${m.name}`));
            }
        }

    } catch (e) {
        console.error("Fetch error:", e);
    }
}
main();
