import { createClient } from "../../utils/supabase/server";
import Link from "next/link";
import { ArrowUpRight, Globe, TrendingUp, Calendar, Newspaper, BarChart3 } from "lucide-react";

export const metadata = {
    title: "BREAKAI_KR | 일일 마켓 브리핑",
    description: "매일 업데이트되는 한국 및 글로벌 증시 요약, 시장 주도 테마 및 AI 투자 인사이트 제공.",
};

export const dynamic = "force-dynamic";

export default async function BriefingPage() {
    const supabaseServer = await createClient();

    // Fetch recent market summaries from Supabase
    const { data: summaries, error } = await supabaseServer
        .from('market_summaries')
        .select('*')
        .order('date', { ascending: false })
        .limit(30);

    return (
        <div className="min-h-screen bg-zinc-950 text-slate-200 selection:bg-blue-500/30 font-sans">
            {/* Hero Section */}
            <div className="relative pt-24 pb-16 border-b border-white/5 bg-zinc-900/30 backdrop-blur-3xl overflow-hidden">
                <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>
                <div className="max-w-6xl mx-auto px-6 relative z-10">
                    <div className="inline-flex items-center gap-2 mb-8 bg-blue-500/10 text-blue-500 border border-blue-500/20 backdrop-blur-md px-4 py-2 rounded-full font-sans shadow-[0_0_20px_rgba(59,130,246,0.15)]">
                        <Globe className="w-3 h-3" />
                        <span className="font-bold text-xs tracking-wide">글로벌 마켓 인텔리전스</span>
                    </div>

                    <h1 className="text-4xl md:text-6xl font-black mb-5 tracking-tight text-white leading-tight font-sans">
                        일일 마켓 브리핑.<br className="hidden md:block" />
                        시장을 지배하는 데이터.
                    </h1>
                    <p className="text-lg md:text-xl text-zinc-400 max-w-3xl leading-relaxed mb-8 font-sans font-medium">
                        Wall Street 수준의 프랍 트레이딩 AI가 매일 한국 및 글로벌 주요 증시 데이터를 분석하여 장 마감 후 시장의 핵심 동인과 전진적 인사이트를 제공합니다. 소음은 줄이고 핵심만 파악하세요.
                    </p>
                </div>
            </div>

            {/* List Section */}
            <div className="max-w-6xl mx-auto px-6 py-16 relative z-10">

                {/* Stats / Headers Bar */}
                <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-10 pb-4 border-b border-white/5 gap-4">
                    <div className="flex items-center gap-3">
                        <Newspaper className="w-6 h-6 text-zinc-400" />
                        <h2 className="text-2xl font-black tracking-tighter text-white font-sans">브리핑 아카이브</h2>
                    </div>
                </div>

                {error && (
                    <div className="p-6 bg-red-950/30 text-red-500 border border-red-900/50 rounded-sm flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-red-900/50 flex items-center justify-center shrink-0">
                            <span className="text-xl">⚠️</span>
                        </div>
                        <div>
                            <h3 className="font-bold text-lg mb-1">시스템 오류</h3>
                            <p className="text-red-400/80">마켓 브리핑 데이터베이스에 연결하지 못했습니다.</p>
                        </div>
                    </div>
                )}

                {!error && (!summaries || summaries.length === 0) && (
                    <div className="h-64 border border-dashed border-zinc-800 rounded-sm flex flex-col items-center justify-center bg-[#0a0a0c]">
                        <BarChart3 className="w-12 h-12 text-zinc-700 mb-4" />
                        <h3 className="text-xl font-bold text-zinc-400 mb-2">데이터 대기 중</h3>
                        <p className="text-zinc-600 text-center max-w-md">아직 작성된 마켓 브리핑이 없습니다.</p>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {summaries && summaries.map((summary, i) => {
                        const isLatest = i === 0;
                        const dateObj = new Date(summary.date);
                        const formattedDate = dateObj.toLocaleDateString('ko-KR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            weekday: 'short'
                        });

                        const cleanTitle = summary.title.replace(/\*\*/g, '').trim();

                        return (
                            <Link href={`/briefing/${summary.id}`} key={summary.id} className="block group">
                                <div className={`relative flex flex-col h-full bg-[#0a0a0c] border transition-all duration-300 rounded-2xl overflow-hidden ${isLatest ? 'border-blue-500/50 shadow-[0_0_30px_rgba(59,130,246,0.1)] hover:border-blue-400' : 'border-zinc-800 hover:border-zinc-700'}`}>

                                    {isLatest && (
                                        <div className="absolute top-0 right-0 max-w-[200px] overflow-hidden">
                                            <div className="bg-blue-600/90 text-[10px] font-bold uppercase tracking-widest text-white py-1 px-8 translate-x-6 translate-y-3 rotate-45 shadow-lg backdrop-blur text-center">
                                                LATEST UPDATE
                                            </div>
                                        </div>
                                    )}

                                    {/* Date Header */}
                                    <div className={`p-4 border-b flex items-center gap-2 ${isLatest ? 'bg-blue-950/20 border-blue-900/30' : 'bg-zinc-900/50 border-zinc-900'}`}>
                                        <Calendar className={`w-4 h-4 ${isLatest ? 'text-blue-400' : 'text-zinc-500'}`} />
                                        <span className={`text-xs font-mono font-bold tracking-widest ${isLatest ? 'text-blue-300' : 'text-zinc-400'}`}>
                                            {formattedDate.toUpperCase()}
                                        </span>
                                    </div>

                                    {/* Body */}
                                    <div className="p-6 flex-1 flex flex-col justify-between">
                                        <div>
                                            <h3 className="text-xl font-bold text-white mb-3 leading-snug group-hover:text-blue-400 transition-colors font-sans line-clamp-3">
                                                {cleanTitle}
                                            </h3>

                                            {/* Preview Snippet */}
                                            <p className="text-sm text-zinc-500 line-clamp-4 leading-relaxed font-sans mb-6">
                                                {summary.content.replace(/[#*]/g, '').substring(0, 150)}...
                                            </p>
                                        </div>

                                        {/* View Button Footer */}
                                        <div className="flex justify-start items-center pt-4 border-t border-zinc-800/50">
                                            <span className="inline-flex items-center text-xs font-bold tracking-widest uppercase text-zinc-400 group-hover:text-white transition-colors">
                                                리포트 읽기
                                                <ArrowUpRight className="ml-2 w-4 h-4" />
                                            </span>
                                        </div>
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
