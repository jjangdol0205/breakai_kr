"use client";

import React from 'react';

export default function CoupangSearch() {
    return (
        <div className="w-full flex justify-center my-8">
            <div className="w-full max-w-[680px] bg-zinc-900 rounded-xl border border-zinc-800 p-4 shadow-xl hover:border-red-500/30 transition-colors">
                <div className="text-center mb-2">
                    <p className="text-xs text-zinc-500 font-mono flex items-center justify-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                        투자자 인기 상품 검색
                    </p>
                </div>
                <div className="w-full rounded-lg overflow-hidden flex justify-center">
                    <iframe 
                        src="https://coupa.ng/cmAdDy" 
                        width="100%" 
                        height="75" 
                        frameBorder="0" 
                        scrolling="no" 
                        referrerPolicy="unsafe-url" 
                        title="Coupang Search"
                    ></iframe>
                </div>
                <div className="mt-2 text-[10px] text-zinc-700 text-center">
                    이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.
                </div>
            </div>
        </div>
    );
}
