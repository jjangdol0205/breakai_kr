"use client";

import { useState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";

export default function NewsletterForm() {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email) return;

        setStatus("loading");
        setMessage("");

        try {
            const res = await fetch("/api/subscribe", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (!res.ok) {
                setStatus("error");
                setMessage(data.error || "구독에 실패했습니다.");
                return;
            }

            setStatus("success");
            setMessage(data.message || "구독해주셔서 감사합니다! 메일함을 확인해주세요.");
            setEmail("");
        } catch (error) {
            setStatus("error");
            setMessage("예기치 않은 오류가 발생했습니다. 나중에 다시 시도해주세요.");
        }
    };

    return (
        <div className="max-w-md mx-auto relative">
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
                <input
                    type="email"
                    placeholder="이메일 주소"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={status === "loading" || status === "success"}
                    className="flex-1 bg-black border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-colors font-sans disabled:opacity-50"
                />
                <button
                    type="submit"
                    disabled={status === "loading" || status === "success"}
                    className="bg-white text-black font-bold px-6 py-3 rounded-xl hover:bg-zinc-200 transition-colors flex items-center justify-center min-w-32 disabled:opacity-75 disabled:cursor-not-allowed"
                >
                    {status === "loading" ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : status === "success" ? (
                        "구독 완료!"
                    ) : (
                        <>구독하기 <ArrowRight className="w-4 h-4 ml-2" /></>
                    )}
                </button>
            </form>

            {message && (
                <p className={`text-sm mt-3 animate-in fade-in slide-in-from-bottom-2 ${status === "error" ? "text-blue-400 font-medium" : "text-red-400 font-bold"}`}>
                    {message}
                </p>
            )}
        </div>
    );
}
