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
    <Link
      href={`https://kr.tradingview.com/chart/?symbol=${tvSymbol}`}
      target="_blank"
      rel="noopener noreferrer"
      className="w-full flex items-center justify-center px-8 py-5 bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white font-bold rounded-xl transition-all duration-300 font-mono tracking-wider shadow-lg group"
    >
      <Activity className="w-5 h-5 mr-3 text-red-500 group-hover:scale-110 transition-transform" />
      트레이딩뷰에서 <span className="text-white mx-2">{ticker.split('(')[0].trim()}</span> 차트 열기 &rarr;
    </Link>
  );
}
