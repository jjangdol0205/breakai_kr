import { Shield, BrainCircuit, LineChart, Cpu, Fingerprint, Activity } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
    return (
        <div className="min-h-[85vh] flex flex-col items-center justify-center p-6 mb-20 font-sans selection:bg-[#FF3333]/30">

            <div className="max-w-4xl w-full text-center space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700 relative z-10">
                {/* Background Ambient Glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#FF3333]/5 rounded-full blur-[120px] pointer-events-none -z-10"></div>

                {/* Header */}
                <div className="space-y-6 pt-12">
                    <div className="inline-flex items-center gap-2 mb-2 bg-red-950/30 text-[#FF3333] border border-[#FF3333]/30 px-5 py-2 rounded-full shadow-[0_0_15px_rgba(0,255,65,0.15)]">
                        <Activity className="w-4 h-4 animate-pulse" />
                        <span className="font-bold text-xs tracking-widest uppercase font-mono">시스템 아키텍처</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF3333] to-emerald-600">Breakout AI</span> 소개
                    </h1>
                    <p className="text-xl md:text-2xl text-zinc-400 font-mono tracking-widest uppercase mt-4">
                        '하루 하나만 찾는다' 프로토콜
                    </p>
                </div>

                {/* Core Message */}
                <div className="bg-[#050505] border-l-4 border-l-[#FF3333] border-t border-b border-r border-zinc-800 p-8 md:p-12 rounded-r-2xl shadow-[0_0_40px_rgba(0,255,65,0.05)] text-left relative overflow-hidden group hover:border-[#FF3333]/50 transition-colors duration-500">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-[#FF3333]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

                    <p className="text-lg md:text-xl text-zinc-300 leading-relaxed font-mono relative z-10">
                        대부분의 개인 투자자들은 정보의 홍수 속에서 길을 잃습니다. 수천 개의 주식을 훑어보고, 상충되는 의견에 귀 기울이며 감정에 치우친 매매를 합니다. <strong className="text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]">Breakout AI는 노이즈를 제거하고 기관 수준의 검증을 거친, 가장 비대칭적인 '단 하나의 셋업'만을 하루에 제공합니다.</strong>
                    </p>
                    <p className="mt-8 text-zinc-500 font-medium text-sm md:text-base leading-relaxed font-mono relative z-10">
                        Breakout AI의 독자적인 퀀트 스크리너는 매일 4,000개 이상의 유동성 높은 미국 주식을 분석합니다. 윌리엄 오닐의 <span className="text-[#FF3333]">CAN SLIM</span> 프레임워크와 변동성 축소 패턴(VCP)을 신경망 엔진에 엄격하게 코딩했습니다. 압도적인 거래량과 펀더멘털의 뒷받침을 받으며 대규모 기관 매수세의 정확한 수학적 시그널을 보여주는 주식만을 포착합니다. 만약 이 극단적인 기술적 기준을 충족하는 주식이 없다면, <span className="text-blue-500 font-bold border-b border-blue-500/50">우리는 억지로 추천하지 않습니다.</span>
                    </p>
                </div>

            </div>

            {/* Universe Criteria Breakdown - Added for Trust */}
            <div className="text-left mt-24 mb-8">
                <div className="flex items-center gap-4 mb-8">
                    <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-zinc-800"></div>
                    <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white uppercase font-mono text-center">
                        유니버스 필터링 기준
                    </h2>
                    <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-zinc-800"></div>
                </div>

                <p className="text-zinc-400 font-mono text-center max-w-2xl mx-auto mb-12">
                    주식을 기술적 셋업으로 평가하기 전에, 기관급 수준의 매매가 가능하도록 타협 없는 유동성 및 품질 필터를 통과해야 합니다.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                    {/* Criterion 1 */}
                    <div className="relative pl-6 border-l border-zinc-800 hover:border-[#FF3333]/50 transition-colors group">
                        <div className="absolute left-[-5px] top-0 w-2 h-2 rounded-full bg-zinc-800 group-hover:bg-[#FF3333] group-hover:shadow-[0_0_10px_rgba(0,255,65,0.8)] transition-all"></div>
                        <h4 className="text-[#FF3333] font-black uppercase font-mono text-sm tracking-widest mb-2">01. 기업 가치</h4>
                        <p className="text-white font-bold mb-1 font-mono text-sm">시가총액 &gt; 20억 달러 이상</p>
                        <p className="text-zinc-500 text-sm font-mono leading-relaxed">개인들의 노이즈에 의해 주가 흐름이 쉽게 조작되는 초소형주와 페니 주식은 엄격히 배제합니다. 우리 알고리즘은 오직 기관의 자금 유입을 감당할 수 있는 탄탄한 중대형주에만 집중합니다.</p>
                    </div>

                    {/* Criterion 2 */}
                    <div className="relative pl-6 border-l border-zinc-800 hover:border-[#FF3333]/50 transition-colors group">
                        <div className="absolute left-[-5px] top-0 w-2 h-2 rounded-full bg-zinc-800 group-hover:bg-[#FF3333] group-hover:shadow-[0_0_10px_rgba(0,255,65,0.8)] transition-all"></div>
                        <h4 className="text-[#FF3333] font-black uppercase font-mono text-sm tracking-widest mb-2">02. 풍부한 유동성</h4>
                        <p className="text-white font-bold mb-1 font-mono text-sm">50일 평균 거래량 &gt; 50만 주 이상</p>
                        <p className="text-zinc-500 text-sm font-mono leading-relaxed">슬리피지를 방지하고 원활한 진입 및 청산을 보장하기 위해 대규모 일일 평균 거래량을 요구합니다. 진정한 돌파매매는 기관의 강력하고 명확한 매수세에 의해 뒷받침되어야 합니다.</p>
                    </div>

                    {/* Criterion 3 */}
                    <div className="relative pl-6 border-l border-zinc-800 hover:border-[#FF3333]/50 transition-colors group">
                        <div className="absolute left-[-5px] top-0 w-2 h-2 rounded-full bg-zinc-800 group-hover:bg-[#FF3333] group-hover:shadow-[0_0_10px_rgba(0,255,65,0.8)] transition-all"></div>
                        <h4 className="text-[#FF3333] font-black uppercase font-mono text-sm tracking-widest mb-2">03. 최소 진입가</h4>
                        <p className="text-white font-bold mb-1 font-mono text-sm">주가 &gt; $15.00 이상</p>
                        <p className="text-zinc-500 text-sm font-mono leading-relaxed">대부분의 기관 자금(뮤추얼 펀드, 연기금 등)은 법적으로 $10~$15 미만의 주식 매수를 금지하고 있습니다. 우리의 스크리너는 이러한 기준에 맞춰 '스마트 머니'가 실제로 매수할 수 있는 셋업만을 추려냅니다.</p>
                    </div>

                    {/* Criterion 4 */}
                    <div className="relative pl-6 border-l border-zinc-800 hover:border-[#FF3333]/50 transition-colors group">
                        <div className="absolute left-[-5px] top-0 w-2 h-2 rounded-full bg-zinc-800 group-hover:bg-[#FF3333] group-hover:shadow-[0_0_10px_rgba(0,255,65,0.8)] transition-all"></div>
                        <h4 className="text-[#FF3333] font-black uppercase font-mono text-sm tracking-widest mb-2">04. 펀더멘털 기반</h4>
                        <p className="text-white font-bold mb-1 font-mono text-sm">매출/EPS 성장 모멘텀</p>
                        <p className="text-zinc-500 text-sm font-mono leading-relaxed">사양 산업에 속한 기업의 완벽한 차트는 의미가 없습니다. 차트 패턴을 평가하기 전에 최근 어닝 서프라이즈, 가파른 매출 성장, 마진율 확대 등 긍정적인 펀더멘털 촉매를 먼저 스크리닝합니다.</p>
                    </div>
                </div>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left mt-16">
                <div className="bg-[#0a0a0c] p-8 rounded-2xl border border-zinc-800 hover:border-[#FF3333]/40 hover:shadow-[0_0_30px_rgba(0,255,65,0.1)] transition-all group">
                    <div className="bg-red-950/30 w-14 h-14 rounded-xl flex items-center justify-center mb-6 border border-[#FF3333]/20 group-hover:bg-[#FF3333]/20 transition-colors">
                        <Cpu className="w-7 h-7 text-[#FF3333]" />
                    </div>
                    <h3 className="text-white font-black mb-3 font-mono uppercase tracking-widest text-sm">알고리즘 정밀도</h3>
                    <p className="text-sm text-zinc-500 font-mono leading-relaxed">풍부한 유동성을 가진 유니버스를 스캔하여 인간의 편향을 완전히 배제하고 정확한 수학적 진입점을 파악하여, 깊은 베이스나 2차 매수 구간의 명확한 피봇을 매핑합니다.</p>
                </div>

                <div className="bg-[#0a0a0c] p-8 rounded-2xl border border-zinc-800 hover:border-[#FF3333]/40 hover:shadow-[0_0_30px_rgba(0,255,65,0.1)] transition-all group">
                    <div className="bg-red-950/30 w-14 h-14 rounded-xl flex items-center justify-center mb-6 border border-[#FF3333]/20 group-hover:bg-[#FF3333]/20 transition-colors">
                        <LineChart className="w-7 h-7 text-[#FF3333]" />
                    </div>
                    <h3 className="text-white font-black mb-3 font-mono uppercase tracking-widest text-sm">스마트 머니 흐름</h3>
                    <p className="text-sm text-zinc-500 font-mono leading-relaxed">돌파매매는 기관의 자금 운용이 뒷받침될 때만 성공합니다. 뮤추얼 펀드 및 국부 펀드의 매집을 확인하는 비정상적인 거래량 급증을 모니터링합니다.</p>
                </div>

                <div className="bg-[#0a0a0c] p-8 rounded-2xl border border-zinc-800 hover:border-[#FF3333]/40 hover:shadow-[0_0_30px_rgba(0,255,65,0.1)] transition-all group">
                    <div className="bg-red-950/30 w-14 h-14 rounded-xl flex items-center justify-center mb-6 border border-[#FF3333]/20 group-hover:bg-[#FF3333]/20 transition-colors">
                        <Fingerprint className="w-7 h-7 text-[#FF3333]" />
                    </div>
                    <h3 className="text-white font-black mb-3 font-mono uppercase tracking-widest text-sm">심층 분석 데이터</h3>
                    <p className="text-sm text-zinc-500 font-mono leading-relaxed">펀더멘털적 근거가 없는 기술적 반등은 함정입니다. 모든 셋업에 승인을 내리기 전, 방대한 자료에 대한 심층 AI 리서치를 통해 기업 가치 내러티브를 검증합니다.</p>
                </div>
            </div>


        </div>
    );
}
