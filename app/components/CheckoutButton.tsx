"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Loader2 } from "lucide-react";
import { supabase } from "../lib/supabase";
import AuthModal from "./AuthModal";

export default function CheckoutButton() {
    const [email, setEmail] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setEmail(session?.user?.email ?? null);
            setLoading(false);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setEmail(session?.user?.email ?? null);
        });

        return () => subscription.unsubscribe();
    }, []);

    const handleSubscribeClick = () => {
        if (!email) {
            setIsAuthModalOpen(true);
            return;
        }

        // Redirect to Lemon Squeezy Checkout
        // IMPORTANT: Replace 'https://your-store.lemonsqueezy.com/buy/YOUR_VARIANT_ID' 
        // with your ACTUAL Lemon Squeezy product URL
        const checkoutUrl = new URL("https://your-store.lemonsqueezy.com/checkout/buy/VARIANT_ID");
        checkoutUrl.searchParams.set("checkout[email]", email);

        window.location.href = checkoutUrl.toString();
    };

    return (
        <>
            <button
                onClick={handleSubscribeClick}
                disabled={loading}
                className="w-full py-5 bg-gradient-to-r from-red-500 to-emerald-600 hover:from-emerald-400 hover:to-red-500 text-black font-bold text-lg rounded-xl transition-all hover:scale-[1.02] shadow-lg shadow-emerald-500/20 flex items-center justify-center group active:scale-95 disabled:opacity-75"
            >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "지금 구독하기"}
                {!loading && <ArrowLeft className="w-5 h-5 ml-2 rotate-180 group-hover:translate-x-1 transition-transform" />}
            </button>
            <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
        </>
    );
}
