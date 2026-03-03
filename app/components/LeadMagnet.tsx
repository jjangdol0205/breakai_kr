"use client";

import { useState } from "react";
import { Mail, CheckCircle2, AlertCircle } from "lucide-react";

export default function LeadMagnet() {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email || !email.includes('@')) {
            setStatus("error");
            setMessage("유효한 이메일 주소를 입력해주세요.");
            return;
        }

        setStatus("loading");

        try {
            const res = await fetch('/api/leads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, source: 'footer_magnet' })
            });

            const data = await res.json();

            if (res.ok) {
                setStatus("success");
                setMessage(data.message === 'Already subscribed'
                    ? "이미 구독 중입니다!"
                    : "성공적으로 구독되었습니다. 메일함을 확인해주세요!");
                setEmail("");
            } else {
                setStatus("error");
                setMessage(data.error || "구독 중 오류가 발생했습니다.");
            }
        } catch (err) {
            setStatus("error");
            setMessage("서버와 통신할 수 없습니다.");
        }
    };

    return (
        <div className="w-full bg-gradient-to-br from-zinc-900 to-black border border-zinc-800 rounded-2xl p-8 shadow-2xl relative overflow-hidden flex flex-col items-center text-center">
            {/* Background glowing orb */}
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-red-500/10 rounded-full blur-[80px] pointer-events-none"></div>

            <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center mb-6 shadow-inner text-red-400">
                <Mail className="w-8 h-8" />
            </div>

            <h3 className="text-3xl font-black text-white tracking-tight mb-3">
                2026년 <span className="text-red-400">고성장 AI 주식 Top 10</span> 리포트
            </h3>
            <p className="text-zinc-400 mb-8 max-w-md mx-auto">
                이메일을 입력하고 독점 PDF 리포트를 즉시 다운로드하세요. 월스트리트가 숨기려 하는 정확한 데이터를 확인하십시오.
            </p>

            <form onSubmit={handleSubmit} className="w-full max-w-md relative z-10">
                <div className="flex flex-col sm:flex-row gap-3">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="이메일 주소"
                        disabled={status === "loading" || status === "success"}
                        className="flex-1 bg-[#111] border border-zinc-700 text-white px-5 py-4 rounded-xl focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-emerald-500 transition-all font-mono text-sm disabled:opacity-50"
                    />
                    <button
                        type="submit"
                        disabled={status === "loading" || status === "success"}
                        className="bg-red-500 hover:bg-emerald-400 text-black font-extrabold px-8 py-4 rounded-xl transition-all disabled:opacity-50 whitespace-nowrap"
                    >
                        {status === "loading" ? "전송 중..." : "무료 PDF 다운로드"}
                    </button>
                </div>

                {status === "success" && (
                    <div className="mt-4 flex items-center justify-center gap-2 text-red-400 font-medium text-sm animate-in fade-in slide-in-from-bottom-2">
                        <CheckCircle2 className="w-4 h-4" />
                        {message}
                    </div>
                )}
                {status === "error" && (
                    <div className="mt-4 flex items-center justify-center gap-2 text-blue-400 font-medium text-sm animate-in fade-in slide-in-from-bottom-2">
                        <AlertCircle className="w-4 h-4" />
                        {message}
                    </div>
                )}
            </form>

            <p className="text-zinc-600 text-xs mt-6 font-mono">
                * 당사는 스팸을 발송하지 않습니다. 언제든지 구독을 취소할 수 있습니다.
            </p>
        </div>
    );
}
