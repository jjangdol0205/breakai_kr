"use client";

import React from 'react';

export default function CoupangDynamic() {
    return (
        <div className="w-full flex justify-center my-8 group">
            <div className="w-full max-w-[720px] bg-gradient-to-b from-[#0a0a0a] to-[#050505] rounded-2xl border border-zinc-800 p-5 shadow-2xl group-hover:border-red-500/40 transition-all duration-500">
                <div className="text-center mb-4">
                    <h4 className="text-sm md:text-base font-bold text-white flex items-center justify-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.8)]"></span>
                        오늘의 트렌드 추천 상품
                    </h4>
                </div>
                <div className="relative w-full flex items-center justify-center bg-white/5 rounded-xl border border-white/5 overflow-hidden">
                    <iframe 
                        src="/coupang-dynamic.html" 
                        width="680" 
                        height="140" 
                        frameBorder="0" 
                        scrolling="no" 
                        className="relative z-10 max-w-full"
                        style={{ backgroundColor: 'transparent' }}
                        title="Coupang Dynamic Banner"
                    ></iframe>
                </div>
                <div className="mt-4 text-[10px] text-zinc-600 text-center font-mono">
                    이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.
                </div>
            </div>
        </div>
    );
}
