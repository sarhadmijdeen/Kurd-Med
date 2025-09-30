
import { createClient } from '@supabase/supabase-js';

// User's Supabase credentials have been inserted here.
const supabaseUrl = 'https://bhqlsmtbhemoeyismhlf.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJocWxzbXRiaGVtb2V5aXNtaGxmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkyMjgxNTUsImV4cCI6MjA3NDgwNDE1NX0.s5sIZT0Hh59Z6sqp9sdH1q_4z04Ng62IwoFeZcdXMgA';

// This check determines if the Supabase client should be mocked.
// If you clear the values above, the app will fall back to a mock service.
const areKeysMissing = !supabaseUrl || !supabaseAnonKey;

// Create a mock client if keys are missing to prevent the app from crashing.
const mockSupabase = {
  auth: {
    getSession: () => Promise.resolve({ data: { session: null }, error: null }),
    onAuthStateChange: (_callback: any) => {
      // Return a mock subscription that does nothing
      return {
        data: { subscription: { unsubscribe: () => {} } },
        error: null,
      };
    },
    signOut: () => Promise.resolve({ error: null }),
    signInWithOAuth: () => Promise.resolve({ 
        data: null, 
        error: { message: "Supabase credentials are not configured. Please update services/supabaseClient.ts." }
    }),
  },
};

if (areKeysMissing) {
    console.warn("Supabase URL and Anon Key are not configured. Authentication will be disabled. Please update services/supabaseClient.ts.");
}

// Export the real client if keys are provided, otherwise export the mock client.
// The 'as any' is used here to bridge the type difference between the real and mock clients for development purposes.
export const supabase = areKeysMissing ? mockSupabase as any : createClient(supabaseUrl, supabaseAnonKey);
