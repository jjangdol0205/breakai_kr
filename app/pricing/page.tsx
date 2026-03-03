import { Check, X, Shield, Zap, TrendingUp } from "lucide-react";
import Link from "next/link";

export const metadata = {
    title: "Pricing | Breakout AI",
    description: "Upgrade to Breakout AI Pro for Institutional Level Research.",
};

export default function PricingPage() {
    return (
        <div className="max-w-6xl mx-auto py-24 px-6 font-sans selection:bg-[#FF3333]/30">
            {/* Header Section */}
            <div className="text-center mb-20 relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#FF3333]/10 rounded-full blur-[120px] pointer-events-none -z-10"></div>
                <div className="inline-flex items-center gap-2 mb-6 bg-red-950/30 text-[#FF3333] border border-[#FF3333]/30 px-5 py-2 rounded-full shadow-[0_0_15px_rgba(0,255,65,0.15)]">
                    <span className="w-2 h-2 rounded-full bg-[#FF3333] animate-pulse"></span>
                    <span className="font-bold text-xs tracking-widest uppercase font-mono">액세스 요금제 선택</span>
                </div>
                <h1 className="text-5xl md:text-6xl font-black mb-6 tracking-tighter text-white">
                    기관급 데이터, <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF3333] to-emerald-600">압도적인 프리미엄.</span>
                </h1>
                <p className="text-xl text-zinc-400 max-w-2xl mx-auto font-mono leading-relaxed">
                    월스트리트가 의존하는 퀀트 시그널에 독점적으로 접근하세요.<br />
                    글로벌 주식 시장에서 당신만의 강력한 엣지를 확보하십시오.
                </p>
            </div>

            {/* Pricing Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch relative z-10">

                {/* Tier 1: Daily */}
                <div className="bg-[#0a0a0c] border border-zinc-800 rounded-2xl p-8 relative flex flex-col hover:border-zinc-700 transition-colors group">
                    <div className="absolute inset-0 bg-gradient-to-br from-zinc-800/10 to-transparent rounded-2xl pointer-events-none"></div>
                    <h3 className="text-2xl font-bold text-white mb-3 tracking-tight font-mono uppercase">일일권 (Daily)</h3>
                    <p className="text-zinc-500 text-sm mb-8 font-mono">오늘 최고의 비대칭 돌파매매 셋업 1개에 대한 24시간 접근권.</p>
                    <div className="mb-8 flex items-baseline">
                        <span className="text-5xl font-black text-white font-mono">$9.99</span>
                        <span className="text-zinc-500 ml-2 font-mono uppercase tracking-widest text-xs">/ Day</span>
                    </div>
                    <Link href="/api/checkout/daily" className="block w-full text-center bg-zinc-900 border border-zinc-700 hover:bg-zinc-800 hover:border-zinc-500 text-white font-bold py-4 rounded-xl transition-all mb-10 text-xs uppercase tracking-[0.2em] group-hover:shadow-[0_0_20px_rgba(255,255,255,0.05)]">
                        24시간 이용권 결제
                    </Link>
                    <ul className="space-y-5 text-sm text-zinc-400 font-mono mt-auto pt-8 border-t border-zinc-900">
                        <li className="flex items-start gap-3"><Check className="text-[#FF3333] w-5 h-5 shrink-0 mt-0.5" /> <span className="leading-snug">오늘의 1순위 기관 타겟 종목</span></li>
                        <li className="flex items-start gap-3"><Check className="text-[#FF3333] w-5 h-5 shrink-0 mt-0.5" /> <span className="leading-snug">심층 펀더멘털 분석 리포트</span></li>
                        <li className="flex items-start gap-3"><Check className="text-[#FF3333] w-5 h-5 shrink-0 mt-0.5" /> <span className="leading-snug">기술적 DMA 돌파 레벨 공유</span></li>
                        <li className="flex items-start gap-3 text-zinc-700"><X className="w-5 h-5 shrink-0 mt-0.5" /> <span className="leading-snug line-through">과거 추천 종목 아카이브 접근</span></li>
                        <li className="flex items-start gap-3 text-zinc-700"><X className="w-5 h-5 shrink-0 mt-0.5" /> <span className="leading-snug line-through">프리마켓 SMS 알림 지원</span></li>
                    </ul>
                </div>

                {/* Tier 2: Monthly (Highlighted) */}
                <div className="bg-[#050505] border-2 border-[#FF3333]/40 rounded-2xl p-8 relative flex flex-col transform lg:-translate-y-6 shadow-[0_0_50px_rgba(0,255,65,0.05)] hover:shadow-[0_0_80px_rgba(0,255,65,0.1)] transition-shadow">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#FF3333] text-black px-6 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase shadow-[0_0_20px_rgba(0,255,65,0.4)] whitespace-nowrap">
                        <Zap className="w-3 h-3 inline-block mr-1.5 -mt-0.5" /> 기관 표준 모델
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-b from-[#FF3333]/5 to-transparent rounded-2xl pointer-events-none"></div>

                    <h3 className="text-3xl font-black text-[#FF3333] mb-3 tracking-tight uppercase font-mono mt-2">Pro 월간 구독</h3>
                    <p className="text-zinc-400 text-sm mb-8 font-mono">매일 확실한 시그널 제공. 하루 1달러의 비용으로 포트폴리오를 보호하세요.</p>
                    <div className="mb-8 flex items-baseline">
                        <span className="text-6xl font-black text-white font-mono">$29.99</span>
                        <span className="text-zinc-500 ml-2 font-mono uppercase tracking-widest text-xs">/ Month</span>
                    </div>
                    <Link href="/api/checkout/monthly" className="block w-full text-center bg-[#FF3333] hover:bg-[#FF3333]/80 text-black font-black py-4 rounded-xl transition-all mb-10 shadow-[0_0_20px_rgba(0,255,65,0.2)] hover:shadow-[0_0_30px_rgba(0,255,65,0.4)] text-xs uppercase tracking-[0.2em]">
                        월간 구독 시작하기
                    </Link>
                    <ul className="space-y-5 text-sm font-mono mt-auto pt-8 border-t border-zinc-800">
                        <li className="flex items-start gap-3 text-white"><Check className="text-[#FF3333] w-5 h-5 shrink-0 mt-0.5 drop-shadow-[0_0_8px_rgba(0,255,65,0.8)]" /> <span className="leading-snug font-bold">일일권의 모든 기능 포함</span></li>
                        <li className="flex items-start gap-3 text-zinc-300"><Check className="text-[#FF3333] w-5 h-5 shrink-0 mt-0.5" /> <span className="leading-snug">과거 추천 종목 아카이브 무제한 열람</span></li>
                        <li className="flex items-start gap-3 text-zinc-300"><Check className="text-[#FF3333] w-5 h-5 shrink-0 mt-0.5" /> <span className="leading-snug">실시간 추천 수익률(ROI) 자동 트래킹</span></li>
                        <li className="flex items-start gap-3 text-white"><Check className="text-[#FF3333] w-5 h-5 shrink-0 mt-0.5 drop-shadow-[0_0_8px_rgba(0,255,65,0.8)]" /> <span className="leading-snug font-bold">프리마켓 이메일 & SMS 알림 서비스</span></li>
                        <li className="flex items-start gap-3 text-white"><Check className="text-[#FF3333] w-5 h-5 shrink-0 mt-0.5 drop-shadow-[0_0_8px_rgba(0,255,65,0.8)]" /> <span className="leading-snug font-bold">최우선 알고리즘 딥 데이터 열람권</span></li>
                    </ul>
                </div>

                {/* Tier 3: Yearly */}
                <div className="bg-[#0a0a0c] border border-zinc-800 rounded-2xl p-8 relative flex flex-col hover:border-zinc-700 transition-colors group">
                    <div className="absolute top-4 right-4 bg-red-950/40 text-[#FF3333] px-4 py-1.5 rounded-full text-[10px] font-black border border-[#FF3333]/20 uppercase tracking-widest shadow-lg">
                        16% 절약
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-bl from-zinc-800/10 to-transparent rounded-2xl pointer-events-none"></div>

                    <h3 className="text-2xl font-bold text-white mb-3 tracking-tight uppercase font-mono">Pro 연간 구독</h3>
                    <p className="text-zinc-500 text-sm mb-8 font-mono pr-12">장기 자본 펀딩을 위한 최고의 선택. 2개월의 비용을 아끼세요.</p>
                    <div className="mb-8 flex flex-col justify-center h-[72px]">
                        <span className="text-zinc-600 line-through text-xs mb-1 font-mono tracking-widest inline-block">$359.88</span>
                        <div className="flex items-baseline">
                            <span className="text-5xl font-black text-white font-mono">$299.99</span>
                            <span className="text-zinc-500 ml-2 font-mono uppercase tracking-widest text-xs">/ Year</span>
                        </div>
                    </div>
                    <Link href="/api/checkout/yearly" className="block w-full text-center bg-zinc-900 border border-zinc-700 hover:bg-zinc-800 hover:border-zinc-500 text-white font-bold py-4 rounded-xl transition-all mb-10 text-xs uppercase tracking-[0.2em] group-hover:shadow-[0_0_20px_rgba(255,255,255,0.05)]">
                        연간 구독 시작하기
                    </Link>
                    <ul className="space-y-5 text-sm text-zinc-400 font-mono mt-auto pt-8 border-t border-zinc-900">
                        <li className="flex items-start gap-3 text-white"><Check className="text-[#FF3333] w-5 h-5 shrink-0 mt-0.5" /> <span className="leading-snug font-bold">Pro 월간 구독의 모든 혜택</span></li>
                        <li className="flex items-start gap-3"><Check className="text-[#FF3333] w-5 h-5 shrink-0 mt-0.5" /> <span className="leading-snug">다운로드 가능한 PDF 리서치 자료</span></li>
                        <li className="flex items-start gap-3"><Check className="text-[#FF3333] w-5 h-5 shrink-0 mt-0.5" /> <span className="leading-snug">VIP 다이렉트 고객 지원 시스템</span></li>
                        <li className="flex items-start gap-3 opacity-0 hidden lg:block"><Check className="w-5 h-5 shrink-0 mt-0.5" /> <span className="leading-snug">Spacer</span></li>
                    </ul>
                </div>

            </div>

            {/* Security & Support Footer */}
            <div className="mt-32 text-center pt-8 border-t border-zinc-900">
                <p className="text-zinc-500 text-xs flex items-center justify-center gap-3 font-mono uppercase tracking-widest">
                    <Shield className="w-4 h-4 text-[#FF3333]/70" /> 안전하게 암호화된 기관 결제 시스템 지원 <strong className="text-white hover:text-[#FF3333] transition-colors cursor-pointer">Lemon Squeezy</strong>.
                </p>
            </div>
        </div>
    );
}
