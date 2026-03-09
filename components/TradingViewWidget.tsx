"use client";
import React, { useEffect, useRef } from 'react';

export default function TradingViewWidget({ ticker }: { ticker: string }) {
  const containerId = `tv_chart_${ticker}`;
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/tv.js";
    script.async = true;
    script.onload = () => {
      if (window.TradingView && containerRef.current) {
        new window.TradingView.widget({
          autosize: true,
          symbol: ticker.endsWith('.KS') ? `KRX:${ticker.replace('.KS', '')}` : (ticker.endsWith('.KQ') ? `KOSDAQ:${ticker.replace('.KQ', '')}` : ticker),
          interval: "D",
          timezone: "Asia/Seoul",
          theme: "dark",
          style: "1",
          locale: "en",
          enable_publishing: false,
          hide_side_toolbar: false,
          container_id: containerRef.current.id,
          // 단테 기법 5, 15, 56, 112, 224일선 세팅 (Moving Averages)
          studies: [
            {
              id: "MASimple@tv-basicstudies",
              inputs: { length: 5 },
            },
            {
              id: "MASimple@tv-basicstudies",
              inputs: { length: 15 },
            },
            {
              id: "MASimple@tv-basicstudies",
              inputs: { length: 56 },
            },
            {
              id: "MASimple@tv-basicstudies",
              inputs: { length: 112 },
            },
            {
              id: "MASimple@tv-basicstudies",
              inputs: { length: 224 },
            }
          ]
        });
      }
    };
    document.body.appendChild(script);
  }, [ticker]);

  return (
    <div id={containerId} ref={containerRef} className="w-full h-full" />
  );
}

declare global {
  interface Window {
    TradingView: any;
  }
}
