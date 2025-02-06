import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ayzkwwgwkbsbxdkloide.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF5emt2d2d3a2JzYnhka2xvaWRlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzcxMjc4MTEsImV4cCI6MjA1MjcwMzgxMX0.ZaEINeBxbB7nTXasUuG6ixSQKk2LN8IzGpRdAG2e5fA';

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});
