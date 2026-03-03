-- Add columns for Balanced Bull/Bear Analysis
ALTER TABLE reports 
ADD COLUMN IF NOT EXISTS investment_score INT,
ADD COLUMN IF NOT EXISTS bull_case_summary TEXT,
ADD COLUMN IF NOT EXISTS bear_case_summary TEXT;

-- existing 'risk_score' will be kept for legacy data but new logic uses 'investment_score'
-- 'investment_score': 0-100 (Higher is BETTER/BUY)
-- 'risk_score': 0-100 (Higher is WORSE/RISK)
