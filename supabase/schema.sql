-- Wiserdome Database Schema for Supabase
-- 
-- This file contains the SQL schema to set up the database tables for Wiserdome.
-- Run this in your Supabase SQL Editor to create the necessary tables.
--
-- Tables:
-- 1. contact_inquiries - Stores contact form submissions
-- 2. pricing_plans - Stores pricing plan information
-- 3. services - Stores service details
-- 4. faqs - Stores frequently asked questions
-- 5. testimonials - Stores customer testimonials
-- 6. properties - Stores property information (for future use)
-- 7. cities - Stores supported cities

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- Contact Inquiries Table
-- Stores all contact form submissions and leads
-- ============================================
CREATE TABLE IF NOT EXISTS contact_inquiries (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    property_city VARCHAR(100),
    property_type VARCHAR(50) DEFAULT 'apartment',
    message TEXT,
    status VARCHAR(50) DEFAULT 'new',
    source VARCHAR(100) DEFAULT 'website',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_contact_inquiries_email ON contact_inquiries(email);
CREATE INDEX IF NOT EXISTS idx_contact_inquiries_status ON contact_inquiries(status);
CREATE INDEX IF NOT EXISTS idx_contact_inquiries_created_at ON contact_inquiries(created_at);

-- ============================================
-- Pricing Plans Table
-- Stores pricing plans with features
-- ============================================
CREATE TABLE IF NOT EXISTS pricing_plans (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(255),
    price_monthly DECIMAL(10, 2) NOT NULL,
    price_yearly DECIMAL(10, 2),
    currency VARCHAR(10) DEFAULT 'INR',
    target_audience VARCHAR(255),
    is_popular BOOLEAN DEFAULT FALSE,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- Plan Features Table
-- Stores features for each pricing plan
-- ============================================
CREATE TABLE IF NOT EXISTS plan_features (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    plan_id UUID REFERENCES pricing_plans(id) ON DELETE CASCADE,
    feature_name VARCHAR(255) NOT NULL,
    is_included BOOLEAN DEFAULT TRUE,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_plan_features_plan_id ON plan_features(plan_id);

-- ============================================
-- Services Table
-- Stores service offerings
-- ============================================
CREATE TABLE IF NOT EXISTS services (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    short_description TEXT,
    full_description TEXT,
    icon VARCHAR(100),
    image_url VARCHAR(500),
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- Service Features Table
-- Stores bullet points for each service
-- ============================================
CREATE TABLE IF NOT EXISTS service_features (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    service_id UUID REFERENCES services(id) ON DELETE CASCADE,
    feature_text VARCHAR(500) NOT NULL,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_service_features_service_id ON service_features(service_id);

-- ============================================
-- FAQs Table
-- Stores frequently asked questions
-- ============================================
CREATE TABLE IF NOT EXISTS faqs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    category VARCHAR(100) DEFAULT 'general',
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_faqs_category ON faqs(category);

-- ============================================
-- Testimonials Table
-- Stores customer testimonials
-- ============================================
CREATE TABLE IF NOT EXISTS testimonials (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    customer_name VARCHAR(255) NOT NULL,
    customer_location VARCHAR(255),
    customer_designation VARCHAR(255),
    testimonial_text TEXT NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    is_featured BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- Cities Table
-- Stores supported cities
-- ============================================
CREATE TABLE IF NOT EXISTS cities (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    state VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- Properties Table (Future Use)
-- Stores property information for management
-- ============================================
CREATE TABLE IF NOT EXISTS properties (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    owner_name VARCHAR(255) NOT NULL,
    owner_email VARCHAR(255) NOT NULL,
    owner_phone VARCHAR(50) NOT NULL,
    property_type VARCHAR(50) NOT NULL,
    property_address TEXT NOT NULL,
    city_id UUID REFERENCES cities(id),
    pincode VARCHAR(10),
    bedrooms INTEGER,
    bathrooms INTEGER,
    area_sqft DECIMAL(10, 2),
    is_rented BOOLEAN DEFAULT FALSE,
    monthly_rent DECIMAL(10, 2),
    plan_id UUID REFERENCES pricing_plans(id),
    status VARCHAR(50) DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_properties_owner_email ON properties(owner_email);
CREATE INDEX IF NOT EXISTS idx_properties_city ON properties(city_id);
CREATE INDEX IF NOT EXISTS idx_properties_status ON properties(status);

-- ============================================
-- Row Level Security (RLS) Policies
-- These policies control access to the data
-- ============================================

-- Enable RLS on all tables
ALTER TABLE contact_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE pricing_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE plan_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

-- Allow anonymous users to insert contact inquiries (for the contact form)
CREATE POLICY "Allow anonymous inserts to contact_inquiries"
    ON contact_inquiries
    FOR INSERT
    TO anon
    WITH CHECK (true);

-- Allow anonymous users to read public data (pricing, services, FAQs, cities, testimonials)
CREATE POLICY "Allow anonymous reads on pricing_plans"
    ON pricing_plans
    FOR SELECT
    TO anon
    USING (is_active = true);

CREATE POLICY "Allow anonymous reads on plan_features"
    ON plan_features
    FOR SELECT
    TO anon
    USING (true);

CREATE POLICY "Allow anonymous reads on services"
    ON services
    FOR SELECT
    TO anon
    USING (is_active = true);

CREATE POLICY "Allow anonymous reads on service_features"
    ON service_features
    FOR SELECT
    TO anon
    USING (true);

CREATE POLICY "Allow anonymous reads on faqs"
    ON faqs
    FOR SELECT
    TO anon
    USING (is_active = true);

CREATE POLICY "Allow anonymous reads on testimonials"
    ON testimonials
    FOR SELECT
    TO anon
    USING (is_active = true);

CREATE POLICY "Allow anonymous reads on cities"
    ON cities
    FOR SELECT
    TO anon
    USING (is_active = true);

-- ============================================
-- Admin Policies (Authenticated Users)
-- These policies allow authenticated admin users to manage data
-- 
-- SECURITY NOTE: In a production environment, consider implementing
-- role-based access control (RBAC) by:
-- 1. Creating an 'admin_users' table with user IDs
-- 2. Adding a function to check if a user is an admin
-- 3. Using that function in RLS policies
-- 
-- Example:
-- CREATE OR REPLACE FUNCTION is_admin()
-- RETURNS BOOLEAN AS $$
-- BEGIN
--   RETURN EXISTS (
--     SELECT 1 FROM admin_users WHERE user_id = auth.uid()
--   );
-- END;
-- $$ LANGUAGE plpgsql SECURITY DEFINER;
-- 
-- Then use: USING (is_admin()) instead of USING (true)
-- ============================================

-- Pricing Plans - Full access for authenticated users
CREATE POLICY "Allow authenticated users full access on pricing_plans"
    ON pricing_plans
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Plan Features - Full access for authenticated users
CREATE POLICY "Allow authenticated users full access on plan_features"
    ON plan_features
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Services - Full access for authenticated users
CREATE POLICY "Allow authenticated users full access on services"
    ON services
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Service Features - Full access for authenticated users
CREATE POLICY "Allow authenticated users full access on service_features"
    ON service_features
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- FAQs - Full access for authenticated users
CREATE POLICY "Allow authenticated users full access on faqs"
    ON faqs
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Testimonials - Full access for authenticated users
CREATE POLICY "Allow authenticated users full access on testimonials"
    ON testimonials
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Cities - Full access for authenticated users
CREATE POLICY "Allow authenticated users full access on cities"
    ON cities
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Contact Inquiries - Full access for authenticated users
CREATE POLICY "Allow authenticated users full access on contact_inquiries"
    ON contact_inquiries
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Properties - Full access for authenticated users
CREATE POLICY "Allow authenticated users full access on properties"
    ON properties
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- ============================================
-- Seed Data
-- Initial data to populate the database
-- ============================================

-- Insert Cities
INSERT INTO cities (name, state, is_active, display_order) VALUES
    ('Mumbai', 'Maharashtra', true, 1),
    ('Bangalore', 'Karnataka', true, 2),
    ('Delhi NCR', 'Delhi', true, 3),
    ('Pune', 'Maharashtra', true, 4),
    ('Hyderabad', 'Telangana', true, 5),
    ('Chennai', 'Tamil Nadu', true, 6)
ON CONFLICT (name) DO NOTHING;

-- Insert Pricing Plans
INSERT INTO pricing_plans (name, description, price_monthly, target_audience, is_popular, display_order) VALUES
    ('Basic', 'For vacant properties', 1999.00, 'Vacant Properties', false, 1),
    ('Standard', 'For rented properties', 3499.00, 'Rented Properties', true, 2),
    ('Premium', 'Complete peace of mind', 5999.00, 'Complete Care', false, 3);

-- Get plan IDs for features
DO $$
DECLARE
    basic_id UUID;
    standard_id UUID;
    premium_id UUID;
BEGIN
    SELECT id INTO basic_id FROM pricing_plans WHERE name = 'Basic';
    SELECT id INTO standard_id FROM pricing_plans WHERE name = 'Standard';
    SELECT id INTO premium_id FROM pricing_plans WHERE name = 'Premium';

    -- Basic Plan Features
    INSERT INTO plan_features (plan_id, feature_name, is_included, display_order) VALUES
        (basic_id, 'Monthly Inspections', true, 1),
        (basic_id, 'Bill Payments', true, 2),
        (basic_id, 'Key Management', true, 3),
        (basic_id, 'Tenant Management', false, 4),
        (basic_id, 'Rent Collection', false, 5),
        (basic_id, 'Minor Repairs Coordination', false, 6),
        (basic_id, 'Legal Support', false, 7),
        (basic_id, 'Deep Cleaning (Annual)', false, 8);

    -- Standard Plan Features
    INSERT INTO plan_features (plan_id, feature_name, is_included, display_order) VALUES
        (standard_id, 'Monthly Inspections', true, 1),
        (standard_id, 'Bill Payments', true, 2),
        (standard_id, 'Key Management', true, 3),
        (standard_id, 'Tenant Management', true, 4),
        (standard_id, 'Rent Collection', true, 5),
        (standard_id, 'Minor Repairs Coordination', true, 6),
        (standard_id, 'Legal Support', false, 7),
        (standard_id, 'Deep Cleaning (Annual)', false, 8);

    -- Premium Plan Features
    INSERT INTO plan_features (plan_id, feature_name, is_included, display_order) VALUES
        (premium_id, 'Monthly Inspections', true, 1),
        (premium_id, 'Bill Payments', true, 2),
        (premium_id, 'Key Management', true, 3),
        (premium_id, 'Tenant Management', true, 4),
        (premium_id, 'Rent Collection', true, 5),
        (premium_id, 'Minor Repairs Coordination', true, 6),
        (premium_id, 'Legal Support', true, 7),
        (premium_id, 'Deep Cleaning (Annual)', true, 8);
END $$;

-- Insert Services
INSERT INTO services (name, short_description, full_description, icon, display_order) VALUES
    ('Rental Management', 'End-to-end tenant management', 'Finding the right tenant is just the beginning. We handle the entire lifecycle of tenancy so you don''t have to deal with late night calls or payment follow-ups.', 'ðŸ ', 1),
    ('Maintenance & Repairs', 'Keep your property in showroom condition', 'We coordinate all repairs with trusted local vendors and supervise the work.', 'ðŸ”§', 2),
    ('Legal & Documentation', 'Navigate Indian property laws with ease', 'Our legal experts ensure your property is compliant and secure.', 'ðŸ“‹', 3),
    ('Resale & Renovation', 'Upgrade or sell your property', 'Whether you want to upgrade your home or sell it for the best price, we act as your ground team.', 'ðŸ—ï¸', 4);

-- Get service IDs for features
DO $$
DECLARE
    rental_id UUID;
    maintenance_id UUID;
    legal_id UUID;
    resale_id UUID;
BEGIN
    SELECT id INTO rental_id FROM services WHERE name = 'Rental Management';
    SELECT id INTO maintenance_id FROM services WHERE name = 'Maintenance & Repairs';
    SELECT id INTO legal_id FROM services WHERE name = 'Legal & Documentation';
    SELECT id INTO resale_id FROM services WHERE name = 'Resale & Renovation';

    -- Rental Management Features
    INSERT INTO service_features (service_id, feature_text, display_order) VALUES
        (rental_id, 'Tenant background verification & police clearance', 1),
        (rental_id, 'Rental agreement drafting & registration', 2),
        (rental_id, 'Monthly rent collection & deposit', 3),
        (rental_id, 'Tenant relationship management', 4),
        (rental_id, 'Move-in & move-out inspections', 5);

    -- Maintenance Features
    INSERT INTO service_features (service_id, feature_text, display_order) VALUES
        (maintenance_id, 'Regular cleaning & deep cleaning services', 1),
        (maintenance_id, 'Plumbing, electrical, and carpentry repairs', 2),
        (maintenance_id, 'Painting and waterproofing', 3),
        (maintenance_id, 'Pest control services', 4),
        (maintenance_id, 'Appliance servicing (AC, RO, Geyser)', 5);

    -- Legal Features
    INSERT INTO service_features (service_id, feature_text, display_order) VALUES
        (legal_id, 'Property tax payments', 1),
        (legal_id, 'Society maintenance bill management', 2),
        (legal_id, 'Khata transfer & mutation assistance', 3),
        (legal_id, 'Power of Attorney (PoA) coordination', 4),
        (legal_id, 'Legal dispute advisory', 5);

    -- Resale Features
    INSERT INTO service_features (service_id, feature_text, display_order) VALUES
        (resale_id, 'Full-scale home renovation supervision', 1),
        (resale_id, 'Interior design coordination', 2),
        (resale_id, 'Property valuation services', 3),
        (resale_id, 'Buyer search and negotiation for resale', 4),
        (resale_id, 'Sale deed registration support', 5);
END $$;

-- Insert FAQs
INSERT INTO faqs (question, answer, category, display_order) VALUES
    ('Is my property safe with you?', 'Absolutely. We conduct thorough background checks on all our staff and vendors. We also provide digital logs of every visit.', 'general', 1),
    ('How do I pay for the services?', 'You can pay online via credit card, bank transfer, or UPI. We offer monthly, quarterly, and annual billing cycles.', 'billing', 2),
    ('Do you cover legal disputes?', 'Our Premium plan includes basic legal advisory. For complex disputes, we can connect you with specialized property lawyers at discounted rates.', 'legal', 3),
    ('What cities do you operate in?', 'Currently, we are active in Mumbai, Bangalore, Delhi NCR, Pune, Hyderabad, and Chennai.', 'general', 4);

-- Insert Sample Testimonials
INSERT INTO testimonials (customer_name, customer_location, customer_designation, testimonial_text, rating, is_featured) VALUES
    ('Rajesh Kumar', 'USA', 'Software Engineer', 'Wiserdome has been managing my apartment in Mumbai for 2 years now. Excellent communication and transparency.', 5, true),
    ('Priya Sharma', 'UK', 'Doctor', 'Finding reliable property managers in India was always a challenge. Wiserdome solved that problem completely.', 5, true),
    ('Amit Patel', 'Canada', 'Business Owner', 'Professional service and timely updates. My property has never been in better hands.', 4, false);

-- Create trigger for updating updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers to tables with updated_at column
DROP TRIGGER IF EXISTS update_contact_inquiries_updated_at ON contact_inquiries;
CREATE TRIGGER update_contact_inquiries_updated_at
    BEFORE UPDATE ON contact_inquiries
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_pricing_plans_updated_at ON pricing_plans;
CREATE TRIGGER update_pricing_plans_updated_at
    BEFORE UPDATE ON pricing_plans
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_services_updated_at ON services;
CREATE TRIGGER update_services_updated_at
    BEFORE UPDATE ON services
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_faqs_updated_at ON faqs;
CREATE TRIGGER update_faqs_updated_at
    BEFORE UPDATE ON faqs
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_properties_updated_at ON properties;
CREATE TRIGGER update_properties_updated_at
    BEFORE UPDATE ON properties
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
- -   = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =  
 - -   D e v e l o p e r   W e b s i t e   I n q u i r i e s   T a b l e  
 - -   S t o r e s   i n q u i r i e s   f r o m   t h e   W e b s i t e   D e v e l o p m e n t   p a g e  
 - -   = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =  
 C R E A T E   T A B L E   I F   N O T   E X I S T S   d e v e l o p e r _ w e b s i t e _ i n q u i r i e s   (  
         i d   U U I D   D E F A U L T   u u i d _ g e n e r a t e _ v 4 ( )   P R I M A R Y   K E Y ,  
         c o m p a n y _ n a m e   V A R C H A R ( 2 5 5 )   N O T   N U L L ,  
         c o n t a c t _ n a m e   V A R C H A R ( 2 5 5 )   N O T   N U L L ,  
         e m a i l   V A R C H A R ( 2 5 5 )   N O T   N U L L ,  
         p h o n e   V A R C H A R ( 5 0 )   N O T   N U L L ,  
         c i t y   V A R C H A R ( 1 0 0 ) ,  
         p r o j e c t s _ p e r _ y e a r   V A R C H A R ( 5 0 ) ,  
         c u r r e n t _ w e b s i t e   V A R C H A R ( 5 0 0 ) ,  
         m e s s a g e   T E X T ,  
         s t a t u s   V A R C H A R ( 5 0 )   D E F A U L T   ' n e w ' ,  
         c r e a t e d _ a t   T I M E S T A M P   W I T H   T I M E   Z O N E   D E F A U L T   N O W ( ) ,  
         u p d a t e d _ a t   T I M E S T A M P   W I T H   T I M E   Z O N E   D E F A U L T   N O W ( )  
 ) ;  
  
 - -   C r e a t e   i n d e x   f o r   f a s t e r   q u e r i e s  
 C R E A T E   I N D E X   I F   N O T   E X I S T S   i d x _ d e v _ w e b _ i n q u i r i e s _ e m a i l   O N   d e v e l o p e r _ w e b s i t e _ i n q u i r i e s ( e m a i l ) ;  
 C R E A T E   I N D E X   I F   N O T   E X I S T S   i d x _ d e v _ w e b _ i n q u i r i e s _ s t a t u s   O N   d e v e l o p e r _ w e b s i t e _ i n q u i r i e s ( s t a t u s ) ;  
 C R E A T E   I N D E X   I F   N O T   E X I S T S   i d x _ d e v _ w e b _ i n q u i r i e s _ c r e a t e d _ a t   O N   d e v e l o p e r _ w e b s i t e _ i n q u i r i e s ( c r e a t e d _ a t ) ;  
  
 - -   E n a b l e   R L S  
 A L T E R   T A B L E   d e v e l o p e r _ w e b s i t e _ i n q u i r i e s   E N A B L E   R O W   L E V E L   S E C U R I T Y ;  
  
 - -   A l l o w   a n o n y m o u s   u s e r s   t o   i n s e r t   i n q u i r i e s  
 C R E A T E   P O L I C Y   " A l l o w   a n o n y m o u s   i n s e r t s   t o   d e v e l o p e r _ w e b s i t e _ i n q u i r i e s "  
         O N   d e v e l o p e r _ w e b s i t e _ i n q u i r i e s  
         F O R   I N S E R T  
         T O   a n o n  
         W I T H   C H E C K   ( t r u e ) ;  
  
 - -   A l l o w   a u t h e n t i c a t e d   u s e r s   ( a d m i n s )   t o   v i e w   a l l   i n q u i r i e s  
 C R E A T E   P O L I C Y   " A l l o w   a u t h e n t i c a t e d   u s e r s   f u l l   a c c e s s   o n   d e v e l o p e r _ w e b s i t e _ i n q u i r i e s "  
         O N   d e v e l o p e r _ w e b s i t e _ i n q u i r i e s  
         F O R   A L L  
         T O   a u t h e n t i c a t e d  
         U S I N G   ( t r u e )  
         W I T H   C H E C K   ( t r u e ) ;  
  
 - -   A d d   t r i g g e r   f o r   u p d a t e d _ a t  
 D R O P   T R I G G E R   I F   E X I S T S   u p d a t e _ d e v _ w e b _ i n q u i r i e s _ u p d a t e d _ a t   O N   d e v e l o p e r _ w e b s i t e _ i n q u i r i e s ;  
 C R E A T E   T R I G G E R   u p d a t e _ d e v _ w e b _ i n q u i r i e s _ u p d a t e d _ a t  
         B E F O R E   U P D A T E   O N   d e v e l o p e r _ w e b s i t e _ i n q u i r i e s  
         F O R   E A C H   R O W  
         E X E C U T E   F U N C T I O N   u p d a t e _ u p d a t e d _ a t _ c o l u m n ( ) ;  
 - -   = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =  
 - -   D e v e l o p e r   W e b s i t e   P a c k a g e s   T a b l e  
 - -   S t o r e s   t h e   p r i c i n g   p a c k a g e s   f o r   D e v e l o p e r   W e b s i t e s  
 - -   = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =  
 C R E A T E   T A B L E   I F   N O T   E X I S T S   d e v e l o p e r _ w e b s i t e _ p a c k a g e s   (  
         i d   U U I D   D E F A U L T   u u i d _ g e n e r a t e _ v 4 ( )   P R I M A R Y   K E Y ,  
         s l u g   V A R C H A R ( 5 0 )   N O T   N U L L   U N I Q U E ,   - -   e . g . ,   ' s t a r t e r ' ,   ' g r o w t h '  
         n a m e   V A R C H A R ( 1 0 0 )   N O T   N U L L ,  
         t a g l i n e   V A R C H A R ( 2 5 5 ) ,  
         p r i c e _ l a b e l   V A R C H A R ( 5 0 ) ,  
         p r i c e   V A R C H A R ( 5 0 ) ,   - -   S t o r i n g   a s   s t r i n g   t o   i n c l u d e   c u r r e n c y   s y m b o l   i f   n e e d e d ,   o r   u s e   D E C I M A L  
         p r i c e _ n o t e   V A R C H A R ( 1 0 0 ) ,  
         i d e a l _ f o r   T E X T ,  
         i s _ p o p u l a r   B O O L E A N   D E F A U L T   F A L S E ,  
         d i s p l a y _ o r d e r   I N T E G E R   D E F A U L T   0 ,  
         i s _ a c t i v e   B O O L E A N   D E F A U L T   T R U E ,  
         c r e a t e d _ a t   T I M E S T A M P   W I T H   T I M E   Z O N E   D E F A U L T   N O W ( ) ,  
         u p d a t e d _ a t   T I M E S T A M P   W I T H   T I M E   Z O N E   D E F A U L T   N O W ( )  
 ) ;  
  
 - -   = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =  
 - -   D e v e l o p e r   P a c k a g e   F e a t u r e s   T a b l e  
 - -   S t o r e s   t h e   f e a t u r e s   l i s t   f o r   e a c h   p a c k a g e  
 - -   = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =  
 C R E A T E   T A B L E   I F   N O T   E X I S T S   d e v e l o p e r _ p a c k a g e _ f e a t u r e s   (  
         i d   U U I D   D E F A U L T   u u i d _ g e n e r a t e _ v 4 ( )   P R I M A R Y   K E Y ,  
         p a c k a g e _ i d   U U I D   R E F E R E N C E S   d e v e l o p e r _ w e b s i t e _ p a c k a g e s ( i d )   O N   D E L E T E   C A S C A D E ,  
         f e a t u r e _ t e x t   V A R C H A R ( 2 5 5 )   N O T   N U L L ,  
         d i s p l a y _ o r d e r   I N T E G E R   D E F A U L T   0 ,  
         c r e a t e d _ a t   T I M E S T A M P   W I T H   T I M E   Z O N E   D E F A U L T   N O W ( )  
 ) ;  
  
 - -   E n a b l e   R L S  
 A L T E R   T A B L E   d e v e l o p e r _ w e b s i t e _ p a c k a g e s   E N A B L E   R O W   L E V E L   S E C U R I T Y ;  
 A L T E R   T A B L E   d e v e l o p e r _ p a c k a g e _ f e a t u r e s   E N A B L E   R O W   L E V E L   S E C U R I T Y ;  
  
 - -   P o l i c i e s  
 - -   A l l o w   a n o n y m o u s   r e a d   a c c e s s   ( s o   t h e   w e b s i t e   c a n   d i s p l a y   t h e m )  
 C R E A T E   P O L I C Y   " A l l o w   a n o n y m o u s   r e a d s   o n   d e v e l o p e r _ w e b s i t e _ p a c k a g e s "  
         O N   d e v e l o p e r _ w e b s i t e _ p a c k a g e s  
         F O R   S E L E C T  
         T O   a n o n  
         U S I N G   ( i s _ a c t i v e   =   t r u e ) ;  
  
 C R E A T E   P O L I C Y   " A l l o w   a n o n y m o u s   r e a d s   o n   d e v e l o p e r _ p a c k a g e _ f e a t u r e s "  
         O N   d e v e l o p e r _ p a c k a g e _ f e a t u r e s  
         F O R   S E L E C T  
         T O   a n o n  
         U S I N G   ( t r u e ) ;  
  
 - -   A l l o w   a u t h e n t i c a t e d   ( a d m i n )   f u l l   a c c e s s  
 C R E A T E   P O L I C Y   " A l l o w   a u t h e n t i c a t e d   f u l l   a c c e s s   o n   d e v e l o p e r _ w e b s i t e _ p a c k a g e s "  
         O N   d e v e l o p e r _ w e b s i t e _ p a c k a g e s  
         F O R   A L L  
         T O   a u t h e n t i c a t e d  
         U S I N G   ( t r u e )  
         W I T H   C H E C K   ( t r u e ) ;  
  
 C R E A T E   P O L I C Y   " A l l o w   a u t h e n t i c a t e d   f u l l   a c c e s s   o n   d e v e l o p e r _ p a c k a g e _ f e a t u r e s "  
         O N   d e v e l o p e r _ p a c k a g e _ f e a t u r e s  
         F O R   A L L  
         T O   a u t h e n t i c a t e d  
         U S I N G   ( t r u e )  
         W I T H   C H E C K   ( t r u e ) ;  
  
 - -   T r i g g e r   f o r   u p d a t e d _ a t  
 D R O P   T R I G G E R   I F   E X I S T S   u p d a t e _ d e v _ w e b _ p k g s _ u p d a t e d _ a t   O N   d e v e l o p e r _ w e b s i t e _ p a c k a g e s ;  
 C R E A T E   T R I G G E R   u p d a t e _ d e v _ w e b _ p k g s _ u p d a t e d _ a t  
         B E F O R E   U P D A T E   O N   d e v e l o p e r _ w e b s i t e _ p a c k a g e s  
         F O R   E A C H   R O W  
         E X E C U T E   F U N C T I O N   u p d a t e _ u p d a t e d _ a t _ c o l u m n ( ) ;  
  
 - -   = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =  
 - -   S e e d   D a t a   ( F r o m   c u r r e n t   h a r d c o d e d   v a l u e s )  
 - -   = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =  
 D O   $ $  
 D E C L A R E  
         s t a r t e r _ i d   U U I D ;  
         g r o w t h _ i d   U U I D ;  
         e n t e r p r i s e _ i d   U U I D ;  
 B E G I N  
         - -   I n s e r t   P a c k a g e s  
         I N S E R T   I N T O   d e v e l o p e r _ w e b s i t e _ p a c k a g e s   ( s l u g ,   n a m e ,   t a g l i n e ,   p r i c e _ l a b e l ,   p r i c e ,   p r i c e _ n o t e ,   i d e a l _ f o r ,   i s _ p o p u l a r ,   d i s p l a y _ o r d e r )  
         V A L U E S    
         ( ' s t a r t e r ' ,   ' S t a r t e r   P r o j e c t   S i t e ' ,   ' P e r f e c t   f o r   s i n g l e   p r o j e c t   l a u n c h e s ' ,   ' O n e - t i m e   f r o m ' ,   ' â  ¹ 4 9 , 9 9 9 ' ,   ' +   â  ¹ 2 , 9 9 9 / m o   h o s t i n g ' ,   ' N e w   p r o p e r t y   l a u n c h e s ,   i n d i v i d u a l   p r o j e c t   m i c r o s i t e s ,   a n d   b u i l d e r s   t e s t i n g   d i g i t a l   m a r k e t i n g . ' ,   f a l s e ,   1 )  
         R E T U R N I N G   i d   I N T O   s t a r t e r _ i d ;  
  
         I N S E R T   I N T O   d e v e l o p e r _ w e b s i t e _ p a c k a g e s   ( s l u g ,   n a m e ,   t a g l i n e ,   p r i c e _ l a b e l ,   p r i c e ,   p r i c e _ n o t e ,   i d e a l _ f o r ,   i s _ p o p u l a r ,   d i s p l a y _ o r d e r )  
         V A L U E S    
         ( ' g r o w t h ' ,   ' G r o w t h   M u l t i - P r o j e c t   S i t e ' ,   ' S c a l e   y o u r   d i g i t a l   p r e s e n c e ' ,   ' O n e - t i m e   f r o m ' ,   ' â  ¹ 1 , 4 9 , 9 9 9 ' ,   ' +   â  ¹ 5 , 9 9 9 / m o   h o s t i n g ' ,   ' G r o w i n g   d e v e l o p e r s   w i t h   m u l t i p l e   o n g o i n g   p r o j e c t s   w h o   n e e d   a   c e n t r a l i z e d   d i g i t a l   h u b . ' ,   t r u e ,   2 )  
         R E T U R N I N G   i d   I N T O   g r o w t h _ i d ;  
  
         I N S E R T   I N T O   d e v e l o p e r _ w e b s i t e _ p a c k a g e s   ( s l u g ,   n a m e ,   t a g l i n e ,   p r i c e _ l a b e l ,   p r i c e ,   p r i c e _ n o t e ,   i d e a l _ f o r ,   i s _ p o p u l a r ,   d i s p l a y _ o r d e r )  
         V A L U E S    
         ( ' e n t e r p r i s e ' ,   ' E n t e r p r i s e   D e v e l o p e r   S u i t e ' ,   ' C o m p l e t e   d i g i t a l   t r a n s f o r m a t i o n ' ,   ' C u s t o m   p r i c i n g   f r o m ' ,   ' â  ¹ 3 , 9 9 , 9 9 9 ' ,   ' +   c u s t o m   h o s t i n g   S L A ' ,   ' L a r g e   d e v e l o p e r s   a n d   b u i l d e r s   w i t h   m u l t i - c i t y   p o r t f o l i o s   r e q u i r i n g   e n t e r p r i s e - g r a d e   s o l u t i o n s . ' ,   f a l s e ,   3 )  
         R E T U R N I N G   i d   I N T O   e n t e r p r i s e _ i d ;  
  
         - -   I n s e r t   F e a t u r e s   f o r   S t a r t e r  
         I N S E R T   I N T O   d e v e l o p e r _ p a c k a g e _ f e a t u r e s   ( p a c k a g e _ i d ,   f e a t u r e _ t e x t ,   d i s p l a y _ o r d e r )   V A L U E S  
         ( s t a r t e r _ i d ,   ' S i n g l e   p r o j e c t   l a n d i n g   p a g e ' ,   1 ) ,  
         ( s t a r t e r _ i d ,   ' P r o j e c t   o v e r v i e w   &   h i g h l i g h t s ' ,   2 ) ,  
         ( s t a r t e r _ i d ,   ' I n t e r a c t i v e   l o c a t i o n   m a p ' ,   3 ) ,  
         ( s t a r t e r _ i d ,   ' I m a g e   g a l l e r y   w i t h   l i g h t b o x ' ,   4 ) ,  
         ( s t a r t e r _ i d ,   ' L e a d   c a p t u r e   f o r m   w i t h   e m a i l   a l e r t s ' ,   5 ) ,  
         ( s t a r t e r _ i d ,   ' B a s i c   a n a l y t i c s   d a s h b o a r d ' ,   6 ) ,  
         ( s t a r t e r _ i d ,   ' M o b i l e - r e s p o n s i v e   d e s i g n ' ,   7 ) ,  
         ( s t a r t e r _ i d ,   ' S S L   s e c u r i t y   c e r t i f i c a t e ' ,   8 ) ;  
  
         - -   I n s e r t   F e a t u r e s   f o r   G r o w t h  
         I N S E R T   I N T O   d e v e l o p e r _ p a c k a g e _ f e a t u r e s   ( p a c k a g e _ i d ,   f e a t u r e _ t e x t ,   d i s p l a y _ o r d e r )   V A L U E S  
         ( g r o w t h _ i d ,   ' M u l t i - p r o j e c t   p a g e s   ( u p   t o   1 0 ) ' ,   1 ) ,  
         ( g r o w t h _ i d ,   ' P r o p e r t y   l i s t i n g   g r i d   w i t h   f i l t e r s ' ,   2 ) ,  
         ( g r o w t h _ i d ,   ' B l o g / n e w s   s e c t i o n   f o r   u p d a t e s ' ,   3 ) ,  
         ( g r o w t h _ i d ,   ' A d v a n c e d   S E O   s e t u p   &   o p t i m i z a t i o n ' ,   4 ) ,  
         ( g r o w t h _ i d ,   ' C R M / l e a d   i n t e g r a t i o n   h o o k s ' ,   5 ) ,  
         ( g r o w t h _ i d ,   ' V i r t u a l   t o u r   e m b e d d i n g ' ,   6 ) ,  
         ( g r o w t h _ i d ,   ' S o c i a l   m e d i a   i n t e g r a t i o n ' ,   7 ) ,  
         ( g r o w t h _ i d ,   ' P r i o r i t y   e m a i l   s u p p o r t ' ,   8 ) ;  
  
         - -   I n s e r t   F e a t u r e s   f o r   E n t e r p r i s e  
         I N S E R T   I N T O   d e v e l o p e r _ p a c k a g e _ f e a t u r e s   ( p a c k a g e _ i d ,   f e a t u r e _ t e x t ,   d i s p l a y _ o r d e r )   V A L U E S  
         ( e n t e r p r i s e _ i d ,   ' C u s t o m   d e s i g n   s y s t e m   &   b r a n d i n g ' ,   1 ) ,  
         ( e n t e r p r i s e _ i d ,   ' U n l i m i t e d   p r o j e c t   p a g e s ' ,   2 ) ,  
         ( e n t e r p r i s e _ i d ,   ' M u l t i - c i t y   p o r t f o l i o   m a n a g e m e n t ' ,   3 ) ,  
         ( e n t e r p r i s e _ i d ,   ' C R M   &   m a r k e t i n g   t o o l   i n t e g r a t i o n s ' ,   4 ) ,  
         ( e n t e r p r i s e _ i d ,   ' D e d i c a t e d   a c c o u n t   m a n a g e r ' ,   5 ) ,  
         ( e n t e r p r i s e _ i d ,   ' S L A - b a c k e d   h o s t i n g   ( 9 9 . 9 %   u p t i m e ) ' ,   6 ) ,  
         ( e n t e r p r i s e _ i d ,   ' 2 4 / 7   p r i o r i t y   s u p p o r t ' ,   7 ) ,  
         ( e n t e r p r i s e _ i d ,   ' A d v a n c e d   a n a l y t i c s   &   r e p o r t i n g ' ,   8 ) ;  
  
 E N D   $ $ ;  
 