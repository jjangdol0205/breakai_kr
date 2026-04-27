"use client";

import React, { useState, useEffect } from 'react';
import { X, ExternalLink } from 'lucide-react';

export default function CoupangStickyBanner() {
    const [isVisible, setIsVisible] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        // Add a slight delay before showing the banner to not overwhelm the user
        const timer = setTimeout(() => {
            const hasClosed = sessionStorage.getItem('breakai_sticky_closed');
            if (!hasClosed) setIsVisible(true);
        }, 4000); 
        
        return () => clearTimeout(timer);
    }, []);

    const handleClose = () => {
        setIsVisible(false);
        sessionStorage.setItem('breakai_sticky_closed', 'true');
    };

    if (!isMounted || !isVisible) return null;

    return (
        <div className="fixed bottom-0 left-0 w-full z-[100] md:hidden">
            {/* Animation Wrapper */}
            <div className="animate-in slide-in-from-bottom duration-500 bg-zinc-950 border-t border-zinc-800 shadow-[0_-10px_40px_rgba(0,0,0,0.8)] pb-safe-area">
                <div className="p-3 relative flex justify-center items-center">
                    {/* Close Button */}
                    <button 
                        onClick={handleClose}
                        className="absolute top-1 right-1 p-1.5 rounded-full text-zinc-500 hover:text-white hover:bg-zinc-800 transition-colors z-10"
                        aria-label="Close banner"
                    >
                        <X className="w-4 h-4" />
                    </button>
                    
                    {/* Banner Content */}
                    <a 
                        href="https://coupa.ng/cmAdDy" 
                        target="_blank" 
                        rel="noreferrer"
                        className="flex items-center justify-between w-full max-w-sm bg-gradient-to-r from-zinc-900 to-zinc-800 border border-red-500/20 hover:border-red-500/40 rounded-xl p-3 shadow-inner transition-colors"
                        onClick={() => {
                            // Optionally track click
                        }}
                    >
                        <div className="flex flex-col pr-6">
                            <span className="text-red-500 font-black text-sm tracking-tight flex items-center gap-1.5 font-sans">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                                </span>
                                AI 추천 실시간 핫딜
                            </span>
                            <span className="text-zinc-400 text-[11px] mt-0.5 font-medium tracking-wide">
                                투자 성과를 높이는 아이템
                            </span>
                        </div>
                        <div className="bg-red-600 text-white text-xs font-bold px-3 py-2 rounded-lg flex items-center gap-1 shrink-0 shadow-md">
                            확인하기
                            <ExternalLink className="w-3 h-3" />
                        </div>
                    </a>
                </div>
            </div>
        </div>
    );
}
