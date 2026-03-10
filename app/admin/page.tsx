"use client";

import { useState, useEffect } from "react";
import { Search, Upload, AlertTriangle, Loader2, Trash2, Database, ShieldAlert, Folder, FolderOpen, ChevronRight, FileText, TrendingUp, Calendar, Users, Star, UserCircle, BadgeCheck, MessageSquare, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { analyzeTicker } from "../actions";
import TerminalLoader from "../components/TerminalLoader";
import { createClient } from "../../utils/supabase/client";

export default function AdminPage() {
    const router = useRouter();
    const supabase = createClient();
    const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

    const [ticker, setTicker] = useState("");
    const [reportType, setReportType] = useState<"research" | "earnings">("research");
    const [quarter, setQuarter] = useState("Q4 2025");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState("");

    // For reports list
    const [reports, setReports] = useState<any[]>([]);
    const [fetchingReports, setFetchingReports] = useState(true);
    const [openFolders, setOpenFolders] = useState<Record<string, boolean>>({});

    // For O'Neil Picks
    const [oneilPicks, setOneilPicks] = useState<any[]>([]);
    const [fetchingOneil, setFetchingOneil] = useState(true);
    const [runningScreener, setRunningScreener] = useState(false);

    // For Daily Briefing
    const [runningBriefing, setRunningBriefing] = useState(false);

    // For user management
    const [profiles, setProfiles] = useState<any[]>([]);
    const [fetchingProfiles, setFetchingProfiles] = useState(true);

    // For Daily Briefing Management
    const [briefings, setBriefings] = useState<any[]>([]);
    const [fetchingBriefings, setFetchingBriefings] = useState(true);
    const [editingBriefingId, setEditingBriefingId] = useState<string | null>(null);
    const [editBriefingTitle, setEditBriefingTitle] = useState("");
    const [editBriefingContent, setEditBriefingContent] = useState("");

    // For company requests
    const [companyRequests, setCompanyRequests] = useState<any[]>([]);
    const [fetchingRequests, setFetchingRequests] = useState(true);

    const toggleFolder = (t: string) => {
        setOpenFolders(prev => ({ ...prev, [t]: !prev[t] }));
    };

    const fetchReports = async () => {
        setFetchingReports(true);
        const { data, error } = await supabase
            .from('reports')
            .select('id, ticker, risk_score, created_at, report_type, quarter')
            .order('created_at', { ascending: false });

        if (!error && data) {
            setReports(data);
        }
        setFetchingReports(false);

        // Fetch O'Neil Picks
        setFetchingOneil(true);
        const { data: opData } = await supabase
            .from('oneil_picks')
            .select('*')
            .order('pick_date', { ascending: false });
        if (opData) setOneilPicks(opData);
        setFetchingOneil(false);
    };

    useEffect(() => {
        // Enforce Admin Security (Temporarily Bypassed for Local Admin during AdSense Prep)
        const checkAuth = async () => {
            // const { data: { session } } = await supabase.auth.getSession();
            // const email = session?.user?.email;

            // Allowing all access to Admin temporarily since the Login UI is hidden
            setIsAuthorized(true);
            fetchReports();

            // Fetch Users
            setFetchingProfiles(true);
            try {
                const res = await fetch('/api/admin/users');
                const data = await res.json();
                if (data.users) setProfiles(data.users);
            } catch (e) {
                console.error("Failed to fetch users");
            }
            setFetchingProfiles(false);

            // Fetch Company Requests
            setFetchingRequests(true);
            try {
                const { data: reqData } = await supabase
                    .from('company_requests')
                    .select('id, company_name, ticker, status, created_at')
                    .order('created_at', { ascending: false });
                if (reqData) setCompanyRequests(reqData);
            } catch (e) {
                console.error("Failed to fetch company requests", e);
            }
            setFetchingRequests(false);

            // Fetch Market Briefings
            setFetchingBriefings(true);
            try {
                const { data: briefData } = await supabase
                    .from('market_summaries')
                    .select('id, date, title, content, created_at')
                    .order('created_at', { ascending: false });
                if (briefData) setBriefings(briefData);
            } catch (e) {
                console.error("Failed to fetch briefings", e);
            }
            setFetchingBriefings(false);
        };

        checkAuth();
    }, [router]);

    // Don't render the dashboard until auth is resolved completely
    if (isAuthorized === null) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black text-red-500">
                <Loader2 className="w-10 h-10 animate-spin" />
            </div>
        );
    }

    if (isAuthorized === false) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center bg-black text-blue-500 space-y-4">
                <ShieldAlert className="w-20 h-20" />
                <h1 className="text-4xl font-black uppercase tracking-widest">Access Denied</h1>
                <p className="text-zinc-400">Your email address is not authorized for server-level access.</p>
                <p className="text-zinc-600 text-sm animate-pulse">Redirecting to public zone...</p>
            </div>
        );
    }

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this report?")) return;

        const { error } = await supabase
            .from('reports')
            .delete()
            .eq('id', id);

        if (!error) {
            fetchReports(); // Refresh the list
        } else {
            console.error("Failed to delete report", error);
            alert("삭제 실패 (Delete failed): \nSupabase Row Level Security (RLS) 정책 때문일 가능성이 높습니다. Supabase 대시보드에서 'reports' 테이블의 Delete 권한 정책을 허용하거나 RLS를 활성화/수정해주세요.");
        }
    };

    const handleDeleteOneil = async (id: string) => {
        if (!confirm("Are you sure you want to delete this O'Neil Pick?")) return;
        const { error } = await supabase.from('oneil_picks').delete().eq('id', id);
        if (!error) fetchReports();
        else alert("Failed to delete O'Neil Pick");
    };

    const handleRunScreener = async () => {
        setRunningScreener(true);
        setResult("");
        try {
            const res = await fetch('/api/admin/run-screener', { method: 'POST' });
            const data = await res.json();
            setResult(data.message || data.error || "Screener Finished");
            fetchReports();
        } catch (e: any) {
            setResult("Failed to trigger screener: " + e.message);
        } finally {
            setRunningScreener(false);
        }
    };

    const handleRunBriefing = async () => {
        setRunningBriefing(true);
        setResult("마켓 브리핑을 생성하는 중입니다... (1~2분 소요 예정)");
        try {
            const res = await fetch('/api/admin/run-briefing', { method: 'POST' });
            const data = await res.json();
            if (data.error) {
                setResult("Failed to generate briefing: " + data.error);
            } else if (data.message) {
                setResult(data.message); // If it says "Skipped: already exists"
            } else {
                setResult("✅ 마켓 브리핑 생성이 완료되었습니다: " + data.title);
            }
        } catch (e: any) {
            setResult("Failed to trigger briefing: " + e.message);
        } finally {
            setRunningBriefing(false);
        }
    };

    const handleDeleteRequest = async (id: string) => {
        if (!confirm("Are you sure you want to delete this company request?")) return;

        const { error } = await supabase
            .from('company_requests')
            .delete()
            .eq('id', id);

        if (!error) {
            setCompanyRequests(prev => prev.filter(r => r.id !== id));
        } else {
            console.error("Failed to delete request", error);
            alert("삭제 실패: 권한 문제일 수 있습니다. (SQL Editor에서 추가한 Delete Policy 실행 필요)");
        }
    };

    const handleEditBriefingOpen = (briefing: any) => {
        setEditingBriefingId(briefing.id);
        setEditBriefingTitle(briefing.title || "");
        setEditBriefingContent(briefing.content || "");
    };

    const handleUpdateBriefing = async () => {
        if (!editingBriefingId) return;
        if (!confirm("Are you sure you want to save these changes to the Daily Market Briefing?")) return;

        const { error } = await supabase
            .from('market_summaries')
            .update({
                title: editBriefingTitle,
                content: editBriefingContent
            })
            .eq('id', editingBriefingId);

        if (!error) {
            setBriefings(prev => prev.map(b => b.id === editingBriefingId ? { ...b, title: editBriefingTitle, content: editBriefingContent } : b));
            setEditingBriefingId(null);
            alert("✅ Briefing updated successfully.");
        } else {
            console.error("Failed to update briefing", error);
            alert("업데이트 실패: " + error.message);
        }
    };

    const handleDeleteBriefing = async (id: string) => {
        if (!confirm("Are you sure you want to completely delete this market briefing?")) return;

        const { error } = await supabase
            .from('market_summaries')
            .delete()
            .eq('id', id);

        if (!error) {
            setBriefings(prev => prev.filter(b => b.id !== id));
        } else {
            console.error("Failed to delete briefing", error);
            alert("삭제 실패: " + error.message);
        }
    };

    const handleAnalyze = async () => {
        if (!ticker) return;
        if (reportType === "earnings" && !quarter) {
            alert("Please enter a specific quarter (e.g. Q4 2025) for earnings reports.");
            return;
        }

        setLoading(true);
        setResult(""); // Reset result

        try {
            const aiResponse = await analyzeTicker(ticker, reportType, quarter);

            if (aiResponse.startsWith("Error:")) {
                setResult(aiResponse);
            } else {
                setResult(aiResponse + "\n\n[System] Saved to DB ✅");
                fetchReports(); // Refresh the list after successful creation
            }
        } catch (e) {
            setResult("Error occurred.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto mt-10 space-y-8 p-4 font-sans text-gray-100 mb-20">
            {/* Header */}
            <div className="flex items-center space-x-4 mb-8">
                <h1 className="text-3xl font-bold text-[#FF3333]">ADMIN_DASHBOARD</h1>
                <span className="bg-gray-800 text-xs px-2 py-1 rounded border border-gray-600">INTERNAL ONLY</span>
            </div>

            {/* Main Action Section: Generator */}
            <div className="bg-[#111] p-6 border border-[#333] rounded-xl space-y-6 shadow-2xl">
                <h2 className="text-xl font-bold flex items-center text-white">
                    <Upload className="w-5 h-5 mr-2 text-[#FF3333]" />
                    Initialize New Analysis
                </h2>

                {/* Screener Generation */}
                <div className="flex flex-col gap-4">
                    <p className="text-zinc-400 text-sm mb-2">하단 버튼을 클릭하면 KOSPI/KOSDAQ 상장 기업 중 최적의 패턴을 스캔하고, 가장 조건에 부합하는 기업에 대한 AI 리서치 리포트를 자동으로 작성합니다.</p>

                    <div className="flex flex-col md:flex-row gap-4">
                        <button
                            onClick={handleRunScreener}
                            disabled={runningScreener || runningBriefing}
                            className="w-full md:w-auto text-white bg-blue-600 hover:bg-blue-500 font-bold px-8 py-4 rounded-lg disabled:opacity-50 flex items-center justify-center transition-all hover:scale-[1.02] active:scale-95 whitespace-nowrap font-mono"
                        >
                            {runningScreener ? <Loader2 className="animate-spin mr-2 w-5 h-5" /> : <TrendingUp className="w-5 h-5 mr-2" />}
                            {runningScreener ? "스캔 중..." : "일일 스크리너 실행"}
                        </button>

                        <button
                            onClick={handleRunBriefing}
                            disabled={runningScreener || runningBriefing}
                            className="w-full md:w-auto text-white bg-green-600 hover:bg-green-500 font-bold px-8 py-4 rounded-lg disabled:opacity-50 flex items-center justify-center transition-all hover:scale-[1.02] active:scale-95 whitespace-nowrap font-mono"
                        >
                            {runningBriefing ? <Loader2 className="animate-spin mr-2 w-5 h-5" /> : <FileText className="w-5 h-5 mr-2" />}
                            {runningBriefing ? "생성 중..." : "일일 마켓 브리핑 생성"}
                        </button>
                    </div>
                </div>
            </div>

            {/* AI Output Terminal */}
            <div className={`bg-black border border-[#333] rounded-xl p-6 transition-all duration-500 font-mono text-sm shadow-inner shadow-gray-900 ${loading || result ? 'block opacity-100 min-h-[300px]' : 'hidden opacity-0 h-0 pointer-events-none'}`}>
                <div className="text-gray-500 border-b border-[#333] pb-3 mb-4 flex justify-between tracking-widest text-xs font-bold">
                    <span>AI_VERDICT_OUTPUT</span>
                    <span className={`text-[#FF3333] ${loading ? 'animate-pulse' : ''}`}>{loading ? "● LIVE" : "● READY"}</span>
                </div>

                {loading ? (
                    <div className="flex justify-center p-12">
                        <TerminalLoader />
                    </div>
                ) : result.startsWith("Error") ? (
                    <div className="text-red-400 whitespace-pre-line bg-red-950/20 p-4 border border-red-900 rounded">{result}</div>
                ) : result ? (
                    <div className="w-full">
                        <div className="p-4 bg-[#111] border border-[#333] rounded mb-4">
                            <h3 className="text-[#FF3333] font-bold mb-4">ANALYSIS PREVIEW</h3>
                            {(() => {
                                try {
                                    const analysisStr = result.split("\\n\\n[System]")[0]; // remove saved tag before parse
                                    const analysis = JSON.parse(analysisStr);
                                    return (
                                        <div className="space-y-6 text-sm font-mono">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-wrap">
                                                <div className="p-4 border border-[#333] rounded bg-black">
                                                    <strong className="block text-gray-500 mb-2">CEO CLAIM</strong>
                                                    <span className="text-gray-300 leading-relaxed">&quot;{analysis.ceo_claim}&quot;</span>
                                                </div>
                                                <div className="p-4 border border-[#333] rounded bg-black">
                                                    <strong className="block text-[#FF3333] mb-2">REALITY</strong>
                                                    <span className="text-white leading-relaxed">{analysis.reality_check}</span>
                                                </div>
                                            </div>
                                            <div className="flex flex-col sm:flex-row justify-between items-center bg-zinc-900 border border-zinc-700 p-4 rounded gap-4">
                                                <span>VERDICT: <strong className={analysis.verdict === 'SELL' ? 'text-red-500' : 'text-[#FF3333]'}>{analysis.verdict}</strong></span>
                                                <span>RISK SCORE: <strong className="text-white">{analysis.investment_score?.total || analysis.risk_score}</strong></span>
                                            </div>
                                            <div className="text-gray-400 italic p-4 border-l-2 border-emerald-900 bg-red-950/10">
                                                &quot;{analysis.executive_summary || analysis.one_line_summary}&quot;
                                            </div>
                                        </div>
                                    );
                                } catch (e) {
                                    return <div className="whitespace-pre-line text-gray-200">{result}</div>;
                                }
                            })()}
                        </div>
                    </div>
                ) : null}
            </div>

            {/* O'Neil Picks Management Table */}
            <div className="bg-[#111] border border-[#333] rounded-xl overflow-hidden shadow-2xl mt-12">
                <div className="p-6 border-b border-[#333] flex justify-between items-center bg-[#151515]">
                    <h2 className="text-xl font-bold flex items-center text-white">
                        <TrendingUp className="w-5 h-5 mr-3 text-blue-500" />
                        BreakAI Algorithmic Picks
                    </h2>
                    <span className="text-zinc-500 font-mono text-sm">{oneilPicks.length} Active AI Picks</span>
                </div>

                <div className="bg-[#09090b]">
                    {fetchingOneil ? (
                        <div className="p-12 text-center text-zinc-500">
                            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-3" />
                            Loading BreakAI Picks...
                        </div>
                    ) : oneilPicks.length === 0 ? (
                        <div className="p-12 text-center text-zinc-500">
                            <AlertTriangle className="w-10 h-10 mx-auto mb-4 opacity-50" />
                            No Auto-Generated Picks found.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm whitespace-nowrap">
                                <thead className="bg-[#18181b] border-b border-[#333]">
                                    <tr>
                                        <th className="px-6 py-4 font-mono text-zinc-500 uppercase tracking-widest text-xs font-bold">Ticker</th>
                                        <th className="px-6 py-4 font-mono text-zinc-500 uppercase tracking-widest text-xs font-bold">Pick Date</th>
                                        <th className="px-6 py-4 font-mono text-zinc-500 uppercase tracking-widest text-xs font-bold">Current Price</th>
                                        <th className="px-6 py-4 font-mono text-zinc-500 uppercase tracking-widest text-xs font-bold text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-800">
                                    {oneilPicks.map((pick) => (
                                        <tr key={pick.id} className="hover:bg-zinc-900/50 transition-colors">
                                            <td className="px-6 py-4 text-white font-bold text-lg">{pick.ticker}</td>
                                            <td className="px-6 py-4 font-mono text-zinc-400">{pick.pick_date}</td>
                                            <td className="px-6 py-4">
                                                <span className="text-red-400 font-bold">${pick.current_price?.toFixed(2)}</span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link href={`/picks/${pick.id}`} className="p-1.5 text-zinc-400 hover:text-white bg-zinc-800 hover:bg-zinc-700 rounded transition-colors" title="View Report">
                                                        <Search className="w-4 h-4" />
                                                    </Link>
                                                    <button onClick={() => handleDeleteOneil(pick.id)} className="p-1.5 text-zinc-600 hover:text-blue-500 hover:bg-blue-500/10 rounded transition-colors" title="Delete Pick">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Archive Management Table -> Folder Tree Overhaul */}
            <div className="bg-[#111] border border-[#333] rounded-xl overflow-hidden shadow-2xl mt-12 mb-20">
                <div className="p-6 border-b border-[#333] flex justify-between items-center bg-[#151515]">
                    <h2 className="text-xl font-bold flex items-center text-white">
                        <Database className="w-5 h-5 mr-3 text-red-500" />
                        Report Archive Database
                    </h2>
                    <span className="text-zinc-500 font-mono text-sm">{reports.length} Total Records</span>
                </div>

                <div className="bg-[#09090b]">
                    {fetchingReports ? (
                        <div className="p-12 text-center text-zinc-500">
                            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-3" />
                            Loading database records...
                        </div>
                    ) : reports.length === 0 ? (
                        <div className="p-12 text-center text-zinc-500">
                            <AlertTriangle className="w-10 h-10 mx-auto mb-4 opacity-50 text-blue-500" />
                            No reports found in the archive.
                        </div>
                    ) : (
                        <div className="divide-y divide-zinc-800/50">
                            {(() => {
                                // Group reports by ticker
                                const grouped = reports.reduce((acc, r) => {
                                    const t = r.ticker;
                                    if (!acc[t]) acc[t] = { research: [], earnings: [] };
                                    if (r.report_type === "earnings") acc[t].earnings.push(r);
                                    else acc[t].research.push(r);
                                    return acc;
                                }, {} as Record<string, { research: any[], earnings: any[] }>);

                                return Object.keys(grouped).map(ticker => {
                                    const isOpen = !!openFolders[ticker];
                                    const folderData = grouped[ticker];
                                    const totalCount = folderData.research.length + folderData.earnings.length;

                                    return (
                                        <div key={ticker} className="flex flex-col">
                                            {/* Folder Header */}
                                            <button
                                                onClick={() => toggleFolder(ticker)}
                                                className="flex items-center justify-between p-5 hover:bg-zinc-900 transition-colors w-full text-left"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <ChevronRight className={`w-4 h-4 text-zinc-600 transition-transform duration-200 ${isOpen ? "rotate-90 text-red-500" : ""}`} />
                                                    {isOpen ? <FolderOpen className="w-6 h-6 text-red-400" /> : <Folder className="w-6 h-6 text-red-500/70" />}
                                                    <span className="text-xl font-black text-white">{ticker} <span className="text-zinc-500 font-normal text-sm ml-2 font-mono">WORKSPACE</span></span>
                                                </div>
                                                <span className="px-3 py-1 bg-zinc-800 text-zinc-400 font-mono text-xs font-bold rounded-full">
                                                    {totalCount} ITEMS
                                                </span>
                                            </button>

                                            {/* Folder Contents (Tree Branches) */}
                                            {isOpen && (
                                                <div className="bg-[#0f0f12] pl-[52px] border-t border-zinc-900">
                                                    {/* Category: Deep Research */}
                                                    {folderData.research.length > 0 && (
                                                        <div className="py-4 border-l border-zinc-800 ml-3 pl-6 relative">
                                                            <div className="absolute top-8 -left-px w-4 h-px bg-zinc-800"></div>
                                                            <h4 className="flex items-center gap-2 text-zinc-400 font-bold text-sm tracking-widest uppercase mb-4">
                                                                <FileText className="w-4 h-4 text-zinc-500" /> Deep Research Scans
                                                            </h4>
                                                            <div className="space-y-2">
                                                                {folderData.research.map((r: any) => (
                                                                    <div key={r.id} className="flex items-center justify-between p-3 bg-black border border-zinc-800 rounded-lg hover:border-red-500/50 group transition-all mr-6">
                                                                        <div className="flex items-center gap-4">
                                                                            <span className={`px-2 py-1 flex items-center justify-center font-mono font-bold text-xs rounded border ${r.risk_score >= 80 ? 'bg-red-500/10 text-red-400 border-red-500/30' : r.risk_score <= 40 ? 'bg-blue-500/10 text-blue-400 border-blue-500/30' : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30'}`}>
                                                                                {r.risk_score} SCORE
                                                                            </span>
                                                                            <span className="text-zinc-300 font-mono text-xs flex items-center gap-2">
                                                                                <Calendar className="w-3 h-3 text-zinc-600" />
                                                                                {new Date(r.created_at).toISOString().split('T')[0]}
                                                                            </span>
                                                                        </div>
                                                                        <div className="flex items-center gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                                                            <Link href={`/report/${r.id}`} className="text-xs font-bold px-3 py-1.5 bg-zinc-800 hover:bg-emerald-900/50 hover:text-red-400 rounded text-zinc-300 transition-colors">
                                                                                VIEW
                                                                            </Link>
                                                                            <button onClick={() => handleDelete(r.id)} className="p-1.5 text-zinc-600 hover:text-blue-500 hover:bg-blue-500/10 rounded transition-colors">
                                                                                <Trash2 className="w-4 h-4" />
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Category: Earnings */}
                                                    {folderData.earnings.length > 0 && (
                                                        <div className="py-4 border-l border-zinc-800 ml-3 pl-6 relative">
                                                            <div className="absolute top-8 -left-px w-4 h-px bg-zinc-800"></div>
                                                            <h4 className="flex items-center gap-2 text-amber-500/70 font-bold text-sm tracking-widest uppercase mb-4">
                                                                <TrendingUp className="w-4 h-4 text-amber-500/50" /> Earnings & Guidance
                                                            </h4>
                                                            <div className="space-y-2">
                                                                {folderData.earnings.map((r: any) => (
                                                                    <div key={r.id} className="flex items-center justify-between p-3 bg-black border border-zinc-800 rounded-lg hover:border-amber-500/50 group transition-all mr-6">
                                                                        <div className="flex items-center gap-4">
                                                                            <span className="px-2 py-1 flex items-center justify-center font-mono font-bold text-xs rounded border border-amber-500/30 bg-amber-500/10 text-amber-400">
                                                                                {r.quarter || "N/A"}
                                                                            </span>
                                                                            <span className="text-zinc-500 font-mono text-xs">
                                                                                ID: {r.id}
                                                                            </span>
                                                                        </div>
                                                                        <div className="flex items-center gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                                                            <button onClick={() => handleDelete(r.id)} className="p-1.5 text-zinc-600 hover:text-blue-500 hover:bg-blue-500/10 rounded transition-colors">
                                                                                <Trash2 className="w-4 h-4" />
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    );
                                });
                            })()}
                        </div>
                    )}
                </div>
            </div>

            {/* Company Requests Database */}
            <div className="bg-[#111] border border-[#333] rounded-xl overflow-hidden shadow-2xl mb-12">
                <div className="p-6 border-b border-[#333] flex justify-between items-center bg-[#151515]">
                    <h2 className="text-xl font-bold flex items-center text-white">
                        <MessageSquare className="w-5 h-5 mr-3 text-blue-500" />
                        User Company Requests
                    </h2>
                    <span className="text-zinc-500 font-mono text-sm">{companyRequests.length} Requests</span>
                </div>

                <div className="bg-[#09090b]">
                    {fetchingRequests ? (
                        <div className="p-12 text-center text-zinc-500">
                            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-3" />
                            Loading requests...
                        </div>
                    ) : companyRequests.length === 0 ? (
                        <div className="p-12 text-center text-zinc-500">
                            <CheckCircle className="w-10 h-10 mx-auto mb-4 opacity-50" />
                            No incoming requests at the moment.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm whitespace-nowrap">
                                <thead className="bg-[#18181b] border-b border-[#333]">
                                    <tr>
                                        <th className="px-6 py-4 font-mono text-zinc-500 uppercase tracking-widest text-xs font-bold">Company Name</th>
                                        <th className="px-6 py-4 font-mono text-zinc-500 uppercase tracking-widest text-xs font-bold">Ticker</th>
                                        <th className="px-6 py-4 font-mono text-zinc-500 uppercase tracking-widest text-xs font-bold">Status</th>
                                        <th className="px-6 py-4 font-mono text-zinc-500 uppercase tracking-widest text-xs font-bold">Requested On</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-800">
                                    {companyRequests.map((req) => (
                                        <tr key={req.id} className="hover:bg-zinc-900/50 transition-colors">
                                            <td className="px-6 py-4 text-white font-bold">{req.company_name}</td>
                                            <td className="px-6 py-4 font-mono text-zinc-400">{req.ticker || '-'}</td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center px-2 py-1 rounded bg-blue-500/10 border border-blue-500/20 text-blue-400 font-bold text-xs uppercase tracking-wider">
                                                    {req.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-zinc-500 font-mono text-xs">
                                                    {new Date(req.created_at).toLocaleString()}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button onClick={() => handleDeleteRequest(req.id)} className="p-1.5 text-zinc-600 hover:text-blue-500 hover:bg-blue-500/10 rounded transition-colors" title="Delete Request">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Daily Market Briefing Database */}
            <div className="bg-[#111] border border-[#333] rounded-xl overflow-hidden shadow-2xl mb-12">
                <div className="p-6 border-b border-[#333] flex justify-between items-center bg-[#151515]">
                    <h2 className="text-xl font-bold flex items-center text-white">
                        <FileText className="w-5 h-5 mr-3 text-emerald-500" />
                        Daily Market Briefings
                    </h2>
                    <span className="text-zinc-500 font-mono text-sm">{briefings.length} Briefings</span>
                </div>

                <div className="bg-[#09090b]">
                    {fetchingBriefings ? (
                        <div className="p-12 text-center text-zinc-500">
                            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-3" />
                            Loading briefings...
                        </div>
                    ) : briefings.length === 0 ? (
                        <div className="p-12 text-center text-zinc-500">
                            <AlertTriangle className="w-10 h-10 mx-auto mb-4 opacity-50 text-emerald-500" />
                            No market briefings found.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm whitespace-nowrap">
                                <thead className="bg-[#18181b] border-b border-[#333]">
                                    <tr>
                                        <th className="px-6 py-4 font-mono text-zinc-500 uppercase tracking-widest text-xs font-bold w-1/4">Date</th>
                                        <th className="px-6 py-4 font-mono text-zinc-500 uppercase tracking-widest text-xs font-bold w-1/2">Title</th>
                                        <th className="px-6 py-4 font-mono text-zinc-500 uppercase tracking-widest text-xs font-bold text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-800">
                                    {briefings.map((briefing) => (
                                        <tr key={briefing.id} className="hover:bg-zinc-900/50 transition-colors">
                                            {editingBriefingId === briefing.id ? (
                                                <td colSpan={3} className="px-6 py-4">
                                                    <div className="flex flex-col gap-4 bg-[#151515] p-6 rounded-lg border border-[#333]">
                                                        <div>
                                                            <label className="block text-xs font-bold font-mono text-zinc-500 mb-2">TITLE</label>
                                                            <input
                                                                type="text"
                                                                value={editBriefingTitle}
                                                                onChange={(e) => setEditBriefingTitle(e.target.value)}
                                                                className="w-full bg-black border border-zinc-700 rounded px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-xs font-bold font-mono text-zinc-500 mb-2">CONTENT (MARKDOWN)</label>
                                                            <textarea
                                                                rows={10}
                                                                value={editBriefingContent}
                                                                onChange={(e) => setEditBriefingContent(e.target.value)}
                                                                className="w-full bg-black border border-zinc-700 rounded px-3 py-2 text-white focus:outline-none focus:border-emerald-500 font-mono text-xs leading-relaxed resize-y whitespace-pre-wrap"
                                                                style={{ whiteSpace: 'pre-wrap' }}
                                                            />
                                                        </div>
                                                        <div className="flex justify-end gap-3 mt-2">
                                                            <button
                                                                onClick={() => setEditingBriefingId(null)}
                                                                className="px-4 py-2 rounded border border-zinc-700 hover:bg-zinc-800 text-zinc-300 transition-colors text-xs font-bold tracking-widest"
                                                            >
                                                                CANCEL
                                                            </button>
                                                            <button
                                                                onClick={handleUpdateBriefing}
                                                                className="px-4 py-2 rounded bg-emerald-600 hover:bg-emerald-500 text-white transition-colors text-xs font-bold tracking-widest"
                                                            >
                                                                SAVE CHANGES
                                                            </button>
                                                        </div>
                                                    </div>
                                                </td>
                                            ) : (
                                                <>
                                                    <td className="px-6 py-4 font-mono text-zinc-400">{briefing.date}</td>
                                                    <td className="px-6 py-4 text-white font-bold whitespace-normal max-w-md line-clamp-2">{briefing.title}</td>
                                                    <td className="px-6 py-4 text-right">
                                                        <div className="flex justify-end gap-2">
                                                            <button onClick={() => handleEditBriefingOpen(briefing)} className="p-1.5 text-zinc-600 hover:text-emerald-500 hover:bg-emerald-500/10 rounded transition-colors" title="Edit Briefing">
                                                                <Star className="w-4 h-4" />
                                                            </button>
                                                            <button onClick={() => handleDeleteBriefing(briefing.id)} className="p-1.5 text-zinc-600 hover:text-blue-500 hover:bg-blue-500/10 rounded transition-colors" title="Delete Briefing">
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </>
                                            )}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* User Management Database */}
            <div className="bg-[#111] border border-[#333] rounded-xl overflow-hidden shadow-2xl mb-20">
                <div className="p-6 border-b border-[#333] flex justify-between items-center bg-[#151515]">
                    <h2 className="text-xl font-bold flex items-center text-white">
                        <Users className="w-5 h-5 mr-3 text-amber-500" />
                        User Management & Subscriptions
                    </h2>
                    <span className="text-zinc-500 font-mono text-sm">{profiles.length} Registered Users</span>
                </div>

                <div className="bg-[#09090b]">
                    {fetchingProfiles ? (
                        <div className="p-12 text-center text-zinc-500">
                            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-3" />
                            Loading user profiles...
                        </div>
                    ) : profiles.length === 0 ? (
                        <div className="p-12 text-center text-zinc-500">
                            <UserCircle className="w-10 h-10 mx-auto mb-4 opacity-50" />
                            No user records found.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm whitespace-nowrap">
                                <thead className="bg-[#18181b] border-b border-[#333]">
                                    <tr>
                                        <th className="px-6 py-4 font-mono text-zinc-500 uppercase tracking-widest text-xs font-bold">User Email</th>
                                        <th className="px-6 py-4 font-mono text-zinc-500 uppercase tracking-widest text-xs font-bold">Status</th>
                                        <th className="px-6 py-4 font-mono text-zinc-500 uppercase tracking-widest text-xs font-bold">Subscription ID</th>
                                        <th className="px-6 py-4 font-mono text-zinc-500 uppercase tracking-widest text-xs font-bold text-right">Registered On</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-800">
                                    {profiles.map((user) => (
                                        <tr key={user.id} className="hover:bg-zinc-900/50 transition-colors">
                                            <td className="px-6 py-4 text-white flex items-center gap-3">
                                                <UserCircle className={`w-5 h-5 ${user.is_pro ? 'text-amber-500' : 'text-zinc-500'}`} />
                                                <span className="font-bold">{user.email}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                {user.is_pro ? (
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-500/10 border border-amber-500/20 text-amber-400 font-black text-xs uppercase tracking-wider">
                                                        <Star className="w-3 h-3 fill-amber-400" /> Pro Member
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-zinc-800 border border-zinc-700 text-zinc-400 font-bold text-xs uppercase tracking-wider">
                                                        Free Active
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-zinc-500 font-mono text-xs">{user.subscription_id || '-'}</span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <span className="text-zinc-400 font-mono text-xs border border-zinc-800 bg-black px-2 py-1 rounded">
                                                    {new Date(user.created_at).toLocaleString()}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            <div className="text-center pt-8 pb-12">
                <Link href="/" className="text-zinc-500 hover:text-[#FF3333] hover:underline font-mono text-sm transition-colors">
                    &larr; Return to Public Dashboard
                </Link>
            </div>
        </div>
    );
}