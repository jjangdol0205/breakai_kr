"use client";

import { ArrowLeft } from "lucide-react";

export default function CheckoutButton() {
    const handleSubscribeClick = () => {
        // Redirect to Lemon Squeezy Checkout
        // IMPORTANT: Replace 'https://your-store.lemonsqueezy.com/buy/YOUR_VARIANT_ID' 
        // with your ACTUAL Lemon Squeezy product URL
        const checkoutUrl = new URL("https://your-store.lemonsqueezy.com/checkout/buy/VARIANT_ID");
        window.location.href = checkoutUrl.toString();
    };

    return (
        <button
            onClick={handleSubscribeClick}
            className="w-full py-5 bg-gradient-to-r from-red-500 to-emerald-600 hover:from-emerald-400 hover:to-red-500 text-black font-bold text-lg rounded-xl transition-all hover:scale-[1.02] shadow-lg shadow-emerald-500/20 flex items-center justify-center group active:scale-95"
        >
            지금 구독하기
            <ArrowLeft className="w-5 h-5 ml-2 rotate-180 group-hover:translate-x-1 transition-transform" />
        </button>
    );
}
