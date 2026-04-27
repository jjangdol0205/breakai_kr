"use client";

import React, { useState, useEffect } from 'react';
import { X, Mail } from 'lucide-react';

export default function ExitIntentPopup() {
    const [isVisible, setIsVisible] = useState(false);
    const [hasShown, setHasShown] = useState(false);
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        // Check if already shown in this session to not annoy the user
        const alreadyShown = sessionStorage.getItem('breakai_exit_intent');
        if (alreadyShown) {
            setHasShown(true);
        }

        const handleMouseLeave = (e: MouseEvent) => {
            // Trigger when cursor leaves the top edge of the window (exit intent)
            if (e.clientY <= 0 && !hasShown) {
                setIsVisible(true);
                setHasShown(true);
                sessionStorage.setItem('breakai_exit_intent', 'true');
            }
        };

        document.addEventListener('mouseleave', handleMouseLeave);
        return () => document.removeEventListener('mouseleave', handleMouseLeave);
    }, [hasShown]);

    if (!isMounted || !isVisible) return null;

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl max-w-md w-full p-8 relative animate-in zoom-in-95 duration-300">
                <button 
                    onClick={() => setIsVisible(false)}
                    className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>
                
                <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mb-6 border border-blue-500/20 shadow-[0_0_20px_rgba(59,130,246,0.15)]">
                        <Mail className="w-8 h-8 text-blue-500" />
                    </div>
                    
                    <h2 className="text-3xl font-black text-white mb-3 tracking-tight">잠깐만요!</h2>
                    <p className="text-zinc-400 mb-8 font-medium leading-relaxed">
                        월스트리트 수준의 AI 급등주 리포트를<br/>
                        <strong className="text-white">매일 아침 무료로 이메일로 받아보세요.</strong>
                    </p>
                    
                    {submitted ? (
                        <div className="w-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-4 rounded-xl font-bold animate-in fade-in">
                            구독이 완료되었습니다!<br/>내일부터 수익률을 바꿔줄 리포트가 발송됩니다.
                        </div>
                    ) : (
                        <form 
                            onSubmit={(e) => {
                                e.preventDefault();
                                // TODO: Connect to your actual newsletter API/Supabase here
                                setSubmitted(true);
                                setTimeout(() => setIsVisible(false), 3000);
                            }}
                            className="w-full space-y-3"
                        >
                            <input 
                                type="email" 
                                placeholder="이메일 주소 입력" 
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-zinc-900 border border-zinc-800 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-zinc-600"
                            />
                            <button 
                                type="submit"
                                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 rounded-xl transition-colors shadow-lg shadow-blue-500/20"
                            >
                                상위 1% 리포트 무료 구독
                            </button>
                        </form>
                    )}
                    
                    <button 
                        onClick={() => setIsVisible(false)}
                        className="mt-6 text-sm text-zinc-600 hover:text-zinc-400 font-medium underline-offset-4 hover:underline"
                    >
                        아니요, 수익률 상승 기회를 놓치겠습니다.
                    </button>
                </div>
            </div>
        </div>
    );
}
