import { Shield, Brain, Zap } from "lucide-react";

export default function HowItWorks() {
    return (
        <section className="mb-20 pb-10 border-b border-zinc-900">
            <div className="text-center mb-12">
                <h3 className="text-3xl font-black text-white mb-4">어떻게 작동하나요?</h3>
                <p className="text-zinc-400">AI로 간소화된 기관급 심층 리서치.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                <div className="hidden md:block absolute top-[40px] left-[15%] w-[70%] h-0.5 bg-gradient-to-r from-zinc-800 via-emerald-500/20 to-zinc-800 -z-10"></div>

                {/* Step 1 */}
                <div className="bg-[#09090b] border border-zinc-800 p-8 rounded-2xl text-center relative hover:border-red-500/50 transition-colors">
                    <div className="w-16 h-16 bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl relative z-10">
                        <Shield className="w-8 h-8" />
                    </div>
                    <div className="absolute top-0 right-0 p-4 font-mono font-bold text-6xl text-zinc-900/50 pointer-events-none">1</div>
                    <h4 className="text-xl font-bold text-white mb-3">데이터 수집</h4>
                    <p className="text-zinc-400 text-sm leading-relaxed">
                        개인 투자자들이 놓치는 10,000개 이상의 SEC 보고서, 최근 10-Q/10-K 양식, 내부자 거래 및 실시간 다크풀 거래량을 스캔합니다.
                    </p>
                </div>

                {/* Step 2 */}
                <div className="bg-[#09090b] border border-zinc-800 p-8 rounded-2xl text-center relative hover:border-red-500/50 transition-colors">
                    <div className="w-16 h-16 bg-red-500/20 border border-red-500/30 text-red-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_20px_rgba(16,185,129,0.2)] relative z-10">
                        <Brain className="w-8 h-8" />
                    </div>
                    <div className="absolute top-0 right-0 p-4 font-mono font-bold text-6xl text-zinc-900/50 pointer-events-none">2</div>
                    <h4 className="text-xl font-bold text-white mb-3">AI 프로세싱</h4>
                    <p className="text-zinc-400 text-sm leading-relaxed">
                        우리의 특화된 월스트리트 알고리즘이 원시 펀더멘털 데이터를 엘리엇 파동 및 단계 분석과 같은 기술적 차트 구조와 교차 검증합니다.
                    </p>
                </div>

                {/* Step 3 */}
                <div className="bg-[#09090b] border border-zinc-800 p-8 rounded-2xl text-center relative hover:border-red-500/50 transition-colors">
                    <div className="w-16 h-16 bg-amber-500/20 border border-amber-500/30 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_20px_rgba(245,158,11,0.2)] relative z-10">
                        <Zap className="w-8 h-8" />
                    </div>
                    <div className="absolute top-0 right-0 p-4 font-mono font-bold text-6xl text-zinc-900/50 pointer-events-none">3</div>
                    <h4 className="text-xl font-bold text-white mb-3">실행 가능한 인사이트</h4>
                    <p className="text-zinc-400 text-sm leading-relaxed">
                        기업의 포장이 제거된 솔직한 평가(매수/매도)와 명확한 강세 및 약세 시나리오를 단 10초 만에 받아보세요.
                    </p>
                </div>
            </div>
        </section>
    );
}
