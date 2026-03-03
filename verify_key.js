const https = require('https');
const fs = require('fs');
require('dotenv').config({ path: '.env.local' });

const apiKey = process.env.GEMINI_API_KEY;
console.log("Testing API Key:", apiKey ? "Present" : "Missing");

const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

https.get(url, (res) => {
    let data = '';

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        if (res.statusCode === 200) {
            try {
                const json = JSON.parse(data);
                const modelNames = json.models.map(m => m.name).join('\n');
                fs.writeFileSync('available_models.txt', modelNames);
                console.log("Models saved to available_models.txt");
            } catch (e) {
                console.log("Error parsing JSON:", e);
            }
        } else {
            console.log("Error Response:", data);
            fs.writeFileSync('available_models.txt', "ERROR: " + data);
        }
    });

}).on("error", (err) => {
    console.log("Error: " + err.message);
});
