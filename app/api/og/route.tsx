import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        
        const title = searchParams.get('title') || 'Breakout AI - 데이터 기반 시장 분석';
        const ticker = searchParams.get('ticker') || 'MARKET';
        const score = searchParams.get('score') || 'N/A';
        const verdict = searchParams.get('verdict') || 'ANALYSIS';

        let verdictColor = '#aaaaaa';
        let bgColorStart = 'rgba(100, 100, 100, 0.2)';
        
        if (verdict === 'BUY') {
            verdictColor = '#ef4444';
            bgColorStart = 'rgba(239, 68, 68, 0.2)';
        } else if (verdict === 'SELL') {
            verdictColor = '#3b82f6';
            bgColorStart = 'rgba(59, 130, 246, 0.2)';
        } else if (verdict === 'HOLD') {
            verdictColor = '#eab308';
            bgColorStart = 'rgba(234, 179, 8, 0.2)';
        }

        return new ImageResponse(
            (
                <div
                    style={{
                        height: '100%',
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#050505',
                        backgroundImage: `radial-gradient(circle at 50% 120%, ${bgColorStart} 0%, rgba(0, 0, 0, 1) 100%)`,
                        border: '8px solid #1a1a1a',
                        padding: '40px',
                        fontFamily: 'sans-serif',
                    }}
                >
                    {/* Top Row: Ticker and Verdict */}
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '40px', gap: '30px' }}>
                        <div style={{
                            fontSize: '130px',
                            fontWeight: '900',
                            color: 'white',
                            letterSpacing: '-0.05em',
                            textShadow: '0 10px 30px rgba(0,0,0,0.5)'
                        }}>
                            {ticker}
                        </div>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '15px 40px',
                            backgroundColor: 'rgba(255,255,255,0.05)',
                            borderRadius: '100px',
                            fontSize: '45px',
                            fontWeight: 'bold',
                            color: verdictColor,
                            border: `3px solid ${verdictColor}`,
                            boxShadow: `0 0 30px ${bgColorStart}`
                        }}>
                            {verdict}
                        </div>
                    </div>

                    {/* Middle: Title/Summary */}
                    <div style={{
                        fontSize: '65px',
                        color: 'white',
                        fontWeight: 'bold',
                        textAlign: 'center',
                        marginBottom: '80px',
                        lineHeight: '1.3',
                        maxWidth: '90%',
                        wordWrap: 'break-word',
                    }}>
                        {title}
                    </div>

                    {/* Bottom: Score and Branding */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: '0 40px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontSize: '32px', color: '#888', marginBottom: '5px', letterSpacing: '0.1em' }}>AI ANALYSIS SCORE</span>
                            <div style={{ display: 'flex', alignItems: 'baseline' }}>
                                <span style={{ fontSize: '90px', color: 'white', fontWeight: '900' }}>{score}</span>
                                <span style={{ fontSize: '40px', color: '#555', marginLeft: '5px', fontWeight: 'bold' }}>/100</span>
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <span style={{ fontSize: '45px', fontWeight: '900', color: '#ff3333', letterSpacing: '-0.05em' }}>BREAKOUT AI</span>
                        </div>
                    </div>
                </div>
            ),
            {
                width: 1200,
                height: 630,
            }
        );
    } catch (e) {
        return new Response('Failed to generate image', { status: 500 });
    }
}
