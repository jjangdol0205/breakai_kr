"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

export default function HeroSearch() {
    const [companyName, setCompanyName] = useState("");
    const router = useRouter();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (companyName.trim()) {
            // URL에 기업명을 직접 넣음
            router.push(`/hub/${encodeURIComponent(companyName.trim())}`);
        }
    };

    return (
        <div className="max-w-xl mx-auto mt-8 flex flex-col items-center gap-5">
            <form onSubmit={handleSearch} className="w-full relative shadow-2xl group">
                <input
                    type="text"
                    placeholder="기업명 입력 (예: 삼성전자, 카카오)"
                    className="w-full bg-black/40 border border-white/10 rounded-full py-4 pl-6 pr-14 text-white placeholder:text-zinc-500 focus:outline-none focus:border-red-500/50 focus:bg-zinc-900/80 transition-all font-sans text-lg font-medium backdrop-blur-md shadow-inner"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                />
                <button
                    type="submit"
                    className="absolute right-2 top-2 bottom-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-400 hover:to-red-500 text-white p-2 rounded-full transition-all shadow-md flex items-center justify-center w-12 group-focus-within:bg-red-500"
                >
                    <Search className="w-5 h-5 font-bold" />
                </button>
            </form>

            <div className="flex flex-col sm:flex-row gap-3 mt-2 w-full sm:w-auto px-4 sm:px-0">
                <button
                    onClick={() => router.push(`/hub/${encodeURIComponent('삼성전자')}`)}
                    className="w-full sm:w-auto bg-zinc-800/50 hover:bg-white/10 border border-white/5 px-6 py-2.5 rounded-full text-sm font-bold shadow-sm text-zinc-300 transition-all hover:-translate-y-0.5"
                >
                    🎁 무료 삼성전자 리포트 확인하기
                </button>
            </div>
        </div>
    );
}
