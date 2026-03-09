"use client";
import React, { useEffect, useRef } from 'react';

export default function TradingViewWidget({ ticker }: { ticker: string }) {
  const containerId = `tv_chart_${ticker}`;
  const containerRef = useRef<HTMLDivElement>(null);

  const isKoreanStock = ticker.endsWith('.KS') || ticker.endsWith('.KQ');
  const naverTickerCode = ticker.split('.')[0];
  const naverChartUrl = `https://ssl.pstatic.net/imgfinance/chart/item/candle/day/${naverTickerCode}.png?sidcode=${new Date().getTime()}`;

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
          symbol: ticker,
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
      <div className="w-full h-full flex flex-col items-center justify-center bg-[#0a0a0c]/80 rounded-xl overflow-hidden p-8 border border-zinc-800 backdrop-blur-sm relative">
        <div className="absolute inset-0 bg-blue-500/5 blur-3xl pointer-events-none rounded-full" />

        <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center mb-6 border border-blue-500/20 shadow-[0_0_30px_rgba(59,130,246,0.2)]">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
            <path d="M3 3v18h18" />
            <path d="m19 9-5 5-4-4-3 3" />
          </svg>
        </div>

        <h3 className="text-2xl font-black text-white mb-2 text-center tracking-tight">트레이딩뷰 차트 바로가기</h3>
        <p className="text-zinc-400 text-center max-w-sm mb-8 leading-relaxed font-medium">
          한국거래소(KRX) 데이터 정책으로 인해 국내 주식 위젯 연동이 제한됩니다. 실시간 기술적 분석 차트는 공식 홈페이지에서 확인하세요.
        </p>

        <a
          href={tvExternalLink}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative inline-flex items-center justify-center px-8 py-3.5 font-bold text-white transition-all duration-200 bg-blue-600 font-sans rounded-xl hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 focus:ring-offset-zinc-900 overflow-hidden shadow-lg shadow-blue-500/30 w-full md:w-auto"
        >
          <span className="relative flex items-center gap-2">
            차트 열기
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-1"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
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
