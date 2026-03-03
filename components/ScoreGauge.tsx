"use client";

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

type ScoreBreakdownItem = { category: string, score: number, max_score: number, reason: string };
type ScoreObj = { total?: number, breakdown?: ScoreBreakdownItem[] };

export default function ScoreGauge({ scoreObj, scoreColor }: { scoreObj: ScoreObj, scoreColor: string }) {
    const [isOpen, setIsOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const score = scoreObj.total ?? 0;
    const radius = 80;
    const dashArray = Math.PI * radius;
    const dashOffset = dashArray * (1 - score / 100);

    let strokeColor = "#9ca3af";
    let label = "중립";
    if (score >= 80) { strokeColor = "#FF3333"; label = "극단적 탐욕 (매수)"; }
    else if (score >= 60) { strokeColor = "#FCA5A5"; label = "탐욕 (매수)"; }
    else if (score <= 20) { strokeColor = "#2563EB"; label = "극단적 공포 (매도)"; }
    else if (score <= 40) { strokeColor = "#60A5FA"; label = "공포 (매도)"; }

    return (
        <>
            <div
                className="cursor-pointer group hover:scale-105 transition-transform flex flex-col items-center"
                onClick={() => setIsOpen(true)}
            >
                <div className="text-sm font-bold text-red-500 mb-2 group-hover:text-amber-400 transition-colors flex items-center gap-2">
                    공포 및 탐욕 지수
                    <span className="text-xs font-normal text-zinc-500 bg-zinc-800 px-2 py-0.5 rounded-full">상세 분석 보기 📊</span>
                </div>

                <svg viewBox="0 0 200 120" className="w-56 h-36 drop-shadow-2xl">
                    <path d="M 20 100 A 80 80 0 1 1 180 100" fill="none" stroke="#222" strokeWidth="16" strokeLinecap="round" />
                    <path
                        d="M 20 100 A 80 80 0 1 1 180 100"
                        fill="none"
                        stroke={strokeColor}
                        strokeWidth="16"
                        strokeLinecap="round"
                        strokeDasharray={dashArray}
                        strokeDashoffset={dashOffset}
                        className="transition-all duration-1000 ease-out"
                    />
                    <text x="100" y="85" textAnchor="middle" className="text-5xl font-black fill-white" fontFamily="monospace">
                        {score}
                    </text>
                    <text x="100" y="110" textAnchor="middle" className="text-xs font-bold fill-gray-400 tracking-widest leading-none">
                        {label}
                    </text>
                </svg>
            </div>

            {isOpen && mounted && createPortal(
                <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-8 md:p-12 w-full max-w-3xl shadow-2xl relative">
                        <button
                            className="absolute top-4 right-6 text-gray-400 hover:text-white"
                            onClick={() => setIsOpen(false)}
                        >
                            ✕
                        </button>
                        <h2 className="text-2xl font-bold text-white mb-6">투자 점수 분석</h2>

                        <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
                            {scoreObj.breakdown?.map((item, idx) => (
                                <div key={idx} className="bg-zinc-800/50 p-4 rounded-xl border border-zinc-700/50">
                                    <div className="flex justify-between items-start sm:items-center gap-4 mb-2">
                                        <h3 className="text-red-400 font-bold leading-tight">{item.category}</h3>
                                        <span className="font-mono text-white bg-zinc-800 px-3 py-1 rounded whitespace-nowrap shrink-0 text-sm">
                                            {item.score} / {item.max_score}
                                        </span>
                                    </div>
                                    <div className="w-full bg-zinc-800 rounded-full h-2 mb-3 overflow-hidden">
                                        <div
                                            className="bg-red-500 h-2 rounded-full transition-all duration-1000"
                                            style={{ width: `${(item.score / item.max_score) * 100}%` }}
                                        ></div>
                                    </div>
                                    <p className="text-gray-300 text-sm leading-relaxed">{item.reason}</p>
                                </div>
                            ))}
                            {(!scoreObj.breakdown || scoreObj.breakdown.length === 0) && (
                                <p className="text-gray-400 text-center py-4">세부 데이터가 없습니다.</p>
                            )}
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </>
    );
}
