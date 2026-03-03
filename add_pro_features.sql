-- Add JSONB columns for advanced scoring and financial data
ALTER TABLE reports 
ADD COLUMN IF NOT EXISTS score_breakdown JSONB,
ADD COLUMN IF NOT EXISTS financial_table JSONB;

-- Example of how data will look:
-- score_breakdown: {"divergence": 35, "solvency": 30, "insider": 15, "valuation": 5}
-- financial_table: {"revenue_trend": "Down 5%", "net_income_trend": "Down 12%", "cash_flow": "-$200M"}
