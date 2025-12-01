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
    ('Rental Management', 'End-to-end tenant management', 'Finding the right tenant is just the beginning. We handle the entire lifecycle of tenancy so you don''t have to deal with late night calls or payment follow-ups.', '🏠', 1),
    ('Maintenance & Repairs', 'Keep your property in showroom condition', 'We coordinate all repairs with trusted local vendors and supervise the work.', '🔧', 2),
    ('Legal & Documentation', 'Navigate Indian property laws with ease', 'Our legal experts ensure your property is compliant and secure.', '📋', 3),
    ('Resale & Renovation', 'Upgrade or sell your property', 'Whether you want to upgrade your home or sell it for the best price, we act as your ground team.', '🏗️', 4);

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
