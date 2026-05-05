import crypto from 'crypto';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

function generateHmac(method, url, secretKey, accessKey) {
    const parts = url.split(/\?/);
    const [path, query = ''] = parts;

    let iso = new Date().toISOString().replace(/[:-]/g, '').replace(/\.\d{3}/, ''); // 20260430T004749Z
    const datetime = iso.substring(2, 8) + 'T' + iso.substring(9, 15) + 'Z';
    const message = datetime + method + path + query;

    const signature = crypto.createHmac('sha256', secretKey)
        .update(message)
        .digest('hex');

    return `CEA algorithm=HmacSHA256, access-key=${accessKey}, signed-date=${datetime}, signature=${signature}`;
}

async function test() {
    const accessKey = process.env.COUPANG_ACCESS_KEY;
    const secretKey = process.env.COUPANG_SECRET_KEY;
    
    const method = 'GET';
    const url = `/v2/providers/affiliate_open_api/apis/openapi/products/search?keyword=${encodeURIComponent('맥북')}&limit=1`;
    
    const authorization = generateHmac(method, url, secretKey, accessKey);
    console.log("Authorization:", authorization);

    const response = await fetch(`https://api-gateway.coupang.com${url}`, {
        method: 'GET',
        headers: {
            'Authorization': authorization,
            'Content-Type': 'application/json'
        }
    });

    const data = await response.json();
    console.log("Response:", JSON.stringify(data, null, 2));
}

test();
