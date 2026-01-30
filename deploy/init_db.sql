-- Create table for system settings if not exists
CREATE TABLE IF NOT EXISTS system_settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;

-- Policy: Only service role (server) can read/write settings. 
-- Public/Authenticated users should NOT access this table directly via client SDK.
-- The backend (which uses service_role key) bypasses RLS.
-- But for safety, we can create a policy that denies all for anon/authenticated.

CREATE POLICY "Deny public access" ON system_settings FOR ALL USING (false);
