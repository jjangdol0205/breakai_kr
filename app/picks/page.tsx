import { createClient } from "../../utils/supabase/server";
import Link from "next/link";
import { ArrowUpRight, Cpu, Activity, TrendingUp, Presentation } from "lucide-react";
import { fetchLiveQuote } from "../../utils/yahooFinance";
import { getTickerByName, getNameByTicker } from "../../utils/koreanStocks";

export const metadata = {
    title: "BREAKAI_KR | 기관급 주식 스크리너",
    description: "매일 KOSPI 및 KOSDAQ 우량 주식을 스캔하여 최적의 기술적 돌파 종목을 찾습니다.",
};

export const dynamic = "force-dynamic";

export default async function PicksPage() {
    const supabaseServer = await createClient();

    // Fetch recent picks from Supabase
    const { data: picks, error } = await supabaseServer
        .from('oneil_picks')
        .select('*')
        .order('pick_date', { ascending: false })
        .limit(20);

    // Fetch live quotes for all picks in parallel
    const picksWithPrices = await Promise.all((picks || []).map(async (pick) => {
        const yfTicker = getTickerByName(pick.ticker) || pick.ticker;
        const livePrice = await fetchLiveQuote(yfTicker);
        let roi = null;
        if (livePrice && pick.picked_price) {
            roi = ((livePrice - pick.picked_price) / pick.picked_price) * 100;
        }
        return { ...pick, livePrice, roi };
    }));

    return (
        <div className="min-h-screen bg-zinc-950 text-slate-200 selection:bg-red-500/30 font-sans">
            {/* Hero Section */}
            <div className="relative pt-24 pb-16 border-b border-white/5 bg-zinc-900/30 backdrop-blur-3xl overflow-hidden">
                <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-red-500/10 rounded-full blur-[120px] pointer-events-none"></div>
                <div className="max-w-6xl mx-auto px-6 relative z-10">
                    <div className="inline-flex items-center gap-2 mb-8 bg-red-500/10 text-red-500 border border-red-500/20 backdrop-blur-md px-4 py-2 rounded-full font-sans shadow-[0_0_20px_rgba(239,68,68,0.15)]">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                        </span>
                        <span className="font-bold text-xs tracking-wide">실시간 스크리닝 매트릭스</span>
                    </div>

                    <h1 className="text-4xl md:text-6xl font-black mb-5 tracking-tight text-white leading-tight font-sans">
                        알고리즘이 선택한 <br className="hidden md:block" />
                        주도주 리포트.
                    </h1>
                    <p className="text-lg md:text-xl text-zinc-400 max-w-3xl leading-relaxed mb-8 font-sans font-medium">
                        자체 알고리즘이 매일 유동성이 높은 KOSPI 및 KOSDAQ 우량 주식을 스캔합니다. 심층적인 펀더멘털 분석을 바탕으로 가장 상승 확률이 높은 종목만을 정밀하게 식별합니다.
                    </p>
                </div>
            </div>

            {/* List Section */}
            <div className="max-w-6xl mx-auto px-6 py-16 relative z-10">

                {/* Stats / Headers Bar */}
                <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-10 pb-4 border-b border-white/5 gap-4">
                    <div className="flex items-center gap-3">
                        <Presentation className="w-6 h-6 text-zinc-400" />
                        <h2 className="text-2xl font-black tracking-tighter text-white font-sans">과거 핵심 픽 시그널</h2>
                    </div>
                    <div className="text-zinc-500 text-sm font-bold tracking-widest flex gap-6 font-sans">
                        <span className="flex items-center gap-1">분석 대상: 1000개 이상의 국내 주요 주식</span>
                    </div>
                </div>

                {error && (
                    <div className="p-6 bg-red-950/30 text-red-500 border border-red-900/50 rounded-sm flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-red-900/50 flex items-center justify-center shrink-0">
                            <span className="text-xl">⚠️</span>
                        </div>
                        <div>
                            <h3 className="font-bold text-lg mb-1">시스템 오류</h3>
                            <p className="text-red-400/80">시그널 데이터베이스에 연결하지 못했습니다.</p>
                        </div>
                    </div>
                )}

                {!error && picksWithPrices.length === 0 && (
                    <div className="h-64 border border-dashed border-zinc-800 rounded-sm flex flex-col items-center justify-center bg-[#0a0a0c]">
                        <Activity className="w-12 h-12 text-zinc-700 mb-4" />
                        <h3 className="text-xl font-bold text-zinc-400 mb-2">시그널 대기 중</h3>
                        <p className="text-zinc-600 text-center max-w-md">오늘 알고리즘이 검증된 기관의 돌파를 감지하지 못했습니다. 수량보다 품질이 우선입니다.</p>
                    </div>
                )}

                <div className="flex flex-col gap-4">
                    {picksWithPrices.map((pick, i) => {
                        let details = `Score: ${pick.oneil_score}`;
                        if (pick.technical_details && typeof pick.technical_details === 'object') {
                            const msg = (pick.technical_details as any).message;
                            details = msg || details;
                        }

                        // Top card styling
                        const isLatest = i === 0;

                        return (
                            <Link
                                key={pick.id}
                                href={`/picks/${pick.id}`}
                                className={`group flex flex-col md:flex-row items-start md:items-center justify-between p-7 rounded-2xl border transition-all duration-300 relative overflow-hidden backdrop-blur-sm ${isLatest
                                    ? "bg-zinc-900/60 border-red-500/20 shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:border-red-500/40 hover:shadow-[0_8px_40px_rgba(239,68,68,0.15)] hover:-translate-y-1"
                                    : "bg-zinc-900/20 border-white/5 hover:border-white/10 hover:bg-zinc-800/40 hover:-translate-y-1 hover:shadow-xl"
                                    }`}
                            >
                                {isLatest && <div className="absolute left-0 top-0 w-1.5 h-full bg-gradient-to-b from-red-400 to-red-600"></div>}

                                {/* Ticker and Date */}
                                <div className="flex items-center gap-6 md:w-1/4 mb-6 md:mb-0 relative z-10 w-full ml-2">
                                    <div className={`w-16 h-16 flex items-center justify-center rounded-xl font-sans font-black text-2xl shrink-0 shadow-inner ${isLatest ? "bg-red-500/10 text-red-500 border border-red-500/20" : "bg-zinc-800/50 text-zinc-400 border border-white/5"
                                        }`}>
                                        {pick.ticker.substring(0, 2)}
                                    </div>
                                    <div>
                                        {isLatest && <span className="text-red-500 text-[10px] font-bold tracking-wide mb-1.5 flex items-center gap-1 font-sans"><Activity className="w-3 h-3" /> 최신 픽업 종목</span>}
                                        <h3 className={`text-2xl md:text-3xl font-sans font-black tracking-tight leading-none mb-2 flex flex-wrap items-baseline gap-2 ${isLatest ? 'text-white' : 'text-zinc-200'} group-hover:text-white transition-colors`}>
                                            <span className="break-keep">{getNameByTicker(pick.ticker)}</span>
                                            <span className="text-sm md:text-lg text-zinc-500 font-mono tracking-wide hidden sm:inline-block">({pick.ticker.split('.')[0]})</span>
                                        </h3>
                                        <p className={`text-sm font-sans tracking-wide ${isLatest ? 'text-zinc-400' : 'text-zinc-500'}`}>
                                            {new Date(pick.pick_date).toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', year: 'numeric' })}
                                        </p>
                                    </div>
                                </div>

                                {/* Setup Details */}
                                <div className="md:flex-1 md:px-8 relative z-10 mb-6 md:mb-0 w-full">
                                    <div className="flex flex-wrap items-center gap-2 mb-3">
                                        <span className={`px-2.5 py-1 text-[11px] font-bold tracking-wide font-sans ${isLatest ? "bg-red-500/10 text-red-400 border border-red-500/20" : "bg-zinc-800/50 text-zinc-400 border border-white/5"} rounded-full shadow-sm`}>
                                            알고리즘 점수: {pick.oneil_score}/100
                                        </span>
                                    </div>
                                    <p className={`text-sm line-clamp-2 md:line-clamp-2 leading-relaxed font-sans font-medium ${isLatest ? 'text-zinc-300' : 'text-zinc-400'}`}>
                                        {details}
                                    </p>
                                </div>

                                {/* ROI Display */}
                                <div className={`md:w-auto relative z-10 w-full flex items-center justify-between md:justify-end gap-10 border-t md:border-none pt-5 md:pt-0 ${isLatest ? 'border-zinc-800/50' : 'border-white/5'}`}>
                                    <div className="text-left md:text-right hidden sm:block">
                                        <p className={`text-xs font-bold tracking-wide mb-1.5 font-sans ${isLatest ? 'text-zinc-400' : 'text-zinc-500'}`}>현재 수익률</p>
                                        <div className="flex items-baseline gap-2 justify-start md:justify-end">
                                            {pick.roi !== null ? (
                                                <>
                                                    <span className={`text-xl font-sans font-extrabold text-white`}>
                                                        ₩{pick.livePrice?.toLocaleString('ko-KR')}
                                                    </span>
                                                    <span className={`text-2xl font-sans font-black tracking-tight ${pick.roi >= 0 ? "text-red-500" : "text-blue-500"}`}>
                                                        {pick.roi > 0 ? "+" : ""}{pick.roi.toFixed(2)}%
                                                    </span>
                                                </>
                                            ) : (
                                                <span className={`text-xl font-sans font-bold ${isLatest ? 'text-zinc-500' : 'text-zinc-600'}`}>N/A</span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Action Button */}
                                    <div className={`flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-300 shadow-sm ${isLatest
                                        ? "bg-red-500 text-white shadow-red-500/30 group-hover:bg-red-600 group-hover:shadow-red-500/50"
                                        : "bg-zinc-800/50 border border-white/5 text-zinc-400 group-hover:bg-white/10 group-hover:text-white"
                                        }`}>
                                        <ArrowUpRight className="w-5 h-5" />
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
