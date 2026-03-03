require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const mockScoreObj = {
    total: 92,
    breakdown: [
        { category: "Fundamental Health", score: 25, max_score: 25, reason: "Data center revenues are experiencing hyper-growth, continuously beating Wall Street estimates." },
        { category: "Technical Trend", score: 24, max_score: 25, reason: "Strong Stage 3 continuation, constantly finding support at the 56-day EMA." },
        { category: "Valuation", score: 18, max_score: 25, reason: "High forward P/E, but absolutely justified by their unassailable monopoly in AI training hardware." },
        { category: "Momentum", score: 25, max_score: 25, reason: "Relentless institutional accumulation with no signs of distribution." }
    ]
};

const mockDetailedReport = `# Table of Contents

Prologue: Welcome to the World of Investing

## Chapter 1. Financial Health Checkup (Turnaround, Revenue/Profit, Debt ratio)
NVIDIA (NVDA) is operating in a financial stratosphere of its own. Generative AI is driving unprecedented demand for its Hopper architecture GPUs. Revenue growth has posted triple-digit year-over-year gains, while operating margins are expanding at an astonishing rate. Their balance sheet is pristine, drowning in free cash flow, ensuring they can fund next-generation R&D (Blackwell) without requiring external debt financing.

## Chapter 2. Industry Analysis: The Macro Forest (Macro trends, Paradigm shifts, Market size)
The world has entered the AI computing era, replacing decades of general-purpose computing. Large Language Models (LLMs) from OpenAI, Google, and Meta require tens of thousands of GPUs to train. This is a multi-trillion dollar paradigm shift, and NVIDIA is selling the "pickaxes and shovels" for the greatest gold rush in technological history.

## Chapter 3. Why This Company? (Economic Moat, Turnaround timing)
NVIDIA's economic moat is practically impenetrable, formed by CUDA—its proprietary software platform. Developers are locked into the CUDA ecosystem, meaning even if competitors design faster silicon, the software transition costs for AI labs are impossibly high. This creates a vicious cycle of dominance where NVIDIA owns both the hardware and developers.

## Chapter 4. 10-K Breakdown (Revenue breakdown, Sales metrics)
Analyzing the SEC filings, the Data Center segment now completely dwarfs Gaming. The transition from a gaming graphics card company to the backbone of global intelligence is complete. Networking revenue (InfiniBand) is also surging as data centers require massive bandwidth to link clusters of GPUs. 

## Chapter 5. Business Model Analysis (P x Q - C analysis)
NVIDIA commands extreme pricing power (P). Because the ROI on AI models is so high, hyperscalers (Microsoft, AWS, Google) will pay any price for H100s. Manufacturing costs (C) are outsourced to TSMC, operating a highly efficient fabless model. Volume (Q) is only constrained by TSMC's CoWoS packaging capacity, which is rapidly expanding.

## Chapter 6. Core Competitive Advantage (Core technologies, USP)
Beyond the silicon itself, NVIDIA's unified architecture—combining Grace CPUs, Hopper GPUs, and Quantum networking—delivers full-stack data center solutions. No other company on Earth can deliver a turnkey AI supercomputer optimized at the silicon, networking, and software levels simultaneously.

## Chapter 7. Top Catalysts (Why buy now?)
The upcoming rollout of the Blackwell architecture (B200) promises massive performance and efficiency leaps over Hopper. Sovereign nations are now building localized AI computing infrastructure (Sovereign AI), adding a completely new, massive customer cohort beyond traditional cloud providers.

## Chapter 8. Technical Analysis: Smart Money Tracks 🎯
Looking at the daily charts, NVDA is arguably the strongest mega-cap stock in the market. We are firmly in a **Stage 3 (Markup)** phase. 

Smart money has continually defended the 56-day EMA, using it as a dynamic launchpad for new highs. Unlike typical bubble cycles, there is no evidence of a climax top or distribution (Stage 4) from institutional investors. Volume remains elevated on up-days, confirming accumulation. While occasional pullbacks to the 112-day EMA may occur due to macro volatility, these are aggressive buyable dips. The trend is undeniably intact.

## Chapter 9. Potential Risks (Top 3 Potential risks)
1. Geopolitical Risk: US export restrictions to China could trim revenue or prompt China to accelerate domestic GPU development.
2. Supply Chain Concentration: Complete reliance on TSMC in Taiwan poses extreme risk should geopolitical tensions escalate.
3. Cyclical Digestion: Hyperscalers might eventually pause infrastructure buildouts to monetize their existing AI investments, leading to a temporary demand air pocket.

## Chapter 10. Valuation (Relative valuation vs peers)
While a premium valuation is undeniable, NVDA's PEG (Price/Earnings-to-Growth) ratio remains surprisingly reasonable due to the explosive gravity of their earnings beats. Compared to historical infrastructure monopolies during major paradigm shifts, NVIDIA still has runway. 

[Outro] Epilogue: Investing with Conviction
We are witnessing the foundational buildout of the next computing era. NVIDIA is not just participating; it is dictating the pace. For serious investors, holding the undisputed king of AI infrastructure is a geopolitical and technological imperative.

<!-- SCORE_BREAKDOWN: ${JSON.stringify(mockScoreObj)} -->`;

const mockReport = {
    ticker: 'NVDA',
    risk_score: 92,
    verdict: 'BUY',
    one_line_summary: 'The undisputed, monopolistic king of AI infrastructure commanding immense pricing power and driving the greatest computing paradigm shift in history.',
    detailed_report: mockDetailedReport,
    analysis_text: JSON.stringify({ investment_score: mockScoreObj })
};

async function insertMock() {
    // 1. Wipe everything first to be completely sure
    await supabase.from('reports').delete().neq('id', 0);

    // 2. Insert new English NVDA mock report
    const { data, error } = await supabase.from('reports').insert([mockReport]).select();
    if (error) {
        console.error('Error inserting mock report:', JSON.stringify(error, null, 2));
    } else {
        console.log('Successfully inserted English NVDA mock report:', data[0].id);
    }
}

insertMock();
