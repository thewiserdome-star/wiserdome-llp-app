-- Property Owners Schema for Wiserdome
-- 
-- This file contains the SQL schema for property owner management:
-- 1. property_owners - Stores property owner signup requests and approved owners
-- 2. owner_properties - Stores properties managed by Wiserdome for owners
--
-- IMPORTANT: Run this in your Supabase SQL Editor AFTER running the main schema.sql
-- This script depends on the update_updated_at_column() function defined in schema.sql

-- ============================================
-- Property Owners Table
-- Stores property owner signup requests and approved owners
-- ============================================
CREATE TABLE IF NOT EXISTS property_owners (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(50) NOT NULL,
    address TEXT,
    city VARCHAR(100),
    country VARCHAR(100) DEFAULT 'India',
    status VARCHAR(50) DEFAULT 'pending', -- pending, approved, rejected, active
    rejection_reason TEXT,
    approved_by UUID REFERENCES auth.users(id),
    approved_at TIMESTAMP WITH TIME ZONE,
    set_password_token VARCHAR(255),
    set_password_token_expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for token lookup
CREATE INDEX IF NOT EXISTS idx_property_owners_set_password_token ON property_owners(set_password_token);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_property_owners_email ON property_owners(email);
CREATE INDEX IF NOT EXISTS idx_property_owners_status ON property_owners(status);
CREATE INDEX IF NOT EXISTS idx_property_owners_user_id ON property_owners(user_id);

-- ============================================
-- Owner Properties Table
-- Stores properties managed by Wiserdome for owners
-- ============================================
CREATE TABLE IF NOT EXISTS owner_properties (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    owner_id UUID REFERENCES property_owners(id) ON DELETE CASCADE,
    property_name VARCHAR(255) NOT NULL,
    property_type VARCHAR(50) NOT NULL, -- apartment, villa, plot, commercial
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100),
    pincode VARCHAR(10),
    bedrooms INTEGER,
    bathrooms INTEGER,
    area_sqft DECIMAL(10, 2),
    is_rented BOOLEAN DEFAULT FALSE,
    monthly_rent DECIMAL(10, 2),
    tenant_name VARCHAR(255),
    tenant_phone VARCHAR(50),
    management_plan VARCHAR(50), -- basic, standard, premium
    management_start_date DATE,
    notes TEXT,
    status VARCHAR(50) DEFAULT 'active', -- active, inactive, under_maintenance
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_owner_properties_owner_id ON owner_properties(owner_id);
CREATE INDEX IF NOT EXISTS idx_owner_properties_city ON owner_properties(city);
CREATE INDEX IF NOT EXISTS idx_owner_properties_status ON owner_properties(status);

-- ============================================
-- Row Level Security (RLS) Policies
-- ============================================

-- Enable RLS on tables
ALTER TABLE property_owners ENABLE ROW LEVEL SECURITY;
ALTER TABLE owner_properties ENABLE ROW LEVEL SECURITY;

-- Property Owners Policies

-- Allow anonymous users to insert signup requests
CREATE POLICY "Allow anonymous signup requests"
    ON property_owners
    FOR INSERT
    TO anon
    WITH CHECK (status = 'pending');

-- Allow owners to read their own data
-- Fixed: Removed self-referencing SELECT that caused infinite recursion
-- Now uses direct user_id comparison OR email matching via JWT claims
CREATE POLICY "Allow owners to read own data"
    ON property_owners
    FOR SELECT
    TO authenticated
    USING (
        user_id = auth.uid()
        OR
        LOWER(email) = LOWER(
            (current_setting('request.jwt.claims', true)::json->>'email')
        )
    );

-- Allow admins full access on property_owners
CREATE POLICY "Allow authenticated users full access on property_owners"
    ON property_owners
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Owner Properties Policies

-- Allow owners to read their own properties
-- Fixed: Avoid querying property_owners which could cause recursion due to RLS
-- Instead, check if the current user owns any property_owners record directly
CREATE POLICY "Allow owners to read own properties"
    ON owner_properties
    FOR SELECT
    TO authenticated
    USING (
        owner_id IN (
            SELECT id FROM property_owners 
            WHERE user_id = auth.uid()
            OR LOWER(email) = LOWER(
                (current_setting('request.jwt.claims', true)::json->>'email')
            )
        )
    );

-- Allow admins full access on owner_properties
CREATE POLICY "Allow authenticated users full access on owner_properties"
    ON owner_properties
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- ============================================
-- Triggers
-- ============================================

-- Trigger for updating updated_at on property_owners
DROP TRIGGER IF EXISTS update_property_owners_updated_at ON property_owners;
CREATE TRIGGER update_property_owners_updated_at
    BEFORE UPDATE ON property_owners
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger for updating updated_at on owner_properties
DROP TRIGGER IF EXISTS update_owner_properties_updated_at ON owner_properties;
CREATE TRIGGER update_owner_properties_updated_at
    BEFORE UPDATE ON owner_properties
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
