require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const mockScoreObj = {
    total: 85,
    breakdown: [
        { category: "Fundamental Health", score: 22, max_score: 25, reason: "Revenues and operating margins are demonstrating a stable turnaround." },
        { category: "Technical Trend", score: 24, max_score: 25, reason: "Perfectly entering Stage 3 markup after violently defending the 224-day EMA." },
        { category: "Valuation", score: 15, max_score: 25, reason: "Forward P/E is relatively high compared to the peer group, though future growth justifies a premium." },
        { category: "Momentum", score: 24, max_score: 25, reason: "Institutional buying pressure is accelerating." }
    ]
};

const mockDetailedReport = `# Table of Contents

Prologue: Welcome to the World of Investing

## Chapter 1. Financial Health Checkup (Turnaround, Revenue/Profit, Debt ratio)
Tesla (TSLA) consistently generates cash flow that exceeds market expectations, driven by robust EV delivery volumes. With Giga Texas ramping up and Giga Shanghai achieving massive scale, operating margins have stabilized at highly profitable levels, proving Tesla operates with big tech software margins rather than traditional auto margins. As Full Self-Driving (FSD) deferred revenue recognition accelerates, the long-term debt ratio continues to shrink, establishing a fortress balance sheet capable of weathering any macroeconomic storm.

## Chapter 2. Industry Analysis: The Macro Forest (Macro trends, Paradigm shifts, Market size)
In a macro environment accelerating the phase-out of internal combustion engines, the EV paradigm shift is an established reality. However, the exact "forest" Tesla is targeting isn't just automotive. Expanding into Autonomous Driving, Energy Storage Systems (ESS), and Humanoid Robotics (Optimus), the Total Addressable Market (TAM) spans hundreds of trillions of dollars globally. Tesla has already positioned itself as the undisputed apex predator in this expanding ecosystem.

## Chapter 3. Why This Company? (Economic Moat, Turnaround timing)
Tesla's destructive economic moat stems from its "Software-Defined Vehicle" (SDV) architecture. Long after the initial hardware sale, FSD subscriptions generate recurring monthly cash flows. Furthermore, billions of real-world driving miles collected by the global fleet construct an artificial intelligence data moat that competitors physically cannot close. While legacy automakers attempt costly EV turnarounds, Tesla is already preparing for the next frontier: the Robotaxi network.

## Chapter 4. 10-K Breakdown (Revenue breakdown, Sales metrics)
A deep dive into the latest SEC 10-K filings reveals a critical inflection point: it's no longer just about cars. The profit contribution from AI services via the Dojo supercomputer and Energy Generation (Megapack deployments) is growing exponentially quarter-over-quarter. Tesla uses hardware as a Trojan horse—sacrificing initial margins for market share dominance, then reaping massive profits through backend software and energy services in a classic "razor and blades" model.

## Chapter 5. Business Model Analysis (P x Q - C analysis)
Through revolutionary manufacturing innovations like gigacasting, Tesla radically drives down manufacturing costs (C) while scaling delivery volumes (Q) at a geometric rate. Concurrently, dynamic pricing strategies (P) are leveraged to suffocate competition. Ultimately, the perfection of Tesla's business model (P x infinity) is realized through the high-margin subscription economy activated once hardware saturation occurs.

## Chapter 6. Core Competitive Advantage (Core technologies, USP)
Where legacy OEMs benchmark themselves as "car companies," Tesla operates fundamentally as a pure-play AI powerhouse. The FSD Beta V12 "End-to-End Neural Net" eliminated hardcoded rules, allowing the vehicle to learn driving behaviors solely from vast vision data. This unprecedented breakthrough represents the Holy Grail of autonomous driving—a Unique Selling Proposition (USP) currently unmatched in the industry.

## Chapter 7. Top Catalysts (Why buy now?)
The most explosive short-term catalyst is the imminent full commercialization of FSD in North America and the impending unveil of the dedicated Robotaxi network. Once this network goes live, institutional models must entirely re-rate Tesla from a cyclical auto manufacturer to a ubiquitous, high-margin software platform akin to AWS or Uber.

## Chapter 8. Technical Analysis: Smart Money Tracks 🎯
Merging weekly and daily chart structures for $TSLA reveals that the stock has been enduring a massive, 18-month **Stage 2 (Base Building)** accumulation phase per Stan Weinstein's 4-Stage Market Cycle. 

Crucially, smart money has repeatedly defended the 224-day EMA (Exponential Moving Average), the definitive institutional support baseline, carving out a textbook "Cup and Handle" consolidation box. In recent weeks, we observed a deliberate flush below the 112-day EMA—a classic **Bear Trap** designed to panic retail investors out of their positions. Immediately following this trap, algorithmic buy programs engaged, creating a sharp V-shaped bounce on accelerating volume. We are now hovering precisely at the breakout trigger point for a massive **Stage 3 (Markup)** transition. Smart money accumulation is unequivocally complete. Time your entry here.

## Chapter 9. Potential Risks (Top 3 Potential risks)
Investors must carefully monitor Key Man Risk (headline volatility associated with the CEO), intensifying price wars from aggressively expanding Chinese EV manufacturers like BYD, and the potential for a prolonged EV "chasm" if high interest rates artificially suppress middle-class auto financing.

## Chapter 10. Valuation (Relative valuation vs peers)
While a forward P/E of 60x appears irrationally exuberant for a traditional manufacturer, it represents relative undervaluation when factoring in the software-level margins of FSD and the embedded call options of the Optimus program. For the long-term thematic investor, any dip near the 224-day baseline is a generational buying opportunity. We initiate coverage with a 12-month target price of $350.

[Outro] Epilogue: Investing with Conviction
From robust margin fundamentals to the verified footprints of institutional accumulation on the charts, all analytical vectors converge on a single thesis. Ignore the short-term noise and embrace the disruptive innovation. The time to board the Tesla supercycle is now.

<!-- SCORE_BREAKDOWN: ${JSON.stringify(mockScoreObj)} -->`;

const mockReport = {
    ticker: 'TSLA',
    risk_score: 85,
    verdict: 'BUY',
    one_line_summary: 'An apex AI powerhouse dominating the EV paradigm, transitioning into a software-margin Robotaxi network following textbook Stage 2 institutional accumulation.',
    detailed_report: mockDetailedReport,
};

async function insertMock() {
    await supabase.from('reports').delete().eq('ticker', 'TSLA');

    // Insert new English mock report
    const { data, error } = await supabase.from('reports').insert([mockReport]).select();
    if (error) {
        console.error('Error inserting mock report:', JSON.stringify(error, null, 2));
    } else {
        console.log('Successfully inserted English mock report:', data[0].id);
    }
}

insertMock();
