"use client";
import React, { useEffect, useRef } from 'react';

export default function TradingViewWidget({ ticker }: { ticker: string }) {
  const containerId = `tv_chart_${ticker}`;
  const containerRef = useRef<HTMLDivElement>(null);

  // Ultra-permissive check: basically if it contains 6 straight digits anywhere, or has .KS/.KQ, treat as Korean
  const isKoreanStock = ticker.endsWith('.KS') || ticker.endsWith('.KQ') || /\d{6}/.test(ticker);

  const naverTickerMatch = ticker.match(/\d{6}/);
  const naverTickerCode = naverTickerMatch ? naverTickerMatch[0] : ticker.split('.')[0];
  const naverChartUrl = `https://ssl.pstatic.net/imgfinance/chart/item/candle/day/${naverTickerCode}.png?sidcode=${new Date().getTime()}`;

  // Force TradingView format to KRX if it somehow bypassed the check
  const tvSymbol = isKoreanStock ? `KRX:${naverTickerCode}` : ticker;

  useEffect(() => {
    if (isKoreanStock) return;

    // Check if the script is already loaded to avoid duplicates
    let script = document.getElementById('tradingview-widget-script') as HTMLScriptElement;

    const initWidget = () => {
      if (window.TradingView && containerRef.current) {
        // Clear any existing content to prevent 'black screen' duplicates
        containerRef.current.innerHTML = '';

        new window.TradingView.widget({
          autosize: true,
          symbol: tvSymbol,
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
            { id: "MASimple@tv-basicstudies", inputs: { length: 5 } },
            { id: "MASimple@tv-basicstudies", inputs: { length: 15 } },
            { id: "MASimple@tv-basicstudies", inputs: { length: 56 } },
            { id: "MASimple@tv-basicstudies", inputs: { length: 112 } },
            { id: "MASimple@tv-basicstudies", inputs: { length: 224 } }
          ]
        });
      }
    };

    if (!script) {
      script = document.createElement("script");
      script.id = 'tradingview-widget-script';
      script.src = "https://s3.tradingview.com/tv.js";
      script.async = true;
      script.onload = initWidget;
      document.body.appendChild(script);
    } else {
      // Script already exists, just initialize the widget
      initWidget();
    }
  }, [ticker, isKoreanStock]);

  if (isKoreanStock) {
    const tvExternalLink = `https://kr.tradingview.com/chart/?symbol=KRX%3A${naverTickerCode}`;
    return (
      <div className="w-full flex justify-end mt-4">
        <a
          href={tvExternalLink}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative inline-flex items-center justify-center px-6 py-2.5 text-sm font-bold text-zinc-300 transition-all duration-200 bg-zinc-900 border border-zinc-700 font-sans rounded-lg hover:bg-zinc-800 hover:text-white hover:border-zinc-500 shadow-sm"
        >
          <span className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-400 group-hover:text-blue-400 transition-colors">
              <path d="M3 3v18h18" />
              <path d="m19 9-5 5-4-4-3 3" />
            </svg>
            트레이딩뷰 차트 바로가기
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1 opacity-70 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
          </span>
        </a>
      </div>
    );
  }

  return (
    <div id={containerId} ref={containerRef} className="w-full h-full" />
  );
}

declare global {
  interface Window {
    TradingView: any;
  }
}
