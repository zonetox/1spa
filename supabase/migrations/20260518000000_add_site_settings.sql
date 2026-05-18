-- Create site_settings table for global branding
CREATE TABLE IF NOT EXISTS site_settings (
    id text PRIMARY KEY DEFAULT 'current',
    app_name text DEFAULT '1Beauty.Asia',
    tagline text DEFAULT 'Premium Beauty, Spa & Dental Directory',
    accent_color text DEFAULT '#D4AF37',
    logo_url text,
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT only_one_row CHECK (id = 'current')
);

-- Insert default row
INSERT INTO site_settings (id, app_name, tagline, accent_color) 
VALUES ('current', '1Beauty.Asia', 'Premium Beauty, Spa & Dental Directory', '#D4AF37')
ON CONFLICT (id) DO NOTHING;

-- Enable RLS
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read
CREATE POLICY "Allow anyone to read site settings" 
ON site_settings FOR SELECT 
TO public 
USING (true);

-- Policy: Only admins can update
CREATE POLICY "Allow admins to update site settings" 
ON site_settings FOR UPDATE 
TO authenticated 
USING (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() AND role = 'admin'
    )
);
