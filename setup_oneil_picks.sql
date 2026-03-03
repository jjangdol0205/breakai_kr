-- Setup O'Neil Picks Schema
CREATE TABLE IF NOT EXISTS public.oneil_picks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticker TEXT NOT NULL,
    pick_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    oneil_score INTEGER NOT NULL DEFAULT 0,
    picked_price NUMERIC, -- The price when the stock was picked, used for ROI
    technical_details JSONB, -- stores { ma112, ma224, ma448, current_price, volume, message }
    ai_report JSONB, -- stores the detailed Gemini corporate report
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- RLS Policies
ALTER TABLE public.oneil_picks ENABLE ROW LEVEL SECURITY;

-- Allow public read access to basic info, full read access will be handled in application layer securely
DROP POLICY IF EXISTS "Allow public read access to oneil_picks" ON public.oneil_picks;
CREATE POLICY "Allow public read access to oneil_picks" 
ON public.oneil_picks FOR SELECT 
USING (true);

-- Allow service role full access (insert, update, delete)
DROP POLICY IF EXISTS "Allow service role full access to oneil_picks" ON public.oneil_picks;
CREATE POLICY "Allow service role full access to oneil_picks" 
ON public.oneil_picks FOR ALL 
USING (true);

-- Allow anon insert for the screener script
DROP POLICY IF EXISTS "Allow anon insert to oneil_picks" ON public.oneil_picks;
CREATE POLICY "Allow anon insert to oneil_picks" 
ON public.oneil_picks FOR INSERT 
WITH CHECK (true);
