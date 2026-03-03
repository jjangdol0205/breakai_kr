require('dotenv').config({ path: '.env.local' });
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const AdmZip = require('adm-zip');
const xml2js = require('xml2js');

const API_KEY = process.env.DART_API_KEY;
if (!API_KEY) {
    console.error("DART_API_KEY is not defined in .env.local");
    process.exit(1);
}

const TEMP_ZIP_PATH = path.join(__dirname, '../utils/corpcode.zip');
const EXTRACT_PATH = path.join(__dirname, '../utils');
const JSON_OUTPUT_PATH = path.join(__dirname, '../utils/dartCorpCodes.json');

async function downloadCorpCodes() {
    console.log("Downloading DART Corp Codes...");

    // Download zip file
    const url = `https://opendart.fss.or.kr/api/corpCode.xml?crtfc_key=${API_KEY}`;
    const response = await axios({
        method: 'get',
        url: url,
        responseType: 'arraybuffer'
    });

    fs.writeFileSync(TEMP_ZIP_PATH, response.data);
    console.log("Downloaded ZIP file.");

    // Extract
    const zip = new AdmZip(TEMP_ZIP_PATH);
    zip.extractAllTo(EXTRACT_PATH, true);
    console.log("Extracted CORPCODE.xml.");

    // Parse XML
    const xmlPath = path.join(EXTRACT_PATH, 'CORPCODE.xml');
    const xmlData = fs.readFileSync(xmlPath, 'utf-8');

    const parser = new xml2js.Parser({ explicitArray: false });
    const result = await parser.parseStringPromise(xmlData);

    const list = result.result.list;
    const corpMap = {};
    const fullList = [];

    let listedCount = 0;

    for (const item of list) {
        if (item.stock_code && item.stock_code.trim() !== '') {
            const cleanName = item.corp_name.trim();
            corpMap[cleanName] = {
                corp_code: item.corp_code,
                stock_code: item.stock_code
            };
            listedCount++;
        }
    }

    fs.writeFileSync(JSON_OUTPUT_PATH, JSON.stringify(corpMap, null, 2), 'utf-8');

    console.log(`Saved JSON mapping to ${JSON_OUTPUT_PATH}`);
    console.log(`Total Listed Companies Extracted: ${listedCount}`);

    // Cleanup
    fs.unlinkSync(TEMP_ZIP_PATH);
    fs.unlinkSync(xmlPath);
    console.log("Cleaned up temporary files.");
}

downloadCorpCodes().catch(console.error);
