"use client";

import { useState } from "react";
import { X, Loader2, Send, CheckCircle2 } from "lucide-react";

interface RequestCompanyModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function RequestCompanyModal({ isOpen, onClose }: RequestCompanyModalProps) {
    const [companyName, setCompanyName] = useState("");
    const [ticker, setTicker] = useState("");
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [success, setSuccess] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg("");

        if (!companyName.trim()) {
            setErrorMsg("회사명 (종목명)은 필수입니다.");
            setLoading(false);
            return;
        }

        try {
            const res = await fetch("/api/requests", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ companyName, ticker }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "요청 제출에 실패했습니다.");
            }

            setSuccess(true);

            // clear form
            setCompanyName("");
            setTicker("");

        } catch (err: any) {
            setErrorMsg(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setSuccess(false);
        setErrorMsg("");
        setCompanyName("");
        setTicker("");
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
            <div className="bg-[#111] border border-[#333] rounded-2xl w-full max-w-md shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-600"></div>

                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="p-8">
                    {success ? (
                        <div className="text-center py-8">
                            <div className="mx-auto w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-6">
                                <CheckCircle2 className="w-8 h-8 text-red-500" />
                            </div>
                            <h2 className="text-2xl font-black text-white tracking-tight mb-2">요청 접수 완료!</h2>
                            <p className="text-zinc-400 text-sm leading-relaxed mb-8">
                                감사합니다. 당사의 AI 에이전트가 다가오는 배치 작업에서 이 기업을 우선적으로 분석할 것입니다.
                            </p>
                            <button
                                onClick={handleClose}
                                className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-3 rounded-lg transition-colors"
                            >
                                창 닫기
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="mb-8 text-center">
                                <h2 className="text-2xl font-black text-white tracking-tight mb-2">종목 분석 요청</h2>
                                <p className="text-zinc-400 text-sm font-medium">특정 종목에 대한 심층 분석이 필요하신가요? 저희에게 알려주세요.</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
                                        회사명 (종목명) *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={companyName}
                                        onChange={(e) => setCompanyName(e.target.value)}
                                        placeholder="예: 애플 (Apple), 테슬라 (Tesla)"
                                        className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-zinc-600"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
                                        티커 심볼 (선택 사항)
                                    </label>
                                    <input
                                        type="text"
                                        value={ticker}
                                        onChange={(e) => setTicker(e.target.value)}
                                        placeholder="예: AAPL, TSLA"
                                        className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-zinc-600"
                                    />
                                </div>

                                {errorMsg && (
                                    <div className="bg-blue-500/10 border border-blue-500/50 text-blue-500 text-sm p-3 rounded-lg text-center">
                                        {errorMsg}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading || !companyName.trim()}
                                    className="w-full bg-white text-black font-bold py-3.5 mt-4 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <>
                                            요청 제출 <Send className="w-4 h-4" />
                                        </>
                                    )}
                                </button>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
