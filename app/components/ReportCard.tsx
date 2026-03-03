"use client";

import { useState } from "react";
import InvestmentGauge from "./InvestmentGauge";
import ReactMarkdown from 'react-markdown';
import TradingViewWidget from "../../components/TradingViewWidget";
import FinancialTable from "./FinancialTable";

interface ReportCardProps {
    report: {
        id: number;
        ticker: string;
        investment_score?: number;
        risk_score?: number;
        verdict: string;
        one_line_summary: string;
        created_at: string;
        bull_case_summary?: string;
        bear_case_summary?: string;
        ceo_claim?: string;
        reality_check?: string;
        detailed_report?: string;
        financial_table?: any;
        analysis_text?: string;
    };
}

export default function ReportCard({ report }: ReportCardProps) {
    const [expanded, setExpanded] = useState(false);
    const [isScoreOpen, setIsScoreOpen] = useState(false);
    const score = report.investment_score ?? report.risk_score ?? 50;

    let scoreBreakdown: any[] = [];

    // First, try extracting from the detailed_report HTML comment
    if (report.detailed_report) {
        const match = report.detailed_report.match(/<!--\s*SCORE_BREAKDOWN:\s*(\{[\s\S]*?\})\s*-->/);
        if (match && match[1]) {
            try {
                const parsed = JSON.parse(match[1]);
                if (parsed && parsed.breakdown) {
                    scoreBreakdown = parsed.breakdown;
                }
            } catch (e) {
                console.error("Failed to parse SCORE_BREAKDOWN", e);
            }
        }
    }

    // Fallback: parse analysis_text directly if comment regex fails
    let parsedAnalysis: any = {};
    if (report.analysis_text) {
        try {
            parsedAnalysis = typeof report.analysis_text === 'string' ? JSON.parse(report.analysis_text) : report.analysis_text;
            if (scoreBreakdown.length === 0 && parsedAnalysis?.investment_score?.breakdown) {
                scoreBreakdown = parsedAnalysis.investment_score.breakdown;
            }
        } catch (e) {
            console.error("Failed to parse analysis_text", e);
        }
    }

    const bullCase = report.bull_case_summary || parsedAnalysis?.bull_case_summary || report.ceo_claim || parsedAnalysis?.ceo_claim || "No data available.";
    const bearCase = report.bear_case_summary || parsedAnalysis?.bear_case_summary || report.reality_check || parsedAnalysis?.reality_check || "No data available.";

    return (
        <div className="bg-zinc-900/40 border border-white/5 rounded-3xl overflow-hidden shadow-2xl font-sans mb-8 backdrop-blur-sm transition-all hover:border-white/10 hover:shadow-[0_8px_30px_rgb(0,0,0,0.2)]">
            {/* Header: Ticker & Badges */}
            <div className="flex justify-between items-center px-8 py-5 border-b border-white/5 bg-black/20">
                <div className="flex items-center gap-4">
                    <span className="text-3xl font-black text-white tracking-tight">{report.ticker}</span>
                    <span className="text-xs font-sans text-zinc-400 bg-zinc-800/50 px-3 py-1.5 rounded-full border border-white/5 shadow-inner">
                        {new Date(report.created_at).toLocaleDateString('ko-KR')}
                    </span>
                </div>
                <div className={`px-3 py-1 text-xs font-bold rounded-full tracking-wide ${report.verdict === 'BUY' ? 'bg-red-500/10 text-red-500 border border-red-500/20' :
                    report.verdict === 'SELL' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' :
                        'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'
                    }`}>
                    {report.verdict}
                </div>
            </div>

            {/* Bento Grid Layout */}
            <div className="p-8 grid grid-cols-1 md:grid-cols-12 gap-8">

                {/* 1. Top Left: Investment Gauge (Span 4) */}
                <div
                    className="md:col-span-4 bg-black/40 rounded-2xl border border-white/5 p-6 flex flex-col items-center justify-center relative min-h-[220px] cursor-pointer hover:border-white/10 transition-colors group shadow-inner"
                    onClick={() => setIsScoreOpen(true)}
                >
                    <InvestmentGauge score={score} />
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity text-[11px] font-bold tracking-wide text-zinc-400 bg-zinc-800 px-3 py-1.5 rounded-full shadow-lg">
                        상세 분석 보기 ↗
                    </div>
                </div>

                {/* Score Modal Overlay */}
                {isScoreOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
                        <div className="bg-zinc-900 border border-white/10 rounded-3xl p-8 w-full max-w-xl shadow-2xl relative">
                            <button
                                onClick={(e) => { e.stopPropagation(); setIsScoreOpen(false); }}
                                className="absolute top-6 right-6 text-zinc-400 hover:text-white"
                            >
                                ✕
                            </button>
                            <h3 className="text-2xl font-black text-white mb-8">투자 매력도 상세 점수</h3>

                            {scoreBreakdown.length > 0 ? (
                                <div className="space-y-5">
                                    {scoreBreakdown.map((item, idx) => (
                                        <div key={idx} className="bg-black/40 border border-white/5 rounded-2xl p-5 shadow-inner">
                                            <div className="flex justify-between items-center mb-3">
                                                <h4 className="font-bold text-zinc-100 tracking-wide">{item.category}</h4>
                                                <span className={`font-sans text-lg font-black tracking-tight ${item.score >= (item.max_score * 0.7) ? 'text-red-500' : item.score <= (item.max_score * 0.4) ? 'text-blue-500' : 'text-yellow-500'}`}>
                                                    {item.score} <span className="text-zinc-500 text-sm font-medium">/ {item.max_score}</span>
                                                </span>
                                            </div>
                                            {/* Progress Bar */}
                                            <div className="w-full bg-zinc-800 h-2.5 rounded-full mb-4 overflow-hidden shadow-inner">
                                                <div
                                                    className={`h-full rounded-full ${item.score >= (item.max_score * 0.7) ? 'bg-gradient-to-r from-red-500 to-red-400' : item.score <= (item.max_score * 0.4) ? 'bg-gradient-to-r from-blue-500 to-blue-400' : 'bg-gradient-to-r from-yellow-500 to-yellow-400'}`}
                                                    style={{ width: `${(item.score / item.max_score) * 100}%` }}
                                                ></div>
                                            </div>
                                            <p className="text-sm text-zinc-400 leading-relaxed font-medium">
                                                {item.reason}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12 text-zinc-500 font-medium">
                                    이 리포트에 대한 세부 데이터가 없습니다.
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* 2. Top Right: Analyst Summary (Span 8) */}
                <div className="md:col-span-8 bg-black/40 rounded-2xl border border-white/5 p-8 flex flex-col justify-center shadow-inner">
                    <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3">수석 애널리스트 1줄 요약</h4>
                    <p className="text-zinc-100 text-xl font-semibold leading-relaxed tracking-tight">
                        {report.one_line_summary}
                    </p>
                </div>

                {/* 3. Middle: Chart (Span 12) */}
                <div className="md:col-span-12 h-[450px] bg-black/40 rounded-2xl border border-white/5 overflow-hidden relative shadow-inner">
                    <TradingViewWidget ticker={report.ticker} />
                </div>

                {/* 4. Bottom Split: Bull vs Bear (Span 6 each) */}
                <div className="md:col-span-6 bg-red-500/5 rounded-2xl border border-red-500/10 p-8 relative overflow-hidden group shadow-inner">
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-red-500 to-transparent opacity-50"></div>
                    <h4 className="text-red-500 font-bold mb-4 flex items-center gap-2 text-lg tracking-wide">
                        <span className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]"></span>
                        강세 시나리오
                    </h4>
                    <p className="text-zinc-300 text-[15px] leading-relaxed font-medium">
                        {bullCase}
                    </p>
                </div>

                <div className="md:col-span-6 bg-blue-500/5 rounded-2xl border border-blue-500/10 p-8 relative overflow-hidden group shadow-inner">
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-500 to-transparent opacity-50"></div>
                    <h4 className="text-blue-500 font-bold mb-4 flex items-center gap-2 text-lg tracking-wide">
                        <span className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]"></span>
                        약세 시나리오 (리스크 요인)
                    </h4>
                    <p className="text-zinc-300 text-[15px] leading-relaxed font-medium">
                        {bearCase}
                    </p>
                </div>

                {/* 5. Financials (Span 12) */}
                {report.financial_table && (
                    <div className="md:col-span-12">
                        <FinancialTable data={report.financial_table} />
                    </div>
                )}

            </div>

        </div >
    );
}
