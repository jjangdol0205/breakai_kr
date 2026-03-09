"use client";

import { useState, useEffect } from "react";
import { createClient } from "../../utils/supabase/client";
import AuthModal from "./AuthModal";
import RequestCompanyModal from "./RequestCompanyModal";
import Link from "next/link";
import type { User } from "@supabase/supabase-js";

export default function TopNav() {
    const [user, setUser] = useState<User | null>(null);
    const [isPro, setIsPro] = useState(false);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);

    const supabase = createClient();

    const fetchProfile = async (user: User) => {
        if (user.email === "beable9489@gmail.com") {
            setIsPro(true);
            return;
        }
        const { data } = await supabase.from('profiles').select('is_pro').eq('id', user.id).single();
        setIsPro(!!data?.is_pro);
    };

    useEffect(() => {
        // Automatically open modal if redirected from checkout
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            if (params.get('login') === 'true') {
                setIsAuthModalOpen(true);
            }
        }
    }, []);

    useEffect(() => {
        // Initialize active session
        supabase.auth.getSession().then(({ data: { session } }) => {
            const currentUser = session?.user ?? null;
            setUser(currentUser);
            if (currentUser) fetchProfile(currentUser);
        });

        // Listen for Auth changes globally
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            const currentUser = session?.user ?? null;
            setUser(currentUser);
            if (currentUser) {
                fetchProfile(currentUser);
                setIsAuthModalOpen(false); // Make sure modal closes if logging in via magic link/other windows
            } else {
                setIsPro(false);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
    };

    return (
        <>
            <header className="border-b border-white/5 py-4 px-6 flex justify-between items-center bg-zinc-950/80 backdrop-blur-xl sticky top-0 z-50">
                <Link href="/" className="text-2xl font-serif font-black tracking-tight text-white hover:text-red-500 transition-colors">
                    BREAKAI<span className="text-red-500 text-3xl leading-none">.</span>
                </Link>
                <nav className="flex items-center text-sm text-zinc-400 font-bold tracking-wide gap-8">
                    <Link href="/briefing" className="cursor-pointer hover:text-white transition-colors hidden md:inline font-sans font-semibold">마켓 브리핑</Link>
                    <Link href="/picks" className="cursor-pointer text-white hover:text-red-400 transition-colors hidden md:inline flex items-center gap-2">오늘의 픽 <span className="text-[10px] bg-red-500/20 text-red-500 border border-red-500/30 px-2 py-0.5 rounded-full shadow-[0_0_10px_rgba(239,68,68,0.2)]">LIVE</span></Link>
                    <Link href="/about" className="cursor-pointer hover:text-white transition-colors hidden md:inline font-sans font-semibold">서비스 소개</Link>

                    {isPro && (
                        <div className="bg-red-500/10 border border-red-500/50 text-red-400 font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                            <span className="text-lg leading-none">👑</span> PRO 활성화됨
                        </div>
                    )}

                    <div className="w-px h-4 bg-zinc-700 mx-2 hidden md:block"></div>

                    {/* 
                      Temporarily Hiding Auth UI for AdSense Approval
                      {user ? (...) : (...)} 
                    */}
                </nav>
            </header>

            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
            />

            <RequestCompanyModal
                isOpen={isRequestModalOpen}
                onClose={() => setIsRequestModalOpen(false)}
            />
        </>
    );
}
