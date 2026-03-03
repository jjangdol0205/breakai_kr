import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import TopNav from "./components/TopNav";
import DisableCopy from "@/components/DisableCopy";
import PromoBanner from "./components/PromoBanner";
import CookieConsent from "./components/CookieConsent";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Breakout AI | 기관급 AI 투자 스크리너",
  description: "AI로 구동되는 데이터 기반 금융 분석 솔루션",
};

import { GoogleTagManager } from '@next/third-parties/google';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <GoogleTagManager gtmId="GTM-W9538SHJ" />
      <body className={`${inter.className} bg-black text-slate-200 antialiased min-h-screen flex flex-col selection:bg-[#FF3333]/30 font-sans`}>
        <DisableCopy />
        <div className="flex-grow flex flex-col">
          <PromoBanner />
          {/* Header */}
          <TopNav />

          {/* Main Content */}
          <main className="flex-grow">
            {children}
          </main>

          {/* Footer */}
          <footer className="border-t border-[#333] py-12 bg-[#050505]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center md:items-start gap-8">

              {/* Brand & Copyright */}
              <div className="flex flex-col items-center md:items-start space-y-2">
                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#FF3333] to-emerald-600 tracking-tighter">
                  BREAKOUT AI
                </span>
                <p className="text-xs text-zinc-500 font-semibold uppercase tracking-widest">
                  © {new Date().getFullYear()} Breakout AI. All rights reserved.
                </p>
                <p className="text-xs text-zinc-600 max-w-sm text-center md:text-left mt-2">
                  기관급 투자 리서치 데이터. 본 서비스는 재무적 조언이 아니며, 투자 전 전문가와 상담하시기 바랍니다.
                </p>
              </div>

              {/* Legal & Navigation Links */}
              <div className="flex flex-wrap justify-center md:justify-end gap-x-8 gap-y-4 text-sm font-semibold text-zinc-400">
                <Link href="/about" className="hover:text-white transition-colors">회사 소개</Link>
                <a href="mailto:contact@breakout.ai" className="hover:text-white transition-colors">문의하기</a>
                <Link href="/privacy" className="hover:text-white transition-colors">개인정보처리방침</Link>
                <Link href="/terms" className="hover:text-white transition-colors">이용약관</Link>
                <Link href="/disclaimer" className="hover:text-blue-400 transition-colors">면책조항</Link>
              </div>
            </div>
          </footer>
          <CookieConsent />
        </div>
      </body>
    </html>
  );
}