"use client";

import { X } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function PromoBanner() {
    const [isVisible, setIsVisible] = useState(true);

    // Simple session storage to hide banner if user closed it
    useEffect(() => {
        const hideBanner = sessionStorage.getItem("hidePromoBanner");
        if (hideBanner === "true") {
            setIsVisible(false);
        }
    }, []);

    const handleClose = () => {
        setIsVisible(false);
        sessionStorage.setItem("hidePromoBanner", "true");
    };

    // Temporarily hidden for pre-monetization free tier
    if (true) return null;

    return (
        <div className="bg-gradient-to-r from-blue-700 to-blue-900 text-white py-2 px-4 flex justify-between items-center relative z-50 overflow-hidden shadow-lg border-b border-blue-950">
            {/* Shimmer Effect */}
            <div className="absolute inset-0 bg-white/20 w-1/4 skew-x-12 -translate-x-[200%] animate-[shimmer_3s_infinite_ease-in-out]"></div>

            <div className="flex-grow text-center flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-3 text-xs sm:text-sm font-semibold tracking-wider font-sans uppercase">
                <span className="flex items-center gap-2">
                    <span className="animate-pulse w-2 h-2 bg-white rounded-full"></span>
                    기관급 데이터 안내:
                </span>
                <span className="text-blue-100">
                    Pro 연간 터미널 특별 16% 할인 혜택을 받으세요.
                </span>
                <Link href="/pricing" className="underline underline-offset-4 decoration-white/50 hover:text-white transition-colors ml-2 bg-white/10 px-3 py-0.5 rounded-sm hover:bg-white/20">
                    할인 적용하기 &rarr;
                </Link>
            </div>
            <button
                onClick={handleClose}
                className="text-white/70 hover:text-white hover:bg-white/10 p-1 rounded-sm transition-colors ml-2 shrink-0"
                aria-label="Close promo banner"
            >
                <X className="w-4 h-4" />
            </button>
        </div>
    );
}
