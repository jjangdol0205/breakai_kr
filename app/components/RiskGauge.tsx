"use client";

import React, { useEffect, useState } from "react";

interface RiskGaugeProps {
    score: number;
}

export default function RiskGauge({ score }: RiskGaugeProps) {
    // Normalize score to 0-100 just in case
    const normalizedScore = Math.min(Math.max(score, 0), 100);

    // Animation state
    const [currentScore, setCurrentScore] = useState(0);

    useEffect(() => {
        // Animate the needle
        const timeout = setTimeout(() => {
            setCurrentScore(normalizedScore);
        }, 100);
        return () => clearTimeout(timeout);
    }, [normalizedScore]);

    // Determine color based on score (0-30 Safe, 31-70 Caution, 71-100 Danger)
    const getColor = (s: number) => {
        if (s <= 30) return "#FF3333"; // Neon Green (Safe)
        if (s <= 70) return "#facc15"; // Yellow (Caution)
        return "#ef4444"; // Red (Danger)
    };

    const color = getColor(normalizedScore);

    // Calculate needle rotation (-90deg to 90deg)
    // 0 -> -90, 50 -> 0, 100 -> 90
    const rotation = (currentScore / 100) * 180 - 90;

    return (
        <div className="flex flex-col items-center justify-center relative w-full max-w-[200px] mx-auto">
            {/* Gauge SVG */}
            <svg viewBox="0 0 200 110" className="w-full h-auto drop-shadow-[0_0_10px_rgba(0,255,65,0.3)]">
                {/* Background Arc */}
                <path
                    d="M 20 100 A 80 80 0 0 1 180 100"
                    fill="none"
                    stroke="#333"
                    strokeWidth="20"
                    strokeLinecap="butt"
                />

                {/* Dynamic Colored Arc (Gradient implementation is tricky in SVG simply, 
            so we might use 3 segments or just change color) 
            For now, let's use a gradient def */}
                <defs>
                    <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#FF3333" />
                        <stop offset="50%" stopColor="#facc15" />
                        <stop offset="100%" stopColor="#ef4444" />
                    </linearGradient>
                </defs>

                <path
                    d="M 20 100 A 80 80 0 0 1 180 100"
                    fill="none"
                    stroke="url(#gaugeGradient)"
                    strokeWidth="20"
                    strokeLinecap="butt"
                    strokeDasharray="251.2" // Circumference of semi-circle (PI * 80 ~= 251.2)
                    strokeDashoffset="0"
                    className="opacity-80"
                />

                {/* Needle */}
                <g
                    transform={`translate(100, 100) rotate(${rotation})`}
                    className="transition-transform duration-1000 ease-out"
                >
                    <path d="M -5 0 L 0 -90 L 5 0 Z" fill={color} />
                    <circle cx="0" cy="0" r="8" fill="#fff" />
                </g>

                {/* Labels */}
                <text x="20" y="125" textAnchor="middle" fill="#FF3333" fontSize="12" fontWeight="bold">0</text>
                <text x="180" y="125" textAnchor="middle" fill="#ef4444" fontSize="12" fontWeight="bold">100</text>
            </svg>

            {/* Digital Score */}
            <div className="text-center mt-2">
                <span
                    className="text-4xl font-bold tracking-tighter drop-shadow-[0_0_5px_currentColor]"
                    style={{ color }}
                >
                    {Math.round(currentScore)}
                </span>
                <div className="text-xs text-gray-400 uppercase tracking-widest mt-1">
                    위험 점수
                </div>
            </div>
        </div>
    );
}
