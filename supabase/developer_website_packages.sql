-- ============================================
-- Developer Website Packages Table
-- Stores the pricing packages for Developer Websites
-- ============================================
CREATE TABLE IF NOT EXISTS developer_website_packages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    slug VARCHAR(50) NOT NULL UNIQUE, -- e.g., 'starter', 'growth'
    name VARCHAR(100) NOT NULL,
    tagline VARCHAR(255),
    price_label VARCHAR(50),
    price VARCHAR(50), -- Storing as string to include currency symbol if needed, or use DECIMAL
    price_note VARCHAR(100),
    ideal_for TEXT,
    is_popular BOOLEAN DEFAULT FALSE,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- Developer Package Features Table
-- Stores the features list for each package
-- ============================================
CREATE TABLE IF NOT EXISTS developer_package_features (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    package_id UUID REFERENCES developer_website_packages(id) ON DELETE CASCADE,
    feature_text VARCHAR(255) NOT NULL,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE developer_website_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE developer_package_features ENABLE ROW LEVEL SECURITY;

-- Policies
-- Allow anonymous read access (so the website can display them)
CREATE POLICY "Allow anonymous reads on developer_website_packages"
    ON developer_website_packages
    FOR SELECT
    TO anon
    USING (is_active = true);

CREATE POLICY "Allow anonymous reads on developer_package_features"
    ON developer_package_features
    FOR SELECT
    TO anon
    USING (true);

-- Allow authenticated (admin) full access
CREATE POLICY "Allow authenticated full access on developer_website_packages"
    ON developer_website_packages
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow authenticated full access on developer_package_features"
    ON developer_package_features
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Trigger for updated_at
DROP TRIGGER IF EXISTS update_dev_web_pkgs_updated_at ON developer_website_packages;
CREATE TRIGGER update_dev_web_pkgs_updated_at
    BEFORE UPDATE ON developer_website_packages
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- Seed Data (From current hardcoded values)
-- ============================================
DO $$
DECLARE
    starter_id UUID;
    growth_id UUID;
    enterprise_id UUID;
BEGIN
    -- Insert Packages
    INSERT INTO developer_website_packages (slug, name, tagline, price_label, price, price_note, ideal_for, is_popular, display_order)
    VALUES 
    ('starter', 'Starter Project Site', 'Perfect for single project launches', 'One-time from', '₹49,999', '+ ₹2,999/mo hosting', 'New property launches, individual project microsites, and builders testing digital marketing.', false, 1)
    RETURNING id INTO starter_id;

    INSERT INTO developer_website_packages (slug, name, tagline, price_label, price, price_note, ideal_for, is_popular, display_order)
    VALUES 
    ('growth', 'Growth Multi-Project Site', 'Scale your digital presence', 'One-time from', '₹1,49,999', '+ ₹5,999/mo hosting', 'Growing developers with multiple ongoing projects who need a centralized digital hub.', true, 2)
    RETURNING id INTO growth_id;

    INSERT INTO developer_website_packages (slug, name, tagline, price_label, price, price_note, ideal_for, is_popular, display_order)
    VALUES 
    ('enterprise', 'Enterprise Developer Suite', 'Complete digital transformation', 'Custom pricing from', '₹3,99,999', '+ custom hosting SLA', 'Large developers and builders with multi-city portfolios requiring enterprise-grade solutions.', false, 3)
    RETURNING id INTO enterprise_id;

    -- Insert Features for Starter
    INSERT INTO developer_package_features (package_id, feature_text, display_order) VALUES
    (starter_id, 'Single project landing page', 1),
    (starter_id, 'Project overview & highlights', 2),
    (starter_id, 'Interactive location map', 3),
    (starter_id, 'Image gallery with lightbox', 4),
    (starter_id, 'Lead capture form with email alerts', 5),
    (starter_id, 'Basic analytics dashboard', 6),
    (starter_id, 'Mobile-responsive design', 7),
    (starter_id, 'SSL security certificate', 8);

    -- Insert Features for Growth
    INSERT INTO developer_package_features (package_id, feature_text, display_order) VALUES
    (growth_id, 'Multi-project pages (up to 10)', 1),
    (growth_id, 'Property listing grid with filters', 2),
    (growth_id, 'Blog/news section for updates', 3),
    (growth_id, 'Advanced SEO setup & optimization', 4),
    (growth_id, 'CRM/lead integration hooks', 5),
    (growth_id, 'Virtual tour embedding', 6),
    (growth_id, 'Social media integration', 7),
    (growth_id, 'Priority email support', 8);

    -- Insert Features for Enterprise
    INSERT INTO developer_package_features (package_id, feature_text, display_order) VALUES
    (enterprise_id, 'Custom design system & branding', 1),
    (enterprise_id, 'Unlimited project pages', 2),
    (enterprise_id, 'Multi-city portfolio management', 3),
    (enterprise_id, 'CRM & marketing tool integrations', 4),
    (enterprise_id, 'Dedicated account manager', 5),
    (enterprise_id, 'SLA-backed hosting (99.9% uptime)', 6),
    (enterprise_id, '24/7 priority support', 7),
    (enterprise_id, 'Advanced analytics & reporting', 8);

END $$;
