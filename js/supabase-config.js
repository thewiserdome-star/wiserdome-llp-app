/**
 * Supabase Configuration
 * 
 * This module initializes the Supabase client for the Wiserdome application.
 * 
 * SETUP INSTRUCTIONS:
 * 
 * Option 1: Cloudflare Pages (Recommended for Production)
 * 1. Go to Cloudflare Pages dashboard > Your project > Settings > Environment variables
 * 2. Add SUPABASE_URL and SUPABASE_ANON_KEY as environment variables
 * 3. Set build command to: npm run build
 * 4. Deploy your site
 * 
 * Option 2: Local Development
 * 1. Create a .env file in the root directory with:
 *    SUPABASE_URL=https://your-project.supabase.co
 *    SUPABASE_ANON_KEY=your-anon-key
 * 2. Run: npm run build
 * 
 * Option 3: Manual Configuration (Not Recommended)
 * 1. Update the fallback values below with your credentials
 * 
 * SECURITY NOTE:
 * The anon key is safe to expose in the browser as it only allows
 * access based on your Row Level Security (RLS) policies.
 */

// Get Supabase credentials from environment config (generated during build) or use fallbacks
const SUPABASE_URL = window.ENV_CONFIG?.SUPABASE_URL || 'https://tvijjwcetyxmosfleggl.supabase.co';
const SUPABASE_ANON_KEY = window.ENV_CONFIG?.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR2aWpqd2NldHl4bW9zZmxlZ2dsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ1NTM3NjYsImV4cCI6MjA4MDEyOTc2Nn0.MnqtE2ZLJiedvcNB1FkZI6COKw-e10HvD1LeUkb02Ek';

// Check if Supabase credentials are configured
function isSupabaseConfigured() {
    return SUPABASE_URL !== 'YOUR_SUPABASE_URL' && 
           SUPABASE_ANON_KEY !== 'YOUR_SUPABASE_ANON_KEY';
}

// Get configuration status for debugging
function getConfigurationStatus() {
    const urlConfigured = SUPABASE_URL !== 'https://tvijjwcetyxmosfleggl.supabase.co';
    const keyConfigured = SUPABASE_ANON_KEY !== 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR2aWpqd2NldHl4bW9zZmxlZ2dsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ1NTM3NjYsImV4cCI6MjA4MDEyOTc2Nn0.MnqtE2ZLJiedvcNB1FkZI6COKw-e10HvD1LeUkb02Ek';
    
    return {
        isConfigured: urlConfigured && keyConfigured,
        urlConfigured,
        keyConfigured,
        message: !urlConfigured && !keyConfigured 
            ? 'Supabase URL and Anon Key are not configured. Please update js/supabase-config.js with your Supabase credentials.'
            : !urlConfigured 
                ? 'Supabase URL is not configured.'
                : !keyConfigured 
                    ? 'Supabase Anon Key is not configured.'
                    : 'Supabase is configured.'
    };
}

// Initialize Supabase client (loaded via CDN in HTML)
let supabaseClient = null;

function initSupabase() {
    const status = getConfigurationStatus();
    
    if (!status.isConfigured) {
        console.warn('[Supabase Config]', status.message);
        console.warn('[Supabase Config] Form submissions will be logged to console but not saved to database.');
        return null;
    }
    
    if (typeof supabase !== 'undefined' && supabase.createClient) {
        try {
            supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
            console.log('[Supabase Config] Client initialized successfully');
            return supabaseClient;
        } catch (error) {
            console.error('[Supabase Config] Failed to create client:', error.message);
            return null;
        }
    } else {
        console.error('[Supabase Config] Supabase library not loaded. Make sure to include the CDN script before supabase-config.js.');
        return null;
    }
}

function getSupabaseClient() {
    if (!supabaseClient) {
        return initSupabase();
    }
    return supabaseClient;
}

// Export for use in other modules
window.SupabaseConfig = {
    isConfigured: isSupabaseConfigured,
    getConfigurationStatus: getConfigurationStatus,
    init: initSupabase,
    getClient: getSupabaseClient
};
