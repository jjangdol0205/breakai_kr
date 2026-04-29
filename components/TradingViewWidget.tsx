"use client";
import React from 'react';
import Link from 'next/link';
import { Activity } from 'lucide-react';

import { KOREAN_STOCKS } from '../utils/koreanStocks';

export default function TradingViewWidget({ ticker }: { ticker: string }) {
  let naverTickerCode = "";
  let marketPrefix = "KRX"; // default
  let displayName = ticker.split('(')[0].trim();

  // Determine market by explicit suffix
  if (ticker.includes('.KQ')) {
    marketPrefix = "KOSDAQ";
  }

  const naverTickerMatch = ticker.match(/\d{6}/);

  if (naverTickerMatch) {
    naverTickerCode = naverTickerMatch[0];
  } else {
    // 2. If no digits found, try to look up the name in our KOREAN_STOCKS array
    const ksMatch = KOREAN_STOCKS.find(ks => ks.name === ticker);
    if (ksMatch) {
      if (ksMatch.ticker.includes('.KQ')) marketPrefix = "KOSDAQ";
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
    if (ticker === '에코프로비엠') { naverTickerCode = '247540'; marketPrefix = 'KOSDAQ'; }
    if (ticker === '에코프로') { naverTickerCode = '086520'; marketPrefix = 'KOSDAQ'; }
  }

  // Find actual display name if we have the code
  if (naverTickerCode) {
    const stock = KOREAN_STOCKS.find(ks => ks.ticker.includes(naverTickerCode));
    if (stock) displayName = stock.name;
    else if (ticker === '셀트리온') displayName = '셀트리온';
    else if (ticker === '삼성전자') displayName = '삼성전자';
    else if (ticker === 'SK하이닉스') displayName = 'SK하이닉스';
    else if (ticker === '에코프로비엠') displayName = '에코프로비엠';
    else if (ticker === '에코프로') displayName = '에코프로';
  }

  // Force TradingView format to proper exchange if it's resolved as a Korean stock, otherwise use the regular ticker for US
  const tvSymbol = naverTickerCode ? `${marketPrefix}:${naverTickerCode}` : ticker;

  // Clean, unified button layout for EVERY stock
  return (
    <Link
      href={`https://kr.tradingview.com/chart/?symbol=${tvSymbol}`}
      target="_blank"
      rel="noopener noreferrer"
      className="w-full flex items-center justify-center px-8 py-5 bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white font-bold rounded-xl transition-all duration-300 font-mono tracking-wider shadow-lg group"
    >
      <Activity className="w-5 h-5 mr-3 text-red-500 group-hover:scale-110 transition-transform" />
      트레이딩뷰에서 <span className="text-white mx-2">{displayName}</span> 차트 열기 &rarr;
    </Link>
  );
}
