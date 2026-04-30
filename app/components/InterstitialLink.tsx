"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Product {
    productId: number;
    productName: string;
    productPrice: number;
    productImage: string;
    productUrl: string;
}

export default function InterstitialLink({ href, children, className }: { href: string, children: React.ReactNode, className?: string }) {
    const [showModal, setShowModal] = useState(false);
    const [products, setProducts] = useState<Product[]>([]);
    const [loadingProducts, setLoadingProducts] = useState(true);
    const [countdown, setCountdown] = useState(3);
    const router = useRouter();

    useEffect(() => {
        if (showModal) {
            // Fetch sponsor products (renamed to avoid adblockers)
            fetch('/api/sponsor?keyword=모니터&limit=3')
                .then(res => res.json())
                .then(data => {
                    if (data.products && data.products.length > 0) {
                        setProducts(data.products);
                    }
                    setLoadingProducts(false);
                })
                .catch(err => {
                    console.error(err);
                    setLoadingProducts(false);
                });

            // Countdown timer
            const timer = setInterval(() => {
                setCountdown(prev => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

            // Force scroll to top and disable scrolling
            document.body.style.overflow = 'hidden';

            return () => {
                clearInterval(timer);
                document.body.style.overflow = 'auto';
            };
        }
    }, [showModal]);

    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        setShowModal(true);
    };

    const proceed = () => {
        document.body.style.overflow = 'auto';
        router.push(href);
    };

    return (
        <>
            <a href={href} onClick={handleClick} className={className}>
                {children}
            </a>

            {showModal && (
                <div className="fixed inset-0 z-[999] flex flex-col items-center justify-center bg-black/95 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="w-full max-w-md p-8 flex flex-col items-center justify-center relative">
                        
                        <div className="w-12 h-12 border-4 border-red-500/20 border-t-red-500 rounded-full animate-spin mb-6"></div>
                        <h2 className="text-2xl md:text-3xl font-black text-white mb-2 text-center tracking-tighter">AI 딥다이브 리포트 생성 중</h2>
                        <p className="text-zinc-400 mb-8 text-sm font-medium tracking-wide">
                            잠시만 기다려주세요. (약 <span className="text-red-500 font-bold">{countdown}</span>초)
                        </p>

                        {!loadingProducts && products.length > 0 && (
                            <div className="w-full bg-zinc-900/50 border border-white/5 rounded-2xl p-5 shadow-2xl relative mb-8 backdrop-blur-md">
                                <div className="text-center mb-4">
                                    <p className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600 tracking-wide">
                                        💡 대기 시간 동안 필요한 프리미엄 특가를 확인해 보세요!
                                    </p>
                                </div>
                                <div className="flex flex-col gap-3">
                                    {products.map((product, idx) => (
                                        <a 
                                            key={product.productId}
                                            href={product.productUrl} 
                                            target="_blank" 
                                            rel="noreferrer" 
                                            className="group flex items-center gap-4 bg-zinc-950 border border-zinc-800 hover:border-red-500/30 rounded-xl p-3 transition-all hover:bg-zinc-900/80 hover:-translate-y-0.5"
                                        >
                                            <div className="w-20 h-20 bg-white rounded-lg p-1 shrink-0 shadow-inner">
                                                <img src={product.productImage} alt={product.productName} className="w-full h-full object-contain" />
                                            </div>
                                            <div className="flex flex-col justify-center flex-1">
                                                <div className="bg-red-500/10 text-red-500 text-[10px] font-bold px-2 py-0.5 rounded-sm w-fit mb-1 border border-red-500/20">
                                                    스폰서 특가
                                                </div>
                                                <h3 className="text-sm font-bold text-slate-200 line-clamp-2 leading-snug group-hover:text-red-400 transition-colors mb-1">{product.productName}</h3>
                                                <p className="text-red-500 font-black text-lg tracking-tight">₩{product.productPrice.toLocaleString('ko-KR')}</p>
                                            </div>
                                        </a>
                                    ))}
                                </div>
                                <p className="text-[10px] text-zinc-600 text-center mt-4">
                                    이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.
                                </p>
                            </div>
                        )}

                        {countdown > 0 ? (
                            <div className="w-full bg-zinc-800 text-zinc-400 font-bold py-4 px-12 rounded-xl text-center text-lg tracking-wide cursor-not-allowed">
                                잠시만 기다려주세요...
                            </div>
                        ) : (
                            <button 
                                onClick={proceed}
                                className="w-full bg-red-600 hover:bg-red-500 text-white font-black py-4 px-12 rounded-xl transition-all text-lg tracking-wide shadow-[0_0_30px_rgba(239,68,68,0.3)] animate-pulse hover:scale-[1.02]"
                            >
                                리포트 바로 읽기 &rarr;
                            </button>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
