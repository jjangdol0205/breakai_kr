import { NextResponse, NextRequest } from 'next/server';
import { createClient } from '../../../utils/supabase/server';

export async function POST(req: NextRequest) {
    try {
        const supabase = await createClient();

        // Check for authenticated user (optional, but we capture if available)
        const { data: { session } } = await supabase.auth.getSession();
        const userId = session?.user?.id || null;

        const body = await req.json();
        const { companyName, ticker } = body;

        // Basic validation
        if (!companyName || companyName.trim() === '') {
            return NextResponse.json({ error: '회사명 (종목명)은 필수입니다.' }, { status: 400 });
        }

        // Insert into database
        const { error } = await supabase
            .from('company_requests')
            .insert([
                {
                    company_name: companyName.trim(),
                    ticker: ticker ? ticker.trim().toUpperCase() : null,
                    user_id: userId,
                    status: 'pending'
                }
            ]);

        if (error) {
            console.error('Database insertion error:', error);
            return NextResponse.json({ error: '요청 제출에 실패했습니다.' }, { status: 500 });
        }

        return NextResponse.json({ success: true, message: '요청이 성공적으로 제출되었습니다.' }, { status: 200 });

    } catch (err: any) {
        console.error('Request processing error:', err);
        return NextResponse.json({ error: '내부 서버 오류' }, { status: 500 });
    }
}
