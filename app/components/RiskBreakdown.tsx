import React from 'react';

interface ComponentProps {
    breakdown: {
        divergence: number;
        solvency: number;
        insider: number;
        valuation: number;
    };
    isPro?: boolean;
}

const RiskBreakdown: React.FC<ComponentProps> = ({ breakdown, isPro = false }) => {
    if (!breakdown) return null;

    const maxScores = {
        divergence: 40,
        solvency: 30,
        insider: 20,
        valuation: 10
    };

    const getColor = (score: number, max: number) => {
        const ratio = score / max;
        if (ratio > 0.7) return "bg-red-500"; // High Risk
        if (ratio > 0.3) return "bg-yellow-500"; // Medium Risk
        return "bg-[#FF3333]"; // Low Risk
    };

    return (
        <div className="relative mt-4 font-mono text-xs">
            <div className="space-y-3">
                {Object.entries(breakdown).map(([key, score]) => {
                    const max = maxScores[key as keyof typeof maxScores] || 100;
                    const color = getColor(score, max);
                    const width = `${(score / max) * 100}%`;

                    return (
                        <div key={key}>
                            <div className="flex justify-between mb-1 text-gray-400 uppercase">
                                <span>{key === 'divergence' ? '괴리도' : key === 'solvency' ? '지불능력' : key === 'insider' ? '내부자 거래' : key === 'valuation' ? '가치 평가' : key} 분석</span>
                                <span className={score > max / 2 ? 'text-red-400' : 'text-gray-400'}>
                                    {score} / {max}
                                </span>
                            </div>
                            <div className="w-full bg-[#111] h-2 rounded overflow-hidden border border-[#333]">
                                <div
                                    className={`h-full ${color} transition-all duration-1000`}
                                    style={{ width: width }}
                                ></div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default RiskBreakdown;
