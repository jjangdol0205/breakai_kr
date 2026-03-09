"use client";
import React from 'react';
import Link from 'next/link';
import { Activity } from 'lucide-react';

import { KOREAN_STOCKS } from '../utils/koreanStocks';

export default function TradingViewWidget({ ticker }: { ticker: string }) {
  // 1. Try to extract a 6 digit code from the string (e.g., "셀트리온 (068270)")
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

  // Hardcoded fallback for major Korean stocks missing from KOREAN_STOCKS to prevent breaking old records
  if (!naverTickerCode && !ticker.match(/^[A-Z]+$/)) {
    if (ticker === '셀트리온') naverTickerCode = '068270';
    if (ticker === '삼성전자') naverTickerCode = '005930';
    if (ticker === 'SK하이닉스') naverTickerCode = '000660';
    if (ticker === '에코프로비엠') naverTickerCode = '247540';
    if (ticker === '에코프로') naverTickerCode = '086520';
  }

  // Force TradingView format to KRX if it's resolved as a Korean stock, otherwise use the regular ticker for US
  const tvSymbol = naverTickerCode ? `KRX:${naverTickerCode}` : ticker;

  // Clean, unified button layout for EVERY stock
  return (
    <div className="w-full h-full min-h-[300px] flex flex-col items-center justify-center bg-zinc-950 rounded-xl p-8 text-center border border-white/5">
      <Activity className="w-16 h-16 text-red-500/50 mb-6 animate-pulse" />
      <h3 className="text-xl font-bold text-white/90 mb-3 tracking-wide">직관적인 실시간 차트 분석</h3>
      <p className="text-zinc-500 max-w-md mb-8 font-mono text-sm leading-relaxed">
        실시간 틱 데이터 및 보조지표 분석은 트레이딩뷰 플랫폼에서 가장 강력하게 지원됩니다.
      </p>
      <Link
        href={`https://kr.tradingview.com/chart/?symbol=${tvSymbol}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center px-8 py-4 bg-red-600/10 hover:bg-red-600/20 border border-red-500/30 hover:border-red-500/60 text-red-500 hover:text-red-400 font-bold rounded-xl transition-all duration-300 font-mono tracking-wider ring-1 ring-white/5 shadow-2xl"
      >
        <Activity className="w-5 h-5 mr-3" />
        트레이딩뷰에서 {ticker.split('(')[0].trim()} 차트 열기
      </Link>
    </div>
  );
}
