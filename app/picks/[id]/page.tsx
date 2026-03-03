import { createClient } from "../../../utils/supabase/server";
import Link from "next/link";
import { ArrowLeft, Lock, TrendingUp, Cpu, Activity, ShieldAlert, BarChart, FileText } from "lucide-react";
import { notFound } from "next/navigation";
import ReactMarkdown from 'react-markdown';
import remarkBreaks from 'remark-breaks';
import { fetchLiveQuote } from "../../../utils/yahooFinance";
import TradingViewWidget from "../../../components/TradingViewWidget";
import PickDetailUI from "../../components/PickDetailUI";

export const dynamic = "force-dynamic";

export default async function PickDetail({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const supabaseServer = await createClient();

    // Fetch pick from Supabase
    const { data: pick, error } = await supabaseServer
        .from('oneil_picks')
        .select('*')
        .eq('id', id)
        .single();

    if (error || !pick) {
        notFound();
    }

    // Check if the current user is the admin to bypass the paywall
    const { data: { session } } = await supabaseServer.auth.getSession();
    const isAdmin = session?.user?.email === "beable9489@gmail.com";

    // Query profiles table for matching user
    let isDbPro = false;
    if (session?.user?.id) {
        const { data: profile } = await supabaseServer
            .from('profiles')
            .select('is_pro')
            .eq('id', session.user.id)
            .single();
        if (profile?.is_pro) isDbPro = true;
    }

    // Regular Paywall logic + Admin Bypass - TEMPORARILY OPEN FOR PREVIEW REVIEWS
    const isProUser = true; // isAdmin || isDbPro || false;

    // Fetch live quote for ROI
    const livePrice = await fetchLiveQuote(pick.ticker);
    let roi = null;
    if (livePrice && pick.picked_price) {
        roi = ((livePrice - pick.picked_price) / pick.picked_price) * 100;
    }

    let details = pick.technical_details;
    if (typeof details === 'string') {
        try { details = JSON.parse(details); } catch (e) { }
    }

    return (
        <div className="max-w-4xl mx-auto mt-10 p-6 space-y-8 mb-20 font-sans selection:bg-red-500/30 text-slate-200">
            <Link href="/picks" className="flex items-center text-zinc-500 hover:text-red-400 font-semibold text-xs tracking-widest uppercase transition group w-fit">
                <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                터미널로 돌아가기
            </Link>

            {/* TOP SECTION: Price & Chart Matrix (Hub Style) */}
            <div className="bg-[#111] border border-[#333] rounded-2xl p-6 shadow-2xl relative overflow-hidden mt-4">
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none"></div>

                <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-2 relative z-10">
                    <div className="flex items-center gap-5">
                        <div className="w-20 h-20 rounded-full bg-slate-900 flex items-center justify-center border-2 border-slate-700 shadow-xl">
                            <BarChart className="text-blue-500 w-10 h-10" />
                        </div>
                        <div>
                            <h1 className="text-5xl font-black tracking-tighter text-white mb-1">
                                {pick.ticker}
                            </h1>
                            <p className="text-blue-400 flex items-center font-mono text-xs font-bold tracking-widest uppercase mb-1">
                                <Activity className="w-3 h-3 mr-1" /> 기관 시그널 #{pick.id.split('-')[0]}
                            </p>
                            <p className="text-slate-500 text-xs font-mono uppercase tracking-widest mt-1">
                                생성일: {new Date(pick.pick_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3">
                        {/* Current Market Price Block */}
                        <div className="text-left md:text-right bg-black/50 p-4 rounded-xl border border-zinc-800 backdrop-blur-sm relative overflow-hidden min-w-[200px]">
                            <div className={`absolute left-0 top-0 w-1 h-full ${roi !== null && roi >= 0 ? 'bg-[#FF3333]' : 'bg-blue-500'}`}></div>
                            <div className="flex justify-between items-center md:block">
                                <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mb-1 ml-2 font-mono">현재가</p>
                            </div>
                            {roi !== null ? (
                                <div className="flex flex-col md:items-end justify-center ml-2">
                                    <div className="flex items-baseline gap-2 mb-1">
                                        <span className="text-4xl font-black font-mono tracking-tight text-white">
                                            ${livePrice?.toFixed(2)}
                                        </span>
                                        <span className={`text-lg font-mono font-bold ${roi >= 0 ? "text-[#FF3333]" : "text-blue-500"}`}>
                                            {roi > 0 ? "+" : ""}{roi.toFixed(2)}%
                                        </span>
                                    </div>
                                    <p className="text-zinc-500 text-xs font-mono uppercase tracking-widest">
                                        진입가: ${Number(pick.picked_price).toFixed(2)}
                                    </p>
                                </div>
                            ) : (
                                <span className="text-sm font-bold text-slate-500 ml-2">데이터 수집 중...</span>
                            )}
                        </div>

                        {/* Algo Confidence Block */}
                        <div className="text-left md:text-right bg-blue-950/20 p-4 rounded-xl border border-blue-900/50 backdrop-blur-sm relative overflow-hidden">
                            <div className="absolute left-0 top-0 w-1 h-full bg-blue-500"></div>
                            <div className="flex items-center md:justify-end gap-2 mb-1 ml-2">
                                <p className="text-[10px] text-blue-400 uppercase tracking-widest font-bold">알고리즘 신뢰도 점수</p>
                            </div>
                            <div className="flex items-baseline md:justify-end gap-3 ml-2 mt-1">
                                <h2 className="text-2xl font-black text-white font-mono">
                                    {pick.oneil_score}
                                </h2>
                                <span className="font-mono text-sm font-bold bg-[#111] px-2 py-0.5 rounded border border-zinc-800 text-slate-300">
                                    / 100
                                </span>
                            </div>
                        </div>
                    </div>
                </header>
            </div>

            <PickDetailUI pick={pick} isProUser={isProUser} roi={roi} />
        </div>
    );
}
