import { NextResponse } from 'next/server';
import { createClient } from '../../../utils/supabase/server';
import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function POST(req: Request) {
    try {
        const { email, source } = await req.json();

        if (!email || !email.includes('@')) {
            return NextResponse.json({ error: '유효하지 않은 이메일 주소입니다.' }, { status: 400 });
        }

        const supabase = await createClient();

        // 1. Insert into leads table (which allows anonymous inserts via RLS)
        const { error } = await supabase
            .from('leads')
            .insert([{ email, source: source || 'unknown' }]);

        if (error) {
            // Handle duplicate emails gracefully (unique constraint violation usually code 23505)
            if (error.code === '23505') {
                return NextResponse.json({ message: '이미 구독 중입니다' }, { status: 200 });
            }
            console.error('Error inserting lead:', error);
            return NextResponse.json({ error: '구독에 실패했습니다.' }, { status: 500 });
        }

        // 2. Automated Email Delivery (Day 1 Welcome Sequence)
        if (resend) {
            try {
                // Ensure you verify a domain in Resend to send from a custom address, 
                // otherwise 'onboarding@resend.dev' works for testing to the registered email only.
                const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
                await resend.emails.send({
                    from: 'BreakAI <onboarding@resend.dev>',
                    to: email,
                    subject: '[BreakAI] 환영합니다 📉 (요청하신 PDF 파일입니다)',
                    html: `
                        <div style="font-family: sans-serif; color: #111;">
                            <h2>BreakAI에 오신 것을 환영합니다.</h2>
                            <p>구독해 주셔서 감사합니다. 저희는 월스트리트의 내러티브를 파헤쳐 시장의 진정한 펀더멘털을 확인할 수 있게 해줍니다.</p>
                            
                            <hr style="border: 1px solid #eee; margin: 20px 0;" />
                            
                            <h3>🎁 즉시 다운로드</h3>
                            <p>약속드린 대로, 2026년 고성장 AI 주식 Top 10에 대한 독점 리포트를 보내드립니다.</p>
                            <a href="${SITE_URL}/docs/top-10-ai-stocks-2026.pdf" style="display: inline-block; padding: 12px 24px; background-color: #10b981; color: white; text-decoration: none; border-radius: 6px; font-weight: bold;">지금 PDF 다운로드</a>
                            
                            <hr style="border: 1px solid #eee; margin: 20px 0;" />
                            
                            <p>기관의 대량 매도 전에 저희 AI 모델이 어떻게 시장의 괴리 트렌드를 포착하는지에 대한 심층 분석을 내일 메일함에서 확인해 보세요.</p>
                            <p>감사합니다.<br><strong>BreakAI 팀 드림</strong></p>
                            <p style="font-size: 11px; color: #666; margin-top: 30px;">이 메일은 귀하가 당사 웹사이트에서 구독을 신청하셨기 때문에 발송되었습니다.</p>
                        </div>
                    `
                });
                console.log(`Welcome email triggered to ${email}`);
            } catch (emailErr) {
                console.error('Failed to send welcome email via Resend:', emailErr);
                // We don't fail the whole request just because email failed, they are still a lead
            }
        } else {
            console.warn("RESEND_API_KEY not found. Skipping welcome email delivery.");
        }

        return NextResponse.json({ message: '성공적으로 구독되었습니다' }, { status: 200 });

    } catch (err: any) {
        console.error('Lead capture error:', err);
        return NextResponse.json({ error: '내부 서버 오류' }, { status: 500 });
    }
}
