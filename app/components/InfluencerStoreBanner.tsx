"use client";

import React from 'react';
import { Store, ChevronRight, Star, Gift } from "lucide-react";

interface InfluencerStoreBannerProps {
    title?: string;
    subtitle?: string;
    theme?: 'financial' | 'senior';
}

export default function InfluencerStoreBanner({ 
    title = "AI가 엄선한 투자자 필수 아이템", 
    subtitle = "장비가 수익률을 바꿉니다. 워렌버핏 추천 도서부터 재택 트레이딩 셋업까지.",
    theme = 'financial'
}: InfluencerStoreBannerProps) {
    const storeUrl = "https://influencers.coupang.com/s/paradisehero";

    // Theme-based styling
    const isFinancial = theme === 'financial';
    const bgGradient = isFinancial 
        ? "from-emerald-900/40 via-black to-[#050505]" 
        : "from-amber-900/40 via-black to-zinc-950";
    const accentColor = isFinancial ? "text-emerald-400" : "text-amber-400";
    const borderGlow = isFinancial ? "group-hover:border-emerald-500/50" : "group-hover:border-amber-500/50";
    const shadowGlow = isFinancial ? "hover:shadow-[0_0_30px_rgba(16,185,129,0.15)]" : "hover:shadow-[0_0_30px_rgba(245,158,11,0.15)]";

    return (
        <a 
            href={storeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`block w-full my-8 group relative overflow-hidden rounded-2xl border border-zinc-800 transition-all duration-500 ${borderGlow} ${shadowGlow}`}
        >
            {/* Animated Background Gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${bgGradient} opacity-50 group-hover:opacity-100 transition-opacity duration-700`}></div>
            
            {/* Shimmer Effect */}
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/5 to-transparent group-hover:animate-[shimmer_2s_infinite]"></div>

            <div className="relative p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 z-10">
                <div className="flex items-center gap-5 w-full md:w-auto">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 border border-white/10 bg-black/50 backdrop-blur-md group-hover:scale-110 transition-transform duration-500 shadow-xl`}>
                        {isFinancial ? (
                            <Store className={`w-8 h-8 ${accentColor}`} />
                        ) : (
                            <Gift className={`w-8 h-8 ${accentColor}`} />
                        )}
                    </div>
                    
                    <div className="flex flex-col text-left">
                        <div className="flex items-center gap-2 mb-1">
                            <span className={`text-[10px] uppercase tracking-widest font-black px-2 py-0.5 rounded-sm bg-white/10 ${accentColor}`}>
                                EXCLUSIVE PICKS
                            </span>
                            <div className="flex">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <Star key={i} className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                                ))}
                            </div>
                        </div>
                        <h3 className="text-xl md:text-2xl font-black text-white mb-1 tracking-tight">
                            {title}
                        </h3>
                        <p className="text-sm text-zinc-400 font-mono">
                            {subtitle}
                        </p>
                    </div>
                </div>

                <div className="w-full md:w-auto shrink-0 flex justify-end">
                    <div className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white text-black font-bold text-sm hover:scale-105 transition-transform duration-300 w-full md:w-auto`}>
                        스토어 입장하기 <ChevronRight className="w-4 h-4" />
                    </div>
                </div>
            </div>
            
            {/* Legal Disclosure */}
            <div className="relative z-10 w-full text-center py-2 bg-black/40 border-t border-white/5">
                <p className="text-[10px] text-zinc-600 font-mono">
                    이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.
                </p>
            </div>
        </a>
    );
}
