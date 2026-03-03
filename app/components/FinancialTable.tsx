import React from 'react';

interface FinancialTableProps {
    data: {
        [key: string]: string;
    };
}

// Helper to format keys like "revenue_trend" -> "Revenue Trend"
const formatKey = (key: string) => {
    return key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
};

export default function FinancialTable({ data, isPro = false }: FinancialTableProps & { isPro?: boolean }) {
    if (!data || Object.keys(data).length === 0) return null;

    return (
        <div className="relative overflow-x-auto rounded-2xl border border-white/5 shadow-inner bg-zinc-900/40">


            <table className="w-full text-sm text-left font-sans">
                <thead className="text-xs text-zinc-400 uppercase bg-black/40 border-b border-white/5 backdrop-blur-md">
                    <tr>
                        <th scope="col" className="px-6 py-5 font-bold tracking-wide">지표</th>
                        <th scope="col" className="px-6 py-5 font-bold tracking-wide text-right">값 / 추세</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/5 bg-transparent">
                    {Object.entries(data).map(([key, value]) => {
                        // Determine color based on content (simple heuristic)
                        const isPositive = typeof value === 'string' && (value.includes('+') || value.toLowerCase().includes('up') || value.toLowerCase().includes('expand'));
                        const isNegative = typeof value === 'string' && (value.includes('-') || value.toLowerCase().includes('down') || value.toLowerCase().includes('contract') || value.toLowerCase().includes('high'));

                        const textColor = isPositive ? 'text-red-400' : (isNegative ? 'text-blue-400' : 'text-zinc-300');

                        return (
                            <tr key={key} className="hover:bg-white/5 transition-colors group">
                                <td className="px-6 py-4 font-medium text-zinc-300 tracking-wide">
                                    {formatKey(key)}
                                </td>
                                <td className={`px-6 py-4 text-right font-bold tracking-wide ${textColor}`}>
                                    {value as React.ReactNode}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
