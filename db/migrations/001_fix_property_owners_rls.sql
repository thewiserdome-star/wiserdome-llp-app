-- Migration: Fix property_owners RLS Policies
-- 
-- This migration fixes the following issues:
-- 1. Infinite recursion in "Allow owners to read own data" policy (PGRST 500 errors)
-- 2. The policy had a self-referencing SELECT in the USING clause
-- 3. The owner_properties policy could also trigger recursion when querying property_owners
-- 4. Admin users not seeing all property_owners records in admin dashboard
--
-- Changes:
-- - Drop the broken "Allow owners to read own data" policy
-- - Create a safe owner SELECT policy that:
--   a) Allows owner to SELECT their row if user_id matches auth.uid()
--   b) Allows access if JWT email claim matches the row's email
-- - Update owner_properties policy to avoid recursion issues
-- - Ensure "Allow authenticated users full access" policy exists for admin-level access
--   (This is critical - without it, admins can only see their own records)
--
-- Note: The user_id column in property_owners is UUID type (REFERENCES auth.users(id))
--
-- To apply this migration:
-- 1. Run in Supabase SQL Editor or via psql
-- 2. Test with curl using an authenticated JWT to verify no recursion errors
-- 3. Login to /admin and verify you can see all property_owners records
--

-- ============================================
-- Step 1: Drop the broken policy
-- ============================================

-- Drop the policy that causes infinite recursion
-- The issue: It had "SELECT email FROM property_owners WHERE id = property_owners.id"
-- which creates a self-referencing query during policy evaluation
DROP POLICY IF EXISTS "Allow owners to read own data" ON property_owners;

-- ============================================
-- Step 2: Create safe owner SELECT policy
-- ============================================

-- This policy allows:
-- 1. Users to read their own row if user_id = auth.uid() (direct UUID comparison)
-- 2. Users to read a row if their JWT email claim matches the row's email
--    (This is a fallback for cases where user_id is NULL but email is known)
--
-- Note: We use current_setting('request.jwt.claims', true)::json->>'email' to get
-- the email from JWT claims in a safe way that returns NULL if not available
CREATE POLICY "Allow owners to read own data"
    ON property_owners
    FOR SELECT
    TO authenticated
    USING (
        -- Match by user_id (UUID type)
        user_id = auth.uid()
        OR
        -- Match by email from JWT claims (case-insensitive comparison)
        LOWER(email) = LOWER(
            (current_setting('request.jwt.claims', true)::json->>'email')
        )
    );

-- ============================================
-- Step 3: Fix owner_properties policy
-- ============================================

-- Drop and recreate the owner_properties policy to include email matching
-- This ensures owners can access their properties even if user_id is not linked
DROP POLICY IF EXISTS "Allow owners to read own properties" ON owner_properties;

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

-- ============================================
-- Step 4: Ensure admin full access on owner_properties
-- ============================================

-- This policy ensures authenticated users (admins) have full CRUD access to all
-- owner_properties records. Without this policy, admins could not manage properties.
--
-- Drop and recreate to ensure consistency
DROP POLICY IF EXISTS "Allow authenticated users full access on owner_properties" ON owner_properties;

CREATE POLICY "Allow authenticated users full access on owner_properties"
    ON owner_properties
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- ============================================
-- Step 5: Ensure admin full access on property_owners
-- ============================================

-- This policy ensures authenticated users (admins) have full CRUD access to all
-- property_owners records. This is critical for the admin dashboard to work correctly.
-- Without this policy, admins would only see their own records due to the 
-- "Allow owners to read own data" policy.
--
-- Drop and recreate to ensure consistency
DROP POLICY IF EXISTS "Allow authenticated users full access on property_owners" ON property_owners;

CREATE POLICY "Allow authenticated users full access on property_owners"
    ON property_owners
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- ============================================
-- Notes on security
-- ============================================

-- The "Allow authenticated users full access on property_owners" policy
-- with USING(true) WITH CHECK(true) provides admin-level access to all authenticated
-- users. This is appropriate for small teams where all authenticated users are admins.
--
-- In a production environment with multiple user roles, consider replacing this 
-- with a more restrictive admin policy that checks user role:
--
-- Example (requires role metadata in JWT or a separate admin_users table):
-- CREATE POLICY "Allow admin full access on property_owners"
--     ON property_owners
--     FOR ALL
--     TO authenticated
--     USING (
--         (current_setting('request.jwt.claims', true)::json->>'role') = 'admin'
--     )
--     WITH CHECK (
--         (current_setting('request.jwt.claims', true)::json->>'role') = 'admin'
--     );

-- ============================================
-- Verification queries (run manually to test)
-- ============================================

-- After applying this migration, test with:
--
-- 1. Check policies on property_owners:
--    SELECT policyname, cmd, qual FROM pg_policies WHERE tablename = 'property_owners';
--
-- 2. Test SELECT as authenticated user (should not cause recursion):
--    curl -X GET 'https://<project>.supabase.co/rest/v1/property_owners' \
--      -H "apikey: <anon-key>" \
--      -H "Authorization: Bearer <access-token>"
--
-- 3. Test fetching by email (should return array, possibly empty):
--    curl -X GET 'https://<project>.supabase.co/rest/v1/property_owners?email=eq.test@example.com' \
--      -H "apikey: <anon-key>" \
--      -H "Authorization: Bearer <access-token>"
