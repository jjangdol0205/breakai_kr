-- Add detailed_report column to reports table
ALTER TABLE public.reports 
ADD COLUMN IF NOT EXISTS detailed_report TEXT;

-- Verify the column was added (optional, for manual check)
-- SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'reports';
