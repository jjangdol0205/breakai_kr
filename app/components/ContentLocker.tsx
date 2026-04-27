"use client";

import React, { useState, useEffect } from 'react';
import { Lock, Unlock, ExternalLink } from 'lucide-react';

export default function ContentLocker({ children }: { children: React.ReactNode }) {
    const [isUnlocked, setIsUnlocked] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        // Check if unlocked in localStorage
        const unlocked = localStorage.getItem('breakai_report_unlocked');
        if (unlocked === 'true') {
            setIsUnlocked(true);
        }
    }, []);

    const handleUnlock = () => {
        // Open Coupang link in new tab (replace with your actual partner link)
        window.open('https://coupa.ng/cmAdDy', '_blank');
        
        // Unlock content
        localStorage.setItem('breakai_report_unlocked', 'true');
        setIsUnlocked(true);
    };

    // To prevent hydration mismatch, only render after mount
    if (!isMounted) return <div className="h-96 animate-pulse bg-zinc-900 rounded-2xl"></div>;

    if (isUnlocked) {
        return <>{children}</>;
    }

    return (
        <div className="relative w-full overflow-hidden rounded-2xl border border-zinc-800 bg-[#111]">
            {/* Blurred Content Preview */}
            <div className="blur-[8px] opacity-20 select-none pointer-events-none h-[500px] overflow-hidden p-10">
                {children}
            </div>
            
            {/* Locker UI */}
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-t from-[#111] via-[#111]/90 to-[#111]/40 p-6 z-10">
                <div className="bg-zinc-950 border border-zinc-800 p-8 rounded-2xl shadow-2xl max-w-md w-full text-center flex flex-col items-center">
                    <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-4 border border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
                        <Lock className="w-8 h-8 text-red-500" />
                    </div>
                    <h3 className="text-2xl font-black text-white mb-2 font-sans tracking-tight">
                        프리미엄 리포트 잠금
                    </h3>
                    <p className="text-zinc-400 text-sm mb-8 leading-relaxed font-medium">
                        스폰서 링크를 1회 방문해주시면<br/>
                        이 기기에서 모든 리포트가 <span className="text-red-400 font-bold">무료로 영구 잠금 해제</span>됩니다.
                    </p>
                    
                    <button 
                        onClick={handleUnlock}
                        className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg hover:shadow-red-500/25 active:scale-95 border border-red-500"
                    >
                        <Unlock className="w-5 h-5" />
                        <span>스폰서 방문하고 즉시 해제하기</span>
                        <ExternalLink className="w-4 h-4 ml-1 opacity-70" />
                    </button>
                    
                    <p className="text-[10px] text-zinc-600 mt-5 font-mono">
                        이 포스팅은 쿠팡 파트너스 활동의 일환으로,<br/>이에 따른 일정액의 수수료를 제공받습니다.
                    </p>
                </div>
            </div>
        </div>
    );
}
