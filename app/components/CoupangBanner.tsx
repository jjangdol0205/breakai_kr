"use client";

import React from 'react';
import { ShoppingCart, ExternalLink, Sparkles } from "lucide-react";

export default function CoupangBanner() {
    return (
        <div className="w-full flex justify-center my-10 relative group">
            {/* Animated Background Glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-rose-500 via-fuchsia-500 to-indigo-500 rounded-3xl blur-xl opacity-20 group-hover:opacity-60 transition duration-1000 group-hover:duration-200"></div>
            
            <div className="relative overflow-hidden bg-gradient-to-b from-[#0a0a0a] to-[#050505] border border-zinc-800 group-hover:border-rose-500/50 rounded-2xl p-4 md:p-6 transition-all duration-500 shadow-2xl flex flex-col items-center justify-center w-full">
                
                {/* Header CTA */}
                <div className="flex items-center justify-between w-full mb-5 px-2">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-rose-500/10 flex items-center justify-center border border-rose-500/30 group-hover:scale-110 transition-transform duration-300">
                            <ShoppingCart className="w-5 h-5 text-rose-500" />
                        </div>
                        <div className="flex flex-col text-left">
                            <h4 className="text-sm md:text-base font-bold text-white flex items-center gap-2 font-serif">
                                투자 성과를 높이는 추천 아이템 <Sparkles className="w-4 h-4 text-yellow-500 animate-pulse" />
                            </h4>
                            <p className="text-zinc-500 text-xs font-mono">
                                AI가 분석한 오늘의 트렌드 상품
                            </p>
                        </div>
                    </div>
                    <div className="hidden md:flex items-center text-xs font-bold text-rose-400 uppercase tracking-wider bg-rose-500/10 px-3 py-1.5 rounded-full border border-rose-500/20 group-hover:bg-rose-500/20 transition-colors">
                        특가 확인하기 <ExternalLink className="w-3 h-3 ml-1.5" />
                    </div>
                </div>

                {/* The Coupang iframe */}
                <div className="relative w-full max-w-[680px] h-[140px] flex items-center justify-center bg-white/5 rounded-xl border border-white/10 group-hover:border-rose-500/30 transition-colors overflow-hidden">
                    {/* Placeholder loading state behind iframe */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="animate-pulse flex flex-col items-center gap-2">
                            <div className="w-8 h-8 border-2 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
                            <span className="text-xs text-zinc-500 font-mono">Loading deals...</span>
                        </div>
                    </div>
                    
                    <iframe 
                        src="/coupang-banner.html" 
                        width="680" 
                        height="140" 
                        frameBorder="0" 
                        scrolling="no" 
                        referrerPolicy="unsafe-url"
                        className="relative z-10 max-w-full rounded-lg"
                        style={{ overflow: 'hidden', backgroundColor: 'transparent' }}
                        title="Coupang Partners Banner"
                    ></iframe>
                </div>
                
                {/* Disclosure */}
                <div className="mt-4 text-[10px] md:text-xs text-zinc-600 font-mono text-center w-full bg-black/20 py-2 rounded-lg border border-white/5 group-hover:text-zinc-500 transition-colors">
                    이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.
                </div>
            </div>
        </div>
    );
}
