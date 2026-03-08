"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Lock, FileText, BarChart2, ShieldAlert, Activity, Cpu } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import remarkBreaks from 'remark-breaks';
import TradingViewWidget from "../../components/TradingViewWidget";
import ScoreGauge from "../../components/ScoreGauge";

// Custom Typewriter Effect for AI Reports
const TypewriterMarkdown = ({ content, speed = 10 }: { content: string, speed?: number }) => {
    const [displayedContent, setDisplayedContent] = useState('');

    useEffect(() => {
        let i = 0;
        setDisplayedContent('');
        const timer = setInterval(() => {
            if (i < content.length) {
                setDisplayedContent(prev => prev + content.charAt(i));
                i++;
            } else {
                clearInterval(timer);
            }
        }, speed);
        return () => clearInterval(timer);
    }, [content, speed]);

    return (
        <ReactMarkdown remarkPlugins={[remarkBreaks]}>
            {displayedContent + (displayedContent.length < content.length ? '...' : '')}
        </ReactMarkdown>
    );
};

interface PickDetailUIProps {
    pick: any; // The record from oneil_picks
    isProUser: boolean;
    roi: number | null;
}

export default function PickDetailUI({ pick, isProUser, roi }: PickDetailUIProps) {
    const [activeTab, setActiveTab] = useState<"technical" | "fundamental">("fundamental");

    // Attempt to parse AI Report String into JSON + Markdown
    let reportData = { json_data: null as any, markdown: "" };
    if (pick.ai_report) {
        let parsedPayload: any = {};
        try {
            parsedPayload = JSON.parse(pick.ai_report);
        } catch (e) { }

        reportData.markdown = parsedPayload.markdown || pick.ai_report;
        reportData.json_data = parsedPayload.json_data || null;

        // Extract the JSON block for the score breakdown if not natively parsed
        if (!reportData.json_data && reportData.markdown) {
            const jsonMatch = reportData.markdown.match(/```json\s*(\{[\s\S]*?\})\s*```/);
            if (jsonMatch) {
                try {
                    reportData.json_data = JSON.parse(jsonMatch[1]);
                } catch (e) {
                    console.error("Failed to parse AI JSON block", e);
                }
            }
        }
    }

    const { json_data, markdown } = reportData;
    const scoreObj = json_data?.investment_score || { total: pick.oneil_score || 50, breakdown: [] };

    // Determine color based on risk_score (acts as investment score)
    let scoreColor = "text-zinc-500";
    if (scoreObj.total >= 80) scoreColor = "text-[#FF3333]";
    else if (scoreObj.total <= 30) scoreColor = "text-blue-500";
    else scoreColor = "text-yellow-500";

    // Extract basic Technical details
    let details = pick.technical_details;
    if (typeof details === 'string') {
        try { details = JSON.parse(details); } catch (e) { }
    }

    // Attempt to extract live Price from ROI data, assuming roi is provided relative to picked_price
    let livePrice = null;
    if (roi !== null && pick.picked_price) {
        livePrice = Number(pick.picked_price) * (1 + (roi / 100));
    }

    return (
        <div className="w-full">
            {/* Tab Navigation */}
            <div className="flex border-b border-[#333] mt-12 mb-8 bg-[#09090b] rounded-t-xl overflow-hidden">
                <button
                    onClick={() => setActiveTab("fundamental")}
                    className={`flex-1 p-5 text-sm md:text-base font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-colors ${activeTab === "fundamental" ? "bg-zinc-900 border-b-2 border-[#FF3333] text-[#FF3333]" : "text-zinc-500 hover:text-white hover:bg-zinc-900/50 border-b-2 border-transparent"}`}
                >
                    <FileText className="w-5 h-5" />
                    <span className="hidden sm:inline">기관급</span> 심층 리포트
                </button>
                <button
                    onClick={() => setActiveTab("technical")}
                    className={`flex-1 p-5 text-sm md:text-base font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-colors ${activeTab === "technical" ? "bg-zinc-900 border-b-2 border-[#FF3333] text-[#FF3333]" : "text-zinc-500 hover:text-white hover:bg-zinc-900/50 border-b-2 border-transparent"}`}
                >
                    <BarChart2 className="w-5 h-5" />
                    기술적 설정 검증
                </button>
            </div>

            {/* TAB CONTENT: FUNDAMENTAL */}
            {activeTab === "fundamental" && (
                <div className="space-y-8 animate-in fade-in duration-500 bg-[#0a0a0c] p-6 rounded-b-xl border border-t-0 border-[#333]">
                    {/* Top Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-zinc-900/50 p-6 rounded-xl border border-zinc-800 md:col-span-2 flex flex-col justify-center relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-[50px]"></div>
                            <h3 className="text-zinc-500 font-bold mb-4 flex items-center gap-2 text-sm tracking-widest uppercase font-mono relative z-10">
                                <Cpu className="w-4 h-4 text-red-500 animate-pulse" />
                                Breakout AI 실시간 추론 결과
                            </h3>
                            <div className="flex items-end gap-4 relative z-10">
                                <p className={`text-4xl md:text-5xl font-black ${scoreColor} tracking-tighter`}>
                                    {json_data?.verdict || "강력 매수"}
                                </p>
                            </div>

                            {/* Visual Progress Bar instead of Radar Chart for simplicity & elegance */}
                            <div className="mt-6 space-y-3 relative z-10">
                                <div>
                                    <div className="flex justify-between text-xs font-mono text-zinc-400 mb-1">
                                        <span>종합 AI 스코어</span>
                                        <span className="text-white">{scoreObj.total}/100</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                                        <div className="h-full bg-red-500 rounded-full transition-all duration-1000 ease-out" style={{ width: `${scoreObj.total}%` }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="w-full md:w-auto flex justify-center scale-90 md:scale-100 origin-left relative z-20">
                            <ScoreGauge scoreObj={scoreObj} scoreColor={scoreColor} />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Executive Bull Case Block */}
                        <div className="bg-red-950/20 rounded-xl border border-emerald-900/50 p-6 shadow-sm">
                            <h4 className="text-[#FF3333] font-bold mb-3 flex items-center gap-2 text-sm tracking-widest uppercase font-mono">
                                <span className="w-2 h-2 rounded-full bg-[#FF3333] animate-pulse"></span>
                                강세 시나리오
                            </h4>
                            <p className="text-emerald-100/80 text-sm leading-relaxed font-mono">
                                {json_data?.bull_case_summary || "강력한 펀더멘털을 바탕으로 기관 매집 물량이 증가하고 있습니다."}
                            </p>
                        </div>

                        {/* Executive Bear Case Block */}
                        <div className="bg-blue-950/20 rounded-xl border border-rose-900/50 p-6 shadow-sm">
                            <h4 className="text-blue-500 font-bold mb-3 flex items-center gap-2 text-sm tracking-widest uppercase font-mono">
                                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                                약세 시나리오
                            </h4>
                            <p className="text-rose-100/80 text-sm leading-relaxed font-mono">
                                {json_data?.bear_case_summary || "거시 경제 수축으로 인해 단기적으로 영업 이익률이 압박받을 수 있습니다."}
                            </p>
                        </div>
                    </div>

                    {/* Fundamental Report Without Paywall */}
                    <div className="mt-8 transition-all">
                        <div className="bg-black/80 rounded-2xl border border-[#222] p-8 md:p-14 shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#FF3333]/5 rounded-full blur-[150px] pointer-events-none"></div>
                            <div className="prose prose-invert prose-lg max-w-none relative z-10
                                        prose-headings:font-black prose-headings:tracking-tighter 
                                        prose-h1:text-5xl prose-h1:text-white prose-h1:mb-12 prose-h1:border-b-2 prose-h1:border-[#333] prose-h1:pb-6
                                        prose-h2:text-3xl prose-h2:text-[#FF3333] prose-h2:mt-16 prose-h2:mb-6 prose-h2:uppercase prose-h2:tracking-widest
                                        prose-h3:text-2xl prose-h3:text-white prose-h3:mt-10 prose-h3:mb-4
                                        prose-h4:text-xl prose-h4:text-zinc-300
                                        prose-p:leading-loose prose-p:text-zinc-400 prose-p:mb-6 prose-p:text-base md:prose-p:text-lg
                                        prose-strong:text-white prose-strong:font-bold
                                        prose-li:text-zinc-400 prose-li:mb-2 prose-li:leading-relaxed
                                        prose-ul:my-8 prose-ol:my-8
                                        prose-hr:border-[#222] prose-hr:my-12
                                        prose-blockquote:border-l-4 prose-blockquote:border-[#FF3333] prose-blockquote:bg-red-950/20 prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:font-mono prose-blockquote:text-red-400 prose-blockquote:text-sm
                                    ">
                                {markdown ? (
                                    <TypewriterMarkdown
                                        content={markdown.includes('<!-- FUNDAMENTAL_REPORT -->')
                                            ? markdown.split('<!-- TECHNICAL_REPORT -->')[0].replace('<!-- FUNDAMENTAL_REPORT -->', '').replace(/```json[\\s\\S]*?```/, '')
                                            : markdown.replace(/```json[\\s\\S]*?```/, '')}
                                        speed={5}
                                    />
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-20 opacity-50">
                                        <div className="w-12 h-12 border-4 border-[#FF3333]/20 border-t-[#FF3333] rounded-full animate-spin mb-4"></div>
                                        <p className="text-zinc-400 font-mono tracking-widest uppercase text-sm">알파 창출 중...</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* TAB CONTENT: TECHNICAL */}
            {activeTab === "technical" && (
                <div className="space-y-8 animate-in fade-in duration-500 bg-[#0a0a0c] p-6 rounded-b-xl border border-t-0 border-[#333]">
                    <section className="bg-zinc-900/50 p-6 md:p-8 rounded-2xl border border-zinc-800 relative overflow-hidden shadow-xl">
                        <div className="absolute left-0 top-0 w-1 h-full bg-[#FF3333]"></div>
                        <h3 className="text-[#FF3333] font-bold text-xs mb-3 flex items-center tracking-widest uppercase font-mono">
                            <span className="w-2 h-2 bg-[#FF3333] rounded-full mr-3 animate-pulse"></span>
                            알고리즘 설정 상세
                        </h3>
                        <p className="text-lg text-zinc-300 leading-relaxed font-mono">
                            {details?.message || "전체 AI 리포트에 집계된 기술적 세부 정보입니다."}
                        </p>
                    </section>

                    <section className="w-full h-[700px] rounded-2xl overflow-hidden border border-zinc-800 bg-black relative pt-16 pb-2 px-2 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                        <div className="absolute top-4 left-4 z-10 bg-zinc-900/90 backdrop-blur-md px-4 py-2 rounded-lg border border-zinc-700 shadow-lg">
                            <span className="text-xs text-[#FF3333] font-bold font-mono uppercase tracking-widest flex items-center">
                                <Activity className="w-4 h-4 mr-2 animate-pulse" /> 실시간 기관급 차트
                            </span>
                        </div>
                        <div className="w-full h-full border border-zinc-900 rounded-xl overflow-hidden ring-1 ring-white/5">
                            <TradingViewWidget ticker={pick.ticker} />
                        </div>
                    </section>

                    {/* Detailed Technical Report Without Paywall */}
                    {markdown && markdown.includes('<!-- TECHNICAL_REPORT -->') && (
                        <div className="mt-8 bg-black/80 rounded-2xl border border-[#222] p-8 md:p-14 shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#FF3333]/5 rounded-full blur-[150px] pointer-events-none"></div>
                            <div className="prose prose-invert prose-lg max-w-none relative z-10
                                                prose-headings:font-black prose-headings:tracking-tighter 
                                                prose-h1:text-5xl prose-h1:text-white prose-h1:mb-12 prose-h1:border-b-2 prose-h1:border-[#333] prose-h1:pb-6
                                                prose-h2:text-3xl prose-h2:text-[#FF3333] prose-h2:mt-16 prose-h2:mb-6 prose-h2:uppercase prose-h2:tracking-widest
                                                prose-h3:text-2xl prose-h3:text-white prose-h3:mt-10 prose-h3:mb-4
                                                prose-h4:text-xl prose-h4:text-zinc-300
                                                prose-p:leading-loose prose-p:text-zinc-400 prose-p:mb-6 prose-p:text-base md:prose-p:text-lg
                                                prose-strong:text-white prose-strong:font-bold
                                                prose-li:text-zinc-400 prose-li:mb-2 prose-li:leading-relaxed
                                                prose-ul:my-8 prose-ol:my-8
                                                prose-hr:border-[#222] prose-hr:my-12
                                                prose-blockquote:border-l-4 prose-blockquote:border-[#FF3333] prose-blockquote:bg-red-950/20 prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:font-mono prose-blockquote:text-red-400 prose-blockquote:text-sm
                                            ">
                                <ReactMarkdown remarkPlugins={[remarkBreaks]}>
                                    {markdown.split('<!-- TECHNICAL_REPORT -->')[1]}
                                </ReactMarkdown>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
