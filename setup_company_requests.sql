-- Create the company_requests table
CREATE TABLE IF NOT EXISTS company_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    company_name TEXT NOT NULL,
    ticker TEXT,
    status TEXT DEFAULT 'pending'::text NOT NULL,
    
    -- Optional constraint to ensure status is one of the allowed values
    CONSTRAINT valid_status CHECK (status IN ('pending', 'in-progress', 'completed'))
);

-- Enable Row Level Security (RLS)
ALTER TABLE company_requests ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can insert a request (authenticated or anonymous)
CREATE POLICY "Anyone can insert requests" ON company_requests
    FOR INSERT
    WITH CHECK (true);

-- Policy: Users can view their own requests
CREATE POLICY "Users can view own requests" ON company_requests
    FOR SELECT
    USING (auth.uid() = user_id);

-- Policy: Admin can view all requests
-- Assuming you use the same admin email check as elsewhere, or a true admin role.
-- For simplicity, we just allow the specific admin email if needed, or leave it to the Supabase UI.
-- CREATE POLICY "Admin can view all" ON company_requests FOR SELECT USING (auth.jwt() ->> 'email' = 'beable9489@gmail.com');
