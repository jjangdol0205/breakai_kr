"use client";

import React, { useEffect, useState } from "react";

const MESSAGES = [
    "보안 메인프레임 접속 중...",
    "방화벽 우회 중...",
    "10-K 공시 자료 해독 중...",
    "CEO 연설 패턴 분석 중...",
    "내부자 거래 감지 중...",
    "위험 지표 계산 중...",
    "GEMINI AI와 동기화 중...",
    "리포트 마무리 중..."
];

export default function TerminalLoader() {
    const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
    const [displayedText, setDisplayedText] = useState("");
    const [charIndex, setCharIndex] = useState(0);

    useEffect(() => {
        const typingInterval = setInterval(() => {
            const currentMessage = MESSAGES[currentMessageIndex];

            if (charIndex < currentMessage.length) {
                setDisplayedText((prev) => prev + currentMessage[charIndex]);
                setCharIndex((prev) => prev + 1);
            } else {
                // Message complete, wait and clear
                clearInterval(typingInterval);
                setTimeout(() => {
                    setDisplayedText("");
                    setCharIndex(0);
                    setCurrentMessageIndex((prev) => (prev + 1) % MESSAGES.length);
                }, 1000);
            }
        }, 50); // Typing speed

        return () => clearInterval(typingInterval);
    }, [charIndex, currentMessageIndex]);

    return (
        <div className="flex flex-col items-center justify-center p-8 space-y-4">
            {/* Glitch Effect Container */}
            <div className="relative">
                <div className="text-[#FF3333] font-mono text-xl tracking-widest animate-pulse">
                    running_analysis.exe
                </div>
            </div>

            {/* Typing Text */}
            <div className="h-8 font-mono text-[#FF3333] text-sm">
                <span className="mr-2">{">"}</span>
                {displayedText}
                <span className="animate-blink inline-block w-2 h-4 bg-[#FF3333] ml-1 align-middle"></span>
            </div>

            {/* Loading Bar */}
            <div className="w-64 h-2 bg-[#333] rounded overflow-hidden mt-4">
                <div className="h-full bg-[#FF3333] animate-progress"></div>
            </div>

            <style jsx>{`
        @keyframes progress {
          0% { width: 0%; }
          50% { width: 70%; }
          100% { width: 100%; }
        }
        .animate-progress {
          animation: progress 2s infinite ease-in-out;
        }
        .animate-blink {
          animation: blink 1s step-end infinite;
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
        </div>
    );
}
