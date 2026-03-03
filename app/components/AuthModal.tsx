"use client";

import { useState } from "react";
import { createClient } from "../../utils/supabase/client";

import { X, Loader2, Mail, Lock } from "lucide-react";

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const supabase = createClient();

    if (!isOpen) return null;

    const handleGoogleSignIn = async () => {
        setLoading(true);
        setErrorMsg("");

        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/` // Redirect back to home after Google Auth
            }
        });

        if (error) {
            setErrorMsg(error.message);
            setLoading(false);
        }
        // No need to onClose or setLoading(false) on success because the page redirects to Google
    };

    // Empty padding to replace old email/password handlers

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
            <div className="bg-[#111] border border-[#333] rounded-2xl w-full max-w-md shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#FF3333] to-emerald-600"></div>

                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="p-8">
                    <div className="mb-8 text-center">
                        <h2 className="text-2xl font-black text-white tracking-tight mb-2">환영합니다</h2>
                        <p className="text-zinc-500 text-sm font-medium">프리미엄 기능에 접근하려면 로그인하세요.</p>
                    </div>

                    <div className="space-y-4 text-center">
                        <button
                            onClick={handleGoogleSignIn}
                            disabled={loading}
                            className="w-full bg-white text-black font-bold py-3.5 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg active:scale-95 text-sm gap-3"
                        >
                            {loading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                    </svg>
                                    Google로 1초 만에 계속하기
                                </>
                            )}
                        </button>

                        <p className="text-zinc-600 text-xs mt-6 px-4 leading-relaxed">
                            계속 진행하면 당사의 <a href="/terms" className="underline hover:text-white">이용약관</a> 및 <a href="/privacy" className="underline hover:text-white">개인정보처리방침</a>을 읽고 동의하는 것으로 간주됩니다.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
