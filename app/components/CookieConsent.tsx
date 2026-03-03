"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function CookieConsent() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Check if user already consented
        const consented = localStorage.getItem("cookie_consent");
        if (!consented) {
            setIsVisible(true);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem("cookie_consent", "true");
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-0 left-0 w-full z-50 bg-[#09090b] border-t border-[#333] p-4 shadow-2xl animate-in slide-in-from-bottom-5">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-sm text-zinc-300 text-center sm:text-left">
                    당사는 귀하의 브라우징 경험을 향상시키고, 맞춤형 광고 및 콘텐츠를 제공하며, 트래픽을 분석하기 위해 쿠키를 사용합니다. "모두 수락"을 클릭하면 당사의 <Link href="/privacy" className="text-red-400 hover:underline">개인정보처리방침</Link>에 설명된 쿠키 사용에 동의하게 됩니다.
                </div>
                <div className="flex gap-4 w-full sm:w-auto">
                    <button
                        onClick={() => setIsVisible(false)}
                        className="flex-1 sm:flex-none px-6 py-2 text-sm text-zinc-400 hover:text-white border border-[#333] hover:border-zinc-500 rounded-md transition-colors"
                    >
                        거절
                    </button>
                    <button
                        onClick={handleAccept}
                        className="flex-1 sm:flex-none px-8 py-2 text-sm font-bold text-black bg-[#FF3333] hover:bg-emerald-400 rounded-md transition-colors whitespace-nowrap"
                    >
                        모두 수락
                    </button>
                </div>
            </div>
        </div>
    );
}
