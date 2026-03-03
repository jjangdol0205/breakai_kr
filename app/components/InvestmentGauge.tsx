import React from 'react';
import dynamic from 'next/dynamic';

const GaugeComponent = dynamic(() => import('react-gauge-component'), { ssr: false });

interface Props {
    score: number;
}

const InvestmentGauge: React.FC<Props> = ({ score }) => {
    return (
        <div className="w-full h-full flex flex-col items-center justify-center">
            {/* Gauge Wrapper */}
            <div className="w-[200px] h-[120px] relative">
                {/* @ts-ignore */}
                <GaugeComponent
                    value={score}
                    type="semicircle"
                    arc={{
                        width: 0.12,
                        padding: 0.02,
                        cornerRadius: 1,
                        gradient: false,
                        subArcs: [
                            {
                                limit: 30,
                                color: '#3b82f6', // Blue-500 (Sell)
                                showTick: false,
                                tooltip: { text: '강력 매도' }
                            },
                            {
                                limit: 70,
                                color: '#eab308', // Yellow-500 (Hold)
                                showTick: false,
                                tooltip: { text: '중립 (보유)' }
                            },
                            {
                                limit: 100,
                                color: '#ef4444', // Red-500 (Buy)
                                showTick: false,
                                tooltip: { text: '강력 매수' }
                            }
                        ]
                    }}
                    pointer={{
                        color: '#52525b', // Zinc-600
                        length: 0.80,
                        width: 12,
                    }}
                    labels={{
                        valueLabel: { formatTextValue: (value: any) => value + '', style: { fontSize: 35, fill: '#fff', fontWeight: 'bold', textShadow: 'none' } },
                        tickLabels: {
                            type: 'outer',
                            defaultTickValueConfig: { formatTextValue: (value: any) => value + '', style: { fontSize: 10, fill: '#71717a' } },
                        }
                    }}
                />
            </div>
            <div className="text-center mt-4">
                <div className="inline-block px-3 py-1 rounded-full bg-zinc-800 text-xs font-bold text-zinc-400 tracking-widest border border-zinc-700">
                    AI 투자 점수
                </div>
            </div>
        </div>
    );
};

export default InvestmentGauge;
