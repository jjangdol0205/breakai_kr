"use client";
import Link from "next/link";
import React from "react";
import CompanyLogo from "./CompanyLogo";

interface StockCardProps {
    ticker: string;
    name: string;
    price: string | number;
    changePercent: number;
    isFreeSample?: boolean;
}

export default function StockCard({ ticker, name, price, changePercent, isFreeSample }: StockCardProps) {
    const isPositive = changePercent >= 0;
    const colorClass = isPositive ? "text-red-400" : "text-blue-400";
    const sign = isPositive ? "+" : "";

    return (
        <Link href={`/hub/${ticker}`}>
            <div className="bg-zinc-900/40 border border-white/5 rounded-3xl p-6 hover:-translate-y-1 transition-all duration-300 hover:border-white/10 cursor-pointer shadow-lg flex justify-between items-center group backdrop-blur-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-[40px] pointer-events-none group-hover:bg-white/10 transition-colors"></div>
                <div className="flex items-center gap-5 relative z-10">
                    <CompanyLogo
                        ticker={ticker}
                        className="w-14 h-14 rounded-2xl object-contain bg-white p-1.5 shrink-0 shadow-sm"
                    />
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-black text-white text-xl tracking-tight group-hover:text-amber-400 transition-colors font-sans">
                                {name}
                            </h3>
                            {isFreeSample && (
                                <span className="bg-amber-500/20 text-amber-500 border border-amber-500/30 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full tracking-wide shadow-[0_0_10px_rgba(245,158,11,0.2)]">
                                    무료 샘플
                                </span>
                            )}
                        </div>
                        <p className="text-zinc-500 font-sans font-medium text-sm tracking-wide">{ticker}</p>
                    </div>
                </div>

                <div className="text-right relative z-10">
                    <p className="font-sans text-2xl font-black text-white tracking-tight">{typeof price === 'number' ? `₩${price.toLocaleString('ko-KR')}` : price}</p>
                    <p className={`font-sans text-sm font-bold tracking-wide mt-1 ${colorClass}`}>
                        {sign}{typeof changePercent === 'number' ? changePercent.toFixed(2) : changePercent}%
                    </p>
                </div>
            </div>
        </Link>
    );
}
