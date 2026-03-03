import { TrendingUp, Award, Users } from "lucide-react";

export default function SocialProof() {
    return (
        <section className="mb-20">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl flex items-center gap-4">
                    <div className="bg-red-500/10 p-3 rounded-xl text-red-500">
                        <TrendingUp className="w-6 h-6" />
                    </div>
                    <div>
                        <div className="text-2xl font-black text-white">87.4%</div>
                        <div className="text-xs text-zinc-500 font-mono">승률 (2025년 3분기)</div>
                    </div>
                </div>
                <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl flex items-center gap-4">
                    <div className="bg-amber-500/10 p-3 rounded-xl text-amber-500">
                        <Award className="w-6 h-6" />
                    </div>
                    <div>
                        <div className="text-2xl font-black text-white">10M+</div>
                        <div className="text-xs text-zinc-500 font-mono">스캔된 데이터 포인트</div>
                    </div>
                </div>
                <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl flex items-center gap-4">
                    <div className="bg-blue-500/10 p-3 rounded-xl text-blue-500">
                        <Users className="w-6 h-6" />
                    </div>
                    <div>
                        <div className="text-2xl font-black text-white">4,200+</div>
                        <div className="text-xs text-zinc-500 font-mono">활성 PRO 트레이더</div>
                    </div>
                </div>
            </div>

            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <span>🎯</span> 최근 AI 분석 적중 사례
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[#09090b] border border-zinc-800 p-6 rounded-xl hover:border-red-500/30 transition-colors">
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-3">
                            <span className="text-xl font-bold text-white">PLTR</span>
                            <span className="bg-red-500/20 text-red-500 text-xs px-2 py-1 rounded font-bold">매수 평가</span>
                        </div>
                        <span className="text-red-500 font-mono font-bold">+18.4%</span>
                    </div>
                    <p className="text-sm text-zinc-400 italic">"국방부 계약 유출 48시간 전에 거대한 다크풀 매집을 포착했습니다. 개인 투자자들은 이 자금 유입을 전혀 알지 못했습니다."</p>
                    <div className="mt-4 text-xs text-zinc-600 font-mono">생성일: 3일 전</div>
                </div>

                <div className="bg-[#09090b] border border-zinc-800 p-6 rounded-xl hover:border-blue-500/30 transition-colors">
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-3">
                            <span className="text-xl font-bold text-white">LULU</span>
                            <span className="bg-blue-500/20 text-blue-500 text-xs px-2 py-1 rounded font-bold">매도 평가</span>
                        </div>
                        <span className="text-blue-500 font-mono font-bold">-12.1%</span>
                    </div>
                    <p className="text-sm text-zinc-400 italic">"CEO가 실적 발표에서 얼버무리려 했던 10-Q 주석의 심각한 재고 과잉을 적발했습니다."</p>
                    <div className="mt-4 text-xs text-zinc-600 font-mono">생성일: 1주일 전</div>
                </div>
            </div>

            <p className="text-center text-xs text-zinc-600 mt-6">* 과거의 실적이 미래의 결과를 보장하지 않습니다. 본 정보는 투자 자문이 아닙니다.</p>
        </section>
    );
}
