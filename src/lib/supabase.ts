import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
// Using direct values from project configuration
const supabaseUrl = 'https://rulecbxokfrwbgzoaljn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ1bGVjYnhva2Zyd2Jnem9hbGpuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA2NTExNTksImV4cCI6MjA2NjIyNzE1OX0.eKQiWlJvyNhnUOSE9wcFX7xxDAxml2-k9coONDrpi-g';

const supabase = createClient(supabaseUrl, supabaseKey);

// Export the client and config values for use in components
export { supabase, supabaseUrl, supabaseKey };