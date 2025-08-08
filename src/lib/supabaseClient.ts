import { createClient } from '@supabase/supabase-js';

// It's good practice to import the type for better autocompletion and type safety
// You might need to generate your types first if you have a custom schema
// `supabase gen types typescript --local > src/types/supabase.ts`
// import { Database } from '../types/supabase';

// const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseUrl = "https://oqisybajiiosxvpiuisb.supabase.co";
// const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9xaXN5YmFqaWlvc3h2cGl1aXNiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0MjI4MzMsImV4cCI6MjA2OTk5ODgzM30.aoN6PvcEjoo9pTxerPHpERWiUDmL63rhnKvbmezB08A";

// The createClient function is generic and can be typed with your database schema
// If you don't have a custom schema, you can use `any` or leave it untyped for now.
export const supabase = createClient(supabaseUrl, supabaseAnonKey);