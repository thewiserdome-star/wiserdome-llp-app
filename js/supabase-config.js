/**
 * Supabase Configuration
 * 
 * This module initializes the Supabase client for the Wiserdome application.
 * 
 * SETUP INSTRUCTIONS:
 * 1. Create a Supabase project at https://supabase.com
 * 2. Get your project URL and anon key from Settings > API
 * 3. Replace the placeholder values below with your actual credentials
 * 
 * SECURITY NOTE:
 * The anon key is safe to expose in the browser as it only allows
 * access based on your Row Level Security (RLS) policies.
 * 
 * For production deployments, consider using a build process to inject
 * environment variables or a separate configuration file that is not
 * committed to version control.
 */

// Supabase Configuration
// Replace these placeholders with your actual Supabase project credentials
// For production, consider using environment variables or a build process
const SUPABASE_URL = 'YOUR_SUPABASE_URL'; // e.g., 'https://your-project.supabase.co'
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY'; // e.g., 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'

// Check if Supabase credentials are configured
function isSupabaseConfigured() {
    return SUPABASE_URL !== 'YOUR_SUPABASE_URL' && 
           SUPABASE_ANON_KEY !== 'YOUR_SUPABASE_ANON_KEY';
}

// Initialize Supabase client (loaded via CDN in HTML)
let supabaseClient = null;

function initSupabase() {
    if (!isSupabaseConfigured()) {
        console.warn('Supabase is not configured. Please update js/supabase-config.js with your credentials.');
        return null;
    }
    
    if (typeof supabase !== 'undefined' && supabase.createClient) {
        supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        console.log('Supabase client initialized successfully');
        return supabaseClient;
    } else {
        console.error('Supabase library not loaded. Make sure to include the CDN script.');
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
    init: initSupabase,
    getClient: getSupabaseClient
};
