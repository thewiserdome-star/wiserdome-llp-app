-- ============================================
-- Developer Website Inquiries Table
-- Stores inquiries from the Website Development page
-- ============================================
CREATE TABLE IF NOT EXISTS developer_website_inquiries (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    company_name VARCHAR(255) NOT NULL,
    contact_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    city VARCHAR(100),
    projects_per_year VARCHAR(50),
    current_website VARCHAR(500),
    message TEXT,
    status VARCHAR(50) DEFAULT 'new',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_dev_web_inquiries_email ON developer_website_inquiries(email);
CREATE INDEX IF NOT EXISTS idx_dev_web_inquiries_status ON developer_website_inquiries(status);
CREATE INDEX IF NOT EXISTS idx_dev_web_inquiries_created_at ON developer_website_inquiries(created_at);

-- Enable RLS
ALTER TABLE developer_website_inquiries ENABLE ROW LEVEL SECURITY;

-- Allow anonymous users to insert inquiries
CREATE POLICY "Allow anonymous inserts to developer_website_inquiries"
    ON developer_website_inquiries
    FOR INSERT
    TO anon
    WITH CHECK (true);

-- Allow authenticated users (admins) to view all inquiries
CREATE POLICY "Allow authenticated users full access on developer_website_inquiries"
    ON developer_website_inquiries
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Add trigger for updated_at
DROP TRIGGER IF EXISTS update_dev_web_inquiries_updated_at ON developer_website_inquiries;
CREATE TRIGGER update_dev_web_inquiries_updated_at
    BEFORE UPDATE ON developer_website_inquiries
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
