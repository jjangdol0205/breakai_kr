"use client";
import React, { useEffect, useRef } from 'react';

import { KOREAN_STOCKS } from '../utils/koreanStocks';

export default function TradingViewWidget({ ticker }: { ticker: string }) {
  const containerId = `tv_chart_${ticker}`;
  const containerRef = useRef<HTMLDivElement>(null);

  // 1. First, try to extract a 6 digit code from the string (e.g., "셀트리온 (068270)")
  let naverTickerCode = "";
  const naverTickerMatch = ticker.match(/\d{6}/);

  if (naverTickerMatch) {
    naverTickerCode = naverTickerMatch[0];
  } else {
    // 2. If no digits found, try to look up the name in our KOREAN_STOCKS array
    const ksMatch = KOREAN_STOCKS.find(ks => ks.name === ticker);
    if (ksMatch) {
      // KOREAN_STOCKS has format "068270.KS" or "068270.KQ", extract the digits
      const ksDigitsMatch = ksMatch.ticker.match(/\d{6}/);
      if (ksDigitsMatch) {
        naverTickerCode = ksDigitsMatch[0];
      }
    }
  }

  // 3. Ultra-permissive check if it's considered a Korean stock based on the code resolution
  const isKoreanStock = Boolean(naverTickerCode) || ticker.endsWith('.KS') || ticker.endsWith('.KQ');

  // Hardcoded fallback for major Korean stocks missing from KOREAN_STOCKS to prevent breaking old records
  if (!naverTickerCode && !ticker.match(/^[A-Z]+$/)) {
    if (ticker === '셀트리온') naverTickerCode = '068270';
    if (ticker === '삼성전자') naverTickerCode = '005930';
    if (ticker === 'SK하이닉스') naverTickerCode = '000660';
    if (ticker === '에코프로비엠') naverTickerCode = '247540';
    if (ticker === '에코프로') naverTickerCode = '086520';
  }

  // 4. Force TradingView format to KRX if it somehow bypassed the check
  const tvSymbol = naverTickerCode ? `KRX:${naverTickerCode}` : ticker;

  useEffect(() => {
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
  }, [ticker, tvSymbol]);

  return (
    <div id={containerId} ref={containerRef} className="w-full h-full min-h-[500px]" />
  );
}

declare global {
  interface Window {
    TradingView: any;
  }
}
