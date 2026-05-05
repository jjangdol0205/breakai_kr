import { NextResponse } from 'next/server';
import crypto from 'crypto';

function generateHmac(method: string, url: string, secretKey: string, accessKey: string) {
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

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const keyword = searchParams.get('keyword') || '노트북';
        const limit = searchParams.get('limit') || '4';

        const accessKey = process.env.COUPANG_ACCESS_KEY;
        const secretKey = process.env.COUPANG_SECRET_KEY;

        if (!accessKey || !secretKey) {
            return NextResponse.json({ error: 'Coupang API keys not configured' }, { status: 500 });
        }

        // Search products API: GET /v2/providers/affiliate_open_api/apis/openapi/products/search
        const method = 'GET';
        const url = `/v2/providers/affiliate_open_api/apis/openapi/products/search?keyword=${encodeURIComponent(keyword)}&limit=${limit}`;
        
        const authorization = generateHmac(method, url, secretKey, accessKey);

        const response = await fetch(`https://api-gateway.coupang.com${url}`, {
            method: 'GET',
            headers: {
                'Authorization': authorization,
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();
        
        if (data.rCode === '0') {
            return NextResponse.json({ products: data.data.productData });
        } else {
            console.error("Coupang API Error:", data);
            return NextResponse.json({ error: data.rMessage || 'Coupang API error' }, { status: 500 });
        }
    } catch (error: any) {
        console.error("Coupang Route Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
