"use client";

import React from 'react';

export default function CoupangCategory() {
    return (
        <div className="w-full flex justify-center my-8">
            <div className="w-full max-w-[728px] flex flex-col items-center">
                <a 
                    href="https://link.coupang.com/a/ewWHT2" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block hover:opacity-90 hover:scale-[1.02] transition-all rounded-xl overflow-hidden shadow-2xl border border-zinc-800 hover:border-red-500/30"
                >
                    <img 
                        src="https://ads-partners.coupang.com/banners/800448?subId=&traceId=V0-301-879dd1202e5c73b2-I800448&w=728&h=90" 
                        alt="쿠팡 기획전"
                        className="w-full h-auto"
                    />
                </a>
                <div className="mt-3 text-[10px] text-zinc-700 text-center">
                    이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.
                </div>
            </div>
        </div>
    );
}
