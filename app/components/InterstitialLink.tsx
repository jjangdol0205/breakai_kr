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
            // Fetch coupang products
            fetch('/api/coupang?keyword=맥북&limit=1')
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
                        
                        <div className="w-16 h-16 border-4 border-red-500/20 border-t-red-500 rounded-full animate-spin mb-8"></div>
                        <h2 className="text-2xl font-black text-white mb-2 text-center tracking-tighter">AI 딥다이브 리포트<br/>암호화 해제 중...</h2>
                        <p className="text-zinc-400 mb-10 text-sm font-mono tracking-widest uppercase">Fetching encrypted data...</p>

                        {!loadingProducts && products.length > 0 && (
                            <div className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 shadow-2xl relative overflow-hidden group mb-8">
                                <div className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold px-2 py-1 tracking-widest z-10">스폰서 추천</div>
                                <a 
                                    href={products[0].productUrl} 
                                    target="_blank" 
                                    rel="noreferrer" 
                                    className="flex items-center gap-4 relative z-0"
                                    onClick={() => {
                                        // Optional: tracking
                                    }}
                                >
                                    <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0 bg-white">
                                        <img src={products[0].productImage} alt={products[0].productName} className="w-full h-full object-contain" />
                                    </div>
                                    <div className="flex flex-col justify-center">
                                        <h3 className="text-sm font-bold text-slate-200 line-clamp-2 mb-1 group-hover:text-red-400 transition-colors">{products[0].productName}</h3>
                                        <p className="text-red-500 font-black">₩{products[0].productPrice.toLocaleString('ko-KR')}</p>
                                    </div>
                                </a>
                            </div>
                        )}

                        {countdown > 0 ? (
                            <div className="text-zinc-500 font-bold text-sm tracking-widest mb-4">
                                {countdown}초 후 이동합니다
                            </div>
                        ) : (
                            <button 
                                onClick={proceed}
                                className="bg-red-600 hover:bg-red-500 text-white font-bold py-3 px-12 rounded-full transition-colors text-lg tracking-wide shadow-[0_0_20px_rgba(239,68,68,0.3)] animate-pulse"
                            >
                                리포트 읽기 &rarr;
                            </button>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
