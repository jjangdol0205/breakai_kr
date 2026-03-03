import { supabase } from "../../lib/supabase";
import Link from "next/link";
import { getTickerByName } from "../../../utils/koreanStocks";
import { ArrowLeft, Activity, FileText } from "lucide-react";
import TradingViewWidget from "../../../components/TradingViewWidget";
import HubTabs from "../../components/HubTabs";
import ReportCard from "../../components/ReportCard";
import CompanyLogo from "../../../components/CompanyLogo";
import { getFinancialStatement } from "../../../utils/dartApi";
import FinancialTable from "../../components/FinancialTable";

// Ensure dynamic fetching so pricing/reports are fresh
export const revalidate = 0;

export default async function CompanyHubPage({ params }: { params: Promise<{ ticker: string }> }) {
    const { ticker: rawName } = await params;
    // URL 파라미터가 기업명입니다 (예: "삼성전자"). DB도 이 이름으로 저장됩니다.
    const companyName = decodeURIComponent(rawName);

    // 증권사 API 호출을 위한 실제 티커 추출
    const yfTicker = getTickerByName(companyName) || "005930.KS"; // 매핑 안되면 임시로 삼성전자로 Fallback

    // 1. Fetch all reports for this specific ticker (Fetch ALL columns to populate ReportCard)
    const { data: reports, error } = await supabase
        .from('reports')
        .select('*')
        .eq('ticker', companyName)
        .order('created_at', { ascending: false });

    // Separate newest research report from the rest
    const researchReports = (reports || []).filter(r => !r.report_type || r.report_type === "research");
    const earningsReports = (reports || []).filter(r => r.report_type === "earnings");

    const latestResearch = researchReports.length > 0 ? researchReports[0] : null;
    const archivedResearch = researchReports; // Show all reports in the archive tab, including the easiest one
    const archiveReportsForTabs = [...archivedResearch, ...earningsReports];

    let livePrice = 0;
    let changePercent = 0;

    // Analyst Consensus Data
    let targetMeanPrice = 0;
    let analystCount = 0;

    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${yfTicker}?interval=1d&range=1d`;
    const targetUrl = `https://query2.finance.yahoo.com/v10/finance/quoteSummary/${yfTicker}?modules=financialData`;

    try {
        const [res, targetRes] = await Promise.all([
            fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' }, next: { revalidate: 60 } }),
            fetch(targetUrl, { headers: { 'User-Agent': 'Mozilla/5.0' }, next: { revalidate: 3600 } })
        ]);

        if (res.ok) {
            const data = await res.json();
            const meta = data?.chart?.result?.[0]?.meta;
            if (meta) {
                livePrice = meta.regularMarketPrice;
                const prev = meta.chartPreviousClose;
                changePercent = ((livePrice - prev) / prev) * 100;
            }
        }

        if (targetRes.ok) {
            const targetData = await targetRes.json();
            const finData = targetData?.quoteSummary?.result?.[0]?.financialData;
            if (finData) {
                targetMeanPrice = finData.targetMeanPrice?.raw || 0;
                analystCount = finData.numberOfAnalystOpinions?.raw || 0;
            }
        }

    } catch (err) {
        console.error("Failed to fetch yahoo finance data strictly for hub:", err);
    }

    const isPositive = changePercent >= 0;
    const colorClass = isPositive ? "text-red-500" : "text-blue-500";

    // Analyst Upside Math
    let upsidePercent = 0;
    if (livePrice > 0 && targetMeanPrice > 0) {
        upsidePercent = ((targetMeanPrice - livePrice) / livePrice) * 100;
    }
    const isTargetPositive = upsidePercent >= 0;
    const targetColorClass = isTargetPositive ? "text-red-500" : "text-blue-500";

    // Open DART API Fetch
    const dartData = await getFinancialStatement(companyName);
    const financialTableData = dartData ? {
        "매출액 (Revenue)": dartData.revenue || "N/A",
        "영업이익 (O.P)": dartData.operatingProfit || "N/A",
        "당기순이익 (Net Income)": dartData.netIncome || "N/A",
        "분석 기준": dartData.year + "년도 재무제표 (Open DART)"
    } : null;

    return (
        <div className="max-w-6xl mx-auto mt-10 p-6 space-y-8 mb-20 font-sans">
            <Link href="/" className="flex items-center text-zinc-500 hover:text-white transition group font-sans text-sm tracking-wide font-medium">
                <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                대시보드로 돌아가기
            </Link>

            {/* TOP SECTION: Price & Chart Matrix */}
            <div className="bg-zinc-900/40 border border-white/5 rounded-3xl p-6 shadow-2xl relative overflow-hidden backdrop-blur-3xl">
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-red-500/10 rounded-full blur-[100px] pointer-events-none"></div>

                <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 relative z-10">
                    <div className="flex items-center gap-5">
                        <CompanyLogo
                            ticker={yfTicker.split('.')[0]}
                            className="w-20 h-20 rounded-2xl object-contain bg-white p-2 shadow-lg shrink-0"
                        />
                        <div>
                            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-2 font-sans">
                                {companyName}
                            </h1>
                            <p className="inline-flex items-center text-red-400 bg-red-500/10 border border-red-500/20 px-2.5 py-1 rounded-full font-sans text-xs font-bold tracking-wide shadow-sm">
                                <Activity className="w-3.5 h-3.5 mr-1" /> 검증된 최상위 주도 기업
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3">
                        {/* Current Market Price Block */}
                        <div className="text-left md:text-right bg-black/40 p-5 rounded-2xl border border-white/5 backdrop-blur-md relative overflow-hidden shadow-inner flex flex-col justify-center">
                            <div className={`absolute left-0 top-0 w-1.5 h-full ${isPositive ? 'bg-gradient-to-b from-red-400 to-red-600' : 'bg-gradient-to-b from-blue-400 to-blue-600'}`}></div>
                            <p className="text-[11px] text-zinc-400 tracking-wide font-bold mb-2 ml-3 font-sans uppercase">실시간 주가 (KRW)</p>
                            <div className="flex items-baseline md:justify-end gap-3 ml-3">
                                <h2 className="text-3xl md:text-4xl font-sans font-black text-white">
                                    {livePrice ? livePrice.toLocaleString('ko-KR') : "0"}원
                                </h2>
                                <span className={`font-sans text-lg font-black tracking-tight ${colorClass}`}>
                                    {isPositive ? "+" : ""}{changePercent ? changePercent.toFixed(2) : "0.00"}%
                                </span>
                            </div>
                        </div>

                        {/* Analyst Consensus Target Block */}
                        {targetMeanPrice > 0 && (
                            <div className="text-left md:text-right bg-indigo-950/20 p-5 rounded-2xl border border-indigo-500/10 backdrop-blur-md relative overflow-hidden group hover:bg-indigo-900/30 transition-colors shadow-inner flex flex-col justify-center">
                                <div className={`absolute left-0 top-0 w-1.5 h-full ${isTargetPositive ? 'bg-gradient-to-b from-red-400 to-red-600' : 'bg-gradient-to-b from-blue-400 to-blue-600'}`}></div>
                                <div className="flex items-center md:justify-end gap-2 mb-2 ml-3">
                                    <p className="text-[11px] text-indigo-300 tracking-wide font-bold font-sans uppercase">증권사 목표가 컨센서스</p>
                                    <span className="bg-indigo-900/40 border border-indigo-500/20 text-indigo-300 text-[10px] px-2 py-0.5 rounded-full font-sans font-bold shadow-sm">
                                        {analystCount}곳 평가
                                    </span>
                                </div>
                                <div className="flex items-baseline md:justify-end gap-3 ml-3">
                                    <h2 className="text-2xl font-sans font-black text-white">
                                        {targetMeanPrice.toLocaleString('ko-KR')}원
                                    </h2>
                                    <span className={`font-sans text-sm font-bold bg-black/40 px-2 py-1 rounded-md border border-white/5 ${targetColorClass}`}>
                                        {isTargetPositive ? "+" : ""}{upsidePercent.toFixed(2)}% 상승여력
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                </header>
            </div>

            {/* DART FUNDAMENTALS BLOCK */}
            {dartData && financialTableData && (
                <div className="mt-8 bg-zinc-900/40 border border-white/5 rounded-3xl p-6 shadow-2xl backdrop-blur-sm mb-12">
                    <h2 className="text-2xl font-black tracking-tight text-white mb-6 flex items-center gap-3 font-sans">
                        <span className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.1)]">
                            <FileText className="w-4 h-4 text-red-500" />
                        </span>
                        오픈다트(Open DART) 공식 재무 정보
                    </h2>
                    <FinancialTable data={financialTableData} isPro={true} />
                </div>
            )}

            {/* LATEST AI ANALYSIS (PROMINENT DISPLAY) */}
            {latestResearch ? (
                <div className="mt-12">
                    <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-3 font-sans">
                        <span className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.8)] animate-pulse"></span>
                        최신 AI 심층분석
                    </h2>
                    {/* Re-use our beautiful ReportCard component! */}
                    <ReportCard report={latestResearch} />
                </div>
            ) : (
                /* Securely Bound TradingView Widget Backup */
                <section className="mt-8 w-full h-[450px] rounded-xl overflow-hidden border border-zinc-800 bg-[#131722] shadow-inner relative z-10">
                    <div className="absolute top-4 left-4 z-20 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-zinc-700 shadow-lg">
                        <span className="text-[10px] text-red-500 font-sans font-bold tracking-widest">실시간 주가 차트</span>
                    </div>
                    {/* Render Widget */}
                    <div className="w-full h-full relative z-10">
                        <TradingViewWidget ticker={yfTicker} />
                    </div>
                </section>
            )}

            {/* MIDDLE SECTION: Interactive Tabs (Archive & Earnings) */}
            <div className="mt-16">
                <h2 className="text-2xl font-black text-white mb-6 font-sans">과거 리포트 및 실적 발표</h2>
                <HubTabs ticker={companyName} reports={archiveReportsForTabs} />
            </div>
        </div>
    );
}
