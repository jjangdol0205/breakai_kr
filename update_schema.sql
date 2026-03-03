-- Add new columns for forensic analysis
ALTER TABLE reports 
ADD COLUMN IF NOT EXISTS verdict TEXT,
ADD COLUMN IF NOT EXISTS ceo_claim TEXT,
ADD COLUMN IF NOT EXISTS reality_check TEXT,
ADD COLUMN IF NOT EXISTS one_line_summary TEXT;

-- Optional: Add a check constraint for verdict if you want strict values
-- ALTER TABLE reports ADD CONSTRAINT check_verdict CHECK (verdict IN ('BUY', 'SELL', 'HOLD'));
