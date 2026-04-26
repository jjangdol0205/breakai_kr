"use client";

import { useState } from "react";
import RequestCompanyModal from "./RequestCompanyModal";
import Link from "next/link";

export default function TopNav() {
    const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);

    return (
        <>
            <header className="border-b border-white/5 py-4 px-6 flex justify-between items-center bg-zinc-950/80 backdrop-blur-xl sticky top-0 z-50">
                <Link href="/" className="text-2xl font-serif font-black tracking-tight text-white hover:text-red-500 transition-colors">
                    BREAKAI<span className="text-red-500 text-3xl leading-none">.</span>
                </Link>
                <nav className="flex items-center text-sm text-zinc-400 font-bold tracking-wide gap-8">
                    <Link href="/briefing" className="cursor-pointer hover:text-white transition-colors hidden md:inline font-sans font-semibold">마켓 브리핑</Link>
                    <Link href="/picks" className="cursor-pointer text-white hover:text-red-400 transition-colors hidden md:inline flex items-center gap-2">오늘의 픽 <span className="text-[10px] bg-red-500/20 text-red-500 border border-red-500/30 px-2 py-0.5 rounded-full shadow-[0_0_10px_rgba(239,68,68,0.2)]">LIVE</span></Link>
                    <Link href="/about" className="cursor-pointer hover:text-white transition-colors hidden md:inline font-sans font-semibold">서비스 소개</Link>

                    <div className="w-px h-4 bg-zinc-700 mx-2 hidden md:block"></div>
                </nav>
            </header>

            <RequestCompanyModal
                isOpen={isRequestModalOpen}
                onClose={() => setIsRequestModalOpen(false)}
            />
        </>
    );
}
