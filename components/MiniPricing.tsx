import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export default function MiniPricing() {
    // Temporarily hidden for pre-monetization free tier
    if (true) return null;

    return (
        <section className="mt-24 mb-10">
            <div className="max-w-3xl mx-auto bg-gradient-to-b from-zinc-900 to-black border border-zinc-800 rounded-3xl p-10 text-center shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent"></div>

                <h3 className="text-3xl font-black text-white mb-4 tracking-tight">감으로 하는 매매는 이제 그만.</h3>
                <p className="text-zinc-400 mb-8 max-w-xl mx-auto text-lg">
                    월스트리트 기관들은 대체 데이터에 수백만 달러를 지출합니다. 커피 한 잔 값으로 당신도 같은 무기를 가질 수 있습니다.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-8">
                    <div className="flex items-center gap-2 text-zinc-300">
                        <CheckCircle2 className="w-5 h-5 text-red-500" />
                        <span>즉각적인 접근</span>
                    </div>
                    <div className="flex items-center gap-2 text-zinc-300">
                        <CheckCircle2 className="w-5 h-5 text-red-500" />
                        <span>언제든 취소 가능</span>
                    </div>
                    <div className="flex items-center gap-2 text-zinc-300">
                        <CheckCircle2 className="w-5 h-5 text-red-500" />
                        <span>무제한 리포트 열람</span>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                    <Link href="/pricing" className="w-full sm:w-auto px-8 py-4 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-xl transition-all">
                        일일권 ($9.99)
                    </Link>
                    <Link href="/pricing" className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-black font-black rounded-xl shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all transform hover:scale-105">
                        Pro 이용권 시작하기 (추천)
                    </Link>
                </div>
            </div>
        </section>
    );
}
