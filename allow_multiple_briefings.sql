-- This script removes the unique constraint on the 'date' column
-- allowing multiple daily market briefings to be generated and saved on the same day.

ALTER TABLE public.market_summaries DROP CONSTRAINT IF EXISTS market_summaries_date_key;
