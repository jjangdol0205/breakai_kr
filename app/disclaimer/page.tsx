export default function Disclaimer() {
    return (
        <div className="max-w-4xl mx-auto px-6 py-20 text-slate-300 font-sans leading-relaxed">
            <h1 className="text-4xl font-bold text-white mb-8 border-b border-[#333] pb-4">면책조항 (재무 및 법적 고지)</h1>
            <p className="text-sm text-zinc-500 mb-8 font-mono">마지막 업데이트: 2026년 2월</p>

            <div className="space-y-8">
                <section>
                    <h2 className="text-2xl font-semibold text-red-400 mb-4">1. 투자 자문 아님</h2>
                    <p>
                        본 웹사이트("Breakout AI")에서 제공되는 정보는 일반적인 정보 제공 및 교육 목적으로만 사용됩니다. 모든 정보는 최고의 선의를 바탕으로 제공되나, 당사는 본 사이트 정보의 정확성, 적절성, 타당성, 신뢰성, 가용성 또는 완전성에 대하여 통제할 수 없으며 명시적이거나 묵시적인 어떠한 형태의 진술이나 법적 보증도 하지 않습니다.
                    </p>
                    <div className="mt-6 p-6 bg-blue-500/10 border-l-4 border-blue-500 rounded-r-lg">
                        <p className="text-white font-bold mb-2">필수 고지사항:</p>
                        <p className="text-rose-200">
                            <strong>당사는 공인된 재무 전문가가 아니며, 투자 자문을 제공할 의도가 없습니다.</strong> 본 웹사이트에 제시된 AI 기반 주식 추천, 심층 분석 및 데이터는 전문적인 재무 자문으로 절대 해석되어서는 안 됩니다. 귀하는 투자 결정을 내리기 전에 반드시 자격을 갖춘 공인 재무 전문가와 상담해야 합니다.
                        </p>
                    </div>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold text-red-400 mb-4">2. 거래 위험성 고지</h2>
                    <p>
                        주식, 옵션 및 암호화폐를 포함한 글로벌 금융 시장에서의 거래는 극도로 높은 수준의 위험을 수반하며 모든 투자자에게 적합하지 않을 수 있습니다. 귀하는 초기 투자금의 일부 또는 전부를 잃을 수 있습니다. 본 사이트에서 제공되는 과거의 성과 지표, 투자 수익률(ROI) 디스플레이 또는 시뮬레이션된 알고리즘 테스트 결과는 오직 설명 목적으로만 제공되며 미래의 잠재적인 결과를 보장하지 않습니다.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold text-red-400 mb-4">3. 알고리즘 프로세싱 및 AI의 제약 조건</h2>
                    <p>
                        Breakout AI는 기술적 분석 프레임워크(특히 컵 앤 핸들 패턴의 변형)를 대규모 언어 모델(LLM)과 결합하여 자동으로 펀더멘털 보고서를 생성합니다. 시스템의 근본적인 한계는 다음과 같습니다:
                    </p>
                    <ul className="list-disc pl-6 mt-4 space-y-2 text-zinc-400">
                        <li>LLM 등 AI 모델은 환각(Hallucination) 현상을 일으키거나 사실과 명백히 다른 잘못된 결과를 출력할 수 있습니다.</li>
                        <li>부족한 유동성, 일시적인 시장 변동폭의 급증 등으로 인해 자동화된 스크리너가 오류(False Positive)를 식별할 수 있습니다.</li>
                        <li>제공되는 금융 데이터 및 기술적 지표는 지연될 수 있으며 실시간 시장 상황을 즉각적으로 반영하지 못할 수 있습니다.</li>
                    </ul>
                    <p className="mt-4">귀하는 본 웹사이트에서 알고리즘에 의해 제공된 정보를 기반으로 직접 취한 매매 행동으로 인해 발생한 어떠한 직간접적인 손실에 대해서도 Breakout AI, 창립자, 또는 그 계열사에 법적인 책임을 묻지 않을 것에 동의합니다.</p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold text-red-400 mb-4">4. 외부 링크 면책 조항</h2>
                    <p>
                        본 사이트에는 제3자가 소유하거나 제공하는 외부 웹사이트에 대한 링크, 배너 및 기타 외부 광고가 포함되거나 연결될 수 있습니다. 당사는 이러한 외부 링크의 정확성, 적절성, 타당성, 신뢰성, 가용성 또는 완전성을 조사, 모니터링 또는 사전에 확인할 의무가 없습니다.
                    </p>
                </section>
            </div>
        </div>
    );
}
