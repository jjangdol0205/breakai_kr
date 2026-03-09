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
    return (
      <div className="w-full h-full flex items-center justify-center bg-white rounded-xl overflow-hidden p-2">
        {/* Using unoptimized standard img tag since it's an external dynamic URL */}
        <img
          src={naverChartUrl}
          alt={`${ticker} 차트`}
          className="w-full h-full object-contain"
        />
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
